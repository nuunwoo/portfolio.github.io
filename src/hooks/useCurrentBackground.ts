import {useMemo} from 'react';
import {getWallpaperSrcForDate} from '../app/assetsManifest';
import {useCurrentDateTime} from './useCurrentDateTime';

export const useCurrentBackground = () => {
  const currentDate = useCurrentDateTime({align: 'minute'});

  return useMemo(() => getWallpaperSrcForDate(currentDate), [currentDate]);
};
