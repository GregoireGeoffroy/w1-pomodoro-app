import { View, Text, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { signInWithGoogle } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import GoogleIcon from '@/assets/icons/GoogleIcon';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function AccountScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const colors = useThemeColors();
  
  return (
    <BlurView intensity={100} tint="light" className="flex-1">
      <SafeAreaView className="flex-1">
        <View 
          className="flex-1 p-6"
          style={{ backgroundColor: colors.background }}
        >
          <Text 
            className="text-2xl font-bold mb-6"
            style={{ color: colors.text }}
          >
            Account
          </Text>

          {user ? (
            <View className="space-y-4">
              <Text className="text-gray-600 dark:text-gray-300">
                Signed in as: {user.email}
              </Text>
              <TouchableOpacity
                className="bg-red-500 py-2 px-4 rounded-lg"
                onPress={signOut}
              >
                <Text className="text-white text-center">Sign Out</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="space-y-4">
              <TouchableOpacity
                className="bg-blue-500 py-2 px-4 rounded-lg"
                onPress={() => router.push('/auth/login')}
              >
                <Text className="text-white text-center">Sign In</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="bg-white border border-gray-300 py-2 px-4 rounded-lg flex-row items-center justify-center space-x-2"
                onPress={signInWithGoogle}
              >
                <GoogleIcon />
                <Text className="text-gray-800">Continue with Google</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </BlurView>
  );
} 