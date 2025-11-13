import type {Transition} from 'framer-motion';

const DOCK_EASE = [0.32, 0, 0.2, 1] as const;

export const getDockMotion = (hideItems: boolean) => ({
  opacity: hideItems ? 0 : 1,
  y: hideItems ? 72 : 0,
});

export const getDockTransition = (disableAnimation: boolean): Transition =>
  disableAnimation ? {duration: 0} : {duration: 0.34, ease: DOCK_EASE};
