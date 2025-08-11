import { apiClient } from '../../../common/apis/apiClient';
import { API_ENDPOINTS } from '../../../common/constants/apiEndpoints';
import { StatusTypeEnum } from '../../../common/types/statusType';

import type {
  ClientMentoringApplication,
  ServerMentoringApplicationResponse,
} from '../types/mentoringApplication';

const convertToClientResponse = (
  response: ServerMentoringApplicationResponse[],
): ClientMentoringApplication[] => {
  return response.map((item) => {
    return {
      ...item,
      status: StatusTypeEnum[item.status],
    };
  });
};

export const getMentoringApplicationList = async () => {
  const serverResponse = await apiClient.get<
    ServerMentoringApplicationResponse[]
  >({
    endpoint: API_ENDPOINTS.CREATED_MENTORING,
    withCredentials: true,
  });

  return convertToClientResponse(serverResponse);
};
