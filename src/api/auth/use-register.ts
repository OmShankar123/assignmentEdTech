import { createMutation } from 'react-query-kit';
import type { AxiosError } from 'axios';

import { client } from '../common';
import type { RegisterFormData } from './schemas';
import type { RegisterResponse } from './types';

interface RegisterVariables extends RegisterFormData {
  role: string;
}

export const useRegister = createMutation<RegisterResponse, RegisterVariables, AxiosError>({
  mutationFn: async (variables) =>
    client({
      url: '/users/register',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
