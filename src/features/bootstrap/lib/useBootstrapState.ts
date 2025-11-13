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
import {timeKeeper} from '../../../utils/timeKeeper';

const BOOTSTRAP_REQUIRED_ASSET_KEYS = [
  ...new Set([
    ...LOCK_REQUIRED_KEYS,
    ...DESKTOP_REQUIRED_KEYS,
    ...FONT_REQUIRED_KEYS,
    ...appIconPreloadTargets.map(({key}) => key),
  ]),
];

export const useBootstrapState = () => {
  const [bootStartedAt] = useState(() => timeKeeper.zonedNow());
  const [progressValue, setProgressValue] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const targetProgressValueRef = useRef(0);
  const renderedProgressValueRef = useRef(0);
  const hasFinishedBootstrapRef = useRef(false);
  const {hasError, isReady, progress} = useBootReadiness();

  const preloadAssets = useMemo(() => {
    const assets = getBootAssetsForDate(bootStartedAt);
    return [assets.lockBg, assets.desktopBg, ...appIconPreloadTargets];
  }, [bootStartedAt]);

  const finishBootstrapSequence = useCallback(() => {
    if (hasFinishedBootstrapRef.current) return;

    hasFinishedBootstrapRef.current = true;
    setIsExiting(true);
    window.setTimeout(() => {
      setIsFinished(true);
    }, 260);
  }, []);

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

    const preloadBootstrapAssets = async () => {
      try {
        bootReadiness.configure(BOOTSTRAP_REQUIRED_ASSET_KEYS.map(key => ({key})));

        BOOTSTRAP_REQUIRED_ASSET_KEYS.forEach(key => {
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
        console.error('Bootstrap preload error:', error);
        BOOTSTRAP_REQUIRED_ASSET_KEYS.forEach(key => {
          if (!hasImage(key) && !hasFont(key)) {
            bootReadiness.markStepError(key);
          }
        });
      }
    };

    void preloadBootstrapAssets();

    return () => {
      isMounted = false;
    };
  }, [preloadAssets]);

  useEffect(() => {
    if (!isReady && !hasError) return;
    let cancelled = false;

    const waitForRenderedBootstrapProgress = async () => {
      while (!cancelled && renderedProgressValueRef.current < 99.6) {
        await new Promise(resolve => setTimeout(resolve, 16));
      }

      if (!cancelled) {
        finishBootstrapSequence();
      }
    };

    void waitForRenderedBootstrapProgress();

    return () => {
      cancelled = true;
    };
  }, [finishBootstrapSequence, hasError, isReady]);

  return {
    isFinished,
    progressValue,
    isExiting,
  };
};
