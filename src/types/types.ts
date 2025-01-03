export type TimerMode = 'work' | 'break' | 'longBreak';

export interface Sound {
  [key: string]: Expo.Audio.Sound;
}

export interface TimerProps {
  style?: any; // Consider making this more specific with ViewStyle
}

export type SoundKey = 'bell' | 'digital' | 'chime' | 'marimba' | 'fallback';

export const SOUNDS: Record<SoundKey, any> = {
  bell: require('../../assets/sounds/bell.mp3'),
  digital: require('../../assets/sounds/digital.mp3'),
  chime: require('../../assets/sounds/chime.mp3'),
  marimba: require('../../assets/sounds/marimba.mp3'),
  fallback: require('../../assets/sounds/bell.mp3'),
} as const; 