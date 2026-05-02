import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import Header from '@/components/Header';
import Typography from '@/components/Typography';
import { Colors } from '@/theme/colors';

export default function WebPortal() {
  const { id, title } = useLocalSearchParams<{ id: string; title: string }>();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 border-b border-gray-100">
        <Header
          rightIcon={
            <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
              <Ionicons color={Colors.text} name="close-outline" size={28} />
            </TouchableOpacity>
          }
          showBackButton={true}
          title={title || String(t('course.content'))}
          onBackPress={() => router.back()}
        />
      </View>

      <WebView
        className="flex-1"
        renderError={(errorName) => (
          <View className="flex-1 justify-center items-center px-10 bg-white">
            <Ionicons color={Colors.secondary} name="cloud-offline-outline" size={64} />
            <Typography className="mt-4 text-center" variant="h2">
              {t('common.error_occurred')}
            </Typography>
            <Typography className="mt-2 text-center text-gray-500" variant="body">
              {errorName}
            </Typography>
            <TouchableOpacity
              className="mt-8 px-8 py-3 rounded-full bg-primary"
              onPress={() => router.back()}
            >
              <Typography className="text-white" variant="button">
                {t('common.go_back')}
              </Typography>
            </TouchableOpacity>
          </View>
        )}
        renderLoading={() => (
          <View className="absolute inset-0 justify-center items-center bg-white">
            <ActivityIndicator color={Colors.primary} size="large" />
          </View>
        )}
        source={{ uri: `https://freeapi.app/course-demo/${id}` }}
        startInLoadingState={true}
      />
    </SafeAreaView>
  );
}
