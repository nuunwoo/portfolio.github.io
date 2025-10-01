import Dock from '../../../components/Dock/Dock';
import MenuBar from '../../../components/MenuBar/MenuBar';
import {useCurrentWallpaper} from '../../../hooks/useCurrentWallpaper';
import {useAppStore} from '../../../shared/store/app-store';
import {WINDOW_KEYS} from '../../../utils/windowKeys';
import styles from './DesktopScreen.module.css';

const DesktopScreen = () => {
  const wallpaperSrc = useCurrentWallpaper();
  const isFocused = useAppStore(state => state.focusedWindowKey === WINDOW_KEYS.desktopScreen);
  const focusWindow = useAppStore(state => state.focusWindow);

  return (
    <section
      data-window-key={WINDOW_KEYS.desktopScreen}
      onPointerDown={() => focusWindow(WINDOW_KEYS.desktopScreen)}
      className={`${styles.root} ${isFocused ? styles.focused : ''}`}>
      <img src={wallpaperSrc} alt="Desktop wallpaper" className="wallpaper" />
      <div className={styles.contentLayer}>
        <div className={styles.menuBarArea}>
          <MenuBar />
        </div>

        <div className={styles.desktopGrid}>
          <div className={styles.shortcutColumn}>
            {[
              {label: 'About Me', glyph: '👤'},
              {label: 'Projects', glyph: '🗂'},
              {label: 'Contact', glyph: '✉'},
            ].map(item => (
              <button key={item.label} type="button" className={styles.shortcutButton}>
                <span
                  className={`material-surface material-light material-medium material-dynamic-on-light shape-squircle-lg ${styles.shortcutIcon}`}>
                  {item.glyph}
                </span>
                <span className={`text-footnote font-medium text-primary-dark ${styles.shortcutLabel}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <div className={styles.previewArea}>
            <div
              className={`material-surface material-dark material-thick material-dynamic-on-dark shape-squircle-lg ${styles.previewCard}`}>
              <p className={`text-caption-1 font-semibold text-secondary-dark ${styles.previewCaption}`}>
                Desktop Preview
              </p>
              <h2 className={`text-large-title font-semibold text-primary-dark ${styles.previewTitle}`}>
                macOS-inspired portfolio workspace
              </h2>
              <p className={`text-body font-regular text-secondary-dark ${styles.previewBody}`}>
                Menu bar and dock are now separated into reusable components so we can evolve the desktop into a real
                portfolio launcher next.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.dockArea}>
          <Dock />
        </div>
      </div>
    </section>
  );
};

export default DesktopScreen;
