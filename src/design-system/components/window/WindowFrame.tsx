import type { ReactNode } from "react";
import SearchField from "../search/SearchField";
import WindowTrafficLights from "./WindowTrafficLights";
import styles from "./WindowFrame.module.css";

type WindowFrameProps = {
  title: string;
  children: ReactNode;
};

const WindowFrame = ({ title, children }: WindowFrameProps) => {
  return (
    <section className={styles.root}>
      <header className={styles.titleBar}>
        <WindowTrafficLights />
        <div className={styles.title}>{title}</div>
        <div className={styles.tools}>
          <SearchField placeholder="파일, 폴더, 앱 검색" />
        </div>
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  );
};

export default WindowFrame;
