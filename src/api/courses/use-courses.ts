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

    // We use the Public API for guaranteed list content, but normalize it to our Ecommerce shape
    return client({
      url: '/public/randomproducts',
      method: 'GET',
      params: {
        page: pageParam,
        limit: 10,
        query: queryParams?.query,
      },
    }).then((response) => {
      const originalData = response.data.data;

      // Normalize the Public API response to our Ecommerce Course shape
      const normalizedProducts = originalData.data.map((item: any) => ({
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
      }));

      return {
        ...response.data,
        data: {
          products: normalizedProducts,
          totalItems: originalData.totalItems,
          page: originalData.page,
          limit: originalData.limit,
          totalPages: originalData.totalPages,
        },
      };
    });
  },
  getNextPageParam: (lastPage) => {
    const { page, totalPages } = lastPage.data;
    return page < totalPages ? page + 1 : undefined;
  },
  initialPageParam: 1,
});
