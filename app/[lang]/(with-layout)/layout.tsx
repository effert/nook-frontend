import { getDictionary } from '@/lib/utils/get-dictionary';
import type { Locale } from '@/lib/utils/get-dictionary';
import Layout from '@/components/layout';

export default async function WithLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  return <Layout lang={lang}>{children}</Layout>;
}
