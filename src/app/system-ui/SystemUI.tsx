import {useAppKeyboardShortcuts} from '../hooks/useAppKeyboardShortcuts';
import Desktop from '../../features/desktop';
import Dock from '../../features/dock';
import Launchpad from '../../features/launchpad';
import Lock from '../../features/lock';
import {MenuBar} from '../../features/menu-bar';
import {useAppStore} from '../../shared/store/app-store';
import styles from './SystemUI.module.css';

const SystemUI = () => {
  const hasUnlockedOnce = useAppStore(state => state.hasUnlockedOnce);
  const currentScreen = useAppStore(state => state.currentScreen);
  const isUnlocking = useAppStore(state => state.isUnlocking);

  const disableDesktopAnimation = !hasUnlockedOnce && !isUnlocking;
  const hideDesktopItems = currentScreen === 'lock' && !isUnlocking;

  useAppKeyboardShortcuts();

  return (
    <div className={styles.root}>
      <div>
        <Desktop isScaledDown={false} disableScaleTransition={disableDesktopAnimation} hideAnimatedItems={hideDesktopItems} />

        <MenuBar />

        <Launchpad />

        <Dock />
      </div>

      <div>
        <Lock />
      </div>
    </div>
  );
};

export default SystemUI;
