import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

export function ThemeSelector() {
  const { currentTheme, setThemeById, availableThemes } = useTheme();
  const colorScheme = useColorScheme();

  const handleThemePress = async (themeId: string) => {
    try {
      await setThemeById(themeId);
    } catch (error) {
      console.error('Failed to set theme:', error);
    }
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row p-4 gap-4">
        {availableThemes.map((theme) => (
          <TouchableOpacity
            key={theme.id}
            onPress={() => handleThemePress(theme.id)}
            className={`w-24 h-32 rounded-lg justify-between p-2 ${
              currentTheme.id === theme.id ? 'border-2' : ''
            }`}
            style={{
              backgroundColor: theme.colors[colorScheme ?? 'light'].background,
              borderColor: theme.colors[colorScheme ?? 'light'].accent,
            }}
          >
            {/* Theme Preview */}
            <View className="flex-row justify-between">
              <View 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: theme.colors[colorScheme ?? 'light'].work }}
              />
              <View 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: theme.colors[colorScheme ?? 'light'].break }}
              />
            </View>

            {/* Theme Name */}
            <Text
              className="text-center text-xs"
              style={{ color: theme.colors[colorScheme ?? 'light'].text }}
            >
              {theme.name}
            </Text>

            {/* Selected Indicator */}
            {currentTheme.id === theme.id && (
              <View className="absolute top-1 right-1">
                <MaterialCommunityIcons 
                  name="check-circle" 
                  size={16} 
                  color={theme.colors[colorScheme ?? 'light'].accent} 
                />
              </View>
            )}

            {/* Light/Dark Indicator */}
            <View 
              className="absolute bottom-1 right-1 bg-gray-800/10 rounded px-1"
            >
              <Text 
                className="text-[10px]"
                style={{ color: theme.colors[colorScheme ?? 'light'].text }}
              >
                {colorScheme === 'dark' ? 'Dark' : 'Light'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
} 