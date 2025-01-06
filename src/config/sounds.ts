import { Audio } from 'expo-av';
import { Alert } from 'react-native';

async function requestAudioPermissions() {
  try {
    const { granted } = await Audio.getPermissionsAsync();
    if (!granted) {
      const { granted: newGranted } = await Audio.requestPermissionsAsync();
      return newGranted;
    }
    return granted;
  } catch (error) {
    console.error('Error requesting audio permissions:', error);
    return false;
  }
}

async function initializeAudio() {
  try {
    const hasPermission = await requestAudioPermissions();
    
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'This app needs microphone permission to play sounds.',
        [{ text: 'OK' }]
      );
      return false;
    }

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      allowsRecordingIOS: false,
    });

    return true;
  } catch (error) {
    console.error('Error initializing audio:', error);
    return false;
  }
}

export const SOUNDS = {
  'Gentle Alarm': require('@/assets/sounds/alarm_gentle.wav'),
  'Classic Bell': require('@/assets/sounds/ringtone_minimal.wav'),
} as const;

export type SoundOption = keyof typeof SOUNDS;

export { initializeAudio }; 