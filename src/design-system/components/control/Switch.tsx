import { motion } from "framer-motion";
import styles from './Switch.module.css';

type SwitchProps = { checked: boolean; onChange?: (next: boolean) => void; };
const Switch = ({ checked, onChange }: SwitchProps) => (
  <button type="button" role="switch" aria-checked={checked} className={`${styles.root} ${checked ? styles.checked : ''}`.trim()} onClick={() => onChange?.(!checked)}>
    <motion.span
      className={styles.thumb}
      animate={{ x: checked ? 14 : 0 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
    />
  </button>
);
export default Switch;
