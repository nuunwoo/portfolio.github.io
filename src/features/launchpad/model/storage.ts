import { LAUNCHPAD_LAYOUT_STORAGE_KEY } from './constants';
import type { LaunchpadLayoutSnapshot } from './types';

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const loadLaunchpadLayout = (): LaunchpadLayoutSnapshot | null => {
  if (!isBrowser()) return null;

  try {
    const raw = window.localStorage.getItem(LAUNCHPAD_LAYOUT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LaunchpadLayoutSnapshot;

    if (parsed?.version !== 1 || !Array.isArray(parsed.orderedKeys) || !Array.isArray(parsed.groups)) {
      return null;
    }

    return parsed;
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
