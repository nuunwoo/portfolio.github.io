import type {Transition, Variants} from 'framer-motion';

export const bootstrapRootVariants: Variants = {
  show: {opacity: 1, filter: 'blur(0px)', scale: 1},
  exit: {opacity: 0, filter: 'blur(10px)', scale: 1.02},
};

export const bootstrapRootTransition: Transition = {duration: 0.26, ease: 'easeInOut'};

export const bootstrapProgressFillTransition: Transition = {duration: 0.16, ease: 'easeOut'};
