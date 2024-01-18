import { NextRequest, NextResponse } from 'next/server';
import withLocale from '@/lib/middleware/withLocale';
import withAuth from '@/lib/middleware/withAuth';
import withError from '@/lib/middleware/withError';
import { JwtPayload } from 'jsonwebtoken';

async function handler(
  req: NextRequest,
  context: { params: Record<string, string> },
  t: Record<string, string>,
  user?: JwtPayload
): Promise<NextResponse> {
  return NextResponse.json(
    {},
    {
      status: 200,
    }
  );
}

export const GET = withLocale(withAuth(withError(handler)));
