import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import withLocale from '@/lib/middleware/withLocale';
import withAuth from '@/lib/middleware/withAuth';
import withError from '@/lib/middleware/withError';
import { JwtPayload } from 'jsonwebtoken';
import MessageModal from '@/app/api/modal/messageModal';

async function handler(
  req: NextRequest,
  context: { params: Record<string, string> },
  t: Record<string, string>,
  user?: JwtPayload
): Promise<NextResponse> {
  const { roomId } = await req.json();
  const allMessage = await MessageModal.getRoomMessage(roomId);
  const formattedData = JSON.stringify(allMessage);
  const filename = `room-${roomId}-messages-${Date.now()}.json`;
  const filePath = path.join(process.cwd(), 'public', filename);

  fs.writeFileSync(filePath, formattedData);

  return NextResponse.json(
    {
      data: fs.createReadStream(filePath),
      success: true,
    },
    {
      status: 200,
      headers: {
        'Content-disposition': `attachment; filename=${filename}`,
        'Content-Type': 'application/json',
      },
    }
  );
}

export const POST = withLocale(withAuth(withError(handler)));
