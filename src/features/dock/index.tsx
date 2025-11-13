import {useCallback} from 'react';
import {useDockItems} from './lib/useDockItems';
import {DockContent, DockMotion, DockSurface} from './ui';
import type {DockItemData} from './ui';
import {useAppStore} from '../../shared/store/app-store';

const Dock = () => {
  const {items, recentlyAddedItemKey, isDockDropTargetActive, dockDropPointerPosition, dockDropPreviewIndex, setDockDropPreviewIndex} = useDockItems();
  const hasUnlockedOnce = useAppStore(state => state.hasUnlockedOnce);
  const currentScreen = useAppStore(state => state.currentScreen);
  const isUnlocking = useAppStore(state => state.isUnlocking);
  const isLaunchpadOpen = useAppStore(state => state.isLaunchpadOpen);
  const toggleLaunchpad = useAppStore(state => state.toggleLaunchpad);
  const closeLaunchpad = useAppStore(state => state.closeLaunchpad);
  const disableAnimation = !hasUnlockedOnce && !isUnlocking;
  const hideItems = currentScreen === 'lock' && !isUnlocking;
  const activeDockItemKey = isLaunchpadOpen ? 'launchpad' : null;
  const dropSpreadDistance = 28;
  const previewExpandLeft = dockDropPreviewIndex !== null && dockDropPreviewIndex > 0 ? dropSpreadDistance : 0;
  const previewExpandRight = dockDropPreviewIndex !== null && dockDropPreviewIndex < items.length ? dropSpreadDistance : 0;

  const handleDockItemClick = useCallback(
    (item: DockItemData) => {
      if (item.key === 'launchpad') {
        toggleLaunchpad();
        return;
      }

      closeLaunchpad();
    },
    [closeLaunchpad, toggleLaunchpad],
  );

  return (
    <DockMotion disableAnimation={disableAnimation} hideItems={hideItems}>
      <DockSurface
        watch={[hideItems]}
        isPreviewActive={dockDropPreviewIndex !== null}
        previewExpandLeft={previewExpandLeft}
        previewExpandRight={previewExpandRight}>
        <DockContent
          items={items}
          activeItemKey={activeDockItemKey}
          isDropTargetActive={isDockDropTargetActive}
          dropPreviewClientX={dockDropPointerPosition?.x ?? null}
          dropPreviewClientY={dockDropPointerPosition?.y ?? null}
          dropPreviewIndex={dockDropPreviewIndex}
          recentlyAddedItemKey={recentlyAddedItemKey}
          onDropPreviewIndexChange={setDockDropPreviewIndex}
          onItemClick={handleDockItemClick}
        />
      </DockSurface>
    </DockMotion>
  );
};
export {useDockItems};
export default Dock;
