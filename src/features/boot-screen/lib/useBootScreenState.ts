import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  DESKTOP_REQUIRED_KEYS,
  FONT_PRELOAD_TARGETS,
  FONT_REQUIRED_KEYS,
  getBootAssetsForDate,
  LOCK_REQUIRED_KEYS,
} from '../../../app/assets-manifest';
import {appIconPreloadTargets} from '../../../assets/icons/generated/app-icons';
import {bootReadiness} from '../../../core/bootReadiness';
import {hasFont, preloadFonts} from '../../../core/preloadFonts';
import {hasImage, preloadImages} from '../../../core/preload';
import {useBootReadiness} from '../../../shared/hooks/useBootReadiness';
import {useAppStore} from '../../../shared/store/app-store';
import {timeKeeper} from '../../../utils/timeKeeper';

const BOOT_SCREEN_REQUIRED_ASSET_KEYS = [
  ...new Set([
    ...LOCK_REQUIRED_KEYS,
    ...DESKTOP_REQUIRED_KEYS,
    ...FONT_REQUIRED_KEYS,
    ...appIconPreloadTargets.map(({key}) => key),
  ]),
];

export const useBootScreenState = () => {
  const completeSplash = useAppStore(state => state.completeSplash);
  const [bootStartedAt] = useState(() => timeKeeper.zonedNow());
  const [progressValue, setProgressValue] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const targetProgressValueRef = useRef(0);
  const renderedProgressValueRef = useRef(0);
  const hasCompletedBootRef = useRef(false);
  const {hasError, isReady, progress} = useBootReadiness();

  useEffect(() => {
    const snapshot = bootReadiness.getSnapshot();
    console.log('[BootScreenView] readiness', {
      progress: snapshot.progress,
      isReady: snapshot.isReady,
      hasError: snapshot.hasError,
      steps: snapshot.steps,
    });
  }, [hasError, isReady, progress]);

  const preloadAssets = useMemo(() => {
    const assets = getBootAssetsForDate(bootStartedAt);
    return [assets.lockBg, assets.desktopBg, ...appIconPreloadTargets];
  }, [bootStartedAt]);

  const completeBootSequence = useCallback(() => {
    if (hasCompletedBootRef.current) return;

    hasCompletedBootRef.current = true;
    setIsExiting(true);
    window.setTimeout(() => {
      completeSplash();
    }, 260);
  }, [completeSplash]);

  useEffect(() => {
    targetProgressValueRef.current = hasError ? 100 : progress;
  }, [hasError, progress]);

  useEffect(() => {
    let frameId = 0;

    const syncProgressFrame = () => {
      setProgressValue(previousProgress => {
        const target = targetProgressValueRef.current;
        const diff = target - previousProgress;

        if (Math.abs(diff) < 0.4) {
          renderedProgressValueRef.current = target;
          return target;
        }

        const nextProgress = previousProgress + diff * 0.16;
        const roundedProgress = Number(nextProgress.toFixed(1));
        renderedProgressValueRef.current = roundedProgress;
        return roundedProgress;
      });

      frameId = window.requestAnimationFrame(syncProgressFrame);
    };

    frameId = window.requestAnimationFrame(syncProgressFrame);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const preloadBootAssets = async () => {
      try {
        bootReadiness.configure(BOOT_SCREEN_REQUIRED_ASSET_KEYS.map(key => ({key})));

        BOOT_SCREEN_REQUIRED_ASSET_KEYS.forEach(key => {
          if (hasImage(key) || hasFont(key)) {
            bootReadiness.markStepReady(key);
            return;
          }

          bootReadiness.markStepLoading(key);
        });

        await preloadImages(
          preloadAssets,
          undefined,
          ({key}) => {
            if (!isMounted) return;
            bootReadiness.markStepReady(key);
          },
          ({key}) => {
            if (!isMounted) return;
            bootReadiness.markStepError(key);
          },
        );

        await preloadFonts(
          FONT_PRELOAD_TARGETS,
          ({key}) => {
            if (!isMounted) return;
            bootReadiness.markStepReady(key);
          },
          ({key}) => {
            if (!isMounted) return;
            bootReadiness.markStepError(key);
          },
        );

        await bootReadiness.waitForReady();
      } catch (error) {
        console.error('Boot screen preload error:', error);
        BOOT_SCREEN_REQUIRED_ASSET_KEYS.forEach(key => {
          if (!hasImage(key) && !hasFont(key)) {
            bootReadiness.markStepError(key);
          }
        });
      }
    };

    void preloadBootAssets();

    return () => {
      isMounted = false;
    };
  }, [preloadAssets]);

  useEffect(() => {
    if (!isReady && !hasError) return;
    let cancelled = false;

    const waitForRenderedProgress = async () => {
      while (!cancelled && renderedProgressValueRef.current < 99.6) {
        await new Promise(resolve => setTimeout(resolve, 16));
      }

      if (!cancelled) {
        completeBootSequence();
      }
    };

    void waitForRenderedProgress();

    return () => {
      cancelled = true;
    };
  }, [completeBootSequence, hasError, isReady]);

  return {
    progressValue,
    isExiting,
  };
};
