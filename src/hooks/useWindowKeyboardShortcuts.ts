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
};

export const useWindowKeyboardShortcuts = ({
  focusedWindowKey,
  handlersByWindowKey,
}: UseWindowKeyboardShortcutsOptions) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
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
  }, [focusedWindowKey, handlersByWindowKey]);
};
