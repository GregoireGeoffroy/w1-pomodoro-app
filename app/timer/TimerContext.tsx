import React, { createContext, useContext, useState } from 'react';

const DEV_MODE = true;

interface TimerSettings {
  // Durations
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  
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
  
  soundChoice: string;
}

const DEFAULT_SETTINGS: TimerSettings = {
  // Durations
  workDuration: DEV_MODE ? 20/60 : 25,
  breakDuration: DEV_MODE ? 10/60 : 5,
  longBreakDuration: DEV_MODE ? 15/60 : 15,
  
  // Auto Start Options
  autoStartPomodoro: false,
  autoStartBreak: false,
  
  // Sound Settings
  soundEnabled: true,
  pomodoroEndSound: 'bell',
  breakEndSound: 'chime',
  
  // Haptic Settings
  vibrationEnabled: true,
  vibrationDuration: 10,
  
  soundChoice: 'bell',
};

const TimerContext = createContext<{
  settings: TimerSettings;
  updateSettings: (key: string, value: any) => void;
  resetToDefaults: () => void;
}>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
  resetToDefaults: () => {},
});

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const updateSettings = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <TimerContext.Provider value={{ settings, updateSettings, resetToDefaults }}>
      {children}
    </TimerContext.Provider>
  );
}

export const useTimerSettings = () => useContext(TimerContext);

export default TimerProvider; 