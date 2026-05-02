import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LegendList } from '@legendapp/list';

import type { Course } from '@/api/courses/types';
import { useCategories } from '@/api/courses/use-categories';
import { useCourses } from '@/api/courses/use-courses';
import CourseCard from '@/components/CourseCard';
import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typography from '@/components/Typography';
import { useDebounce } from '@/hooks/useDebounce';
import { Colors } from '@/theme/colors';

export default function CourseCatalog() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 500);
  const flatListRef = React.useRef<FlatList>(null);

  // Fetch Categories
  const { data: categoriesData } = useCategories();
  const categories = useMemo(() => {
    const raw = categoriesData?.data?.categories || [];
    if (raw.length === 0) {
      return ['All', 'Development', 'Design', 'Business', 'Marketing', 'Laptops', 'Smartphones'];
    }
    return ['All', ...raw.map((c) => c.name.charAt(0).toUpperCase() + c.name.slice(1))];
  }, [categoriesData]);

  // Fetch Courses with Category Filter
  const { data, isLoading, refetch, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCourses({
      variables: {
        category: selectedCategory,
        query: debouncedQuery,
      },
    });

  const courses = data?.pages.flatMap((page) => page.data.data) || [];

  const onCategoryPress = (index: number, category: string) => {
    setSelectedCategory(category);
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  const renderItem = ({ item }: { item: Course }) => (
    <CourseCard course={item} onPress={() => console.log('Course Pressed:', item.title)} />
  );

  return (
    <ScreenWrapper className="flex-1" contentPadding={false} showBackgroundShape={true}>
      <View className="px-5 pt-2">
        <Header
          leftIcon={
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-primary rounded-xl justify-center items-center">
                <Ionicons color="white" name="book" size={20} />
              </View>
              <Typography className="ml-3 text-black" variant="h2">
                {t('common.explore')}
              </Typography>
            </View>
          }
          showBackButton={false}
        />

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 h-12 px-4 rounded-xl mt-6 mb-4">
          <Ionicons color={Colors.iconSecondary} name="search" size={20} />
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            className="flex-1 ml-2 text-black h-full"
            placeholder={t('common.search_placeholder')}
            placeholderTextColor={Colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons color={Colors.placeholder} name="close-circle" size={18} />
            </TouchableOpacity>
          )}
        </View>

        {/* Dynamic Category Filter */}
        <View className="mb-6">
          <FlatList
            ref={flatListRef}
            horizontal
            contentContainerStyle={{ paddingRight: 20 }}
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                className={`px-4 py-2 rounded-full mr-2 ${
                  selectedCategory === item ? 'bg-primary' : 'bg-gray-100'
                }`}
                onPress={() => onCategoryPress(index, item)}
              >
                <Typography
                  className={selectedCategory === item ? 'text-white' : 'text-gray-600'}
                  variant="bodySmallSemiBold"
                >
                  {item}
                </Typography>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>

      <View className="flex-1 px-5" style={{ flex: 1 }}>
        {isLoading && !isRefetching ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator color={Colors.primary} size="large" />
          </View>
        ) : (
          <LegendList
            data={courses}
            estimatedItemSize={300}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center py-20">
                <Ionicons color={Colors.placeholder} name="search-outline" size={48} />
                <Typography className="text-gray-500 mt-4" variant="body">
                  {t('common.no_courses')}
                </Typography>
              </View>
            }
            ListFooterComponent={
              isFetchingNextPage ? (
                <View className="py-4">
                  <ActivityIndicator color={Colors.primary} />
                </View>
              ) : null
            }
            refreshing={isRefetching}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
            onRefresh={refetch}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}
