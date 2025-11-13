import {clampIndex, reorderList} from '../../../shared/dnd/reorder';
import type {LaunchpadAppEntry, LaunchpadEntry, LaunchpadFolderEntry} from './types';

const createFolderId = () => `folder:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 8)}`;
const createPageBreakId = () => `page-break:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 8)}`;

export const createAppEntry = (appKey: string): LaunchpadAppEntry => ({
  id: `app:${appKey}`,
  type: 'app',
  appKey,
});

export const createPageBreakEntry = (): Extract<LaunchpadEntry, {type: 'page-break'}> => ({
  id: createPageBreakId(),
  type: 'page-break',
});

export const flattenEntryAppKeys = (items: LaunchpadEntry[]) =>
  items.flatMap(item => {
    if (item.type === 'app') return item.appKey;
    if (item.type === 'folder') return item.children;
    return [];
  });

export const reorderLaunchpadEntries = (items: LaunchpadEntry[], fromIndex: number, toIndex: number) =>
  reorderList(items, fromIndex, toIndex);

export const swapLaunchpadEntries = (items: LaunchpadEntry[], fromIndex: number, toIndex: number) => {
  if (items.length === 0) return items;

  const safeFrom = clampIndex(fromIndex, items.length - 1);
  const safeTo = clampIndex(toIndex, items.length - 1);
  if (safeFrom === safeTo) return items;

  const next = items.slice();
  [next[safeFrom], next[safeTo]] = [next[safeTo], next[safeFrom]];
  return next;
};

export const createFolderFromEntries = (
  items: LaunchpadEntry[],
  sourceIndex: number,
  targetIndex: number,
  title = '앱 모음'
) => {
  if (sourceIndex === targetIndex) return items;

  const sourceItem = items[sourceIndex];
  const targetItem = items[targetIndex];

  if (!sourceItem || !targetItem || sourceItem.type !== 'app' || targetItem.type !== 'app') {
    return items;
  }

  const nextItems = items.filter((_, index) => index !== sourceIndex && index !== targetIndex);
  const insertIndex = Math.min(sourceIndex, targetIndex);

  nextItems.splice(insertIndex, 0, {
    id: createFolderId(),
    type: 'folder',
    title,
    children: [targetItem.appKey, sourceItem.appKey],
  });

  return nextItems;
};

export const moveAppIntoFolder = (items: LaunchpadEntry[], appKey: string, folderId: string) => {
  const sourceIndex = items.findIndex(item => item.type === 'app' && item.appKey === appKey);
  const targetIndex = items.findIndex(item => item.type === 'folder' && item.id === folderId);

  if (sourceIndex === -1 || targetIndex === -1) return items;

  const sourceItem = items[sourceIndex];
  const targetItem = items[targetIndex];

  if (!sourceItem || sourceItem.type !== 'app' || !targetItem || targetItem.type !== 'folder') {
    return items;
  }

  return items
    .filter((_, index) => index !== sourceIndex)
    .map(item =>
      item.id === folderId && item.type === 'folder'
        ? {
            ...item,
            children: [...item.children, sourceItem.appKey],
          }
        : item
    );
};

export const removeAppFromFolder = (items: LaunchpadEntry[], folderId: string, appKey: string) => {
  const nextItems: LaunchpadEntry[] = [];

  items.forEach(item => {
    if (item.id !== folderId || item.type !== 'folder') {
      nextItems.push(item);
      return;
    }

    const remainingChildren = item.children.filter(childKey => childKey !== appKey);

    if (remainingChildren.length <= 1) {
      remainingChildren.forEach(childKey => {
        nextItems.push(createAppEntry(childKey));
      });
      nextItems.push(createAppEntry(appKey));
      return;
    }

    nextItems.push({
      ...item,
      children: remainingChildren,
    });
    nextItems.push(createAppEntry(appKey));
  });

  return nextItems;
};

export const normalizeLaunchpadEntries = (items: LaunchpadEntry[], appKeys: string[]) => {
  const validAppKeys = new Set(appKeys);
  const consumedKeys = new Set<string>();

  const normalizedItems = items.flatMap<LaunchpadEntry>(item => {
    if (item.type === 'page-break') {
      return [{...item}];
    }

    if (item.type === 'app') {
      if (!validAppKeys.has(item.appKey) || consumedKeys.has(item.appKey)) {
        return [];
      }

      consumedKeys.add(item.appKey);
      return [{...item, id: `app:${item.appKey}`}];
    }

    const children = item.children.filter(childKey => {
      if (!validAppKeys.has(childKey) || consumedKeys.has(childKey)) {
        return false;
      }

      consumedKeys.add(childKey);
      return true;
    });

    if (children.length === 0) {
      return [];
    }

    if (children.length === 1) {
      return [createAppEntry(children[0])];
    }

    return [
      {
        ...item,
        children,
      },
    ];
  });

  const compactedItems = normalizedItems.filter((item, index, array) => {
    if (item.type !== 'page-break') {
      return true;
    }

    if (index === 0 || index === array.length - 1) {
      return false;
    }

    return array[index - 1]?.type !== 'page-break';
  });

  const missingKeys = appKeys.filter(appKey => !consumedKeys.has(appKey));
  return [...compactedItems, ...missingKeys.map(createAppEntry)];
};
