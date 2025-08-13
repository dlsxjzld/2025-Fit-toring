import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useEffect, useState } from 'react';
import { ROUTES } from '../constants/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute 컴포넌트
 * 
 * 🔒 로그인이 필요한 페이지를 보호하는 라우트 래퍼
 * 
 * 동작:
 * - 페이지 접근 시 인증 상태를 확인하고 토큰 갱신 시도
 * - 인증이 필요한 경우에만 API 호출
 * - 토큰이 만료되면 자동으로 갱신 시도
 * - 갱신 실패 시 로그인 페이지로 이동
 * - 로그인 후 원래 접근하려던 페이지로 복귀
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, checkAndRefreshToken } = useAuth();
  const location = useLocation();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  // 페이지 접근 시 인증 상태 확인 (ProtectedRoute에서만 실행)
  useEffect(() => {
    const verifyAuthentication = async () => {
      console.log('🛡️ ProtectedRoute - Starting authentication check');
      
      // 이미 인증된 사용자는 추가 확인 불필요
      if (isAuthenticated) {
        console.log('✅ ProtectedRoute - Already authenticated');
        setAuthCheckComplete(true);
        return;
      }
      
      // 인증되지 않은 경우 토큰 확인 및 갱신 시도
      const authResult = await checkAndRefreshToken();
      
      if (authResult) {
        console.log('✅ ProtectedRoute - Authentication successful');
      } else {
        console.log('❌ ProtectedRoute - Authentication failed');
      }
      
      setAuthCheckComplete(true);
    };

    verifyAuthentication();
  }, [isAuthenticated, checkAndRefreshToken]);

  console.log('🛡️ ProtectedRoute State:', { isAuthenticated, isLoading, authCheckComplete });

  // 인증 확인 중일 때 로딩 화면 표시
  if (isLoading || !authCheckComplete) {
    console.log('⏳ ProtectedRoute - Checking authentication...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    console.log('❌ ProtectedRoute - Not authenticated, redirecting to login');
    // 현재 위치를 state로 저장하여 로그인 후 원래 페이지로 돌아갈 수 있게 함
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  console.log('✅ ProtectedRoute - Authenticated, rendering protected content');
  return <>{children}</>;
}
