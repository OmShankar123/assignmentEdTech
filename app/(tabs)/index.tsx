import React from 'react';
import { Text, View } from 'react-native';

import ScreenWrapper from '@/components/ScreenWrapper';

export default function CourseCatalog() {
  return (
    <ScreenWrapper className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Course Catalog</Text>
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Infinite scroll list will go here.</Text>
      </View>
    </ScreenWrapper>
  );
}
