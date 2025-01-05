import { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeColors } from '@/types/theme';
import { THEMES } from '@/config/themes';

interface ThemeContextType {
  currentTheme: Theme;
  setThemeById: (themeId: string) => Promise<void>;
  availableThemes: Theme[];
  currentColors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES.default);
  const colorScheme = useColorScheme();

  const availableThemes = Object.values(THEMES);
  const currentColors = currentTheme.colors[colorScheme ?? 'light'];

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    try {
      const savedThemeId = await AsyncStorage.getItem('themeId');
      if (savedThemeId && THEMES[savedThemeId]) {
        setCurrentTheme(THEMES[savedThemeId]);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  }

  async function setThemeById(themeId: string) {
    try {
      const theme = THEMES[themeId];
      if (!theme) throw new Error('Theme not found');
      
      await AsyncStorage.setItem('themeId', themeId);
      setCurrentTheme(theme);
    } catch (error) {
      console.error('Error saving theme:', error);
      throw error;
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setThemeById,
        availableThemes,
        currentColors,
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