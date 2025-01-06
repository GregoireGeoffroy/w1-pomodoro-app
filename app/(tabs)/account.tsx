import { View, Text, TouchableOpacity, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { signInWithGoogle, signInWithApple } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import GoogleIcon from '@/assets/icons/GoogleIcon';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useState } from 'react';

const handleAuthError = (error: Error, provider: string) => {
  Alert.alert(
    'Authentication Error',
    `Failed to sign in with ${provider}: ${error.message}`,
    [{ text: 'OK' }]
  );
};

export default function AccountScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const colors = useThemeColors();
  const [isLoading, setIsLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView className="flex-1">
        <View className="flex-1 p-6">
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
                onPress={async () => {
                  setIsLoading(true);
                  try {
                    const { error } = await signInWithGoogle();
                    if (error) throw error;
                  } catch (error) {
                    handleAuthError(error as Error, 'Google');
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
              >
                <GoogleIcon />
                <Text className="text-gray-800">
                  {isLoading ? 'Signing in...' : 'Continue with Google'}
                </Text>
              </TouchableOpacity>

              {Platform.OS === 'ios' && (
                <AppleAuthentication.AppleAuthenticationButton
                  buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                  buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                  cornerRadius={5}
                  style={{ height: 44 }}
                  onPress={async () => {
                    setIsAppleLoading(true);
                    try {
                      const { error } = await signInWithApple();
                      if (error) throw error;
                    } catch (error) {
                      handleAuthError(error as Error, 'Apple');
                    } finally {
                      setIsAppleLoading(false);
                    }
                  }}
                  disabled={isAppleLoading}
                />
              )}
            </View>
          )}

          {(isLoading || isAppleLoading) && (
            <View className="absolute inset-0 bg-black/20 items-center justify-center">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
} 