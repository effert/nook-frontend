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
    try {
      console.log(111);
      await handler(req, context, t, user);
    } catch (err) {
      console.error(err);
      return NextResponse.json(
        {
          message: 111,
          success: false,
        },
        {
          status: 500,
        }
      );
    }
  };
}
