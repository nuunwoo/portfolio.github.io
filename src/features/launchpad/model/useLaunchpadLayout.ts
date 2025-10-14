import { useEffect, useMemo, useState } from 'react';
import { reorderList } from '../../../shared/dnd/reorder';
import { sortAppsByOrder } from './layout';
import { loadLaunchpadLayout, saveLaunchpadLayout } from './storage';
import type { LaunchpadAppItem } from './types';

const uniqueKeys = (keys: string[]) => Array.from(new Set(keys));

type UseLaunchpadLayoutResult = {
  orderedApps: LaunchpadAppItem[];
  orderedKeys: string[];
  moveApp: (fromIndex: number, toIndex: number) => void;
};

export const useLaunchpadLayout = (sourceApps: LaunchpadAppItem[]): UseLaunchpadLayoutResult => {
  const [orderedKeys, setOrderedKeys] = useState<string[]>(() => {
    const snapshot = loadLaunchpadLayout();
    return snapshot?.orderedKeys ?? [];
  });

  const orderedApps = useMemo(
    () => sortAppsByOrder(sourceApps, orderedKeys),
    [orderedKeys, sourceApps]
  );

  useEffect(() => {
    const fallbackKeys = sourceApps.map(app => app.key);
    setOrderedKeys(previous => {
      const merged = uniqueKeys([...previous, ...fallbackKeys]).filter(key =>
        fallbackKeys.includes(key)
      );

      if (merged.length === previous.length && merged.every((key, index) => key === previous[index])) {
        return previous;
      }

      return merged;
    });
  }, [sourceApps]);

  useEffect(() => {
    saveLaunchpadLayout({
      version: 1,
      orderedKeys,
      groups: [],
    });
  }, [orderedKeys]);

  const moveApp = (fromIndex: number, toIndex: number) => {
    setOrderedKeys(previous => reorderList(previous, fromIndex, toIndex));
  };

  return {
    orderedApps,
    orderedKeys,
    moveApp,
  };
};
