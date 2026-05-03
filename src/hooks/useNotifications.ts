import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';

// Configure how notifications are handled when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Hook to manage local notifications and engagement.
 */
export function useNotifications() {
  const router = useRouter();
  const notificationListener = useRef<Notifications.EventSubscription>(undefined);
  const responseListener = useRef<Notifications.EventSubscription>(undefined);

  useEffect(() => {
    // 1. Request permissions on mount
    registerForPushNotificationsAsync();

    // 2. Listen for incoming notifications (while app is foregrounded)
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification Received:', notification);
    });

    // 3. Listen for user interaction with notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as { url?: string };
      console.log('Notification Tapped:', data);

      if (data?.url) {
        router.push(data.url as any);
      }
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [router]);

  /**
   * Schedules a local engagement notification.
   */
  const scheduleEngagementNotification = async (
    title: string,
    body: string,
    seconds: number = 5,
    url?: string,
  ) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { url },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds,
      },
    });
  };

  /**
   * Clears all scheduled notifications.
   */
  const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  /**
   * Sends an immediate local notification.
   */
  const sendLocalNotification = async (
    title: string,
    body: string,
    data?: Record<string, unknown>,
  ) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
      },
      trigger: null, // null means immediate
    });
  };

  return {
    scheduleEngagementNotification,
    cancelAllNotifications,
    sendLocalNotification,
  };
}

/**
 * Helper to register for push notifications and get permissions.
 */
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Failed to get push token for push notification!');
    return;
  }

  // NOTE: We only use Local Notifications for this assignment.
  // getDevicePushTokenAsync() requires FCM configuration on Android which is not set up.
  /*
  try {
    token = (await Notifications.getDevicePushTokenAsync()).data;
    console.log('Local Notification Token:', token);
  } catch (e) {
    console.warn('Error getting device token:', e);
  }
  */

  return token;
}
