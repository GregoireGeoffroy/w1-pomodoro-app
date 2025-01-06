import { Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import { View, Text, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTimerSettings } from '@/context/TimerContext';
import { useAuth } from '@/context/AuthContext';
import { signInWithGoogle } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import GoogleIcon from '@/assets/icons/GoogleIcon';
import { ThemeSelector } from '@/components/ThemeSelector';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Audio } from 'expo-av';
import { useState } from 'react';
import { SOUNDS, type SoundOption } from '@/config/sounds';
import { Ionicons } from '@expo/vector-icons';

interface DurationSettingProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
}

function DurationSetting({ label, value, onValueChange, min, max, step = 5 }: DurationSettingProps) {
  const displayValue = Math.round(value / step) * step;
  
  return (
    <View className="mb-6">
      <View className="flex-row justify-between mb-2">
        <Text className="text-lg font-semibold dark:text-white">{label}</Text>
        <Text className="text-lg dark:text-white">{displayValue} min</Text>
      </View>
      <Slider
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="#3B82F6"
        maximumTrackTintColor="#9CA3AF"
      />
      <View className="flex-row justify-between mt-1">
        <Text className="text-sm text-gray-500 dark:text-gray-400">{min}m</Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">{max}m</Text>
      </View>
    </View>
  );
}

function ToggleSetting({ label, value, onValueChange }: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View className="flex-row justify-between items-center mb-4">
      <Text className="text-base dark:text-white">{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
      />
    </View>
  );
}

function SoundSelector({ 
  selectedSound, 
  onSoundChange 
}: {
  selectedSound: SoundOption;
  onSoundChange: (sound: SoundOption) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const playSound = async (soundKey: SoundOption) => {
    try {
      // Stop any currently playing sound
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      // Load and play the new sound
      const { sound: newSound } = await Audio.Sound.createAsync(SOUNDS[soundKey]);
      setSound(newSound);
      setIsPlaying(true);
      await newSound.playAsync();
      
      // Handle sound completion
      newSound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && !status.isPlaying) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error playing sound:', error);
      setIsPlaying(false);
    }
  };

  return (
    <View className="space-y-4">
      {Object.keys(SOUNDS).map((soundKey) => (
        <View key={soundKey} className="flex-row items-center justify-between">
          <Pressable
            className="flex-1 flex-row items-center"
            onPress={() => onSoundChange(soundKey as SoundOption)}
          >
            <View className={`w-4 h-4 rounded-full border-2 border-blue-500 mr-3 ${
              selectedSound === soundKey ? 'bg-blue-500' : 'bg-transparent'
            }`} />
            <Text className="text-base dark:text-white">{soundKey}</Text>
          </Pressable>
          
          <Pressable
            className="p-2"
            onPress={() => playSound(soundKey as SoundOption)}
            disabled={isPlaying}
          >
            <Ionicons 
              name="play-circle-outline" 
              size={24} 
              color={isPlaying ? '#9CA3AF' : '#3B82F6'} 
            />
          </Pressable>
        </View>
      ))}
    </View>
  );
}

export default function SettingsScreen() {
  const { settings, updateSettings, resetToDefaults } = useTimerSettings();
  const colors = useThemeColors();
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}> 
      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1 p-6"
          style={{ backgroundColor: colors.background }}>
          <Text 
            className="text-2xl font-bold mb-6"
            style={{ color: colors.text }}
          >
            Timer Settings
          </Text>
          
          <View className="space-y-6">
            <DurationSetting
              label="Pomo Duration"
              value={settings.workDuration}
              onValueChange={(value) => updateSettings('workDuration', value)}
              min={5}
              max={120}
            />

            <DurationSetting
              label="Short Break Duration"
              value={settings.breakDuration}
              onValueChange={(value) => updateSettings('breakDuration', value)}
              min={1}
              max={30}
            />

            <DurationSetting
              label="Long Break Duration"
              value={settings.longBreakDuration}
              onValueChange={(value) => updateSettings('longBreakDuration', value)}
              min={1}
              max={30}
            />

            <View className="mb-6">
              <Text className="text-lg font-semibold mb-3 dark:text-white">
                Pomos until Long Break
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {[2, 3, 4, 5, 6, 7, 8].map((count) => (
                  <Pressable
                    key={count}
                    className={`py-3 px-5 rounded-full ${
                      settings.pomosUntilLongBreak === count 
                        ? 'bg-blue-500' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    onPress={() => updateSettings('pomosUntilLongBreak', count)}
                  >
                    <Text className={`${
                      settings.pomosUntilLongBreak === count 
                        ? 'text-white' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {count}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View>
              <Text className="text-lg font-semibold mb-3 dark:text-white">Auto Start</Text>
              <View className="space-y-4">
                <ToggleSetting
                  label="Auto Start  Pomo"
                  value={settings.autoStartPomodoro}
                  onValueChange={(value) => updateSettings('autoStartPomodoro', value)}
                />
                <ToggleSetting
                  label="Auto Start Break"
                  value={settings.autoStartBreak}
                  onValueChange={(value) => updateSettings('autoStartBreak', value)}
                />
              </View>
            </View>

            <View>
              <Text className="text-lg font-semibold mb-3 dark:text-white">Sound & Haptics</Text>
              <View className="space-y-4">
                <ToggleSetting
                  label="Sound"
                  value={settings.soundEnabled}
                  onValueChange={(value) => updateSettings('soundEnabled', value)}
                />
                <ToggleSetting
                  label="Vibration"
                  value={settings.vibrationEnabled}
                  onValueChange={(value) => updateSettings('vibrationEnabled', value)}
                />
                
                {settings.vibrationEnabled && (
                  <View>
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-base dark:text-white">Vibration Duration</Text>
                      <Text className="text-base dark:text-white">
                        {settings.vibrationDuration / 1000}s
                      </Text>
                    </View>
                    <Slider
                      minimumValue={0}
                      maximumValue={20000}
                      step={5000}
                      value={settings.vibrationDuration}
                      onValueChange={(value) => updateSettings('vibrationDuration', value)}
                      minimumTrackTintColor="#3B82F6"
                      maximumTrackTintColor="#9CA3AF"
                    />
                    <View className="flex-row justify-between mt-1">
                      <Text className="text-sm text-gray-500 dark:text-gray-400">0s</Text>
                      <Text className="text-sm text-gray-500 dark:text-gray-400">20s</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {settings.soundEnabled && (
              <View className="mt-4">
                <Text className="text-base font-medium mb-3 dark:text-white">
                  Timer Sound
                </Text>
                <SoundSelector
                  selectedSound={settings.soundChoice}
                  onSoundChange={(sound) => updateSettings('soundChoice', sound)}
                />
              </View>
            )}

            <View className="pt-4">
              <Pressable
                className="bg-red-500 py-4 rounded-full shadow-lg"
                style={{ elevation: 4 }}
                onPress={resetToDefaults}
              >
                <Text className="text-white text-center font-medium">
                  Reset All Settings to Defaults
                </Text>
              </Pressable>
            </View>

            <View className="mt-6">
              <Text 
                className="text-lg font-semibold px-4 mb-2"
                style={{ color: colors.text }}
              >
                Theme
              </Text>
              <ThemeSelector />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
} 