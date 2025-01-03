import { Ionicons } from '@expo/vector-icons';
import { IconProps } from '@expo/vector-icons/build/createIconSet';

interface IconComponentProps {
  color: string;
  size?: number;
}

export function TimerIcon({ color, size = 24 }: IconComponentProps) {
  return <Ionicons name="timer-outline" size={size} color={color} />;
}

export function SettingsIcon({ color, size = 24 }: IconComponentProps) {
  return <Ionicons name="settings-outline" size={size} color={color} />;
}

// Add default export to satisfy Expo Router
export default function Icons() {
  return null;
} 