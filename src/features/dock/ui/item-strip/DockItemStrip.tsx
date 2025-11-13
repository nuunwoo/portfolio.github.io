import {Fragment} from 'react';
import {useDockItemStripState} from '../../lib/useDockItemStripState';
import DockItem, {type DockItem as DockItemData} from '../item/DockItem';
import DockSeparator from '../separator/DockSeparator';
import styles from './DockItemStrip.module.css';

type DockItemStripProps = {
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

const DockItemStrip = ({
  items,
  activeItemKey = null,
  isDropTargetActive = false,
  dropPreviewClientX = null,
  dropPreviewClientY = null,
  dropPreviewIndex = null,
  recentlyAddedItemKey = null,
  onDropPreviewIndexChange,
  onItemClick,
}: DockItemStripProps) => {
  const {
    hoveredItemKey,
    pinnedItemCount,
    itemHandlersByKey,
    itemElementByKeyRef,
    handleStripMouseLeave,
  } = useDockItemStripState({
    items,
    isDropTargetActive,
    dropPreviewClientX,
    dropPreviewClientY,
    onDropPreviewIndexChange,
    onItemClick,
  });

  return (
    <div className={styles.strip} onMouseLeave={handleStripMouseLeave} data-dock-root="true">
      {items.map((item, index) => {
        const handlers = itemHandlersByKey[item.key];
        const shouldShiftLeft = dropPreviewIndex !== null && index < dropPreviewIndex && index < pinnedItemCount;
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
              isHovered={hoveredItemKey === item.key}
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
                  itemElementByKeyRef.current.set(item.key, element);
                } else {
                  itemElementByKeyRef.current.delete(item.key);
                }
              }}
            />
          </Fragment>
        );
      })}
    </div>
  );
};

export default DockItemStrip;
