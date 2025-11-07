import type {Transition, Variants} from 'framer-motion';

const LOCKSCREEN_EASE = [0.22, 1, 0.36, 1] as const;
const LOCKSCREEN_FADE_EASE = [0.4, 0, 0.2, 1] as const;

export const lockScreenRootVariants: Variants = {
  show: {opacity: 1},
  exit: {opacity: 0},
};

export const getLockScreenRootTransition = (disableTransition: boolean): Transition =>
  disableTransition ? {duration: 0} : {duration: 0.42, ease: LOCKSCREEN_EASE};

export const getLockScreenClockMotion = (isTransitioningOut: boolean) => ({
  opacity: isTransitioningOut ? 0 : 1,
});

export const getLockScreenClockTransition = (disableTransition: boolean): Transition =>
  disableTransition ? {duration: 0} : {duration: 0.28, ease: LOCKSCREEN_FADE_EASE};

export const getLockScreenProfileMotion = (isTransitioningOut: boolean) => ({
  opacity: isTransitioningOut ? 0 : 1,
  scale: isTransitioningOut ? 0.82 : 1,
});

export const getLockScreenProfileTransition = (disableTransition: boolean): Transition =>
  disableTransition ? {duration: 0} : {duration: 0.38, ease: LOCKSCREEN_EASE};
