'use client';
import { TUser } from '@/lib/types/global';
import { Avatar, Tooltip, Upload, message, UploadProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { TOKEN } from '@/lib/constant/index';
import { useState } from 'react';

export default function UserInfo({
  user,
  t,
}: {
  user: TUser | null;
  t: Record<string, string>;
}) {
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);

  const localStorage: Storage | null =
    typeof window !== 'undefined' ? window.localStorage : null;
  const props: UploadProps = {
    name: 'file',
    accept: 'png,jpg,jpeg',
    action: `${process.env.NEXT_PUBLIC_BASE_URL}/user/avatar`,
    method: 'POST',
    withCredentials: true,
    showUploadList: false,
    headers: {
      [TOKEN]: localStorage?.getItem(TOKEN) || '',
    },
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
        if (user) {
          setAvatar(filePath);
        }
        message.success(t['import successful']);
      } else if (info.file.status === 'error') {
        message.error(t['import failed']);
      }
    },
  };

  return (
    <div className="flex items-center gap-2">
      <Upload {...props}>
        <Avatar
          size="large"
          crossOrigin="anonymous"
          src={`${process.env.NEXT_PUBLIC_BASE_URL}${avatar}`}
          icon={<UserOutlined />}
        />
      </Upload>
      <Tooltip title={user?.name || t['anonymity']}>
        <span className="flex-1 truncate">{user?.name || t['anonymity']}</span>
      </Tooltip>
    </div>
  );
}
