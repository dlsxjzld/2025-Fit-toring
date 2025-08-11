import type { MentoringApplicationStatus } from '../../../common/types/mentoringApplicationStatus';
import type { StatusType } from '../../../common/types/statusType';

interface BaseMentoringApplication {
  reservationId: number;
  menteeName: string;
  phoneNumber: string | null;
  price: number;
  content: string;
  status: StatusType | MentoringApplicationStatus;
  createdAt: string;
}
export interface ClientMentoringApplication extends BaseMentoringApplication {
  status: StatusType;
}

export interface ServerMentoringApplicationResponse
  extends BaseMentoringApplication {
  status: MentoringApplicationStatus;
}
