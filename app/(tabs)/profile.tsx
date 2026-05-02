import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import Button from '@/components/Button';
import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typography from '@/components/Typography';
import { useUserStore } from '@/store/useUserStore';

export default function Profile() {
  const { t } = useTranslation();
  const { user, logout } = useUserStore();

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

          <Typography className="text-black mb-1" variant="h2">
            {user?.username}
          </Typography>
          <Typography className="text-secondary mb-10" variant="body">
            {user?.email}
          </Typography>

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
