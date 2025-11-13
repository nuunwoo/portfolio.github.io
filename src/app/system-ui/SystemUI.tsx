import {useAppKeyboardShortcuts} from '../hooks/useAppKeyboardShortcuts';
import {useSystemUIViewState} from '../hooks/useSystemUIViewState';
import Desktop from '../../features/desktop';
import Dock from '../../features/dock';
import Launchpad from '../../features/launchpad';
import Lock from '../../features/lock';
import MenuBar from '../../features/menu-bar';
import styles from './SystemUI.module.css';

const SystemUI = () => {
  const {disableDesktopAnimation, hideDesktopItems} = useSystemUIViewState();

  useAppKeyboardShortcuts();

  return (
    <div className={styles.root}>
      <div className={styles.desktopLayer}>
        <Desktop isScaledDown={false} disableScaleTransition={disableDesktopAnimation} hideAnimatedItems={hideDesktopItems} />
        <MenuBar />
        <Launchpad />
        <Dock />
      </div>
      <div className={styles.lockLayer}>
        <Lock />
      </div>
    </div>
  );
};

export default SystemUI;
