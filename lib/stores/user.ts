'use client';
import { create } from 'zustand';
import { TUser } from '@/lib/types/global';

interface UserInfo {
  user?: TUser;
  setUser: (user: TUser) => void;
  clear: () => void;
}
const useStore = create<UserInfo>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
  clear: () => set({ user: undefined }),
}));

export default useStore;
