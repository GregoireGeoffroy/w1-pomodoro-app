import React from 'react';
import { Pressable, Text, StyleProp, ViewStyle } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface ButtonProps {
  onPress: () => void;
  variant: 'primary' | 'secondary';
  label: string;
  style?: StyleProp<ViewStyle>;
}

export function Button({ onPress, variant, label, style }: ButtonProps) {
  const colors = useThemeColors();
  
  return (
    <Pressable
      onPress={onPress}
      className={`
        py-3 
        rounded-3xl 
        border-[1.5px] 
        mb-3 
        w-[150px] 
        items-center
        active:opacity-80
      `}
      style={[
        {
          backgroundColor: variant === 'primary' ? colors.primary : 'transparent',
          borderColor: variant === 'primary' ? colors.primary : colors.primary
        },
        style
      ]}
    >
      <Text
        className="text-base font-semibold text-center"
        style={{
          color: variant === 'primary' ? 'white' : colors.primary
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
} 