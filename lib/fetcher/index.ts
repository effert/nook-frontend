import 'client-only';
import { message } from 'antd';
import Cookies from 'js-cookie';
import { getDictionary, Locale } from '@/lib/utils/get-dictionary';

const TOKEN = 'authorization'; // 自定义token

export interface FetcherOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  credentials?: string;
  format?: (data: any) => any;
  params?: Record<string, string>;
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
    url = `${url}${connector}${new URLSearchParams(params).toString()}`;
  } else if (method === 'POST') {
    options.body = JSON.stringify(params);
  }
  // 查看当前本地是否有token, 如果有，设置自定义headers中TOKEN
  const token = localStorage.getItem(TOKEN);
  if (token) options.headers['authorization'] = token;

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
    // TODO message 只能在组件内使用
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
