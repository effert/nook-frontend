export type TUser = {
  id: number; // @id @default(autoincrement())
  email: string; // @unique // 用户账号，可以不是email
  password?: string;
  tempPassword?: string;
  tempPasswordExpiry?: bigint;
  name?: string;
  avatar?: string;
};

// 定义 Room 模型
export type TRoom = {
  id: string; // @id
  roomName: string;
  password?: string;
  aiEnabled: boolean; // 房间是否具有开通ai的权限
  ai: boolean; // 房间是否包含ai
  aiName: string; // ai 名称
  createdAt: DateTime; //@default(now())
  members: TUser[]; // 关联到 User 模型
  messages: TMessage[]; // 关联到 Message 模型
};

// 定义 Message 模型
export type TMessage = {
  id: number; // @id @default(autoincrement())
  content: string;
  timestamp: DateTime; // @default(now())
  roomId: string; // 外键，指向 Room
  room: TRoom; // @relation(fields: [roomId], references: [id])
  userId?: number; // 外键，指向 User
  user?: TUser; //@relation(fields: [userId], references: [id])
};
