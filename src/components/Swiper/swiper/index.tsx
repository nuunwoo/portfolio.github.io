import styles from './index.module.css';
import { useRef, useState } from 'react';
import useTouchEvent from './useTouchEvent';
import { useGettingRef } from '../../../shared/hooks/useGettingRef';

interface Props {
    size: {
        w: number;
        h: number;
    };
    length: number;
    countPosition: string;
    children?: React.ReactNode;
}

export default ({ size, length, countPosition, children }: Props) => {
    const innerRef = useRef<HTMLDivElement | null>(null);
    const [index, setIndex] = useState(1);
    const { elementRef: containerRef, setElementRef: setContainerRef } = useGettingRef<HTMLDivElement>();

    const page = Array.from({ length: length - 2 }, (_v, i) => i);

    const option = { container: containerRef, inner: innerRef.current, size, length, setIndex };
    useTouchEvent({ ...option });

    return (
        <div ref={setContainerRef} className={styles.swiper} style={{ width: `${size.w}px`, height: `${size.h}px` }}>
            <div className={styles.count} style={countPosition === 'top' ? { top: '10px' } : { bottom: '10px' }}>
                <span>{index === 0 ? length : index === length + 1 ? 1 : index}</span>
                <span>/</span>
                <span>{length > 0 ? length - 2 : 1}</span>
            </div>
            <div ref={innerRef} className={styles.inner}>
                {children}
            </div>
            <div className={styles.page}>
                {page.map(el => (
                    <div key={`imageSwiperPage${el}`} className={index === el + 1 ? styles.active : ''} />
                ))}
            </div>
        </div>
    );
};
