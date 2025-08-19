import { apiClient } from '../../../common/apis/apiClient';
import { API_ENDPOINTS } from '../../../common/constants/apiEndpoints';

import type { MentoringUpdateFormData } from '../types/mentoringUpdateForm';

type CertificateInfoWithoutId = Omit<
  MentoringUpdateFormData['certificateInfos'][number],
  'id'
>;

interface MentoringUpdateFormDataWithoutId
  extends Omit<MentoringUpdateFormData, 'certificateInfos'> {
  certificateInfos: CertificateInfoWithoutId[];
}

interface PutMentoringParams {
  mentoringData: MentoringUpdateFormDataWithoutId;
  profileImageFile: File | null;
  certificateImageFiles: File[];
  mentoringId: string;
}

export const putMentoring = async ({
  mentoringData,
  profileImageFile,
  certificateImageFiles,
  mentoringId,
}: PutMentoringParams) => {
  const formData = new FormData();

  const jsonBlob = new Blob([JSON.stringify(mentoringData)], {
    type: 'application/json',
  });
  formData.append('data', jsonBlob);

  if (profileImageFile) {
    formData.append('image', profileImageFile);
  }
  certificateImageFiles.forEach((file) =>
    formData.append('certificateImages', file),
  );

  return await apiClient.put({
    endpoint: `${API_ENDPOINTS.MENTORINGS}/${mentoringId}`,
    body: formData,
    withCredentials: true,
  });
};
