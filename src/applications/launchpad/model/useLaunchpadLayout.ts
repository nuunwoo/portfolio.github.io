import {useEffect, useMemo, useState} from 'react';
import {createAppEntry, createPageBreakEntry, flattenEntryAppKeys, normalizeLaunchpadEntries, reorderLaunchpadEntries, swapLaunchpadEntries} from './operations';
import {paginateAppsByEntries, sortAppsByEntries} from './layout';
import {loadLaunchpadLayout, saveLaunchpadLayout} from './storage';
import type {LaunchpadAppItem, LaunchpadEntry} from './types';

export type LaunchpadMoveMode = 'reorder' | 'swap';

type UseLaunchpadLayoutResult = {
  layoutItems: LaunchpadEntry[];
  orderedApps: LaunchpadAppItem[];
  pagedApps: LaunchpadAppItem[][];
  orderedKeys: string[];
  moveApp: (fromIndex: number, toIndex: number, mode?: LaunchpadMoveMode) => void;
  moveAppToNewPage: (fromIndex: number) => void;
  moveItem: (fromIndex: number, toIndex: number) => void;
  createFolder: (sourceIndex: number, targetIndex: number, title?: string) => void;
  addAppToFolder: (appKey: string, folderId: string) => void;
  removeAppFromFolder: (folderId: string, appKey: string) => void;
};

export const useLaunchpadLayout = (sourceApps: LaunchpadAppItem[]): UseLaunchpadLayoutResult => {
  const [layoutItems, setLayoutItems] = useState<LaunchpadEntry[]>(() => {
    const snapshot = loadLaunchpadLayout();
    return snapshot?.items ?? [];
  });

  const orderedApps = useMemo(() => sortAppsByEntries(sourceApps, layoutItems), [layoutItems, sourceApps]);
  const pagedApps = useMemo(() => paginateAppsByEntries(sourceApps, layoutItems), [layoutItems, sourceApps]);
  const orderedKeys = useMemo(() => flattenEntryAppKeys(layoutItems), [layoutItems]);

  useEffect(() => {
    const appKeys = sourceApps.map(app => app.key);
    setLayoutItems(previous => {
      const normalized = normalizeLaunchpadEntries(previous, appKeys);

      if (normalized.length === previous.length && normalized.every((item, index) => JSON.stringify(item) === JSON.stringify(previous[index]))) {
        return previous;
      }

      return normalized;
    });
  }, [sourceApps]);

  useEffect(() => {
    saveLaunchpadLayout({
      version: 3,
      items: layoutItems,
    });
  }, [layoutItems]);

  const getPageIndexForAppPosition = (pages: LaunchpadAppItem[][], appPosition: number) => {
    let offset = 0;

    for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
      const nextOffset = offset + pages[pageIndex].length;
      if (appPosition < nextOffset) {
        return pageIndex;
      }
      offset = nextOffset;
    }

    return Math.max(pages.length - 1, 0);
  };

  const createExplicitPageEntries = (pages: LaunchpadAppItem[]) => pages;

  const createExplicitPagedEntries = (pages: LaunchpadAppItem[][]): LaunchpadEntry[] =>
    pages.flatMap((page, pageIndex) => [
      ...page.map(app => createAppEntry(app.key)),
      ...(pageIndex < pages.length - 1 ? [createPageBreakEntry()] : []),
    ]);

  const moveApp = (fromIndex: number, toIndex: number, mode: LaunchpadMoveMode = 'reorder') => {
    setLayoutItems(previous => {
      const currentPages = paginateAppsByEntries(sourceApps, previous);
      const sourcePageIndex = getPageIndexForAppPosition(currentPages, fromIndex);
      const targetPageIndex = getPageIndexForAppPosition(currentPages, toIndex);
      const shouldPreservePageBoundaries = mode === 'reorder' && sourcePageIndex !== targetPageIndex;
      const baseItems = shouldPreservePageBoundaries ? createExplicitPagedEntries(currentPages) : previous;
      const appEntries = baseItems.filter((item): item is Extract<LaunchpadEntry, {type: 'app'}> => item.type === 'app');
      const sourceEntry = appEntries[fromIndex];
      const targetEntry = appEntries[toIndex];

      if (!sourceEntry || !targetEntry) {
        return previous;
      }

      const sourceLayoutIndex = baseItems.findIndex(item => item.id === sourceEntry.id);
      const targetLayoutIndex = baseItems.findIndex(item => item.id === targetEntry.id);

      if (sourceLayoutIndex === -1 || targetLayoutIndex === -1) {
        return previous;
      }

      if (mode === 'swap') {
        return swapLaunchpadEntries(baseItems, sourceLayoutIndex, targetLayoutIndex);
      }

      const adjustedTargetLayoutIndex =
        sourceLayoutIndex < targetLayoutIndex ? Math.max(targetLayoutIndex - 1, 0) : targetLayoutIndex;

      return reorderLaunchpadEntries(baseItems, sourceLayoutIndex, adjustedTargetLayoutIndex);
    });
  };

  const moveAppToNewPage = (fromIndex: number) => {
    setLayoutItems(previous => {
      const appEntries = previous.filter((item): item is Extract<LaunchpadEntry, {type: 'app'}> => item.type === 'app');
      const sourceEntry = appEntries[fromIndex];

      if (!sourceEntry) {
        return previous;
      }

      const sourceLayoutIndex = previous.findIndex(item => item.id === sourceEntry.id);
      if (sourceLayoutIndex === -1) {
        return previous;
      }

      const withoutSource = previous.filter((_, index) => index !== sourceLayoutIndex);
      const trimmedWithoutSource = normalizeLaunchpadEntries(withoutSource, flattenEntryAppKeys(withoutSource));
      const nextItems = trimmedWithoutSource.slice();
      const lastItem = nextItems.at(-1);

      if (lastItem?.type !== 'page-break') {
        nextItems.push(createPageBreakEntry());
      }

      nextItems.push(sourceEntry);
      return normalizeLaunchpadEntries(nextItems, flattenEntryAppKeys(nextItems));
    });
  };

  return {
    layoutItems,
    orderedApps,
    pagedApps,
    orderedKeys,
    moveApp,
    moveAppToNewPage,
    moveItem: (fromIndex, toIndex) => {
      setLayoutItems(previous => reorderLaunchpadEntries(previous, fromIndex, toIndex));
    },
    createFolder: (_sourceIndex, _targetIndex, _title) => {
      // grouping is temporarily disabled
    },
    addAppToFolder: (_appKey, _folderId) => {
      // grouping is temporarily disabled
    },
    removeAppFromFolder: (_folderId, _appKey) => {
      // grouping is temporarily disabled
    },
  };
};
