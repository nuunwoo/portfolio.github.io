import type {CSSProperties, ReactNode} from 'react';
import {useCallback, useRef, useState} from 'react';
import type {LaunchpadDisplayItem} from '../model/types';
import {
  getLaunchpadGridItemClassName,
} from '../ui/grid/LaunchpadGrid';
import launchpadGridStyles from '../ui/grid/LaunchpadGrid.module.css';
import type {
  LaunchpadDragPreviewItem,
  LaunchpadDragPreviewPortalMetrics,
} from '../ui/drag-preview/LaunchpadDragPreview';

type BeginDragSessionParams = {
  appKey: string;
  rect: DOMRect;
  startClientX: number;
  startClientY: number;
  apps: LaunchpadDisplayItem[];
  gridColumnCount: number;
};

type PrepareDragPreviewParams = {
  itemElement: HTMLElement;
  index: number;
  isSearchMode: boolean;
  highlightFirstPage: boolean;
};

export const useLaunchpadDragSession = () => {
  const [draggingItemKey, setDraggingItemKey] = useState<string | null>(null);
  const [dropTargetItemKey, setDropTargetItemKey] = useState<string | null>(null);
  const [dropPreviewPageIndex, setDropPreviewPageIndex] = useState<number | null>(null);
  const [dropPreviewSlotIndex, setDropPreviewSlotIndex] = useState<number | null>(null);
  const [dragPosition, setDragPosition] = useState<{left: number; top: number} | null>(null);
  const [dragOriginRect, setDragOriginRect] = useState<{left: number; top: number; width: number; height: number} | null>(null);
  const [dragPortalHost, setDragPortalHost] = useState<HTMLElement | null>(null);
  const [dragPreviewPortalMetrics, setDragPreviewPortalMetrics] = useState<LaunchpadDragPreviewPortalMetrics | null>(null);
  const [dragPreviewStyleVars, setDragPreviewStyleVars] = useState<CSSProperties | null>(null);
  const [dragPreviewClassName, setDragPreviewClassName] = useState(launchpadGridStyles.item);
  const [dragPreviewItem, setDragPreviewItem] = useState<LaunchpadDragPreviewItem | null>(null);
  const [hasDragged, setHasDragged] = useState(false);

  const hasDraggedRef = useRef(false);
  const hasMovedDuringDragRef = useRef(false);
  const lastMoveSignatureRef = useRef<string | null>(null);
  const dragAxisRef = useRef<'horizontal' | 'vertical'>('horizontal');
  const dragOriginColumnRef = useRef<number | null>(null);
  const previousDragClientPositionRef = useRef<{x: number; y: number} | null>(null);

  const resetDragSession = useCallback(() => {
    setDraggingItemKey(null);
    setDropTargetItemKey(null);
    setDropPreviewPageIndex(null);
    setDropPreviewSlotIndex(null);
    setDragPortalHost(null);
    setDragPreviewPortalMetrics(null);
    setDragPreviewStyleVars(null);
    setDragPreviewClassName(launchpadGridStyles.item);
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

  const beginDragSession = useCallback((params: BeginDragSessionParams) => {
    const {appKey, rect, startClientX, startClientY, apps, gridColumnCount} = params;
    setDraggingItemKey(appKey);
    setDropTargetItemKey(null);
    hasDraggedRef.current = false;
    lastMoveSignatureRef.current = null;
    dragOriginColumnRef.current = apps.findIndex(app => app.key === appKey) % gridColumnCount;

    const sourceItem = apps.find(app => app.key === appKey) ?? null;
    setDragPreviewItem(
      sourceItem
        ? {
            icon: sourceItem.icon,
            iconSrc: sourceItem.iconSrc,
            label: sourceItem.label,
            itemType: sourceItem.itemType,
            previewChildren: sourceItem.itemType === 'folder' ? sourceItem.previewChildren : undefined,
          }
        : null,
    );
    setHasDragged(false);
    hasMovedDuringDragRef.current = false;
    previousDragClientPositionRef.current = {
      x: startClientX,
      y: startClientY,
    };
    setDragPosition({
      left: rect.left,
      top: rect.top,
    });
    setDragOriginRect({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    });
  }, []);

  const prepareDragPreviewLayer = useCallback((params: PrepareDragPreviewParams) => {
    const {itemElement, index, isSearchMode, highlightFirstPage} = params;
    const iconElement = itemElement.querySelector<HTMLElement>(`.${launchpadGridStyles.icon}`);
    const labelElement = itemElement.querySelector<HTMLElement>(`.${launchpadGridStyles.label}`);
    const itemStyle = window.getComputedStyle(itemElement);
    const iconStyle = iconElement ? window.getComputedStyle(iconElement) : null;
    const labelStyle = labelElement ? window.getComputedStyle(labelElement) : null;

    setDragPreviewStyleVars({
      '--launchpad-item-width': itemStyle.width,
      '--launchpad-icon-size': iconStyle?.width ?? '96px',
      '--launchpad-label-color': labelStyle?.color ?? 'inherit',
      '--launchpad-label-shadow': labelStyle?.textShadow ?? 'none',
    } as CSSProperties);
    setDragPreviewClassName(
      getLaunchpadGridItemClassName({
        index,
        searchMode: isSearchMode,
        highlightFirst: highlightFirstPage,
      }),
    );
    setDragPortalHost(document.body);
    setDragPreviewPortalMetrics({
      left: 0,
      top: 0,
      scaleX: 1,
      scaleY: 1,
    });
  }, []);

  const updateDropPreview = useCallback((targetKey: string | null, projectedPageIndex: number | null, projectedSlotIndex: number | null) => {
    setDropTargetItemKey(targetKey);
    setDropPreviewPageIndex(projectedPageIndex);
    setDropPreviewSlotIndex(projectedSlotIndex);
  }, []);

  return {
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
    dragAxisRef,
    dragOriginColumnRef,
    previousDragClientPositionRef,
    setDragPosition,
    setHasDragged,
    setDragPreviewItem,
    beginDragSession,
    prepareDragPreviewLayer,
    updateDropPreview,
    resetDragSession,
  };
};
