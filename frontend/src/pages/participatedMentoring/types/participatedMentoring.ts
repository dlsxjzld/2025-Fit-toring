import type { StatusType } from '../../../common/types/statusType';
import type { MENTORING_APPLICATION_STATUS } from '../../createdMentoring/types/mentoringApplicationStatus';

interface BaseParticipatedMentoringType {
  reservationId: number;
  mentorName: string;
  mentorProfileImage: string;
  price: string;
  reservedAt: string;
  categories: string[];
  isReviewed: boolean;
  status: StatusType | MENTORING_APPLICATION_STATUS;
}

export interface ClientParticipatedMentoringType
  extends BaseParticipatedMentoringType {
  status: StatusType;
}

export interface ServerParticipatedMentoringResponse
  extends BaseParticipatedMentoringType {
  status: MENTORING_APPLICATION_STATUS;
}
