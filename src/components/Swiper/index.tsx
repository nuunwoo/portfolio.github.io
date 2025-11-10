import type {PointerEvent, ReactNode} from 'react';
import {Children, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {useGettingRef} from '../../shared/hooks/useGettingRef';

export type SwiperHandle = {
  getViewportElement: () => HTMLDivElement | null;
  scrollTo: (options: ScrollToOptions) => void;
  scrollToIndex: (index: number, behavior?: ScrollBehavior) => void;
};

type SwiperProps = {
  activeIndex: number;
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  pageClassName?: string;
  disableSwipe?: boolean;
  onActiveIndexChange: (index: number) => void;
  onSwipeStateChange?: (swiping: boolean) => void;
  onTapBlank?: () => void;
  onTapInteractive?: () => void;
  onViewportWidthChange?: (width: number) => void;
  scrollBehavior?: ScrollBehavior;
};

const SWIPE_THRESHOLD = 56;

const Swiper = forwardRef<SwiperHandle, SwiperProps>(
  (
    {
      activeIndex,
      children,
      className,
      trackClassName,
      pageClassName,
      disableSwipe = false,
      onActiveIndexChange,
      onSwipeStateChange,
      onTapBlank,
      onTapInteractive,
      onViewportWidthChange,
      scrollBehavior = 'smooth',
    },
    ref,
  ) => {
    const swipeStartXRef = useRef<number | null>(null);
    const swipeStartYRef = useRef<number | null>(null);
    const swipeStartLeftRef = useRef<number>(0);
    const [viewportWidth, setViewportWidth] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const pageCount = Children.count(children);
    const {elementRef: viewportElement, setElementRef: setViewportRef} = useGettingRef<HTMLDivElement>({
      onChange: node => {
        if (node === null) {
          setViewportWidth(0);
          onViewportWidthChange?.(0);
        }
      },
    });

    const scrollTo = useCallback((options: ScrollToOptions) => {
      viewportElement?.scrollTo(options);
    }, []);

    const scrollToIndex = useCallback(
      (index: number, behavior: ScrollBehavior = scrollBehavior) => {
        if (!viewportElement || viewportWidth <= 0) {
          return;
        }

        viewportElement.scrollTo({
          left: index * viewportWidth,
          behavior,
        });
      },
      [scrollBehavior, viewportElement, viewportWidth],
    );

    useImperativeHandle(
      ref,
      () => ({
        getViewportElement: () => viewportElement,
        scrollTo,
        scrollToIndex,
      }),
      [scrollTo, scrollToIndex, viewportElement],
    );

    useEffect(() => {
      onSwipeStateChange?.(isSwiping);
    }, [isSwiping, onSwipeStateChange]);

    useEffect(() => {
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
      if (!viewportElement || viewportWidth <= 0 || isSwiping) {
        return;
      }

      const nextLeft = activeIndex * viewportWidth;
      if (Math.abs(viewportElement.scrollLeft - nextLeft) < 1) {
        return;
      }

      scrollToIndex(activeIndex, scrollBehavior);
    }, [activeIndex, isSwiping, scrollBehavior, scrollToIndex, viewportElement, viewportWidth]);

    const resetSwipe = useCallback(() => {
      swipeStartXRef.current = null;
      swipeStartYRef.current = null;
      swipeStartLeftRef.current = 0;
      setIsSwiping(false);
    }, []);

    const handlePointerDown = useCallback(
      (event: PointerEvent<HTMLDivElement>) => {
        if (disableSwipe) {
          return;
        }

        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        swipeStartXRef.current = event.clientX;
        swipeStartYRef.current = event.clientY;
        swipeStartLeftRef.current = viewportElement?.scrollLeft ?? 0;
        setIsSwiping(true);
      },
      [disableSwipe, viewportElement],
    );

    const handlePointerMove = useCallback(
      (event: PointerEvent<HTMLDivElement>) => {
        if (disableSwipe || swipeStartXRef.current === null || swipeStartYRef.current === null || !viewportElement || viewportWidth <= 0) {
          return;
        }

        event.stopPropagation();

        const deltaX = event.clientX - swipeStartXRef.current;
        const deltaY = event.clientY - swipeStartYRef.current;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absY > absX && absY > 6) {
          return;
        }

        const maxScrollLeft = Math.max(0, (pageCount - 1) * viewportWidth);
        const nextLeft = Math.min(Math.max(swipeStartLeftRef.current - deltaX, 0), maxScrollLeft);
        viewportElement.scrollLeft = nextLeft;
      },
      [disableSwipe, pageCount, viewportElement, viewportWidth],
    );

    const handlePointerUp = useCallback(
      (event: PointerEvent<HTMLDivElement>) => {
        if (disableSwipe || swipeStartXRef.current === null || swipeStartYRef.current === null) {
          resetSwipe();
          return;
        }

        event.stopPropagation();
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }

        const deltaX = event.clientX - swipeStartXRef.current;
        const deltaY = event.clientY - swipeStartYRef.current;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absX >= SWIPE_THRESHOLD && absX > absY) {
          resetSwipe();
          if (deltaX < 0) {
            onActiveIndexChange(Math.min(activeIndex + 1, pageCount - 1));
          } else {
            onActiveIndexChange(Math.max(activeIndex - 1, 0));
          }
          onTapInteractive?.();
          return;
        }

        if (absX > 6 || absY > 6) {
          resetSwipe();
          scrollToIndex(activeIndex, 'smooth');
          return;
        }

        resetSwipe();
        const target = event.target as HTMLElement | null;
        const clickedItem = target?.closest("[data-launchpad-item='true']");
        const clickedInteractive = target?.closest("[data-launchpad-interactive='true']");
        if (clickedInteractive || clickedItem) {
          onTapInteractive?.();
          return;
        }

        onTapBlank?.();
      },
      [activeIndex, disableSwipe, onActiveIndexChange, onTapBlank, onTapInteractive, pageCount, resetSwipe, scrollToIndex],
    );

    return (
      <div
        ref={setViewportRef}
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
  },
);

Swiper.displayName = 'Swiper';

export default Swiper;
