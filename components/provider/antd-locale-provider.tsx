'use client';
import { PropsWithChildren } from 'react';
import { ConfigProvider } from 'antd';
import type { Locale } from '@/lib/utils/get-dictionary';
import { i18n, defaultLocale } from '@/lib/utils/get-dictionary';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import useSysStore from '@/lib/stores/system';

export type ProviderProps = PropsWithChildren<{
  locale: Locale;
}>;

const LocaleProvider = ({ children, locale }: ProviderProps) => {
  dayjs.locale(locale);
  const { theme } = useSysStore();

  console.log(1212, theme);
  return (
    <ConfigProvider
      locale={(i18n as any)[(locale as any) ?? defaultLocale]?.antd}
      theme={{
        token: {
          colorPrimary: theme === 'light' ? '#1668dc' : '#8bbb11',
          colorPrimaryActive: theme === 'light' ? '#15417e' : '#536d13',
          colorBgContainerDisabled: theme === 'light' ? '#8dc5f8' : '#e4f88b',
        },
        cssVar: true,
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default LocaleProvider;
