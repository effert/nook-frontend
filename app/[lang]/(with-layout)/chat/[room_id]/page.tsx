import React from 'react';
import type { Locale } from '@/lib/utils/get-dictionary';
import { getDictionary } from '@/lib/utils/get-dictionary';
import { Button } from 'antd';
import Room from './room';
import NewRoomBtn from './new-room-btn';
import { cookies } from 'next/headers';
import { TOKEN } from '@/lib/constant/index';

async function fetchUserInfo() {
  const cookieStore = cookies();
  const authorization = cookieStore.get(TOKEN);
  if (authorization) {
    const token = authorization.value;
    let resp = await fetch(`${process.env.BASE_URL}/user-info`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
    });
    let res = await resp.json();
    return res.data.user;
  }
}
const Page = async ({
  params: { room_id, lang },
}: {
  params: { room_id: string; lang: Locale };
}) => {
  const D = await getDictionary(lang);
  const t = D.chat;

  let userInfo = await fetchUserInfo();

  return (
    <div className="h-[calc(100vh-64px)] flex">
      <div className="w-60 border-r border-r-slate-400 flex flex-col">
        <div className="overflow-y-auto flex-1 px-3 pt-3 border-b border-b-slate-400">
          <NewRoomBtn t={t} />
          <div className="p-2 cursor-pointer hover:bg-slate-800">xxx的聊天</div>
          <div className="p-2 cursor-pointer hover:bg-slate-800">xxx的聊天</div>
          <div className="p-2 cursor-pointer hover:bg-slate-800">xxx的聊天</div>
        </div>
        <div className="h-32 p-3">
          <div className="p-2">{userInfo.name}</div>
          <div className="p-2">{t['note']}</div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="px-3 py-4 text-xl font-medium border-b border-b-slate-400 flex justify-between">
          <div>xxx的聊天室</div>
          <div className="flex gap-2">
            <Button className="text-xs" size="small">
              {t['import']}
            </Button>
            <Button className="text-xs" size="small" type="primary">
              {t['export']}
            </Button>
          </div>
        </div>
        <div className="flex flex-1">
          <Room t={t} roomId={room_id} />
        </div>
      </div>
    </div>
  );
};

export default Page;
