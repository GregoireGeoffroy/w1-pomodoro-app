import { Platform } from 'react-native'
import { createRoot } from 'react-dom/client'
import { ExpoRoot } from 'expo-router'

// Prevent AsyncStorage initialization during SSR
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const root = createRoot(document.getElementById('root'))
  root.render(<ExpoRoot />)
} 