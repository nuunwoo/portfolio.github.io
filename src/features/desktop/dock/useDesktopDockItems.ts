import {createElement, useEffect, useMemo, useState} from 'react';
import AppIcon from '../../../assets/icons/generated/app-icons';
import {dockAppIcons, launchpadAppIcons} from '../../../assets/icons/generated/app-icons/catalog';
import type {DockItem} from '../../../design-system/components';

const DESKTOP_PINNED_DOCK_STORAGE_KEY = 'desktop-dock-pinned-items-v1';
const MAX_DOCK_ITEM_COUNT = 30;
const DEFAULT_PINNED_DOCK_KEYS = dockAppIcons.filter(item => item.key !== 'trash').map(item => item.key);
const SYSTEM_DOCK_KEYS = ['trash'];

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const catalogByKey = new Map([...launchpadAppIcons, ...dockAppIcons].map(item => [item.key, item]));
const getMaxPinnedDockItemCount = (unpinnedItemCount: number) =>
  Math.max(0, MAX_DOCK_ITEM_COUNT - unpinnedItemCount - SYSTEM_DOCK_KEYS.length);

const loadPinnedDockKeys = () => {
  if (!isBrowser()) return DEFAULT_PINNED_DOCK_KEYS;

  try {
    const raw = window.localStorage.getItem(DESKTOP_PINNED_DOCK_STORAGE_KEY);
    if (!raw) return DEFAULT_PINNED_DOCK_KEYS;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.some(item => typeof item !== 'string')) {
      return DEFAULT_PINNED_DOCK_KEYS;
    }

    return parsed
      .filter((item, index) => {
        return (
          parsed.indexOf(item) === index &&
          item !== 'trash' &&
          catalogByKey.has(item)
        );
      })
      .slice(0, getMaxPinnedDockItemCount(0));
  } catch {
    return DEFAULT_PINNED_DOCK_KEYS;
  }
};

const savePinnedDockKeys = (keys: string[]) => {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(DESKTOP_PINNED_DOCK_STORAGE_KEY, JSON.stringify(keys));
  } catch {
    // ignore storage write errors
  }
};

export const useDesktopDockItems = () => {
  const [pinnedDockKeys, setPinnedDockKeys] = useState<string[]>(loadPinnedDockKeys);
  const [recentlyAddedItemKey, setRecentlyAddedItemKey] = useState<string | null>(null);
  const unpinnedDockKeys: string[] = [];
  const maxPinnedDockItemCount = getMaxPinnedDockItemCount(unpinnedDockKeys.length);

  useEffect(() => {
    savePinnedDockKeys(pinnedDockKeys);
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

  const items = useMemo<DockItem[]>(
    () => {
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

      return [
        ...createDockSectionItems(pinnedDockKeys, 'pinned'),
        ...createDockSectionItems(unpinnedDockKeys, 'unpinned'),
        ...createDockSectionItems(SYSTEM_DOCK_KEYS, 'system'),
      ];
    },
    [pinnedDockKeys, unpinnedDockKeys],
  );
  const isDockAtMaxItemCount = items.length >= MAX_DOCK_ITEM_COUNT;

  const addDockItem = (appKey: string, insertIndex?: number | null) => {
    setPinnedDockKeys(previous => {
      if (previous.includes(appKey) || appKey === 'trash' || !catalogByKey.has(appKey)) {
        return previous;
      }

      if (previous.length >= maxPinnedDockItemCount) {
        return previous;
      }

      setRecentlyAddedItemKey(appKey);

      const next = [...previous];
      const clampedInsertIndex =
        typeof insertIndex === 'number'
          ? Math.max(0, Math.min(insertIndex, previous.length))
          : previous.length;
      next.splice(clampedInsertIndex, 0, appKey);
      return next;
    });
  };

  return {
    items,
    addDockItem,
    isDockAtMaxItemCount,
    recentlyAddedItemKey,
  };
};
