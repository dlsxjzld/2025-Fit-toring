import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, checkAuthStatus, reissueToken, User } from '../services/authApi';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  refreshUserInfo: () => Promise<void>;
  checkAndRefreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider - httpOnly 쿠키 기반 인증 관리
 * 
 * JavaScript에서 직접 쿠키에 접근하지 않고,
 * 서버 API를 통해서만 인증 상태를 확인하고 관리합니다.
 * 
 * 초기 로딩 시에는 인증 체크를 하지 않고, ProtectedRoute에서만 인증을 확인합니다.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 초기 로딩 상태를 false로 변경

  // 서버에서 현재 사용자 정보 새로고침
  const refreshUserInfo = async () => {
    try {
      console.log('🔄 Refreshing user info...');
      const userData = await getCurrentUser();
      
      if (userData) {
        console.log('✅ User info refreshed:', userData);
        setUser(userData);
      } else {
        console.log('❌ No user data received');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Error refreshing user info:', error);
      setUser(null);
    }
  };

  // 토큰 확인 및 갱신 함수 (ProtectedRoute에서 사용)
  const checkAndRefreshToken = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // 먼저 현재 토큰 상태 확인
      const isValid = await checkAuthStatus();
      
      if (isValid) {
        console.log('✅ Token is valid');
        // 사용자 정보가 없다면 가져오기
        if (!user) {
          await refreshUserInfo();
        }
        return true;
      }
      
      // 토큰이 유효하지 않다면 refresh 시도
      console.log('🔄 Token invalid, attempting refresh...');
      const refreshSuccess = await reissueToken();
      
      if (refreshSuccess) {
        console.log('✅ Token refresh successful');
        // 토큰 갱신 후 사용자 정보 업데이트
        await refreshUserInfo();
        return true;
      } else {
        console.log('❌ Token refresh failed');
        handleLogout();
        return false;
      }
    } catch (error) {
      console.error('❌ Error during token check:', error);
      handleLogout();
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로딩 시에는 인증 체크를 하지 않음
  // ProtectedRoute에서 필요할 때만 checkAndRefreshToken() 호출
  
  const handleLogin = (userData: User) => {
    console.log('🎉 User logged in:', userData);
    setUser(userData);
  };

  const handleLogout = () => {
    console.log('🚪 Logging out user');
    setUser(null);
    console.log('✅ User logged out');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    refreshUserInfo,
    checkAndRefreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
