import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircularProgress } from '@/components/CircularProgress';
import { useTimerSettings } from '@/context/TimerContext';
import { useTimerMode } from '@/hooks/useTimerMode';
import { useHaptics } from '@/hooks/useHaptics';
import { useAudioManager } from '@/hooks/useAudioManager';
import { THEME_COLORS } from '@/constants';

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function TimerScreen() {
  const { settings } = useTimerSettings();
  const { mode, toggleMode } = useTimerMode();
  const { sounds } = useAudioManager();
  const { vibrate } = useHaptics();

  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [progress, setProgress] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [completedPomos, setCompletedPomos] = useState(0);

  const timerColor = mode === 'work' ? 
    THEME_COLORS.work : 
    THEME_COLORS.break;

  // Helper function to determine if it's time for a long break
  const shouldTakeLongBreak = useCallback(() => {
    return completedPomos > 0 && completedPomos % settings.pomosUntilLongBreak === 0;
  }, [completedPomos, settings.pomosUntilLongBreak]);

  // Helper to get current break duration
  const getBreakDuration = useCallback(() => {
    return shouldTakeLongBreak() ? settings.longBreakDuration : settings.breakDuration;
  }, [shouldTakeLongBreak, settings.longBreakDuration, settings.breakDuration]);

  // Handle timer completion and mode switching
  const handleTimerComplete = useCallback(() => {
    // First, stop the current timer
    setIsRunning(false);
    
    // Determine the next mode before we switch
    const nextMode = mode === 'work' ? 'break' : 'work';
    
    // Update session counts before mode switch
    if (mode === 'work') {
      setSessions(prev => prev + 1);
      setCompletedPomos(prev => prev + 1);
    }

    // Calculate next duration before mode switch
    const nextDuration = mode === 'work' ? 
      getBreakDuration() * 60 : 
      settings.workDuration * 60;

    // Play sound and vibrate
    try {
      if (settings.soundEnabled) {
        const sound = sounds[settings.soundChoice];
        if (sound) {
          sound.replayAsync();
        }
      }
      if (settings.vibrationEnabled) {
        vibrate();
      }
    } catch (error) {
      console.error('Error playing sound or vibrating:', error);
    }

    // Switch modes
    toggleMode();
    
    // Reset timer with new duration
    setTimeLeft(nextDuration);
    setProgress(0);

    // Handle auto-start based on current mode (before switch)
    const shouldAutoStart = mode === 'work' ? 
      settings.autoStartBreak : 
      settings.autoStartPomodoro;

    // Use setTimeout to ensure state updates have completed
    if (shouldAutoStart) {
      setTimeout(() => {
        setIsRunning(true);
      }, 0);
    }
  }, [
    mode, 
    settings.autoStartBreak, 
    settings.autoStartPomodoro, 
    settings.soundEnabled, 
    settings.vibrationEnabled,
    settings.workDuration,
    settings.breakDuration,
    settings.longBreakDuration,
    toggleMode, 
    sounds, 
    vibrate, 
    getBreakDuration
  ]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          const totalTime = mode === 'work' ? 
            settings.workDuration * 60 : 
            getBreakDuration() * 60;
          setProgress(100 - ((newTime / totalTime) * 100));
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, handleTimerComplete]);

  // Reset timer only when duration-related settings change
  useEffect(() => {
    const duration = mode === 'work' ? 
      settings.workDuration : 
      getBreakDuration();
    setTimeLeft(duration * 60);
    setProgress(0);
    setIsRunning(false);
  }, [
    mode, 
    settings.workDuration, 
    settings.breakDuration, 
    settings.longBreakDuration, 
    settings.pomosUntilLongBreak,
    getBreakDuration
  ]);

  // Add new helper function to calculate total focus time
  function formatTotalFocusTime(completedSessions: number, workDuration: number): string {
    const totalMinutes = completedSessions * workDuration;
    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = Math.round((totalMinutes % 60) / 5) * 5; // Round to nearest 5 minutes
    
    if (hours === 0) {
      if (remainingMinutes === 0) return '0 minutes';
      return `${remainingMinutes} minutes`;
    }
    
    if (remainingMinutes === 0) {
      return `${hours} hr${hours > 1 ? 's' : ''}`;
    }
    
    return `${hours} hr${hours > 1 ? 's' : ''}, ${remainingMinutes} minutes`;
  }

  return (
    <BlurView intensity={100} tint="light" className="flex-1">
      <SafeAreaView className="flex-1 items-center justify-center bg-white/30 dark:bg-gray-900/30">
        <View className="items-center space-y-4">
          <Text className="text-3xl font-bold mb-2 dark:text-white">
            {mode === 'work' ? 'Focus' : 
              (shouldTakeLongBreak() ? 'Long Break' : 'Short Break')}
          </Text>
        </View>
        
        <View className="my-8">
          <CircularProgress
            progress={progress}
            time={formatTime(timeLeft)}
            color={timerColor}
          />
        </View>

        <View className="flex-row space-x-4 mt-8">
          <Pressable
            onPress={() => setIsRunning(!isRunning)}
            className={`
              px-8 py-4 rounded-full shadow-lg
              ${isRunning ? 'bg-red-500 active:bg-red-600' : 'bg-blue-500 active:bg-blue-600'}
            `}
            style={{ elevation: 4 }}
          >
            <Text className="text-white text-lg font-semibold">
              {isRunning ? 'Pause' : 'Start'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setTimeLeft(mode === 'work' ? settings.workDuration * 60 : settings.breakDuration * 60);
              setProgress(0);
              setIsRunning(false);
            }}
            className="px-8 py-4 bg-yellow-500 active:bg-yellow-600 rounded-full shadow-lg"
            style={{ elevation: 4 }}
          >
            <Text className="text-white text-lg font-semibold">
              Reset
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              toggleMode();
              setIsRunning(false);
            }}
            className="px-8 py-4 bg-gray-500 active:bg-gray-600 rounded-full shadow-lg"
            style={{ elevation: 4 }}
          >
            <Text className="text-white text-lg font-semibold">
              Skip
            </Text>
          </Pressable>
        </View>

        <View className="mt-8 items-center">
          <Text className="text-base text-gray-600 dark:text-gray-300">
            Today: {sessions} Pomos - {formatTotalFocusTime(sessions, settings.workDuration)}
          </Text>
        </View>
      </SafeAreaView>
    </BlurView>
  );
} 