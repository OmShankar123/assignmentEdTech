import React from 'react';
import { Image, type ImageSourcePropType } from 'react-native';

import { ICONS } from '@/assets';

const icons: Record<string, ImageSourcePropType> = {
  home: ICONS.home,
  settings: ICONS.settings,
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
      resizeMode="contain"
      source={icons[name]}
      style={{ tintColor: color, width: 24, height: 24 }}
    />
  );
}
