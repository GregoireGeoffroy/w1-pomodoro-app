import React from 'react';
import { Pressable, Text, StyleProp, ViewStyle } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  variant: 'primary' | 'secondary' | 'tertiary';
  label: string;
  style?: StyleProp<ViewStyle>;
}

export function Button({ onPress, variant, label, style }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`
        py-3 rounded-2xl border-[1.5px] mb-3
        ${variant === 'primary' 
          ? 'bg-primary border-primary' 
          : 'bg-transparent border-primary'}
      `}
      style={({ pressed }) => [
        { opacity: pressed ? 0.8 : 1 },
        style
      ]}
    >
      <Text
        className={`
          text-base font-semibold text-center
          ${variant === 'primary' ? 'text-white' : 'text-primary'}
        `}
      >
        {label}
      </Text>
    </Pressable>
  );
} 