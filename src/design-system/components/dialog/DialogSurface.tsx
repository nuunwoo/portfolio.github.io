import type { ReactNode } from "react";
import styles from "./DialogSurface.module.css";

type DialogSurfaceProps = { title: string; children: ReactNode; actions?: ReactNode };
const DialogSurface = ({ title, children, actions }: DialogSurfaceProps) => (
  <section className={styles.root} role="dialog" aria-modal="true">
    <h2 className={styles.title}>{title}</h2>
    <div className={styles.body}>{children}</div>
    {actions ? <footer className={styles.footer}>{actions}</footer> : null}
  </section>
);
export default DialogSurface;
