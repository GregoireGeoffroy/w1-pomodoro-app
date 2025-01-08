module.exports = {
  expo: {
    name: 'TimelyFlow',
    slug: 'timelyflow',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'timelyflow',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.gregoiregeoffroy.TimelyFlow',
      config: {
        googleSignIn: {
          reservedClientId: `com.googleusercontent.apps.${process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID}`
        }
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
        package: 'com.gregoiregeoffroy.TimelyFlow'
    },
    web: {
      favicon: './assets/images/favicon.png'
    },
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    },
    plugins: [
      'expo-router',
      'expo-apple-authentication',
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: `com.googleusercontent.apps.${process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID}`,
          googleServicesFile: "./google-services.json"
        }
      ]
    ]
  }
}; 