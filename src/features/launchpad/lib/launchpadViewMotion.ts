import type {Transition, Variants} from 'framer-motion';

const LAUNCHPAD_OPEN_EASE = [0.22, 1, 0.36, 1] as const;
const LAUNCHPAD_CLOSE_EASE = [0.4, 0, 1, 1] as const;

export const CLOSE_ANIMATION_MS = 320;
export const SLIDE_DURATION_MS = 380;

export const launchpadOverlayVariants: Variants = {
  hidden: {
    opacity: 0.001,
    transition: {duration: 0},
  },
  open: {
    opacity: 1,
    transition: {duration: 0.34, ease: LAUNCHPAD_OPEN_EASE},
  },
  closing: {
    opacity: 0,
    transition: {duration: 0.32, ease: LAUNCHPAD_CLOSE_EASE},
  },
};

export const launchpadViewVariants: Variants = {
  hidden: {
    opacity: 0.001,
    scale: 1.02,
    y: 10,
    transition: {duration: 0},
  },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {duration: 0.34, ease: LAUNCHPAD_OPEN_EASE},
  },
  closing: {
    opacity: 0,
    scale: 1.04,
    y: 6,
    transition: {duration: 0.26, ease: LAUNCHPAD_CLOSE_EASE},
  },
};

export const getLaunchpadGridTrackTransition = (isDragging: boolean): Transition =>
  isDragging ? {duration: 0} : {duration: 0.38, ease: LAUNCHPAD_OPEN_EASE};

export const getLaunchpadSearchGroupTransition = (
  disableAnimation: boolean,
  showFocusedVisual: boolean,
  animateOnFocus: boolean,
): Transition =>
  !disableAnimation && showFocusedVisual && animateOnFocus ? {duration: 0.62, ease: LAUNCHPAD_OPEN_EASE} : {duration: 0};
