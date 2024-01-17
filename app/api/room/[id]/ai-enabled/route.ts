import { NextRequest, NextResponse } from 'next/server';
import withLocale from '@/lib/middleware/withLocale';
import withAuth from '@/lib/middleware/withAuth';
import { JwtPayload } from 'jsonwebtoken';
import RoomModal from '@/app/api/modal/roomModal';

/**
 * 设置房间是否可以开启ai
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
  const { aiEnabled } = await req.json();

  const room = await RoomModal.getRoomInfo(id);
  if (!room) {
    return NextResponse.json(
      {
        success: false,
        message: t['Room not found'],
      },
      {
        status: 404,
      }
    );
  }
  if (user?.id != 11) {
    return NextResponse.json(
      {
        success: false,
        message: t['Access denied'],
      },
      {
        status: 403,
      }
    );
  }
  const updatedRoom = await RoomModal.updateRoom(id, {
    aiEnabled,
  });

  return NextResponse.json(
    {
      data: updatedRoom,
      success: true,
    },
    {
      status: 200,
    }
  );
}

export const PUT = withAuth(withLocale(handler));
