'use client';
import { PropsWithChildren } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import type { Locale } from '@/lib/utils/get-dictionary';
import { i18n, defaultLocale } from '@/lib/utils/get-dictionary';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import useSysStore from '@/lib/stores/system';
import { isDark } from '@/components/layout/switch-theme';

export type ProviderProps = PropsWithChildren<{
  locale: Locale;
}>;

const LocaleProvider = ({ children, locale }: ProviderProps) => {
  dayjs.locale(locale);
  const { theme } = useSysStore();

  // TODO 主题并没有切换,不知道为什么切换过路由后就正常了
  return (
    <ConfigProvider
      locale={(i18n as any)[(locale as any) ?? defaultLocale]?.antd}
      theme={{
        algorithm: isDark(theme)
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: isDark(theme) ? '#8bbb11' : '#1668dc',
          colorPrimaryActive: isDark(theme) ? '#536d13' : '#15417e',
          colorBgContainerDisabled: isDark(theme) ? '#e4f88b' : '#8dc5f8',
        },
        cssVar: true,
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default LocaleProvider;
