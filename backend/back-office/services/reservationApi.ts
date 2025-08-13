import { API_ENDPOINTS } from "@/constants/config";
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

/**
 * 예약 목록 조회
 * GET /admin/mentorings/{mentoringId}/reservations
 */
export const fetchReservations = async (mentoringId: number): Promise<Reservation[]> => {
  try {
    const base = (API_ENDPOINTS as any).MENTORING_RESERVATION ?? "/admin/mentorings/";
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
