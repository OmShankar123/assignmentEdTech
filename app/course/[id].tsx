import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  Share,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';

import type { Course } from '@/api/courses/types';
import { useCourseDetails } from '@/api/courses/use-course-details';
import Button from '@/components/Button';
import Typography from '@/components/Typography';
import { useBookmarkStore } from '@/store';
import { Colors } from '@/theme/colors';

export default function CourseDetail() {
  const { id, courseData } = useLocalSearchParams<{ id: string; courseData?: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const isBookmarked = useBookmarkStore((state) => state.bookmarks.some((b) => b._id === id));

  const { data: response, isLoading } = useCourseDetails({
    variables: { id: id! },
    enabled: !!id && !courseData,
  });

  const course = useMemo(() => {
    const initialCourse = courseData ? (JSON.parse(courseData) as Course) : null;

    if (response?.data) {
      return {
        ...response.data,
        instructor: initialCourse?.instructor || response.data.instructor,
      };
    }

    return initialCourse;
  }, [response, courseData]);

  const handleShare = async () => {
    if (!course) return;
    try {
      await Share.share({
        message: `Check out this amazing course: ${course.name} on MiniLMS! 🚀`,
        title: course.name,
      });
    } catch (error) {
      console.error('Sharing error:', error);
    }
  };

  const handleEmail = async () => {
    if (!course) return;
    const subject = `Question about ${course.name}`;
    const body = `Hi ${course.instructor?.name?.first},\n\nI have a question about your course on MiniLMS...`;
    const instructorEmail = course.instructor?.email || 'osinghania123@gmail.com';
    const url = `mailto:${instructorEmail}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening mail client:', error);
      Toast.show({
        type: 'error',
        text1: t('common.error_occurred'),
        text2: t('common.email_app_missing'),
      });
    }
  };

  if (isLoading && !course) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  if (!course) {
    return (
      <View className="flex-1 justify-center items-center px-10 bg-white">
        <Ionicons color={Colors.error} name="alert-circle-outline" size={64} />
        <Typography className="mt-4 text-center text-black" variant="h2">
          {t('common.something_went_wrong')}
        </Typography>
        <Button className="mt-6 w-full" title={t('common.ok')} onPress={() => router.back()} />
      </View>
    );
  }

  const instructorImage = course.instructor?.picture?.large || course.instructor?.picture?.medium;

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header Overlay */}
        <View
          className="absolute top-0 left-0 right-0 z-20 px-5 flex-row justify-between items-center"
          style={{ paddingTop: insets.top + 12 }}
        >
          <TouchableOpacity
            className="w-10 h-10 rounded-full justify-center items-center border bg-white/90 border-gray-100"
            onPress={() => router.back()}
          >
            <Feather color={Colors.text} name="arrow-left" size={20} />
          </TouchableOpacity>

          <View className="flex-row gap-3">
            <TouchableOpacity
              className="w-10 h-10 rounded-full justify-center items-center border bg-white/90 border-gray-100"
              onPress={handleShare}
            >
              <Feather color={Colors.primary} name="share-2" size={18} />
            </TouchableOpacity>

            <TouchableOpacity
              className="w-10 h-10 rounded-full justify-center items-center border bg-white/90 border-gray-100"
              onPress={() => course && toggleBookmark(course)}
            >
              <Ionicons
                color={isBookmarked ? Colors.primary : Colors.secondary}
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <Animated.View
            className="relative items-center justify-center bg-gray-100 h-[380px]"
            entering={FadeInDown.duration(800)}
          >
            {!course.mainImage?.url && (
              <Ionicons color={Colors.gray200} name="image-outline" size={64} />
            )}
            <Image
              cachePolicy="memory-disk"
              className="w-full h-full absolute"
              contentFit="cover"
              source={{ uri: course.mainImage?.url }}
              transition={500}
            />
            <View className="absolute bottom-6 left-5 bg-black/60 px-4 py-2 rounded-xl">
              <Typography
                className="text-white font-sans-bold uppercase tracking-wider"
                variant="caption"
              >
                {t('common.course')}
              </Typography>
            </View>
          </Animated.View>

          <View className="px-5 pt-6 pb-32">
            {/* Rating Row */}
            <Animated.View
              className="flex-row items-center mb-2"
              entering={FadeInUp.delay(200).duration(600)}
            >
              <View className="flex-row items-center mr-3">
                <AntDesign color={Colors.star} name="star" size={14} />
                <Typography className="ml-1" variant="bodySmallSemiBold">
                  4.5
                </Typography>
              </View>
              <Typography variant="caption">
                {String(t('course.reviews_count', { count: '1.2k' } as any))}
              </Typography>
            </Animated.View>

            {/* Title & Price */}
            <Animated.View entering={FadeInUp.delay(300).duration(600)}>
              <Typography className="mb-3 leading-tight" variant="h1">
                {course.name}
              </Typography>

              <View className="flex-row items-baseline mb-6">
                <Typography className="text-primary text-2xl" variant="h2">
                  ${course.price}
                </Typography>
              </View>
            </Animated.View>

            {/* Enhanced Instructor Section */}
            {course.instructor && (
              <Animated.View
                className="border p-5 rounded-[28px] mb-8 flex-row items-center bg-gray-50/80 border-gray-100"
                entering={FadeInUp.delay(400).duration(600)}
              >
                <View className="relative w-16 h-16">
                  <Image
                    className="bg-gray-200 w-full h-full rounded-2xl"
                    contentFit="cover"
                    source={{ uri: instructorImage }}
                    transition={300}
                  />
                  <View className="absolute -bottom-1 -right-1 rounded-full p-0.5 border bg-white border-gray-100">
                    <Ionicons color={Colors.success} name="checkmark-circle" size={18} />
                  </View>
                </View>

                <View className="ml-5 flex-1">
                  <Typography className="uppercase font-sans-bold mb-1" variant="caption">
                    {t('common.instructor')}
                  </Typography>
                  <Typography className="mb-1" variant="h3">
                    {course.instructor.name.first} {course.instructor.name.last}
                  </Typography>
                  <Typography className="text-primary font-sans-semibold" variant="caption">
                    {String(t('course.expert_in', { category: course.category } as any))}
                  </Typography>
                </View>

                <TouchableOpacity
                  className="w-10 h-10 rounded-full items-center justify-center border bg-white border-gray-100"
                  onPress={handleEmail}
                >
                  <Feather color={Colors.secondary} name="mail" size={18} />
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Specifications Grid */}
            <Animated.View
              className="flex-row justify-between mb-8"
              entering={FadeInUp.delay(500).duration(600)}
            >
              <View className="w-[48%] border p-4 rounded-2xl bg-white border-gray-100">
                <View className="w-10 h-10 rounded-xl items-center justify-center mb-3 bg-primaryLight">
                  <Feather color={Colors.primary} name="clock" size={20} />
                </View>
                <Typography variant="caption">{t('course.duration')}</Typography>
                <Typography variant="bodySmallSemiBold">12 Hours</Typography>
              </View>
              <View className="w-[48%] border p-4 rounded-2xl bg-white border-gray-100">
                <View className="w-10 h-10 rounded-xl items-center justify-center mb-3 bg-successLight">
                  <Feather color={Colors.success} name="users" size={20} />
                </View>
                <Typography variant="caption">{t('course.students')}</Typography>
                <Typography variant="bodySmallSemiBold">1.5k +</Typography>
              </View>
            </Animated.View>

            {/* About Section */}
            <Animated.View entering={FadeInUp.delay(600).duration(600)}>
              <Typography className="mb-3" variant="h3">
                {t('course.description')}
              </Typography>
              <Typography className="leading-7 mb-8 text-[15px]" variant="body">
                {course.description}
              </Typography>
            </Animated.View>
          </View>
        </ScrollView>

        {/* Sticky Bottom Bar */}
        <View
          className="absolute bottom-0 left-0 right-0 border-t px-5 pt-4 flex-row items-center bg-white border-gray-100"
          style={{ paddingBottom: Math.max(insets.bottom, 24) }}
        >
          <View className="flex-1">
            <Typography variant="caption">{t('course.total_price')}</Typography>
            <Typography className="text-2xl" variant="h2">
              ${course.price}
            </Typography>
          </View>
          <View className="flex-[1.5]">
            <Button
              title={t('course.enroll_now')}
              onPress={() =>
                router.push({
                  pathname: '/portal/[id]',
                  params: { id: course._id, title: course.name },
                })
              }
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
