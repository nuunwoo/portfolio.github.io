import {formatMenuBarDateTime} from '../../../../utils/dateTime';
import {useCurrentDateTime} from '../../../../shared/hooks/useCurrentDateTime';
import {menuBarClockSettings} from '../../../../shared/settings/clock-settings';
import {StatusBattery100PercentIcon, StatusSpeakerWave2Icon, StatusWifiIcon} from '../../../../design-system/icons';
import styles from './MenuBarStatusArea.module.css';

const MenuBarStatusArea = () => {
  const currentDate = useCurrentDateTime({align: 'minute'});

  return (
    <div className={styles.statusArea}>
      <span className={styles.statusItem} aria-label="Speaker volume">
        <StatusSpeakerWave2Icon className={`${styles.statusIcon} ${styles.speakerIcon}`} />
      </span>
      <span className={styles.statusItem} aria-label="Wi-Fi">
        <StatusWifiIcon className={styles.statusIcon} />
      </span>
      <span className={styles.statusItem} aria-label="Battery">
        <StatusBattery100PercentIcon className={`${styles.statusIcon} ${styles.batteryIcon}`} />
      </span>
      <span className={styles.clock}>{formatMenuBarDateTime(currentDate, menuBarClockSettings)}</span>
    </div>
  );
};

export default MenuBarStatusArea;
