import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => router.back()}
            className="ml-4"
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={colorScheme === 'dark' ? '#fff' : '#000'} 
            />
          </TouchableOpacity>
        ),
        contentStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1F2937' : 'white',
        },
      }}
    />
  );
} 