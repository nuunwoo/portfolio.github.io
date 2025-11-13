import type {CSSProperties} from 'react';
import {useEffect, useState} from 'react';
import type {ScreenBackgroundTarget} from '../../app/assets-manifest';
import {useCurrentBackground} from './useCurrentBackground';
import {useGettingRef} from './useGettingRef';

type UseBlurredBackgroundImageOptions = {
  target?: ScreenBackgroundTarget;
  watch?: unknown[];
};

export const useBlurredBackgroundImage = ({
  target = 'desktop',
  watch = [],
}: UseBlurredBackgroundImageOptions = {}) => {
  const backgroundSrc = useCurrentBackground(target);
  const [backgroundImageStyle, setBackgroundImageStyle] = useState<CSSProperties | undefined>(undefined);
  const {elementRef, setElementRef} = useGettingRef<HTMLElement>();

  useEffect(() => {
    const updateBackgroundImageStyle = () => {
      if (!elementRef) {
        return;
      }

      const rect = elementRef.getBoundingClientRect();
      setBackgroundImageStyle({
        width: `${window.innerWidth}px`,
        height: `${window.innerHeight}px`,
        left: `${-rect.left}px`,
        top: `${-rect.top}px`,
      });
    };

    updateBackgroundImageStyle();

    const animationFrameId = window.requestAnimationFrame(updateBackgroundImageStyle);
    window.addEventListener('resize', updateBackgroundImageStyle);

    let resizeObserver: ResizeObserver | null = null;
    if ('ResizeObserver' in window && elementRef) {
      resizeObserver = new ResizeObserver(updateBackgroundImageStyle);
      resizeObserver.observe(elementRef);
    }

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateBackgroundImageStyle);
      resizeObserver?.disconnect();
    };
  }, [elementRef, target, ...watch]);

  return {
    backgroundImageStyle,
    backgroundSrc,
    setBackgroundImageRef: setElementRef,
  };
};
