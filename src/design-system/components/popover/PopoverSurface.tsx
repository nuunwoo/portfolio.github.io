import type { ReactNode } from "react";
import styles from "./PopoverSurface.module.css";
const PopoverSurface = ({ children }: { children: ReactNode }) => <div className={styles.root}>{children}</div>;
export default PopoverSurface;
