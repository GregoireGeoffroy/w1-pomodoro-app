export interface ThemeColors {
  work: string;
  break: string;
  longBreak: string;
  background: string;
  text: string;
  surface: string;
  accent: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  isPremium: boolean;
  previewImage?: string;
} 