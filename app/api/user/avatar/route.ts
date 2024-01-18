import { NextRequest, NextResponse } from 'next/server';
import withLocale from '@/lib/middleware/withLocale';
import withAuth from '@/lib/middleware/withAuth';
import { JwtPayload } from 'jsonwebtoken';
import { writeFile } from 'fs/promises';
import UserModal from '@/app/api/modal/userModal';

async function handler(
  req: NextRequest,
  context: { params: Record<string, string> },
  t: Record<string, string>,
  user?: JwtPayload
): Promise<NextResponse> {
  const data = await req.formData();
  const file: File | null = data.get('file') as unknown as File;

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

  if (!file) {
    return NextResponse.json(
      {
        message: t['Please provide a file'],
        success: false,
      },
      {
        status: 400,
        // headers: {
        //   'Access-Control-Allow-Origin': '*',
        //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        //   'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        // },
      }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  const path = `public/uploads/${file.name}`;
  await writeFile(path, buffer);
  const _filePath = path.split('public')[1];
  const _user = await UserModal.updateUser(user?.email, { avatar: _filePath });

  return NextResponse.json(
    { success: true, filePath: _filePath },
    {
      status: 200,
      // headers: {
      //   'Access-Control-Allow-Origin': '*',
      //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      //   'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      // },
    }
  );
}

export const POST = withAuth(withLocale(handler));
