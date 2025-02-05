import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

// Define the URL explicitly since we have it
const supabaseUrl = 'https://krichcbjihlbkbupyqwn.supabase.co';

// Get the key from env, with type checking
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyaWNoY2JqaWhsYmtidXB5cXduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwNzUwOTEsImV4cCI6MjA1MTY1MTA5MX0.IubB9Gt3L-dTUXPWn7_gYfP7YuWd0MiFmF2dtY24QB8';
if (!supabaseAnonKey) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Create the Supabase client with proper types
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Export typed helper functions for auth
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  return { data, error };
};

// Helper to get current session
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};

// Helper to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Remove the top-level configuration and make it a function
export const initializeGoogleSignIn = () => {
  if (!process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID) {
    throw new Error('Missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID');
  }

  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: Platform.OS === 'ios' ? process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID : undefined,
    offlineAccess: true,
  });
};

// Simplify the sign in function
export const signInWithGoogle = async () => {
  try {
    console.log('Starting Google sign in process...');
    
    // Initialize Google Sign In
    initializeGoogleSignIn();
    
    if (Platform.OS !== 'web') {
      await GoogleSignin.hasPlayServices();
    }

    const userInfo = await GoogleSignin.signIn();
    console.log('Google Sign In successful:', userInfo);

    if (!userInfo.idToken) {
      throw new Error('No ID token present in Google sign in response');
    }

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: userInfo.idToken,
    });

    if (error) throw error;
    return { data, error: null };

  } catch (error: any) {
    console.error('Google sign in error:', {
      error,
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error occurred') 
    };
  }
};

// Update Apple sign in to handle errors better
export const signInWithApple = async () => {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      throw new Error('No identity token returned from Apple Sign In');
    }

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ERR_CANCELED') {
      // User canceled the sign-in flow
      return { error: new Error('Sign in canceled') };
    }
    console.error('Apple sign in error:', error);
    return { error: error instanceof Error ? error : new Error('Unknown error occurred') };
  }
};
