import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { MentoringDetailPage } from './components/MentoringDetailPage';
import { Toaster } from './components/ui/sonner';
import { ROUTES, BASE_PATH } from './constants/routes';

export default function App() {
  return (
    <Router basename={BASE_PATH}>
      <AuthProvider>
        <Routes>
          {/* Public Routes - 로그인 불필요 */}
          <Route
            path={ROUTES.LOGIN}
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          
          {/* Protected Routes - 로그인 필수 */}
          <Route
            path={ROUTES.ROOT}
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.MENTORING_DETAIL}
            element={
              <ProtectedRoute>
                <MentoringDetailPage />
              </ProtectedRoute>
            }
          />
          
          {/* 404 - 존재하지 않는 경로는 메인으로 리다이렉트 */}
          {/* 루트 경로(/) 접근 시 web-admin으로 리다이렉트 */}
          <Route 
            path="/" 
            element={<Navigate to={ROUTES.ROOT} replace />} 
          />
          <Route 
            path="*" 
            element={<Navigate to={ROUTES.ROOT} replace />} 
          />
        </Routes>
        <Toaster 
          position="bottom-right"
          visibleToasts={5}
          duration={4000}
          gap={12}
        />
      </AuthProvider>
    </Router>
  );
}