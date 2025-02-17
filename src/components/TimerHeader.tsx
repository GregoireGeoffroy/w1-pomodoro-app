import React from 'react';
import { Text } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TimerMode } from '@/types';

interface TimerHeaderProps {
  mode: TimerMode;
  shouldTakeLongBreak: () => boolean;
}

export function TimerHeader({ mode, shouldTakeLongBreak }: TimerHeaderProps) {
  const colors = useThemeColors();

  return (
    <Text style={{ 
      fontSize: 30, 
      fontWeight: 'bold', 
      marginBottom: 8,
      color: colors.text 
    }}>
      {mode === 'work' ? 'Focus' : 
        (shouldTakeLongBreak() ? 'Long Break' : 'Short Break')}
    </Text>
  );
} 