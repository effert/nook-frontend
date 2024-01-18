import { NextRequest, NextResponse } from 'next/server';
import withLocale from '@/lib/middleware/withLocale';
import withError from '@/lib/middleware/withError';
import { JwtPayload } from 'jsonwebtoken';
import RoomModal from '@/app/api/modal/roomModal';

/**
 * 获取房间内所有成员
 * @param req
 * @param context
 * @param t
 * @param user
 * @returns
 */
async function handler(
  req: NextRequest,
  context: { params: Record<string, string> },
  t: Record<string, string>,
  user?: JwtPayload
): Promise<NextResponse> {
  const { id } = context.params;
  const members = await RoomModal.getRoomMembers(id);

  return NextResponse.json(
    {
      data: {
        data: members?.map((member) => ({
          id: member.id,
          email: member.email,
          name: member.name,
          avatar: member.avatar,
        })),
      },
      success: true,
    },
    {
      status: 200,
    }
  );
}

export const GET = withLocale(withError(handler));
