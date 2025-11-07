export const WALLPAPER_SOURCES = [
  "/wallpapers/wallpapers_01.webp",
  "/wallpapers/wallpapers_02.webp",
  "/wallpapers/wallpapers_03.webp",
  "/wallpapers/wallpapers_04.webp",
  "/wallpapers/wallpapers_05.webp",
  "/wallpapers/wallpapers_06.webp",
  "/wallpapers/wallpapers_07.webp",
  "/wallpapers/wallpapers_08.webp",
  "/wallpapers/wallpapers_09.webp",
  "/wallpapers/wallpapers_10.webp",
  "/wallpapers/wallpapers_11.webp",
  "/wallpapers/wallpapers_12.webp",
  "/wallpapers/wallpapers_13.webp",
  "/wallpapers/wallpapers_14.webp",
  "/wallpapers/wallpapers_15.webp",
  "/wallpapers/wallpapers_16.webp",
] as const;

export type ScreenBackgroundTarget = "desktop" | "lock" | "launchpad";

export const getWallpaperSrcForDate = (date: Date) => {
  const minutesInDay = date.getHours() * 60 + date.getMinutes();
  const slotMinutes = (24 * 60) / WALLPAPER_SOURCES.length;
  const shiftedMinutes = minutesInDay + 30;
  const index = Math.floor(shiftedMinutes / slotMinutes) % WALLPAPER_SOURCES.length;
  return WALLPAPER_SOURCES[index];
};

export const getBackgroundSrcForDate = (date: Date, target: ScreenBackgroundTarget = "desktop") => {
  const desktopBackgroundSrc = getWallpaperSrcForDate(date);

  switch (target) {
    case "lock":
      return desktopBackgroundSrc;
    case "launchpad":
      return desktopBackgroundSrc;
    case "desktop":
    default:
      return desktopBackgroundSrc;
  }
};

export const getBootAssetsForDate = (date: Date) => {
  return {
    lockBg: { key: "lock-bg", src: getBackgroundSrcForDate(date, "lock") },
    desktopBg: { key: "desktop-bg", src: getBackgroundSrcForDate(date, "desktop") },
  } as const;
};

export const LOCK_REQUIRED_KEYS = ["lock-bg"] as const;
export const DESKTOP_REQUIRED_KEYS = ["desktop-bg"] as const;

export const FONT_PRELOAD_TARGETS = [
  { key: "font-sf-pro-300", family: "SF Pro", weight: 300, src: "/fonts/SF-Pro-Light.woff2" },
  { key: "font-sf-pro-400", family: "SF Pro", weight: 400, src: "/fonts/SF-Pro-Regular.woff2" },
  { key: "font-sf-pro-500", family: "SF Pro", weight: 500, src: "/fonts/SF-Pro-Medium.woff2" },
  { key: "font-sf-pro-600", family: "SF Pro", weight: 600, src: "/fonts/SF-Pro-Semibold.woff2" },
  { key: "font-sf-pro-700", family: "SF Pro", weight: 700, src: "/fonts/SF-Pro-Bold.woff2" },
  { key: "font-sf-pro-800", family: "SF Pro", weight: 800, src: "/fonts/SF-Pro-Heavy.woff2" },
] as const;

export const FONT_REQUIRED_KEYS = FONT_PRELOAD_TARGETS.map(({ key }) => key) as readonly string[];
