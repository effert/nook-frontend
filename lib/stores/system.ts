import { create } from 'zustand';

type TTheme = 'dark' | 'light';
interface SysState {
  theme: TTheme;
  setTheme: (theme: TTheme) => void;
}
const useStore = create<SysState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set(() => ({ theme })),
}));

export default useStore;
