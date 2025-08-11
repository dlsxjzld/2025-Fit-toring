import { apiClient } from '../../../common/apis/apiClient';
import { API_ENDPOINTS } from '../../../common/constants/apiEndpoints';
import { StatusTypeEnum } from '../../../common/types/statusType';

import type {
  ClientParticipatedMentoringType,
  ServerParticipatedMentoringResponse,
} from '../types/participatedMentoring';

const convertToClientResponse = (
  serverResponse: ServerParticipatedMentoringResponse[],
): ClientParticipatedMentoringType[] => {
  return serverResponse.map((item) => {
    return {
      ...item,
      status: StatusTypeEnum[item.status],
    };
  });
};

export const getParticipatedMentoringList = async () => {
  const serverResponse = await apiClient.get<
    ServerParticipatedMentoringResponse[]
  >({
    endpoint: API_ENDPOINTS.PARTICIPATED_MENTORING,
    withCredentials: true,
  });

  return convertToClientResponse(serverResponse);
};
