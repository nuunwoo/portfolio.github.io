// 아주 가벼운 이미지 프리로드 유틸 (decode 보장 + 메모리 캐시)
type Key = string;

const cache = new Map<Key, HTMLImageElement>();

const decode = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      try {
        // 일부 브라우저는 decode() 지원, 없으면 무시
        // @ts-ignore
        await (img.decode?.() ?? Promise.resolve());
      } catch {}
      resolve(img);
    };
    img.onerror = (e) => reject(e ?? new Error(`image load error: ${src}`));
    img.src = src;
  });

export const preloadImages = async (
  entries: Array<{ key: Key; src: string }>,
  onProgress?: (loaded: number, total: number) => void,
  onAssetLoaded?: (entry: { key: Key; src: string }) => void
) => {
  const targets = entries.filter((e) => !cache.has(e.key));
  const total = entries.length;
  let loaded = entries.length - targets.length;
  onProgress?.(loaded, total);

  for (const { key, src } of targets) {
    // 직렬/순차 대신 병렬을 원하면 Promise.all로 변경 가능
    // 여기서는 진행률 업데이트가 쉬운 "소그룹 병렬" 전략 권장
  }

  // 병렬 + 진행률
  await Promise.all(
    targets.map(async ({ key, src }) => {
      const img = await decode(src);
      cache.set(key, img);
      loaded += 1;
      onAssetLoaded?.({ key, src });
      onProgress?.(loaded, total);
    })
  );
};

export const getImage = (key: Key) => cache.get(key);
export const hasImage = (key: Key) => cache.has(key);

// 필요 시 전체 초기화(하드 새로고침 외엔 보통 불필요)
export const resetPreloadCache = () => cache.clear();
