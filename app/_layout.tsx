import { Stack } from 'expo-router';
import { TimerProvider } from '@/context/TimerContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import '../global.css';
import { StatisticsProvider } from '@/context/StatisticsContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';
import { PremiumProvider } from '@/context/PremiumContext';
import { ThemeProvider } from '@/context/ThemeContext';

function RootLayoutNav() {
  const { isLoading, session } = useAuth();
  const colorScheme = useColorScheme();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1F2937' : 'white',
        },
      }}
    >
      {session ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <TimerProvider>
          <StatisticsProvider>
            <PremiumProvider>
              <ThemeProvider>
                <RootLayoutNav />
              </ThemeProvider>
            </PremiumProvider>
          </StatisticsProvider>
        </TimerProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
