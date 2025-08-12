import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Label} from "./ui/label";
import {Card, CardContent, CardHeader, CardTitle} from "./ui/card";
import {Alert, AlertDescription} from "./ui/alert";
import {ImageWithFallback} from "./figma/ImageWithFallback";
import {useAuth} from "./AuthContext";

const API_BASE_URL = "";

// 쿠키 유틸
type SameSite = "Lax" | "Strict" | "None";
type CookieOptions = {
    days?: number;
    path?: string;
    domain?: string;
    sameSite?: SameSite;
    secure?: boolean;
};

const buildCookieString = (
    name: string,
    value: string,
    {
        days = 7,
        path = "/",
        domain,
        sameSite = "None",
        secure = typeof window !== "undefined" && window.location.protocol === "https:",
    }: CookieOptions = {}
) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    const parts = [
        `${name}=${value}`,
        `Expires=${expires.toUTCString()}`,
        `Path=${path}`,
        `SameSite=${sameSite}`,
    ];

    if (domain) parts.push(`Domain=${domain}`);
    if (secure) parts.push(`Secure`);

    return parts.join("; ");
};

const setCookie = (name: string, value: string, options?: CookieOptions) => {
    if (typeof document === "undefined") return;
    document.cookie = buildCookieString(name, value, options);
};

export const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const nameEQ = name + "=";
    const cookies = document.cookie.split(";");
    for (let c of cookies) {
        while (c.charAt(0) === " ") c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
};

export const deleteCookie = (name: string, options?: Omit<CookieOptions, "days">) => {
    if (typeof document === "undefined") return;
    // 삭제 시 과거로 만료 설정. Path/Domain/SameSite/Secure는 생성 때와 동일해야 확실히 삭제됨.
    const parts = [
        `${name}=`,
        `Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
        `Path=${options?.path ?? "/"}`,
        `SameSite=${options?.sameSite ?? "None"}`,
    ];
    if (options?.domain) parts.push(`Domain=${options.domain}`);
    const secure = options?.secure ?? (typeof window !== "undefined" && window.location.protocol === "https:");
    if (secure) parts.push("Secure");
    document.cookie = parts.join("; ");
};

export const reissueToken = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/reissue`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
        });
        return response.ok;
    } catch (error) {
        console.error("Token reissue failed:", error);
        return false;
    }
};

export const isLoggedIn = () => {
    const token = getCookie("accessToken"); // 참고: HttpOnly 쿠키면 JS에서 읽히지 않음
    return token !== null;
};

export const getStoredUser = () => {
    const userData = getCookie("userData");
    if (userData) {
        try {
            return JSON.parse(decodeURIComponent(userData));
        } catch (error) {
            console.error("Failed to parse user data:", error);
        }
    }
    return null;
};

export function LoginPage() {
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include", // 크로스사이트 쿠키 전송
                body: JSON.stringify({loginId, password}),
            });

            if (response.ok) {
                const userData = {
                    id: loginId,
                    username: loginId,
                    name: "사용자",
                    role: "admin",
                };

                setCookie(
                    "userData",
                    encodeURIComponent(JSON.stringify(userData)),
                    {
                        days: 7,
                        path: "/",
                        sameSite: "None",
                        secure: typeof window !== "undefined" && window.location.protocol === "https:",
                        // domain: "fittoring.store", // 필요한 경우에만 사용. __Host- 규칙을 쓰려면 설정하지 말 것.
                    }
                );

                login(userData);
                navigate("/dashboard");
            } else {
                setError("아이디 또는 비밀번호가 올바르지 않습니다.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("서버 연결에 실패했습니다. 네트워크 상태를 확인해주세요.");
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
                    <CardTitle className="text-2xl">관리자 로그인</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* onSubmit 버그 수정 */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="loginId">아이디</Label>
                            <Input
                                id="loginId"
                                type="text"
                                placeholder="아이디를 입력하세요"
                                value={loginId}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginId(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">비밀번호</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="비밀번호를 입력하세요"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button type="submit" className="w-full h-11" disabled={loading}>
                            {loading ? "로그인 중..." : "로그인"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
