export const THEME: {
  label: string;
  value: 'light' | 'dark' | 'system';
  icon: string;
}[] = [
  {
    label: 'Light',
    value: 'light',
    icon: 'icon-nooksun',
  },
  {
    label: 'Dark',
    value: 'dark',
    icon: 'icon-nookmoon',
  },
  {
    label: 'System',
    value: 'system',
    icon: 'icon-nookcomputer',
  },
];

export const THEME_MAP = {
  light: 'icon-nooksun',
  dark: 'icon-nookmoon',
  system: 'icon-nookcomputer',
};
