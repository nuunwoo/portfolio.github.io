import {useEffect, useMemo, useRef, useState} from 'react';
import {
  DESKTOP_REQUIRED_KEYS,
  FONT_PRELOAD_TARGETS,
  FONT_REQUIRED_KEYS,
  getBootAssetsForDate,
  LOCK_REQUIRED_KEYS,
} from '../../../app/assetsManifest';
import {AppleLogoIcon} from '../../../design-system/icons';
import {appIconPreloadTargets} from '../../../components/icons/app-icons';
import {bootReadiness} from '../../../core/bootReadiness';
import {hasFont, preloadFonts} from '../../../core/preloadFonts';
import {hasImage, preloadImages} from '../../../core/preload';
import {useBootReadiness} from '../../../hooks/useBootReadiness';
import {useAppStore} from '../../../shared/store/app-store';
import {timeKeeper} from '../../../utils/timeKeeper';
import BootSplashMotion from './animations/BootSplashMotion';

const BootSplash = () => {
  const completeSplash = useAppStore(state => state.completeSplash);
  const [bootDate] = useState(() => timeKeeper.zonedNow());
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const targetProgressRef = useRef(0);
  const displayProgressRef = useRef(0);
  const hasCompletedRef = useRef(false);
  const {hasError, isReady, progress} = useBootReadiness();

  const bootAssets = useMemo(() => {
    const assets = getBootAssetsForDate(bootDate);
    return [assets.lockBg, assets.desktopBg, ...appIconPreloadTargets];
  }, [bootDate]);

  const readyAssetKeys = useMemo(
    () => [
      ...new Set([
        ...LOCK_REQUIRED_KEYS,
        ...DESKTOP_REQUIRED_KEYS,
        ...FONT_REQUIRED_KEYS,
        ...appIconPreloadTargets.map(({key}) => key),
      ]),
    ],
    []
  );

  const completeBootSplash = () => {
    if (hasCompletedRef.current) return;

    hasCompletedRef.current = true;
    setIsFadingOut(true);
    window.setTimeout(() => {
      completeSplash();
    }, 260);
  };

  useEffect(() => {
    targetProgressRef.current = hasError ? 100 : progress;
  }, [hasError, progress]);

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

    const bootSystem = async () => {
      try {
        bootReadiness.configure(readyAssetKeys.map(key => ({key})));

        readyAssetKeys.forEach(key => {
          if (hasImage(key) || hasFont(key)) {
            bootReadiness.markStepReady(key);
            return;
          }

          bootReadiness.markStepLoading(key);
        });

        await preloadImages(bootAssets, undefined, ({key}) => {
          if (!alive) return;
          bootReadiness.markStepReady(key);
        });

        await preloadFonts(FONT_PRELOAD_TARGETS, ({key}) => {
          if (!alive) return;
          bootReadiness.markStepReady(key);
        });

        await bootReadiness.waitForReady();
      } catch (error) {
        console.error('Splash preload error:', error);
        readyAssetKeys.forEach(key => {
          if (!hasImage(key) && !hasFont(key)) {
            bootReadiness.markStepError(key);
          }
        });
      }
    };

    void bootSystem();

    return () => {
      alive = false;
    };
  }, [bootAssets, readyAssetKeys]);

  useEffect(() => {
    if (!isReady && !hasError) return;
    let cancelled = false;

    const waitForDisplayProgress = async () => {
      while (!cancelled && displayProgressRef.current < 99.6) {
        await new Promise(resolve => setTimeout(resolve, 16));
      }

      if (!cancelled) {
        completeBootSplash();
      }
    };

    void waitForDisplayProgress();

    return () => {
      cancelled = true;
    };
  }, [hasError, isReady]);

  return (
    <BootSplashMotion
      isExiting={isFadingOut}
      progress={displayProgress}
      logo={
        <AppleLogoIcon
          mode="dark"
          role="img"
          aria-label="Apple inspired boot logo"
          width={110}
          height={123}
        />
      }
    />
  );
};

export default BootSplash;
