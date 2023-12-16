import React from 'react';
import type { Locale } from '@/lib/utils/get-dictionary';
import SwitchTheme from '@/components/layout/switch-theme';
import SwitchLang from '@/components/layout/switch-lang';

interface LayoutProps {
  children: React.ReactNode;
  lang: Locale;
}

const Layout = ({ children, lang }: LayoutProps) => {
  return (
    <div className="layout">
      <div className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-black dark:text-white">
        <div className="max-w-8xl mx-auto">
          <div className="flex justify-between items-center py-4 border-b border-slate-900/10 lg:px-8 lg:border-0 dark:border-slate-300/10 mx-4 lg:mx-0">
            <div className="text-2xl font-semibold">NOOK</div>
            <div className="flex items-center gap-4">
              <SwitchTheme />
              <SwitchLang lang={lang} />
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Layout;
