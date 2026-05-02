import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Image } from 'expo-image';

import type { Course } from '@/api/courses/types';
import { Colors } from '@/theme/colors';

import Typography from './Typography';

interface CourseCardProps {
  course: Course;
  onPress?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      className="bg-white rounded-2xl overflow-hidden mb-4 shadow-sm border border-gray-100"
      onPress={onPress}
    >
      <Image
        cachePolicy="memory-disk"
        className="w-full h-48"
        contentFit="cover"
        source={{ uri: course.thumbnail || (course.images && course.images[0]) }}
        style={{
          width: '100%',
          height: 192,
          backgroundColor: '#F0F9FA', // Light primary tint
        }}
        transition={500}
        onError={(err) => console.log(`❌ Image Error: ${course.title}`, err)}
        onLoad={() => console.log(`✅ Image Loaded: ${course.title}`)}
      />

      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1 mr-2">
            <Typography className="text-black" numberOfLines={1} variant="h3">
              {course.title}
            </Typography>
          </View>
          <View className="bg-primary/10 px-2 py-1 rounded-lg">
            <Typography className="text-primary" variant="bodySmallSemiBold">
              ${course.price}
            </Typography>
          </View>
        </View>

        <Typography className="text-secondary mb-4" numberOfLines={2} variant="bodySmall">
          {course.description}
        </Typography>

        <View className="flex-row items-center justify-between border-t border-gray-50 pt-3">
          <View className="flex-row items-center">
            <AntDesign color={Colors.star} name="star" size={14} />
            <Typography className="ml-1 text-gray-600" variant="caption">
              {course.rating} (1.2k)
            </Typography>
          </View>

          <View className="flex-row items-center">
            <Typography className="text-primary font-sans-semibold" variant="caption">
              {t('common.view_details')}
            </Typography>
            <AntDesign className="ml-1" color={Colors.primary} name="right" size={12} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CourseCard;
