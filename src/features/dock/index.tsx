import {useDockViewState} from './lib/useDockViewState';
import {DockItemStrip, DockMotion, DockSurface} from './ui';

const Dock = () => {
  const {
    items,
    recentlyAddedItemKey,
    isDockDropTargetActive,
    dockDropPointerPosition,
    dockDropPreviewIndex,
    setDockDropPreviewIndex,
    handleDockItemClick,
    activeDockItemKey,
    disableAnimation,
    hideItems,
    previewExpandLeft,
    previewExpandRight,
  } = useDockViewState();

  return (
    <DockMotion disableAnimation={disableAnimation} hideItems={hideItems}>
      <DockSurface
        watch={[hideItems]}
        isPreviewActive={dockDropPreviewIndex !== null}
        previewExpandLeft={previewExpandLeft}
        previewExpandRight={previewExpandRight}>
        <DockItemStrip
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
export {useDockItems} from './lib/useDockItems';
export default Dock;
