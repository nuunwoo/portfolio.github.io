import type {Transition} from 'framer-motion';

const DESKTOP_EASE = [0.22, 1, 0.36, 1] as const;
const DESKTOP_UI_EASE = [0.32, 0, 0.2, 1] as const;

export const desktopSceneMotion = {
  animate: {scale: 1},
  transition: {duration: 0},
  initial: false,
} as const;

export const desktopAnimatedItemInitial = {opacity: 0, scale: 0} as const;

export const getDesktopAnimatedItemTransition = (disableScaleTransition: boolean): Transition =>
  disableScaleTransition ? {duration: 0} : {duration: 0.46, ease: DESKTOP_EASE};

export const getDesktopAnimatedItemMotion = (hideAnimatedItems: boolean, isScaledDown: boolean) => ({
  opacity: hideAnimatedItems || isScaledDown ? 0 : 1,
  scale: hideAnimatedItems || isScaledDown ? 0 : 1,
});

export const getDesktopMenuMotion = (hideAnimatedItems: boolean, isScaledDown: boolean) => ({
  opacity: hideAnimatedItems || isScaledDown ? 0 : 1,
  y: isScaledDown ? -24 : 0,
});

export const getDesktopMenuTransition = (disableScaleTransition: boolean): Transition =>
  disableScaleTransition ? {duration: 0} : {duration: 0.32, ease: DESKTOP_UI_EASE};

export const getDesktopDockMotion = (hideAnimatedItems: boolean, isScaledDown: boolean) => ({
  opacity: hideAnimatedItems || isScaledDown ? 0 : 1,
  y: hideAnimatedItems || isScaledDown ? 72 : 0,
});

export const getDesktopDockTransition = (disableScaleTransition: boolean): Transition =>
  disableScaleTransition ? {duration: 0} : {duration: 0.34, ease: DESKTOP_UI_EASE};
