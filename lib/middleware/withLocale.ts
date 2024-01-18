import { NextRequest, NextResponse } from 'next/server';
import { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getDictionary, Locale } from '@/lib/utils/get-dictionary';

export default function withLocale(
  handler: (
    req: NextRequest,
    context: { params: Record<string, string> },
    t: Record<string, string>,
    user?: JwtPayload
  ) => Promise<NextResponse>
) {
  return async (
    req: NextRequest,
    context: { params: Record<string, string> },
    t: Record<string, string>,
    user?: JwtPayload
  ) => {
    const localeObj = cookies().get('locale');
    const locale = (localeObj?.value || 'en-us') as Locale;
    const dictionary = await getDictionary(locale);
    return await handler(req, context, dictionary['server'], user);
  };
}
