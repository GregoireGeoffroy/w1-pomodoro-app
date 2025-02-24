import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name || "TimelyFlow",
  slug: config.slug || "timelyflow",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.gregoiregeoffroy.TimelyFlow",
    infoPlist: {
      NSCameraUsageDescription: "This app needs access to camera.",
      NSPhotoLibraryAddUsageDescription: "This app needs access to photos.",
      NSPhotoLibraryUsageDescription: "This app needs access to photos.",
    },
  },
}); 