import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

import type { Course } from '@/api/courses/types';
import { Colors } from '@/theme/colors';

import Typography from './Typography';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const router = useRouter();
  const { t } = useTranslation();

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
      className="bg-white rounded-[32px] overflow-hidden mb-8 border border-gray100 shadow-lg shadow-gray200"
      onPress={handlePress}
    >
      {/* Hero Section */}
      <View className="w-full bg-gray100 relative" style={{ height: 220 }}>
        <Image
          cachePolicy="memory-disk"
          contentFit="cover"
          source={{ uri: course.mainImage?.url }}
          style={{ width: '100%', height: '100%' }}
          transition={500}
        />

        {/* Floating Category */}
        <View className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-xl">
          <Typography className="text-primary font-sans-bold uppercase" variant="caption">
            {t('common.course')}
          </Typography>
        </View>

        {/* Floating Bookmark */}
        <TouchableOpacity className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full items-center justify-center">
          <Feather color={Colors.primary} name="bookmark" size={18} />
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
            <Typography className="text-black leading-7" numberOfLines={2} variant="h3">
              {course.name}
            </Typography>
          </View>
          <Typography className="text-primary font-sans-bold text-xl" variant="h3">
            ${course.price}
          </Typography>
        </View>

        {/* Description */}
        <Typography className="text-gray-400 mb-4 leading-6" numberOfLines={2} variant="bodySmall">
          {course.description}
        </Typography>

        {/* Footer: Instructor & Stats */}
        <View className="flex-row items-center justify-between border-t border-gray-50 pt-4">
          {course.instructor && (
            <View className="flex-row items-center">
              <View style={{ width: 32, height: 32 }}>
                <Image
                  className="bg-gray200 border-2 border-white"
                  source={{ uri: course.instructor.picture.thumbnail }}
                  style={{ width: '100%', height: '100%', borderRadius: 16 }}
                />
              </View>
              <View className="ml-2.5">
                <Typography
                  className="text-gray-400 text-[10px] uppercase font-sans-bold"
                  variant="caption"
                >
                  {t('common.instructor')}
                </Typography>
                <Typography className="text-black" variant="bodySmallSemiBold">
                  {course.instructor.name.first} {course.instructor.name.last}
                </Typography>
              </View>
            </View>
          )}

          <View className="flex-row items-center bg-gray50 px-3 py-1.5 rounded-xl">
            <Feather color={Colors.secondary} name="clock" size={14} />
            <Typography className="ml-2 text-gray-500 font-sans-semibold" variant="caption">
              12h
            </Typography>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CourseCard;
