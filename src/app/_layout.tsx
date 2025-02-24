import { Stack } from 'expo-router';
import { TimerProvider } from '@/context/TimerContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import '../../global.css';
import { StatisticsProvider } from '@/context/StatisticsContext';
import LoadingScreen from '@/components/LoadingScreen';
import { ThemeProvider } from '@/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
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
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <TimerProvider>
        <StatisticsProvider>
          <ThemeProvider>
            <RootLayoutNav />
          </ThemeProvider>
        </StatisticsProvider>
      </TimerProvider>
    </SafeAreaProvider>
  );
}
