import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signUp(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-4 bg-white dark:bg-gray-900">
      <View className="space-y-6 w-full max-w-sm mx-auto">
        <View>
          <Text className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Create Account
          </Text>
          <Text className="text-center text-gray-500 dark:text-gray-400 mt-2">
            Sign up to get started
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
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text className="text-white font-semibold">
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/auth/login')}
            className="mt-4"
          >
            <Text className="text-center text-blue-500">
              Already have an account? Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
} 