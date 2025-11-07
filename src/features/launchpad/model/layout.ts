import { LAUNCHPAD_PAGE_SIZE } from './constants';
import {flattenEntryAppKeys} from './operations';
import type { LaunchpadAppItem, LaunchpadEntry } from './types';

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

export const paginateApps = (apps: LaunchpadAppItem[]) => {
  const pages: LaunchpadAppItem[][] = [];

  for (let index = 0; index < apps.length; index += LAUNCHPAD_PAGE_SIZE) {
    pages.push(apps.slice(index, index + LAUNCHPAD_PAGE_SIZE));
  }

  return pages.length > 0 ? pages : [[]];
};

export const filterApps = (apps: LaunchpadAppItem[], query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return apps;

  return apps.filter(app => {
    const label = app.label.toLowerCase();
    const key = app.key.toLowerCase();
    return label.includes(normalized) || key.includes(normalized);
  });
};
