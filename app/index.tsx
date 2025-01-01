import { StyleSheet, View, Text, Pressable, Animated, Platform } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

// Sound reference
let soundObject: Audio.Sound | null = null;

// Colors for different modes
const colors = {
  work: {
    background: '#FFF5F5',
    button: '#FF9B9B',
    text: '#FF5252'
  },
  break: {
    background: '#F0F7FF',
    button: '#7EB6FF',
    text: '#2B7FFF'
  }
};

function Index() {
  const WORK_TIME = 20; // 20 seconds for testing
  const BREAK_TIME = 10; // 10 seconds for testing

  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('Work');
  
  // Animation values
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [currentColor, setCurrentColor] = useState(colors.work);

  // Load sound effect
  useEffect(() => {
    const initSound = async () => {
      try {
        soundObject = new Audio.Sound();
        await soundObject.loadAsync(require('../assets/timer-end.mp3'));
      } catch (error) {
        console.log('Error loading sound', error);
      }
    };

    initSound();

    return () => {
      if (soundObject) {
        soundObject.unloadAsync();
        soundObject = null;
      }
    };
  }, []);

  // Play sound and vibrate when timer ends
  const playTimerEndEffects = async () => {
    try {
      if (soundObject) {
        await soundObject.replayAsync();
      }
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.log('Error playing sound', error);
    }
  };

  // Update colors when mode changes
  useEffect(() => {
    setCurrentColor(mode === 'Work' ? colors.work : colors.break);
  }, [mode]);

  // Update progress animation when timeLeft changes
  useEffect(() => {
    const totalTime = mode === 'Work' ? WORK_TIME : BREAK_TIME;
    const progress = 1 - (timeLeft / totalTime);
    
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [timeLeft, mode]);

  const rotateProgress = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      playTimerEndEffects();
      if (mode === 'Work') {
        setMode('Break');
        setTimeLeft(BREAK_TIME);
      } else {
        setMode('Work');
        setTimeLeft(WORK_TIME);
      }
      setIsRunning(false);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, timeLeft, mode]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColor.background }]}>
      <View style={styles.content}>
        <Text style={[styles.modeText, { color: currentColor.text }]}>{mode}</Text>
        
        <View style={styles.timerContainer}>
          <View style={[styles.progressBackground, { borderColor: `${currentColor.button}40` }]}>
            <Animated.View 
              style={[
                styles.progressForeground,
                { 
                  backgroundColor: currentColor.text,
                  transform: [{ rotate: rotateProgress }]
                }
              ]} 
            />
            <View style={styles.progressMask} />
          </View>
          <View style={styles.timerTextContainer}>
            <Text style={[styles.timerText, { color: currentColor.text }]}>
              {formatTime(timeLeft)}
            </Text>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Pressable 
            style={({ pressed }) => [
              styles.button,
              { 
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }]
              },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setIsRunning(!isRunning);
            }}>
            <Text style={[styles.buttonText, { color: currentColor.text }]}>
              {isRunning ? 'Pause' : 'Start'}
            </Text>
          </Pressable>
          <Pressable 
            style={({ pressed }) => [
              styles.button,
              { 
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }]
              },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setIsRunning(false);
              setTimeLeft(mode === 'Work' ? WORK_TIME : BREAK_TIME);
            }}>
            <Text style={[styles.buttonText, { color: currentColor.text }]}>Reset</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modeText: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: '600',
  },
  timerContainer: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 150,
    borderWidth: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressForeground: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    borderRadius: 150,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    left: '50%',
    transform: [{ rotate: '0deg' }],
  },
  progressMask: {
    position: 'absolute',
    width: '92%',
    height: '92%',
    borderRadius: 150,
    backgroundColor: 'white',
  },
  timerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 40,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
  },
});
