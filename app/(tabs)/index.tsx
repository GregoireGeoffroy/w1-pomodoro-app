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
import { useStatistics } from '@/context/StatisticsContext'
import { useThemeColors } from '@/hooks/useThemeColors';

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
  const { addCompletedPomodoro } = useStatistics()
  const colors = useThemeColors();

  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [progress, setProgress] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [completedPomos, setCompletedPomos] = useState(0);

  const shouldTakeLongBreak = useCallback(() => {
    return completedPomos > 0 && completedPomos % settings.pomosUntilLongBreak === 0;
  }, [completedPomos, settings.pomosUntilLongBreak]);

  const getBreakDuration = useCallback(() => {
    return shouldTakeLongBreak() ? settings.longBreakDuration : settings.breakDuration;
  }, [shouldTakeLongBreak, settings.longBreakDuration, settings.breakDuration]);

  const getTimerColor = useCallback(() => {
    if (mode === 'work') return colors.work;
    return shouldTakeLongBreak() ? colors.longBreak : colors.break;
  }, [mode, colors, shouldTakeLongBreak]);

  const timerColor = getTimerColor();

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
      addCompletedPomodoro(settings.workDuration)
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
    getBreakDuration,
    addCompletedPomodoro
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView className="flex-1 items-center justify-center">
        <View className="items-center space-y-4">
          <Text style={{ 
            fontSize: 30, 
            fontWeight: 'bold', 
            marginBottom: 8,
            color: colors.text 
          }}>
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
            style={({ pressed }) => ({
              backgroundColor: isRunning ? colors.work : colors.accent,
              opacity: pressed ? 0.8 : 1,
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 9999,
              elevation: 4,
            })}
          >
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
              {isRunning ? 'Pause' : 'Start'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setTimeLeft(mode === 'work' ? 
                settings.workDuration * 60 : 
                getBreakDuration() * 60
              );
              setProgress(0);
              setIsRunning(false);
            }}
            style={({ pressed }) => ({
              backgroundColor: colors.surface,
              opacity: pressed ? 0.8 : 1,
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 9999,
              elevation: 4,
            })}
          >
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>
              Reset
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              toggleMode();
              setIsRunning(false);
            }}
            style={({ pressed }) => ({
              backgroundColor: colors.surface,
              opacity: pressed ? 0.8 : 1,
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 9999,
              elevation: 4,
            })}
          >
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>
              Skip
            </Text>
          </Pressable>
        </View>

        <View className="mt-8 items-center">
          <Text style={{ fontSize: 16, color: colors.text }}>
            Today: {sessions} Pomos - {formatTotalFocusTime(sessions, settings.workDuration)}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
} 