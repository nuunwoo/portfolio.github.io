import {motion} from 'framer-motion';
import {useCallback, useState} from 'react';
import MenuBar from '../menu-bar/MenuBar';
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
  SheetSurface,
} from '../../../design-system/components';
import DesktopDock from '../dock/DesktopDock';
import {LaunchpadOverlay} from '../../../applications/launchpad';
import {ScreenBackground} from '../../../shared/ui/screen-background';
import {WINDOW_KEYS} from '../../../utils/windowKeys';
import {
  desktopContentItemInitialState,
  desktopSceneMotionConfig,
  getDesktopContentItemMotion,
  getDesktopContentItemTransition,
  getDesktopDockMotion,
  getDesktopDockTransition,
  getDesktopMenuBarMotion,
  getDesktopMenuBarTransition,
} from '../lib/desktopMotionConfig';
import {useDesktopViewState} from '../lib/useDesktopViewState';
import styles from './DesktopView.module.css';

type DesktopViewProps = {
  isScaledDown?: boolean;
  disableScaleTransition?: boolean;
  hideAnimatedItems?: boolean;
};

const DesktopView = ({isScaledDown = false, disableScaleTransition = false, hideAnimatedItems = false}: DesktopViewProps) => {
  const {
    addDockItem,
    breadcrumbItems,
    closeLaunchpad,
    desktopNotifications,
    desktopShortcutItems,
    dockItems,
    finderListItems,
    handleDesktopSurfaceClick,
    isFocused,
    isDockAtMaxItemCount,
    isLaunchpadOpen,
    launchpadApps,
    launchpadPagedApps,
    moveApp,
    moveAppToNewPage,
    recentlyAddedItemKey,
    spotlightItems,
    tabItems,
    tableColumns,
    tableRows,
    toggleLaunchpad,
  } = useDesktopViewState();
  const [isDockDropTargetActive, setIsDockDropTargetActive] = useState(false);
  const [dockDropPreviewIndex, setDockDropPreviewIndex] = useState<number | null>(null);
  const [dockDropPointerPosition, setDockDropPointerPosition] = useState<{x: number; y: number} | null>(null);
  const desktopContentMotion = getDesktopContentItemMotion(hideAnimatedItems, isScaledDown);
  const desktopContentTransition = getDesktopContentItemTransition(disableScaleTransition);
  const handleDockDragHoverChange = useCallback((clientX: number | null, clientY: number | null) => {
    if (isDockAtMaxItemCount) {
      setIsDockDropTargetActive(false);
      setDockDropPointerPosition(null);
      setDockDropPreviewIndex(null);
      return;
    }

    const isActive = clientX !== null && clientY !== null;
    setIsDockDropTargetActive(isActive);
    setDockDropPointerPosition(isActive ? {x: clientX, y: clientY} : null);
    if (!isActive) {
      setDockDropPreviewIndex(null);
    }
  }, [isDockAtMaxItemCount]);
  const handleDockPreviewIndexChange = useCallback((nextIndex: number | null) => {
    setDockDropPreviewIndex(nextIndex);
  }, []);
  const handleCopyAppToDock = useCallback((appKey: string) => {
    if (isDockAtMaxItemCount) {
      return;
    }

    addDockItem(appKey, dockDropPreviewIndex);
    setDockDropPointerPosition(null);
    setDockDropPreviewIndex(null);
    setIsDockDropTargetActive(false);
  }, [addDockItem, dockDropPreviewIndex, isDockAtMaxItemCount]);

  return (
    <section data-window-key={WINDOW_KEYS.desktopScreen} className={`${styles.root} ${isFocused ? styles.focused : ''}`}>
      <motion.div className={styles.scene} {...desktopSceneMotionConfig}>
        <ScreenBackground />
        <div className={styles.desktopLayer}>
          <LaunchpadOverlay
            isOpen={isLaunchpadOpen}
            apps={launchpadApps}
            pagedApps={launchpadPagedApps}
            onMoveApp={moveApp}
            onMoveAppToNewPage={moveAppToNewPage}
            onCopyAppToDock={handleCopyAppToDock}
            onDockDragHoverChange={handleDockDragHoverChange}
            onClose={closeLaunchpad}
          />

          <motion.div
            className={styles.menuBarArea}
            animate={getDesktopMenuBarMotion(hideAnimatedItems, isScaledDown)}
            transition={getDesktopMenuBarTransition(disableScaleTransition)}
            initial={false}>
            <MenuBar />
          </motion.div>
          <SheetSurface />
          <div className={styles.desktopContentGrid}>
            <div className={styles.shortcutRail}>
              {desktopShortcutItems.map(item => (
                <motion.div key={item.label} className={styles.scaledDesktopPanel} animate={desktopContentMotion} transition={desktopContentTransition} initial={desktopContentItemInitialState}>
                  <button key={item.label} type="button" className={styles.shortcutButton}>
                    <span className={`material-surface material-light material-medium material-dynamic-on-light shape-squircle-lg ${styles.shortcutIcon}`}>{item.glyph}</span>
                    <span className={`text-footnote font-medium text-primary-dark ${styles.shortcutLabel}`}>{item.label}</span>
                  </button>
                </motion.div>
              ))}
            </div>

            <div className={styles.desktopPreviewColumn} onPointerDown={handleDesktopSurfaceClick}>
              <motion.div className={styles.scaledDesktopPanel} animate={desktopContentMotion} transition={desktopContentTransition} initial={desktopContentItemInitialState}>
                <WindowFrame title="Finder">
                  <div className={styles.finderPreviewCard}>
                    <Toolbar>
                      <Tabs items={tabItems as unknown as string[]} active="보기" />
                      <ToolbarSpacer />
                      <OsButton>정렬</OsButton>
                      <OsButton tone="primary">새 창</OsButton>
                    </Toolbar>

                    <div className={styles.finderPreviewLayout}>
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
                          <div className={styles.finderPreviewBody}>
                            <p className={`text-caption-1 font-semibold text-secondary-dark ${styles.previewEyebrow}`}>Design System</p>
                            <h2 className={`text-large-title font-semibold text-primary-dark ${styles.previewHeadline}`}>macOS-style patterns & components</h2>
                            <p className={`text-body font-regular text-secondary-dark ${styles.previewDescription}`}>
                              window, dock, menu, toolbar, sidebar, tabs, list, progress, button까지 OS 레이어를 컴포넌트화했습니다.
                            </p>
                            <ProgressBar value={64} />
                            <div className={styles.finderListSection}>
                              <ListView items={finderListItems as unknown as string[]} active="정렬" />
                            </div>
                            <Breadcrumbs items={breadcrumbItems as unknown as string[]} />
                            <div className={styles.desktopControlRow}>
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
                            <TableView columns={tableColumns as unknown as string[]} rows={tableRows as unknown as string[][]} />
                          </div>
                        }
                      />
                    </div>
                  </div>
                </WindowFrame>
              </motion.div>

              <motion.div className={styles.scaledDesktopPanel} animate={desktopContentMotion} transition={desktopContentTransition} initial={desktopContentItemInitialState}>
                <div className={styles.widgetShowcaseGrid}>
                  <SpotlightOverlay items={spotlightItems as unknown as string[]} />
                  <NotificationCenter notifications={desktopNotifications as unknown as {title: string; body: string}[]} />
                </div>
              </motion.div>
            </div>
          </div>

          <div className={styles.desktopDockArea}>
            <motion.div className={styles.dockMotion} animate={getDesktopDockMotion(hideAnimatedItems, isScaledDown)} transition={getDesktopDockTransition(disableScaleTransition)} initial={false}>
              <DesktopDock
                items={dockItems}
                isLaunchpadOpen={isLaunchpadOpen}
                isReceivingDrop={isDockDropTargetActive}
                dropPreviewClientX={dockDropPointerPosition?.x ?? null}
                dropPreviewClientY={dockDropPointerPosition?.y ?? null}
                dropPreviewIndex={dockDropPreviewIndex}
                recentlyAddedItemKey={recentlyAddedItemKey}
                onLaunchpadToggle={toggleLaunchpad}
                onDropPreviewIndexChange={handleDockPreviewIndexChange}
                onOtherItemClick={handleDesktopSurfaceClick}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default DesktopView;
