export type TUser = {
  id: number; // @id @default(autoincrement())
  email: string; // @unique // 用户账号，可以不是email
  password?: string;
  tempPassword?: string;
  tempPasswordExpiry?: bigint;
  name?: string;
  avatar?: string;
};
