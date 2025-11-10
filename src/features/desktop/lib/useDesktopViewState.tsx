import {useCallback, useMemo} from 'react';
import {launchpadAppIcons} from '../../../assets/icons/generated/app-icons/catalog';
import {getAppIconSrc} from '../../../assets/icons/generated/app-icons';
import {useAppStore} from '../../../shared/store/app-store';
import {LaunchpadIcon, useLaunchpadLayout} from '../../../applications/launchpad';
import {useDesktopDockItems} from '../dock/useDesktopDockItems';

const DESKTOP_SHORTCUT_ITEMS = [
  {label: 'About Me', glyph: '👤'},
  {label: 'Projects', glyph: '🗂'},
  {label: 'Contact', glyph: '✉'},
] as const;

const DESKTOP_NOTIFICATIONS = [
  {title: 'Mail', body: '새 메일 2개가 도착했습니다.'},
  {title: 'Calendar', body: '10분 뒤 미팅이 시작됩니다.'},
] as const;

const SPOTLIGHT_ITEMS = ['Finder', 'Figma', 'Terminal', '시스템 설정'] as const;
const LIST_VIEW_ITEMS = ['아이콘으로 보기', '목록으로 보기', '정렬', '최근 폴더'] as const;
const BREADCRUMB_ITEMS = ['Macintosh HD', 'Users', 'hyunwoo'] as const;
const TAB_ITEMS = ['일반', '보기', '공유'] as const;
const TABLE_COLUMNS = ['이름', '종류', '수정한 날짜'] as const;
const TABLE_ROWS = [
  ['Design.fig', 'Figma', '오늘 09:12'],
  ['Readme.md', 'Markdown', '어제 20:03'],
] as const;

export const useDesktopViewState = () => {
  const closeLaunchpad = useAppStore(state => state.closeLaunchpad);
  const currentScreen = useAppStore(state => state.currentScreen);
  const isLaunchpadOpen = useAppStore(state => state.isLaunchpadOpen);
  const toggleLaunchpad = useAppStore(state => state.toggleLaunchpad);
  const {items: dockItems, addDockItem, isDockAtMaxItemCount, recentlyAddedItemKey} = useDesktopDockItems();

  const launchpadSourceApps = useMemo(
    () =>
      launchpadAppIcons.map(item => ({
        key: item.key,
        icon: <LaunchpadIcon name={item.icon} label={item.label} />,
        iconSrc: getAppIconSrc(item.icon),
        label: item.label,
      })),
    [],
  );

  const {orderedApps: launchpadApps, pagedApps: launchpadPagedApps, moveApp, moveAppToNewPage} = useLaunchpadLayout(launchpadSourceApps);
  const isFocused = currentScreen === 'desktop';
  const handleDesktopSurfaceClick = useCallback(() => {
    closeLaunchpad();
  }, [closeLaunchpad]);

  return {
    breadcrumbItems: BREADCRUMB_ITEMS,
    desktopNotifications: DESKTOP_NOTIFICATIONS,
    desktopShortcutItems: DESKTOP_SHORTCUT_ITEMS,
    dockItems,
    finderListItems: LIST_VIEW_ITEMS,
    isFocused,
    isDockAtMaxItemCount,
    isLaunchpadOpen,
    launchpadApps,
    launchpadPagedApps,
    recentlyAddedItemKey,
    spotlightItems: SPOTLIGHT_ITEMS,
    tabItems: TAB_ITEMS,
    tableColumns: TABLE_COLUMNS,
    tableRows: TABLE_ROWS,
    addDockItem,
    closeLaunchpad,
    handleDesktopSurfaceClick,
    moveApp,
    moveAppToNewPage,
    toggleLaunchpad,
  };
};
