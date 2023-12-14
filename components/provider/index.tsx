'use client';
import { PropsWithChildren } from 'react';
import AntdStyleProvider from '@/components/provider/antd-style-provider';
import AntdLocaleProvider from '@/components/provider/antd-locale-provider';
import SwrProvider from '@/components/provider/swr-provider';
import type { Locale } from '@/lib/utils/get-dictionary';

export type ProviderProps = PropsWithChildren<{
  lang: Locale;
}>;
export default function Provider({ children, lang }: ProviderProps) {
  return (
    <AntdLocaleProvider locale={lang}>
      <SwrProvider>
        <AntdStyleProvider>{children}</AntdStyleProvider>
      </SwrProvider>
    </AntdLocaleProvider>
  );
}
