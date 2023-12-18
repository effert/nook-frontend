'use client';
import { create } from 'zustand';
import { TUser } from '@/lib/types/global';
import { USER_INFO } from '@/lib/constant/index';

interface UserInfo {
  user?: TUser;
  setUser: (user: TUser) => void;
  clear: () => void;
}
let localStorage: Storage;
if (typeof window !== 'undefined') {
  localStorage = window.localStorage;
}
const useStore = create<UserInfo>((set) => ({
  user: localStorage?.getItem(USER_INFO)
    ? JSON.parse(localStorage.getItem(USER_INFO) as string)
    : undefined,
  setUser: (user) => set({ user }),
  clear: () => set({ user: undefined }),
}));

export default useStore;
