import {motion} from 'framer-motion';
import type {PropsWithChildren} from 'react';
import {getMenuBarMotion, getMenuBarTransition} from '../../lib/menuBarMotionConfig';
import styles from './MenuBarMotion.module.css';

type MenuBarMotionProps = PropsWithChildren<{
  disableAnimation?: boolean;
  hideItems?: boolean;
}>;

const MenuBarMotion = ({
  children,
  disableAnimation = false,
  hideItems = false,
}: MenuBarMotionProps) => (
  <motion.div
    className={styles.root}
    animate={getMenuBarMotion(hideItems)}
    transition={getMenuBarTransition(disableAnimation)}
    initial={false}>
    {children}
  </motion.div>
);

export default MenuBarMotion;
