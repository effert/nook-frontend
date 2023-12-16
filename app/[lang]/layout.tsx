import { Inter } from 'next/font/google';
import type { Locale } from '@/lib/utils/get-dictionary';
import Provider from '@/components/provider';
import UseInitTheme from '@/lib/customHook/useInitTheme';

const inter = Inter({ subsets: ['latin'] });

export default function Layout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  return (
    <html lang={lang}>
      <Provider lang={lang}>
        <body
          className={`${inter.className} bg-gray-100 dark:bg-gray-800/90 dark:text-white`}
        >
          <UseInitTheme />
          {children}
        </body>
      </Provider>
    </html>
  );
}
