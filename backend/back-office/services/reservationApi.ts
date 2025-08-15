import { API_ENDPOINTS, BASE_URL } from "@/constants/config";
import { getApiHeaders, getDefaultFetchOptions, fetchWithTokenRefresh, joinUrl } from "@/services/apiUtils";

export interface ReservationItemResponse {
  reservationId: number;
  menteeName: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETE";
  content: string;
}

export interface Reservation {
  id: number;
  menteeName: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETE";
  content: string;
}

const toReservation = (src: ReservationItemResponse): Reservation => ({
  id: src.reservationId,
  menteeName: src.menteeName,
  createdAt: src.createdAt,
  status: src.status,
  content: src.content,
});

const RESV_BASE =
  (API_ENDPOINTS as any).MENTORING_RESERVATION_PREFIX ??
  (API_ENDPOINTS as any).MENTORING_RESERVATION_PRIFIX ??
  [BASE_URL.replace(/\/+$/, ""), "admin", "mentorings"].join("/");

/**
 * 예약 목록 조회
 * GET /admin/mentorings/{mentoringId}/reservations
 */
export const fetchReservations = async (mentoringId: number): Promise<Reservation[]> => {
  try {
    const base = (API_ENDPOINTS as any).ADMIN_MENTORING ?? "/admin/mentorings";
    const url = joinUrl(base, mentoringId, "reservations");

    const res = await fetchWithTokenRefresh(url, {
      method: "GET",
      ...getDefaultFetchOptions(),
      headers: getApiHeaders(),
    });

    if (!res.ok) {
      throw new Error(`예약 목록 조회 실패: ${res.status} ${res.statusText}`);
    }

    const data: ReservationItemResponse[] = await res.json();
    return (Array.isArray(data) ? data : []).map(toReservation);
  } catch (e) {
    console.error("예약 목록 조회 실패:", e);
    throw e;
  }
};

/**
 * 예약 항목 수정
 */
export type ReservationStatus = Reservation["status"];

export const fetchUpdateStatusReservation = async (
  reservationId: number,
  status: ReservationStatus
): Promise<void> => {
  const url = joinUrl(RESV_BASE, reservationId, "status");

  const res = await fetchWithTokenRefresh(url, {
    method: "PATCH",
    ...getDefaultFetchOptions(),
    headers: getApiHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!(res.status === 200 || res.ok)) {
    console.warn(`예약 상태 수정 실패: ${res.status} ${res.statusText}`);
  }
};

/**
 * 예약 항목 삭제
 */
 export const fetchDeleteReservation = async (
  reservationId: number
): Promise<void> => {
  const url = joinUrl(RESV_BASE, reservationId);

  const res = await fetchWithTokenRefresh(url, {
    method: "DELETE",
    ...getDefaultFetchOptions(),
    headers: getApiHeaders(),
  });

  if (res.status !== 204) {
    console.warn(`예약 삭제 실패: ${res.status} ${res.statusText}`);
  }
};
