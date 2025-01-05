import { useTheme } from '@/context/ThemeContext';

export function useThemeColors() {
  const { currentColors } = useTheme();
  return currentColors;
} 