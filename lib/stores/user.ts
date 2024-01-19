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
function getUser() {
  try {
    return JSON.parse(localStorage?.getItem(USER_INFO) || '{}');
  } catch (err) {
    console.log(err);
    return undefined;
  }
}
const useStore = create<UserInfo>((set) => ({
  user: getUser(),
  setUser: (user) => set({ user }),
  clear: () => set({ user: undefined }),
}));

export default useStore;
