import {motion} from 'framer-motion';
import type {PointerEvent} from 'react';
import {useEffect, useMemo, useRef, useState} from 'react';
import {LaunchpadGrid} from '../../../../design-system/components';
import {
  filterApps,
  LAUNCHPAD_PAGE_SIZE,
  LaunchpadSearchBar,
  paginateApps,
  type LaunchpadAppItem,
} from '../../../launchpad';
import styles from '../DesktopScreen.module.css';

type LaunchpadOverlayMotionProps = {
  isOpen: boolean;
  apps: LaunchpadAppItem[];
  onClose: () => void;
};

const SWIPE_THRESHOLD = 56;
const CLOSE_ANIMATION_MS = 220;
type LaunchpadPhase = 'hidden' | 'open' | 'closing';

const overlayMotion = {
  hidden: {},
  visible: {},
} as const;

const panelMotion = {
  hidden: {},
  visible: {},
} as const;

const LaunchpadOverlayMotion = ({isOpen, apps, onClose}: LaunchpadOverlayMotionProps) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [phase, setPhase] = useState<LaunchpadPhase>(isOpen ? 'open' : 'hidden');
  const closeTimerRef = useRef<number | null>(null);
  const swipeStartX = useRef<number | null>(null);
  const swipeStartY = useRef<number | null>(null);
  const gridViewportRef = useRef<HTMLDivElement | null>(null);
  const isClosing = phase === 'closing';
  const filteredApps = useMemo(() => filterApps(apps, searchQuery), [apps, searchQuery]);

  const pageCount = Math.max(1, Math.ceil(filteredApps.length / LAUNCHPAD_PAGE_SIZE));
  const showPagination = pageCount > 1;
  const isPageVisible = (index: number) => Math.abs(index - pageIndex) <= 1;
  const pagedApps = useMemo(() => paginateApps(filteredApps), [filteredApps]);

  useEffect(() => {
    if (isOpen) {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setPhase('open');
      return;
    }

    if (phase !== 'open') {
      return;
    }

    setPhase('closing');
    closeTimerRef.current = window.setTimeout(() => {
      setPhase('hidden');
      closeTimerRef.current = null;
    }, CLOSE_ANIMATION_MS);
  }, [isOpen, phase]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen && phase === 'hidden') {
      setPageIndex(0);
      setDragOffset(0);
      setIsDragging(false);
      setSearchQuery('');
      setIsSearchFocused(false);
      return;
    }

    setPageIndex(prev => Math.min(prev, pageCount - 1));
  }, [isOpen, pageCount, phase]);

  useEffect(() => {
    setPageIndex(0);
    setDragOffset(0);
  }, [searchQuery]);

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
      return;
    }
    if (!clickedItem) {
      onClose();
    }
  };

  return (
    <motion.div
      className={`${styles.launchpadOverlay} ${
        phase === 'open'
          ? styles.launchpadOverlayOpen
          : phase === 'closing'
            ? styles.launchpadOverlayClosing
            : styles.launchpadOverlayBehind
      } ${isOpen ? styles.launchpadOverlayEnter : ''}`}
      onPointerDown={onClose}
      variants={overlayMotion}
      initial={false}
      animate={isOpen ? 'visible' : 'hidden'}>
      <motion.section
        className={`${styles.launchpadPanel} ${isOpen ? styles.launchpadPanelEnter : ''} ${
          isClosing ? styles.launchpadPanelExit : ''
        }`}
        aria-label="Launchpad"
        variants={panelMotion}
        initial={false}
        animate={isOpen ? 'visible' : 'hidden'}
        onPointerDown={handlePanelPointerDown}
        onPointerMove={handlePanelPointerMove}
        onPointerUp={handlePanelPointerUp}
        onPointerCancel={handlePanelPointerUp}>
        <LaunchpadSearchBar
          value={searchQuery}
          isFocused={isSearchFocused}
          onChange={setSearchQuery}
          onFocusChange={setIsSearchFocused}
        />
        <div className={styles.launchpadGridViewport} ref={gridViewportRef}>
          <motion.div
            className={styles.launchpadGridTrack}
            animate={{
              x: -(pageIndex * viewportWidth) + dragOffset,
              transition: isDragging ? {duration: 0} : {duration: 0.24, ease: 'easeOut'},
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
        {showPagination ? (
          <div className={styles.launchpadPagination} aria-hidden={true}>
            {Array.from({length: pageCount}).map((_, index) => (
              <span
                key={`launchpad-page-dot-${index + 1}`}
                className={`${styles.launchpadDot} ${index === pageIndex ? styles.launchpadDotActive : ''}`}
              />
            ))}
          </div>
        ) : null}
      </motion.section>
    </motion.div>
  );
};

export default LaunchpadOverlayMotion;
