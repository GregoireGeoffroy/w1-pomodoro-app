import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const THEMES = {
  default: {
    work: '#FF6B6B',
    break: '#4CAF50',
    longBreak: '#2196F3',
  },
  ocean: {
    work: '#0277BD',
    break: '#00BCD4',
    longBreak: '#006064',
  },
  forest: {
    work: '#2E7D32',
    break: '#81C784',
    longBreak: '#1B5E20',
  },
  sunset: {
    work: '#F57C00',
    break: '#FFB74D',
    longBreak: '#E65100',
  },
  minimal: {
    work: '#424242',
    break: '#757575',
    longBreak: '#212121',
  },
} as const;

export type ThemeName = keyof typeof THEMES;

interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themeColors: typeof THEMES[ThemeName];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('default');

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme && savedTheme in THEMES) {
        setCurrentTheme(savedTheme as ThemeName);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  }

  async function setTheme(theme: ThemeName) {
    try {
      await AsyncStorage.setItem('theme', theme);
      setCurrentTheme(theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        themeColors: THEMES[currentTheme],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 