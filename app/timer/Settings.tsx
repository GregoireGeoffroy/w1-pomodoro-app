import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Audio } from 'expo-av';

interface SettingsProps {
  settings: {
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    workDuration: number;
    breakDuration: number;
    longBreakDuration: number;
    soundChoice: string;
    autoStartPomodoro: boolean;
    autoStartBreak: boolean;
    pomodoroEndSound: string;
    breakEndSound: string;
    vibrationDuration: number;
  };
  onSettingChange: (key: string, value: any) => void;
  onResetDefaults: () => void;
}

const AVAILABLE_SOUNDS = [
  { label: 'Bell', value: 'bell' },
  { label: 'Digital', value: 'digital' },
  { label: 'Chime', value: 'chime' },
  { label: 'Marimba', value: 'marimba' },
];

export default function Settings({ 
  settings, 
  onSettingChange,
  onResetDefaults
}: SettingsProps) {
  const [previewSound, setPreviewSound] = useState<Audio.Sound | null>(null);

  const playPreview = useCallback(async (soundChoice: string) => {
    try {
      if (previewSound) {
        await previewSound.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        SOUNDS[soundChoice],
        { volume: 0.5 }
      );
      setPreviewSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing preview:', error);
    }
  }, [previewSound]);

  useEffect(() => {
    return () => {
      if (previewSound) {
        previewSound.unloadAsync();
      }
    };
  }, [previewSound]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timer Durations</Text>
          <View style={styles.setting}>
            <Text style={styles.label}>Work Duration</Text>
            <View style={styles.durationContainer}>
              <Pressable
                style={styles.durationButton}
                onPress={() => {
                  const newDuration = Math.max(1, Math.floor(settings.workDuration - 5));
                  onSettingChange('workDuration', newDuration);
                }}
              >
                <Text>-</Text>
              </Pressable>
              <Text style={styles.durationText}>{Math.round(settings.workDuration)} min</Text>
              <Pressable
                style={styles.durationButton}
                onPress={() => {
                  const newDuration = Math.min(60, Math.floor(settings.workDuration + 5));
                  onSettingChange('workDuration', newDuration);
                }}
              >
                <Text>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.setting}>
            <Text style={styles.label}>Break Duration</Text>
            <View style={styles.durationContainer}>
              <Pressable
                style={styles.durationButton}
                onPress={() => {
                  const newDuration = Math.max(1, Math.floor(settings.breakDuration - 1));
                  onSettingChange('breakDuration', newDuration);
                }}
              >
                <Text>-</Text>
              </Pressable>
              <Text style={styles.durationText}>{Math.round(settings.breakDuration)} min</Text>
              <Pressable
                style={styles.durationButton}
                onPress={() => {
                  const newDuration = Math.min(30, Math.floor(settings.breakDuration + 1));
                  onSettingChange('breakDuration', newDuration);
                }}
              >
                <Text>+</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Auto Start</Text>
          <View style={styles.setting}>
            <Text style={styles.label}>Auto Start Next Pomodoro</Text>
            <Switch
              value={settings.autoStartPomodoro}
              onValueChange={(value) => onSettingChange('autoStartPomodoro', value)}
            />
          </View>
          <View style={styles.setting}>
            <Text style={styles.label}>Auto Start Break</Text>
            <Switch
              value={settings.autoStartBreak}
              onValueChange={(value) => onSettingChange('autoStartBreak', value)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sound</Text>
          <View style={styles.setting}>
            <Text style={styles.label}>Enable Sound</Text>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) => onSettingChange('soundEnabled', value)}
            />
          </View>

          <View style={styles.setting}>
            <Text style={styles.label}>Pomodoro End Sound</Text>
            <View style={styles.soundContainer}>
              <Picker
                selectedValue={settings.pomodoroEndSound}
                style={styles.picker}
                onValueChange={(value) => onSettingChange('pomodoroEndSound', value)}
                enabled={settings.soundEnabled}
              >
                {AVAILABLE_SOUNDS.map((sound) => (
                  <Picker.Item 
                    key={sound.value} 
                    label={sound.label} 
                    value={sound.value}
                  />
                ))}
              </Picker>
              <Pressable
                style={styles.previewButton}
                onPress={() => playPreview(settings.pomodoroEndSound)}
                disabled={!settings.soundEnabled}
              >
                <Text style={styles.previewButtonText}>▶️</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.setting}>
            <Text style={styles.label}>Break End Sound</Text>
            <Picker
              selectedValue={settings.breakEndSound}
              style={styles.picker}
              onValueChange={(value) => onSettingChange('breakEndSound', value)}
              enabled={settings.soundEnabled}
            >
              {AVAILABLE_SOUNDS.map((sound) => (
                <Picker.Item 
                  key={sound.value} 
                  label={sound.label} 
                  value={sound.value}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Haptic Feedback</Text>
          <View style={styles.setting}>
            <Text style={styles.label}>Enable Vibration</Text>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={(value) => onSettingChange('vibrationEnabled', value)}
            />
          </View>

          <View style={styles.setting}>
            <Text style={styles.label}>Vibration Duration (ms)</Text>
            <View style={styles.durationContainer}>
              <Pressable
                style={styles.durationButton}
                onPress={() => {
                  const newDuration = Math.max(0, settings.vibrationDuration - 10);
                  onSettingChange('vibrationDuration', newDuration);
                }}
              >
                <Text>-</Text>
              </Pressable>
              <Text style={styles.durationText}>{settings.vibrationDuration}</Text>
              <Pressable
                style={styles.durationButton}
                onPress={() => {
                  const newDuration = Math.min(1000, settings.vibrationDuration + 10);
                  onSettingChange('vibrationDuration', newDuration);
                }}
              >
                <Text>+</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <Pressable style={styles.resetButton} onPress={onResetDefaults}>
          <Text style={styles.resetButtonText}>Reset to Defaults</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 30,
    color: '#333',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#666',
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationText: {
    marginHorizontal: 15,
    fontSize: 16,
    minWidth: 60,
    textAlign: 'center',
  },
  picker: {
    width: 150,
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  soundContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  previewButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewButtonText: {
    fontSize: 20,
  },
}); 