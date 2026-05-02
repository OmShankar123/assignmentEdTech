import { createInfiniteQuery } from 'react-query-kit';
import type { AxiosError } from 'axios';

import { client } from '../common';
import type { CoursesResponse } from './types';

interface UseCoursesParams {
  category?: string;
  query?: string;
}

export const useCourses = createInfiniteQuery<CoursesResponse, UseCoursesParams, AxiosError>({
  queryKey: ['courses'],
  fetcher: async (params, { pageParam, queryKey }) => {
    const [, queryParams] = queryKey as [string, UseCoursesParams];

    // Fetch both courses and "instructors" (random users) in parallel for a rich UI
    const [coursesRes, instructorsRes] = await Promise.all([
      client({
        url: '/public/randomproducts',
        method: 'GET',
        params: {
          page: pageParam,
          limit: 10,
          query: queryParams?.query,
        },
      }),
      client({
        url: '/public/randomusers',
        method: 'GET',
        params: {
          page: pageParam,
          limit: 10,
        },
      }),
    ]);

    const originalData = coursesRes.data.data;
    const instructors = instructorsRes.data.data.data;

    // Normalize and attach instructors
    const normalizedProducts = originalData.data.map((item: any, index: number) => ({
      _id: String(item.id),
      name: item.title,
      description: item.description,
      price: item.price,
      category: item.category,
      mainImage: {
        url: item.thumbnail,
        _id: String(item.id),
      },
      stock: item.stock || 50,
      // Add mock progress for assignment requirement (0 to 1)
      progress: Math.random() > 0.5 ? Math.random() : 0,
      // Attach an instructor from the random users list if available
      instructor: instructors?.length > 0 ? instructors[index % instructors.length] : undefined,
    }));

    return {
      ...coursesRes.data,
      data: {
        products: normalizedProducts,
        totalItems: originalData.totalItems,
        page: originalData.page,
        limit: originalData.limit,
        totalPages: originalData.totalPages,
      },
    };
  },
  getNextPageParam: (lastPage) => {
    const { page, totalPages } = lastPage.data;
    return page < totalPages ? page + 1 : undefined;
  },
  initialPageParam: 1,
});
