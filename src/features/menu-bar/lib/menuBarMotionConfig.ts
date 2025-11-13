import type {Transition} from 'framer-motion';

const MENU_BAR_EASE = [0.32, 0, 0.2, 1] as const;

export const getMenuBarMotion = (hideItems: boolean) => ({
  opacity: hideItems ? 0 : 1,
  y: hideItems ? -24 : 0,
});

export const getMenuBarTransition = (disableAnimation: boolean): Transition =>
  disableAnimation ? {duration: 0} : {duration: 0.32, ease: MENU_BAR_EASE};
