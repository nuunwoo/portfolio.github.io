import type { MenuBarClockFormatOptions } from "../../utils/dateTime";
import { defaultMenuBarClockFormat } from "../../utils/dateTime";

// Future settings hook/UI can update this shape (locale/timeZone/hour12/weekday).
// MenuBar can then consume user preference state instead of this static config.
export const menuBarClockSettings: MenuBarClockFormatOptions = {
  ...defaultMenuBarClockFormat,
};
