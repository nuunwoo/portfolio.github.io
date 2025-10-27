import {motion} from 'framer-motion';
import type {PointerEvent} from 'react';
import {useEffect, useMemo, useRef, useState} from 'react';
import {LaunchpadGrid} from '../../../design-system/components';
import {LAUNCHPAD_PAGE_SIZE} from '../model/constants';
import {filterApps, paginateApps} from '../model/layout';
import type {LaunchpadAppItem} from '../model/types';
import LaunchpadSearchBar from './LaunchpadSearchBar';
import styles from './Launchpad.module.css';

type LaunchpadPanelProps = {
  apps: LaunchpadAppItem[];
  isOpen: boolean;
  isClosing: boolean;
  onClose: () => void;
};

const SWIPE_THRESHOLD = 56;
const SLIDE_DURATION = 0.38;
const SLIDE_DURATION_MS = 380;
const SLIDE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const LaunchpadPanel = ({apps, isOpen, isClosing, onClose}: LaunchpadPanelProps) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hasSearchFocusHistory, setHasSearchFocusHistory] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const swipeStartX = useRef<number | null>(null);
  const swipeStartY = useRef<number | null>(null);
  const gridViewportRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const slideTimerRef = useRef<number | null>(null);
  const filteredApps = useMemo(() => filterApps(apps, searchQuery), [apps, searchQuery]);

  const pageCount = Math.max(1, Math.ceil(filteredApps.length / LAUNCHPAD_PAGE_SIZE));
  const showPagination = pageCount > 1;
  const showEmptyState = searchQuery.trim().length > 0 && filteredApps.length === 0;
  const isPageVisible = (index: number) => Math.abs(index - pageIndex) <= 1;
  const pagedApps = useMemo(() => paginateApps(filteredApps), [filteredApps]);

  useEffect(() => {
    if (!isOpen && !isClosing) {
      setPageIndex(0);
      setDragOffset(0);
      setIsDragging(false);
      setSearchQuery('');
      setIsSearchFocused(false);
      setHasSearchFocusHistory(false);
      setIsSliding(false);
      return;
    }

    setPageIndex(prev => Math.min(prev, pageCount - 1));
  }, [isOpen, isClosing, pageCount]);

  useEffect(() => {
    setPageIndex(0);
    setDragOffset(0);
  }, [searchQuery]);

  useEffect(() => {
    if (slideTimerRef.current !== null) {
      window.clearTimeout(slideTimerRef.current);
      slideTimerRef.current = null;
    }

    if (!isOpen || isClosing || isDragging) {
      setIsSliding(false);
      return;
    }

    setIsSliding(true);
    slideTimerRef.current = window.setTimeout(() => {
      setIsSliding(false);
      slideTimerRef.current = null;
    }, SLIDE_DURATION_MS + 40);
  }, [isOpen, isClosing, isDragging, pageIndex]);

  useEffect(() => {
    const updateViewportWidth = () => {
      setViewportWidth(gridViewportRef.current?.offsetWidth ?? 0);
    };

    updateViewportWidth();
    const frameId = window.requestAnimationFrame(updateViewportWidth);
    window.addEventListener('resize', updateViewportWidth);

    let observer: ResizeObserver | null = null;
    if (gridViewportRef.current && 'ResizeObserver' in window) {
      observer = new ResizeObserver(updateViewportWidth);
      observer.observe(gridViewportRef.current);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', updateViewportWidth);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (slideTimerRef.current !== null) {
        window.clearTimeout(slideTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const shouldHardKeepFocus =
      isOpen && !isClosing && hasSearchFocusHistory && isSearchFocused && (isDragging || isSliding);
    if (!shouldHardKeepFocus) return;

    let rafId = 0;
    const keepFocus = () => {
      if (document.activeElement !== searchInputRef.current) {
        searchInputRef.current?.focus();
      }
      rafId = window.requestAnimationFrame(keepFocus);
    };

    rafId = window.requestAnimationFrame(keepFocus);
    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [hasSearchFocusHistory, isClosing, isDragging, isOpen, isSearchFocused, isSliding]);

  const focusSearchInput = () => {
    if (!isOpen || isClosing || !hasSearchFocusHistory) return;
    setIsSearchFocused(true);
    window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  };

  const handlePanelPointerDownCapture = (event: PointerEvent<HTMLElement>) => {
    const target = event.target as HTMLElement | null;
    const clickedInteractive = target?.closest("[data-launchpad-interactive='true']");
    if (!clickedInteractive) {
      event.preventDefault();
    }
  };

  const handlePanelPointerDown = (event: PointerEvent<HTMLElement>) => {
    event.stopPropagation();
    swipeStartX.current = event.clientX;
    swipeStartY.current = event.clientY;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handlePanelPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (swipeStartX.current === null || swipeStartY.current === null) {
      return;
    }

    const deltaX = event.clientX - swipeStartX.current;
    const deltaY = event.clientY - swipeStartY.current;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setDragOffset(deltaX);
    }
  };

  const handlePanelPointerUp = (event: PointerEvent<HTMLElement>) => {
    event.stopPropagation();
    if (swipeStartX.current === null || swipeStartY.current === null) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    const deltaX = event.clientX - swipeStartX.current;
    const deltaY = event.clientY - swipeStartY.current;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    swipeStartX.current = null;
    swipeStartY.current = null;
    setIsDragging(false);

    if (absX >= SWIPE_THRESHOLD && absX > absY && viewportWidth > 0) {
      if (deltaX < 0) {
        setPageIndex(prev => Math.min(prev + 1, pageCount - 1));
      } else {
        setPageIndex(prev => Math.max(prev - 1, 0));
      }
      setDragOffset(0);
      focusSearchInput();
      return;
    }

    setDragOffset(0);
    if (absX > 6 || absY > 6) {
      return;
    }

    const target = event.target as HTMLElement | null;
    const clickedItem = target?.closest("[data-launchpad-item='true']");
    const clickedInteractive = target?.closest("[data-launchpad-interactive='true']");
    if (clickedInteractive) {
      focusSearchInput();
      return;
    }
    if (!clickedItem) {
      onClose();
      return;
    }
    focusSearchInput();
  };

  return (
    <section
      className={`${styles.launchpadPanel} ${isOpen ? styles.launchpadPanelEnter : ''} ${
        isClosing ? styles.launchpadPanelExit : ''
      }`}
      aria-label="Launchpad"
      onPointerDownCapture={handlePanelPointerDownCapture}
      onPointerDown={handlePanelPointerDown}
      onPointerMove={handlePanelPointerMove}
      onPointerUp={handlePanelPointerUp}
      onPointerCancel={handlePanelPointerUp}>
      <LaunchpadSearchBar
        value={searchQuery}
        isFocused={isSearchFocused}
        holdFocusedVisual={isClosing}
        keepFocus={isOpen && !isClosing && hasSearchFocusHistory}
        inputRef={searchInputRef}
        onChange={setSearchQuery}
        onFocusChange={focused => {
          setIsSearchFocused(focused);
          if (focused) {
            setHasSearchFocusHistory(true);
          }
        }}
      />
      {showEmptyState ? (
        <div className={styles.launchpadSearchEmpty}>결과 없음</div>
      ) : (
        <div className={styles.launchpadGridViewport} ref={gridViewportRef}>
          <motion.div
            className={styles.launchpadGridTrack}
            animate={{
              x: -(pageIndex * viewportWidth) + dragOffset,
              transition: isDragging
                ? {duration: 0}
                : {duration: SLIDE_DURATION, ease: SLIDE_EASE},
            }}>
            {pagedApps.map((pageApps, index) => (
              <div key={`launchpad-page-${index + 1}`} className={styles.launchpadGridPage}>
                {isPageVisible(index) ? (
                  <LaunchpadGrid
                    apps={pageApps}
                    searchMode={searchQuery.trim().length > 0}
                    highlightFirst={pageIndex === 0 && index === pageIndex}
                  />
                ) : (
                  <div className={styles.launchpadGridPlaceholder} aria-hidden={true} />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      )}
      {showPagination && !showEmptyState ? (
        <div className={styles.launchpadPagination} aria-hidden={true}>
          {Array.from({length: pageCount}).map((_, index) => (
            <span
              key={`launchpad-page-dot-${index + 1}`}
              className={`${styles.launchpadDot} ${index === pageIndex ? styles.launchpadDotActive : ''}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default LaunchpadPanel;
