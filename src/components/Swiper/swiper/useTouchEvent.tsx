import { useEffect } from 'react';

interface Props {
    click?: boolean;
    size: {
        w: number;
        h: number;
    };
    container: HTMLDivElement | null;
    inner: HTMLDivElement | null;
    length: number;
    setIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default ({ click, size, container, inner, length, setIndex }: Props) => {
    let xDown: number | null = null;
    let yDown: number | null = null;
    let idx = 1;
    let translate = -size.w * idx;
    let pressTime: number | null;
    let shortIdx = 1;

    const inPlaceImage = (changeIdx: number) => {
        setIndex(changeIdx);
        idx = changeIdx;
    };

    const changIndex = (long: boolean, index: number) => {
        if (long) idx = index;
        else shortIdx = index;
    };

    const touchstart = (event: TouchEvent) => {
        if (!container || !inner || click) return;

        if (event.targetTouches.length > 1) {
            xDown = null;
            yDown = null;
            return;
        }
        if (0 < idx && idx < length && length > 1) {
            const touches = event.changedTouches;
            if (event.targetTouches.length === 1) {
                xDown = touches[0].clientX;
                yDown = touches[0].clientY;

                pressTime = new Date().getTime();

                if (idx === length - 1) idx = 1;
                if (idx === 0) idx = length - 2;
                shortIdx = idx;
                translate = -size.w * idx;

                inner.style.transition = `all 0s`;

                // inner.style.transform = '';
                inner.style.left = `${translate}px`;

                document.addEventListener('touchmove', touchmove, { passive: false });
                document.addEventListener('touchend', touchend, { passive: false });
            }
        }
    };

    const touchmove = (event: TouchEvent) => {
        if (!container || !inner) return;

        if (!xDown || !yDown || length < 4) {
            return;
        }

        const { floor, abs } = Math;

        const xUp = event.touches[0].clientX;
        const yUp = event.touches[0].clientY;
        const xDiff = xDown - xUp;
        const yDiff = yDown - yUp;

        const moveTranslate = translate - xDiff;

        inner.style.left = `${moveTranslate}px`;

        const moveRatio = abs(moveTranslate / (size.w + 10));
        const movePercent = abs(floor((moveRatio - idx) * 10));

        const long = movePercent === 5;

        if (abs(xDiff) > abs(yDiff)) {
            if (xDiff > 0) {
                changIndex(long, floor(moveRatio) + 1);
            } else {
                changIndex(long, floor(moveRatio));
            }
        }
    };

    const touchend = (event: TouchEvent) => {
        if (event.cancelable) event.preventDefault();

        if (!container || !inner || !pressTime) return;
        const upTime = new Date().getTime();
        const pressCurrent = upTime - pressTime;

        if (pressCurrent < 200) idx = shortIdx;

        translate = -size.w * idx;

        if (idx === 0) inPlaceImage(length - 2);
        else if (idx >= length - 1) inPlaceImage(1);
        else inPlaceImage(idx);

        inner.style.left = `${translate}px`;
        inner.style.transition = `all 0.5s cubic-bezier(0.5, 1, 0.89, 1)`;

        document.removeEventListener('touchmove', touchmove);
        document.removeEventListener('touchend', touchend);
        pressTime = null;
    };

    useEffect(() => {
        if (container && inner && length > 0) {
            inner.style.left = `${translate}px`;
            container.addEventListener('touchstart', touchstart, { passive: false });
        }
    }, [container, inner, length]);
};
