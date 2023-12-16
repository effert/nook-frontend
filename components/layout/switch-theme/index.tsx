'use client';
import { useMemo } from 'react';
import useSysStore, { TTheme } from '@/lib/stores/system';
import { Dropdown, MenuProps } from 'antd';
import { THEME, THEME_MAP } from '@/lib/constant';
import Iconfont from '@/components/iconfont';

export default function SwitchTheme() {
  let localStorage: any = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage;
    }
    return {};
  }, []);

  const { theme, setTheme } = useSysStore();

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
          className="text-sm md:text-xl cursor-pointer"
          type={ele.icon}
        />
        {ele.label}
      </div>
    ),
  }));

  return (
    <Dropdown menu={{ items }}>
      <Iconfont className="text-2xl cursor-pointer" type={THEME_MAP[theme]} />
    </Dropdown>
  );
}
