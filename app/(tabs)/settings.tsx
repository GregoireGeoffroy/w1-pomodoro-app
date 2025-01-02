import Settings from '../timer/Settings';
import { useTimerSettings } from '../timer/TimerContext';

export default function SettingsScreen() {
  const { settings, updateSettings, resetToDefaults } = useTimerSettings();
  
  return (
    <Settings
      settings={settings}
      onSettingChange={updateSettings}
      onResetDefaults={resetToDefaults}
    />
  );
} 