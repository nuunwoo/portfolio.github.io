import { LAUNCHPAD_LAYOUT_STORAGE_KEY } from './constants';
import {createAppEntry} from './operations';
import type { LaunchpadEntry, LaunchpadLayoutSnapshot } from './types';

const LEGACY_LAUNCHPAD_LAYOUT_STORAGE_KEY = 'launchpad-layout-v1';

type LegacyLaunchpadLayoutSnapshot = {
  version: 1;
  orderedKeys: string[];
  groups: Array<{id: string; key: string; title: string; children: string[]}>;
};

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const isLaunchpadEntry = (item: unknown): item is LaunchpadEntry => {
  if (!item || typeof item !== 'object') return false;

  const candidate = item as Record<string, unknown>;

  if (candidate.type === 'app') {
    return typeof candidate.id === 'string' && typeof candidate.appKey === 'string';
  }

  if (candidate.type === 'folder') {
    return typeof candidate.id === 'string' && typeof candidate.title === 'string' && Array.isArray(candidate.children);
  }

  if (candidate.type === 'page-break') {
    return typeof candidate.id === 'string';
  }

  return false;
};

const fromLegacySnapshot = (snapshot: LegacyLaunchpadLayoutSnapshot): LaunchpadLayoutSnapshot => {
  const folderByKey = new Map(
    snapshot.groups.map(group => [
      group.key,
      {
        id: group.id,
        type: 'folder' as const,
        title: group.title,
        children: group.children,
      },
    ])
  );

  const items = snapshot.orderedKeys.map(key => folderByKey.get(key) ?? createAppEntry(key));
  return {
    version: 3,
    items,
  };
};

export const loadLaunchpadLayout = (): LaunchpadLayoutSnapshot | null => {
  if (!isBrowser()) return null;

  try {
    const raw =
      window.localStorage.getItem(LAUNCHPAD_LAYOUT_STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_LAUNCHPAD_LAYOUT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LaunchpadLayoutSnapshot | LegacyLaunchpadLayoutSnapshot;

    if ((parsed?.version === 2 || parsed?.version === 3) && Array.isArray(parsed.items) && parsed.items.every(isLaunchpadEntry)) {
      return parsed;
    }

    if (parsed?.version === 1 && Array.isArray(parsed.orderedKeys) && Array.isArray(parsed.groups)) {
      return fromLegacySnapshot(parsed);
    }

    return null;
  } catch {
    return null;
  }
};

export const saveLaunchpadLayout = (snapshot: LaunchpadLayoutSnapshot) => {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(LAUNCHPAD_LAYOUT_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // ignore storage write errors
  }
};
