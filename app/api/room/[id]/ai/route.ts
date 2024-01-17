import { NextRequest, NextResponse } from 'next/server';
import withLocale from '@/lib/middleware/withLocale';
import withAuth from '@/lib/middleware/withAuth';
import { JwtPayload } from 'jsonwebtoken';
import RoomModal from '@/app/api/modal/roomModal';

/**
 * 获取房间ai的权限
 * @param req
 * @param context
 * @param t
 * @param user
 * @returns
 */
async function getHandler(
  req: NextRequest,
  context: { params: Record<string, string> },
  t: Record<string, string>,
  user?: JwtPayload
): Promise<NextResponse> {
  const { id } = context.params;
  const room = await RoomModal.getRoomInfo(id);

  return NextResponse.json(
    {
      data: room?.ai,
      success: true,
    },
    {
      status: 200,
    }
  );
}

/**
 * 设置房间ai的权限
 * @param req
 * @param context
 * @param t
 * @param user
 * @returns
 */
async function putHandler(
  req: NextRequest,
  context: { params: Record<string, string> },
  t: Record<string, string>,
  user?: JwtPayload
): Promise<NextResponse> {
  const { id } = context.params;
  const { ai } = await req.json();

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
  if (!room.aiEnabled) {
    return NextResponse.json(
      {
        success: false,
        message: t['AI is not enabled'],
      },
      {
        status: 403,
      }
    );
  }
  const updatedRoom = await RoomModal.updateRoom(id, {
    ai,
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

export const GET = withLocale(getHandler);
export const PUT = withLocale(putHandler);
