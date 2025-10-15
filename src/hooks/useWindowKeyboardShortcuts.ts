import { useEffect } from "react";
import type { WindowKey } from "../utils/windowKeys";

type KeyboardShortcutContext = {
  event: KeyboardEvent;
  focusedWindowKey: WindowKey | null;
};

type KeyboardShortcutHandler = (context: KeyboardShortcutContext) => void;

type KeyboardShortcutMap = Partial<Record<WindowKey, KeyboardShortcutHandler>>;

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toLowerCase();
  return (
    target.isContentEditable ||
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select"
  );
};

type UseWindowKeyboardShortcutsOptions = {
  focusedWindowKey: WindowKey | null;
  handlersByWindowKey: KeyboardShortcutMap;
  enabled?: boolean;
};

export const useWindowKeyboardShortcuts = ({
  focusedWindowKey,
  handlersByWindowKey,
  enabled = true,
}: UseWindowKeyboardShortcutsOptions) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!enabled) return;
      if (isTypingTarget(event.target)) return;
      if (!focusedWindowKey) return;

      const handler = handlersByWindowKey[focusedWindowKey];
      if (!handler) return;

      handler({ event, focusedWindowKey });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [enabled, focusedWindowKey, handlersByWindowKey]);
};
