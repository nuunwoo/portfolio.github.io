import Magnifyingglass from '../../../components/icons/search-actions/Magnifyingglass';
import styles from '../../desktop/ui/DesktopScreen.module.css';

type LaunchpadSearchBarProps = {
  value: string;
  isFocused: boolean;
  onChange: (nextValue: string) => void;
  onFocusChange: (focused: boolean) => void;
};

const LaunchpadSearchBar = ({ value, isFocused, onChange, onFocusChange }: LaunchpadSearchBarProps) => (
  <div
    className={`${styles.launchpadSearch} ${isFocused ? styles.launchpadSearchFocused : ''}`}
    role="search"
    aria-label="Launchpad search"
    data-launchpad-interactive="true">
    <Magnifyingglass className={styles.launchpadSearchIcon} aria-hidden={true} />
    <span
      className={`${styles.launchpadSearchGhost} ${isFocused ? styles.launchpadSearchGhostFocused : ''} ${
        value ? styles.launchpadSearchGhostHidden : ''
      }`}
      aria-hidden={true}>
      검색
    </span>
    <input
      type="text"
      value={value}
      onChange={event => onChange(event.target.value)}
      onFocus={() => onFocusChange(true)}
      onBlur={() => onFocusChange(false)}
      placeholder=""
      className={styles.launchpadSearchInput}
      data-launchpad-interactive="true"
    />
  </div>
);

export default LaunchpadSearchBar;
