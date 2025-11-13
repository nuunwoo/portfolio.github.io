import {useEffect, useMemo, useState} from 'react';
import {createAppEntry, createFolderFromEntries, createPageBreakEntry, flattenEntryAppKeys, normalizeLaunchpadEntries, reorderLaunchpadEntries, swapLaunchpadEntries} from './operations';
import {LAUNCHPAD_PAGE_SIZE} from './constants';
import {paginateAppsByEntries, sortAppsByEntries} from './layout';
import {loadLaunchpadLayout, saveLaunchpadLayout} from './storage';
import type {LaunchpadAppItem, LaunchpadEntry} from './types';

const SAMPLE_FOLDER_ID = 'folder:launchpad-sample';
const SAMPLE_FOLDER_TITLE = '앱 모음';
const SAMPLE_FOLDER_CHILDREN = [
  'shortcuts',
  'quicktime-player',
  'notes',
  'launchpad',
  'system-settings',
  'textedit',
  'calculator',
  'music',
  'calendar',
] as const;

export type LaunchpadMoveMode = 'reorder' | 'swap';
type LaunchpadMovableEntry = Exclude<LaunchpadEntry, {type: 'page-break'}>;

type UseLaunchpadLayoutResult = {
  layoutItems: LaunchpadEntry[];
  orderedApps: LaunchpadAppItem[];
  pagedApps: LaunchpadAppItem[][];
  orderedKeys: string[];
  moveApp: (fromIndex: number, toIndex: number, mode?: LaunchpadMoveMode) => void;
  moveAppToNewPage: (fromIndex: number) => void;
  moveAppToPageEnd: (fromIndex: number, targetPageIndex: number) => void;
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
  const sourceAppKeys = useMemo(() => sourceApps.map(app => app.key), [sourceApps]);

  const orderedApps = useMemo(() => sortAppsByEntries(sourceApps, layoutItems), [layoutItems, sourceApps]);
  const pagedApps = useMemo(() => paginateAppsByEntries(sourceApps, layoutItems), [layoutItems, sourceApps]);
  const orderedKeys = useMemo(() => flattenEntryAppKeys(layoutItems), [layoutItems]);

  useEffect(() => {
    setLayoutItems(previous => {
      const normalized = normalizeLaunchpadEntries(previous, sourceAppKeys);

      if (normalized.length === previous.length && normalized.every((item, index) => JSON.stringify(item) === JSON.stringify(previous[index]))) {
        return previous;
      }

      return normalized;
    });
  }, [sourceAppKeys]);

  useEffect(() => {
    if (sourceAppKeys.length === 0) {
      return;
    }

    setLayoutItems(previous => {
      const hasFolder = previous.some(item => item.type === 'folder');
      if (hasFolder) {
        return previous;
      }

      const sampleChildren = SAMPLE_FOLDER_CHILDREN.filter(appKey => sourceAppKeys.includes(appKey));
      if (sampleChildren.length < 2) {
        return previous;
      }

      return normalizeLaunchpadEntries(
        [
          {
            id: SAMPLE_FOLDER_ID,
            type: 'folder',
            title: SAMPLE_FOLDER_TITLE,
            children: [...sampleChildren],
          },
          ...previous,
        ],
        sourceAppKeys,
      );
    });
  }, [sourceAppKeys]);

  useEffect(() => {
    saveLaunchpadLayout({
      version: 3,
      items: layoutItems,
    });
  }, [layoutItems]);

  const getPageIndexForEntryPosition = (pages: LaunchpadMovableEntry[][], appPosition: number) => {
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

  const paginateEntriesByItems = (items: LaunchpadEntry[]) => {
    const pages: LaunchpadMovableEntry[][] = [[]];

    items.forEach(item => {
      if (item.type === 'page-break') {
        if (pages.at(-1)?.length === 0) {
          return;
        }

        pages.push([]);
        return;
      }

      let currentPage = pages.at(-1);
      if (!currentPage) {
        pages.push([]);
        currentPage = pages.at(-1);
      }

      if ((currentPage?.length ?? 0) >= LAUNCHPAD_PAGE_SIZE) {
        pages.push([]);
        currentPage = pages.at(-1);
      }

      currentPage?.push(item);
    });

    if (pages.length > 1 && pages.at(-1)?.length === 0) {
      pages.pop();
    }

    return pages.length > 0 ? pages : [[]];
  };

  const createExplicitPagedEntries = (pages: LaunchpadMovableEntry[][]): LaunchpadEntry[] =>
    pages.flatMap((page, pageIndex) => [
      ...page.map(item => ({...item})),
      ...(pageIndex < pages.length - 1 ? [createPageBreakEntry()] : []),
    ]);

  const compactPagedItems = (pages: LaunchpadMovableEntry[][]) => {
    const nonEmptyPages = pages.filter(page => page.length > 0);
    return nonEmptyPages.length > 0 ? nonEmptyPages : [[]];
  };

  const createNormalizedPagedEntries = (pages: LaunchpadMovableEntry[][]) =>
    normalizeLaunchpadEntries(createExplicitPagedEntries(compactPagedItems(pages)), sourceAppKeys);

  const getPageOffset = (pages: LaunchpadMovableEntry[][], pageIndex: number) => {
    let offset = 0;

    for (let index = 0; index < pageIndex; index += 1) {
      offset += pages[index]?.length ?? 0;
    }

    return offset;
  };

  const pushOverflowForward = (pages: LaunchpadMovableEntry[][], startPageIndex: number) => {
    const nextPages = pages.map(page => [...page]);

    for (let pageIndex = Math.max(0, startPageIndex); pageIndex < nextPages.length; pageIndex += 1) {
      while ((nextPages[pageIndex]?.length ?? 0) > LAUNCHPAD_PAGE_SIZE) {
        const overflowItem = nextPages[pageIndex]?.pop();

        if (!overflowItem) {
          break;
        }

        if (!nextPages[pageIndex + 1]) {
          nextPages[pageIndex + 1] = [];
        }

        nextPages[pageIndex + 1].unshift(overflowItem);
      }
    }

    return nextPages;
  };

  const moveApp = (fromIndex: number, toIndex: number, mode: LaunchpadMoveMode = 'reorder') => {
    setLayoutItems(previous => {
      const currentPages = paginateEntriesByItems(previous);
      const sourcePageIndex = getPageIndexForEntryPosition(currentPages, fromIndex);
      const targetPageIndex = getPageIndexForEntryPosition(currentPages, toIndex);
      if (mode === 'reorder' && sourcePageIndex !== targetPageIndex) {
        const nextPages = currentPages.map(page => [...page]);
        const sourcePage = nextPages[sourcePageIndex];

        if (!sourcePage) {
          return previous;
        }

        const sourcePageOffset = getPageOffset(nextPages, sourcePageIndex);
        const sourceIndexInPage = fromIndex - sourcePageOffset;
        const [movedEntry] = sourcePage.splice(sourceIndexInPage, 1);

        if (!movedEntry) {
          return previous;
        }

        const pagesAfterRemoval =
          sourcePage.length === 0
            ? nextPages.filter((_, pageIndex) => pageIndex !== sourcePageIndex)
            : nextPages;

        const adjustedTargetPageIndex =
          sourcePage.length === 0 && sourcePageIndex < targetPageIndex ? targetPageIndex - 1 : targetPageIndex;

        while (pagesAfterRemoval.length <= adjustedTargetPageIndex) {
          pagesAfterRemoval.push([]);
        }

        const originalTargetPageOffset = getPageOffset(currentPages, targetPageIndex);
        const rawTargetIndexInPage = toIndex - originalTargetPageOffset;
        const safeTargetIndexInPage = Math.max(
          0,
          Math.min(rawTargetIndexInPage, pagesAfterRemoval[adjustedTargetPageIndex].length),
        );

        pagesAfterRemoval[adjustedTargetPageIndex].splice(safeTargetIndexInPage, 0, movedEntry);

        return createNormalizedPagedEntries(
          pushOverflowForward(pagesAfterRemoval, adjustedTargetPageIndex),
        );
      }

      const baseItems = previous;
      const movableEntries = baseItems.filter((item): item is LaunchpadMovableEntry => item.type !== 'page-break');
      const sourceEntry = movableEntries[fromIndex];
      if (!sourceEntry) {
        return previous;
      }

      const sourceLayoutIndex = baseItems.findIndex(item => item.id === sourceEntry.id);
      if (sourceLayoutIndex === -1) {
        return previous;
      }

      if (mode === 'swap') {
        const targetEntry = movableEntries[toIndex];
        if (!targetEntry) {
          return previous;
        }

        const targetLayoutIndex = baseItems.findIndex(item => item.id === targetEntry.id);
        if (targetLayoutIndex === -1) {
          return previous;
        }

        return normalizeLaunchpadEntries(swapLaunchpadEntries(baseItems, sourceLayoutIndex, targetLayoutIndex), sourceAppKeys);
      }

      const safeToIndex = Math.max(0, Math.min(toIndex, movableEntries.length - 1));
      const reorderedMovableEntries = movableEntries.filter(item => item.id !== sourceEntry.id);
      reorderedMovableEntries.splice(safeToIndex, 0, sourceEntry);

      let movableCursor = 0;
      const reorderedBaseItems = baseItems.map(item => {
        if (item.type === 'page-break') {
          return item;
        }

        const nextItem = reorderedMovableEntries[movableCursor];
        movableCursor += 1;
        return nextItem ?? item;
      });

      return normalizeLaunchpadEntries(reorderedBaseItems, sourceAppKeys);
    });
  };

  const moveAppToNewPage = (fromIndex: number) => {
    setLayoutItems(previous => {
      const currentPages = paginateEntriesByItems(previous).map(page => [...page]);
      const sourcePageIndex = getPageIndexForEntryPosition(currentPages, fromIndex);
      const sourcePage = currentPages[sourcePageIndex];

      if (!sourcePage) {
        return previous;
      }

      let sourcePageOffset = 0;
      for (let index = 0; index < sourcePageIndex; index += 1) {
        sourcePageOffset += currentPages[index].length;
      }

      const sourceIndexInPage = fromIndex - sourcePageOffset;
      const [movedApp] = sourcePage.splice(sourceIndexInPage, 1);

      if (!movedApp) {
        return previous;
      }

      const nextPages = compactPagedItems(currentPages);
      nextPages.push([movedApp]);
      return createNormalizedPagedEntries(nextPages);
    });
  };

  const moveAppToPageEnd = (fromIndex: number, targetPageIndex: number) => {
    setLayoutItems(previous => {
      const currentPages = paginateEntriesByItems(previous).map(page => [...page]);
      const sourcePageIndex = getPageIndexForEntryPosition(currentPages, fromIndex);
      const sourcePage = currentPages[sourcePageIndex];

      if (!sourcePage) {
        return previous;
      }

      let sourcePageOffset = 0;
      for (let index = 0; index < sourcePageIndex; index += 1) {
        sourcePageOffset += currentPages[index].length;
      }

      const sourceIndexInPage = fromIndex - sourcePageOffset;
      const [movedApp] = sourcePage.splice(sourceIndexInPage, 1);

      if (!movedApp) {
        return previous;
      }

      const nextPages =
        sourcePage.length === 0
          ? currentPages.filter((_, pageIndex) => pageIndex !== sourcePageIndex)
          : currentPages;
      const adjustedTargetPageIndex =
        sourcePage.length === 0 && sourcePageIndex < targetPageIndex ? targetPageIndex - 1 : targetPageIndex;

      while (nextPages.length <= adjustedTargetPageIndex) {
        nextPages.push([]);
      }

      nextPages[adjustedTargetPageIndex].push(movedApp);
      return createNormalizedPagedEntries(nextPages);
    });
  };

  return {
    layoutItems,
    orderedApps,
    pagedApps,
    orderedKeys,
    moveApp,
    moveAppToNewPage,
    moveAppToPageEnd,
    moveItem: (fromIndex, toIndex) => {
      setLayoutItems(previous => reorderLaunchpadEntries(previous, fromIndex, toIndex));
    },
    createFolder: (sourceIndex, targetIndex, title) => {
      setLayoutItems(previous => {
        const movableEntries = previous.filter((item): item is LaunchpadMovableEntry => item.type !== 'page-break');
        const sourceEntry = movableEntries[sourceIndex];
        const targetEntry = movableEntries[targetIndex];

        if (!sourceEntry || !targetEntry || sourceEntry.type !== 'app' || targetEntry.type !== 'app') {
          return previous;
        }

        const sourceLayoutIndex = previous.findIndex(item => item.id === sourceEntry.id);
        const targetLayoutIndex = previous.findIndex(item => item.id === targetEntry.id);

        if (sourceLayoutIndex === -1 || targetLayoutIndex === -1) {
          return previous;
        }

        return normalizeLaunchpadEntries(createFolderFromEntries(previous, sourceLayoutIndex, targetLayoutIndex, title), sourceAppKeys);
      });
    },
    addAppToFolder: (_appKey, _folderId) => {
      // grouping is temporarily disabled
    },
    removeAppFromFolder: (_folderId, _appKey) => {
      // grouping is temporarily disabled
    },
  };
};
