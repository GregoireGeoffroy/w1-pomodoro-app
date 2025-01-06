export const SOUNDS = {
  'Gentle Alarm': require('@/assets/sounds/alarm_gentle.wav'),
  'Classic Bell': require('@/assets/sounds/ringtone_minimal.wav'),
} as const;

export type SoundOption = keyof typeof SOUNDS; 