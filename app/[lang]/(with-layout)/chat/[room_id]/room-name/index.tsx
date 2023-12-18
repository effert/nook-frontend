'use client';
import { useState, useRef } from 'react';
import { Input, InputRef } from 'antd';
import fetcher from '@/lib/fetcher';

export default function RoomName({
  name,
  roomId,
}: {
  name?: string;
  roomId: string;
}) {
  const [roomName, setRoomName] = useState<string>(name || '');
  const [isEdit, setIsEdit] = useState(false);

  const inputInstance = useRef<InputRef>(null);

  const handleClickName = () => {
    setIsEdit(true);
    setTimeout(() => {
      inputInstance.current?.focus();
    }, 0);
  };

  const handleBlur = async () => {
    setIsEdit(false);
    console.log(12, roomName);
    let resp = await fetcher({
      url: `/room/${roomId}`,
      method: 'PUT',
      params: {
        roomName,
      },
    });
    console.log(1212, resp);
  };

  return (
    <div className="flex-1 h-7" onClick={handleClickName}>
      {isEdit ? (
        <Input
          ref={inputInstance}
          value={roomName}
          className="border-0 bg-black"
          onChange={(e) => setRoomName(e.target.value)}
          onBlur={handleBlur}
        />
      ) : (
        <h1>{roomName}</h1>
      )}
    </div>
  );
}
