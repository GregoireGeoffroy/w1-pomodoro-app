import React from 'react';
import { View, Text, StyleProp, TextStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useThemeColors } from '@/hooks/useThemeColors';

interface CircularProgressProps {
  progress: number;
  time: string;
  color: string;
  size?: number;
  strokeWidth?: number;
  timeStyle?: StyleProp<TextStyle>;
}

export function CircularProgress({
  progress,
  time,
  color,
  size = 280,
  strokeWidth = 12,
  timeStyle,
}: CircularProgressProps) {
  const colors = useThemeColors();
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressStroke = ((100 - progress) / 100) * circumference;

  const defaultTimeStyle: StyleProp<TextStyle> = {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  };

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.surface}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={progressStroke}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <View className="absolute">
        <Text
          style={[defaultTimeStyle, timeStyle]}
        >
          {time}
        </Text>
      </View>
    </View>
  );
}

export default CircularProgress; 