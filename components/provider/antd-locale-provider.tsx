import { PropsWithChildren } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import type { Locale } from '@/lib/utils/get-dictionary';
import { i18n, defaultLocale } from '@/lib/utils/get-dictionary';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import useSysStore from '@/lib/stores/system';
import { isDark } from '@/lib/customHook/useInitTheme';

export type ProviderProps = PropsWithChildren<{
  locale: Locale;
}>;

const LocaleProvider = ({ children, locale }: ProviderProps) => {
  dayjs.locale(locale);
  const { theme, isInit } = useSysStore();

  if (!isInit) {
    return <ConfigProvider>{children}</ConfigProvider>;
  }
  return (
    <ConfigProvider
      locale={(i18n as any)[(locale as any) ?? defaultLocale]?.antd}
      theme={{
        algorithm: isDark(theme)
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: isDark(theme) ? '#1668dc' : '#1668dc',
          colorPrimaryActive: isDark(theme) ? '#15417e' : '#15417e',
          colorBgContainerDisabled: isDark(theme) ? '#8dc5f8' : '#8dc5f8',
        },
        cssVar: true,
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default LocaleProvider;
