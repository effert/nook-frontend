'use client';
import React, { useState, useEffect, useMemo } from 'react';
import type { Locale } from '@/lib/utils/get-dictionary';
import Iconfont from '@/components/iconfont';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface LayoutProps {
  children: React.ReactNode;
  lang: Locale;
}

const Layout = ({ children, lang }: LayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();

  let localStorage: any = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage;
    }
    return {};
  }, []);

  const [theme, setTheme] = useState<'light' | 'dark'>();

  useEffect(() => {
    const initTheme = localStorage.theme;
    setTheme(initTheme || 'light');
  }, [localStorage.theme]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [localStorage, theme]);

  const handleChangeTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.theme = newTheme;
  };

  const handleChangeLang = () => {
    const newLang = lang === 'zh-cn' ? 'en' : 'zh-cn';
    Cookies.set('locale', newLang);
    const newPathname = pathname.replace(lang, newLang);
    router.push(newPathname);
  };

  return (
    <div className="layout">
      <div className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent">
        <div className="max-w-8xl mx-auto">
          <div className="flex justify-between items-center py-4 border-b border-slate-900/10 lg:px-8 lg:border-0 dark:border-slate-300/10 mx-4 lg:mx-0">
            <div className="text-2xl font-semibold">NOOK</div>
            <div className="flex items-center gap-4">
              <Iconfont
                onClick={handleChangeTheme}
                className="text-2xl cursor-pointer"
                type={`${
                  theme === 'dark' ? 'icon-nookdark' : 'icon-nooklight'
                }`}
              />
              <Iconfont
                onClick={handleChangeLang}
                className={`text-2xl cursor-pointer ${
                  lang === 'en' ? 'text-blue-400' : ''
                }`}
                type="icon-nooklanguage"
              />
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Layout;
