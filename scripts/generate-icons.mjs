import { execSync } from "node:child_process";
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const srcDir = path.join(projectRoot, "src");
const assetsIconsDir = path.join(srcDir, "assets", "icons");
const rawIconsDir = path.join(assetsIconsDir, "raw");
const generatedIconsDir = path.join(assetsIconsDir, "generated");
const excludedSourceDirs = new Set(["app-icons", "generated"]);

const toPosix = (value) => value.split(path.sep).join("/");
const kebabCase = (value) =>
  value
    .replace(/\.svg$/i, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

const pascalCase = (value) =>
  value
    .replace(/\.svg$/i, "")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

const createAppIconsIndex = (iconNames) => {
  const importLines = iconNames
    .map((iconName) => `import ${pascalCase(iconName)}Icon from "../../raw/app-icons/${iconName}.svg";`)
    .join("\n");

  const sourceEntries = iconNames
    .map((iconName) => `  "${iconName}": ${pascalCase(iconName)}Icon,`)
    .join("\n");

  return `import type { CSSProperties } from "react";
${importLines}

const appIconSources = {
${sourceEntries}
} as const;

export type AppIconName = keyof typeof appIconSources;
const getAppIconSrc = (name: AppIconName) => appIconSources[name];
const appIconNames = Object.keys(appIconSources) as AppIconName[];
const appIconPreloadTargets = appIconNames.map(name => ({
  key: \`app-icon-\${name}\`,
  src: getAppIconSrc(name),
}));

type AppIconProps = {
  name: AppIconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
  alt?: string;
  loading?: "eager" | "lazy";
  decoding?: "sync" | "async" | "auto";
};

const AppIcon = ({ name, size = 50, className, style, alt = "", loading = "lazy", decoding = "async" }: AppIconProps) => (
  <img
    src={getAppIconSrc(name)}
    width={size}
    height={size}
    loading={loading}
    decoding={decoding}
    alt={alt}
    className={className}
    style={style}
  />
);

export { appIconNames };
export { appIconPreloadTargets };
export { getAppIconSrc };
export default AppIcon;
`;
};

const createAppIconsCatalog = () => `import {appIconNames, type AppIconName} from '.';

type AppIconCatalogItem = {
  key: string;
  label: string;
  icon: AppIconName;
};

const defaultDockItems = [
  {key: 'finder', label: 'Finder', icon: 'finder'},
  {key: 'launchpad', label: 'Launchpad', icon: 'launchpad'},
  {key: 'mail', label: 'Mail', icon: 'mail'},
  {key: 'calendar', label: 'Calendar', icon: 'calendar'},
  {key: 'notes', label: 'Notes', icon: 'notes'},
  {key: 'terminal', label: 'Terminal', icon: 'terminal'},
  {key: 'trash', label: 'Trash', icon: 'trash'},
] as const;

const dockAppIcons = defaultDockItems.filter(item => appIconNames.includes(item.icon as AppIconName)) as AppIconCatalogItem[];

const specialLabels = {
  'app-store': 'App Store',
  'apple-tv': 'Apple TV',
  'custom-app': 'Custom App',
  facetime: 'FaceTime',
  'find-my': 'Find My',
  garageband: 'GarageBand',
  imovie: 'iMovie',
  keynote: 'Keynote',
  launchpad: 'Launchpad',
  mail: 'Mail',
  maps: 'Maps',
  music: 'Music',
  notes: 'Notes',
  pages: 'Pages',
  'photo-booth': 'Photo Booth',
  photos: 'Photos',
  podcasts: 'Podcasts',
  preview: 'Preview',
  safari: 'Safari',
  siri: 'Siri',
  terminal: 'Terminal',
  textedit: 'TextEdit',
  'system-settings': 'System Settings',
  'system-information': 'System Information',
  'swift-playgrounds': 'Swift Playgrounds',
  'quicktime-player': 'QuickTime Player',
  'voice-memos': 'Voice Memos',
  'voiceover-utility': 'VoiceOver Utility',
  'colorsync-utility': 'ColorSync Utility',
  xcode: 'Xcode',
} as const;

const launchpadLabelOverrides: Partial<Record<AppIconName, string>> = Object.fromEntries(
  Object.entries(specialLabels).filter(([key]) => appIconNames.includes(key as AppIconName)),
) as Partial<Record<AppIconName, string>>;

const toTitleLabel = (name: AppIconName) =>
  launchpadLabelOverrides[name] ??
  name
    .split('-')
    .map(token => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ');

const launchpadAppIcons: AppIconCatalogItem[] = appIconNames.map(iconName => ({
  key: iconName,
  label: toTitleLabel(iconName),
  icon: iconName,
}));

export type {AppIconCatalogItem};
export {dockAppIcons, launchpadAppIcons};
`;

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
  const hookTarget = path.join(srcDir, "shared", "hooks", "useSystemAppearance");
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

const removeGeneratedAppIcons = async () => {
  const appIconsDir = path.join(generatedIconsDir, "app-icons");
  if (!(await fileExists(appIconsDir))) return;

  const entries = await readdir(appIconsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".tsx")) continue;
    if (entry.name === "index.tsx") continue;
    await rm(path.join(appIconsDir, entry.name), { force: true });
  }
};

const run = async () => {
  await mkdir(generatedIconsDir, { recursive: true });

  const topEntries = await readdir(rawIconsDir, { withFileTypes: true });
  const sourceDirs = topEntries
    .filter((entry) => entry.isDirectory() && !excludedSourceDirs.has(entry.name))
    .map((entry) => entry.name);

  for (const dirName of sourceDirs) {
    execSync(
      `yarn svgr --no-index --typescript --filename-case pascal --no-dimensions --no-svgo --template scripts/svgr.template.cjs --out-dir src/assets/icons/generated/${dirName} -- src/assets/icons/raw/${dirName}`,
      {
        cwd: projectRoot,
        stdio: "inherit",
      },
    );
  }

  await removeStaleGeneratedIndexes(generatedIconsDir);
  await removeGeneratedAppIcons();

  const appIconsRawDir = path.join(rawIconsDir, "app-icons");
  const appIconFileNames = (await readdir(appIconsRawDir))
    .filter((name) => name.endsWith(".svg"))
    .map((name) => kebabCase(name))
    .sort();
  const appIconsGeneratedDir = path.join(generatedIconsDir, "app-icons");
  await mkdir(appIconsGeneratedDir, { recursive: true });
  await writeFile(path.join(appIconsGeneratedDir, "index.tsx"), createAppIconsIndex(appIconFileNames), "utf8");
  await writeFile(path.join(appIconsGeneratedDir, "catalog.ts"), createAppIconsCatalog(), "utf8");

  const svgFiles = (await listSvgFiles(rawIconsDir)).filter((relPath) => {
    const topDir = relPath.split(path.sep)[0];
    return !excludedSourceDirs.has(topDir);
  });
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

      const outputDir = path.join(generatedIconsDir, relDir);
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
