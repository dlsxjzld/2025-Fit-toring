import { DEFAULT_FETCH_OPTIONS } from "@/constants/config";
import { reissueToken } from "@/services/authApi";

export const getApiHeaders = (additionalHeaders?: Record<string, string>): HeadersInit => ({
  "Content-Type": "application/json",
  ...additionalHeaders,
});

export const getDefaultFetchOptions = (): RequestInit => ({
  ...DEFAULT_FETCH_OPTIONS,
});

// URL 안전 결합 (슬래시 중복/누락 방지)
export const joinUrl = (base: string, ...parts: Array<string | number>) => {
  const trimmed = [base, ...parts.map(String)]
    .filter(Boolean)
    .map((s, i) => (i === 0 ? s.replace(/\/+$/, "") : s.replace(/^\/+/, "")));
  return trimmed.join("/");
};

// 401 대응 fetch (reissueToken 사용)
export const fetchWithTokenRefresh = async (url: string, options: RequestInit): Promise<Response> => {
  let response = await fetch(url, { ...options, credentials: "include" });

  if (response.status === 401) {
    const ok = await reissueToken();
    if (ok) {
      response = await fetch(url, { ...options, credentials: "include" });
    } else {
      // 프로젝트 UX에 맞게 처리
      window.location.href = "/web-admin/login";
      throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
    }
  }
  return response;
};
