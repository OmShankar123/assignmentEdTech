import '../global.css';
import '../src/localization/i18n';

import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import ErrorBoundary from 'react-native-error-boundary';

import { APIProvider } from '@/api/common/api-provider';
import ErrorFallback from '@/components/ErrorFallback';
import { initStorage } from '@/storage';
import { rehydrateStores } from '@/store';
import { useUserStore } from '@/store/useUserStore';
import { toastConfig } from '@/utils/toast-config';

export default function RootLayout() {
  const [storageReady, setStorageReady] = useState(false);
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initStorage()
      .then(rehydrateStores)
      .then(() => setStorageReady(true));
  }, []);

  useEffect(() => {
    if (!storageReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isLoggedIn && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isLoggedIn && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, segments, storageReady]);

  if (!storageReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <APIProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </APIProvider>
      </ErrorBoundary>
      <Toast config={toastConfig} position="top" />
    </GestureHandlerRootView>
  );
}
