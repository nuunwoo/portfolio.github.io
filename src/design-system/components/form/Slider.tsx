import type { InputHTMLAttributes } from 'react';
import styles from './Slider.module.css';
const Slider = (props: InputHTMLAttributes<HTMLInputElement>) => <input type='range' {...props} className={`${styles.root} ${props.className ?? ''}`.trim()} />;
export default Slider;
