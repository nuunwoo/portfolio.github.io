import {useEffect, useMemo, useRef, useState} from 'react';
import {preloadImages, ready} from '../../core/preload';
import {DESKTOP_REQUIRED_KEYS, FIRST_BOOT_ASSETS, LOCK_REQUIRED_KEYS} from '../../app/assetsManifest';
import styles from './SplashScreen.module.css';

type SplashScreenProps = {
  onComplete?: () => void;
};

const SplashScreen = ({onComplete}: SplashScreenProps) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const targetProgressRef = useRef(0);
  const displayProgressRef = useRef(0);
  const hasCompletedRef = useRef(false);

  const bootAssets = useMemo(() => FIRST_BOOT_ASSETS, []);
  const readyAssetKeys = useMemo(() => [...new Set([...LOCK_REQUIRED_KEYS, ...DESKTOP_REQUIRED_KEYS])], []);

  useEffect(() => {
    let frameId = 0;

    const tick = () => {
      setDisplayProgress(previousProgress => {
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

    const completeSplashScreen = () => {
      if (!alive || hasCompletedRef.current) return;
      hasCompletedRef.current = true;
      setIsFadingOut(true);
      window.setTimeout(() => {
        if (alive) onComplete?.();
      }, 260);
    };

    const bootSystem = async () => {
      try {
        await preloadImages(bootAssets, (loaded, total) => {
          if (!alive) return;
          targetProgressRef.current = Math.round((loaded / total) * 100);
        });

        await ready(readyAssetKeys);
        targetProgressRef.current = 100;

        while (alive && displayProgressRef.current < 99.6) {
          await new Promise(resolve => setTimeout(resolve, 16));
        }

        completeSplashScreen();
      } catch (e) {
        console.error('Splash preload error:', e);
        completeSplashScreen();
      }
    };

    bootSystem();

    return () => {
      alive = false;
    };
  }, [bootAssets, onComplete, readyAssetKeys]);

  return (
    <section className={`${styles.root} ${isFadingOut ? styles.exiting : ''}`} aria-label="MacBook boot splash screen">
      <div className={styles.glow} />
      <div className={styles.container}>
        <img src="/icons/apple_black.svg" alt="Apple inspired boot logo" className={styles.logo} draggable={false} />
        <div className={styles.progressWrap}>
          <div className={styles.progressMeta}>
            <span className={styles.status}>Starting portfolio OS</span>
            <span className={styles.percent}>{Math.round(displayProgress)}%</span>
          </div>
          <div className={styles.progress}>
            <div className={styles.bar} style={{width: `${displayProgress}%`}} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SplashScreen;
