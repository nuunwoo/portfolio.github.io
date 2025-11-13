import {create} from 'zustand';
import {createDockSlice, type DockSlice} from './slices/dockSlice';
import {createLaunchpadSlice, type LaunchpadSlice} from './slices/launchpadSlice';
import {createSystemSlice, type SystemSlice} from './slices/systemSlice';

export type ScreenName = 'splash' | 'lock' | 'desktop';

export type AppStoreState = SystemSlice & LaunchpadSlice & DockSlice;

export const useAppStore = create<AppStoreState>()((...args) => ({
  ...createSystemSlice(...args),
  ...createLaunchpadSlice(...args),
  ...createDockSlice(...args),
}));
