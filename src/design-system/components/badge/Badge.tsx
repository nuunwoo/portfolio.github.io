import type { ReactNode } from "react";
import styles from "./Badge.module.css";
const Badge = ({ children }: { children: ReactNode }) => <span className={styles.root}>{children}</span>;
export default Badge;
