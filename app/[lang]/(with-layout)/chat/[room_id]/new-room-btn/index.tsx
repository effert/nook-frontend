'use client';
import React, { useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { useRouter } from 'next/navigation';
import fetcher from '@/lib/fetcher';

type FieldType = {
  roomId: string;
  password?: string;
};

export default function NewRoomBtn({ t }: { t: Record<string, string> }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  const handleCreateRoom = async () => {
    let resp = await fetcher({
      url: '/room/create',
      method: 'POST',
    });
    if (resp.data.id) {
      router.push(`/chat/${resp.data.id}`);
    }
  };

  const onFinish = async (values: any) => {
    const resp = await fetcher({
      url: `/room/${values.roomId}`,
      method: 'GET',
      params: {
        password: values.password,
      },
    });
    if (resp.data.id) {
      if (
        !resp.data.password ||
        (resp.data.password && resp.data.isPasswordCorrect)
      ) {
        router.push(
          `/chat/${resp.data.id}/${encodeURIComponent(resp.data.password)}`
        );
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
            <Input />
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
      <Button
        className="flex-1"
        type="primary"
        onClick={() => setVisible(true)}
      >
        {t['enter']}
      </Button>
    </div>
  );
}
