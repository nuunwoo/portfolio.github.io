import {useEffect, useState} from 'react';
import {timeKeeper} from '../utils/timeKeeper';

type UseCurrentDateTimeOptions = {
  align?: 'second' | 'minute';
};

export const useCurrentDateTime = ({align = 'second'}: UseCurrentDateTimeOptions = {}) => {
  const [currentDateTime, setCurrentDateTime] = useState(() => timeKeeper.zonedNow());

  useEffect(() => {
    const syncCurrentDateTime = () => {
      setCurrentDateTime(timeKeeper.zonedNow());
    };

    syncCurrentDateTime();

    if (align === 'minute') {
      timeKeeper.on('minute', syncCurrentDateTime);
      timeKeeper.on('timezoneChange', syncCurrentDateTime);
      return () => {
        timeKeeper.off('minute', syncCurrentDateTime);
        timeKeeper.off('timezoneChange', syncCurrentDateTime);
      };
    }

    timeKeeper.on('second', syncCurrentDateTime);
    timeKeeper.on('timezoneChange', syncCurrentDateTime);
    return () => {
      timeKeeper.off('second', syncCurrentDateTime);
      timeKeeper.off('timezoneChange', syncCurrentDateTime);
    };
  }, [align]);

  return currentDateTime;
};
