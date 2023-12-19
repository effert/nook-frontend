'use client';
import type { Locale } from '@/lib/utils/get-dictionary';
import { useEffect } from 'react';
import classnames from 'classnames';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';

export default function SwitchLang({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    Cookies.set('locale', lang);
  }, []);

  const handleChangeLang = () => {
    const newLang = lang === 'zh-cn' ? 'en' : 'zh-cn';
    Cookies.set('locale', newLang);
    const newPathname = pathname.replace(lang, newLang);
    router.push(newPathname);
  };

  return (
    <div onClick={handleChangeLang} className="cursor-pointer relative w-6 h-6">
      <span
        className={classnames(
          'absolute flex justify-center items-center rounded-sm',
          {
            'left-0 top-0 z-1 text-xs w-4 h-4 bg-black text-white dark:bg-white dark:text-black':
              lang === 'en',
            'right-0 bottom-0 z-0 text-xs w-4 h-4 scale-75 border border-black dark:border-white dark:text-white':
              lang === 'zh-cn',
          }
        )}
      >
        En
      </span>
      <span
        className={classnames(
          'absolute flex justify-center items-center rounded-sm',
          {
            'left-0 top-0 z-1 text-xs w-4 h-4 bg-black text-white dark:bg-white dark:text-black':
              lang === 'zh-cn',
            'right-0 bottom-0 z-0 text-xs w-4 h-4 scale-75 border border-black dark:border-white dark:text-white':
              lang === 'en',
          }
        )}
      >
        中
      </span>
    </div>
  );
}
