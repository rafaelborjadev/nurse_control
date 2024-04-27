import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Root() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    });
  }, []);

  // Set up the auth context and render our layout inside of it.
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <Slot />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </PaperProvider>
  );
}
