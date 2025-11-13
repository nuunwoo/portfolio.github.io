import type {Transition, Variants} from 'framer-motion';

const LOCK_EASE = [0.22, 1, 0.36, 1] as const;
const LOCK_FADE_EASE = [0.4, 0, 0.2, 1] as const;

export const lockRootVariants: Variants = {
  show: {opacity: 1},
  exit: {opacity: 0},
};

export const getLockRootTransition = (disableAnimation: boolean): Transition =>
  disableAnimation ? {duration: 0} : {duration: 0.42, ease: LOCK_EASE};

export const getLockClockMotion = (isExiting: boolean) => ({
  opacity: isExiting ? 0 : 1,
});

export const getLockClockTransition = (disableAnimation: boolean): Transition =>
  disableAnimation ? {duration: 0} : {duration: 0.28, ease: LOCK_FADE_EASE};

export const getLockProfileMotion = (isExiting: boolean) => ({
  opacity: isExiting ? 0 : 1,
  scale: isExiting ? 0.82 : 1,
});

export const getLockProfileTransition = (disableAnimation: boolean): Transition =>
  disableAnimation ? {duration: 0} : {duration: 0.38, ease: LOCK_EASE};
