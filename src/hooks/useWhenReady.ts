/**
 * useWhenReady
 * - 첫 화면에 필요한 리소스(문서, 폰트, 이미지) 준비 상태 감지
 * - 진행바: 0→80% 시간 기반 → 준비 완료 후 최소 표시 시간 만족 → 80→100%
 * - ✅ 100% 채워지는 '그 순간'에 스플래시를 숨김
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { delay, waitForWindowLoad, waitForFontsReady, waitForAboveFoldImages, raceWithTimeout } from "../utils/ready";

export type UseWhenReadyOptions = {
  /** 첫 화면에서 반드시 보이는 이미지 셀렉터 목록(로고, Dock 아이콘 등) */
  aboveFoldImageSelectors?: string[];
  /** 최대 대기 시간(ms). 느린 네트워크 보호용. 기본 3000 */
  timeoutMs?: number;
  /** 스플래시 최소 표시 시간(ms). 기본 1600 */
  minDurationMs?: number;
  /** 스플래시가 완전히 사라진 직후 호출되는 콜백 */
  onDone?: () => void;
  /** 강제로 모션 축소를 적용하고 싶을 때 사용(없으면 시스템 선호 감지) */
  reducedMotion?: boolean;
};

export const useWhenReady = ({
  aboveFoldImageSelectors = [],
  timeoutMs = 3000,
  minDurationMs = 1600,
  onDone,
  reducedMotion,
}: UseWhenReadyOptions) => {
  const [visible, setVisible] = useState(true);
  const startRef = useRef<number>(performance.now());

  // 시스템 모션 축소 선호 감지(또는 강제 주입)
  const prefersReduced = useMemo(
    () =>
      typeof reducedMotion === "boolean"
        ? reducedMotion
        : window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false,
    [reducedMotion]
  );

  // 진행바 엘리먼트 ref
  const barRef = useRef<HTMLDivElement>(null);

  /** 0→80%: 시간 기반 애니메이션 */
  useEffect(() => {
    if (!visible) return;
    const base = prefersReduced ? 400 : 1100;
    const anim = barRef.current?.animate([{ width: "0%" }, { width: "80%" }], {
      duration: base,
      easing: "ease-in-out",
      fill: "forwards",
    });
    return () => anim?.cancel();
  }, [visible, prefersReduced]);

  /**
   * 준비 완료 → 최소 표시 시간 충족 → 80→100% 애니메이션
   * ✅ 최종 애니메이션이 끝나는 '즉시' setVisible(false)
   */
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      // 핵심 리소스 준비 + 타임아웃 경합
      const tasks = Promise.allSettled([
        waitForWindowLoad(),
        waitForFontsReady(),
        waitForAboveFoldImages(aboveFoldImageSelectors),
      ]);
      const result = await raceWithTimeout(tasks, timeoutMs);

      // 타임아웃 이후 근접 완료를 200~300ms 흡수
      if (result === "timeout") {
        await raceWithTimeout(tasks, 300);
      }

      // 최소 표시 시간 보장
      const elapsed = performance.now() - startRef.current;
      const remain = Math.max(0, minDurationMs - elapsed);
      if (remain > 0) await delay(remain);

      // 80% → 100% 최종 애니메이션
      const finalDur = prefersReduced ? 120 : 260;
      const anim = barRef.current?.animate([{ width: "80%" }, { width: "100%" }], {
        duration: finalDur,
        easing: "ease-out",
        fill: "forwards",
      });

      // 애니메이션 객체가 있으면 끝나는 '정확한 순간'까지 대기
      if (anim?.finished) {
        try {
          await anim.finished;
        } catch {
          /* 취소된 경우 무시 */
        }
      } else {
        // 안전망: 애니메이션 객체가 없으면 시간으로 대기
        await delay(finalDur);
      }

      if (!mounted) return;

      // ✅ 100%가 된 즉시 스플래시 숨김
      setVisible(false);

      // onDone은 다음 틱에서 호출(레이아웃 업데이트 후)
      setTimeout(() => onDone?.(), 0);
    };

    run();
    return () => {
      mounted = false;
    };
  }, [aboveFoldImageSelectors, timeoutMs, minDurationMs, prefersReduced, onDone]);

  return { visible, barRef };
};
