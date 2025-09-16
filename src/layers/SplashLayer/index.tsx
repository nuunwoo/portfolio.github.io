/**
 * SplashLayer
 * - 스타일은 CSS Module(SplashLayer.module.css)로 분리
 * - 준비 로직은 useWhenReady 훅에서 담당
 * - 컴포넌트는 default export (arrow function)
 * - Props 타입은 컴포넌트명 + Props 규칙
 */

import styles from "./SplashLayer.module.css";
import { useWhenReady } from "../../hooks/useWhenReady";
import type { UseWhenReadyOptions } from "../../hooks/useWhenReady";
import apple from "/icons/apple.svg";
import viteLogo from "/vite.svg";

type SplashLayerProps = Pick<
  UseWhenReadyOptions,
  "aboveFoldImageSelectors" | "timeoutMs" | "minDurationMs" | "onDone" | "reducedMotion"
> & {
  /** 외부에서 강제로 숨기고 싶을 때 사용(선택) */
  forceHide?: boolean;
};

const SplashLayer = ({
  aboveFoldImageSelectors,
  timeoutMs,
  minDurationMs,
  onDone,
  reducedMotion,
  forceHide,
}: SplashLayerProps) => {
  const { visible, barRef } = useWhenReady({
    aboveFoldImageSelectors,
    timeoutMs,
    minDurationMs,
    onDone,
    reducedMotion,
  });

  if (forceHide || !visible) return null;

  return (
    <div aria-busy="true" className={styles.root}>
      <div className={styles.container}>
        {/* 중앙 로고: 추후 개인 SVG 교체 권장 */}
        {/* <div aria-label="logo" className={styles.logo} /> */}
        <img src={apple} className={styles.logo} alt="apple logo" />
        {/* 진행 바 */}
        <div aria-label="progress" className={styles.progress}>
          <div ref={barRef} className={styles.bar} />
        </div>
      </div>
    </div>
  );
};

export default SplashLayer;
