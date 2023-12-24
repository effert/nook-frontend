'use client';
import React, { useState, useEffect } from 'react';
import { Input, message, Avatar, Tooltip } from 'antd';
import WebSocketService from '@/lib/websocket';
import { TUser } from '@/lib/types/global';
import { TOKEN } from '@/lib/constant/index';
import classnames from 'classnames';
import { findIndex } from 'lodash';
import { UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

type TMessageType = 'text' | 'image' | 'file' | 'member' | 'error'; // member 表示成员变动

type TMessage = {
  type: TMessageType;
  content: string; // type 为 member 时,content 为成员变动的类型(join,leave)
  sender: TUser; // type 为 member 时, sender 为成员
  time: number;
  isSelf?: boolean;
};
const { TextArea } = Input;
export default function Room({
  t,
  roomId,
  propMembers = [],
}: {
  t: Record<string, string>;
  roomId: string;
  propMembers?: TUser[];
}) {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [members, setMembers] = useState<TUser[]>(propMembers);
  const [text, setText] = useState('');

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(TOKEN);
    WebSocketService.connect(
      `${process.env.WEBSOCKET_URL}/${roomId}?authorization=${
        token || 'anonymous'
      }`,
      (msg) => {
        const newMessage: TMessage = JSON.parse(msg);
        if (newMessage.type === 'error') {
          message.error(newMessage.content);
          router.push('/chat');
        } else if (newMessage.type === 'member') {
          handleMemberChange(newMessage);
        } else {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      }
    );
    return () => {
      WebSocketService.close();
    };
  }, []);

  function handleMemberChange(newMessage: TMessage) {
    if (newMessage.content === 'join') {
      // 去重
      let index = findIndex(members, { id: newMessage.sender.id });
      if (index < 0) {
        const newMembers = [...members, newMessage.sender];
        setMembers(newMembers);
      }
    } else if (newMessage.content === 'leave') {
      // 有成员离开
      setMembers((prevMember) =>
        prevMember.filter((ele) => ele.id !== newMessage.sender.id)
      );
    }
  }

  const handleSendMessage = () => {
    WebSocketService.sendMessage(text);
    setText('');
  };

  return (
    <>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 border-b border-b-slate-400 py-3 px-6 overflow-y-scroll">
          {messages.map((ele, index) => (
            <div
              key={index}
              className={classnames('my-3', {
                'text-right': ele.isSelf,
              })}
            >
              <div
                className={classnames('flex', {
                  'justify-end': ele.isSelf,
                })}
              >
                <div
                  className={classnames('text-sm flex items-center gap-2', {
                    'flex-row-reverse': !ele.isSelf,
                  })}
                >
                  <span>{new Date(ele.time).toLocaleString()}</span>
                  <Tooltip title={ele.sender.name || t['anonymity']}>
                    <Avatar
                      size="large"
                      crossOrigin="anonymous"
                      src={`${process.env.BASE_URL}${ele.sender.avatar}`}
                      icon={<UserOutlined />}
                    />
                  </Tooltip>
                </div>
              </div>
              <div className="text-sm mt-2 bg-slate-200 dark:bg-slate-600 px-4 py-2 inline-block rounded-lg">
                {ele.content}
              </div>
            </div>
          ))}
        </div>
        <div className="h-32">
          <TextArea
            value={text}
            className="h-full resize-none bg-transparent border-0"
            placeholder={t[`press 'Enter' to send`]}
            onChange={(e) => setText(e.target.value)}
            onPressEnter={handleSendMessage}
          />
        </div>
      </div>
      <div className="w-48 border-l border-l-slate-400 p-3">
        <div className="text-base">{t['member']}</div>
        <div>
          {members.map((ele) => (
            <Tooltip key={ele.id} title={ele.name || t['anonymity']}>
              <div className="py-2 text-sm text-ellipsis">{ele.name}</div>
            </Tooltip>
          ))}
        </div>
      </div>
    </>
  );
}
