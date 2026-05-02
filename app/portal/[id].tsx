import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import { Colors } from '@/theme/colors';

export default function WebPortal() {
  const { id, title } = useLocalSearchParams<{ id: string; title: string }>();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <ScreenWrapper className="flex-1 bg-white" contentPadding={false} showBackgroundShape={false}>
      <View className="px-5 pt-2 border-b border-gray100">
        <Header
          rightIcon={
            <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
              <Ionicons color={Colors.text} name="close-outline" size={24} />
            </TouchableOpacity>
          }
          showBackButton={true}
          title={title || String(t('course.content'))}
          onBackPress={() => router.back()}
        />
      </View>

      <WebView
        className="flex-1"
        renderLoading={() => (
          <View className="absolute inset-0 justify-center items-center bg-white">
            <ActivityIndicator color={Colors.primary} size="large" />
          </View>
        )}
        source={{ uri: `https://freeapi.app/course-demo/${id}` }} // Mocked portal URL
        startInLoadingState={true}
      />
    </ScreenWrapper>
  );
}
