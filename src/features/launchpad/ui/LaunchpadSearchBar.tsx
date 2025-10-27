import type {RefObject} from 'react';
import {useEffect, useRef} from 'react';
import Magnifyingglass from '../../../components/icons/search-actions/Magnifyingglass';
import styles from './Launchpad.module.css';

type LaunchpadSearchBarProps = {
  value: string;
  isFocused: boolean;
  holdFocusedVisual?: boolean;
  keepFocus: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
  onChange: (nextValue: string) => void;
  onFocusChange: (focused: boolean) => void;
};

const LaunchpadSearchBar = ({value, isFocused, holdFocusedVisual = false, keepFocus, inputRef, onChange, onFocusChange}: LaunchpadSearchBarProps) => {
  const localInputRef = useRef<HTMLInputElement | null>(null);
  const resolvedInputRef = inputRef ?? localInputRef;

  useEffect(() => {
    if (!keepFocus || !isFocused) return;
    resolvedInputRef.current?.focus();
  }, [keepFocus, isFocused, resolvedInputRef]);

  useEffect(() => {
    if (!isFocused) {
      return;
    }
  }, [isFocused]);

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
    onFocusChange(false);
  };

  const handleClear = () => {
    onChange('');
    onFocusChange(true);
    resolvedInputRef.current?.focus();
  };

  const showFocusedVisual = isFocused || holdFocusedVisual;

  return (
    <div
      className={`${styles.launchpadSearch} ${showFocusedVisual ? styles.launchpadSearchFocused : ''}`}
      role="search"
      aria-label="Launchpad search"
      data-launchpad-interactive="true"
      onPointerDown={() => {
        resolvedInputRef.current?.focus();
      }}>
      <Magnifyingglass className={styles.launchpadSearchIcon} aria-hidden={true} />
      <input
        ref={resolvedInputRef}
        type="text"
        value={value}
        onChange={event => onChange(event.target.value)}
        onFocus={() => onFocusChange(true)}
        onBlur={handleBlur}
        placeholder="검색"
        className={styles.launchpadSearchInput}
        data-launchpad-interactive="true"
      />
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
          ×
        </button>
      ) : null}
    </div>
  );
};

export default LaunchpadSearchBar;
