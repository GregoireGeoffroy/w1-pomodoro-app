import { useState, useEffect, useCallback } from 'react';
import { useTimerSettings } from '@/context/TimerContext';
import { useTimerMode } from '@/hooks/useTimerMode';
import { useHaptics } from '@/hooks/useHaptics';
import { useAudioManager } from '@/hooks/useAudioManager';
import { useStatistics } from '@/context/StatisticsContext';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TimerMode } from '@/types';

export function useTimer() {
  const { settings } = useTimerSettings();
  const { mode, toggleMode } = useTimerMode();
  const { sounds } = useAudioManager();
  const { vibrate } = useHaptics();
  const { addCompletedPomodoro } = useStatistics();
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

  // Handle timer completion and mode switching
  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    
    if (mode === 'work') {
      setSessions(prev => prev + 1);
      setCompletedPomos(prev => prev + 1);
      addCompletedPomodoro(settings.workDuration);
    }

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

    // Switch modes and reset timer
    toggleMode();
    const nextDuration = mode === 'work' ? 
      getBreakDuration() * 60 : 
      settings.workDuration * 60;
    
    setTimeLeft(nextDuration);
    setProgress(0);

    // Handle auto-start
    const shouldAutoStart = mode === 'work' ? 
      settings.autoStartBreak : 
      settings.autoStartPomodoro;

    if (shouldAutoStart) {
      setTimeout(() => {
        setIsRunning(true);
      }, 0);
    }
  }, [
    mode,
    settings,
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
  }, [isRunning, timeLeft, mode, settings, getBreakDuration, handleTimerComplete]);

  // Reset timer when duration settings change
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

  return {
    isRunning,
    setIsRunning,
    timeLeft,
    setTimeLeft,
    progress,
    setProgress,
    sessions,
    mode,
    toggleMode,
    shouldTakeLongBreak,
    getBreakDuration,
    getTimerColor,
  };
} 