import React from 'react';
import { Text } from 'react-native';

import Button from '@/components/Button';
import ScreenWrapper from '@/components/ScreenWrapper';
import { useUserStore } from '@/store/useUserStore';

export default function Profile() {
  const { user, logout } = useUserStore();

  return (
    <ScreenWrapper className="flex-1 p-4 items-center justify-center">
      <Text className="text-2xl font-bold mb-2">Profile</Text>
      <Text className="text-lg text-gray-700 mb-6">{user?.email}</Text>

      <Button className="w-full max-w-xs" title="Logout" type="outline" onPress={logout} />
    </ScreenWrapper>
  );
}
