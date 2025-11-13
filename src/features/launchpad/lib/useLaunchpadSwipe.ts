import {useCallback, useRef, useState} from 'react';
import type {PointerEvent} from 'react';

type UseLaunchpadSwipeOptions = {
  enabled: boolean;
  viewportWidth: number;
  pageCount: number;
  onPageIndexChange: (updater: (previous: number) => number) => void;
  onTapBlank?: () => void;
  onTapInteractive?: () => void;
};

const SWIPE_THRESHOLD = 56;

export const useLaunchpadSwipe = ({
  enabled,
  viewportWidth,
  pageCount,
  onPageIndexChange,
  onTapBlank,
  onTapInteractive,
}: UseLaunchpadSwipeOptions) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const swipeStartX = useRef<number | null>(null);
  const swipeStartY = useRef<number | null>(null);

  const resetSwipe = useCallback(() => {
    swipeStartX.current = null;
    swipeStartY.current = null;
    setIsDragging(false);
    setDragOffset(0);
  }, []);

  const handlePointerDown = useCallback((event: PointerEvent<HTMLElement>) => {
    if (!enabled) {
      return;
    }

    event.stopPropagation();
    setDragOffset(0);
    setIsDragging(false);

    const target = event.target as HTMLElement | null;
    if (target?.closest("[data-launchpad-grid-item='true']")) {
      return;
    }

    swipeStartX.current = event.clientX;
    swipeStartY.current = event.clientY;
    setIsDragging(true);
    setDragOffset(0);
  }, [enabled]);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    if (!enabled || swipeStartX.current === null || swipeStartY.current === null) {
      return;
    }

    const deltaX = event.clientX - swipeStartX.current;
    const deltaY = event.clientY - swipeStartY.current;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setDragOffset(deltaX);
    }
  }, [enabled]);

  const handlePointerUp = useCallback((event: PointerEvent<HTMLElement>) => {
    if (!enabled || swipeStartX.current === null || swipeStartY.current === null) {
      resetSwipe();
      return;
    }

    event.stopPropagation();

    const deltaX = event.clientX - swipeStartX.current;
    const deltaY = event.clientY - swipeStartY.current;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    resetSwipe();

    if (absX >= SWIPE_THRESHOLD && absX > absY && viewportWidth > 0) {
      if (deltaX < 0) {
        onPageIndexChange(previous => Math.min(previous + 1, pageCount - 1));
      } else {
        onPageIndexChange(previous => Math.max(previous - 1, 0));
      }
      onTapInteractive?.();
      return;
    }

    if (absX > 6 || absY > 6) {
      return;
    }

    const target = event.target as HTMLElement | null;
    const clickedItem = target?.closest("[data-launchpad-item='true']");
    const clickedInteractive = target?.closest("[data-launchpad-interactive='true']");
    if (clickedInteractive || clickedItem) {
      onTapInteractive?.();
      return;
    }

    onTapBlank?.();
  }, [enabled, onPageIndexChange, onTapBlank, onTapInteractive, pageCount, resetSwipe, viewportWidth]);

  return {
    dragOffset,
    isDragging,
    resetSwipe,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
};
