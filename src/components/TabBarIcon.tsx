import React from 'react';
import { Image, type ImageSourcePropType } from 'react-native';
import { homeIcon, settingsIcon } from '@/assets';

const icons: Record<string, ImageSourcePropType> = {
  home: homeIcon,
  settings: settingsIcon,
};

interface TabBarIconProps {
  color: string;
  name: string;
  focused?: boolean;
}

export function TabBarIcon({ color, name }: TabBarIconProps) {
  return (
    <Image
      accessibilityIgnoresInvertColors
      source={icons[name]}
      style={{ tintColor: color, width: 24, height: 24 }}
      resizeMode="contain"
    />
  );
}
