import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDictionary, Locale } from '@/lib/utils/get-dictionary';

export default function withLocale(
  handler: (
    req: NextRequest,
    res: NextResponse,
    t: Record<string, string>
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest, res: NextResponse) => {
    const localeObj = cookies().get('locale');
    const locale = (localeObj?.value || 'en-us') as Locale;
    const dictionary = await getDictionary(locale);
    return handler(req, res, dictionary['server']);
  };
}
