import { useEffect, useMemo } from 'react';
import useSysStore, { TTheme } from '@/lib/stores/system';
import { Dropdown, MenuProps } from 'antd';
import { THEME, THEME_MAP } from '@/lib/constant';
import Iconfont from '@/components/iconfont';

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
export default function SwitchTheme() {
  let localStorage: any = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage;
    }
    return {};
  }, []);

  const { theme, setTheme } = useSysStore();

  useEffect(() => {
    const initTheme = localStorage.theme;
    setTheme(initTheme || 'light');
  }, [localStorage, setTheme]);

  useEffect(() => {
    if (isDark(theme)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleChangeTheme = (newTheme: TTheme) => {
    localStorage.theme = newTheme;
    setTheme(newTheme);
  };

  const items: MenuProps['items'] = THEME.map((ele) => ({
    key: ele.value,
    label: (
      <div
        onClick={() => handleChangeTheme(ele.value)}
        className="flex items-center gap-1"
      >
        <Iconfont
          className="text-2xl cursor-pointer text-white"
          type={ele.icon}
        />
        {ele.label}
      </div>
    ),
  }));

  return (
    <Dropdown menu={{ items }}>
      <Iconfont
        className="text-2xl cursor-pointer dark:text-white"
        type={THEME_MAP[theme]}
      />
    </Dropdown>
  );
}
