import 'client-only';
import { message } from 'antd';
import Cookies from 'js-cookie';
import { getDictionary, Locale } from '@/lib/utils/get-dictionary';
import { TOKEN } from '@/lib/constant/index';

export interface FetcherOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  credentials?: string;
  format?: (data: any) => any;
  params?: Record<string, string | number | boolean>;
  silence?: boolean;
}

function prefixHost(url: string) {
  if (url.startsWith('/')) {
    return `${process.env.BASE_URL}${url}`;
  }
  return url;
}
const fetcher = async ({
  url,
  method = 'GET',
  headers = {
    'Content-type': 'application/json',
  },
  credentials = 'include',
  format = () => {},
  params = {},
  silence,
}: FetcherOptions) => {
  const options: any = {
    method,
    headers,
    credentials,
  };

  url = prefixHost(url);

  if (method === 'GET') {
    let connector = '?';
    if (url.includes('?')) connector = '&';
    url = `${url}${connector}${new URLSearchParams(
      params as Record<string, string>
    ).toString()}`;
  } else {
    options.body = JSON.stringify(params);
  }
  // 查看当前本地是否有token, 如果有，设置自定义headers中TOKEN
  const token = localStorage.getItem(TOKEN);
  if (token) options.headers[TOKEN] = token;

  const locale = Cookies.get('locale') as Locale;
  const D = await getDictionary(locale);
  const t = D.fetch;
  try {
    const response = await fetch(url, options);
    const data = await response.json(); // 可以根据返回类型调整为 text() 或者其他
    // 如果请求成功
    if (response.ok && data.success) {
      return data?.data;
    }
    // 如果请求失败
    if (!silence) {
      message.error(
        data.message ||
          data.data.error ||
          t['request failed, please try again later']
      );
    }
  } catch (error) {
    message.error(t['request failed, please try again later']);
    console.error('请求错误:', error);
    throw error; // 可以选择抛出错误，让调用方处理
  }
};

export default fetcher;
