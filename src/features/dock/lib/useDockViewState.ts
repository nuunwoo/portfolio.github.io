import {useCallback, useMemo} from 'react';
import {useAppStore} from '../../../shared/store/app-store';
import {useDockItems} from './useDockItems';
import type {DockItemData} from '../ui';

const DOCK_PREVIEW_SPREAD = 28;

export const useDockViewState = () => {
  const {
    items,
    recentlyAddedItemKey,
    isDockDropTargetActive,
    dockDropPointerPosition,
    dockDropPreviewIndex,
    setDockDropPreviewIndex,
  } = useDockItems();
  const hasUnlockedOnce = useAppStore(state => state.hasUnlockedOnce);
  const currentScreen = useAppStore(state => state.currentScreen);
  const isUnlocking = useAppStore(state => state.isUnlocking);
  const isLaunchpadOpen = useAppStore(state => state.isLaunchpadOpen);
  const toggleLaunchpad = useAppStore(state => state.toggleLaunchpad);
  const closeLaunchpad = useAppStore(state => state.closeLaunchpad);

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

  const previewExpandLeft = useMemo(
    () => (dockDropPreviewIndex !== null && dockDropPreviewIndex > 0 ? DOCK_PREVIEW_SPREAD : 0),
    [dockDropPreviewIndex],
  );
  const previewExpandRight = useMemo(
    () => (dockDropPreviewIndex !== null && dockDropPreviewIndex < items.length ? DOCK_PREVIEW_SPREAD : 0),
    [dockDropPreviewIndex, items.length],
  );

  return {
    items,
    recentlyAddedItemKey,
    isDockDropTargetActive,
    dockDropPointerPosition,
    dockDropPreviewIndex,
    setDockDropPreviewIndex,
    handleDockItemClick,
    activeDockItemKey: isLaunchpadOpen ? 'launchpad' : null,
    disableAnimation: !hasUnlockedOnce && !isUnlocking,
    hideItems: currentScreen === 'lock' && !isUnlocking,
    previewExpandLeft,
    previewExpandRight,
  };
};
