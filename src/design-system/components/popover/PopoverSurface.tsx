import type {HTMLAttributes, ReactNode} from 'react';
import styles from './PopoverSurface.module.css';
import {SheetSurface} from '../sheet';

export type PopoverPlacement =
  | 'north-left'
  | 'north-center'
  | 'north-right'
  | 'south-left'
  | 'south-center'
  | 'south-right'
  | 'west-top'
  | 'west-middle'
  | 'west-bottom'
  | 'east-top'
  | 'east-middle'
  | 'east-bottom';

type PopoverSurfaceProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  placement?: PopoverPlacement;
  showTail?: boolean;
};

const PopoverSurface = ({children, className = '', placement = 'north-center', showTail = true, ...rest}: PopoverSurfaceProps) => (
  <SheetSurface className={`${styles.root} ${styles[placement]} ${className}`.trim()} {...rest}>
    <span className={styles.backing} aria-hidden={true} />
    <span className={styles.content}>{children}</span>
    {showTail ? <span className={styles.tail} aria-hidden={true} /> : null}
  </SheetSurface>
);

export default PopoverSurface;
