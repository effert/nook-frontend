import { NextRequest, NextResponse } from 'next/server';
import withLocale from '@/lib/middleware/withLocale';
import withAuth from '@/lib/middleware/withAuth';
import { JwtPayload } from 'jsonwebtoken';
import UserModal from '@/app/api/modal/userModal';
import { omit } from 'lodash';

async function getHandler(
  req: NextRequest,
  context: { params: Record<string, string> },
  t: Record<string, string>,
  user?: JwtPayload
): Promise<NextResponse> {
  const userInfo = await UserModal.getUserInfo(user?.email);
  if (!userInfo) {
    return NextResponse.json(
      {
        message: t['User not found'],
        success: false,
      },
      {
        status: 401,
      }
    );
  }

  return NextResponse.json(
    {
      data: {
        data: omit(userInfo, [
          'password',
          'tempPassword',
          'tempPasswordExpiry',
        ]),
      },
      success: false,
    },
    {
      status: 200,
    }
  );
}

export const GET = withAuth(withLocale(getHandler));
