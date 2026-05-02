import { createMutation } from 'react-query-kit';
import type { AxiosError } from 'axios';

import { client } from '../common';
import type { LoginFormData } from './schemas';
import type { AuthResponse } from './types';

export const useLogin = createMutation<AuthResponse, LoginFormData, AxiosError>({
  mutationFn: async (variables) =>
    client({
      url: '/users/login',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
