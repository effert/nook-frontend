'use client';
import { useState, useEffect } from 'react';
import { Button, Tooltip, Input, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { emailRegex } from '@/lib/constant/reg';
import fetcher from '@/lib/fetcher';
import { useRouter } from 'next/navigation';

export default function LoginForm({ t }: { t: Record<string, string> }) {
  const [account, setAccount] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
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
      localStorage.setItem('authorization', resp?.token);
      router.push('/');
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

  return (
    <form>
      <div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="account"
        >
          {t['account']}
          <Tooltip title={t['Use email to get a dynamic password']}>
            <QuestionCircleOutlined className="ml-1" />
          </Tooltip>
        </label>
        <Input
          className="border rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="account"
          type="account"
          onChange={(e) => setAccount(e.target.value)}
          placeholder={t['Enter your account']}
        />
      </div>
      {visible && (
        <div className="flex justify-end">
          <Button onClick={handleGetDynamicPassword} type="link">
            {t['get dynamic password']}
          </Button>
        </div>
      )}
      <div className="mt-4 mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="password"
        >
          {t['password']}
        </label>
        <Input
          className="border rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t['Enter your password']}
        />
      </div>
      <Button className="w-full" type="primary" onClick={handleSubmit}>
        {t['Sign In']}
      </Button>
    </form>
  );
}
