import type { ReactNode } from "react";
import styles from "./SplitView.module.css";

type SplitViewProps = { left: ReactNode; right: ReactNode; leftWidth?: number };
const SplitView = ({ left, right, leftWidth = 240 }: SplitViewProps) => (
  <section className={styles.root} style={{ ["--left-width" as string]: `${leftWidth}px` }}>
    <div className={styles.left}>{left}</div>
    <div className={styles.right}>{right}</div>
  </section>
);
export default SplitView;
