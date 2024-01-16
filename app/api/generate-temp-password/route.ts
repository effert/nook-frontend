import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import withLocale from '@/lib/middleware/withLocale';
import UserModal from '@/app/api/modal/userModal';
import { generateRandomString } from '@/lib/utils';

const { EMAIL_HOST_USER, EMAIL_HOST_PASSWORD } = process.env;

/**
 * 生成临时密码
 * @param req
 * @returns
 */
async function handler(
  req: NextRequest,
  res: NextResponse,
  t: Record<string, string>
) {
  const searchParams = req.nextUrl.searchParams;
  const email = searchParams.get('email');
  if (!email) {
    return NextResponse.json(
      {
        message: t['Please provide email'],
        success: false,
      },
      {
        status: 400,
      }
    );
  }
  const randomPassword = generateRandomString(8);
  const hashedPassword = await bcrypt.hash(randomPassword, 10);

  let user = await UserModal.getUserInfo(email!);

  let method: 'updateUser' | 'createUser' = 'updateUser';
  if (!user) {
    // 未注册的用户直接注册
    method = 'createUser';
  }

  user = await UserModal[method](email, {
    tempPassword: hashedPassword,
    tempPasswordExpiry: new Date(Date.now() + 15 * 60 * 1000),
  });
  try {
    await sendTemporaryPassword(user!.email, randomPassword, t);
    return NextResponse.json(
      {
        message: t['Temporary password generated'],
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: t['Internal server error'],
        success: true,
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * 发送临时密码到邮箱
 * @param email
 * @param tempPassword
 */
async function sendTemporaryPassword(
  email: string,
  tempPassword: string,
  t: Record<string, string>
) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_HOST_USER,
      pass: EMAIL_HOST_PASSWORD,
    },
  });

  let mailOptions = {
    from: EMAIL_HOST_USER,
    to: email,
    subject: t['Your Temporary Password'],
    html: `<p>${t['Your temporary password is']} <span style="color:red;text-decoration-line: underline">${tempPassword}</span>. ${t['It will expire in 15 minutes']}.</p>`,
  };

  return await transporter.sendMail(mailOptions);
}

export const GET = withLocale(handler);
