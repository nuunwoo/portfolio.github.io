import { useEffect, useMemo, useRef, useState } from "react";
import { DESKTOP_REQUIRED_KEYS, getBootAssetsForDate, LOCK_REQUIRED_KEYS } from "../../app/assetsManifest";
import { bootReadiness } from "../../core/bootReadiness";
import { hasImage, preloadImages } from "../../core/preload";
import { useBootReadiness } from "../../hooks/useBootReadiness";
import styles from "./SplashScreen.module.css";

type SplashScreenProps = {
  bootDate: Date;
  onComplete?: () => void;
};

const SplashScreen = ({ bootDate, onComplete }: SplashScreenProps) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const targetProgressRef = useRef(0);
  const displayProgressRef = useRef(0);
  const hasCompletedRef = useRef(false);
  const { hasError, isReady, progress } = useBootReadiness();

  const bootAssets = useMemo(() => {
    const assets = getBootAssetsForDate(bootDate);
    return [assets.lockBg, assets.desktopBg];
  }, [bootDate]);
  const readyAssetKeys = useMemo(() => [...new Set([...LOCK_REQUIRED_KEYS, ...DESKTOP_REQUIRED_KEYS])], []);
  const completeSplashScreen = () => {
    if (hasCompletedRef.current) return;

    hasCompletedRef.current = true;
    setIsFadingOut(true);
    window.setTimeout(() => {
      onComplete?.();
    }, 260);
  };

  useEffect(() => {
    targetProgressRef.current = hasError ? 100 : progress;
  }, [hasError, progress]);

  useEffect(() => {
    let frameId = 0;

    const tick = () => {
      setDisplayProgress((previousProgress) => {
        const target = targetProgressRef.current;
        const diff = target - previousProgress;

        if (Math.abs(diff) < 0.4) {
          displayProgressRef.current = target;
          return target;
        }

        const nextProgress = previousProgress + diff * 0.16;
        const roundedProgress = Number(nextProgress.toFixed(1));
        displayProgressRef.current = roundedProgress;
        return roundedProgress;
      });

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    let alive = true;

    const bootSystem = async () => {
      try {
        bootReadiness.configure(readyAssetKeys.map((key) => ({ key })));

        readyAssetKeys.forEach((key) => {
          if (hasImage(key)) {
            bootReadiness.markStepReady(key);
            return;
          }

          bootReadiness.markStepLoading(key);
        });

        await preloadImages(
          bootAssets,
          undefined,
          ({ key }) => {
            if (!alive) return;
            bootReadiness.markStepReady(key);
          }
        );

        const snapshot = await bootReadiness.waitForReady();
        if (snapshot.hasError) {
          return;
        }
      } catch (e) {
        console.error("Splash preload error:", e);
        readyAssetKeys.forEach((key) => {
          if (!hasImage(key)) {
            bootReadiness.markStepError(key);
          }
        });
      }
    };

    bootSystem();

    return () => {
      alive = false;
    };
  }, [bootAssets, onComplete, readyAssetKeys]);

  useEffect(() => {
    if (!isReady && !hasError) return;
    let cancelled = false;

    const waitForDisplayProgress = async () => {
      while (!cancelled && displayProgressRef.current < 99.6) {
        await new Promise((resolve) => setTimeout(resolve, 16));
      }

      if (!cancelled) {
        completeSplashScreen();
      }
    };

    void waitForDisplayProgress();

    return () => {
      cancelled = true;
    };
  }, [hasError, isReady, onComplete]);

  return (
    <section className={`${styles.root} ${isFadingOut ? styles.exiting : ""}`} aria-label="MacBook boot splash screen">
      <div className={styles.glow} />
      <div className={styles.container}>
        <img src="/icons/apple_black.svg" alt="Apple inspired boot logo" className={styles.logo} draggable={false} />
        <div className={styles.progressWrap}>
          <div className={styles.progressMeta}>
            <span className={styles.status}>Starting portfolio OS</span>
            <span className={styles.percent}>{Math.round(displayProgress)}%</span>
          </div>
          <div className={styles.progress}>
            <div className={styles.bar} style={{ width: `${displayProgress}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SplashScreen;
