import {useCallback, useEffect, useRef, useState} from 'react';
import {SLIDE_DURATION_MS} from './launchpadViewMotion';

const PAGE_TURN_EDGE_THRESHOLD = 88;
const PAGE_TURN_DELAY_MS = 170;
const PAGE_TURN_REARM_DISTANCE = 96;
const PAGE_TURN_HOLD_DELAY_MS = 1400;

type UseLaunchpadPageTurnParams = {
  actualPageCount: number;
  gridViewportElement: HTMLDivElement | null;
  gridViewportClassName: string;
  isItemDragging: boolean;
  isPhaseOpen: boolean;
  isSearchMode: boolean;
  onDockDragHoverChange?: (clientX: number | null, clientY: number | null) => void;
};

export const useLaunchpadPageTurn = ({
  actualPageCount,
  gridViewportElement,
  gridViewportClassName,
  isItemDragging,
  isPhaseOpen,
  isSearchMode,
  onDockDragHoverChange,
}: UseLaunchpadPageTurnParams) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [hasProvisionalPage, setHasProvisionalPage] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [isPageTurnSettling, setIsPageTurnSettling] = useState(false);

  const slideTimerRef = useRef<number | null>(null);
  const pageTurnTimerRef = useRef<number | null>(null);
  const pageTurnSettlingTimerRef = useRef<number | null>(null);
  const pageTurnHoldTimerRef = useRef<number | null>(null);
  const pendingPageTurnRef = useRef<-1 | 1 | null>(null);
  const pageTurnLockDirectionRef = useRef<-1 | 1 | null>(null);
  const isPageTurnDirectionRearmedRef = useRef(true);
  const previousPageIndexRef = useRef(0);

  const pageCount = Math.max(1, actualPageCount + (hasProvisionalPage && !isSearchMode ? 1 : 0));
  const canTurnToPreviousPage = pageIndex > 0;
  const canTurnToNextPage = pageIndex < pageCount - 1;

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

  const resetPageTurnState = useCallback(() => {
    setHasProvisionalPage(false);
    setIsSliding(false);
    setIsPageTurnSettling(false);
    clearPendingPageTurn();
    clearPageTurnHold();
    pageTurnLockDirectionRef.current = null;
    isPageTurnDirectionRearmedRef.current = true;
  }, [clearPageTurnHold, clearPendingPageTurn]);

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

  const handleDragEdgePaging = useCallback((clientX: number, clientY: number) => {
    const dockTarget = document.elementFromPoint(clientX, clientY)?.closest("[data-dock-root='true']");
    onDockDragHoverChange?.(dockTarget ? clientX : null, dockTarget ? clientY : null);

    if (isSearchMode) {
      clearPendingPageTurn();
      clearPageTurnHold();
      return;
    }

    const viewportElement =
      gridViewportElement ??
      document.querySelector<HTMLElement>(`.${gridViewportClassName.replace(/\s+/g, '.')}`);
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
  }, [
    actualPageCount,
    canTurnToNextPage,
    canTurnToPreviousPage,
    clearPageTurnHold,
    clearPendingPageTurn,
    gridViewportClassName,
    gridViewportElement,
    hasProvisionalPage,
    isSearchMode,
    onDockDragHoverChange,
    pageIndex,
    schedulePageTurn,
  ]);

  useEffect(() => {
    if (slideTimerRef.current !== null) {
      window.clearTimeout(slideTimerRef.current);
      slideTimerRef.current = null;
    }

    if (!isPhaseOpen || isItemDragging) {
      setIsSliding(false);
      return;
    }

    setIsSliding(true);
    slideTimerRef.current = window.setTimeout(() => {
      setIsSliding(false);
      slideTimerRef.current = null;
    }, SLIDE_DURATION_MS + 40);
  }, [isItemDragging, isPhaseOpen, pageIndex]);

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

  return {
    pageIndex,
    pageCount,
    hasProvisionalPage,
    isSliding,
    isPageTurnSettling,
    setPageIndex,
    setHasProvisionalPage,
    handleDragEdgePaging,
    resetPageTurnState,
  };
};
