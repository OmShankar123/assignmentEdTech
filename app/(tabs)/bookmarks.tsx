import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';

import { useCourses } from '@/api/courses/use-courses';
import CourseCard from '@/components/CourseCard';
import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typography from '@/components/Typography';
import { useBookmarkStore } from '@/store';

export default function BookmarksScreen() {
  const { t } = useTranslation();
  const { bookmarkedIds } = useBookmarkStore();

  // Use the same default variables as Home to increase chance of cache hits and consistency
  const { data: coursesData, isLoading } = useCourses();

  const bookmarkedCourses = useMemo(() => {
    if (!coursesData) return [];

    // Flatten all pages and get all products
    const allCourses = coursesData.pages.flatMap((page) => page.data.products);

    // Filter by bookmarked IDs
    // We check both _id and id for robustness during API normalization
    return allCourses.filter(
      (course) =>
        bookmarkedIds.includes(course._id) || bookmarkedIds.includes(String((course as any).id)),
    );
  }, [coursesData, bookmarkedIds]);

  return (
    <ScreenWrapper contentPadding={false} showLoader={isLoading}>
      <View className="flex-1 px-5">
        <Header showBackButton={false} title={t('common.bookmarks') || 'Bookmarks'} />

        {bookmarkedCourses.length > 0 ? (
          <FlatList
            className="mt-4"
            contentContainerStyle={{ paddingBottom: 100 }}
            data={bookmarkedCourses}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <CourseCard course={item} />}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex-1 justify-center items-center pb-20">
            <View className="w-20 h-20 bg-gray-100 rounded-full justify-center items-center mb-4">
              <Typography className="text-secondary" variant="h1">
                🔖
              </Typography>
            </View>
            <Typography className="text-center text-text mb-2" variant="h3">
              {t('common.no_bookmarks_title') || 'No Bookmarks Yet'}
            </Typography>
            <Typography className="text-center text-secondary px-10" variant="body">
              {t('common.no_bookmarks_desc') ||
                'Courses you bookmark will appear here for quick access.'}
            </Typography>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}
