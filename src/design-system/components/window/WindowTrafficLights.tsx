import styles from "./WindowTrafficLights.module.css";
import { WindowCloseIcon, WindowMinimizeIcon, WindowZoomIcon } from "../../icons";

type WindowTrafficLightsProps = {
  className?: string;
};

const WindowTrafficLights = ({ className }: WindowTrafficLightsProps) => {
  return (
    <div className={`${styles.root} ${className ?? ""}`.trim()} aria-hidden={true}>
      <WindowCloseIcon className={styles.light} />
      <WindowMinimizeIcon className={styles.light} />
      <WindowZoomIcon className={styles.light} />
    </div>
  );
};

export default WindowTrafficLights;
