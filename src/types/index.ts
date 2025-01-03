import { TIMER_CONSTANTS, HAPTIC_TYPES } from '@/constants';

export type TimerMode = 'work' | 'break' | 'longBreak';

export type TimerSettings = {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
};

export type HapticType = typeof HAPTIC_TYPES[keyof typeof HAPTIC_TYPES];

export interface AudioFiles {
  start: string;
  pause: string;
  reset: string;
  complete: string;
} 