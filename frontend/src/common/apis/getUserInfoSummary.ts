import { API_ENDPOINTS } from '../constants/apiEndpoints';

import { apiClient } from './apiClient';

import type { UserInfoResponse } from '../types/userInfoResponse';

export const getUserInfoSummary = async () => {
  return await apiClient.get<UserInfoResponse>({
    endpoint: API_ENDPOINTS.MEMBERS,
    withCredentials: true,
  });
};
