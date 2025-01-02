import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import CircularProgress from './CircularProgress';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { useTimerSettings } from './TimerContext';

interface TimerProps {
  style?: any;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Alternative way to define sounds
const SOUNDS = {
  bell: require('../../assets/sounds/bell.mp3'),
  digital: require('../../assets/sounds/digital.mp3'),
  chime: require('../../assets/sounds/chime.mp3'),
  marimba: require('../../assets/sounds/marimba.mp3'),
  fallback: require('../../assets/sounds/beep.mp3'),
} as const;

console.log('Available sounds:', Object.keys(SOUNDS));

export default function Timer({ style }: TimerProps) {
  const { settings } = useTimerSettings();
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break' | 'longBreak'>('work');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [initialDuration, setInitialDuration] = useState(settings.workDuration * 60);
  const [sounds, setSounds] = useState<{ [key: string]: Audio.Sound }>({});
  const [soundLoadingError, setSoundLoadingError] = useState<string | null>(null);

  // Load sounds
  useEffect(() => {
    const loadSounds = async () => {
      const loadedSounds: { [key: string]: Audio.Sound } = {};
      let loadingError = null;

      try {
        // Configure audio mode first
        await Audio.setAudioModeAsync({
          playsInSilentMode: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        // Then request permissions
        const permission = await Audio.requestPermissionsAsync();
        if (!permission.granted) {
          throw new Error('Audio permissions not granted');
        }

        // Try to load each sound
        for (const [key, file] of Object.entries(SOUNDS)) {
          try {
            const { sound } = await Audio.Sound.createAsync(
              file,
              { volume: 1.0 },
              (status) => {
                if (status.error) {
                  console.error(`Error playing ${key}:`, status.error);
                }
              }
            );
            loadedSounds[key] = sound;
            console.log(`Loaded sound: ${key}`); // Debug log
          } catch (err) {
            console.error(`Error loading ${key}:`, err);
            // Try loading fallback if main sound fails
            if (key !== 'fallback') {
              try {
                const { sound } = await Audio.Sound.createAsync(SOUNDS.fallback);
                loadedSounds[key] = sound;
                console.log(`Loaded fallback for: ${key}`); // Debug log
              } catch (fallbackErr) {
                console.error('Error loading fallback sound:', fallbackErr);
              }
            }
          }
        }

        if (Object.keys(loadedSounds).length === 0) {
          throw new Error('No sounds could be loaded');
        }

        setSounds(loadedSounds);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error loading sounds';
        console.error('Sound loading error:', errorMessage);
        setSoundLoadingError(errorMessage);
      }
    };

    loadSounds();

    return () => {
      Object.values(sounds).forEach(sound => {
        try {
          sound.unloadAsync();
        } catch (err) {
          console.error('Error unloading sound:', err);
        }
      });
    };
  }, []);

  // Get current duration based on mode and settings
  const getDuration = useCallback((currentMode: typeof mode) => {
    switch (currentMode) {
      case 'work':
        return settings.workDuration * 60;
      case 'break':
        return settings.breakDuration * 60;
      case 'longBreak':
        return settings.longBreakDuration * 60;
      default:
        return settings.workDuration * 60;
    }
  }, [settings]);

  // Update timer when settings change
  useEffect(() => {
    const newDuration = getDuration(mode);
    setInitialDuration(newDuration);
    if (!isRunning) {
      setTimeLeft(newDuration);
    }
  }, [settings, mode]);

  // Update handleTimerComplete to handle auto-start and different sounds
  const handleTimerComplete = useCallback(() => {
    if (settings.vibrationEnabled) {
      // Custom vibration duration
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Note: Expo Haptics doesn't support custom durations directly
      // For custom durations, we'd need to use native modules
    }
    
    if (settings.soundEnabled) {
      const soundToPlay = mode === 'work' ? 
        settings.pomodoroEndSound : 
        settings.breakEndSound;
      
      if (sounds[soundToPlay]) {
        sounds[soundToPlay].replayAsync();
      }
    }
    
    if (mode === 'work') {
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);
      
      if (newSessions % 4 === 0) {
        setMode('longBreak');
        const duration = getDuration('longBreak');
        setTimeLeft(duration);
        setInitialDuration(duration);
        // Auto-start break if enabled
        setIsRunning(settings.autoStartBreak);
      } else {
        setMode('break');
        const duration = getDuration('break');
        setTimeLeft(duration);
        setInitialDuration(duration);
        // Auto-start break if enabled
        setIsRunning(settings.autoStartBreak);
      }
    } else {
      setMode('work');
      const duration = getDuration('work');
      setTimeLeft(duration);
      setInitialDuration(duration);
      // Auto-start pomodoro if enabled
      setIsRunning(settings.autoStartPomodoro);
    }
  }, [mode, sessionsCompleted, settings, sounds, getDuration]);

  // Update skipToNext to use settings
  const skipToNext = () => {
    if (settings.vibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setIsRunning(false);
    
    if (mode === 'work') {
      if ((sessionsCompleted + 1) % 4 === 0) {
        setMode('longBreak');
        const duration = getDuration('longBreak');
        setTimeLeft(duration);
        setInitialDuration(duration);
      } else {
        setMode('break');
        const duration = getDuration('break');
        setTimeLeft(duration);
        setInitialDuration(duration);
      }
    } else {
      setMode('work');
      const duration = getDuration('work');
      setTimeLeft(duration);
      setInitialDuration(duration);
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case 'work':
        return '#FF6B6B';
      case 'break':
        return '#4ECDC4';
      case 'longBreak':
        return '#95E1D3';
      default:
        return '#FF6B6B';
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'work':
        return 'Work';
      case 'break':
        return 'Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Work';
    }
  };

  // Add this useEffect for the countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, handleTimerComplete]);

  // Add error handling to sound playback
  const playSound = useCallback(async (soundKey: string) => {
    try {
      if (!sounds[soundKey]) {
        throw new Error(`Sound ${soundKey} not loaded`);
      }
      await sounds[soundKey].replayAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
      // Optionally show error to user
    }
  }, [sounds]);

  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={20} style={styles.blur}>
        <Text style={styles.sessionsText}>
          Sessions: {sessionsCompleted}
        </Text>
        
        <CircularProgress
          progress={timeLeft / initialDuration}
          time={formatTime(timeLeft)}
          color={getModeColor()}
        />
        
        <Text style={styles.modeLabel}>{getModeLabel()}</Text>
        
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, { backgroundColor: getModeColor() }]}
            onPress={() => setIsRunning(!isRunning)}
          >
            <Text style={styles.buttonText}>
              {isRunning ? 'Pause' : 'Start'}
            </Text>
          </Pressable>
          
          <Pressable
            style={[styles.button, { backgroundColor: getModeColor() }]}
            onPress={() => {
              setIsRunning(false);
              setTimeLeft(initialDuration);
            }}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </Pressable>
          
          <Pressable
            style={[styles.button, { backgroundColor: getModeColor() }]}
            onPress={skipToNext}
          >
            <Text style={styles.buttonText}>Skip</Text>
          </Pressable>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sessionsText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modeLabel: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 20,
    color: '#333',
  },
  blur: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
}); 