import { Stack } from 'expo-router';
import { TimerProvider } from '@/context/TimerContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import '../global.css';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <SafeAreaProvider>
      <TimerProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: colorScheme === 'dark' ? '#1F2937' : 'white',
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </TimerProvider>
    </SafeAreaProvider>
  );
}
