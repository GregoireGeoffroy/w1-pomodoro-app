import { useState, useCallback, useEffect } from 'react';
import { Audio } from 'expo-av';
import { AudioFiles, Sound, SoundKey } from '@/types';
import { SOUNDS } from '@/constants';

export function useAudioManager() {
  const [sounds, setSounds] = useState<Sound>({});
  const [soundLoadingError, setSoundLoadingError] = useState<string>('');

  const setupAudio = useCallback(async () => {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });
  }, []);

  const loadSound = useCallback(async (key: string, file: any): Promise<Audio.Sound | null> => {
    try {
      const { sound } = await Audio.Sound.createAsync(file, { volume: 1.0 });
      return sound;
    } catch (error) {
      console.error(`Error loading sound ${key}:`, error);
      return null;
    }
  }, []);

  // Add useEffect to initialize audio when component mounts
  useEffect(() => {
    const initAudio = async () => {
      try {
        await setupAudio();
        const loadedSounds: Sound = {};
        
        for (const [key, file] of Object.entries(SOUNDS)) {
          const sound = await loadSound(key, file);
          if (sound) {
            loadedSounds[key] = sound;
          }
        }

        setSounds(loadedSounds);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error loading sounds';
        setSoundLoadingError(errorMessage);
      }
    };

    initAudio();

    // Cleanup sounds on unmount
    return () => {
      Object.values(sounds).forEach(sound => {
        try {
          sound.unloadAsync();
        } catch (err) {
          console.error('Error unloading sound:', err);
        }
      });
    };
  }, [setupAudio, loadSound]);

  return {
    sounds,
    soundLoadingError,
  };
} 