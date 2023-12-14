'use client';
import { PropsWithChildren } from 'react';
import { ConfigProvider } from 'antd';
import type { Locale } from '@/lib/utils/get-dictionary';
import { i18n, defaultLocale } from '@/lib/utils/get-dictionary';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

export type ProviderProps = PropsWithChildren<{
  locale: Locale;
}>;

const LocaleProvider = ({ children, locale }: ProviderProps) => {
  dayjs.locale(locale);

  return (
    <ConfigProvider
      locale={(i18n as any)[(locale as any) ?? defaultLocale]?.antd}
      theme={{
        token: {
          colorPrimary: '#4C7DF3',
          colorPrimaryActive: '#2E65E8',
          colorBgContainerDisabled: '#AFC1ED',
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default LocaleProvider;
