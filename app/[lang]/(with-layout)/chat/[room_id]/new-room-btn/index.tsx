'use client';
import React from 'react';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import fetcher from '@/lib/fetcher';

export default function NewRoomBtn({ t }: { t: Record<string, string> }) {
  const router = useRouter();

  const handleCreateRoom = async () => {
    let resp = await fetcher({
      url: '/room/create',
      method: 'POST',
    });
    if (resp.data.id) {
      router.push(`/chat/${resp.data.id}`);
    }
  };

  return (
    <div className="flex gap-2">
      <Button className="flex-1" onClick={handleCreateRoom}>
        {t['create']}
      </Button>
      <Button className="flex-1" type="primary">
        {t['enter']}
      </Button>
    </div>
  );
}
