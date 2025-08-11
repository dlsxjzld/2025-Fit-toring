import type { StatusType } from '../../../common/types/statusType';
import type { MentoringApplicationStatus } from '../../createdMentoring/types/mentoringApplicationStatus';

interface BaseParticipatedMentoringType {
  reservationId: number;
  mentorName: string;
  mentorProfileImage: string;
  price: string;
  reservedAt: string;
  categories: string[];
  isReviewed: boolean;
  status: StatusType | MentoringApplicationStatus;
}

export interface ClientParticipatedMentoringType
  extends BaseParticipatedMentoringType {
  status: StatusType;
}

export interface ServerParticipatedMentoringResponse
  extends BaseParticipatedMentoringType {
  status: MentoringApplicationStatus;
}
