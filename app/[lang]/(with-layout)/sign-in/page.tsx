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
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white dark:bg-neutral-800 shadow-md rounded w-80 px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6">{t['Sign In']}</h2>
        <LoginForm t={t} lang={lang} />
      </div>
    </div>
  );
};

export default LoginPage;
