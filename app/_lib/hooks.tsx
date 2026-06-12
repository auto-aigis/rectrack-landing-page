"use client";

import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/app/_components/AuthProvider';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    if (item) setStoredValue(JSON.parse(item));
    setMounted(true);
  }, [key]);

  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    },
    [key]
  );

  return [mounted ? storedValue : initialValue, setValue];
};
