export const formatLockScreenTime = (date: Date) =>
  new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

export const formatLockScreenDate = (date: Date) =>
  new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);

export type MenuBarClockFormatOptions = {
  locale?: string;
  timeZone?: string;
  hour12?: boolean;
  weekday?: "short" | "long" | "narrow";
};

export const defaultMenuBarClockFormat: Required<MenuBarClockFormatOptions> = {
  locale: "ko-KR",
  timeZone: "Asia/Seoul",
  hour12: true,
  weekday: "short",
};

export const formatMenuBarDateTime = (
  date: Date,
  options: MenuBarClockFormatOptions = {}
) => {
  const resolvedOptions = {
    ...defaultMenuBarClockFormat,
    ...options,
  };

  const datePart = new Intl.DateTimeFormat(resolvedOptions.locale, {
    month: "long",
    day: "numeric",
    timeZone: resolvedOptions.timeZone,
  }).format(date);

  const weekdayPart = new Intl.DateTimeFormat(resolvedOptions.locale, {
    weekday: resolvedOptions.weekday,
    timeZone: resolvedOptions.timeZone,
  }).format(date);

  const timePart = new Intl.DateTimeFormat(resolvedOptions.locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: resolvedOptions.hour12,
    timeZone: resolvedOptions.timeZone,
  }).format(date);

  return `${datePart} (${weekdayPart}) ${timePart}`;
};
