import type {PointerEvent, ReactNode, Ref} from 'react';
import {Children, useCallback, useEffect, useRef, useState} from 'react';

type SwiperProps = {
  activeIndex: number;
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  pageClassName?: string;
  disableSwipe?: boolean;
  viewportRef?: Ref<HTMLDivElement>;
  onActiveIndexChange: (index: number) => void;
  onSwipeStateChange?: (swiping: boolean) => void;
  onTapBlank?: () => void;
  onTapInteractive?: () => void;
  onViewportWidthChange?: (width: number) => void;
  scrollBehavior?: ScrollBehavior;
};

const SWIPE_THRESHOLD = 56;

const Swiper = ({
  activeIndex,
  children,
  className,
  trackClassName,
  pageClassName,
  disableSwipe = false,
  viewportRef: externalViewportRef,
  onActiveIndexChange,
  onSwipeStateChange,
  onTapBlank,
  onTapInteractive,
  onViewportWidthChange,
  scrollBehavior = 'smooth',
}: SwiperProps) => {
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const swipeStartXRef = useRef<number | null>(null);
    const swipeStartYRef = useRef<number | null>(null);
    const [viewportWidth, setViewportWidth] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const pageCount = Children.count(children);

    const setViewportElement = useCallback(
      (node: HTMLDivElement | null) => {
        viewportRef.current = node;
        if (!externalViewportRef) {
          return;
        }

        if (typeof externalViewportRef === 'function') {
          externalViewportRef(node);
          return;
        }

        externalViewportRef.current = node;
      },
      [externalViewportRef],
    );

    useEffect(() => {
      onSwipeStateChange?.(isSwiping);
    }, [isSwiping, onSwipeStateChange]);

    useEffect(() => {
      const viewportElement = viewportRef.current;
      if (!viewportElement) {
        return;
      }

      const updateViewportWidth = () => {
        const nextWidth = viewportElement.offsetWidth;
        setViewportWidth(nextWidth);
        onViewportWidthChange?.(nextWidth);
      };

      updateViewportWidth();
      const frameId = window.requestAnimationFrame(updateViewportWidth);
      window.addEventListener('resize', updateViewportWidth);

      let observer: ResizeObserver | null = null;
      if ('ResizeObserver' in window) {
        observer = new ResizeObserver(updateViewportWidth);
        observer.observe(viewportElement);
      }

      return () => {
        window.cancelAnimationFrame(frameId);
        window.removeEventListener('resize', updateViewportWidth);
        observer?.disconnect();
      };
    }, [onViewportWidthChange]);

    useEffect(() => {
      const viewportElement = viewportRef.current;
      if (!viewportElement || viewportWidth <= 0) {
        return;
      }

      const nextLeft = activeIndex * viewportWidth;
      if (Math.abs(viewportElement.scrollLeft - nextLeft) < 1) {
        return;
      }

      viewportElement.scrollTo({
        left: nextLeft,
        behavior: scrollBehavior,
      });
    }, [activeIndex, scrollBehavior, viewportWidth]);

    const resetSwipe = useCallback(() => {
      swipeStartXRef.current = null;
      swipeStartYRef.current = null;
      setIsSwiping(false);
    }, []);

    const handlePointerDown = useCallback(
      (event: PointerEvent<HTMLDivElement>) => {
        if (disableSwipe) {
          return;
        }

        event.stopPropagation();
        swipeStartXRef.current = event.clientX;
        swipeStartYRef.current = event.clientY;
        setIsSwiping(true);
      },
      [disableSwipe],
    );

    const handlePointerMove = useCallback(
      (event: PointerEvent<HTMLDivElement>) => {
        if (disableSwipe || swipeStartXRef.current === null || swipeStartYRef.current === null) {
          return;
        }

        event.stopPropagation();
      },
      [disableSwipe],
    );

    const handlePointerUp = useCallback(
      (event: PointerEvent<HTMLDivElement>) => {
        if (disableSwipe || swipeStartXRef.current === null || swipeStartYRef.current === null) {
          resetSwipe();
          return;
        }

        event.stopPropagation();

        const deltaX = event.clientX - swipeStartXRef.current;
        const deltaY = event.clientY - swipeStartYRef.current;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        resetSwipe();

        if (absX >= SWIPE_THRESHOLD && absX > absY && viewportWidth > 0) {
          if (deltaX < 0) {
            onActiveIndexChange(Math.min(activeIndex + 1, pageCount - 1));
          } else {
            onActiveIndexChange(Math.max(activeIndex - 1, 0));
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
      },
      [activeIndex, disableSwipe, onActiveIndexChange, onTapBlank, onTapInteractive, pageCount, resetSwipe, viewportWidth],
    );

    return (
      <div
        ref={setViewportElement}
        className={className}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}>
        <div className={trackClassName}>
          {Children.map(children, (child, index) => (
            <div className={pageClassName} key={`swiper-page-${index + 1}`}>
              {child}
            </div>
          ))}
        </div>
      </div>
    );
};

export default Swiper;
