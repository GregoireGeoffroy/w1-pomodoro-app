import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SoundOption, initializeAudio } from '@/config/sounds';

const DEV_MODE = true;

interface TimerSettings {
  // Durations
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  pomosUntilLongBreak: number;
  
  // Auto Start Options
  autoStartPomodoro: boolean;
  autoStartBreak: boolean;
  
  // Sound Settings
  soundEnabled: boolean;
  pomodoroEndSound: string;
  breakEndSound: string;
  
  // Haptic Settings
  vibrationEnabled: boolean;
  vibrationDuration: number; // in milliseconds
  
  soundChoice: SoundOption;
}

const DEFAULT_SETTINGS: TimerSettings = {
  // Durations
  workDuration: DEV_MODE ? 5/60 : 25,
  breakDuration: DEV_MODE ? 2/60 : 5,
  longBreakDuration: DEV_MODE ? 3/60 : 15,
  pomosUntilLongBreak: 4,
  
  // Auto Start Options
  autoStartPomodoro: false,
  autoStartBreak: false,
  
  // Sound Settings
  soundEnabled: true,
  pomodoroEndSound: 'bell',
  breakEndSound: 'chime',
  
  // Haptic Settings
  vibrationEnabled: true,
  vibrationDuration: 10000, // 10 seconds in milliseconds
  
  soundChoice: 'Gentle Alarm',
};

const TimerContext = createContext<{
  settings: TimerSettings;
  updateSettings: (key: string, value: any) => void;
  resetToDefaults: () => void;
  isDark: boolean;
}>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
  resetToDefaults: () => {},
  isDark: false,
});

export function TimerProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    const setupAudio = async () => {
      const isAudioInitialized = await initializeAudio();
      if (!isAudioInitialized) {
        console.warn('Audio initialization failed');
      }
    };

    setupAudio();
  }, []);

  const contextValue = {
    settings,
    updateSettings: (key: string, value: any) => {
      setSettings(prev => ({ ...prev, [key]: value }));
    },
    resetToDefaults: () => setSettings(DEFAULT_SETTINGS),
    isDark,
  };

  return (
    <TimerContext.Provider value={contextValue}>
      {children}
    </TimerContext.Provider>
  );
}

export const useTimerSettings = () => useContext(TimerContext);

export default TimerProvider; 