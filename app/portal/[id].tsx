import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Platform, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useCourseDetails } from '@/api/courses/use-course-details';
import Header from '@/components/Header';
import Typography from '@/components/Typography';
import { useUserStore } from '@/store/useUserStore';
import { Colors } from '@/theme/colors';

export default function WebPortal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useUserStore();
  const { data: response, isLoading } = useCourseDetails({ variables: { id: id! } });
  const course = response?.data;

  const localHtmlTemplate = useMemo(() => {
    if (!course) return '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            padding: 20px;
            color: #1A1A1A;
            line-height: 1.6;
            background-color: #f8fafc;
          }
          .card {
            background: white;
            padding: 24px;
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            margin-bottom: 20px;
          }
          .title {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 12px;
            color: ${Colors.primary};
          }
          .instructor {
            color: ${Colors.secondary};
            font-weight: 600;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
          }
          .description {
            font-size: 16px;
            color: #4B5563;
          }
          .badge {
            display: inline-block;
            background: ${Colors.primary}20;
            color: ${Colors.primary};
            padding: 4px 12px;
            border-radius: 99px;
            font-size: 12px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 12px;
            color: #9CA3AF;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">${course.category.toUpperCase()}</div>
          <div class="title">${course.name}</div>
          <div class="instructor">By ${course.instructor?.name?.first || 'Expert Instructor'}</div>
          <div class="description">${course.description}</div>
        </div>
        <div class="card">
          <div class="title" style="font-size: 18px">Course Content</div>
          <p>Welcome to the learning portal, <b>${user?.username || 'Student'}</b>! This content is being served from a local HTML template with native communication enabled via headers.</p>
        </div>
        <div class="footer">
          &copy; 2026 MiniLMS Learning System
        </div>
      </body>
      </html>
    `;
  }, [course, user]);

  if (isLoading || !course) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator color={Colors.primary} size="large" />
      </SafeAreaView>
    );
  }

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
          title={course.name}
          onBackPress={() => router.back()}
        />
      </View>

      <WebView
        className="flex-1"
        originWhitelist={['*']}
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
        source={{
          html: localHtmlTemplate,
          headers: {
            'X-Course-Id': id,
            'X-User-Role': user?.role || 'student',
            'X-App-Platform': Platform.OS === 'ios' ? 'iOS' : 'Android',
          },
        }}
        startInLoadingState={true}
      />
    </SafeAreaView>
  );
}
