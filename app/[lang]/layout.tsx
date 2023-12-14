import { Inter } from 'next/font/google';
import type { Locale } from '@/lib/utils/get-dictionary';
import Provider from '@/components/provider';

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
        <body className={inter.className}>{children}</body>
      </Provider>
    </html>
  );
}
