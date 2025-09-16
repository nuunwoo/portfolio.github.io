/**
 * ready.ts
 * - 브라우저/자산 준비를 기다리는 순수 헬퍼 모음
 */

export const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** 문서/리소스가 완전히 로드된 시점(window 'load') 대기 */
export const waitForWindowLoad = (): Promise<void> => {
  if (document.readyState === "complete") return Promise.resolve();
  return new Promise((resolve) => {
    const onLoad = () => {
      window.removeEventListener("load", onLoad);
      resolve();
    };
    window.addEventListener("load", onLoad, { once: true });
  });
};

/** 웹폰트 준비 완료(document.fonts.ready). 미지원 브라우저는 즉시 통과 */
export const waitForFontsReady = (): Promise<void> => {
  // @ts-ignore
  const fontsReady: Promise<void> | undefined = document.fonts?.ready;
  return fontsReady ?? Promise.resolve();
};

/** 이미지가 안전하게 렌더링될 수 있을 때까지 대기 */
export const waitForImageDecode = async (img: HTMLImageElement): Promise<void> => {
  if (!img) return;
  const anyImg = img as any;
  if (typeof anyImg.decode === "function") {
    try {
      await anyImg.decode();
      return;
    } catch {
      // decode 실패 시 onload/onerror로 폴백
    }
  }
  if (img.complete && img.naturalWidth > 0) return;
  await new Promise<void>((resolve) => {
    const done = () => {
      img.removeEventListener("load", done);
      img.removeEventListener("error", done);
      resolve();
    };
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
  });
};

/** 첫 화면(Above-the-fold) 이미지 decode 대기 */
export const waitForAboveFoldImages = async (selectors: string[] = []): Promise<void> => {
  if (!selectors.length) return;
  const nodes: HTMLImageElement[] = [];
  selectors.forEach((sel) => {
    document.querySelectorAll<HTMLImageElement>(sel).forEach((el) => nodes.push(el));
  });
  await Promise.allSettled(nodes.map((img) => waitForImageDecode(img)));
};

/**
 * 주어진 Promise와 타임아웃을 경합시킴
 * - 타임아웃 우선 종료 시 "timeout" 반환
 * - 성공 시 원래 결과 반환
 */
export const raceWithTimeout = async <T>(p: Promise<T>, ms: number): Promise<T | "timeout"> => {
  let timedOut = false;
  const timeout = delay(ms).then(() => {
    timedOut = true;
  });
  const winner = (await Promise.race([p, timeout])) as T | void;
  return timedOut ? "timeout" : (winner as T);
};
