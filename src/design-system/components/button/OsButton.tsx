import type { ButtonHTMLAttributes } from "react";
import styles from "./OsButton.module.css";

type OsButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "default" | "primary";
};

const OsButton = ({ tone = "default", className, ...props }: OsButtonProps) => (
  <button
    {...props}
    className={`${styles.root} ${tone === "primary" ? styles.primary : ""} ${className ?? ""}`.trim()}
  />
);

export default OsButton;
