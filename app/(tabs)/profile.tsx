import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import Button from '@/components/Button';
import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typography from '@/components/Typography';
import { useSelectedLanguage } from '@/localization/utils';
import { useUserStore } from '@/store/useUserStore';
import { Colors } from '@/theme/colors';

export default function Profile() {
  const { t } = useTranslation();
  const { user, logout } = useUserStore();
  const { language, setLanguage } = useSelectedLanguage();

  return (
    <ScreenWrapper className="flex-1" showBackgroundShape={true}>
      <View className="px-5">
        <Header showBackButton={false} title={t('common.profile')} />

        <View className="items-center mt-10">
          <View className="w-24 h-24 bg-primary/10 rounded-full justify-center items-center mb-4">
            <Typography className="text-primary uppercase" variant="h1">
              {user?.username?.charAt(0) || 'U'}
            </Typography>
          </View>

          <Typography className="text-text mb-1" variant="h2">
            {user?.username}
          </Typography>
          <Typography className="text-secondary mb-8" variant="body">
            {user?.email}
          </Typography>

          <View className="w-full bg-gray-100 p-1 rounded-2xl flex-row mb-8">
            <Pressable
              style={[styles.tabButton, language === 'en' && styles.activeTab]}
              onPress={() => setLanguage('en')}
            >
              <Typography
                className={language === 'en' ? 'text-primary' : 'text-secondary'}
                variant="bodySmallSemiBold"
              >
                English
              </Typography>
            </Pressable>
            <Pressable
              style={[styles.tabButton, language === 'hi' && styles.activeTab]}
              onPress={() => setLanguage('hi')}
            >
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
            onPress={logout}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
