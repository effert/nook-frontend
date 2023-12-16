'use client';
import { create } from 'zustand';

export type TTheme = 'dark' | 'light' | 'system';
interface SysState {
  isInit: boolean;
  theme: TTheme;
  setTheme: (theme: TTheme) => void;
  setInit: () => void;
}
const useStore = create<SysState>((set) => ({
  isInit: false,
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  setInit: () => set({ isInit: true }),
}));

export default useStore;
