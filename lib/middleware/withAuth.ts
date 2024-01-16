import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TOKEN } from '@/lib/constant/index';

const { SECRET_KEY = '' } = process.env;

export default function withAuth(
  handler: (
    req: NextRequest,
    res: NextResponse,
    t: Record<string, string>,
    user?: JwtPayload
  ) => Promise<NextResponse>
) {
  return (req: NextRequest, res: NextResponse, t: Record<string, string>) => {
    const authHeader = req.headers.get(TOKEN) ?? '';
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        const user = jwt.verify(token, SECRET_KEY) as JwtPayload;
        return handler(req, res, t, user);
      } catch (error) {
        return NextResponse.json(
          {
            message: 'Access denied',
            success: false,
          },
          {
            status: 403,
          }
        );
      }
    } else {
      return NextResponse.json(
        {
          message: 'Authentication required',
          success: false,
        },
        {
          status: 401,
        }
      );
    }
  };
}
