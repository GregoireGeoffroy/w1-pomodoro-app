import * as Haptics from 'expo-haptics';

export function useHaptics() {
  const vibrate = async () => {
    try {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
    } catch (error) {
      console.error('Error with haptics:', error);
    }
  };

  return { vibrate };
} 