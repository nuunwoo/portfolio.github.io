import {motion} from 'framer-motion';
import type {MouseEvent as ReactMouseEvent} from 'react';
import type {PointerEvent} from 'react';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {LaunchpadMoveMode} from '../../model/useLaunchpadLayout';
import {filterApps, paginateApps} from '../../model/layout';
import type {LaunchpadDisplayItem} from '../../model/types';
import type {LaunchpadPhase} from '../motion/LaunchpadMotion';
import {ScreenBackground} from '../../../../shared/ui/screen-background';
import {useGettingRef} from '../../../../shared/hooks/useGettingRef';
import {getElementBelowPoint, useMouseDrag} from '../../../../shared/dnd/useMouseDrag';
import {getLaunchpadPageTrackTransition, launchpadViewVariants} from '../../lib/launchpadViewMotion';
import {
  getDropDirectionInCell,
  getGridCellBounds,
  getGridColumnIndexByPoint,
  getGridOuterGap,
  getGridPositionByKey,
  getGridPositionFromSlotIndex,
  getGridSlotIndexByPoint,
  getGridRowIndexByPoint,
  getLaunchpadGridMetrics,
  getPageStartIndex,
  getSlotIndexFromPosition,
  isIgnoredDropSlot,
  isPointerInHorizontalInsertZone,
  isPointerInHorizontalOuterInsertZone,
  isPointerInHorizontalRowRange,
  isPointerInVerticalColumnRange,
  isPointerInVerticalInsertZone,
  isPointerInVerticalOuterInsertZone,
  resolveReorderMove,
  type LaunchpadDropPlacement,
  type LaunchpadDropTarget,
  type PositionedLaunchpadGridCandidate,
} from '../../lib/launchpadDrop';
import {useLaunchpadDragSession} from '../../lib/useLaunchpadDragSession';
import {useLaunchpadPageTurn} from '../../lib/useLaunchpadPageTurn';
import {useLaunchpadSwipe} from '../../lib/useLaunchpadSwipe';
import LaunchpadDragPreview from '../drag-preview/LaunchpadDragPreview';
import LaunchpadPagination from '../pagination/LaunchpadPagination';
import LaunchpadPageTrack from '../page-track/LaunchpadPageTrack';
import LaunchpadSearchBar from '../search-bar/LaunchpadSearchBar';
import styles from './LaunchpadSurface.module.css';
import {LAUNCHPAD_PAGE_COLUMNS, LAUNCHPAD_PAGE_SIZE} from '../../model/constants';

type LaunchpadSurfaceProps = {
  apps: LaunchpadDisplayItem[];
  pagedApps: LaunchpadDisplayItem[][];
  isFirstOpening: boolean;
  isClosing: boolean;
  phase: LaunchpadPhase;
  onMoveApp: (fromIndex: number, toIndex: number, mode?: LaunchpadMoveMode) => void;
  onMoveAppToNewPage: (fromIndex: number) => void;
  onMoveAppToPageEnd: (fromIndex: number, targetPageIndex: number) => void;
  onCopyAppToDock: (appKey: string) => void;
  onDockDragHoverChange?: (clientX: number | null, clientY: number | null) => void;
  onClose: () => void;
};

const DRAG_ACTIVATION_DISTANCE = 10;
const LAUNCHPAD_GRID_COLUMNS = 7;

const HORIZONTAL_OUTER_INSERT_ZONE_PX = 42;
const VERTICAL_OUTER_INSERT_ZONE_PX = 32;

