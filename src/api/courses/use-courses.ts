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
    const category =
      queryParams?.category && queryParams.category !== 'All'
        ? queryParams.category.toLowerCase()
        : undefined;

    return client({
      url: '/public/randomproducts',
      method: 'GET',
      params: {
        page: pageParam,
        limit: 10,
        category,
        query: queryParams?.query, // Add search query
      },
    }).then((response) => response.data);
  },
  getNextPageParam: (lastPage) => {
    const { page, totalPages } = lastPage.data;
    return page < totalPages ? page + 1 : undefined;
  },
  initialPageParam: 1,
});
