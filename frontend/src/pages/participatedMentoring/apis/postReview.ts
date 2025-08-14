import { apiClient } from '../../../common/apis/apiClient';
import { API_ENDPOINTS } from '../../../common/constants/apiEndpoints';

interface postReviewParam {
  reservationId: number;
  rating: number;
  content: string;
}

export const postReview = async ({
  reservationId,
  rating,
  content,
}: postReviewParam) => {
  return await apiClient.post({
    endpoint: API_ENDPOINTS.REVIEWS,
    body: { reservationId, rating, content },
    withCredentials: true,
  });
};
