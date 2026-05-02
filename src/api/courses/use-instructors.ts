import { createQuery } from 'react-query-kit';
import type { AxiosError } from 'axios';

import { client } from '../common';
import type { InstructorsResponse } from './types';

interface UseInstructorsParams {
  page: number;
  limit: number;
}

export const useInstructors = createQuery<InstructorsResponse, UseInstructorsParams, AxiosError>({
  queryKey: ['instructors'],
  fetcher: async (params) =>
    client({
      url: '/public/randomusers',
      method: 'GET',
      params,
    }).then((response) => response.data),
});
