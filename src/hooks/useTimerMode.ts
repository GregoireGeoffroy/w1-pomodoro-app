import { useState, useCallback } from 'react';
import { TimerMode } from '@/types';
import { THEME_COLORS } from '@/constants';

export function useTimerMode() {
  const [mode, setMode] = useState<TimerMode>('work');

  const toggleMode = useCallback(() => {
    setMode(currentMode => currentMode === 'work' ? 'break' : 'work');
  }, []);

  const getModeColor = useCallback((currentMode: TimerMode): string => {
    return currentMode === 'work' ? THEME_COLORS.work : THEME_COLORS.break;
  }, []);

  return {
    mode,
    toggleMode,
    getModeColor,
  };
} 