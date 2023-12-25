'use client';
import { useState, useRef } from 'react';
import { Input, InputRef } from 'antd';
import fetcher from '@/lib/fetcher';
import { EditOutlined } from '@ant-design/icons';
import { TRoom } from '@/lib/types/global';

export default function RoomNameH5({ roomInfo }: { roomInfo: TRoom }) {
  const [roomName, setRoomName] = useState<string>(roomInfo.roomName || '');
  const [isEdit, setIsEdit] = useState(false);

  const inputInstance = useRef<InputRef>(null);

  const handleClickName = () => {
    setIsEdit(true);
    setTimeout(() => {
      inputInstance.current?.focus();
    }, 0);
  };

  async function updateRoom(params: Partial<TRoom>) {
    await fetcher({
      url: `/room/${roomInfo.id}`,
      method: 'PUT',
      params: params as Record<string, string>,
    });
  }

  const handleBlur = async () => {
    setIsEdit(false);
    await updateRoom({ roomName });
  };

  if (isEdit) {
    return (
      <Input
        ref={inputInstance}
        value={roomName}
        className="border-0 bg-black"
        onChange={(e) => setRoomName(e.target.value)}
        onBlur={handleBlur}
      />
    );
  }

  return (
    <h1 className="flex" onClick={handleClickName}>
      <span className="truncate">{roomName}</span>
      <EditOutlined className="mx-2 text-base cursor-pointer" />
    </h1>
  );
}
