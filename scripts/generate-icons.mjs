import { execSync } from "node:child_process";
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const srcDir = path.join(projectRoot, "src");
const assetsIconsDir = path.join(srcDir, "assets", "icons");
const componentsIconsDir = path.join(srcDir, "components", "icons");

const toPosix = (value) => value.split(path.sep).join("/");

const pascalCase = (value) =>
  value
    .replace(/\.svg$/i, "")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

const getVariantInfo = (name) => {
  const withoutExt = name.replace(/\.svg$/i, "");
  const match = withoutExt.match(/^(.*?)(?:[-_]?)(light|dark)$/i);

  if (!match) return null;

  const [, baseRaw, modeRaw] = match;
  if (!baseRaw) return null;

  return {
    baseRaw,
    mode: modeRaw.toLowerCase(),
    componentName: pascalCase(withoutExt),
    wrapperName: pascalCase(baseRaw),
  };
};

const listSvgFiles = async (dir, base = "") => {
  const entries = await readdir(path.join(dir, base), { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relPath = path.join(base, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listSvgFiles(dir, relPath)));
      continue;
    }

    if (entry.isFile() && /\.svg$/i.test(entry.name)) {
      files.push(relPath);
    }
  }

  return files;
};

const createWrapper = ({ outputDir, wrapperName, lightComponent, darkComponent }) => {
  const hookTarget = path.join(srcDir, "hooks", "useSystemAppearance");
  const relativeHookImport = toPosix(path.relative(outputDir, hookTarget)).replace(/\.tsx?$/, "");

  return `import type { ComponentType, CSSProperties, SVGProps } from "react";
import { useSystemAppearance, type SystemAppearance } from "${relativeHookImport}";
import ${darkComponent} from "./${darkComponent}";
import ${lightComponent} from "./${lightComponent}";

type ${wrapperName}Mode = SystemAppearance | "system";

type ${wrapperName}Props = Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
  mode?: ${wrapperName}Mode;
  width?: number | string;
  height?: number | string;
};

const ${wrapperName} = ({
  mode = "system",
  width,
  height,
  style,
  ...rest
}: ${wrapperName}Props) => {
  const systemAppearance = useSystemAppearance();
  const resolvedMode = mode === "system" ? systemAppearance : mode;
  const IconComponent: ComponentType<SVGProps<SVGSVGElement>> =
    (resolvedMode === "light" ? ${lightComponent} : ${darkComponent}) as ComponentType<SVGProps<SVGSVGElement>>;

  const mergedStyle: CSSProperties = {
    ...style,
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  };

  return <IconComponent style={mergedStyle} {...rest} />;
};

export default ${wrapperName};
`;
};

const fileExists = async (targetPath) => {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
};

const removeStaleGeneratedIndexes = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await removeStaleGeneratedIndexes(entryPath);
      continue;
    }

    if (entry.name !== "index.tsx") continue;

    const content = await readFile(entryPath, "utf8");
    const isGenerated = content.includes("const IconComponent = resolvedMode === \"light\"");

    if (isGenerated) {
      await rm(entryPath);
    }
  }
};

const run = async () => {
  await mkdir(componentsIconsDir, { recursive: true });

  execSync(
    "yarn svgr --no-index --typescript --filename-case pascal --no-dimensions --no-svgo --template scripts/svgr.template.cjs --out-dir src/components/icons -- src/assets/icons",
    {
      cwd: projectRoot,
      stdio: "inherit",
    },
  );

  await removeStaleGeneratedIndexes(componentsIconsDir);

  const svgFiles = await listSvgFiles(assetsIconsDir);
  const byDir = new Map();

  for (const relPath of svgFiles) {
    const relDir = path.dirname(relPath);
    const key = relDir === "." ? "" : relDir;

    if (!byDir.has(key)) byDir.set(key, []);
    byDir.get(key).push(path.basename(relPath));
  }

  for (const [relDir, names] of byDir.entries()) {
    const variantsByBase = new Map();

    for (const name of names) {
      const info = getVariantInfo(name);
      if (!info) continue;

      const baseKey = info.wrapperName;
      if (!variantsByBase.has(baseKey)) variantsByBase.set(baseKey, {});
      variantsByBase.get(baseKey)[info.mode] = info;
    }

    for (const [wrapperName, variants] of variantsByBase.entries()) {
      if (!variants.light || !variants.dark) continue;

      const outputDir = path.join(componentsIconsDir, relDir);
      const lightFile = path.join(outputDir, `${variants.light.componentName}.tsx`);
      const darkFile = path.join(outputDir, `${variants.dark.componentName}.tsx`);

      const hasLight = await fileExists(lightFile);
      const hasDark = await fileExists(darkFile);
      if (!hasLight || !hasDark) continue;

      await mkdir(outputDir, { recursive: true });

      const wrapper = createWrapper({
        outputDir,
        wrapperName,
        lightComponent: variants.light.componentName,
        darkComponent: variants.dark.componentName,
      });

      await writeFile(path.join(outputDir, "index.tsx"), wrapper, "utf8");
    }
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
