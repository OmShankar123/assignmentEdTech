import '../global.css';
import '../src/localization/i18n';

import React, { useEffect, useState } from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { APIProvider } from '@/api/common/api-provider';
import ErrorFallback from '@/components/ErrorFallback';
import { initStorage } from '@/storage';
import { rehydrateStores } from '@/store';
import { useUserStore } from '@/store/useUserStore';
import { customFontsToLoad } from '@/theme/fonts';
import { toastConfig } from '@/utils/toast-config';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [storageReady, setStorageReady] = useState(false);
  const [fontsLoaded] = useFonts(customFontsToLoad);
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initStorage()
      .then(rehydrateStores)
      .then(() => setStorageReady(true));
  }, []);

  useEffect(() => {
    if (fontsLoaded && storageReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, storageReady]);

  useEffect(() => {
    if (!storageReady || !fontsLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isLoggedIn && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isLoggedIn && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, segments, storageReady, fontsLoaded]);

  if (!storageReady || !fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <APIProvider>
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
        </APIProvider>
      </ErrorBoundary>
      <Toast config={toastConfig} position="top" />
    </GestureHandlerRootView>
  );
}
