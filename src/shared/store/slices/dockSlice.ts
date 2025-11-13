import {dockAppIcons} from '../../../assets/icons/generated/app-icons/catalog';
import type {StateCreator} from 'zustand';
import type {AppStoreState} from '../app-store';

const DOCK_PINNED_STORAGE_KEY = 'desktop-dock-pinned-items-v1';
const DEFAULT_PINNED_DOCK_KEYS = dockAppIcons.filter(item => item.key !== 'trash').map(item => item.key);

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const loadPinnedDockKeys = () => {
  if (!isBrowser()) return DEFAULT_PINNED_DOCK_KEYS;

  try {
    const raw = window.localStorage.getItem(DOCK_PINNED_STORAGE_KEY);
    if (!raw) return DEFAULT_PINNED_DOCK_KEYS;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.some(item => typeof item !== 'string')) {
      return DEFAULT_PINNED_DOCK_KEYS;
    }

    return parsed.filter((item, index) => parsed.indexOf(item) === index && item !== 'trash');
  } catch {
    return DEFAULT_PINNED_DOCK_KEYS;
  }
};

export const savePinnedDockKeys = (keys: string[]) => {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(DOCK_PINNED_STORAGE_KEY, JSON.stringify(keys));
  } catch {
    // ignore storage write errors
  }
};

export type DockSlice = {
  pinnedDockKeys: string[];
  recentlyAddedDockItemKey: string | null;
  isDockDropTargetActive: boolean;
  dockDropPointerPosition: {x: number; y: number} | null;
  dockDropPreviewIndex: number | null;
  setPinnedDockKeys: (keys: string[]) => void;
  setRecentlyAddedDockItemKey: (key: string | null) => void;
  setDockDropTargetActive: (isActive: boolean) => void;
  setDockDropPointerPosition: (position: {x: number; y: number} | null) => void;
  setDockDropPreviewIndex: (index: number | null) => void;
};

export const createDockSlice: StateCreator<AppStoreState, [], [], DockSlice> = set => ({
  pinnedDockKeys: loadPinnedDockKeys(),
  recentlyAddedDockItemKey: null,
  isDockDropTargetActive: false,
  dockDropPointerPosition: null,
  dockDropPreviewIndex: null,
  setPinnedDockKeys: keys => set({pinnedDockKeys: keys}),
  setRecentlyAddedDockItemKey: key => set({recentlyAddedDockItemKey: key}),
  setDockDropTargetActive: isActive => set({isDockDropTargetActive: isActive}),
  setDockDropPointerPosition: position => set({dockDropPointerPosition: position}),
  setDockDropPreviewIndex: index => set({dockDropPreviewIndex: index}),
});
