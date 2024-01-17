import { NextRequest, NextResponse } from 'next/server';
import withLocale from '@/lib/middleware/withLocale';
import withAuth from '@/lib/middleware/withAuth';
import { JwtPayload } from 'jsonwebtoken';
import MessageModal from '@/app/api/modal/messageModal';

async function handler(
  req: NextRequest,
  context: { params: Record<string, string> },
  t: Record<string, string>,
  user?: JwtPayload
): Promise<NextResponse> {
  const { roomId } = await req.json();

  await MessageModal.deleteRoomMessage(roomId);

  return NextResponse.json(
    {
      success: true,
    },
    {
      status: 200,
    }
  );
}

export const DELETE = withLocale(handler);
