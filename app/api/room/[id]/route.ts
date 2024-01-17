import { NextRequest, NextResponse } from 'next/server';
import withLocale from '@/lib/middleware/withLocale';
import { JwtPayload } from 'jsonwebtoken';
import RoomModal from '@/app/api/modal/roomModal';
import bcrypt from 'bcrypt';
import { Room } from '@prisma/client';
import { omit } from 'lodash';

/**
 * 获取房间信息
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
  const searchParams = req.nextUrl.searchParams;
  const password = searchParams.get('password');

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
  let isPasswordCorrect = false;
  if (room.password && password) {
    try {
      isPasswordCorrect =
        password === room.password ||
        (await bcrypt.compare(password as string, room.password));
    } catch (err) {
      console.log(err);
    }
  }
  const data = {
    ...room,
    isPasswordCorrect,
  };
  return NextResponse.json(
    {
      success: true,
      data,
    },
    {
      status: 200,
    }
  );
}

/**
 * 修改房间信息
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
  const { password, ...rest } = req.json() as Partial<Room>;
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

  const updatedRoom = await RoomModal.updateRoom(id, {
    password: password && (await bcrypt.hash(password, 10)),
    // 这个方法不允许修改ai权限
    ...omit(rest, ['ai', 'aiEnabled']),
  });
  return NextResponse.json(
    {
      success: true,
      data: updatedRoom,
    },
    {
      status: 200,
    }
  );
}

export const GET = withLocale(getHandler);
export const PUT = withLocale(putHandler);
