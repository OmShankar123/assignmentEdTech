import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';

import BottomAlert from '@/components/BottomAlert';
import Button from '@/components/Button';
import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typography from '@/components/Typography';
import { useNotifications } from '@/hooks/useNotifications';
import { useSelectedLanguage } from '@/localization/utils';
import { useBookmarkStore } from '@/store';
import { useUserStore } from '@/store/useUserStore';
import { Colors } from '@/theme/colors';

const TAB_WIDTH = 160;

export default function Profile() {
  const { t } = useTranslation();
  const { user, logout, updateAvatar } = useUserStore();
  const { language, setLanguage } = useSelectedLanguage();
  const { sendLocalNotification } = useNotifications();
  const bookmarksCount = useBookmarkStore((state) => state.bookmarks.length);
  const [isLogoutAlertVisible, setIsLogoutAlertVisible] = useState(false);

  // Animation for language toggle
  const translateX = useSharedValue(language === 'en' ? 0 : 1);

  useEffect(() => {
    translateX.value = withSpring(language === 'en' ? 0 : 1, {
      damping: 20,
      stiffness: 150,
    });
  }, [language, translateX]);

  const animatedPillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value * (TAB_WIDTH / 2) }],
  }));

  const handleLogout = () => {
    setIsLogoutAlertVisible(true);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      updateAvatar({
        url: selectedImage.uri,
        localPath: selectedImage.uri,
      });

      await sendLocalNotification(
        t('notifications.profile_update_title'),
        t('notifications.profile_update_body'),
      );
    }
  };

  return (
    <ScreenWrapper className="flex-1" showBackgroundShape={true}>
      <View className="px-5">
        <Header showBackButton={false} title={t('common.profile')} />

        <View className="items-center mt-10">
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-24 h-24 bg-primary/10 rounded-full justify-center items-center mb-4 overflow-hidden border-2 border-primary/20"
            onPress={pickImage}
          >
            {user?.avatar?.url ? (
              <Image source={{ uri: user.avatar.url }} style={{ width: '100%', height: '100%' }} />
            ) : (
              <Typography className="text-primary uppercase" variant="h1">
                {user?.username?.charAt(0) || 'U'}
              </Typography>
            )}
            <View className="absolute bottom-0 left-0 right-0 bg-black/40 py-1">
              <Typography className="text-white text-[10px] text-center" variant="caption">
                {t('common.edit')}
              </Typography>
            </View>
          </TouchableOpacity>

          <Typography className="text-text mb-1" variant="h2">
            {user?.username}
          </Typography>
          <Typography className="text-secondary mb-8" variant="body">
            {user?.email}
          </Typography>

          {/* Stats Row */}
          <View className="flex-row justify-between w-full mb-8 px-2">
            <View className="items-center flex-1">
              <Typography className="text-primary" variant="h3">
                {bookmarksCount}
              </Typography>
              <Typography className="text-secondary" variant="caption">
                {t('common.bookmarks')}
              </Typography>
            </View>
            <View className="w-[1px] h-10 bg-gray-200" />
            <View className="items-center flex-1">
              <Typography className="text-primary" variant="h3">
                12
              </Typography>
              <Typography className="text-secondary" variant="caption">
                {t('common.enrolled')}
              </Typography>
            </View>
            <View className="w-[1px] h-10 bg-gray-200" />
            <View className="items-center flex-1">
              <Typography className="text-primary" variant="h3">
                85%
              </Typography>
              <Typography className="text-secondary" variant="caption">
                {t('common.progress')}
              </Typography>
            </View>
          </View>

          {/* Animated Language Toggle */}
          <View style={[styles.tabContainer, { width: TAB_WIDTH }]}>
            <Animated.View style={[styles.activePill, animatedPillStyle]} />
            <Pressable className="flex-1 items-center z-10" onPress={() => setLanguage('en')}>
              <Typography
                className={language === 'en' ? 'text-primary' : 'text-secondary'}
                variant="bodySmallSemiBold"
              >
                English
              </Typography>
            </Pressable>
            <Pressable className="flex-1 items-center z-10" onPress={() => setLanguage('hi')}>
              <Typography
                className={language === 'hi' ? 'text-primary' : 'text-secondary'}
                variant="bodySmallSemiBold"
              >
                हिन्दी
              </Typography>
            </Pressable>
          </View>

          <Button
            className="w-full"
            title={t('common.logout') || 'Logout'}
            type="outline"
            onPress={handleLogout}
          />
        </View>
      </View>

      <BottomAlert
        cancelText={t('common.cancel')}
        confirmText={t('common.logout')}
        isVisible={isLogoutAlertVisible}
        message={t('auth.logout_confirmation')}
        title={t('common.logout')}
        type="destructive"
        onClose={() => setIsLogoutAlertVisible(false)}
        onConfirm={logout}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6', // gray-100 equivalent
    borderRadius: 16,
    padding: 4,
    marginBottom: 32,
    position: 'relative',
    height: 48,
    alignItems: 'center',
  },
  activePill: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    left: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    ...Platform.select({
      android: { elevation: 2 },
      ios: { elevation: 4 },
    }),
  },
});
