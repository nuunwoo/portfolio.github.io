import { WINDOW_KEYS, type WindowKey } from "../../utils/windowKeys";

export const APPLE_MENU_KEY = "__apple_menu__";

export type SubmenuEntry = {
  label: string;
  shortcut?: string;
  disabled?: boolean;
  emphasized?: boolean;
  hasSubmenu?: boolean;
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
      { label: "아이콘으로 보기", shortcut: "⌘1" },
      { label: "목록으로 보기", shortcut: "⌘2" },
      { label: "정렬", hasSubmenu: true, dividerAbove: true },
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

export const menuBarPresetByWindowKey: Partial<Record<WindowKey, MenuBarPreset>> = {
  [WINDOW_KEYS.desktopScreen]: finderMenuPreset,
};

export const getMenuBarPreset = (windowKey: WindowKey | null): MenuBarPreset => {
  if (!windowKey) return fallbackMenuPreset;
  return menuBarPresetByWindowKey[windowKey] ?? fallbackMenuPreset;
};
