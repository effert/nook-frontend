'use client';
import { create } from 'zustand';

export type TTheme = 'dark' | 'light' | 'system';
interface SysState {
  theme: TTheme;
  setTheme: (theme: TTheme) => void;
}
const useStore = create<SysState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));

export default useStore;
