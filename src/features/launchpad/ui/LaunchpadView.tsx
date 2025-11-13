import {motion} from 'framer-motion';
import {createPortal} from 'react-dom';
import type {CSSProperties, MouseEvent as ReactMouseEvent, ReactNode} from 'react';
import type {PointerEvent} from 'react';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {LaunchpadMoveMode} from '../model/useLaunchpadLayout';
import {filterApps, paginateApps} from '../model/layout';
import type {LaunchpadDisplayItem} from '../model/types';
import type {LaunchpadPhase} from './LaunchpadOverlay';
import {ScreenBackground} from '../../../shared/ui/screen-background';
import {useGettingRef} from '../../../shared/hooks/useGettingRef';
import {getElementBelowPoint, useMouseDrag} from '../../../shared/dnd/useMouseDrag';
import {LaunchpadGridItemVisual, getLaunchpadGridItemClassName} from './grid/LaunchpadGrid';
import launchpadGridStyles from './grid/LaunchpadGrid.module.css';
import {getLaunchpadGridTrackTransition, launchpadViewVariants, SLIDE_DURATION_MS} from '../lib/launchpadViewMotion';
import {useLaunchpadSwipe} from '../lib/useLaunchpadSwipe';
import LaunchpadGridTrack from './LaunchpadGridTrack';
import LaunchpadPagination from './LaunchpadPagination';
import LaunchpadSearchBar from './LaunchpadSearchBar';
import styles from './Launchpad.module.css';
import {LAUNCHPAD_PAGE_COLUMNS, LAUNCHPAD_PAGE_SIZE} from '../model/constants';

type LaunchpadViewProps = {
  apps: LaunchpadDisplayItem[];
  pagedApps: LaunchpadDisplayItem[][];
  isFirstOpening: boolean;
  isOpen: boolean;
  isClosing: boolean;
  phase: LaunchpadPhase;
  onMoveApp: (fromIndex: number, toIndex: number, mode?: LaunchpadMoveMode) => void;
  onMoveAppToNewPage: (fromIndex: number) => void;
  onMoveAppToPageEnd: (fromIndex: number, targetPageIndex: number) => void;
  onCopyAppToDock: (appKey: string) => void;
  onDockDragHoverChange?: (clientX: number | null, clientY: number | null) => void;
  onClose: () => void;
};

const PAGE_TURN_EDGE_THRESHOLD = 88;
const PAGE_TURN_DELAY_MS = 170;
const PAGE_TURN_REARM_DISTANCE = 96;
const PAGE_TURN_HOLD_DELAY_MS = 1400;
const DRAG_ACTIVATION_DISTANCE = 10;
const LAUNCHPAD_GRID_COLUMNS = 7;
const NEAREST_TARGET_MAX_DISTANCE = 92;

type DragPortalMetrics = {
  left: number;
  top: number;
  scaleX: number;
  scaleY: number;
};

type DragPreviewItem = {
  icon: ReactNode;
  iconSrc?: string;
  label: string;
};

