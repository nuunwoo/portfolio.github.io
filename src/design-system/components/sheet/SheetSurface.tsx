import type {HTMLAttributes} from 'react';
import styles from './SheetSurface.module.css';

type SheetSurfaceProps = HTMLAttributes<HTMLDivElement> & {
  //   children?: ReactNode;
};

const SheetSurface = ({className = '', children}: SheetSurfaceProps) => <section className={`${styles.root} ${className}`.trim()}>{children}</section>;

export default SheetSurface;
