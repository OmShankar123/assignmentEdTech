import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'expo-router';

import { TabBarIcon } from '@/components/TabBarIcon';

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('common.courses'),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon color={color} focused={focused} name="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: t('common.bookmarks') || 'Bookmarks',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon color={color} focused={focused} name="bookmark" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('common.profile') || 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon color={color} focused={focused} name="settings" />
          ),
        }}
      />
    </Tabs>
  );
}
