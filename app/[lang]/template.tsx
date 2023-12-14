'use client';
import { useEffect } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const iconfontScript = document.querySelectorAll('.iconfont-script');
    iconfontScript.forEach((ele) => ele.remove());

    let script = document.createElement('script');
    script.src = '//at.alicdn.com/t/c/font_4371247_4mcrmkpdltq.js';
    script.classList.add('iconfont-script');
    document.body.append(script);
  }, []);
  return <>{children}</>;
}
