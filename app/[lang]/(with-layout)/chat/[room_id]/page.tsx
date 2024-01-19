import React from 'react';
import type { Locale } from '@/lib/utils/get-dictionary';
import { getDictionary } from '@/lib/utils/get-dictionary';
import Room from './room';
import NewRoomBtn from './new-room-btn';
import RoomName from './room-name';
import MessageBtn from './message-btn';
import { cookies } from 'next/headers';
import { TOKEN } from '@/lib/constant/index';
import { TRoom, TUser } from '@/lib/types/global';
import { findIndex, get } from 'lodash';
import { redirect } from 'next/navigation';
import UserInfo from './user-info';
import RoomListWrap from './room-list-wrap';
import RoomNameH5 from './room-name-h5';

const cookieStore = cookies();
const authorization = cookieStore.get(TOKEN);

async function fetchUserInfo() {
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

async function getRoomInfo(roomId: string, password?: string) {
  let resp = await fetch(
    `${process.env.BASE_URL}/room/${roomId}?password=${decodeURIComponent(
      password || ''
    )}`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  let res = await resp.json();
  return get(res, 'data.data', {}) as TRoom & {
    isPasswordCorrect: boolean;
  };
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
  params: { room_id, lang, password },
}: {
  params: { lang: Locale; room_id?: string; password?: string };
}) => {
  const D = await getDictionary(lang);
  const t = D.chat;

  let userInfo: TUser | null = await fetchUserInfo();
  let roomList = await getRoomList();
  let roomInfo:
    | (TRoom & {
        isPasswordCorrect?: boolean;
      })
    | undefined;
  let members;
  if (room_id) {
    roomInfo = await getRoomInfo(room_id, password);
    members = await getRoomMembers(room_id);
  }
  if (roomInfo?.password && !roomInfo.isPasswordCorrect) {
    redirect('/');
  }

  function mergeRoomList(roomList: TRoom[], roomInfo?: TRoom) {
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

  const roomListDom = (className: string, innerClassName?: string) => (
    <div
      className={`w-60 md:border-r border-r-slate-400 flex-col h-full ${className}`}
    >
      <div
        className={`overflow-y-auto flex-1 border-b border-b-slate-400 ${innerClassName}`}
      >
        <NewRoomBtn t={t} />
        {mergeRoomList(roomList, roomInfo).map((ele: TRoom) => (
          <a
            key={ele.id}
            className="block px-2 py-1 my-2 cursor-pointer truncate hover:bg-gray-200 dark:hover:bg-slate-800"
            href={`/chat/${ele.id}`}
          >
            {ele.roomName}
          </a>
        ))}
      </div>
      {userInfo && (
        <div className="h-32 p-3">
          <UserInfo user={userInfo} t={t} />
          <div className="p-2">{t['note']}</div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {roomListDom('hidden md:flex', 'px-3 pt-4')}
      <RoomListWrap>{roomListDom('flex')}</RoomListWrap>
      {roomInfo && room_id ? (
        <div className="flex-1 flex flex-col w-[calc(100%-240px)]">
          <div className="md:hidden px-3 pt-4">
            <RoomNameH5 roomInfo={roomInfo} />
          </div>
          <div className="px-3 py-4 text-xl font-medium border-b border-b-slate-400 flex gap-4 justify-between">
            <RoomName t={t} roomInfo={roomInfo} />
            <MessageBtn t={t} roomInfo={roomInfo} />
          </div>
          <div className="flex flex-1 h-[calc(100%-61px)]">
            <Room
              t={t}
              roomId={room_id}
              propMembers={members}
              roomInfo={roomInfo}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 h-full flex justify-center items-center">
          <h1 className="text-4xl">{t['welcome to NOOK']}</h1>
        </div>
      )}
    </div>
  );
};

export default Page;
