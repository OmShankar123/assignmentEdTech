import { createQuery } from 'react-query-kit';
import type { AxiosError } from 'axios';

import { client } from '../common';

export interface Category {
  _id: string;
  name: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  data: {
    categories: Category[];
    totalCategories: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
  success: boolean;
}

export const useCategories = createQuery<CategoriesResponse, void, AxiosError>({
  queryKey: ['categories'],
  fetcher: async () =>
    client({
      url: '/ecommerce/categories',
      method: 'GET',
    }).then((response) => response.data),
});
