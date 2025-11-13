import type {ReactNode} from 'react';
import styles from './LockScreenLayout.module.css';

type LockScreenLayoutProps = {
  clockDisplay: ReactNode;
  unlockPanel: ReactNode;
};

const LockScreenLayout = ({clockDisplay, unlockPanel}: LockScreenLayoutProps) => (
  <div className={styles.layout}>
    <div className={styles.centerContent}>
      {clockDisplay}
      {unlockPanel}
    </div>
  </div>
);

export default LockScreenLayout;
