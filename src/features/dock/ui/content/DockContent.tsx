import {Fragment, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import DockItem, {type DockItem as DockItemData} from '../item/DockItem';
import DockSeparator from '../separator/DockSeparator';
import styles from './DockContent.module.css';

type DockContentProps = {
  items: DockItemData[];
  activeItemKey?: string | null;
  isDropTargetActive?: boolean;
  dropPreviewClientX?: number | null;
  dropPreviewClientY?: number | null;
  dropPreviewIndex?: number | null;
  recentlyAddedItemKey?: string | null;
  onDropPreviewIndexChange?: (index: number | null) => void;
  onItemClick?: (item: DockItemData) => void;
};

const DockContent = ({
  items,
  activeItemKey = null,
  isDropTargetActive = false,
  dropPreviewClientX = null,
  dropPreviewClientY = null,
  dropPreviewIndex = null,
  recentlyAddedItemKey = null,
  onDropPreviewIndexChange,
  onItemClick,
}: DockContentProps) => {
  const dropSpreadDistance = 28;
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
  const handleMouseLeave = useCallback(() => {
    setHoveredKey(null);
  }, []);
  const handleItemClick = useCallback(
    (item: DockItemData) => {
      onItemClick?.(item);
    },
    [onItemClick],
  );
  const handleItemEnter = useCallback((itemKey: string) => {
    setHoveredKey(itemKey);
  }, []);
  const handleItemLeave = useCallback((itemKey: string) => {
    setHoveredKey(prev => (prev === itemKey ? null : prev));
  }, []);
  const itemHandlers = useMemo(() => {
    return Object.fromEntries(
      items.map(item => [
        item.key,
        {
          onClick: () => handleItemClick(item),
          onMouseEnter: () => handleItemEnter(item.key),
          onMouseLeave: () => handleItemLeave(item.key),
          onFocus: () => handleItemEnter(item.key),
          onBlur: () => handleItemLeave(item.key),
        },
      ]),
    );
  }, [handleItemClick, handleItemEnter, handleItemLeave, items]);
  const dropInsertLimit = useMemo(() => {
    const pinnedItems = items.filter(item => item.section === 'pinned');
    return pinnedItems.length;
  }, [items]);

  useEffect(() => {
    if (!isDropTargetActive || dropPreviewClientX === null || dropPreviewClientY === null) {
      onDropPreviewIndexChange?.(null);
      return;
    }

    const dockRoot = document.querySelector<HTMLElement>("[data-dock-root='true']");
    if (!dockRoot) {
      onDropPreviewIndexChange?.(null);
      return;
    }

    const dockRect = dockRoot.getBoundingClientRect();
    const isPointerInsideDock =
      dropPreviewClientX >= dockRect.left &&
      dropPreviewClientX <= dockRect.right &&
      dropPreviewClientY >= dockRect.top &&
      dropPreviewClientY <= dockRect.bottom;

    if (!isPointerInsideDock) {
      onDropPreviewIndexChange?.(null);
      return;
    }

    const insertableItems = items.slice(0, dropInsertLimit);
    let nextPreviewIndex = dropInsertLimit;

    for (let index = 0; index < insertableItems.length; index += 1) {
      const item = insertableItems[index];
      const itemElement = itemRefs.current.get(item.key);
      if (!itemElement) continue;

      const itemRect = itemElement.getBoundingClientRect();
      if (dropPreviewClientX < itemRect.left + itemRect.width / 2) {
        nextPreviewIndex = index;
        break;
      }
    }

    onDropPreviewIndexChange?.(nextPreviewIndex);
  }, [dropInsertLimit, dropPreviewClientX, dropPreviewClientY, isDropTargetActive, items, onDropPreviewIndexChange]);

  return (
    <div className={styles.root} onMouseLeave={handleMouseLeave} data-dock-root="true">
      {items.map((item, index) => {
        const handlers = itemHandlers[item.key];
        const shouldShiftLeft = dropPreviewIndex !== null && index < dropPreviewIndex && index < dropInsertLimit;
        const shouldShiftRight = dropPreviewIndex !== null && index >= dropPreviewIndex;
        const previousItem = index > 0 ? items[index - 1] : null;
        const shouldRenderSectionSeparator = previousItem !== null && previousItem.section !== item.section;
        return (
          <Fragment key={item.key}>
            {shouldRenderSectionSeparator ? (
              <DockSeparator shouldShiftLeft={shouldShiftLeft} shouldShiftRight={shouldShiftRight} />
            ) : null}
            <DockItem
              item={item}
              isActive={activeItemKey === item.key}
              isHovered={hoveredKey === item.key}
              isRecentlyAdded={recentlyAddedItemKey === item.key}
              shouldShiftLeft={shouldShiftLeft}
              shouldShiftRight={shouldShiftRight}
              onClick={handlers.onClick}
              onMouseEnter={handlers.onMouseEnter}
              onMouseLeave={handlers.onMouseLeave}
              onFocus={handlers.onFocus}
              onBlur={handlers.onBlur}
              itemRef={element => {
                if (element) {
                  itemRefs.current.set(item.key, element);
                } else {
                  itemRefs.current.delete(item.key);
                }
              }}
            />
          </Fragment>
        );
      })}
    </div>
  );
};

export default DockContent;
