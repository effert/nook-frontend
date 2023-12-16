import { create } from 'zustand';

export type TTheme = 'dark' | 'light' | 'system';
interface SysState {
  theme: TTheme;
  setTheme: (theme: TTheme) => void;
}
let localStorage = {
  theme: 'light' as TTheme,
};
if (typeof window !== 'undefined') {
  localStorage = window.localStorage as unknown as {
    theme: TTheme;
  };
}

const useStore = create<SysState>((set) => ({
  theme: localStorage.theme,
  setTheme: (theme) => set(() => ({ theme })),
}));

export default useStore;
