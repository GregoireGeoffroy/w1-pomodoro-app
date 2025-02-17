import React from 'react';
import { Text } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { formatTotalFocusTime } from '@/utils/timeUtils';

interface TimerStatsProps {
  sessions: number;
  workDuration: number;
}

export function TimerStats({ sessions, workDuration }: TimerStatsProps) {
  const colors = useThemeColors();

  return (
    <Text style={{ fontSize: 16, color: colors.text }}>
      Today: {sessions} Pomos - {formatTotalFocusTime(sessions, workDuration)}
    </Text>
  );
} 