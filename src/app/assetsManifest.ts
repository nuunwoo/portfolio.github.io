export const ASSETS = {
  lockBg: { key: "lock-bg", src: "/wallpapers/wallpapers_14.webp" },
  desktopBg: { key: "desktop-bg", src: "/wallpapers/wallpapers_1.webp" },
} as const;

export const FIRST_BOOT_ASSETS = [ASSETS.lockBg, ASSETS.desktopBg];
export const LOCK_REQUIRED_KEYS = [ASSETS.lockBg.key];
export const DESKTOP_REQUIRED_KEYS = [ASSETS.desktopBg.key];
