import {useMemo} from 'react';
import {getBackgroundSrcForDate, type ScreenBackgroundTarget} from '../app/assetsManifest';
import {useCurrentDateTime} from './useCurrentDateTime';

export const useCurrentBackground = (target: ScreenBackgroundTarget = 'desktop') => {
  const currentDate = useCurrentDateTime({align: 'minute'});

  return useMemo(() => getBackgroundSrcForDate(currentDate, target), [currentDate, target]);
};
