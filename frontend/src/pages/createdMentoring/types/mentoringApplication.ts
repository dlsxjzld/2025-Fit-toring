import type { MENTORING_APPLICATION_STATUS } from './mentoringApplicationStatus';
import type { StatusType } from '../../../common/types/statusType';

interface BaseMentoringApplication {
  reservationId: number;
  menteeName: string;
  phoneNumber: string | null;
  price: number;
  content: string;
  status: StatusType | MENTORING_APPLICATION_STATUS;
  createdAt: string;
}
export interface ClientMentoringApplication extends BaseMentoringApplication {
  status: StatusType;
}

export interface ServerMentoringApplicationResponse
  extends BaseMentoringApplication {
  status: MENTORING_APPLICATION_STATUS;
}
