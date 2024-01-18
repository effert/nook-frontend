import { NextRequest, NextResponse } from 'next/server';
import withLocale from '@/lib/middleware/withLocale';
import { JwtPayload } from 'jsonwebtoken';
import { generateRandomString } from '@/lib/utils';
import RoomModal from '@/app/api/modal/roomModal';

/**
 * 生成一个随机的房间 id，如果已经存在就重新生成，直到生成一个不存在的房间 id，然后创建房间
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
  let id = generateRandomString(3);
  let roomInfo = await RoomModal.getRoomInfo(id);
  while (roomInfo) {
    id = generateRandomString(4);
    roomInfo = await RoomModal.getRoomInfo(id);
  }
  const room = await RoomModal.createRoom(id);

  return NextResponse.json(
    {
      data: {
        data: room,
      },
      success: true,
    },
    {
      status: 200,
    }
  );
}

export const POST = withLocale(handler);
