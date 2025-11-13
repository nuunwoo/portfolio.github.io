import {useAppStore} from '../../shared/store/app-store';

export const useSystemUIViewState = () => {
  const hasUnlockedOnce = useAppStore(state => state.hasUnlockedOnce);
  const currentScreen = useAppStore(state => state.currentScreen);
  const isUnlocking = useAppStore(state => state.isUnlocking);

  return {
    hideDesktopItems: currentScreen === 'lock' && !isUnlocking,
    disableDesktopAnimation: !hasUnlockedOnce && !isUnlocking,
  };
};
