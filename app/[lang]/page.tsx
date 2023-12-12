import { getDictionary } from '@/lib/utils/get-dictionary';
import type { Locale } from '@/lib/utils/get-dictionary';

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const D = await getDictionary(lang);
  return <div>{D['index'].welcome}</div>;
}
