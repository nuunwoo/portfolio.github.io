import type {Transition, Variants} from 'framer-motion';

export const bootScreenRootVariants: Variants = {
  show: {opacity: 1, filter: 'blur(0px)', scale: 1},
  exit: {opacity: 0, filter: 'blur(10px)', scale: 1.02},
};

export const bootScreenRootTransition: Transition = {duration: 0.26, ease: 'easeInOut'};

export const bootScreenProgressFillTransition: Transition = {duration: 0.16, ease: 'easeOut'};
