import { createQuery } from 'react-query-kit';
import type { AxiosError } from 'axios';

import { client } from '../common';
import type { Course } from './types';

export interface CourseDetailsResponse {
  data: Course;
  message: string;
  success: boolean;
}

interface UseCourseDetailsParams {
  id: string | number;
}

export const useCourseDetails = createQuery<
  CourseDetailsResponse,
  UseCourseDetailsParams,
  AxiosError
>({
  queryKey: ['course-details'],
  fetcher: async (params) =>
    client({
      url: `/public/randomproducts/${params.id}`,
      method: 'GET',
    }).then((response) => {
      const item = response.data.data;

      // Normalize to our Ecommerce Course shape
      const normalizedCourse: Course = {
        _id: String(item.id),
        name: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        mainImage: {
          url: item.thumbnail,
          _id: `img-${item.id}`,
          localPath: '',
        },
        subImages: (item.images || []).map((imgUrl: string, idx: number) => ({
          url: imgUrl,
          _id: `sub-${item.id}-${idx}`,
          localPath: '',
        })),
        stock: item.stock || 50,
      };

      return {
        ...response.data,
        data: normalizedCourse,
      };
    }),
});
