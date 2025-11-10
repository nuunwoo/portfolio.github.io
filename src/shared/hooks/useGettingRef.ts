import {useCallback, useState} from 'react';

type UseGettingRefOptions<T extends HTMLElement> = {
  onChange?: (node: T | null) => void;
};

export const useGettingRef = <T extends HTMLElement>({onChange}: UseGettingRefOptions<T> = {}) => {
  const [elementRef, setElement] = useState<T | null>(null);

  const setElementRef = useCallback(
    (node: T | null) => {
      setElement(node);
      onChange?.(node);
    },
    [onChange],
  );

  return {elementRef, setElementRef};
};
