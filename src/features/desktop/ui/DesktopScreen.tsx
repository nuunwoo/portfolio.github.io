import MenuBar from '../../../components/MenuBar/MenuBar';
import {
  Breadcrumbs,
  Checkbox,
  ListView,
  NotificationCenter,
  OsButton,
  OsDock,
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
  type DockItem,
  WindowFrame,
} from '../../../design-system/components';
import {useCurrentWallpaper} from '../../../hooks/useCurrentWallpaper';
import {useAppStore} from '../../../shared/store/app-store';
import {WINDOW_KEYS} from '../../../utils/windowKeys';
import styles from './DesktopScreen.module.css';

const dockItems: DockItem[] = [
  {key: 'finder', label: 'Finder', glyph: '🙂', tint: '#8fc6ff', running: true},
  {key: 'launchpad', label: 'Launchpad', glyph: '◻', tint: '#f3f4f8', running: true},
  {key: 'mail', label: 'Mail', glyph: '✉', tint: '#6ec7ff', badge: '109', running: true},
  {key: 'calendar', label: 'Calendar', glyph: '14', tint: '#ffffff', running: true},
  {key: 'notes', label: 'Notes', glyph: '📝', tint: '#ffe47f', running: true},
  {key: 'terminal', label: 'Terminal', glyph: '>_', tint: '#1a1b20', running: true},
  {key: 'figma', label: 'Figma', glyph: '◍', tint: '#25262c', running: true},
  {key: 'trash', label: 'Trash', glyph: '🗑', tint: '#f0f2f8', running: true},
];

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
          <OsDock items={dockItems} />
        </div>
      </div>
    </section>
  );
};

export default DesktopScreen;