const LaunchpadSurface = ({apps, pagedApps, isFirstOpening, isClosing, phase, onMoveApp, onMoveAppToNewPage, onMoveAppToPageEnd, onCopyAppToDock, onDockDragHoverChange, onClose}: LaunchpadSurfaceProps) => {
  const [isItemDragging, setIsItemDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hasSearchFocusHistory, setHasSearchFocusHistory] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const stopDragRef = useRef<() => void>(() => {});
  const {elementRef: gridViewportElement, setElementRef: setGridViewportRef} = useGettingRef<HTMLDivElement>({
    onChange: node => {
      setViewportWidth(node?.offsetWidth ?? 0);
    },
  });
  const filteredApps = useMemo(() => filterApps(apps, searchQuery), [apps, searchQuery]);
  const isSearchMode = searchQuery.trim().length > 0;
  const basePagedApps = useMemo(() => (isSearchMode ? paginateApps(filteredApps) : pagedApps), [filteredApps, isSearchMode, pagedApps]);
  const actualPageCount = Math.max(1, basePagedApps.length);
  const {
    pageIndex,
    pageCount,
    hasProvisionalPage,
    isSliding,
    isPageTurnSettling,
    setPageIndex,
    setHasProvisionalPage,
    handleDragEdgePaging,
    resetPageTurnState,
  } = useLaunchpadPageTurn({
    actualPageCount,
    gridViewportElement,
    gridViewportClassName: styles.launchpadGridViewport,
    isItemDragging,
    isPhaseOpen: phase === 'open',
    isSearchMode,
    onDockDragHoverChange,
  });
  const renderedPagedApps = useMemo(
    () => (!isSearchMode && hasProvisionalPage ? [...basePagedApps, []] : basePagedApps),
    [basePagedApps, hasProvisionalPage, isSearchMode],
  );
  const {
    draggingItemKey,
    dropTargetItemKey,
    dropPreviewPageIndex,
    dropPreviewSlotIndex,
    dragPosition,
    dragOriginRect,
    dragPortalHost,
    dragPreviewPortalMetrics,
    dragPreviewStyleVars,
    dragPreviewClassName,
    dragPreviewItem,
    hasDragged,
    hasDraggedRef,
    hasMovedDuringDragRef,
    lastMoveSignatureRef,
    previousDragClientPositionRef,
    setDragPosition,
    setHasDragged,
    beginDragSession,
    prepareDragPreviewLayer,
    updateDropPreview,
    resetDragSession,
  } = useLaunchpadDragSession();
  const showPagination = pageCount > 1;
  const showEmptyState = searchQuery.trim().length > 0 && filteredApps.length === 0;
  const shouldHoldSearchVisual = isClosing && (isSearchFocused || searchQuery.trim().length > 0);
  const isPhaseOpen = phase === 'open';
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
      resetDragSession();
      setSearchQuery('');
      setIsSearchFocused(false);
      setHasSearchFocusHistory(false);
      resetPageTurnState();
      return;
    }
    setPageIndex(prev => Math.min(prev, pageCount - 1));
  }, [pageCount, phase, resetDragSession, resetPageTurnState, setPageIndex]);

  useEffect(() => {
    setPageIndex(0);
  }, [searchQuery]);

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
    if (!isItemDragging) {
      return;
    }

    lastMoveSignatureRef.current = null;
  }, [apps, isItemDragging]);

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
        resetPageTurnState();
        onDockDragHoverChange?.(null, null);
      }
    },
    [onDockDragHoverChange, resetPageTurnState],
  );

  const findDropTarget = useCallback(
    (
      clientX: number,
      clientY: number,
      draggingKey: string,
    ): LaunchpadDropTarget | null => {
      const pageElements = Array.from(document.querySelectorAll<HTMLElement>("[data-launchpad-grid-page='true']"));
      const pageElement =
        pageElements.find(candidate => {
          const rect = candidate.getBoundingClientRect();
          return (
            clientX >= rect.left - HORIZONTAL_OUTER_INSERT_ZONE_PX &&
            clientX <= rect.right + HORIZONTAL_OUTER_INSERT_ZONE_PX &&
            clientY >= rect.top - VERTICAL_OUTER_INSERT_ZONE_PX &&
            clientY <= rect.bottom + VERTICAL_OUTER_INSERT_ZONE_PX
          );
        }) ?? null;

      if (!pageElement) {
        return null;
      }

      const pageRect = pageElement.getBoundingClientRect();

      const currentPageIndex = Number(pageElement.dataset.launchpadPageIndex);
      if (Number.isNaN(currentPageIndex)) {
        return null;
      }

      const sourcePosition = getGridPositionByKey(renderedPagedApps, draggingKey);
      if (!sourcePosition) {
        return null;
      }
      const sourceSlotIndex = getSlotIndexFromPosition(sourcePosition);
      const currentPageStartIndex = getPageStartIndex(renderedPagedApps, currentPageIndex);
      const sourceIndex = apps.findIndex(app => app.key === draggingKey);
      if (sourceIndex === -1) {
        return null;
      }

      const currentPageItems = renderedPagedApps[currentPageIndex] ?? [];
      const currentPageItemCount = currentPageItems.length;
      const sourcePageItemIndex = currentPageItems.findIndex(item => item.key === draggingKey);
      const itemElements = Array.from(pageElement.querySelectorAll<HTMLElement>("[data-launchpad-grid-item='true']"));
      const searchElements = itemElements.map(itemElement => ({
        itemElement,
        rect: itemElement.getBoundingClientRect(),
      }));

      if (searchElements.length === 0) {
        return null;
      }

      const positionedCandidates = searchElements
        .map(candidate => {
          const targetKey = candidate.itemElement.dataset.launchpadKey;
          const targetPosition = targetKey ? getGridPositionByKey(renderedPagedApps, targetKey) : null;

          return targetPosition
            ? {
                ...candidate,
                targetKey,
                targetPosition,
              }
            : null;
        })
        .filter((candidate): candidate is PositionedLaunchpadGridCandidate => candidate !== null);

      const pageCandidates = positionedCandidates.filter(
        candidate => candidate.targetPosition.pageIndex === currentPageIndex,
      );
      const lastPopulatedRowIndex = Math.max(
        0,
        ...pageCandidates.map(candidate => candidate.targetPosition.rowIndex),
      );
      const gridRootElement = pageElement.querySelector<HTMLElement>("[data-launchpad-grid-root='true']");
      const gridRootRect = gridRootElement?.getBoundingClientRect() ?? null;
      const gridMetrics = getLaunchpadGridMetrics(gridRootRect, pageCandidates);
      const gridOuterGap = getGridOuterGap(gridMetrics);
      const firstCellBounds = getGridCellBounds(gridMetrics, 0, 0);
      const lastCellBounds = getGridCellBounds(
        gridMetrics,
        lastPopulatedRowIndex,
        LAUNCHPAD_PAGE_COLUMNS - 1,
      );
      const activeRowIndex =
        getGridRowIndexByPoint(gridMetrics, clientY, lastPopulatedRowIndex, {
          top: gridOuterGap.topVertical,
          bottom: gridOuterGap.vertical,
        }) ??
        (firstCellBounds && clientY < firstCellBounds.top && clientY >= pageRect.top - gridOuterGap.topVertical
          ? 0
          : lastCellBounds && clientY > lastCellBounds.bottom && clientY <= pageRect.bottom + gridOuterGap.vertical
            ? lastPopulatedRowIndex
            : null);
      const activeColumnIndex =
        getGridColumnIndexByPoint(gridMetrics, clientX, gridOuterGap.horizontal) ??
        (firstCellBounds && clientX < firstCellBounds.left && clientX >= pageRect.left - gridOuterGap.horizontal
          ? 0
          : lastCellBounds && clientX > lastCellBounds.right && clientX <= pageRect.right + gridOuterGap.horizontal
            ? LAUNCHPAD_PAGE_COLUMNS - 1
            : null);

      const buildDropTarget = (
        candidate: PositionedLaunchpadGridCandidate,
        placement: LaunchpadDropPlacement,
        projectedLocalIndex: number,
      ): LaunchpadDropTarget | null => {
        const maxLocalIndex = Math.max(0, currentPageItemCount - 1);

        return {
          sourceIndex,
          targetKey: candidate.targetKey,
          projectedIndex: currentPageStartIndex + Math.max(0, Math.min(projectedLocalIndex, maxLocalIndex)),
          direction: placement === 'before' ? 'left' : 'right',
          placement,
        };
      };

      const logDropDebug = (
        reason: string,
        payload: Record<string, unknown> = {},
      ) => {
        console.log('[launchpad-drop]', {
          reason,
          draggingKey,
          clientX: Math.round(clientX),
          clientY: Math.round(clientY),
          currentPageIndex,
          sourceIndex,
          sourceSlotIndex,
          sourcePageItemIndex,
          activeRowIndex,
          activeColumnIndex,
          ...payload,
        });
      };

      const sortedPageCandidates = pageCandidates
        .filter(candidate => candidate.targetKey !== draggingKey)
        .sort((left, right) => {
          const leftLocalIndex = getSlotIndexFromPosition(left.targetPosition);
          const rightLocalIndex = getSlotIndexFromPosition(right.targetPosition);
          return leftLocalIndex - rightLocalIndex;
        });

      const buildPageEndDropTarget = (reason: string) => {
        const lastCandidate = sortedPageCandidates.at(-1);

        if (!lastCandidate) {
          return null;
        }

        const dropTarget = buildDropTarget(lastCandidate, 'after', currentPageItemCount);
        if (!dropTarget) {
          return null;
        }

        logDropDebug(reason, {
          targetKey: lastCandidate.targetKey,
          projectedLocalIndex: currentPageItemCount,
          dropTarget,
        });
        return dropTarget;
      };

      if (gridRootRect) {
        const isOutsideReactiveGrid =
          clientX < gridRootRect.left - gridOuterGap.horizontal ||
          clientX > gridRootRect.right + gridOuterGap.horizontal ||
          clientY < gridRootRect.top - gridOuterGap.vertical ||
          clientY > gridRootRect.bottom + gridOuterGap.vertical;

        if (isOutsideReactiveGrid) {
          return buildPageEndDropTarget('outside-grid-gap-page-end');
        }
      }

      const hoveredLocalIndex = getGridSlotIndexByPoint(
        gridMetrics,
        pageRect,
        clientX,
        clientY,
        lastPopulatedRowIndex,
        gridOuterGap,
      );
      if (hoveredLocalIndex === null) {
        logDropDebug('hovered-slot-null');
        return null;
      }

      if (isIgnoredDropSlot(sourceSlotIndex, hoveredLocalIndex)) {
        logDropDebug('ignored-same-slot', {hoveredLocalIndex});
        return null;
      }

      const hoveredGridPosition = getGridPositionFromSlotIndex(hoveredLocalIndex);

      if (
        gridRootRect &&
        activeColumnIndex !== null &&
        (clientY < gridRootRect.top || clientY > gridRootRect.bottom)
      ) {
        const activeColumnCandidates = sortedPageCandidates.filter(
          candidate => candidate.targetPosition.columnIndex === activeColumnIndex,
        );

        if (activeColumnCandidates.length > 0) {
          const columnLeft = Math.min(...activeColumnCandidates.map(candidate => candidate.rect.left));
          const columnRight = Math.max(...activeColumnCandidates.map(candidate => candidate.rect.right));
          const columnTop = Math.min(...activeColumnCandidates.map(candidate => candidate.rect.top));
          const columnBottom = Math.max(...activeColumnCandidates.map(candidate => candidate.rect.bottom));
          const isInsideActiveColumnBand = isPointerInVerticalColumnRange(
            clientX,
            clientY,
            columnLeft,
            columnRight,
            columnTop,
            columnBottom,
          );

          if (isInsideActiveColumnBand) {
            const insertionCandidate =
              clientY < gridRootRect.top ? activeColumnCandidates[0] : activeColumnCandidates[activeColumnCandidates.length - 1];

            if (insertionCandidate) {
              const insertionPageItemIndex = currentPageItems.findIndex(
                item => item.key === insertionCandidate.targetKey,
              );

              if (insertionPageItemIndex !== -1) {
                const placement = clientY < gridRootRect.top ? 'before' : 'after';
                const projectedLocalIndex =
                  placement === 'before'
                    ? sourcePageItemIndex !== -1 && sourcePageItemIndex + 1 === insertionPageItemIndex
                      ? insertionPageItemIndex
                      : sourceIndex < currentPageStartIndex + insertionPageItemIndex
                        ? insertionPageItemIndex - 1
                        : insertionPageItemIndex
                    : sourceIndex < currentPageStartIndex + insertionPageItemIndex
                      ? insertionPageItemIndex
                      : insertionPageItemIndex + 1;
                const dropTarget = buildDropTarget(insertionCandidate, placement, projectedLocalIndex);
                logDropDebug('active-column-outer-insertion', {
                  hoveredLocalIndex,
                  activeColumnIndex,
                  targetKey: insertionCandidate.targetKey,
                  insertionPageItemIndex,
                  projectedLocalIndex,
                  placement,
                  dropTarget,
                });
                return dropTarget;
              }
            }
          }
        }
      }

      if (activeRowIndex !== null) {
        const activeRowCandidates = sortedPageCandidates.filter(
          candidate => candidate.targetPosition.rowIndex === activeRowIndex,
        );

        if (activeRowCandidates.length > 0) {
          const rowTop = Math.min(...activeRowCandidates.map(candidate => candidate.rect.top));
          const rowBottom = Math.max(...activeRowCandidates.map(candidate => candidate.rect.bottom));
          const isInsideActiveRowBand = isPointerInHorizontalRowRange(
            clientX,
            clientY,
            pageRect.left,
            pageRect.right,
            rowTop,
            rowBottom,
          );

          if (isInsideActiveRowBand) {
            const shouldPreferOccupiedCandidateInLastRow =
              activeRowIndex === lastPopulatedRowIndex &&
              activeRowCandidates.some(
                candidate => getSlotIndexFromPosition(candidate.targetPosition) === hoveredLocalIndex,
              );

            if (shouldPreferOccupiedCandidateInLastRow) {
              logDropDebug('active-row-last-row-occupied-deferred', {
                hoveredLocalIndex,
                activeRowIndex,
              });
            } else {
            const rowInsertionIndex = activeRowCandidates.findIndex(
              candidate => clientX < candidate.rect.left + candidate.rect.width / 2,
            );
            const isRowFull = activeRowCandidates.length === LAUNCHPAD_PAGE_COLUMNS;
            const isRightOfFilledRow = rowInsertionIndex === -1 && isRowFull;
            const insertionCandidate =
              rowInsertionIndex === -1
                ? activeRowCandidates[activeRowCandidates.length - 1]
                : activeRowCandidates[rowInsertionIndex];

            if (!insertionCandidate) {
              return null;
            }

            const insertionPageItemIndex = currentPageItems.findIndex(
              item => item.key === insertionCandidate.targetKey,
            );

            if (insertionPageItemIndex === -1) {
              return null;
            }

            const projectedLocalIndex =
              rowInsertionIndex !== -1 &&
              sourcePageItemIndex !== -1 &&
              sourcePageItemIndex + 1 === insertionPageItemIndex
                ? insertionPageItemIndex
                : rowInsertionIndex === -1 && !isRightOfFilledRow
                ? sourcePageItemIndex !== -1 && sourcePageItemIndex < insertionPageItemIndex + 1
                  ? insertionPageItemIndex
                  : insertionPageItemIndex + 1
                : sourcePageItemIndex !== -1 && sourcePageItemIndex < insertionPageItemIndex
                  ? insertionPageItemIndex - 1
                  : insertionPageItemIndex;
            const placement = rowInsertionIndex === -1 && !isRightOfFilledRow ? 'after' : 'before';
            const dropTarget = buildDropTarget(insertionCandidate, placement, projectedLocalIndex);
            logDropDebug('active-row-insertion', {
              hoveredLocalIndex,
              rowInsertionIndex,
              isRightOfFilledRow,
              targetKey: insertionCandidate.targetKey,
              insertionPageItemIndex,
              projectedLocalIndex,
              placement,
              dropTarget,
            });
            return dropTarget;
            }
          }
        }
      }

      const occupiedCandidate = sortedPageCandidates.find(
        candidate => getSlotIndexFromPosition(candidate.targetPosition) === hoveredLocalIndex,
      );

      if (occupiedCandidate) {
        const occupiedPageItemIndex = currentPageItems.findIndex(
          item => item.key === occupiedCandidate.targetKey,
        );

        if (occupiedPageItemIndex === -1) {
          return null;
        }

        const occupiedGlobalIndex = currentPageStartIndex + occupiedPageItemIndex;
        const occupiedCellBounds = getGridCellBounds(
          gridMetrics,
          occupiedCandidate.targetPosition.rowIndex,
          occupiedCandidate.targetPosition.columnIndex,
        );
        const dropDirection = getDropDirectionInCell(occupiedCellBounds, clientX, clientY);
        const isLastPopulatedRowOccupiedMove =
          occupiedCandidate.targetPosition.rowIndex === lastPopulatedRowIndex &&
          sourcePosition.rowIndex === lastPopulatedRowIndex;
        const effectiveDropDirection =
          isLastPopulatedRowOccupiedMove && occupiedCellBounds
            ? clientX < (occupiedCellBounds.left + occupiedCellBounds.right) / 2
              ? 'left'
              : 'right'
            : dropDirection;

        const placeBefore = effectiveDropDirection === 'left' || effectiveDropDirection === 'up';
        const projectedLocalIndex = placeBefore
          ? sourcePageItemIndex !== -1 && sourcePageItemIndex + 1 === occupiedPageItemIndex
            ? occupiedPageItemIndex
            : sourceIndex < occupiedGlobalIndex
            ? occupiedPageItemIndex - 1
            : occupiedPageItemIndex
          : sourceIndex < occupiedGlobalIndex
            ? occupiedPageItemIndex
            : occupiedPageItemIndex + 1;
        const dropTarget = buildDropTarget(
          occupiedCandidate,
          placeBefore ? 'before' : 'after',
          projectedLocalIndex,
        );
        logDropDebug('occupied-candidate', {
          hoveredLocalIndex,
          targetKey: occupiedCandidate.targetKey,
          occupiedPageItemIndex,
          occupiedGlobalIndex,
          dropDirection,
          effectiveDropDirection,
          projectedLocalIndex,
          placement: placeBefore ? 'before' : 'after',
          dropTarget,
        });
        return dropTarget;
      }

      const nextCandidate = sortedPageCandidates.find(
        candidate => getSlotIndexFromPosition(candidate.targetPosition) > hoveredLocalIndex,
      );

      if (nextCandidate) {
        const dropTarget = buildDropTarget(nextCandidate, 'before', hoveredLocalIndex);
        logDropDebug('next-candidate-fallback', {
          hoveredLocalIndex,
          targetKey: nextCandidate.targetKey,
          projectedLocalIndex: hoveredLocalIndex,
          dropTarget,
        });
        return dropTarget;
      }

      const previousCandidate = sortedPageCandidates.at(-1);
      if (previousCandidate) {
        const dropTarget = buildDropTarget(previousCandidate, 'after', hoveredLocalIndex + 1);
        logDropDebug('previous-candidate-fallback', {
          hoveredLocalIndex,
          targetKey: previousCandidate.targetKey,
          projectedLocalIndex: hoveredLocalIndex + 1,
          dropTarget,
        });
        return dropTarget;
      }

      logDropDebug('no-target', {hoveredLocalIndex, hoveredGridPosition});
      return null;
    },
    [apps, renderedPagedApps],
  );

  const handleDragStart = useCallback(
    (session: {meta: string; rect: DOMRect; startClientX: number; startClientY: number}) => {
      beginDragSession({
        appKey: session.meta,
        rect: session.rect,
        startClientX: session.startClientX,
        startClientY: session.startClientY,
        apps,
        gridColumnCount: LAUNCHPAD_GRID_COLUMNS,
      });
      handleItemDragStateChange(true);
    },
    [apps, beginDragSession, handleItemDragStateChange],
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
      handleDragEdgePaging(payload.clientX, payload.clientY);
      const dropTarget = findDropTarget(
        payload.clientX,
        payload.clientY,
        payload.meta,
      );
      previousDragClientPositionRef.current = {
        x: payload.clientX,
        y: payload.clientY,
      };
      const nextTargetKey = dropTarget?.targetKey ?? null;
      const nextProjectedPageIndex = dropTarget
        ? Math.floor(dropTarget.projectedIndex / LAUNCHPAD_PAGE_SIZE)
        : null;
      const nextProjectedLocalIndex = dropTarget
        ? dropTarget.projectedIndex % LAUNCHPAD_PAGE_SIZE
        : null;
      updateDropPreview(nextTargetKey, nextProjectedPageIndex, nextProjectedLocalIndex);
      if (!dropTarget || !nextTargetKey) {
        return;
      }

      const nextReorderIndex = resolveReorderMove(dropTarget);
      if (nextReorderIndex === null) {
        return;
      }

      const moveMode: LaunchpadMoveMode = 'reorder';
      const moveSignature = `${moveMode}:${dropTarget.targetKey}:${dropTarget.projectedIndex}:${dropTarget.placement}`;
      if (moveSignature === lastMoveSignatureRef.current) {
        return;
      }

      lastMoveSignatureRef.current = moveSignature;
      hasMovedDuringDragRef.current = true;
      onMoveApp(dropTarget.sourceIndex, nextReorderIndex, moveMode);
    },
    [findDropTarget, handleDragEdgePaging, onMoveApp, updateDropPreview],
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

    handleItemDragEnd(payload.meta);
    handleItemDragStateChange(false);
    resetDragSession();
  }, [handleItemDragEnd, handleItemDragStateChange, onCopyAppToDock, resetDragSession]);

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
      prepareDragPreviewLayer({
        itemElement: currentTarget,
        index,
        isSearchMode,
        highlightFirstPage: pageIndex === 0,
      });
      startDrag(event, app.key);
    },
    [isSearchMode, pageIndex, prepareDragPreviewLayer, startDrag],
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
            transition={getLaunchpadPageTrackTransition(isPanelSwiping)}>
            <LaunchpadPageTrack
              pagedApps={renderedPagedApps}
              pageIndex={pageIndex}
              isItemDragging={isItemDragging}
              isSearchMode={isSearchMode}
              draggingItemKey={draggingItemKey}
              dropTargetItemKey={dropTargetItemKey}
              dropPreviewPageIndex={dropPreviewPageIndex}
              dropPreviewSlotIndex={dropPreviewSlotIndex}
              hasDragged={hasDragged}
              onItemMouseDown={handleItemMouseDown}
            />
          </motion.div>
        </div>
      )}
      {showPagination && !showEmptyState ? <LaunchpadPagination pageCount={pageCount} pageIndex={pageIndex} /> : null}
      {draggingItemKey !== null &&
      hasDragged &&
      dragOriginRect &&
      dragPosition &&
      dragPreviewStyleVars &&
      dragPortalHost &&
      dragPreviewPortalMetrics ? (
        <LaunchpadDragPreview
          className={dragPreviewClassName}
          dragOriginRect={dragOriginRect}
          position={dragPosition}
          portalHost={dragPortalHost}
          portalMetrics={dragPreviewPortalMetrics}
          styleVars={dragPreviewStyleVars}
          previewItem={dragPreviewItem}
        />
      )
        : null}
    </motion.section>
  );
};

export default LaunchpadSurface;
