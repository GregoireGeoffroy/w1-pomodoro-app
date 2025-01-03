import React from 'react';
import CircularProgressIndicator from 'react-native-circular-progress-indicator';
import { useColorScheme } from 'react-native';

interface CircularProgressProps {
  progress: number;
  time: string;
  color: string;
  size?: number;
}

export function CircularProgress({ 
  progress, 
  time, 
  color, 
  size = 300 
}: CircularProgressProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <CircularProgressIndicator
      value={progress}
      radius={size / 2}
      duration={800}
      progressValueColor={isDark ? '#fff' : '#000'}
      activeStrokeColor={color}
      inActiveStrokeColor={isDark ? '#374151' : '#E5E7EB'}
      inActiveStrokeOpacity={0.3}
      activeStrokeWidth={15}
      inActiveStrokeWidth={15}
      title={time}
      titleColor={isDark ? '#fff' : '#000'}
      titleStyle={{ 
        fontSize: 48,
        fontWeight: '700',
      }}
      showProgressValue={false}
    />
  );
}

export default CircularProgress; 