import React from 'react';
import { Tabs } from 'expo-router';

import { TabBarIcon } from '@/components/TabBarIcon';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Courses',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon color={color} focused={focused} name="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon color={color} focused={focused} name="settings" />
          ),
        }}
      />
    </Tabs>
  );
}
