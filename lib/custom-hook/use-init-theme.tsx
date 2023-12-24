'use client';
import { useEffect, useMemo } from 'react';
import useSysStore, { TTheme } from '@/lib/stores/system';

export function isDark(theme: TTheme) {
  let localStorage = {};
  if (typeof window !== 'undefined') {
    localStorage = window.localStorage;
  } else {
    return false;
  }
  return (
    theme === 'dark' ||
    ((!('theme' in localStorage) || theme === 'system') &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
}
export default function UseInitTheme() {
  let localStorage: any = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage;
    }
    return {};
  }, []);

  const { theme, setTheme, setInit } = useSysStore();

  useEffect(() => {
    const initTheme = localStorage.theme;
    setTheme(initTheme || 'light');
    setInit();
  }, [localStorage, setTheme, setInit]);

  useEffect(() => {
    if (isDark(theme)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return null;
}