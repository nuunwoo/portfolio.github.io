import {useCallback} from 'react';
import {useAppStore} from '../../../shared/store/app-store';

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
const ROADMAP_SECTIONS = [
  {
    title: 'Current Sprint',
    accent: '긴급',
    items: [
      'Launchpad 아이콘 Drag & Drop 정렬 + localStorage 반영',
      'Launchpad 그룹 생성/해제(폴더) 데이터 모델 설계',
      'Dock/Desktop 공통 DnD 이벤트 계층 분리',
    ],
  },
  {
    title: 'Window System',
    accent: '구조',
    items: [
      'Window 공통 컴포넌트 제작',
      '최소화/최대화/복원 애니메이션 구현',
      '창 포커스와 active z-index 규칙 정리',
    ],
  },
  {
    title: 'Quality',
    accent: '안정화',
    items: [
      'Dock/Window/MenuBar 단위 테스트 기반 추가',
      'Launchpad model/UI 테스트 추가',
      '아이콘 자산 로딩 전략 최적화',
    ],
  },
] as const;

export type DesktopWorkspaceState = {
  breadcrumbItems: typeof BREADCRUMB_ITEMS;
  desktopNotifications: typeof DESKTOP_NOTIFICATIONS;
  desktopShortcutItems: typeof DESKTOP_SHORTCUT_ITEMS;
  finderListItems: typeof LIST_VIEW_ITEMS;
  handleDesktopSurfaceClick: () => void;
  isFocused: boolean;
  roadmapSections: typeof ROADMAP_SECTIONS;
  spotlightItems: typeof SPOTLIGHT_ITEMS;
  tabItems: typeof TAB_ITEMS;
  tableColumns: typeof TABLE_COLUMNS;
  tableRows: typeof TABLE_ROWS;
};

export const useDesktopWorkspaceState = (): DesktopWorkspaceState => {
  const closeLaunchpad = useAppStore(state => state.closeLaunchpad);
  const currentScreen = useAppStore(state => state.currentScreen);

  const isFocused = currentScreen === 'desktop';
  const handleDesktopSurfaceClick = useCallback(() => {
    closeLaunchpad();
  }, [closeLaunchpad]);

  return {
    breadcrumbItems: BREADCRUMB_ITEMS,
    desktopNotifications: DESKTOP_NOTIFICATIONS,
    desktopShortcutItems: DESKTOP_SHORTCUT_ITEMS,
    finderListItems: LIST_VIEW_ITEMS,
    handleDesktopSurfaceClick,
    isFocused,
    roadmapSections: ROADMAP_SECTIONS,
    spotlightItems: SPOTLIGHT_ITEMS,
    tabItems: TAB_ITEMS,
    tableColumns: TABLE_COLUMNS,
    tableRows: TABLE_ROWS,
  };
};
export const useDesktopState = useDesktopWorkspaceState;
export const useDesktopViewState = useDesktopWorkspaceState;
