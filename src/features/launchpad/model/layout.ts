import { LAUNCHPAD_PAGE_SIZE } from './constants';
import {flattenEntryAppKeys} from './operations';
import type { LaunchpadAppItem, LaunchpadDisplayItem, LaunchpadEntry } from './types';

export const sortAppsByOrder = (apps: LaunchpadAppItem[], orderedKeys: string[]) => {
  if (orderedKeys.length === 0) return apps;

  const byKey = new Map(apps.map(app => [app.key, app] as const));
  const picked = orderedKeys.map(key => byKey.get(key)).filter((app): app is LaunchpadAppItem => Boolean(app));
  const pickedKeys = new Set(picked.map(app => app.key));
  const rest = apps.filter(app => !pickedKeys.has(app.key));

  return [...picked, ...rest];
};

export const sortAppsByEntries = (apps: LaunchpadAppItem[], items: LaunchpadEntry[]) =>
  sortAppsByOrder(apps, flattenEntryAppKeys(items));

export const paginateAppsByEntries = (apps: LaunchpadAppItem[], items: LaunchpadEntry[]) => {
  const appByKey = new Map(apps.map(app => [app.key, app] as const));
  const pages: LaunchpadAppItem[][] = [[]];

  items.forEach(item => {
    if (item.type === 'page-break') {
      if (pages.at(-1)?.length === 0) {
        return;
      }

      pages.push([]);
      return;
    }

    if (item.type !== 'app') {
      return;
    }

    const app = appByKey.get(item.appKey);
    if (!app) {
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

    currentPage?.push(app);
  });

  if (pages.length > 1 && pages.at(-1)?.length === 0) {
    pages.pop();
  }

  return pages.length > 0 ? pages : [[]];
};

export const paginateApps = <TItem extends LaunchpadDisplayItem>(apps: TItem[]) => {
  const pages: TItem[][] = [];

  for (let index = 0; index < apps.length; index += LAUNCHPAD_PAGE_SIZE) {
    pages.push(apps.slice(index, index + LAUNCHPAD_PAGE_SIZE));
  }

  return pages.length > 0 ? pages : [[]];
};

export const filterApps = <TItem extends LaunchpadDisplayItem>(apps: TItem[], query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return apps;

  return apps.filter(app => {
    const label = app.label.toLowerCase();
    const key = app.key.toLowerCase();
    return label.includes(normalized) || key.includes(normalized);
  });
};
