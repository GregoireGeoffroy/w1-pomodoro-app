import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        tabBarStyle: {
          backgroundColor: colors.background,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="timer-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
} 