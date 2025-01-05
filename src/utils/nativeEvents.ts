import { NativeEventEmitter, NativeModule, Platform } from 'react-native';

export function createNativeEventEmitter(nativeModule: NativeModule | null) {
  if (!nativeModule) {
    return null;
  }
  
  return new NativeEventEmitter(nativeModule);
} 