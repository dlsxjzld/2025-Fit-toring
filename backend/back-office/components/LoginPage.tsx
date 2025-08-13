import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "./AuthContext";
import { login as apiLogin } from "../services/authApi";

/**
 * LoginPage - httpOnly 쿠키 기반 로그인
 * 
 * 더 이상 JavaScript로 쿠키에 직접 접근하지 않고,
 * 서버 API를 통해서만 인증을 처리합니다.
 */
export function LoginPage() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log('🔄 Attempting login...');
      const result = await apiLogin(loginId, password);

      if (result.success && result.user) {
        console.log('🎉 Login successful:', result.user);
        
        // 인증 컨텍스트에 사용자 정보 설정
        login(result.user);
        
        // 로그인 전에 방문하려던 페이지로 이동 (없으면 대시보드로)
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        console.log('❌ Login failed:', result.message);
        setError(result.message || "로그인에 실패했습니다.");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(
        "서버 연결에 실패했습니다. 네트워크 상태를 확인해주세요.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1560472354-c58ff3013449?w=100&h=100&fit=crop&crop=center"
              alt="Logo"
              className="h-16 w-16 object-contain rounded-lg"
            />
          </div>
          <CardTitle className="text-2xl">
            관리자 로그인
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loginId">아이디</Label>
              <Input
                id="loginId"
                type="text"
                placeholder="아이디를 입력하세요"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-11"
              disabled={loading}
            >
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
