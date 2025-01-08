import { View, Text, TextInput, TouchableOpacity, Platform, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { signInWithGoogle, signInWithApple, configureGoogleSignIn } from '@/utils/supabase';
import GoogleIcon from '@/assets/icons/GoogleIcon';
import * as AppleAuthentication from 'expo-apple-authentication';
import { supabase } from '@/utils/supabase';

const handleAuthError = (error: Error, provider: string) => {
  Alert.alert(
    'Authentication Error',
    `Failed to sign in with ${provider}: ${error.message}`,
    [{ text: 'OK' }]
  );
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();

  useEffect(() => {
    try {
      if (Platform.OS !== 'web') {
        initializeGoogleSignIn();
        console.log('Google Sign In initialized');
      }
    } catch (error) {
      console.error('Failed to initialize Google Sign In:', error);
    }
  }, []);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (session) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      handleAuthError(error as Error, 'Google');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-4 bg-white dark:bg-gray-900">
      <View className="space-y-6 w-full max-w-sm mx-auto">
        <View>
          <Text className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Welcome Back
          </Text>
          <Text className="text-center text-gray-500 dark:text-gray-400 mt-2">
            Sign in to your account to continue
          </Text>
        </View>

        {error && (
          <Text className="text-red-500 text-center">{error}</Text>
        )}

        <View className="space-y-4">
          <TextInput
            className="w-full h-12 px-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            className="w-full h-12 px-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            className={`w-full h-12 rounded-lg flex items-center justify-center ${
              isLoading ? 'bg-blue-400' : 'bg-blue-500'
            }`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text className="text-white font-semibold">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center my-4">
            <View className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
            <Text className="mx-4 text-gray-500">or continue with</Text>
            <View className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
          </View>

          <TouchableOpacity
            className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-700 flex-row items-center justify-center space-x-2 bg-white dark:bg-gray-800"
            onPress={handleGoogleSignIn}
            disabled={isGoogleLoading}
          >
            <GoogleIcon />
            <Text className="text-gray-800 dark:text-white">
              {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
            </Text>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={5}
              style={{ height: 44, width: '100%' }}
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

          <TouchableOpacity
            onPress={() => router.push('/auth/register')}
            className="mt-4"
          >
            <Text className="text-center text-blue-500">
              Don't have an account? Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {(isLoading || isGoogleLoading || isAppleLoading) && (
        <View className="absolute inset-0 bg-black/20 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      )}
    </View>
  );
} 