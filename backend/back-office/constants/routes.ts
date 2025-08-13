// 애플리케이션의 모든 라우트 경로를 상수로 관리
// 백엔드 정적 배포 시 /web-admin 경로만 허용하므로 basename을 사용
export const BASE_PATH = '/web-admin';

export const ROUTES = {
  // Public Routes (로그인 불필요) - basename 기준 상대 경로
  LOGIN: '/login',
  
  // Protected Routes (로그인 필수) - basename 기준 상대 경로  
  ROOT: '/',
  DASHBOARD: '/dashboard',
  MENTORING_DETAIL: '/mentoring/:id',
  
  // 동적 라우트 생성 헬퍼
  getMentoringDetailPath: (id: string) => `/mentoring/${id}`,
} as const;

// 라우트 타입 정의
export type RouteType = 'PUBLIC' | 'PROTECTED';

// 라우트 설정 인터페이스
export interface RouteConfig {
  path: string;
  type: RouteType;
  component: string;
  description: string;
}

// 모든 라우트 설정
export const ROUTE_CONFIGS: RouteConfig[] = [
  {
    path: ROUTES.LOGIN,
    type: 'PUBLIC',
    component: 'LoginPage',
    description: '로그인 페이지 - 인증이 필요하지 않음'
  },
  {
    path: ROUTES.ROOT,
    type: 'PROTECTED',
    component: 'Dashboard',
    description: '메인 대시보드 - 인증 필수'
  },
  {
    path: ROUTES.DASHBOARD,
    type: 'PROTECTED',
    component: 'Dashboard',
    description: '대시보드 - 인증 필수'
  },
  {
    path: ROUTES.MENTORING_DETAIL,
    type: 'PROTECTED',
    component: 'MentoringDetailPage',
    description: '멘토링 상세 페이지 - 인증 필수'
  }
];