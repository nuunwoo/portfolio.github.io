import {useAppStore} from '../../shared/store/app-store';
import {MenuBarContent, MenuBarMotion} from './ui';

export type MenuBarProps = Record<string, never>;

const MenuBar = () => {
  const hasUnlockedOnce = useAppStore(state => state.hasUnlockedOnce);
  const currentScreen = useAppStore(state => state.currentScreen);
  const isUnlocking = useAppStore(state => state.isUnlocking);
  const disableAnimation = !hasUnlockedOnce && !isUnlocking;
  const hideItems = currentScreen === 'lock' && !isUnlocking;

  return (
    <MenuBarMotion disableAnimation={disableAnimation} hideItems={hideItems}>
      <MenuBarContent />
    </MenuBarMotion>
  );
};

export default MenuBar;
