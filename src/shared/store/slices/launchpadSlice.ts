import type {StateCreator} from 'zustand';
import type {AppStoreState} from '../app-store';

export type LaunchpadSlice = {
  isLaunchpadOpen: boolean;
  closeLaunchpad: () => void;
  toggleLaunchpad: () => void;
};

export const createLaunchpadSlice: StateCreator<AppStoreState, [], [], LaunchpadSlice> = set => ({
  isLaunchpadOpen: false,
  closeLaunchpad: () => set({isLaunchpadOpen: false}),
  toggleLaunchpad: () => set(state => ({isLaunchpadOpen: !state.isLaunchpadOpen})),
});