const LaunchpadView = ({apps, pagedApps, isFirstOpening, isOpen, isClosing, phase, onMoveApp, onMoveAppToNewPage, onMoveAppToPageEnd, onCopyAppToDock, onDockDragHoverChange, onClose}: LaunchpadViewProps) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [isItemDragging, setIsItemDragging] = useState(false);
  const [hasProvisionalPage, setHasProvisionalPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hasSearchFocusHistory, setHasSearchFocusHistory] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [isPageTurnSettling, setIsPageTurnSettling] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const slideTimerRef = useRef<number | null>(null);
  const pageTurnTimerRef = useRef<number | null>(null);
  const pageTurnSettlingTimerRef = useRef<number | null>(null);
  const pageTurnHoldTimerRef = useRef<number | null>(null);
  const pendingPageTurnRef = useRef<-1 | 1 | null>(null);
  const pageTurnLockDirectionRef = useRef<-1 | 1 | null>(null);
  const isPageTurnDirectionRearmedRef = useRef(true);
  const previousPageIndexRef = useRef(0);
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [hoveredTargetKey, setHoveredTargetKey] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<{left: number; top: number} | null>(null);
  const [dragOriginRect, setDragOriginRect] = useState<{left: number; top: number; width: number; height: number} | null>(null);
  const [dragPortalHost, setDragPortalHost] = useState<HTMLElement | null>(null);
  const [dragPortalMetrics, setDragPortalMetrics] = useState<DragPortalMetrics | null>(null);
  const [dragOverlayVars, setDragOverlayVars] = useState<CSSProperties | null>(null);
  const [dragOverlayClassName, setDragOverlayClassName] = useState(launchpadGridStyles.item);
  const [dragPreviewItem, setDragPreviewItem] = useState<DragPreviewItem | null>(null);
  const [hasDragged, setHasDragged] = useState(false);
  const hasDraggedRef = useRef(false);
  const hasMovedDuringDragRef = useRef(false);
  const lastMoveSignatureRef = useRef<string | null>(null);
  const dragAxisRef = useRef<'horizontal' | 'vertical'>('horizontal');
  const dragOriginColumnRef = useRef<number | null>(null);
  const previousDragClientPositionRef = useRef<{x: number; y: number} | null>(null);
  const stopDragRef = useRef<() => void>(() => {});
  const {elementRef: gridViewportElement, setElementRef: setGridViewportRef} = useGettingRef<HTMLDivElement>({
    onChange: node => {
      setViewportWidth(node?.offsetWidth ?? 0);
    },
  });
  const filteredApps = useMemo(() => filterApps(apps, searchQuery), [apps, searchQuery]);
  const isSearchMode = searchQuery.trim().length > 0;
  const basePagedApps = useMemo(() => (isSearchMode ? paginateApps(filteredApps) : pagedApps), [filteredApps, isSearchMode, pagedApps]);
  const renderedPagedApps = useMemo(
    () => (!isSearchMode && hasProvisionalPage ? [...basePagedApps, []] : basePagedApps),
    [basePagedApps, hasProvisionalPage, isSearchMode],
  );
  const actualPageCount = Math.max(1, basePagedApps.length);
  const pageCount = Math.max(1, renderedPagedApps.length);
  const showPagination = pageCount > 1;
  const showEmptyState = searchQuery.trim().length > 0 && filteredApps.length === 0;
  const moveItemByKey = useCallback(
    (fromKey: string, toKey: string, mode: LaunchpadMoveMode) => {
      const fromIndex = apps.findIndex(app => app.key === fromKey);
      const toIndex = apps.findIndex(app => app.key === toKey);

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
        return;
      }

      onMoveApp(fromIndex, toIndex, mode);
    },
    [apps, onMoveApp],
  );
  const shouldHoldSearchVisual = isClosing && (isSearchFocused || searchQuery.trim().length > 0);
  const isPhaseOpen = phase === 'open';
  const canTurnToPreviousPage = pageIndex > 0;
  const canTurnToNextPage = pageIndex < pageCount - 1;
  const focusSearchInput = useCallback(() => {
    if (!isPhaseOpen || !hasSearchFocusHistory) return;
    setIsSearchFocused(true);
    window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  }, [hasSearchFocusHistory, isPhaseOpen]);
  const {
    dragOffset,
    isDragging: isPanelSwiping,
    handlePointerDown: handleSwipePointerDown,
    handlePointerMove: handleSwipePointerMove,
    handlePointerUp: handleSwipePointerUp,
  } = useLaunchpadSwipe({
    enabled: !isItemDragging,
    viewportWidth,
    pageCount,
    onPageIndexChange: setPageIndex,
    onTapBlank: onClose,
    onTapInteractive: focusSearchInput,
  });
  useEffect(() => {
    if (phase === 'hidden') {
      setPageIndex(0);
      setIsItemDragging(false);
      setDragKey(null);
      setHoveredTargetKey(null);
      setDragPosition(null);
      setDragOriginRect(null);
      setDragPortalHost(null);
      setDragPortalMetrics(null);
      setDragOverlayVars(null);
      setDragPreviewItem(null);
      setHasDragged(false);
      setSearchQuery('');
      setIsSearchFocused(false);
      setHasSearchFocusHistory(false);
      setIsSliding(false);
      setIsPageTurnSettling(false);
      setHasProvisionalPage(false);
      pageTurnLockDirectionRef.current = null;
      isPageTurnDirectionRearmedRef.current = true;
      return;
    }
    setPageIndex(prev => Math.min(prev, pageCount - 1));
  }, [pageCount, phase]);

  useEffect(() => {
    setPageIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    if (slideTimerRef.current !== null) {
      window.clearTimeout(slideTimerRef.current);
      slideTimerRef.current = null;
    }

    if (!isPhaseOpen || isItemDragging || isPanelSwiping) {
      setIsSliding(false);
      return;
    }

    setIsSliding(true);
    slideTimerRef.current = window.setTimeout(() => {
      setIsSliding(false);
      slideTimerRef.current = null;
    }, SLIDE_DURATION_MS + 40);
  }, [isItemDragging, isPanelSwiping, isPhaseOpen, pageIndex]);

  useEffect(() => {
    if (!gridViewportElement) {
      return;
    }

    const updateViewportWidth = () => {
      setViewportWidth(gridViewportElement.offsetWidth);
    };

    updateViewportWidth();
    const frameId = window.requestAnimationFrame(updateViewportWidth);
    window.addEventListener('resize', updateViewportWidth);

    let observer: ResizeObserver | null = null;
    if ('ResizeObserver' in window) {
      observer = new ResizeObserver(updateViewportWidth);
      observer.observe(gridViewportElement);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', updateViewportWidth);
      observer?.disconnect();
    };
  }, [gridViewportElement]);

  useEffect(() => {
    const previousPageIndex = previousPageIndexRef.current;
    previousPageIndexRef.current = pageIndex;

    if (pageTurnSettlingTimerRef.current !== null) {
      window.clearTimeout(pageTurnSettlingTimerRef.current);
      pageTurnSettlingTimerRef.current = null;
    }

    if (!isItemDragging || previousPageIndex === pageIndex) {
      setIsPageTurnSettling(false);
      return;
    }

    setIsPageTurnSettling(true);
    pageTurnSettlingTimerRef.current = window.setTimeout(() => {
      setIsPageTurnSettling(false);
      pageTurnSettlingTimerRef.current = null;
    }, SLIDE_DURATION_MS + 40);
  }, [isItemDragging, pageIndex]);

  useEffect(() => {
    if (!isItemDragging) {
      return;
    }

    lastMoveSignatureRef.current = null;
  }, [apps, isItemDragging]);

  useEffect(() => {
    return () => {
      if (slideTimerRef.current !== null) {
        window.clearTimeout(slideTimerRef.current);
      }
      if (pageTurnTimerRef.current !== null) {
        window.clearTimeout(pageTurnTimerRef.current);
      }
      if (pageTurnSettlingTimerRef.current !== null) {
        window.clearTimeout(pageTurnSettlingTimerRef.current);
      }
      if (pageTurnHoldTimerRef.current !== null) {
        window.clearTimeout(pageTurnHoldTimerRef.current);
      }
    };
  }, []);

  const clearPendingPageTurn = useCallback(() => {
    if (pageTurnTimerRef.current !== null) {
      window.clearTimeout(pageTurnTimerRef.current);
      pageTurnTimerRef.current = null;
    }
    pendingPageTurnRef.current = null;
  }, []);

  const clearPageTurnHold = useCallback(() => {
    if (pageTurnHoldTimerRef.current !== null) {
      window.clearTimeout(pageTurnHoldTimerRef.current);
      pageTurnHoldTimerRef.current = null;
    }
  }, []);

  const schedulePageTurn = useCallback(
    (direction: -1 | 1, delay = PAGE_TURN_DELAY_MS) => {
      if (!isPageTurnDirectionRearmedRef.current && pageTurnLockDirectionRef.current === direction) {
        return;
      }

      if (pageTurnTimerRef.current !== null && pendingPageTurnRef.current === direction) {
        return;
      }

      clearPendingPageTurn();
      pendingPageTurnRef.current = direction;
      pageTurnTimerRef.current = window.setTimeout(() => {
        setPageIndex(prev => {
          if (direction < 0) {
            return Math.max(prev - 1, 0);
          }
          return Math.min(prev + 1, pageCount - 1);
        });
        pageTurnLockDirectionRef.current = direction;
        isPageTurnDirectionRearmedRef.current = false;
        pageTurnTimerRef.current = null;
        pendingPageTurnRef.current = null;
      }, delay);
    },
    [clearPendingPageTurn, pageCount],
  );

  const handleLaunchpadItemDragMove = useCallback(
    (clientX: number, clientY: number) => {
      const dockTarget = document.elementFromPoint(clientX, clientY)?.closest("[data-dock-root='true']");
      onDockDragHoverChange?.(dockTarget ? clientX : null, dockTarget ? clientY : null);

      if (isSearchMode) {
        clearPendingPageTurn();
        clearPageTurnHold();
        return;
      }

      const viewportElement =
        gridViewportElement ??
        document.querySelector<HTMLElement>(`.${styles.launchpadGridViewport.replace(/\s+/g, '.')}`);
      const viewportRect = viewportElement?.getBoundingClientRect();
      if (!viewportRect) {
        clearPendingPageTurn();
        clearPageTurnHold();
        return;
      }

      const isNearLeftEdge = clientX <= viewportRect.left + PAGE_TURN_EDGE_THRESHOLD;
      const isNearRightEdge = clientX >= viewportRect.right - PAGE_TURN_EDGE_THRESHOLD;
      const isOnActualLastPage = pageIndex === actualPageCount - 1;
      const isOnProvisionalPage = hasProvisionalPage && pageIndex === actualPageCount;
      const hasMovedAwayFromRightEdge = clientX <= viewportRect.right - PAGE_TURN_EDGE_THRESHOLD - PAGE_TURN_REARM_DISTANCE;
      const hasMovedAwayFromLeftEdge = clientX >= viewportRect.left + PAGE_TURN_EDGE_THRESHOLD + PAGE_TURN_REARM_DISTANCE;

      if (!isPageTurnDirectionRearmedRef.current) {
        const movedBackEnough =
          pageTurnLockDirectionRef.current === 1
            ? hasMovedAwayFromRightEdge
            : pageTurnLockDirectionRef.current === -1
              ? hasMovedAwayFromLeftEdge
              : false;

        if (movedBackEnough) {
          isPageTurnDirectionRearmedRef.current = true;
          pageTurnLockDirectionRef.current = null;
        }
      }

      if (isNearLeftEdge && canTurnToPreviousPage) {
        clearPageTurnHold();
        schedulePageTurn(-1);
        return;
      }

      if (isOnProvisionalPage) {
        clearPendingPageTurn();
        clearPageTurnHold();
        return;
      }

      if (isNearRightEdge && (canTurnToNextPage || isOnActualLastPage)) {
        if (!isPageTurnDirectionRearmedRef.current && pageTurnLockDirectionRef.current === 1) {
          if (pageTurnHoldTimerRef.current === null) {
            pageTurnHoldTimerRef.current = window.setTimeout(() => {
              isPageTurnDirectionRearmedRef.current = true;
              pageTurnLockDirectionRef.current = null;
              pageTurnHoldTimerRef.current = null;
              if (pageIndex === actualPageCount - 1 && !hasProvisionalPage) {
                setHasProvisionalPage(true);
                schedulePageTurn(1, PAGE_TURN_DELAY_MS);
                return;
              }
              schedulePageTurn(1, PAGE_TURN_DELAY_MS);
            }, PAGE_TURN_HOLD_DELAY_MS);
          }
          return;
        }

        clearPageTurnHold();
        if (isOnActualLastPage && !hasProvisionalPage) {
          setHasProvisionalPage(true);
          clearPendingPageTurn();
          pendingPageTurnRef.current = 1;
          pageTurnTimerRef.current = window.setTimeout(() => {
            setPageIndex(actualPageCount);
            pageTurnLockDirectionRef.current = 1;
            isPageTurnDirectionRearmedRef.current = false;
            pageTurnTimerRef.current = null;
            pendingPageTurnRef.current = null;
          }, PAGE_TURN_DELAY_MS);
          return;
        }

        schedulePageTurn(1);
        return;
      }

      clearPendingPageTurn();
      clearPageTurnHold();
    },
    [actualPageCount, canTurnToNextPage, canTurnToPreviousPage, clearPageTurnHold, clearPendingPageTurn, gridViewportElement, hasProvisionalPage, isSearchMode, onDockDragHoverChange, schedulePageTurn],
  );

  useEffect(() => {
    const shouldHardKeepFocus = isPhaseOpen && hasSearchFocusHistory && isSearchFocused && (isSliding || isItemDragging);
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
  }, [hasSearchFocusHistory, isItemDragging, isPhaseOpen, isSearchFocused, isSliding]);

  const handlePanelPointerDownCapture = useCallback((event: PointerEvent<HTMLElement>) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest("[data-launchpad-grid-item='true']")) {
      return;
    }
    const clickedInteractive = target?.closest("[data-launchpad-interactive='true']");
    if (!clickedInteractive) {
      event.preventDefault();
    }
  }, []);

  const handleSearchFocusChange = useCallback((focused: boolean) => {
    setIsSearchFocused(focused);
    if (focused) {
      setHasSearchFocusHistory(true);
    }
  }, []);

  const handleItemDragStateChange = useCallback(
    (dragging: boolean) => {
      setIsItemDragging(dragging);
      if (!dragging) {
        setIsPageTurnSettling(false);
        clearPendingPageTurn();
        clearPageTurnHold();
        onDockDragHoverChange?.(null, null);
        pageTurnLockDirectionRef.current = null;
        isPageTurnDirectionRearmedRef.current = true;
      }
    },
    [clearPageTurnHold, clearPendingPageTurn, onDockDragHoverChange],
  );

  const resetDragSession = useCallback(() => {
    setDragKey(null);
    setHoveredTargetKey(null);
    setDragPortalHost(null);
    setDragPortalMetrics(null);
    setDragOverlayVars(null);
    setDragOverlayClassName(launchpadGridStyles.item);
    setDragPreviewItem(null);
    setHasDragged(false);
    setDragPosition(null);
    setDragOriginRect(null);
    hasDraggedRef.current = false;
    hasMovedDuringDragRef.current = false;
    lastMoveSignatureRef.current = null;
    dragAxisRef.current = 'horizontal';
    dragOriginColumnRef.current = null;
    previousDragClientPositionRef.current = null;
  }, []);

