// API 요청을 위한 인증 관련 서비스 (httpOnly 쿠키 전용)
import { API_ENDPOINTS, DEFAULT_FETCH_OPTIONS, APP_CONFIG } from '../constants/config';

export interface User {
  loginId: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

// 기본 fetch 옵션 (httpOnly 쿠키를 위해 credentials 포함)
const getDefaultFetchOptions = (): RequestInit => ({
  ...DEFAULT_FETCH_OPTIONS,
});

/**
 * 현재 사용자 정보를 가져오는 API 호출
 * 서버에서 httpOnly 쿠키의 accessToken을 확인하고 사용자 정보 반환
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH_ME, {
      method: 'GET',
      ...getDefaultFetchOptions(),
    });

    if (response.ok) {
      // 서버 응답: {"loginId": "fittoring", "name": "toring", "role": "ADMIN"}
      const userData: User = await response.json();
      if (APP_CONFIG.enableDebugLogs) {
        console.log('✅ User info retrieved:', userData);
      }
      return userData;
    } else if (response.status === 401) {
      if (APP_CONFIG.enableDebugLogs) {
        console.log('❌ User not authenticated (401)');
      }
      return null;
    } else {
      console.error('❌ Failed to get user info:', response.status);
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting user info:', error);
    return null;
  }
};

/**
 * 인증 상태만 확인하는 API 호출 (사용자 정보 불필요한 경우)
 */
export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH_STATUS, {
      method: 'GET',
      ...getDefaultFetchOptions(),
    });

    if (response.ok) {
      // 서버 응답: {"authenticated": true}
      const data = await response.json();
      if (APP_CONFIG.enableDebugLogs) {
        console.log('🔍 Auth status check:', data.authenticated ? '✅ Authenticated' : '❌ Not authenticated');
      }
      return data.authenticated || false;
    } else {
      if (APP_CONFIG.enableDebugLogs) {
        console.log('🔍 Auth status check: ❌ Not authenticated (HTTP error)');
      }
      return false;
    }
  } catch (error) {
    console.error('❌ Error checking auth status:', error);
    return false;
  }
};

/**
 * 토큰 재발급 API 호출
 */
export const reissueToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(API_ENDPOINTS.REISSUE, {
      method: 'POST',
      ...getDefaultFetchOptions(),
    });

    if (APP_CONFIG.enableDebugLogs) {
      console.log('🔄 Token reissue:', response.ok ? '✅ Success' : '❌ Failed');
    }
    return response.ok;
  } catch (error) {
    console.error('❌ Token reissue error:', error);
    return false;
  }
};

/**
 * 로그인 API 호출
 * 기존 로그인 API는 수정할 수 없으므로, 로그인 성공 후 별도로 사용자 정보를 가져옴
 */
export const login = async (loginId: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      ...getDefaultFetchOptions(),
      body: JSON.stringify({ loginId, password }),
    });

    if (response.ok) {
      if (APP_CONFIG.enableDebugLogs) {
        console.log('✅ Login API success');
      }
      // 로그인 성공 후 사용자 정보를 별도로 가져오기
      const user = await getCurrentUser();
      
      if (user) {
        return {
          success: true,
          user: user,
        };
      } else {
        // 로그인은 성공했지만 사용자 정보 가져오기 실패
        return {
          success: false,
          message: '로그인 후 사용자 정보를 가져오는데 실패했습니다.',
        };
      }
    } else {
      return {
        success: false,
        message: response.status === 401 
          ? '아이디 또는 비밀번호가 올바르지 않습니다.' 
          : '로그인 중 오류가 발생했습니다.',
      };
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    return {
      success: false,
      message: '서버 연결에 실패했습니다. 네트워크 상태를 확인해주세요.',
    };
  }
};

/**
 * 로그아웃 API 호출
 */
export const logout = async (): Promise<boolean> => {
  try {
    const response = await fetch(API_ENDPOINTS.LOGOUT, {
      method: 'POST',
      ...getDefaultFetchOptions(),
    });
    
    if (APP_CONFIG.enableDebugLogs) {
      console.log('🚪 Logout:', response.ok ? '✅ Success' : '❌ Failed');
    }
    return response.ok;
  } catch (error) {
    console.error('❌ Logout API call failed:', error);
    return false;
  }
};

/**
 * 인증된 API 요청을 위한 fetch wrapper
 * httpOnly 쿠키 기반으로 토큰 만료 시 자동 갱신 처리
 */
export const authenticatedFetch = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const requestOptions: RequestInit = {
    ...getDefaultFetchOptions(),
    ...options,
    headers: {
      ...getDefaultFetchOptions().headers,
      ...options.headers,
    },
  };

  try {
    let response = await fetch(url, requestOptions);
    
    // 401 Unauthorized 응답인 경우 토큰 갱신 시도
    if (response.status === 401) {
      if (APP_CONFIG.enableDebugLogs) {
        console.log('🔄 Received 401, attempting token refresh...');
      }
      
      const refreshSuccess = await reissueToken();
      
      if (refreshSuccess) {
        if (APP_CONFIG.enableDebugLogs) {
          console.log('✅ Token refreshed, retrying request...');
        }
        // 토큰이 갱신되었으므로 요청 재시도
        response = await fetch(url, requestOptions);
      } else {
        if (APP_CONFIG.enableDebugLogs) {
          console.log('❌ Token refresh failed');
        }
        throw new Error('Authentication failed');
      }
    }
    
    return response;
  } catch (error) {
    console.error('❌ API request failed:', error);
    throw error;
  }
};
