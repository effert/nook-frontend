import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModal from '@/app/api/modal/userModal';
import withLocale from '@/lib/middleware/withLocale';

const { SECRET_KEY = '' } = process.env;

async function postHandler(
  req: NextRequest,
  context: { params: Record<string, string> },
  t: Record<string, string>
) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      {
        message: t['Please provide both email and password'],
        success: false,
      },
      {
        status: 400,
      }
    );
  }

  try {
    let user = await UserModal.getUserInfo(email);
    if (!user) {
      // 未注册的用户直接注册并登录
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await UserModal.createUser(email, {
        password: hashedPassword,
        name: email,
      });
      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
        expiresIn: '24h',
      });
      return NextResponse.json(
        {
          message: t['Login successful'],
          data: {
            token,
            user,
          },
          success: true,
        },
        {
          status: 200,
        }
      );
    }

    // 临时密码
    if (user.tempPassword) {
      if (user.tempPasswordExpiry && user.tempPasswordExpiry < new Date()) {
        return NextResponse.json(
          {
            message: t['Temporary password expired'],
            success: false,
          },
          {
            status: 401,
          }
        );
      }
      if (await bcrypt.compare(password, user.tempPassword!)) {
        // 清除临时密码
        UserModal.updateUser(user.email, {
          tempPassword: null,
          tempPasswordExpiry: null,
        });
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
          expiresIn: '24h',
        });
        return NextResponse.json(
          {
            message: t['Login successful'],
            data: {
              token,
              user,
            },
            success: true,
          },
          {
            status: 200,
          }
        );
      } else {
        return NextResponse.json(
          {
            message: t['Invalid password'],
            success: false,
          },
          {
            status: 401,
          }
        );
      }
    }
    // 正常密码
    if (await bcrypt.compare(password, user.password!)) {
      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
        expiresIn: '24h',
      });
      // 清除临时密码
      UserModal.updateUser(user.email, {
        tempPassword: null,
        tempPasswordExpiry: null,
      });
      return NextResponse.json(
        {
          message: t['Login successful'],
          data: {
            token,
            user,
          },
          success: true,
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          message: t['Invalid password'],
          success: false,
        },
        {
          status: 401,
        }
      );
    }
  } catch (err) {
    return NextResponse.json(
      {
        message: t['Internal server error'],
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}

export const POST = withLocale(postHandler);
