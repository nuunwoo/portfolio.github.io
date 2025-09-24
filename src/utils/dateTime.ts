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

export const formatMenuBarTime = (date: Date) =>
  new Intl.DateTimeFormat("ko-KR", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
