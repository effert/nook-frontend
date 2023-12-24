'use client';
import { Button, Upload, UploadProps, message } from 'antd';
import { TRoom } from '@/lib/types/global';
import fetcher from '@/lib/fetcher';
import { MenuFoldOutlined } from '@ant-design/icons';
import emitter from '@/lib/event-emitter';

export default function MessageBtn({
  t,
  roomInfo,
}: {
  t: Record<string, string>;
  roomInfo: TRoom;
}) {
  const props: UploadProps = {
    name: 'file',
    action: `${process.env.BASE_URL}/message/import?roomId=${roomInfo.id}`,
    showUploadList: false,
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(t['import successful']);
      } else if (info.file.status === 'error') {
        message.error(t['import failed']);
      }
    },
  };

  const handleExport = async () => {
    const resp = await fetcher({
      url: `${process.env.BASE_URL}/message/export`,
      method: 'POST',
      params: {
        roomId: roomInfo.id,
      },
    });
    if (resp.path) {
      window.open(resp.path);
    }
  };

  const handleOpenMember = () => {
    emitter.emit('open-member');
  };

  return (
    <div className="flex gap-2 items-center">
      <Upload {...props}>
        <Button className="text-xs" size="small">
          {t['import']}
        </Button>
      </Upload>
      <Button
        className="text-xs"
        size="small"
        type="primary"
        onClick={handleExport}
      >
        {t['export']}
      </Button>
      <MenuFoldOutlined className="md:hidden" onClick={handleOpenMember} />
    </div>
  );
}
