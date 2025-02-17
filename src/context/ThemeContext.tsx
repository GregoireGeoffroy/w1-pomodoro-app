import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const colorScheme = useColorScheme();
  const [currentThemeId, setCurrentThemeId] = useState('default');
  const currentTheme = THEMES[currentThemeId];
  const availableThemes = Object.values(THEMES);
  const currentColors = currentTheme.colors[colorScheme ?? 'light'];

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    try {
      const savedThemeId = await AsyncStorage.getItem('themeId');
      if (savedThemeId && THEMES[savedThemeId]) {
        setCurrentThemeId(savedThemeId);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  }

  async function setThemeById(themeId: string) {
    try {
      if (!THEMES[themeId]) throw new Error('Theme not found');
      await AsyncStorage.setItem('themeId', themeId);
      setCurrentThemeId(themeId);
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