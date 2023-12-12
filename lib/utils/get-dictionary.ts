export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'cn'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

const dictionaries = {
  en: () => import('@/public/locales/en.json').then((module) => module.default),
  cn: () => import('@/public/locales/cn.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[i18n.locales.includes(locale) ? locale : i18n.defaultLocale]();
