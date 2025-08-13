import { API_ENDPOINTS } from "@/constants/config";
import { getApiHeaders, getDefaultFetchOptions, joinUrl, fetchWithTokenRefresh } from "@/services/apiUtils"; 

export interface MentoringListItemResponse {
  id: number;
  mentorName: string;
  categories: string[];
  price: number;
  career: number;
  profileImageUrl: string | null;
  introduction: string;
}

export interface MentoringDetailResponse {
  id: number;
  mentorName: string;
  categories: string[];
  price: number;
  career: number;
  profileImageUrl: string | null;
  introduction: string;
  content: string;
  certificates: Array<{
    certificateId: number;
    certificateName: string;
    certificateType: "LICENSE" | "EDUCATION" | "AWARD" | "ETC";
    imageUrl: string;
  }>;
}

export interface MentoringDetailEnvelopeResponse {
  mentoring?: MentoringDetailResponse;
  data?: unknown;
  [k: string]: unknown;
}

export interface MentoringSummary {
  id: number;
  mentorName: string;
  categories: string[];
  price: number;
  career: number;
  profileImageUrl: string | null;
  introduction: string;
}

export interface MentoringDetail extends MentoringSummary {
  content: string;
  certificates: Array<{
    id: number;
    name: string;
    type: "LICENSE" | "EDUCATION" | "AWARD" | "ETC";
    imageUrl: string;
  }>;
}

// -----------------------------
// 정규화 & 변환
// -----------------------------
type AnyObj = Record<string, any>;

const normalizeMentoringDetail = (src: AnyObj): MentoringDetailResponse => {
  const certificatesRaw = Array.isArray(src.certificates) ? src.certificates : [];

  return {
    id: Number(src.id),
    mentorName: src.mentorName ?? src.mentor_name ?? "",
    categories: Array.isArray(src.categories) ? src.categories : [],
    price: Number(src.price ?? 0),
    career: Number(src.career ?? src.experience ?? 0),
    profileImageUrl: src.profileImageUrl ?? src.profile_image_url ?? null,
    introduction: src.introduction ?? src.oneLineIntro ?? "",
    content: src.content ?? "",

    certificates: certificatesRaw.map((c: AnyObj) => ({
      certificateId: Number(c.certificateId ?? c.id ?? 0),
      certificateName: c.certificateName ?? c.title ?? "",
      certificateType: (c.certificateType ?? c.type ?? "ETC") as
        | "LICENSE"
        | "EDUCATION"
        | "AWARD"
        | "ETC",
      imageUrl: c.imageUrl ?? "",
    })),
  };
};

const toSummary = (src: MentoringListItemResponse): MentoringSummary => ({
  id: src.id,
  mentorName: src.mentorName,
  categories: src.categories ?? [],
  price: src.price,
  career: src.career,
  profileImageUrl: src.profileImageUrl ?? null,
  introduction: src.introduction,
});

const toDetail = (src: MentoringDetailResponse): MentoringDetail => ({
  id: src.id,
  mentorName: src.mentorName,
  categories: src.categories ?? [],
  price: src.price,
  career: src.career,
  profileImageUrl: src.profileImageUrl ?? null,
  introduction: src.introduction,
  content: src.content,
  certificates: (src.certificates ?? []).map((c) => ({
    id: c.certificateId,
    name: c.certificateName,
    type: c.certificateType, // "LICENSE" | "EDUCATION" | "AWARD" | "ETC"
    imageUrl: c.imageUrl,
  })),
});

// -----------------------------
// API 함수
// -----------------------------

// 멘토링 목록 조회
export const fetchMentorings = async (): Promise<MentoringSummary[]> => {
  try {
    const listBase = (API_ENDPOINTS as AnyObj).MENTORINGS ?? API_ENDPOINTS.MENTORING;
    const url = listBase; // 목록은 base 그대로 사용
    const res = await fetchWithTokenRefresh(url, {
      method: "GET",
      ...getDefaultFetchOptions(),
      headers: getApiHeaders(),
    });

    if (!res.ok) {
      throw new Error(`멘토링 목록 조회 실패: ${res.status} ${res.statusText}`);
    }

    const data: MentoringListItemResponse[] = await res.json();
    return data.map(toSummary);
  } catch (e) {
    console.error("멘토링 목록 조회 실패:", e);
    throw e;
  }
};

/**
 * 멘토링 상세 조회
 * - { mentoring: {...} } 또는 { data: {...} } 또는 {...} 모두 대응
 * - 필드명 불일치 정규화 후 toDetail 변환
 */
export const fetchMentoringDetail = async (mentoringId: number): Promise<MentoringDetail> => {
  try {
    const base = API_ENDPOINTS.MENTORING_DETAIL; // 보통 "/mentorings/"
    const url = joinUrl(base, mentoringId);
    const res = await fetchWithTokenRefresh(url, {
      method: "GET",
      ...getDefaultFetchOptions(),
      headers: getApiHeaders(),
    });

    if (!res.ok) {
      throw new Error(`멘토링 상세 조회 실패: ${res.status} ${res.statusText}`);
    }

    const json = (await res.json()) as MentoringDetailEnvelopeResponse | AnyObj;

    // 래핑 유무/다른 키(data 등) 모두 대응
    const raw =
      (json as MentoringDetailEnvelopeResponse).mentoring ??
      (json as AnyObj).data ??
      (json as AnyObj);

    if (!raw || typeof raw !== "object") {
      console.warn("Unexpected detail payload:", json);
      throw new Error("멘토링 상세 응답 형식이 예상과 다릅니다.");
    }

    const normalized = normalizeMentoringDetail(raw as AnyObj);
    return toDetail(normalized);
  } catch (e) {
    console.error("멘토링 상세 조회 실패:", e);
    throw e;
  }
};

// 멘토링 삭제 (관리자 전용)
export const deleteMentoring = async (mentoringId: number): Promise<void> => {
  try {
    const base = API_ENDPOINTS.MENTORING_DELETE; // 보통 "/admin/mentorings/"
    const url = joinUrl(base, mentoringId);
    const res = await fetchWithTokenRefresh(url, {
      method: "DELETE",
      ...getDefaultFetchOptions(),
      headers: getApiHeaders(),
    });

    if (!res.ok) {
      throw new Error(`멘토링 삭제 실패: ${res.status} ${res.statusText}`);
    }
  } catch (e) {
    console.error("멘토링 삭제 실패:", e);
    throw e;
  }
};
