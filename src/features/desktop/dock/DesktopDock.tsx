import {useCallback} from 'react';
import {OsDock, type DockItem} from '../../../design-system/components';
import styles from './DesktopDock.module.css';

type DesktopDockProps = {
  items: DockItem[];
  isLaunchpadOpen: boolean;
  isReceivingDrop?: boolean;
  dropPreviewClientX?: number | null;
  dropPreviewClientY?: number | null;
  dropPreviewIndex?: number | null;
  recentlyAddedItemKey?: string | null;
  onLaunchpadToggle: () => void;
  onDropPreviewIndexChange?: (index: number | null) => void;
  onOtherItemClick?: (item: DockItem) => void;
};

const DesktopDock = ({
  items,
  isLaunchpadOpen,
  isReceivingDrop = false,
  dropPreviewClientX = null,
  dropPreviewClientY = null,
  dropPreviewIndex = null,
  recentlyAddedItemKey = null,
  onLaunchpadToggle,
  onDropPreviewIndexChange,
  onOtherItemClick,
}: DesktopDockProps) => {
  const activeDockItemKey = isLaunchpadOpen ? 'launchpad' : null;

  const handleDockItemClick = useCallback((item: DockItem) => {
    if (item.key === 'launchpad') {
      onLaunchpadToggle();
      return;
    }

    onOtherItemClick?.(item);
  }, [onLaunchpadToggle, onOtherItemClick]);

  return (
    <div className={styles.root}>
      <OsDock
        items={items}
        activeItemKey={activeDockItemKey}
        isDropTargetActive={isReceivingDrop}
        dropPreviewClientX={dropPreviewClientX}
        dropPreviewClientY={dropPreviewClientY}
        dropPreviewIndex={dropPreviewIndex}
        recentlyAddedItemKey={recentlyAddedItemKey}
        onDropPreviewIndexChange={onDropPreviewIndexChange}
        onItemClick={handleDockItemClick}
      />
    </div>
  );
};

export default DesktopDock;
