import MenuBar from '../../shell/menu-bar/MenuBar';
import {
  Breadcrumbs,
  Checkbox,
  ListView,
  NotificationCenter,
  OsButton,
  Radio,
  ProgressBar,
  SelectField,
  Sidebar,
  SidebarItem,
  SidebarSectionTitle,
  Slider,
  SpotlightOverlay,
  SplitView,
  Switch,
  TableView,
  TextField,
  Tabs,
  Toolbar,
  ToolbarSpacer,
  WindowFrame,
} from '../../../design-system/components';
import {useMemo} from 'react';
import {launchpadAppIcons} from '../../../components/icons/app-icons/catalog';
import DesktopDock from '../../shell/dock/DesktopDock';
import {LaunchpadIcon, useLaunchpadLayout} from '../../launchpad';
import {useCurrentWallpaper} from '../../../hooks/useCurrentWallpaper';
import {useAppStore} from '../../../shared/store/app-store';
import {WINDOW_KEYS} from '../../../utils/windowKeys';
import LaunchpadOverlayMotion from './animations/LaunchpadOverlayMotion';
import styles from './DesktopScreen.module.css';

const DesktopScreen = () => {
  const wallpaperSrc = useCurrentWallpaper();
  const closeLaunchpad = useAppStore(state => state.closeLaunchpad);
  const isFocused = useAppStore(state => state.focusedWindowKey === WINDOW_KEYS.desktopScreen);
  const isLaunchpadOpen = useAppStore(state => state.isLaunchpadOpen);
  const focusWindow = useAppStore(state => state.focusWindow);
  const toggleLaunchpad = useAppStore(state => state.toggleLaunchpad);

  const launchpadSourceApps = useMemo(
    () =>
      launchpadAppIcons.map(item => ({
        key: item.key,
        icon: <LaunchpadIcon name={item.icon} label={item.label} />,
        label: item.label,
      })),
    []
  );
  const {orderedApps: launchpadApps} = useLaunchpadLayout(launchpadSourceApps);

  return (
    <section
      data-window-key={WINDOW_KEYS.desktopScreen}
      onPointerDown={() => focusWindow(WINDOW_KEYS.desktopScreen)}
      className={`${styles.root} ${isFocused ? styles.focused : ''}`}>
      <img src={wallpaperSrc} alt="Desktop wallpaper" className="wallpaper" />
      <div className={styles.contentLayer}>
        <LaunchpadOverlayMotion isOpen={isLaunchpadOpen} apps={launchpadApps} onClose={closeLaunchpad} />

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
            <WindowFrame title="Finder">
              <div className={styles.previewCard}>
                <Toolbar>
                  <Tabs items={['일반', '보기', '공유']} active="보기" />
                  <ToolbarSpacer />
                  <OsButton>정렬</OsButton>
                  <OsButton tone="primary">새 창</OsButton>
                </Toolbar>

                <div className={styles.previewLayout}>
                  <SplitView
                    left={
                      <Sidebar>
                        <SidebarSectionTitle>Favorites</SidebarSectionTitle>
                        <SidebarItem active={true}>최근 항목</SidebarItem>
                        <SidebarItem>문서</SidebarItem>
                        <SidebarItem>다운로드</SidebarItem>
                      </Sidebar>
                    }
                    right={
                      <div className={styles.previewBodyWrap}>
                        <p className={`text-caption-1 font-semibold text-secondary-dark ${styles.previewCaption}`}>
                          Design System
                        </p>
                        <h2 className={`text-large-title font-semibold text-primary-dark ${styles.previewTitle}`}>
                          macOS-style patterns & components
                        </h2>
                        <p className={`text-body font-regular text-secondary-dark ${styles.previewBody}`}>
                          window, dock, menu, toolbar, sidebar, tabs, list, progress, button까지 OS 레이어를
                          컴포넌트화했습니다.
                        </p>
                        <ProgressBar value={64} />
                        <div className={styles.previewList}>
                          <ListView items={['아이콘으로 보기', '목록으로 보기', '정렬', '최근 폴더']} active="정렬" />
                        </div>
                        <Breadcrumbs items={['Macintosh HD', 'Users', 'hyunwoo']} />
                        <div className={styles.controlRow}>
                          <Switch checked={true} />
                          <Checkbox checked={true} />
                          <Radio checked={true} />
                          <TextField placeholder="이름" />
                          <SelectField defaultValue="name">
                            <option value="name">이름순</option>
                            <option value="date">날짜순</option>
                          </SelectField>
                          <Slider defaultValue={60} />
                        </div>
                        <TableView
                          columns={['이름', '종류', '수정한 날짜']}
                          rows={[
                            ['Design.fig', 'Figma', '오늘 09:12'],
                            ['Readme.md', 'Markdown', '어제 20:03'],
                          ]}
                        />
                      </div>
                    }
                  />
                </div>
              </div>
            </WindowFrame>

            <div className={styles.patternArea}>
              <SpotlightOverlay items={['Finder', 'Figma', 'Terminal', '시스템 설정']} />
              <NotificationCenter
                notifications={[
                  {title: 'Mail', body: '새 메일 2개가 도착했습니다.'},
                  {title: 'Calendar', body: '10분 뒤 미팅이 시작됩니다.'},
                ]}
              />
            </div>
          </div>
        </div>

        <div className={styles.dockArea}>
          <DesktopDock
            isLaunchpadOpen={isLaunchpadOpen}
            onLaunchpadToggle={toggleLaunchpad}
            onOtherItemClick={closeLaunchpad}
          />
        </div>
      </div>
    </section>
  );
};

export default DesktopScreen;
