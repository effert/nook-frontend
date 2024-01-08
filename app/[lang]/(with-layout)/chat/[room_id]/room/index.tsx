'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  Input,
  message,
  Avatar,
  Tooltip,
  Drawer,
  Upload,
  UploadProps,
  Popover,
  InputRef,
} from 'antd';
import WebSocketService from '@/lib/websocket';
import { TUser } from '@/lib/types/global';
import { TOKEN } from '@/lib/constant/index';
import classnames from 'classnames';
import { findIndex } from 'lodash';
import {
  UserOutlined,
  SmileOutlined,
  PictureOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import emitter from '@/lib/event-emitter';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { EmojiClickData } from 'emoji-picker-react';
import fetcher from '@/lib/fetcher';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

type TMessageType = 'text' | 'image' | 'file' | 'member' | 'error'; // member 表示成员变动
enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  MEMBER = 'member',
  ERROR = 'error',
}

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
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const router = useRouter();
  const inputRef = useRef<
    InputRef & {
      resizableTextArea: {
        textArea: HTMLTextAreaElement;
      };
    }
  >(null);
  const aiNameInstance = useRef<InputRef>(null);

  useEffect(() => {
    emitter.on('open-member', () => {
      setOpen(true);
    });
    return () => {
      emitter.off('open-member');
    };
  }, []);

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
    WebSocketService.sendMessage(
      JSON.stringify({
        type: MessageType.TEXT,
        content: text,
      })
    );
    setText('');
  };

  const imgProps: UploadProps = {
    name: 'file',
    accept: 'png,jpg,jpeg',
    action: `${process.env.BASE_URL}/common/upload`,
    method: 'POST',
    showUploadList: false,
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg';
      if (!isJpgOrPng) {
        message.error(t['You can only upload JPG/PNG/JPG file!']);
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error(t['Image must smaller than 2MB!']);
      }
      return isJpgOrPng && isLt2M;
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        const { filePath } = info.file.response.data;
        WebSocketService.sendMessage(
          JSON.stringify({
            type: MessageType.IMAGE,
            content: filePath,
          })
        );
      } else if (info.file.status === 'error') {
        message.error(t['send failed']);
      }
    },
  };
  const fileProps: UploadProps = {
    name: 'file',
    action: `${process.env.BASE_URL}/common/upload`,
    method: 'POST',
    showUploadList: false,
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        message.error(t['File must smaller than 10MB!']);
      }
      return isLt2M;
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        const { filePath } = info.file.response.data;
        WebSocketService.sendMessage(
          JSON.stringify({
            type: MessageType.FILE,
            content: filePath,
          })
        );
      } else if (info.file.status === 'error') {
        message.error(t['send failed']);
      }
    },
  };

  const renderMessage = (ele: TMessage) => {
    switch (ele.type) {
      case MessageType.TEXT:
        return ele.content;
      case MessageType.IMAGE:
        return (
          <a href={`${process.env.BASE_URL}${ele.content}`} target="_blank">
            <Image
              width={80}
              height={80}
              alt=""
              src={`${process.env.BASE_URL}${ele.content}`}
            />
          </a>
        );
      case MessageType.FILE:
        return (
          <a href={`${process.env.BASE_URL}${ele.content}`} target="_blank">
            <FileOutlined className="text-2xl" />
          </a>
        );
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    const selectionStart =
      inputRef.current?.resizableTextArea.textArea.selectionStart;
    const cursorPosition = selectionStart || 0;
    const textBeforeCursor = text.slice(0, cursorPosition);
    const textAfterCursor = text.slice(cursorPosition);
    const newText = textBeforeCursor + emojiData.emoji + textAfterCursor;
    setText(newText);

    // Move the cursor after emoji
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.resizableTextArea.textArea.selectionStart =
          inputRef.current.resizableTextArea.textArea.selectionEnd =
            cursorPosition + emojiData.emoji.length;
      }
    }, 0);
  };

  const handleShowAiNameInput = () => {
    setEditing(true);
    setTimeout(() => {
      if (aiNameInstance.current) {
        aiNameInstance.current.focus();
      }
    }, 0);
  };

  const handleChangeAiName = async (name: string) => {
    const resp = await fetcher({
      url: `/room/${roomId}`,
      method: 'PUT',
      params: {
        aiName: name,
      },
    });
    if (resp.code === 200) {
      setMembers((prevMembers) => {
        const newMembers = [...prevMembers];
        const index = findIndex(newMembers, { id: -1 });
        newMembers[index].name = name;
        return newMembers;
      });
    }
    setEditing(false);
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
                {renderMessage(ele)}
              </div>
            </div>
          ))}
        </div>
        <div className="h-32">
          <div className="flex gap-2 p-2">
            <Popover
              trigger="click"
              content={<EmojiPicker onEmojiClick={onEmojiClick} />}
            >
              <SmileOutlined className="cursor-pointer" />
            </Popover>
            <Upload {...imgProps}>
              <PictureOutlined className="cursor-pointer" />
            </Upload>
            <Upload {...fileProps}>
              <FileOutlined className="cursor-pointer" />
            </Upload>
          </div>
          <TextArea
            value={text}
            ref={inputRef}
            className="h-[calc(100%-32px)] resize-none bg-transparent border-0 focus:shadow-none"
            placeholder={t[`press 'Enter' to send`]}
            onChange={(e) => setText(e.target.value)}
            onPressEnter={handleSendMessage}
          />
        </div>
      </div>
      <div className="w-48 border-l border-l-slate-400 p-3 hidden md:block">
        <div className="text-base">{t['member']}</div>
        <div>
          {members.map((ele) => {
            if (ele.id === -1) {
              if (editing) {
                return (
                  <Input
                    ref={aiNameInstance}
                    key={ele.id}
                    defaultValue={ele.name}
                    onBlur={(e) => {
                      handleChangeAiName(e.target.value);
                    }}
                  />
                );
              }
              return (
                <div
                  key={ele.id}
                  className="py-2 text-sm text-ellipsis cursor-pointer"
                  onClick={handleShowAiNameInput}
                >
                  {ele.name}
                </div>
              );
            }
            return (
              <Tooltip key={ele.id} title={ele.name || t['anonymity']}>
                <div className="py-2 text-sm text-ellipsis">{ele.name}</div>
              </Tooltip>
            );
          })}
        </div>
      </div>
      <Drawer
        title={t['member']}
        placement="right"
        open={open}
        width={200}
        onClose={() => setOpen(false)}
      >
        {members.map((ele) => {
          if (ele.id === -1) {
            if (editing) {
              return (
                <Input
                  key={ele.id}
                  defaultValue={ele.name}
                  ref={aiNameInstance}
                  onBlur={(e) => {
                    handleChangeAiName(e.target.value);
                  }}
                />
              );
            }
            return (
              <div
                key={ele.id}
                className="py-2 text-sm text-ellipsis cursor-pointer"
                onClick={handleShowAiNameInput}
              >
                {ele.name}
              </div>
            );
          }
          return (
            <Tooltip key={ele.id} title={ele.name || t['anonymity']}>
              <div className="py-2 text-sm text-ellipsis">{ele.name}</div>
            </Tooltip>
          );
        })}
      </Drawer>
    </>
  );
}
