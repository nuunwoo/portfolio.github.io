import {motion} from 'framer-motion';
import type {PointerEvent} from 'react';
import {useEffect, useMemo, useRef, useState} from 'react';
import {LaunchpadGrid} from '../../../design-system/components';
import {LAUNCHPAD_PAGE_SIZE} from '../model/constants';
import {filterApps, paginateApps} from '../model/layout';
import type {LaunchpadAppItem} from '../model/types';
import type {LaunchpadPhase} from '../../desktop/ui/animations/LaunchpadOverlayMotion';
import {ScreenBackground} from '../../../shared/ui/screen-background';
import LaunchpadSearchBar from './LaunchpadSearchBar';
import styles from './Launchpad.module.css';

type LaunchpadPanelProps = {
  apps: LaunchpadAppItem[];
  isOpen: boolean;
  isClosing: boolean;
  phase: LaunchpadPhase;
  onClose: () => void;
};

const SWIPE_THRESHOLD = 56;
const SLIDE_DURATION = 0.38;
const SLIDE_DURATION_MS = 380;
const SLIDE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const panelMotion = {
  hidden: {
    opacity: 0,
    scale: 1.14,
    y: 22,
    filter: 'blur(18px) saturate(1.08)',
    transition: {
      duration: 0,
    },
  },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px) saturate(1)',
    transition: {
      duration: 0.42,
      ease: [0.18, 1, 0.32, 1],
    },
  },
  closing: {
    opacity: 0,
    scale: 1.08,
    y: 10,
    filter: 'blur(10px) saturate(1.02)',
    transition: {
      duration: 0.32,
      ease: [0.4, 0, 1, 1],
    },
  },
} as const;

const LaunchpadPanel = ({apps, isOpen, isClosing, phase, onClose}: LaunchpadPanelProps) => {
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
  const shouldHoldSearchVisual = isClosing && (isSearchFocused || searchQuery.trim().length > 0);
  const isPhaseOpen = phase === 'open';

  useEffect(() => {
    if (phase === 'hidden') {
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
  }, [pageCount, phase]);

  useEffect(() => {
    setPageIndex(0);
    setDragOffset(0);
  }, [searchQuery]);

  useEffect(() => {
    if (slideTimerRef.current !== null) {
      window.clearTimeout(slideTimerRef.current);
      slideTimerRef.current = null;
    }

    if (!isPhaseOpen || isDragging) {
      setIsSliding(false);
      return;
    }

    setIsSliding(true);
    slideTimerRef.current = window.setTimeout(() => {
      setIsSliding(false);
      slideTimerRef.current = null;
    }, SLIDE_DURATION_MS + 40);
  }, [isDragging, isPhaseOpen, pageIndex]);

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
    const shouldHardKeepFocus = isPhaseOpen && hasSearchFocusHistory && isSearchFocused && (isDragging || isSliding);
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
  }, [hasSearchFocusHistory, isDragging, isPhaseOpen, isSearchFocused, isSliding]);

  const focusSearchInput = () => {
    if (!isPhaseOpen || !hasSearchFocusHistory) return;
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
    <motion.section
      className={styles.launchpadPanel}
      aria-label="Launchpad"
      variants={panelMotion}
      initial={false}
      animate={phase}
      onPointerDownCapture={handlePanelPointerDownCapture}
      onPointerDown={handlePanelPointerDown}
      onPointerMove={handlePanelPointerMove}
      onPointerUp={handlePanelPointerUp}
      onPointerCancel={handlePanelPointerUp}>
      <ScreenBackground blurred={true} className={styles.background} />
      <LaunchpadSearchBar
              value={searchQuery}
              isFocused={isSearchFocused}
              holdFocusedVisual={shouldHoldSearchVisual}
              disableAnimation={phase === 'hidden'}
              keepFocus={isPhaseOpen && hasSearchFocusHistory}
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
              transition: isDragging ? {duration: 0} : {duration: SLIDE_DURATION, ease: SLIDE_EASE},
            }}>
            {pagedApps.map((pageApps, index) => (
              <div key={`launchpad-page-${index + 1}`} className={styles.launchpadGridPage}>
                {isPageVisible(index) ? (
                  <LaunchpadGrid apps={pageApps} searchMode={searchQuery.trim().length > 0} highlightFirst={pageIndex === 0 && index === pageIndex} />
                ) : (
                  <div className={styles.launchpadGridPlaceholder} aria-hidden={true} />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      )}
      {showPagination && !showEmptyState && (
        <div className={styles.launchpadPagination} aria-hidden={true}>
          {Array.from({length: pageCount}).map((_, index) => (
            <span key={`launchpad-page-dot-${index + 1}`} className={`${styles.launchpadDot} ${index === pageIndex ? styles.launchpadDotActive : ''}`} />
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default LaunchpadPanel;
