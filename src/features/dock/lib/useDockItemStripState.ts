import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {DockItemData} from '../ui';

type UseDockItemStripStateParams = {
  items: DockItemData[];
  isDropTargetActive: boolean;
  dropPreviewClientX: number | null;
  dropPreviewClientY: number | null;
  onDropPreviewIndexChange?: (index: number | null) => void;
  onItemClick?: (item: DockItemData) => void;
};

export const useDockItemStripState = ({
  items,
  isDropTargetActive,
  dropPreviewClientX,
  dropPreviewClientY,
  onDropPreviewIndexChange,
  onItemClick,
}: UseDockItemStripStateParams) => {
  const [hoveredItemKey, setHoveredItemKey] = useState<string | null>(null);
  const itemElementByKeyRef = useRef(new Map<string, HTMLButtonElement>());

  const handleStripMouseLeave = useCallback(() => {
    setHoveredItemKey(null);
  }, []);

  const handleDockItemClick = useCallback(
    (item: DockItemData) => {
      onItemClick?.(item);
    },
    [onItemClick],
  );

  const handleDockItemEnter = useCallback((itemKey: string) => {
    setHoveredItemKey(itemKey);
  }, []);

  const handleDockItemLeave = useCallback((itemKey: string) => {
    setHoveredItemKey(previousKey => (previousKey === itemKey ? null : previousKey));
  }, []);

  const itemHandlersByKey = useMemo(() => {
    return Object.fromEntries(
      items.map(item => [
        item.key,
        {
          onClick: () => handleDockItemClick(item),
          onMouseEnter: () => handleDockItemEnter(item.key),
          onMouseLeave: () => handleDockItemLeave(item.key),
          onFocus: () => handleDockItemEnter(item.key),
          onBlur: () => handleDockItemLeave(item.key),
        },
      ]),
    );
  }, [handleDockItemClick, handleDockItemEnter, handleDockItemLeave, items]);

  const pinnedItemCount = useMemo(
    () => items.filter(item => item.section === 'pinned').length,
    [items],
  );

  useEffect(() => {
    if (!isDropTargetActive || dropPreviewClientX === null || dropPreviewClientY === null) {
      onDropPreviewIndexChange?.(null);
      return;
    }

    const dockRootElement = document.querySelector<HTMLElement>("[data-dock-root='true']");
    if (!dockRootElement) {
      onDropPreviewIndexChange?.(null);
      return;
    }

    const dockRootRect = dockRootElement.getBoundingClientRect();
    const isPointerInsideDockRoot =
      dropPreviewClientX >= dockRootRect.left &&
      dropPreviewClientX <= dockRootRect.right &&
      dropPreviewClientY >= dockRootRect.top &&
      dropPreviewClientY <= dockRootRect.bottom;

    if (!isPointerInsideDockRoot) {
      onDropPreviewIndexChange?.(null);
      return;
    }

    const insertableItems = items.slice(0, pinnedItemCount);
    let nextPreviewIndex = pinnedItemCount;

    for (let index = 0; index < insertableItems.length; index += 1) {
      const item = insertableItems[index];
      const itemElement = itemElementByKeyRef.current.get(item.key);
      if (!itemElement) continue;

      const itemRect = itemElement.getBoundingClientRect();
      if (dropPreviewClientX < itemRect.left + itemRect.width / 2) {
        nextPreviewIndex = index;
        break;
      }
    }

    onDropPreviewIndexChange?.(nextPreviewIndex);
  }, [dropPreviewClientX, dropPreviewClientY, isDropTargetActive, items, onDropPreviewIndexChange, pinnedItemCount]);

  return {
    hoveredItemKey,
    pinnedItemCount,
    itemHandlersByKey,
    itemElementByKeyRef,
    handleStripMouseLeave,
  };
};
