import { View, Text } from 'react-native';
import { ErrorBoundaryProps } from 'expo-router';

export default function ErrorBoundary(props: ErrorBoundaryProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-xl font-bold mb-2">Something went wrong!</Text>
      <Text className="text-gray-600 mb-4">{props.error.message}</Text>
      {props.retry && (
        <Text 
          className="text-pomodoro-work"
          onPress={props.retry}
        >
          Try Again
        </Text>
      )}
    </View>
  );
} 