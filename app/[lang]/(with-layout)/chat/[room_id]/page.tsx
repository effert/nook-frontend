import React from 'react';
import type { Locale } from '@/lib/utils/get-dictionary';
import { getDictionary } from '@/lib/utils/get-dictionary';
import Room from './room';
import NewRoomBtn from './new-room-btn';
import RoomName from './room-name';
import MessageBtn from './message-btn';
import { cookies } from 'next/headers';
import { TOKEN } from '@/lib/constant/index';
import { TRoom } from '@/lib/types/global';
import { findIndex, get } from 'lodash';

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
    return get(res, 'data.user', {});
  }
  return null;
}

async function getRoomList() {
  const cookieStore = cookies();
  const authorization = cookieStore.get(TOKEN);
  if (authorization) {
    const token = authorization.value;
    let resp = await fetch(`${process.env.BASE_URL}/user/rooms`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
    });
    let res = await resp.json();
    return get(res, 'data.data', []);
  }
  return [];
}

async function getRoomInfo(roomId: string) {
  let resp = await fetch(`${process.env.BASE_URL}/room/${roomId}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  let res = await resp.json();
  return get(res, 'data.data', []);
}

async function getRoomMembers(roomId: string) {
  let resp = await fetch(`${process.env.BASE_URL}/room/${roomId}/users`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  let res = await resp.json();
  return get(res, 'data.data', []);
}

const Page = async ({
  params: { room_id, lang },
}: {
  params: { room_id: string; lang: Locale };
}) => {
  const D = await getDictionary(lang);
  const t = D.chat;

  let userInfo = await fetchUserInfo();
  let roomList = await getRoomList();
  let roomInfo = await getRoomInfo(room_id);
  let members = await getRoomMembers(room_id);

  function mergeRoomList(roomList: TRoom[], roomInfo: TRoom) {
    if (roomInfo) {
      let index = findIndex(roomList, { id: roomInfo.id });
      if (index < 0) {
        roomList.push(roomInfo);
      } else {
        roomList[index] = roomInfo;
      }
    }
    return roomList;
  }

  return (
    <div className="h-[calc(100vh-64px)] flex">
      <div className="w-60 border-r border-r-slate-400 flex flex-col">
        <div className="overflow-y-auto flex-1 px-3 pt-4 border-b border-b-slate-400">
          <NewRoomBtn t={t} />
          {mergeRoomList(roomList, roomInfo).map((ele: TRoom) => (
            <a
              key={ele.id}
              className="block px-2 py-1 my-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-800"
              href={`/chat/${ele.id}`}
            >
              {ele.roomName}
            </a>
          ))}
        </div>
        {userInfo && (
          <div className="h-32 p-3">
            <div className="p-2">{userInfo?.name}</div>
            <div className="p-2">{t['note']}</div>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="px-3 py-4 text-xl font-medium border-b border-b-slate-400 flex gap-4 justify-between">
          <RoomName t={t} roomInfo={roomInfo} />
          <MessageBtn t={t} roomInfo={roomInfo} />
        </div>
        <div className="flex flex-1">
          <Room t={t} roomId={room_id} propMembers={members} />
        </div>
      </div>
    </div>
  );
};

export default Page;
