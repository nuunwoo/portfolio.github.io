import type {Transition} from 'framer-motion';

const DESKTOP_EASE = [0.22, 1, 0.36, 1] as const;
const DESKTOP_UI_EASE = [0.32, 0, 0.2, 1] as const;

export const desktopSceneMotionConfig = {
  animate: {scale: 1},
  transition: {duration: 0},
  initial: false,
} as const;

export const desktopContentItemInitialState = {opacity: 0, scale: 0} as const;

export const getDesktopContentItemTransition = (disableAnimation: boolean): Transition =>
  disableAnimation ? {duration: 0} : {duration: 0.46, ease: DESKTOP_EASE};

export const getDesktopContentItemMotion = (hideContentItems: boolean, isScaledDown: boolean) => ({
  opacity: hideContentItems || isScaledDown ? 0 : 1,
  scale: hideContentItems || isScaledDown ? 0 : 1,
});

export const getDesktopMenuBarMotion = (hideContentItems: boolean, isScaledDown: boolean) => ({
  opacity: hideContentItems || isScaledDown ? 0 : 1,
  y: isScaledDown ? -24 : 0,
});

export const getDesktopMenuBarTransition = (disableAnimation: boolean): Transition =>
  disableAnimation ? {duration: 0} : {duration: 0.32, ease: DESKTOP_UI_EASE};

export const getDesktopDockMotion = (hideContentItems: boolean, isScaledDown: boolean) => ({
  opacity: hideContentItems || isScaledDown ? 0 : 1,
  y: hideContentItems || isScaledDown ? 72 : 0,
});

export const getDesktopDockTransition = (disableAnimation: boolean): Transition =>
  disableAnimation ? {duration: 0} : {duration: 0.34, ease: DESKTOP_UI_EASE};
