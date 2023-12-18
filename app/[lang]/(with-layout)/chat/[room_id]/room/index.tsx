'use client';
import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import WebSocketService from '@/lib/websocket';
import { TUser } from '@/lib/types/global';
import { TOKEN } from '@/lib/constant/index';
import classnames from 'classnames';

type TMessageType = 'text' | 'image' | 'file' | 'member'; // member 表示成员变动

type TMessage = {
  type: TMessageType;
  content: string; // type 为 member 时,content 为成员变动的类型(join,leave)
  sender: TUser | null; // type 为 member 时, sender 为成员名 null说明是匿名用户
  time: number;
  isSelf?: boolean;
};
const { TextArea } = Input;
export default function Room({
  t,
  roomId,
}: {
  t: Record<string, string>;
  roomId: string;
}) {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [members, setMembers] = useState<TUser[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const token = localStorage.getItem(TOKEN);
    WebSocketService.connect(
      `${process.env.WEBSOCKET_URL}/${roomId}?authorization=${token}`,
      (msg) => {
        const newMessage: TMessage = JSON.parse(msg);
        if (newMessage.type === 'member') {
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
      // 有新成员加入
      if (!newMessage.sender) {
        setMembers((prevMembers) => [
          ...prevMembers,
          {
            id: members.length + 1,
            email: '匿名用户',
            name: '匿名用户',
          },
        ]);
      } else {
        setMembers((prevMembers) => [
          ...prevMembers,
          newMessage.sender as TUser,
        ]);
      }
    } else if (newMessage.content === 'leave') {
      // 有成员离开
      if (!newMessage.sender) {
        // 删除第一个找到的匿名用户
        let index = members.findIndex((ele) => ele.email === '匿名用户');
        if (index !== -1) {
          setMembers((prevMember) => {
            prevMember.splice(index, 1);
            return prevMember;
          });
        }
      } else {
        setMembers((prevMember) =>
          prevMember.filter((ele) => ele.id !== newMessage.sender?.id)
        );
      }
    }
  }

  const handleSendMessage = () => {
    WebSocketService.sendMessage(text);
    setText('');
  };

  return (
    <>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 border-b border-b-slate-400 py-3 px-6">
          {messages.map((ele, index) => (
            <div
              key={index}
              className={classnames('my-3', {
                'text-right': ele.isSelf,
              })}
            >
              <div className="text-base">
                {ele.sender?.name || t['anonymity']}:
              </div>
              <div className="text-sm mt-1">{ele.content}</div>
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
            <div key={ele.id} className="py-2 text-sm text-ellipsis">
              {ele.name}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
