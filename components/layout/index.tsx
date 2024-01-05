import React from 'react';
import type { Locale } from '@/lib/utils/get-dictionary';
import SwitchTheme from '@/components/layout/switch-theme';
import SwitchLang from '@/components/layout/switch-lang';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
  lang: Locale;
}

const Layout = ({ children, lang }: LayoutProps) => {
  return (
    <div id="root_layout" className="layout hidden">
      <div className="sticky top-0 z-50 w-full shadow-md bg-white dark:bg-black dark:text-white">
        <div className="max-w-8xl mx-auto">
          <div className="flex justify-between items-center py-4 lg:px-8 mx-4 lg:mx-0">
            <Link href="/chat">
              <div className="text-2xl font-semibold">NOOK</div>
            </Link>
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
