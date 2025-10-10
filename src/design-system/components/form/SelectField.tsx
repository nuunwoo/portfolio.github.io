import type { SelectHTMLAttributes } from 'react';
import styles from './SelectField.module.css';

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement>;
const SelectField = ({ children, className, ...rest }: SelectFieldProps) => (
  <span className={styles.wrap}>
    <select {...rest} className={`${styles.root} ${className ?? ''}`.trim()}>{children}</select>
    <span className={styles.arrow}>▾</span>
  </span>
);
export default SelectField;
