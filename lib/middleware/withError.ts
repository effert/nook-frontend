import { NextRequest, NextResponse } from 'next/server';
import { JwtPayload } from 'jsonwebtoken';

export default function withError(
  handler: (
    req: NextRequest,
    context: { params: Record<string, string> },
    t: Record<string, string>,
    user?: JwtPayload
  ) => Promise<NextResponse>
) {
  return async (
    req: NextRequest,
    context: { params: Record<string, string> },
    t: Record<string, string>,
    user?: JwtPayload
  ) => {
    try {
      console.log(t);
      return handler(req, context, t, user);
    } catch (err) {
      return NextResponse.json(
        {
          message: 'Internal server error',
          success: false,
        },
        {
          status: 500,
          // headers: {
          //   'Access-Control-Allow-Origin': '*',
          //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          //   'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          // },
        }
      );
    }
  };
}
