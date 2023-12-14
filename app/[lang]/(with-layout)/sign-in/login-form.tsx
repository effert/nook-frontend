'use client';
import { useState } from 'react';
import { Button, Tooltip, Input, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

export default function LoginForm({ t }: { t: Record<string, string> }) {
  const [account, setAccount] = useState<string>();
  const [password, setPassword] = useState<string>();

  const handleSubmit = async () => {
    let resp = await fetch(`${process.env.BASE_URL}/login`, {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: account, password }),
    });
    let res = await resp.json();
    if (res.success) {
      localStorage.setItem('authorization', res.data.token);
    } else {
      message.error(res.message || res.data.error);
    }
  };
  return (
    <form>
      <div className="mb-4">
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
      <div className="mb-6">
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
