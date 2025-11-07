import {useEffect, useMemo, useState} from 'react';
import {createFolderFromEntries, flattenEntryAppKeys, moveAppIntoFolder, normalizeLaunchpadEntries, removeAppFromFolder, reorderLaunchpadEntries} from './operations';
import {sortAppsByEntries} from './layout';
import {loadLaunchpadLayout, saveLaunchpadLayout} from './storage';
import type {LaunchpadAppItem, LaunchpadEntry} from './types';

type UseLaunchpadLayoutResult = {
  layoutItems: LaunchpadEntry[];
  orderedApps: LaunchpadAppItem[];
  orderedKeys: string[];
  moveApp: (fromIndex: number, toIndex: number) => void;
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
      version: 2,
      items: layoutItems,
    });
  }, [layoutItems]);

  const moveApp = (fromIndex: number, toIndex: number) => {
    console.log({fromIndex, toIndex});

    setLayoutItems(previous => {
      const appEntries = previous.filter((item): item is Extract<LaunchpadEntry, {type: 'app'}> => item.type === 'app');
      const sourceEntry = appEntries[fromIndex];
      const targetEntry = appEntries[toIndex];

      if (!sourceEntry || !targetEntry) {
        return previous;
      }

      const sourceLayoutIndex = previous.findIndex(item => item.id === sourceEntry.id);
      const targetLayoutIndex = previous.findIndex(item => item.id === targetEntry.id);

      if (sourceLayoutIndex === -1 || targetLayoutIndex === -1) {
        return previous;
      }

      return reorderLaunchpadEntries(previous, sourceLayoutIndex, targetLayoutIndex);
    });
  };

  return {
    layoutItems,
    orderedApps,
    orderedKeys,
    moveApp,
    moveItem: (fromIndex, toIndex) => {
      setLayoutItems(previous => reorderLaunchpadEntries(previous, fromIndex, toIndex));
    },
    createFolder: (sourceIndex, targetIndex, title) => {
      setLayoutItems(previous => createFolderFromEntries(previous, sourceIndex, targetIndex, title));
    },
    addAppToFolder: (appKey, folderId) => {
      setLayoutItems(previous => moveAppIntoFolder(previous, appKey, folderId));
    },
    removeAppFromFolder: (folderId, appKey) => {
      setLayoutItems(previous => removeAppFromFolder(previous, folderId, appKey));
    },
  };
};
