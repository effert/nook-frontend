import { NextRequest, NextResponse } from 'next/server';
import withLocale from '@/lib/middleware/withLocale';
import withAuth from '@/lib/middleware/withAuth';
import withError from '@/lib/middleware/withError';
import { JwtPayload } from 'jsonwebtoken';
import fs from 'fs';
import MessageModal from '@/app/api/modal/messageModal';

async function handler(
  req: NextRequest,
  context: { params: Record<string, string> },
  t: Record<string, string>,
  user?: JwtPayload
): Promise<NextResponse> {
  const searchParams = req.nextUrl.searchParams;
  const roomId = searchParams.get('roomId');
  const data = await req.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json(
      {
        message: t['Please provide a file'],
        success: false,
      },
      {
        status: 400,
      }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const jsonString = buffer.toString('utf8');
  const messages = JSON.parse(jsonString);

  for (const message of messages) {
    message.roomId = roomId;
  }

  await MessageModal.importRoomMessage(messages);

  return NextResponse.json(
    {
      messages: t['Import successful'],
      success: true,
    },
    {
      status: 200,
    }
  );
}

export const POST = withLocale(withAuth(withError(handler)));
