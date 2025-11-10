import {useCallback, useEffect, useRef} from 'react';
import type {MouseEvent as ReactMouseEvent} from 'react';

export type MouseDragSession<TMeta> = {
  meta: TMeta;
  rect: DOMRect;
  shiftX: number;
  shiftY: number;
  startClientX: number;
  startClientY: number;
};

export type MouseDragMovePayload<TMeta> = MouseDragSession<TMeta> & {
  clientX: number;
  clientY: number;
  left: number;
  top: number;
  deltaX: number;
  deltaY: number;
};

type UseMouseDragOptions<TMeta> = {
  onStart?: (session: MouseDragSession<TMeta>) => void;
  onMove?: (payload: MouseDragMovePayload<TMeta>) => void;
  onEnd?: (payload: MouseDragMovePayload<TMeta> | MouseDragSession<TMeta>) => void;
};

export const getElementBelowPoint = (clientX: number, clientY: number, hiddenElement?: HTMLElement | null) => {
  if (hiddenElement) hiddenElement.hidden = true;
  const element = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
  if (hiddenElement) hiddenElement.hidden = false;
  return element;
};

export const useMouseDrag = <TMeta>({onStart, onMove, onEnd}: UseMouseDragOptions<TMeta>) => {
  const sessionRef = useRef<MouseDragSession<TMeta> | null>(null);
  const onStartRef = useRef(onStart);
  const onMoveRef = useRef(onMove);
  const onEndRef = useRef(onEnd);

  useEffect(() => {
    onStartRef.current = onStart;
    onMoveRef.current = onMove;
    onEndRef.current = onEnd;
  }, [onEnd, onMove, onStart]);

  const handleWindowMouseMove = useCallback((event: MouseEvent) => {
    const session = sessionRef.current;
    if (!session || !onMoveRef.current) return;

    onMoveRef.current({
      ...session,
      clientX: event.clientX,
      clientY: event.clientY,
      left: event.clientX - session.shiftX,
      top: event.clientY - session.shiftY,
      deltaX: event.clientX - session.startClientX,
      deltaY: event.clientY - session.startClientY,
    });
  }, []);

  const stopDrag = useCallback(() => {
    sessionRef.current = null;
    window.removeEventListener('mousemove', handleWindowMouseMove);
    window.removeEventListener('mouseup', handleWindowMouseUpRef.current);
  }, [handleWindowMouseMove]);

  const handleWindowMouseUpRef = useRef<(event: MouseEvent) => void>(() => {});

  useEffect(() => {
    handleWindowMouseUpRef.current = (event: MouseEvent) => {
      const session = sessionRef.current;
      if (!session) return;

      onEndRef.current?.({
        ...session,
        clientX: event.clientX,
        clientY: event.clientY,
        left: event.clientX - session.shiftX,
        top: event.clientY - session.shiftY,
        deltaX: event.clientX - session.startClientX,
        deltaY: event.clientY - session.startClientY,
      });

      stopDrag();
    };
  }, [stopDrag]);

  const startDrag = useCallback(
    (event: ReactMouseEvent<HTMLElement>, meta: TMeta) => {
      if (event.button !== 0) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const session: MouseDragSession<TMeta> = {
        meta,
        rect,
        shiftX: event.clientX - rect.left,
        shiftY: event.clientY - rect.top,
        startClientX: event.clientX,
        startClientY: event.clientY,
      };

      sessionRef.current = session;
      onStartRef.current?.(session);
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUpRef.current);
      event.preventDefault();
      event.stopPropagation();
    },
    [handleWindowMouseMove],
  );

  useEffect(() => stopDrag, [stopDrag]);

  return {
    startDrag,
    stopDrag,
    getSession: () => sessionRef.current,
    isDragging: () => sessionRef.current !== null,
  };
};
