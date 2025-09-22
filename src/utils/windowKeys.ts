export const WINDOW_KEYS = {
  splashScreen: "splash-screen",
  lockScreen: "lock-screen",
  desktopScreen: "desktop-screen",
} as const;

export type WindowKey = (typeof WINDOW_KEYS)[keyof typeof WINDOW_KEYS];
