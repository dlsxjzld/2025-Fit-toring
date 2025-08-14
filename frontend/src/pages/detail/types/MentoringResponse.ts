import type { CertificateResponse } from './CertificatesResponse';

export interface MentoringResponse {
  id: number;
  mentorName: string;
  categories: string[];
  price: number;
  career: number;
  profileImageUrl: string | null;
  introduction: string;
  content: string;
  certificates: CertificateResponse[];
}
