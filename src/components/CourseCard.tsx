import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

import type { Course } from '@/api/courses/types';
import { useBookmarkStore } from '@/store';
import { Colors } from '@/theme/colors';

import Typography from './Typography';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarks.some((b) => b._id === course._id),
  );

  const handlePress = () => {
    router.push({
      pathname: '/course/[id]',
      params: {
        id: course._id,
        courseData: JSON.stringify(course),
      },
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      className="bg-white border-gray100 rounded-[32px] overflow-hidden mb-8 border shadow-lg shadow-gray200"
      onPress={handlePress}
    >
      {/* Hero Section */}
      <View className="w-full relative bg-gray100" style={{ height: 220 }}>
        <Image
          cachePolicy="memory-disk"
          contentFit="cover"
          source={{ uri: course.mainImage?.url }}
          style={{ width: '100%', height: '100%' }}
          transition={500}
        />

        {/* Floating Category */}
        <View className="absolute top-4 left-4 px-3 py-1.5 rounded-xl border bg-white/90 border-transparent">
          <Typography className="text-primary font-sans-bold uppercase" variant="caption">
            {t('common.course')}
          </Typography>
        </View>

        {/* Floating Bookmark */}
        <TouchableOpacity
          className="absolute top-4 right-4 w-10 h-10 rounded-full items-center justify-center border bg-white/90 border-transparent"
          onPress={(e) => {
            e.stopPropagation();
            toggleBookmark(course);
          }}
        >
          <Ionicons
            color={isBookmarked ? Colors.primary : Colors.secondary}
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={20}
          />
        </TouchableOpacity>

        {/* Rating Badge */}
        <View className="absolute bottom-4 left-4 bg-black/40 px-2 py-1 rounded-lg flex-row items-center">
          <AntDesign color={Colors.star} name="star" size={12} />
          <Typography className="text-white ml-1.5 font-sans-bold" variant="caption">
            4.5
          </Typography>
        </View>
      </View>

      <View className="p-6">
        {/* Title & Price Row */}
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1 mr-4">
            <Typography className="leading-7" numberOfLines={2} variant="h3">
              {course.name}
            </Typography>
          </View>
          <Typography className="text-primary font-sans-bold text-xl" variant="h3">
            ${course.price}
          </Typography>
        </View>

        {/* Description */}
        <Typography className="mb-4 leading-6" numberOfLines={2} variant="bodySmall">
          {course.description}
        </Typography>

        {/* Progress Bar (Assignment Requirement) */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Typography className="uppercase font-sans-bold" variant="caption">
              {t('common.progress') || 'Progress'}
            </Typography>
            <Typography className="text-primary font-sans-bold" variant="caption">
              {Math.round((course.progress || 0) * 100)}%
            </Typography>
          </View>
          <View className="w-full h-2 rounded-full overflow-hidden bg-gray100">
            <View
              className="h-full bg-primary"
              style={{ width: `${Math.round((course.progress || 0) * 100)}%` }}
            />
          </View>
        </View>

        {/* Footer: Instructor & Stats */}
        <View className="flex-row items-center justify-between border-t pt-4 border-gray-50">
          {course.instructor && (
            <View className="flex-row items-center">
              <View style={{ width: 32, height: 32 }}>
                <Image
                  className="border-2 bg-gray200 border-white"
                  source={{ uri: course.instructor.picture.thumbnail }}
                  style={{ width: '100%', height: '100%', borderRadius: 16 }}
                />
              </View>
              <View className="ml-2.5">
                <Typography className="text-[10px] uppercase font-sans-bold" variant="caption">
                  {t('common.instructor')}
                </Typography>
                <Typography variant="bodySmallSemiBold">
                  {course.instructor.name.first} {course.instructor.name.last}
                </Typography>
              </View>
            </View>
          )}

          <View className="flex-row items-center px-3 py-1.5 rounded-xl bg-gray50">
            <Feather color={Colors.secondary} name="clock" size={14} />
            <Typography className="ml-2 font-sans-semibold" variant="caption">
              12h
            </Typography>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CourseCard;
