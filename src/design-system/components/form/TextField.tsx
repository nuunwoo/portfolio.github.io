import type { InputHTMLAttributes } from 'react';
import styles from './TextField.module.css';
const TextField = (props: InputHTMLAttributes<HTMLInputElement>) => <input {...props} className={`${styles.root} ${props.className ?? ''}`.trim()} />;
export default TextField;
