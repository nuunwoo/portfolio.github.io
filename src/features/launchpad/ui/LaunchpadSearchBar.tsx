import type {RefObject} from 'react';
import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import Magnifyingglass from '../../../components/icons/search-actions/Magnifyingglass';
import styles from './LaunchpadSearchBar.module.css';
import Xmarkcirclefill from '../../../components/icons/window-menu/window/XmarkCircleFill';
import {getLaunchpadSearchGroupTransition} from './animations/launchpadAnimations';

type LaunchpadSearchBarProps = {
  value: string;
  isFocused: boolean;
  holdFocusedVisual?: boolean;
  disableAnimation?: boolean;
  keepFocus: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
  onChange: (nextValue: string) => void;
  onFocusChange: (focused: boolean) => void;
};

const LaunchpadSearchBar = ({value, isFocused, holdFocusedVisual = false, disableAnimation = false, keepFocus, inputRef, onChange, onFocusChange}: LaunchpadSearchBarProps) => {
  const localInputRef = useRef<HTMLInputElement | null>(null);
  const resolvedInputRef = inputRef ?? localInputRef;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const groupRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const prevFocusedRef = useRef(false);
  const [animateOnFocus, setAnimateOnFocus] = useState(false);
  const [centerLeft, setCenterLeft] = useState(0);
  const [focusedLeft, setFocusedLeft] = useState(0);
  const [centerWidth, setCenterWidth] = useState(0);
  const [focusedWidth, setFocusedWidth] = useState(0);

  useEffect(() => {
    if (!keepFocus || !isFocused) return;
    resolvedInputRef.current?.focus();
  }, [keepFocus, isFocused, resolvedInputRef]);

  useEffect(() => {
    if (disableAnimation) {
      setAnimateOnFocus(false);
      return;
    }
    if (isFocused && !prevFocusedRef.current) {
      setAnimateOnFocus(true);
    }
    if (!isFocused) {
      setAnimateOnFocus(false);
    }
    prevFocusedRef.current = isFocused;
  }, [disableAnimation, isFocused]);

  const handleBlur = () => {
    if (holdFocusedVisual) {
      return;
    }
    if (keepFocus && isFocused) {
      window.requestAnimationFrame(() => {
        resolvedInputRef.current?.focus();
      });
      return;
    }
    setAnimateOnFocus(false);
    onFocusChange(false);
  };

  const handleClear = () => {
    onChange('');
    onFocusChange(true);
    resolvedInputRef.current?.focus();
  };

  const showFocusedVisual = isFocused || holdFocusedVisual;

  useLayoutEffect(() => {
    const rootEl = rootRef.current;
    const measureEl = measureRef.current;
    if (!rootEl || !measureEl) return;

    const compute = () => {
      const rootStyle = window.getComputedStyle(rootEl);
      const paddingLeft = Number.parseFloat(rootStyle.paddingLeft || '0') || 0;
      const paddingRight = Number.parseFloat(rootStyle.paddingRight || '0') || 0;
      const gap = 8;
      const iconWidth = 13;
      const clearButtonSpace = value.length > 0 ? 18 : 0;
      const measureWidth = measureEl.offsetWidth;
      const unfocusedWidth = iconWidth + gap + measureWidth;
      const expandedWidth = rootEl.clientWidth - paddingLeft - paddingRight - clearButtonSpace;

      setFocusedLeft(paddingLeft);
      setCenterWidth(unfocusedWidth);
      setFocusedWidth(Math.max(unfocusedWidth, expandedWidth));
      setCenterLeft((rootEl.clientWidth - unfocusedWidth) / 2);
    };

    compute();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => compute());
      ro.observe(rootEl);
      ro.observe(measureEl);
    } else {
      window.addEventListener('resize', compute);
    }

    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', compute);
    };
  }, [showFocusedVisual, value]);

  return (
    <div
      className={`${styles.launchpadSearch} ${showFocusedVisual ? styles.launchpadSearchFocused : ''} ${animateOnFocus ? styles.launchpadSearchAnimate : ''}`}
      ref={rootRef}
      role="search"
      aria-label="Launchpad search"
      data-launchpad-interactive="true"
      onPointerDown={() => {
        resolvedInputRef.current?.focus();
      }}>
      <motion.div
        className={styles.launchpadSearchGroup}
        ref={groupRef}
        initial={false}
        animate={{
          left: showFocusedVisual ? focusedLeft : centerLeft,
          width: showFocusedVisual ? focusedWidth : centerWidth,
        }}
        transition={getLaunchpadSearchGroupTransition(disableAnimation, showFocusedVisual, animateOnFocus)}>
        <Magnifyingglass className={styles.launchpadSearchIcon} aria-hidden={true} />
        {!value.length && !showFocusedVisual ? <span className={styles.launchpadSearchPlaceholder}>검색</span> : null}
        <input
          ref={resolvedInputRef}
          type="text"
          value={value}
          onChange={event => onChange(event.target.value)}
          onFocus={() => {
            setAnimateOnFocus(true);
            onFocusChange(true);
          }}
          onBlur={handleBlur}
          placeholder="검색"
          className={styles.launchpadSearchInput}
          data-launchpad-interactive="true"
        />
      </motion.div>
      <span ref={measureRef} className={styles.launchpadSearchMeasure} aria-hidden={true}>
        검색
      </span>
      {value ? (
        <button
          type="button"
          aria-label="검색어 지우기"
          className={styles.launchpadSearchClear}
          onPointerDown={event => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onClick={handleClear}
          data-launchpad-interactive="true">
          <Xmarkcirclefill />
        </button>
      ) : null}
    </div>
  );
};

export default LaunchpadSearchBar;
