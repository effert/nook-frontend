import en_US from 'antd/locale/en_US';
import zh_CN from 'antd/locale/zh_CN';

export const i18n = {
  'en-us': {
    lang: 'English',
    antd: en_US,
  },
  'zh-cn': {
    lang: 'Chinese',
    antd: zh_CN,
  },
};

export type Locale = keyof typeof i18n;

export const defaultLocale = Object.keys(i18n)[0] as Locale;
export const localeList = Object.keys(i18n) as Locale[];

const dictionaries = {
  'en-us': () =>
    import('@/public/locales/en.json').then((module) => module.default),
  'zh-cn': () =>
    import('@/public/locales/zh-cn.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[localeList.includes(locale) ? locale : defaultLocale]();
