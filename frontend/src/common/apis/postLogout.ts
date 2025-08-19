import { API_ENDPOINTS } from '../constants/apiEndpoints';

import { apiClient } from './apiClient';

export const postLogout = async () => {
  return await apiClient.post({
    endpoint: API_ENDPOINTS.LOGOUT,
    withCredentials: true,
  });
};
