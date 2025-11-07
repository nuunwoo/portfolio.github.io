type FontKey = string;

export type FontPreloadEntry = {
  key: FontKey;
  family: string;
  weight: number | string;
  style?: "normal" | "italic" | "oblique";
  text?: string;
  src?: string;
};

const cache = new Set<FontKey>();
const FONT_PRELOAD_TIMEOUT_MS = 4000;

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number, message: string) =>
  new Promise<T>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error(message));
    }, timeoutMs);

    promise.then(
      value => {
        window.clearTimeout(timeoutId);
        resolve(value);
      },
      error => {
        window.clearTimeout(timeoutId);
        reject(error);
      }
    );
  });

const loadFont = async (entry: FontPreloadEntry) => {
  if (typeof document === "undefined" || !("fonts" in document)) return;

  const style = entry.style ?? "normal";
  const sampleText = entry.text ?? "Aa가12";
  const fontCss = `${style} ${entry.weight} 16px "${entry.family}"`;

  if (entry.src) {
    const fontFace = new FontFace(entry.family, `url(${entry.src}) format("woff2")`, {
      weight: String(entry.weight),
      style,
    });

    await withTimeout(fontFace.load(), FONT_PRELOAD_TIMEOUT_MS, `font load timeout: ${entry.key}`);
    document.fonts.add(fontFace);
    return;
  }

  await withTimeout(document.fonts.load(fontCss, sampleText), FONT_PRELOAD_TIMEOUT_MS, `font load timeout: ${entry.key}`);
};

export const preloadFonts = async (
  entries: ReadonlyArray<FontPreloadEntry>,
  onAssetLoaded?: (entry: FontPreloadEntry) => void,
  onAssetError?: (entry: FontPreloadEntry, error: unknown) => void
) => {
  const targets = entries.filter(({ key }) => !cache.has(key));

  await Promise.allSettled(
    targets.map(async (entry) => {
      try {
        await loadFont(entry);
        cache.add(entry.key);
        onAssetLoaded?.(entry);
      } catch {
        onAssetError?.(entry, new Error(`font preload failed: ${entry.key}`));
        return;
      }
    })
  );
};

export const hasFont = (key: FontKey) => cache.has(key);
