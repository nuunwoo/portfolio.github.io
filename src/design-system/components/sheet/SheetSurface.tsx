import type { ReactNode } from "react";
import styles from "./SheetSurface.module.css";
const SheetSurface = ({ children }: { children: ReactNode }) => <section className={styles.root}>{children}</section>;
export default SheetSurface;
