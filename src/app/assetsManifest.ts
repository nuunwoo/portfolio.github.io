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

export const getWallpaperSrcForDate = (date: Date) => {
  const minutesInDay = date.getHours() * 60 + date.getMinutes();
  const slotMinutes = (24 * 60) / WALLPAPER_SOURCES.length;
  const shiftedMinutes = minutesInDay + 30;
  const index = Math.floor(shiftedMinutes / slotMinutes) % WALLPAPER_SOURCES.length;
  return WALLPAPER_SOURCES[index];
};

export const getBootAssetsForDate = (date: Date) => {
  const wallpaperSrc = getWallpaperSrcForDate(date);
  return {
    lockBg: { key: "lock-bg", src: wallpaperSrc },
    desktopBg: { key: "desktop-bg", src: wallpaperSrc },
  } as const;
};

export const LOCK_REQUIRED_KEYS = ["lock-bg"] as const;
export const DESKTOP_REQUIRED_KEYS = ["desktop-bg"] as const;

export const FONT_PRELOAD_TARGETS = [
  { key: "font-sf-pro-400", family: "SF Pro", weight: 400 },
  { key: "font-sf-pro-500", family: "SF Pro", weight: 500 },
  { key: "font-sf-pro-600", family: "SF Pro", weight: 600 },
  { key: "font-sf-pro-700", family: "SF Pro", weight: 700 },
] as const;

export const FONT_REQUIRED_KEYS = FONT_PRELOAD_TARGETS.map(({ key }) => key) as readonly string[];
