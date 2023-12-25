'use client';
import { useState, useRef } from 'react';
import { Input, InputRef, Switch, Modal, Form, Button } from 'antd';
import fetcher from '@/lib/fetcher';
import {
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { TRoom } from '@/lib/types/global';
import emitter from '@/lib/event-emitter';

type FieldType = {
  password: string;
};

export default function RoomName({
  roomInfo,
  t,
}: {
  roomInfo: TRoom;
  t: Record<string, string>;
}) {
  const [roomName, setRoomName] = useState<string>(roomInfo.roomName || '');
  const [isEdit, setIsEdit] = useState(false);
  const [isLock, setIsLock] = useState<boolean>(!!roomInfo?.password);
  const [visible, setVisible] = useState(false);

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

  const handleChangeLock = async () => {
    if (isLock) {
      const resp = await updateRoom({ password: '' });
      console.log(resp);
      setIsLock((prev) => !prev);
      setVisible(false);
    } else {
      setVisible(true);
    }
  };

  const onFinish = async (value: FieldType) => {
    const resp = await updateRoom(value);
    console.log(resp);
    setIsLock((prev) => !prev);
    setVisible(false);
  };

  const handleOpenRoomList = () => {
    emitter.emit('open-room-list');
  };

  return (
    <div className="flex-1 h-7">
      <Modal
        title={t['set password']}
        open={visible}
        footer={null}
        onCancel={() => setVisible(false)}
      >
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          className="w-96"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType> label={t['password']} name="password">
            <Input.Password />
          </Form.Item>
          <Form.Item className="text-right">
            <Button type="primary" htmlType="submit">
              {t['save']}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {isEdit ? (
        <Input
          ref={inputInstance}
          value={roomName}
          className="border-0 bg-black"
          onChange={(e) => setRoomName(e.target.value)}
          onBlur={handleBlur}
        />
      ) : (
        <h1>
          <MenuUnfoldOutlined
            className="md:hidden mr-2"
            onClick={handleOpenRoomList}
          />
          <span className="hidden md:inline-block" onClick={handleClickName}>
            <span className="truncate">{roomName}</span>
            <EditOutlined className="mx-2 text-base cursor-pointer" />
          </span>
          <Switch
            checkedChildren={<LockOutlined />}
            unCheckedChildren={<UnlockOutlined />}
            checked={isLock}
            onChange={handleChangeLock}
          />
        </h1>
      )}
    </div>
  );
}
