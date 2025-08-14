import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ROUTES } from '../constants/routes';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute 컴포넌트
 * 
 * 🌐 로그인하지 않아도 접근할 수 있는 페이지를 위한 라우트 래퍼
 * 
 * 동작:
 * - 이미 로그인된 사용자가 접근하면 대시보드로 리다이렉트
 * - 로그인 시도 전에 방문하려던 페이지가 있으면 그곳으로 이동
 * - 로그인되지 않은 사용자는 정상적으로 페이지 접근
 * - PublicRoute에서는 인증 상태 확인 API를 호출하지 않음
 */
export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  console.log('🌐 PublicRoute - isAuthenticated:', isAuthenticated);

  // 이미 인증된 경우 대시보드로 리다이렉트
  if (isAuthenticated) {
    console.log('✅ PublicRoute - Already authenticated, redirecting...');
    // 로그인하기 전에 방문하려 했던 페이지가 있다면 그곳으로, 없다면 대시보드로
    const from = (location.state as any)?.from?.pathname || ROUTES.DASHBOARD;
    return <Navigate to={from} replace />;
  }

  console.log('✅ PublicRoute - Not authenticated, rendering public content');
  return <>{children}</>;
}
