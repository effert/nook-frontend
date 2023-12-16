'use client';
import React from 'react';
import type { Locale } from '@/lib/utils/get-dictionary';
import Iconfont from '@/components/iconfont';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import SwitchTheme from '@/components/layout/switch-theme';

interface LayoutProps {
  children: React.ReactNode;
  lang: Locale;
}

const Layout = ({ children, lang }: LayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleChangeLang = () => {
    const newLang = lang === 'zh-cn' ? 'en' : 'zh-cn';
    Cookies.set('locale', newLang);
    const newPathname = pathname.replace(lang, newLang);
    router.push(newPathname);
  };

  return (
    <div className="layout">
      <div className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-black dark:text-white">
        <div className="max-w-8xl mx-auto">
          <div className="flex justify-between items-center py-4 border-b border-slate-900/10 lg:px-8 lg:border-0 dark:border-slate-300/10 mx-4 lg:mx-0">
            <div className="text-2xl font-semibold">NOOK</div>
            <div className="flex items-center gap-4">
              <SwitchTheme />
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
      <div className="bg-gray-100 dark:bg-gray-800/90 dark:text-white">
        {children}
      </div>
    </div>
  );
};

export default Layout;
