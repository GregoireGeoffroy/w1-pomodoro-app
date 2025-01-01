import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useState } from 'react';

export default function HomeScreen() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('Work');

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.modeText}>{mode}</Text>
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      
      <View style={styles.buttonContainer}>
        <Pressable 
          style={styles.button}
          onPress={() => setIsRunning(!isRunning)}>
          <Text style={styles.buttonText}>
            {isRunning ? 'Pause' : 'Start'}
          </Text>
        </Pressable>
        <Pressable 
          style={styles.button}
          onPress={() => {
            setIsRunning(false);
            setTimeLeft(25 * 60);
          }}>
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  modeText: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: '600',
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    backgroundColor: '#A1CEDC',
    borderRadius: 10,
    padding: 15,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
}); 