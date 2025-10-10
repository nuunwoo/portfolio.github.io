import type { ReactNode } from "react";
import styles from "./Sidebar.module.css";

type SidebarProps = { children: ReactNode; className?: string };
const Sidebar = ({ children, className }: SidebarProps) => (
  <aside className={`${styles.root} ${className ?? ""}`.trim()}>{children}</aside>
);

export const SidebarSectionTitle = ({ children }: { children: ReactNode }) => (
  <div className={styles.sectionTitle}>{children}</div>
);

export const SidebarItem = ({ children, active = false }: { children: ReactNode; active?: boolean }) => (
  <div className={`${styles.item} ${active ? styles.itemActive : ""}`.trim()}>{children}</div>
);

export default Sidebar;
