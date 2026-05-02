import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import NetInfo from '@react-native-community/netinfo';

import Typography from './Typography';

export const OfflineBanner = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<'online' | 'offline' | 'back-online'>('online');

  // Animation value: 0 is hidden (above screen), 1 is visible
  const animation = useSharedValue(0);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected === false) {
        setStatus('offline');
        // Smooth slide down
        animation.value = withTiming(1, {
          duration: 400,
          easing: Easing.out(Easing.quad),
        });
      } else if (status === 'offline' && state.isConnected === true) {
        setStatus('back-online');
        // Stay visible as "Back Online" for 3 seconds, then slide up
        setTimeout(() => {
          animation.value = withTiming(0, {
            duration: 400,
            easing: Easing.in(Easing.quad),
          });
          // Reset status after animation finishes
          setTimeout(() => setStatus('online'), 400);
        }, 3000);
      }
    });

    return () => unsubscribe();
  }, [status, animation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(animation.value, [0, 1], [-150, 0]),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          paddingTop: 60,
          paddingBottom: 15,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: status === 'back-online' ? '#10b981' : '#ef4444', // success / error
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 10,
        },
      ]}
    >
      <View className="flex-row items-center">
        <Typography className="text-white mr-2" variant="bodySmallSemiBold">
          {status === 'back-online' ? '✅' : '📶'}
        </Typography>
        <Typography className="text-white" variant="bodySmallSemiBold">
          {status === 'back-online'
            ? t('common.back_online') || 'Back online! Syncing data...'
            : t('common.offline_message') ||
              'You are currently offline. Some features may be limited.'}
        </Typography>
      </View>
    </Animated.View>
  );
};
