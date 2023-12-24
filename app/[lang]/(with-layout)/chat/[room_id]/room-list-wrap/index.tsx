'use client';
import { Drawer } from 'antd';
import { useState, useEffect } from 'react';
import emitter from '@/lib/event-emitter';

export default function RoomListWrap({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    emitter.on('open-room-list', () => {
      setOpen(true);
    });
    return () => {
      emitter.off('open-room-list');
    };
  }, []);
  return (
    <Drawer
      title=""
      open={open}
      placement="left"
      width={300}
      onClose={() => setOpen(false)}
    >
      {children}
    </Drawer>
  );
}
