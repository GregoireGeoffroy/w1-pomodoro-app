import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircularProgress } from '@/components/CircularProgress';
import { Button } from '@/components/Button';
import { TimerHeader } from '@/components/TimerHeader';
import { TimerStats } from '@/components/TimerStats';
import { useTimer } from '@/hooks/useTimer';
import { useTimerSettings } from '@/context/TimerContext';
import { useThemeColors } from '@/hooks/useThemeColors';
import { formatTime } from '@/utils/timeUtils';

export default function TimerScreen() {
  const colors = useThemeColors();
  const { settings } = useTimerSettings();
  const {
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
  } = useTimer();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView className="flex-1 items-center justify-center">
        <TimerHeader mode={mode} shouldTakeLongBreak={shouldTakeLongBreak} />
        
        <View className="my-8">
          <View style={{ position: 'relative' }}>
            <CircularProgress
              progress={progress}
              time={formatTime(timeLeft)}
              color={getTimerColor()}
              strokeWidth={6}
              timeStyle={{ 
                fontSize: 60,
                fontWeight: '300',
              }}
            />
            {isRunning === false && timeLeft !== (mode === 'work' ? settings.workDuration * 60 : getBreakDuration() * 60) && (
              <Text style={{ 
                textAlign: 'center',
                color: colors.text,
                fontSize: 16,
                position: 'absolute',
                bottom: '30%',
                width: '100%',
                opacity: 0.8,
              }}>
                Paused
              </Text>
            )}
          </View>
        </View>

        <View className="mt-8 h-32 items-center">
          {!isRunning && timeLeft === (mode === 'work' ? settings.workDuration * 60 : getBreakDuration() * 60) && (
            <Button
              onPress={() => setIsRunning(true)}
              variant="primary"
              label="Start"
            />
          )}

          {isRunning && (
            <Button
              onPress={() => setIsRunning(false)}
              variant="secondary"
              label="Pause"
            />
          )}

          {!isRunning && timeLeft !== (mode === 'work' ? settings.workDuration * 60 : getBreakDuration() * 60) && (
            <>
              <Button
                onPress={() => setIsRunning(true)}
                variant="primary"
                label="Continue"
              />
              {mode === 'work' && (
                <Button
                  onPress={() => {
                    setTimeLeft(mode === 'work' ? settings.workDuration * 60 : getBreakDuration() * 60);
                    setProgress(0);
                  }}
                  variant="secondary"
                  label="End"
                />
              )}
            </>
          )}

          {mode === 'break' && !isRunning && (
            <Button
              onPress={() => {
                toggleMode();
                setIsRunning(false);
              }}
              variant="secondary"
              label="Skip"
            />
          )}
        </View>

        <View className="absolute bottom-16">
          <TimerStats sessions={sessions} workDuration={settings.workDuration} />
        </View>

      </SafeAreaView>
    </View>
  );
} 