import {createElement, useEffect, useMemo} from 'react';
import AppIcon from '../../../assets/icons/generated/app-icons';
import {dockAppIcons, launchpadAppIcons} from '../../../assets/icons/generated/app-icons/catalog';
import type {DockItemData as DockItem} from '../ui';
import {useAppStore} from '../../../shared/store/app-store';
import {savePinnedDockKeys} from '../../../shared/store/slices/dockSlice';

const MAX_DOCK_ITEM_COUNT = 30;
const SYSTEM_DOCK_KEYS = ['trash'];

const catalogByKey = new Map([...launchpadAppIcons, ...dockAppIcons].map(item => [item.key, item]));
const getMaxPinnedDockItemCount = (unpinnedItemCount: number) => Math.max(0, MAX_DOCK_ITEM_COUNT - unpinnedItemCount - SYSTEM_DOCK_KEYS.length);

type UseDockItemsResult = {
  items: DockItem[];
  addDockItem: (appKey: string, insertIndex?: number | null) => void;
  dockDropPointerPosition: {x: number; y: number} | null;
  dockDropPreviewIndex: number | null;
  isDockAtMaxItemCount: boolean;
  isDockDropTargetActive: boolean;
  recentlyAddedItemKey: string | null;
  setDockDropPointerPosition: (position: {x: number; y: number} | null) => void;
  setDockDropPreviewIndex: (index: number | null) => void;
  setDockDropTargetActive: (isActive: boolean) => void;
};

export const useDockItems = (): UseDockItemsResult => {
  const pinnedDockKeys = useAppStore(state => state.pinnedDockKeys);
  const recentlyAddedItemKey = useAppStore(state => state.recentlyAddedDockItemKey);
  const isDockDropTargetActive = useAppStore(state => state.isDockDropTargetActive);
  const dockDropPointerPosition = useAppStore(state => state.dockDropPointerPosition);
  const dockDropPreviewIndex = useAppStore(state => state.dockDropPreviewIndex);
  const setPinnedDockKeys = useAppStore(state => state.setPinnedDockKeys);
  const setRecentlyAddedItemKey = useAppStore(state => state.setRecentlyAddedDockItemKey);
  const setDockDropTargetActive = useAppStore(state => state.setDockDropTargetActive);
  const setDockDropPointerPosition = useAppStore(state => state.setDockDropPointerPosition);
  const setDockDropPreviewIndex = useAppStore(state => state.setDockDropPreviewIndex);
  const unpinnedDockKeys: string[] = [];
  const maxPinnedDockItemCount = getMaxPinnedDockItemCount(unpinnedDockKeys.length);

  useEffect(() => {
    savePinnedDockKeys(pinnedDockKeys.filter((item, index) => pinnedDockKeys.indexOf(item) === index && item !== 'trash' && catalogByKey.has(item)).slice(0, getMaxPinnedDockItemCount(0)));
  }, [pinnedDockKeys]);

  useEffect(() => {
    if (!recentlyAddedItemKey) return;

    const timeoutId = window.setTimeout(() => {
      setRecentlyAddedItemKey(null);
    }, 680);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [recentlyAddedItemKey]);

  const items = useMemo<DockItem[]>(() => {
    const createDockSectionItems = (keys: string[], section: DockItem['section']) =>
      keys.flatMap(key => {
        const catalogItem = catalogByKey.get(key);
        if (!catalogItem) return [];

        return [
          {
            key: catalogItem.key,
            label: catalogItem.label,
            glyph: createElement(AppIcon, {name: catalogItem.icon}),
            section,
            running: true,
            badge: catalogItem.key === 'mail' ? '109' : undefined,
          },
        ];
      });

    return [...createDockSectionItems(pinnedDockKeys, 'pinned'), ...createDockSectionItems(unpinnedDockKeys, 'unpinned'), ...createDockSectionItems(SYSTEM_DOCK_KEYS, 'system')];
  }, [pinnedDockKeys, unpinnedDockKeys]);
  const isDockAtMaxItemCount = items.length >= MAX_DOCK_ITEM_COUNT;

  const addDockItem = (appKey: string, insertIndex?: number | null) => {
    const nextPinnedDockKeys = (() => {
      if (pinnedDockKeys.includes(appKey) || appKey === 'trash' || !catalogByKey.has(appKey)) {
        return pinnedDockKeys;
      }

      if (pinnedDockKeys.length >= maxPinnedDockItemCount) {
        return pinnedDockKeys;
      }

      setRecentlyAddedItemKey(appKey);

      const next = [...pinnedDockKeys];
      const clampedInsertIndex = typeof insertIndex === 'number' ? Math.max(0, Math.min(insertIndex, pinnedDockKeys.length)) : pinnedDockKeys.length;
      next.splice(clampedInsertIndex, 0, appKey);
      return next;
    })();

    setPinnedDockKeys(nextPinnedDockKeys);
  };

  return {
    items,
    addDockItem,
    dockDropPointerPosition,
    dockDropPreviewIndex,
    isDockAtMaxItemCount,
    isDockDropTargetActive,
    recentlyAddedItemKey,
    setDockDropPointerPosition,
    setDockDropPreviewIndex,
    setDockDropTargetActive,
  };
};
