import type { ReactNode } from "react";
import styles from "./Toolbar.module.css";

type ToolbarProps = { children: ReactNode; className?: string };
const Toolbar = ({ children, className }: ToolbarProps) => (
  <div className={`${styles.root} ${className ?? ""}`.trim()}>{children}</div>
);
export const ToolbarSpacer = () => <span className={styles.spacer} />;
export default Toolbar;
