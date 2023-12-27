'use client';
import React, { useState, useRef } from 'react';
import { Button, Modal, Form, Input, message, InputRef } from 'antd';
import { useRouter } from 'next/navigation';
import fetcher from '@/lib/fetcher';
import { get } from 'lodash';

type FieldType = {
  roomId: string;
  password?: string;
};

export default function NewRoomBtn({ t }: { t: Record<string, string> }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  const roomIdInstance = useRef<InputRef>(null);

  const handleCreateRoom = async () => {
    let resp = await fetcher({
      url: '/room/create',
      method: 'POST',
    });
    const roomInfo = get(resp, 'data', {});
    if (roomInfo.id) {
      router.push(`/chat/${roomInfo.id}`);
    }
  };

  const handleEnterRoom = () => {
    setVisible(true);
    setTimeout(() => {
      roomIdInstance.current?.focus();
    }, 0);
  };

  const onFinish = async (values: any) => {
    const resp = await fetcher({
      url: `/room/${values.roomId}`,
      method: 'GET',
      params: {
        password: values.password,
      },
    });
    const roomInfo = get(resp, 'data', {});
    if (roomInfo.id) {
      if (
        !roomInfo.password ||
        (roomInfo.password && roomInfo.isPasswordCorrect)
      ) {
        if (roomInfo.password) {
          router.push(
            `/chat/${roomInfo.id}/${encodeURIComponent(roomInfo.password)}`
          );
        } else {
          router.push(`/chat/${roomInfo.id}`);
        }
      } else {
        message.error(t['The password is incorrect']);
      }
    } else {
      message.error(t['The room does not exist']);
    }
    setVisible(false);
  };

  return (
    <div className="flex gap-2">
      <Modal
        title={t['enter room']}
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
          <Form.Item<FieldType>
            label={t['room id']}
            name="roomId"
            rules={[{ required: true, message: t['Please input roomId!'] }]}
          >
            <Input ref={roomIdInstance} />
          </Form.Item>

          <Form.Item<FieldType> label={t['password']} name="password">
            <Input.Password />
          </Form.Item>
          <Form.Item className="text-right">
            <Button type="primary" htmlType="submit">
              {t['enter']}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Button className="flex-1" onClick={handleCreateRoom}>
        {t['create']}
      </Button>
      <Button className="flex-1" type="primary" onClick={handleEnterRoom}>
        {t['enter']}
      </Button>
    </div>
  );
}
