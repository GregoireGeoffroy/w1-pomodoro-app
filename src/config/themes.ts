import { Theme } from '@/types/theme';

export const THEMES: Record<string, Theme> = {
  default: {
    id: 'default',
    name: 'Classic',
    isPremium: false,
    colors: {
      light: {
        work: '#FF6B6B',
        break: '#4CAF50',
        longBreak: '#2196F3',
        background: '#FFFFFF',
        text: '#000000',
        surface: '#F5F5F5',
        accent: '#FF6B6B',
        primary: '#FF6B6B',
        secondary: '#4CAF50',
        tertiary: '#2196F3'
      },
      dark: {
        work: '#FF6B6B',
        break: '#4CAF50',
        longBreak: '#2196F3',
        background: '#000000',
        text: '#FFFFFF',
        surface: '#374151',
        accent: '#FF6B6B',
        primary: '#FF6B6B',
        secondary: '#4CAF50',
        tertiary: '#2196F3'
      }
    }
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    isPremium: false,
    colors: {
      light: {
        work: '#0277BD',
        break: '#00BCD4',
        longBreak: '#006064',
        background: '#E3F2FD',
        text: '#01579B',
        surface: '#BBDEFB',
        accent: '#0277BD',
        primary: '#0277BD',
        secondary: '#00BCD4',
        tertiary: '#006064'
      },
      dark: {
        work: '#0277BD',
        break: '#00BCD4',
        longBreak: '#006064',
        background: '#0A1929',
        text: '#81D4FA',
        surface: '#0D47A1',
        accent: '#0277BD',
        primary: '#0277BD',
        secondary: '#00BCD4',
        tertiary: '#006064'
      }
    }
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    isPremium: false,
    colors: {
      light: {
        work: '#2E7D32',
        break: '#81C784',
        longBreak: '#1B5E20',
        background: '#E8F5E9',
        text: '#1B5E20',
        surface: '#C8E6C9',
        accent: '#2E7D32',
        primary: '#2E7D32',
        secondary: '#81C784',
        tertiary: '#1B5E20'
      },
      dark: {
        work: '#2E7D32',
        break: '#81C784',
        longBreak: '#1B5E20',
        background: '#0A160A',
        text: '#81C784',
        surface: '#1B5E20',
        accent: '#2E7D32',
        primary: '#2E7D32',
        secondary: '#81C784',
        tertiary: '#1B5E20'
      }
    }
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    isPremium: false,
    colors: {
      light: {
        work: '#F57C00',
        break: '#FFB74D',
        longBreak: '#E65100',
        background: '#FFF3E0',
        text: '#E65100',
        surface: '#FFE0B2',
        accent: '#F57C00',
        primary: '#F57C00',
        secondary: '#FFB74D',
        tertiary: '#E65100'
      },
      dark: {
        work: '#F57C00',
        break: '#FFB74D',
        longBreak: '#E65100',
        background: '#1A0F00',
        text: '#FFB74D',
        surface: '#E65100',
        accent: '#F57C00',
        primary: '#F57C00',
        secondary: '#FFB74D',
        tertiary: '#E65100'
      }
    }
  }
}; 