import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';

import type { Course } from '@/api/courses/types';
import { useCourseDetails } from '@/api/courses/use-course-details';
import Button from '@/components/Button';
import Typography from '@/components/Typography';
import { Colors } from '@/theme/colors';

export default function CourseDetail() {
  const { id, courseData } = useLocalSearchParams<{ id: string; courseData?: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
        <Typography className="mt-4 text-center" variant="h2">
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
            className="w-10 h-10 bg-white/90 rounded-full justify-center items-center shadow-sm"
            onPress={() => router.back()}
          >
            <Feather color="black" name="arrow-left" size={20} />
          </TouchableOpacity>

          <TouchableOpacity className="w-10 h-10 bg-white/90 rounded-full justify-center items-center shadow-sm">
            <Ionicons color={Colors.error} name="heart-outline" size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <View className="bg-gray100 relative" style={{ height: 380 }}>
            <Image
              cachePolicy="memory-disk"
              contentFit="cover"
              source={{ uri: course.mainImage?.url }}
              style={{ width: '100%', height: '100%' }}
              transition={500}
            />
            <View className="absolute bottom-6 left-5 bg-black/40 px-3 py-1.5 rounded-lg">
              <Typography className="text-white font-sans-bold uppercase" variant="caption">
                {t('common.course')}
              </Typography>
            </View>
          </View>

          <View className="px-5 pt-6 pb-32">
            {/* Rating Row */}
            <View className="flex-row items-center mb-2">
              <View className="flex-row items-center mr-3">
                <AntDesign color={Colors.star} name="star" size={14} />
                <Typography className="ml-1 text-black" variant="bodySmallSemiBold">
                  4.5
                </Typography>
              </View>
              <Typography className="text-gray-400" variant="caption">
                {String(t('course.reviews_count', { count: '1.2k' } as any))}
              </Typography>
            </View>

            {/* Title & Price */}
            <Typography className="text-black mb-3 leading-tight" variant="h1">
              {course.name}
            </Typography>

            <View className="flex-row items-baseline mb-6">
              <Typography className="text-primary text-2xl" variant="h2">
                ${course.price}
              </Typography>
            </View>

            {/* Enhanced Instructor Section */}
            {course.instructor && (
              <View className="bg-gray-50/80 border border-gray100 p-5 rounded-[28px] mb-8 flex-row items-center">
                <View className="relative" style={{ width: 64, height: 64 }}>
                  <Image
                    className="bg-gray200"
                    contentFit="cover"
                    source={{ uri: instructorImage }}
                    style={{ width: '100%', height: '100%', borderRadius: 16 }}
                    transition={300}
                  />
                  <View className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                    <Ionicons color={Colors.success} name="checkmark-circle" size={18} />
                  </View>
                </View>

                <View className="ml-5 flex-1">
                  <Typography
                    className="text-gray-400 uppercase font-sans-bold mb-1"
                    variant="caption"
                  >
                    {t('common.instructor')}
                  </Typography>
                  <Typography className="text-black mb-1" variant="h3">
                    {course.instructor.name.first} {course.instructor.name.last}
                  </Typography>
                  <Typography className="text-primary font-sans-semibold" variant="caption">
                    {String(t('course.expert_in', { category: course.category } as any))}
                  </Typography>
                </View>

                <TouchableOpacity className="bg-white w-10 h-10 rounded-full items-center justify-center shadow-sm border border-gray100">
                  <Feather color={Colors.primary} name="mail" size={18} />
                </TouchableOpacity>
              </View>
            )}

            {/* Specifications Grid */}
            <View className="flex-row justify-between mb-8">
              <View className="w-[48%] bg-white border border-gray100 p-4 rounded-2xl shadow-sm">
                <View className="w-10 h-10 bg-primaryLight rounded-xl items-center justify-center mb-3">
                  <Feather color={Colors.primary} name="clock" size={20} />
                </View>
                <Typography className="text-gray-400" variant="caption">
                  {t('course.duration')}
                </Typography>
                <Typography className="text-black" variant="bodySmallSemiBold">
                  12 Hours
                </Typography>
              </View>
              <View className="w-[48%] bg-white border border-gray100 p-4 rounded-2xl shadow-sm">
                <View className="w-10 h-10 bg-successLight rounded-xl items-center justify-center mb-3">
                  <Feather color={Colors.success} name="users" size={20} />
                </View>
                <Typography className="text-gray-400" variant="caption">
                  {t('course.students')}
                </Typography>
                <Typography className="text-black" variant="bodySmallSemiBold">
                  1.5k +
                </Typography>
              </View>
            </View>

            {/* About Section */}
            <Typography className="text-black mb-3" variant="h3">
              {t('course.description')}
            </Typography>
            <Typography className="text-secondary leading-7 mb-8 text-[15px]" variant="body">
              {course.description}
            </Typography>
          </View>
        </ScrollView>

        {/* Sticky Bottom Bar */}
        <View
          className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray100 px-5 pt-4 flex-row items-center"
          style={{ paddingBottom: Math.max(insets.bottom, 24) }}
        >
          <View className="flex-1">
            <Typography className="text-gray-400" variant="caption">
              {t('course.total_price')}
            </Typography>
            <Typography className="text-black text-2xl" variant="h2">
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
