import React from 'react';
import { getDictionary } from '@/lib/utils/get-dictionary';
import type { Locale } from '@/lib/utils/get-dictionary';
import LoginForm from './login-form';

const LoginPage: React.FC<{
  params: { lang: Locale };
}> = async ({ params: { lang } }) => {
  const D = await getDictionary(lang);
  const t = D.login;

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 dark:text-white shadow-md rounded w-80 px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6">{t['Sign In']}</h2>
        <LoginForm t={t} />
      </div>
    </div>
  );
};

export default LoginPage;
