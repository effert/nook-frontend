'use client';
import { useState, useEffect } from 'react';
import { Button, Tooltip, Input, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { emailRegex } from '@/lib/constant/reg';
import fetcher from '@/lib/fetcher';
import { useRouter } from 'next/navigation';
import { TOKEN, USER_INFO } from '@/lib/constant/index';
import useStore from '@/lib/stores/user';
import Cookies from 'js-cookie';
import type { Locale } from '@/lib/utils/get-dictionary';

export default function LoginForm({
  t,
  lang,
}: {
  t: Record<string, string>;
  lang: Locale;
}) {
  const [account, setAccount] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);

  const [user, setUser] = useStore(
    (state) => [state.user, state.setUser] as const
  );

  const router = useRouter();

  useEffect(() => {
    console.log('NEXT_PUBLIC_BASE_URL111', process.env.NEXT_PUBLIC_BASE_URL);
    if (emailRegex.test(account)) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [account]);

  const handleSubmit = async () => {
    let resp = await fetcher({
      url: '/login',
      method: 'POST',
      params: {
        email: account,
        password,
      },
    });
    if (resp?.token) {
      Cookies.set(TOKEN, `bearer ${resp.token}`);
      localStorage.setItem(TOKEN, `bearer ${resp.token}`);
      localStorage.setItem(USER_INFO, JSON.stringify(resp.user));
      setUser(resp.user);
      router.push('/chat');
    }
  };

  const handleGetDynamicPassword = async () => {
    let resp = await fetcher({
      url: '/generate-temp-password',
      method: 'GET',
      params: {
        email: account,
      },
    });
    if (resp) {
      message.success(resp.message);
    }
  };

  console.log('NEXT_PUBLIC_BASE_URL', process.env.NEXT_PUBLIC_BASE_URL);
  return (
    <form className="text-gray-700 dark:text-white">
      <div>
        <label className="block text-sm font-bold mb-2" htmlFor="account">
          {t['account']}
          <Tooltip title={t['Use email to get a dynamic password']}>
            <QuestionCircleOutlined className="ml-1" />
          </Tooltip>
        </label>
        <Input
          className="border rounded w-full py-2 px-3 text-sm leading-tight focus:outline-none focus:shadow-outline"
          id="account"
          type="account"
          onChange={(e) => setAccount(e.target.value)}
          placeholder={t['Enter your account']}
        />
      </div>
      {visible && (
        <div className="flex justify-end">
          <Button onClick={handleGetDynamicPassword} type="link">
            {t['get password']}
          </Button>
        </div>
      )}
      <div className="mt-4 mb-6">
        <label className="block text-sm font-bold mb-2" htmlFor="password">
          {t['password']}
        </label>
        <Input
          className="border rounded w-full py-2 px-3 text-sm leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t['Enter your password']}
          onPressEnter={handleSubmit}
        />
      </div>
      <Button className="w-full" type="primary" onClick={handleSubmit}>
        {t['Sign In']}
      </Button>
    </form>
  );
}
