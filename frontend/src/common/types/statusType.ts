export type StatusType = '승인대기' | '승인됨' | '완료됨' | '거절됨';

export enum StatusTypeEnum {
  PENDING = '승인대기',
  APPROVED = '승인됨',
  COMPLETE = '완료됨',
  REJECTED = '거절됨',
}
