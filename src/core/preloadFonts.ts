type FontKey = string;

export type FontPreloadEntry = {
  key: FontKey;
  family: string;
  weight: number | string;
  style?: "normal" | "italic" | "oblique";
  text?: string;
};

const cache = new Set<FontKey>();

const loadFont = async (entry: FontPreloadEntry) => {
  if (typeof document === "undefined" || !("fonts" in document)) return;

  const style = entry.style ?? "normal";
  const sampleText = entry.text ?? "Aa가12";
  const fontCss = `${style} ${entry.weight} 16px "${entry.family}"`;

  await document.fonts.load(fontCss, sampleText);
};

export const preloadFonts = async (
  entries: ReadonlyArray<FontPreloadEntry>,
  onAssetLoaded?: (entry: FontPreloadEntry) => void
) => {
  const targets = entries.filter(({ key }) => !cache.has(key));

  await Promise.all(
    targets.map(async (entry) => {
      await loadFont(entry);
      cache.add(entry.key);
      onAssetLoaded?.(entry);
    })
  );
};

export const hasFont = (key: FontKey) => cache.has(key);

