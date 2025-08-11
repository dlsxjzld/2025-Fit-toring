import { apiClient } from '../../../common/apis/apiClient';
import { API_ENDPOINTS } from '../../../common/constants/apiEndpoints';

import type { MentoringApplicationStatus } from '../../../common/types/mentoringApplicationStatus';

export const patchReservationStatus = async (
  reservationId: number,
  searchParams: { status: MentoringApplicationStatus },
) => {
  return await apiClient.patch({
    endpoint: `${API_ENDPOINTS.RESERVATION}/${reservationId}${API_ENDPOINTS.PATCH_MENTORING_STATUS}`,
    searchParams,
    withCredentials: true,
  });
};