const isPointInsideItemZone = (clientX: number, clientY: number, rect: DOMRect) => {
  const expandX = Math.min(10, rect.width * 0.08);
  const expandY = Math.min(10, rect.height * 0.08);

  return (
    clientX >= rect.left - expandX &&
    clientX <= rect.right + expandX &&
    clientY >= rect.top - expandY &&
    clientY <= rect.bottom + expandY
  );
};

const HORIZONTAL_ROW_CAPTURE_PX = 18;
const LAUNCHPAD_GRID_ITEM_WIDTH = 120;
const LAUNCHPAD_GRID_COLUMN_GAP = 30;
const LAUNCHPAD_GRID_ROW_GAP = 20;
const SLOT_DEAD_ZONE_PX = 10;

const getUniqueSortedValues = (values: number[], tolerance = 8) =>
  values
    .slice()
    .sort((left, right) => left - right)
    .reduce<number[]>((accumulator, value) => {
      const lastValue = accumulator.at(-1);
      if (typeof lastValue === 'number' && Math.abs(lastValue - value) <= tolerance) {
        return accumulator;
      }

      accumulator.push(value);
      return accumulator;
    }, []);

  const getHoveredItemElement = useCallback(
    (
      clientX: number,
      clientY: number,
      draggingKey: string,
      axis: 'horizontal' | 'vertical',
    ) => {
      const pageElements = Array.from(document.querySelectorAll<HTMLElement>("[data-launchpad-grid-page='true']"));
      const pageElement =
        pageElements.find(candidate => {
          const rect = candidate.getBoundingClientRect();
          return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
        }) ?? null;

      if (!pageElement) {
        return null;
      }

      const pageIndexValue = Number(pageElement.dataset.launchpadPageIndex);
      const pageApps = renderedPagedApps[pageIndexValue] ?? [];
      const gridRoot = pageElement.querySelector<HTMLElement>("[data-launchpad-grid-root='true']");
      const itemElements = Array.from(pageElement.querySelectorAll<HTMLElement>("[data-launchpad-grid-item='true']"));
      const searchElements = itemElements
        .filter(itemElement => itemElement.dataset.launchpadKey !== draggingKey)
        .map(itemElement => ({
          itemElement,
          rect: itemElement.getBoundingClientRect(),
        }));

      if (searchElements.length === 0) {
        return null;
      }

      for (const candidate of searchElements) {
        if (isPointInsideItemZone(clientX, clientY, candidate.rect)) {
          return null;
        }
      }

      const gridRect = gridRoot?.getBoundingClientRect();
      const uniqueLefts = getUniqueSortedValues(searchElements.map(candidate => candidate.rect.left));
      const uniqueTops = getUniqueSortedValues(searchElements.map(candidate => candidate.rect.top));
      const itemWidth = searchElements[0]?.rect.width ?? LAUNCHPAD_GRID_ITEM_WIDTH;
      const itemHeight = searchElements[0]?.rect.height ?? searchElements[0]?.rect.width ?? LAUNCHPAD_GRID_ITEM_WIDTH;
      const columnStep =
        uniqueLefts.length > 1 ? uniqueLefts[1] - uniqueLefts[0] : itemWidth + LAUNCHPAD_GRID_COLUMN_GAP;
      const rowStep =
        uniqueTops.length > 1 ? uniqueTops[1] - uniqueTops[0] : itemHeight + LAUNCHPAD_GRID_ROW_GAP;
      const firstColumnLeft =
        uniqueLefts[0] ??
        (gridRect ? gridRect.left + Math.max((gridRect.width - (itemWidth * LAUNCHPAD_PAGE_COLUMNS + LAUNCHPAD_GRID_COLUMN_GAP * (LAUNCHPAD_PAGE_COLUMNS - 1))) / 2, 0) : 0);
      const firstRowTop = uniqueTops[0] ?? gridRect?.top ?? 0;
      const rawColumn = Math.round((clientX - firstColumnLeft) / columnStep);
      const rawRow = Math.round((clientY - firstRowTop) / rowStep);
      const nextColumn = Math.max(0, Math.min(LAUNCHPAD_PAGE_COLUMNS - 1, rawColumn));
      const nextRow = Math.max(0, rawRow);
      const slotIndex = nextRow * LAUNCHPAD_PAGE_COLUMNS + nextColumn;
      const clampedSlotIndex = Math.max(0, Math.min(pageApps.length - 1, slotIndex));
      const targetKey = pageApps[clampedSlotIndex]?.key;

      if (!targetKey) {
        return null;
      }

      const targetCandidate = searchElements.find(candidate => candidate.itemElement.dataset.launchpadKey === targetKey);
      if (!targetCandidate) {
        return null;
      }

      const deadZoneRect = {
        left: targetCandidate.rect.left - SLOT_DEAD_ZONE_PX,
        right: targetCandidate.rect.right + SLOT_DEAD_ZONE_PX,
        top: targetCandidate.rect.top - SLOT_DEAD_ZONE_PX,
        bottom: targetCandidate.rect.bottom + SLOT_DEAD_ZONE_PX,
      };

      if (clientX >= deadZoneRect.left && clientX <= deadZoneRect.right && clientY >= deadZoneRect.top && clientY <= deadZoneRect.bottom) {
        return null;
      }

      return targetCandidate.itemElement;
    },
    [apps, renderedPagedApps],
  );

  const handleDragStart = useCallback(
    (session: {meta: string; rect: DOMRect; startClientX: number; startClientY: number}) => {
      setDragKey(session.meta);
      setHoveredTargetKey(null);
      hasDraggedRef.current = false;
      lastMoveSignatureRef.current = null;
      dragOriginColumnRef.current = apps.findIndex(app => app.key === session.meta) % LAUNCHPAD_GRID_COLUMNS;
      const sourceItem = apps.find(app => app.key === session.meta) ?? null;
      setDragPreviewItem(
        sourceItem
          ? {
              icon: sourceItem.icon,
              iconSrc: sourceItem.iconSrc,
              label: sourceItem.label,
            }
          : null,
      );
      setHasDragged(false);
      hasMovedDuringDragRef.current = false;
      previousDragClientPositionRef.current = {
        x: session.startClientX,
        y: session.startClientY,
      };
      setDragPosition({
        left: session.rect.left,
        top: session.rect.top,
      });
      setDragOriginRect({
        left: session.rect.left,
        top: session.rect.top,
        width: session.rect.width,
        height: session.rect.height,
      });
      handleItemDragStateChange(true);
    },
    [apps, handleItemDragStateChange],
  );

  const handleDragMove = useCallback(
    (payload: {meta: string; left: number; top: number; clientX: number; clientY: number; deltaX: number; deltaY: number}) => {
      const dragDistance = Math.hypot(payload.deltaX, payload.deltaY);
      if (!hasDraggedRef.current && dragDistance < DRAG_ACTIVATION_DISTANCE) {
        return;
      }

      if (!hasDraggedRef.current) {
        hasDraggedRef.current = true;
        setHasDragged(true);
      }

      setDragPosition({
        left: payload.left,
        top: payload.top,
      });
      handleLaunchpadItemDragMove(payload.clientX, payload.clientY);
      dragAxisRef.current = Math.abs(payload.deltaY) > Math.abs(payload.deltaX) + 6 ? 'vertical' : 'horizontal';

      const hoveredItemElement = getHoveredItemElement(
        payload.clientX,
        payload.clientY,
        payload.meta,
        dragAxisRef.current,
      );
      previousDragClientPositionRef.current = {
        x: payload.clientX,
        y: payload.clientY,
      };
      const targetKey = hoveredItemElement?.dataset.launchpadKey ?? null;
      const nextTargetKey = targetKey && targetKey !== payload.meta ? targetKey : null;
      setHoveredTargetKey(nextTargetKey);
      if (!nextTargetKey) {
        return;
      }

      const sourceIndex = apps.findIndex(app => app.key === payload.meta);
      const targetIndex = apps.findIndex(app => app.key === nextTargetKey);
      if (targetIndex === -1 || sourceIndex === targetIndex) {
        return;
      }

      const moveMode: LaunchpadMoveMode = 'reorder';
      const moveSignature = `${moveMode}:${nextTargetKey}`;
      if (moveSignature === lastMoveSignatureRef.current) {
        return;
      }

      lastMoveSignatureRef.current = moveSignature;
      hasMovedDuringDragRef.current = true;
      moveItemByKey(payload.meta, nextTargetKey, moveMode);
    },
    [apps, getHoveredItemElement, handleLaunchpadItemDragMove, moveItemByKey],
  );

  const handleItemDragEnd = useCallback(
    (appKey: string) => {
      if (hasProvisionalPage && !isSearchMode && pageIndex === actualPageCount) {
        const fromIndex = apps.findIndex(app => app.key === appKey);
        if (fromIndex !== -1) {
          onMoveAppToNewPage(fromIndex);
        }
      }

      setHasProvisionalPage(false);
    },
    [actualPageCount, apps, hasProvisionalPage, isSearchMode, onMoveAppToNewPage, pageIndex],
  );

  const handleDragEnd = useCallback((payload: {meta: string} & Partial<{clientX: number; clientY: number}>) => {
    const overlay = document.querySelector<HTMLElement>("[data-launchpad-drag-overlay='true']");
    const target =
      hasDraggedRef.current && typeof payload.clientX === 'number' && typeof payload.clientY === 'number'
        ? getElementBelowPoint(payload.clientX, payload.clientY, overlay)
        : null;

    if (hasDraggedRef.current && typeof payload.clientX === 'number' && typeof payload.clientY === 'number') {
      if (target?.closest("[data-dock-root='true']")) {
        onCopyAppToDock?.(payload.meta);
      }
    }

    const canDropToCurrentPageEnd = !isSearchMode && (!hasProvisionalPage || pageIndex !== actualPageCount);

    if (hasDraggedRef.current && !target?.closest("[data-dock-root='true']") && hoveredTargetKey === null && !hasMovedDuringDragRef.current && canDropToCurrentPageEnd) {
      const fromIndex = apps.findIndex(app => app.key === payload.meta);
      const currentPageApps = basePagedApps[pageIndex] ?? [];

      if (fromIndex !== -1 && currentPageApps.length < LAUNCHPAD_PAGE_SIZE) {
        onMoveAppToPageEnd(fromIndex, pageIndex);
      }
    }

    handleItemDragEnd(payload.meta);
    handleItemDragStateChange(false);
    resetDragSession();
  }, [actualPageCount, apps, basePagedApps, handleItemDragEnd, handleItemDragStateChange, hasProvisionalPage, hoveredTargetKey, isSearchMode, onCopyAppToDock, onMoveAppToPageEnd, pageIndex, resetDragSession]);

  const {startDrag, stopDrag} = useMouseDrag<string>({
    onStart: handleDragStart,
    onMove: handleDragMove,
    onEnd: handleDragEnd,
  });
  stopDragRef.current = stopDrag;

  const handleItemMouseDown = useCallback(
    (app: LaunchpadDisplayItem, index: number, event: ReactMouseEvent<HTMLDivElement>) => {
      if (isSearchMode) {
        return;
      }

      const currentTarget = event.currentTarget;
      const iconEl = currentTarget.querySelector<HTMLElement>(`.${launchpadGridStyles.icon}`);
      const labelEl = currentTarget.querySelector<HTMLElement>(`.${launchpadGridStyles.label}`);
      const itemStyle = window.getComputedStyle(currentTarget);
      const iconStyle = iconEl ? window.getComputedStyle(iconEl) : null;
      const labelStyle = labelEl ? window.getComputedStyle(labelEl) : null;
      const portalHost = document.body;

      setDragOverlayVars({
        '--launchpad-item-width': itemStyle.width,
        '--launchpad-icon-size': iconStyle?.width ?? '96px',
        '--launchpad-label-color': labelStyle?.color ?? 'inherit',
        '--launchpad-label-shadow': labelStyle?.textShadow ?? 'none',
      } as CSSProperties);
      setDragOverlayClassName(
        getLaunchpadGridItemClassName({
          index,
          searchMode: isSearchMode,
          highlightFirst: pageIndex === 0,
        }),
      );
      setDragPortalHost(portalHost);
      setDragPortalMetrics({
        left: 0,
        top: 0,
        scaleX: 1,
        scaleY: 1,
      });
      startDrag(event, app.key);
    },
    [isSearchMode, pageIndex, startDrag],
  );

  useEffect(() => {
    if (phase !== 'hidden') return;
    onDockDragHoverChange?.(null, null);
  }, [onDockDragHoverChange, phase]);

  useEffect(() => stopDrag, [stopDrag]);

  return (
    <motion.section
      className={styles.launchpadPanel}
      aria-label="Launchpad"
      variants={launchpadViewVariants}
      initial={isFirstOpening ? 'open' : false}
      animate={phase}
      onPointerDownCapture={handlePanelPointerDownCapture}
      onPointerDown={handleSwipePointerDown}
      onPointerMove={handleSwipePointerMove}
      onPointerUp={handleSwipePointerUp}
      onPointerCancel={handleSwipePointerUp}>
      <ScreenBackground blurred={true} className={styles.background} />
      <LaunchpadSearchBar
        value={searchQuery}
        isFocused={isSearchFocused}
        holdFocusedVisual={shouldHoldSearchVisual}
        disableAnimation={phase === 'hidden'}
        keepFocus={isPhaseOpen && hasSearchFocusHistory}
        inputRef={searchInputRef}
        onChange={setSearchQuery}
        onFocusChange={handleSearchFocusChange}
      />
      {showEmptyState ? (
        <div className={styles.launchpadSearchEmpty}>결과 없음</div>
      ) : (
        <div ref={setGridViewportRef} className={styles.launchpadGridViewport}>
          <motion.div
            className={styles.launchpadGridTrack}
            animate={{x: -(pageIndex * viewportWidth) + dragOffset}}
            transition={getLaunchpadGridTrackTransition(isPanelSwiping)}>
            <LaunchpadGridTrack
              pagedApps={renderedPagedApps}
              pageIndex={pageIndex}
              isItemDragging={isItemDragging}
              isSearchMode={isSearchMode}
              draggingKey={dragKey}
              hoveredTargetKey={hoveredTargetKey}
              hasDragged={hasDragged}
              onItemMouseDown={handleItemMouseDown}
            />
          </motion.div>
        </div>
      )}
      {showPagination && !showEmptyState ? <LaunchpadPagination pageCount={pageCount} pageIndex={pageIndex} /> : null}
      {dragKey !== null && hasDragged && dragOriginRect && dragPosition && dragOverlayVars && dragPortalHost && dragPortalMetrics
        ? createPortal(
            <motion.div
              className={`${dragOverlayClassName} ${launchpadGridStyles.dragOverlay}`.trim()}
              data-launchpad-drag-overlay="true"
              style={{
                width: dragOriginRect.width / dragPortalMetrics.scaleX,
                height: dragOriginRect.height / dragPortalMetrics.scaleY,
                left: (dragPosition.left - dragPortalMetrics.left) / dragPortalMetrics.scaleX,
                top: (dragPosition.top - dragPortalMetrics.top) / dragPortalMetrics.scaleY,
                ...dragOverlayVars,
              }}
              animate={{x: 0, y: 0, scale: 1}}
              transition={{type: 'spring', stiffness: 560, damping: 38, mass: 0.72}}
              aria-hidden={true}>
              <LaunchpadGridItemVisual icon={dragPreviewItem?.icon} iconSrc={dragPreviewItem?.iconSrc} label={dragPreviewItem?.label ?? ''} overlay={true} />
            </motion.div>,
            dragPortalHost,
          )
        : null}
    </motion.section>
  );
};

export default LaunchpadView;
