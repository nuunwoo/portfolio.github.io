import {useEffect, useState} from 'react';

export type SystemAppearance = 'light' | 'dark';
export type SystemAppearancePreference = SystemAppearance | 'system';

const SYSTEM_APPEARANCE_PREFERENCE_KEY = 'system-appearance-preference-v1';
const SYSTEM_APPEARANCE_PREFERENCE_EVENT = 'systemappearancepreferencechange';

const getSystemAppearance = (): SystemAppearance => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const isSystemAppearancePreference = (value: string | null): value is SystemAppearancePreference =>
  value === 'system' || value === 'light' || value === 'dark';

export const getSystemAppearancePreference = (): SystemAppearancePreference => {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return 'system';
  }

  const value = window.localStorage.getItem(SYSTEM_APPEARANCE_PREFERENCE_KEY);
  return isSystemAppearancePreference(value) ? value : 'system';
};

export const setSystemAppearancePreference = (preference: SystemAppearancePreference) => {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return;
  }

  window.localStorage.setItem(SYSTEM_APPEARANCE_PREFERENCE_KEY, preference);
  window.dispatchEvent(new CustomEvent<SystemAppearancePreference>(SYSTEM_APPEARANCE_PREFERENCE_EVENT, {detail: preference}));
};

const resolveAppearance = (preference: SystemAppearancePreference): SystemAppearance =>
  preference === 'system' ? getSystemAppearance() : preference;

export const useSystemAppearance = () => {
  const [preference, setPreference] = useState<SystemAppearancePreference>(() => getSystemAppearancePreference());
  const [appearance, setAppearance] = useState<SystemAppearance>(() => resolveAppearance(getSystemAppearancePreference()));

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const syncAppearance = () => {
      setAppearance(resolveAppearance(preference));
    };

    syncAppearance();
    mediaQuery.addEventListener('change', syncAppearance);

    return () => {
      mediaQuery.removeEventListener('change', syncAppearance);
    };
  }, [preference]);

  useEffect(() => {
    const syncPreference = () => {
      const nextPreference = getSystemAppearancePreference();
      setPreference(nextPreference);
      setAppearance(resolveAppearance(nextPreference));
    };

    const handlePreferenceEvent = () => {
      syncPreference();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== SYSTEM_APPEARANCE_PREFERENCE_KEY) return;
      syncPreference();
    };

    window.addEventListener(SYSTEM_APPEARANCE_PREFERENCE_EVENT, handlePreferenceEvent);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(SYSTEM_APPEARANCE_PREFERENCE_EVENT, handlePreferenceEvent);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return appearance;
};
