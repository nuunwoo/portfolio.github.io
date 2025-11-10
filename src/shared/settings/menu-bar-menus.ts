import type { ScreenName } from "../store/app-store";

export const APPLE_MENU_KEY = "__apple_menu__";

export type SubmenuEntry = {
  label: string;
  header?: boolean;
  shortcut?: string;
  symbol?: string;
  selected?: boolean;
  disabled?: boolean;
  emphasized?: boolean;
  hasSubmenu?: boolean;
  submenuItems?: SubmenuEntry[];
  dividerAbove?: boolean;
};

export type MenuBarPreset = {
  leftItems: readonly string[];
  submenuByKey: Record<string, SubmenuEntry[]>;
};

const finderMenuPreset: MenuBarPreset = {
  leftItems: ["Finder", "파일", "편집", "보기", "이동", "윈도우", "도움말"],
  submenuByKey: {
    [APPLE_MENU_KEY]: [
      { label: "About This Mac" },
      { label: "System Settings..." },
      { label: "App Store..." },
      { label: "최근 항목", hasSubmenu: true, dividerAbove: true },
      { label: "강제 종료...", shortcut: "⌥⌘⎋", dividerAbove: true },
    ],
    Finder: [
      { label: "About Finder" },
      { label: "설정...", shortcut: "⌘," },
      { label: "휴지통 비우기...", dividerAbove: true },
    ],
    파일: [
      { label: "새로운 Finder 윈도우", shortcut: "⌘N" },
      { label: "새로운 폴더", shortcut: "⇧⌘N" },
      { label: "정보 가져오기", shortcut: "⌘I", dividerAbove: true },
    ],
    편집: [
      { label: "실행 취소", shortcut: "⌘Z" },
      { label: "다시 실행", shortcut: "⇧⌘Z" },
      { label: "잘라내기", shortcut: "⌘X", dividerAbove: true },
      { label: "복사", shortcut: "⌘C" },
      { label: "붙여넣기", shortcut: "⌘V" },
    ],
    보기: [
      { label: "아이콘으로 보기", shortcut: "⌘1", selected: true },
      { label: "목록으로 보기", shortcut: "⌘2" },
      {
        label: "정렬",
        hasSubmenu: true,
        dividerAbove: true,
        submenuItems: [
          { label: "윤곽선 표시", shortcut: "⌘O" },
          { label: "숨겨진 레이어 포함" },
          { label: "개체 경계 포함" },
        ],
      },
      {
        label: "아이템 14케이스",
        hasSubmenu: true,
        submenuItems: [
          { label: "Action · Selection=False", header: true },
          { label: "Action Idle" },
          { label: "Action Hover + Key", shortcut: "⌘A" },
          { label: "Action Disabled", disabled: true },
          { label: "Action Selected Idle", selected: true },
          { label: "Action Selected + Key", selected: true, shortcut: "⌘A" },
          { label: "Action Selected Disabled", selected: true, disabled: true },
          { label: "Submenu · Selection=False", header: true, dividerAbove: true },
          {
            label: "Submenu Idle",
            hasSubmenu: true,
            submenuItems: [{ label: "하위 항목 1" }, { label: "하위 항목 2" }],
          },
          {
            label: "Submenu Hover + Key",
            hasSubmenu: true,
            shortcut: "⌘A",
            submenuItems: [{ label: "하위 항목 1" }, { label: "하위 항목 2", shortcut: "⌘2" }],
          },
          {
            label: "Submenu Disabled",
            hasSubmenu: true,
            disabled: true,
            submenuItems: [{ label: "하위 항목 1" }],
          },
          { label: "Submenu · Selection=True", header: true, dividerAbove: true },
          {
            label: "Submenu Selected Idle",
            hasSubmenu: true,
            selected: true,
            submenuItems: [{ label: "하위 항목 1" }, { label: "하위 항목 2" }],
          },
          {
            label: "Submenu Selected + Key",
            hasSubmenu: true,
            selected: true,
            shortcut: "⌘A",
            submenuItems: [{ label: "하위 항목 1" }, { label: "하위 항목 2", shortcut: "⌘2" }],
          },
          {
            label: "Submenu Selected Disabled",
            hasSubmenu: true,
            selected: true,
            disabled: true,
            submenuItems: [{ label: "하위 항목 1" }],
          },
        ],
      },
    ],
    이동: [
      { label: "최근 폴더", hasSubmenu: true },
      { label: "문서", shortcut: "⇧⌘O" },
      { label: "다운로드", shortcut: "⌥⌘L" },
    ],
    윈도우: [
      { label: "최소화", shortcut: "⌘M" },
      { label: "확대/축소", disabled: true },
      { label: "채우기", shortcut: "^⌘F", disabled: true },
      { label: "중앙 정렬", shortcut: "^⌘C", disabled: true },
      { label: "이동 및 크기 조절", hasSubmenu: true, dividerAbove: true },
      { label: "전체 화면 타일", hasSubmenu: true, disabled: true },
      { label: "세트에서 윈도우 제거", disabled: true, dividerAbove: true },
      { label: "내장 Retina 디스플레이(으)로 이동", disabled: true, dividerAbove: true },
      { label: "윈도우 순환", shortcut: "⌘`", emphasized: true },
      { label: "진행 윈도우 보기", disabled: true },
      { label: "모두 앞으로 가져오기", emphasized: true, dividerAbove: true },
      { label: "이전 탭 보기", shortcut: "^⇧⇥", disabled: true, dividerAbove: true },
      { label: "다음 탭 보기", shortcut: "^⇥", disabled: true },
      { label: "새로운 윈도우로 탭 이동", disabled: true },
      { label: "모든 윈도우 통합", disabled: true },
    ],
    도움말: [
      { label: "검색" },
      { label: "사용 가이드" },
      { label: "단축키" },
    ],
  },
};

const fallbackMenuPreset = finderMenuPreset;

export const menuBarPresetByScreen: Partial<Record<ScreenName, MenuBarPreset>> = {
  desktop: finderMenuPreset,
};

export const getMenuBarPreset = (screen: ScreenName): MenuBarPreset => {
  return menuBarPresetByScreen[screen] ?? fallbackMenuPreset;
};
