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
  const { user, enrollCourse, enrolledCourses } = useUserStore();
  const { data: response, isLoading } = useCourseDetails({ variables: { id: id! } });
  const course = response?.data;
  const isEnrolled = enrolledCourses.includes(id!);

  const localHtmlTemplate = useMemo(() => {
    if (!course) return '';

    const bgColor = '#f8fafc';
    const cardColor = 'white';
    const textColor = '#1A1A1A';
    const subTextColor = '#4B5563';
    const borderColor = '#e2e8f0';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            padding: 20px;
            color: ${textColor};
            line-height: 1.6;
            background-color: ${bgColor};
          }
          .card {
            background: ${cardColor};
            padding: 24px;
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            margin-bottom: 20px;
            border: 1px solid ${borderColor};
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
            color: ${subTextColor};
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
          .btn {
            display: block;
            width: 100%;
            background: ${Colors.primary};
            color: white;
            text-align: center;
            padding: 16px;
            border-radius: 12px;
            font-weight: 700;
            text-decoration: none;
            margin-top: 20px;
            border: none;
            cursor: pointer;
          }
          .btn:disabled {
            background: #9CA3AF;
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
          <div class="instructor">${t('common.instructor')}: ${course.instructor?.name?.first || t('common.expert')}</div>
          <div class="description">${course.description}</div>
        </div>
        <div class="card">
          <div class="title" style="font-size: 18px">${t('common.enrollment') || 'Enrollment'}</div>
          <p>${t('portal.welcome_msg', { name: user?.username || t('common.student') })}</p>
          <button id="enrollBtn" class="btn" onclick="enroll()" ${isEnrolled ? 'disabled' : ''}>
            ${isEnrolled ? t('common.enrolled') : t('common.enroll_now')}
          </button>
        </div>
        <div class="footer">
          &copy; 2026 MiniLMS
        </div>
        <script>
          function enroll() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ENROLL', courseId: '${id}' }));
          }
        </script>
      </body>
      </html>
    `;
  }, [course, user, id, isEnrolled, t]);

  if (isLoading || !course) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator color={Colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'ENROLL') {
        enrollCourse(data.courseId);
      }
    } catch (e) {
      console.error('WebView Message Error:', e);
    }
  };

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
        onMessage={handleMessage}
      />
    </SafeAreaView>
  );
}
