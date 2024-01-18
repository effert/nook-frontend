import { NextRequest, NextResponse } from 'next/server';
import withLocale from '@/lib/middleware/withLocale';
import withAuth from '@/lib/middleware/withAuth';
import { JwtPayload } from 'jsonwebtoken';
import UserModal from '@/app/api/modal/userModal';

async function getHandler(
  req: NextRequest,
  context: { params: Record<string, string> },
  t: Record<string, string>,
  user?: JwtPayload
): Promise<NextResponse> {
  console.log(user);
  if (!user) {
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

  const rooms = await UserModal.getUserRooms(user.email);

  return NextResponse.json(
    {
      data: {
        rooms,
      },
      success: true,
    },
    {
      status: 200,
    }
  );
}

export const GET = withAuth(withLocale(getHandler));
