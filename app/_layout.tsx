import '../global.css';
import '../src/localization/i18n';

import React, { useEffect, useState } from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { APIProvider } from '@/api/common/api-provider';
import ErrorFallback from '@/components/ErrorFallback';
import { useAppState, useNotifications } from '@/hooks';
import i18n from '@/localization/i18n';
import { initStorage } from '@/storage';
import { rehydrateStores, useBookmarkStore } from '@/store';
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
  const appState = useAppState();
  const { scheduleEngagementNotification, cancelAllNotifications } = useNotifications();
  const { bookmarkedIds, lastNotifiedCount, setLastNotifiedCount } = useBookmarkStore();

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
  }, [isLoggedIn, segments, storageReady, fontsLoaded, router]);

  // Engagement Trigger: Schedule notification when app goes to background (24h inactivity)
  useEffect(() => {
    if (appState === 'background' && isLoggedIn) {
      // Clear existing notifications to ensure only one 24h reminder is active
      cancelAllNotifications().then(() => {
        scheduleEngagementNotification(
          i18n.t('notifications.engagement_title'),
          i18n.t('notifications.engagement_body'),
          24 * 60 * 60, // 24 hours
          '/(tabs)',
        );
      });
    } else if (appState === 'active') {
      // Cancel notifications when app is active again
      cancelAllNotifications();
    }
  }, [appState, isLoggedIn, cancelAllNotifications, scheduleEngagementNotification]);

  // Bookmark Milestone Trigger: Triggered when user has bookmarked 5 or more courses
  useEffect(() => {
    const currentCount = bookmarkedIds.length;
    if (currentCount >= 5 && currentCount > lastNotifiedCount) {
      scheduleEngagementNotification(
        i18n.t('notifications.bookmark_milestone_title'),
        i18n.t('notifications.bookmark_milestone_body'),
        1, // Almost immediate (1s)
        '/(tabs)',
      );
      setLastNotifiedCount(currentCount);
    }
  }, [
    bookmarkedIds.length,
    lastNotifiedCount,
    setLastNotifiedCount,
    scheduleEngagementNotification,
  ]);

  if (!storageReady || !fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <APIProvider>
            <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
          </APIProvider>
        </ErrorBoundary>
        <Toast config={toastConfig} position="top" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
