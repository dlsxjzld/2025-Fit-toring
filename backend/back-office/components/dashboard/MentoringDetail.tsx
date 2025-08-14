import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Calendar,
  DollarSign,
  FileText,
  Tag,
  Clock,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

// 멘토링 상세 데이터 타입
interface MentoringDetailData {
  id: string;
  mentorId: string;
  mentorName: string;
  experience: number; // 경력 년수
  price: number;
  oneLineIntro: string;
  content: string;
  categories: string[];
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

// 예약 데이터 타입
interface ReservationData {
  id: string;
  menteeId: string;
  menteeName: string;
  requestTime: string;
  status: "pending" | "approved" | "rejected" | "completed";
}

// 예약 더미 데이터 맵
const mockReservationData: Record<string, ReservationData[]> = {
  M001: [
    {
      id: "R001",
      menteeId: "MENTEE001",
      menteeName: "이민수",
      requestTime: "2024-01-25T14:00:00Z",
      status: "pending",
    },
    {
      id: "R002",
      menteeId: "MENTEE002",
      menteeName: "김현주",
      requestTime: "2024-01-24T16:30:00Z",
      status: "approved",
    },
    {
      id: "R003",
      menteeId: "MENTEE003",
      menteeName: "박철수",
      requestTime: "2024-01-23T10:15:00Z",
      status: "completed",
    },
    {
      id: "R004",
      menteeId: "MENTEE004",
      menteeName: "정유진",
      requestTime: "2024-01-22T13:45:00Z",
      status: "rejected",
    },
  ],
  M002: [
    {
      id: "R005",
      menteeId: "MENTEE005",
      menteeName: "장영희",
      requestTime: "2024-01-24T15:20:00Z",
      status: "approved",
    },
    {
      id: "R006",
      menteeId: "MENTEE006",
      menteeName: "최준호",
      requestTime: "2024-01-23T11:00:00Z",
      status: "pending",
    },
    {
      id: "R007",
      menteeId: "MENTEE007",
      menteeName: "한소희",
      requestTime: "2024-01-21T09:30:00Z",
      status: "completed",
    },
  ],
  M003: [
    {
      id: "R008",
      menteeId: "MENTEE008",
      menteeName: "김민지",
      requestTime: "2024-01-26T10:00:00Z",
      status: "pending",
    },
    {
      id: "R009",
      menteeId: "MENTEE009",
      menteeName: "이하늘",
      requestTime: "2024-01-25T14:30:00Z",
      status: "approved",
    },
    {
      id: "R010",
      menteeId: "MENTEE010",
      menteeName: "박수진",
      requestTime: "2024-01-24T16:00:00Z",
      status: "completed",
    },
  ],
  M004: [
    {
      id: "R011",
      menteeId: "MENTEE011",
      menteeName: "정태현",
      requestTime: "2024-01-27T09:00:00Z",
      status: "pending",
    },
    {
      id: "R012",
      menteeId: "MENTEE012",
      menteeName: "송민아",
      requestTime: "2024-01-26T13:00:00Z",
      status: "approved",
    },
  ],
  M005: [
    {
      id: "R013",
      menteeId: "MENTEE013",
      menteeName: "윤서연",
      requestTime: "2024-01-28T11:00:00Z",
      status: "pending",
    },
    {
      id: "R014",
      menteeId: "MENTEE014",
      menteeName: "강도현",
      requestTime: "2024-01-27T15:30:00Z",
      status: "approved",
    },
    {
      id: "R015",
      menteeId: "MENTEE015",
      menteeName: "임지영",
      requestTime: "2024-01-26T10:30:00Z",
      status: "rejected",
    },
  ],
};

// 더미 데이터 맵
const mockDetailData: Record<string, MentoringDetailData> = {
  M001: {
    id: "M001",
    mentorId: "MENTOR001",
    mentorName: "김성현",
    experience: 5,
    price: 50000,
    oneLineIntro:
      "체형 교정과 다이어트 전문 트레이너로 건강한 몸매 만들기를 도와드립니다.",
    content: `안녕하세요! 5년 차 체형 교정 전문 트레이너 김성현입니다.

현재 스포츠 센터에서 개인 트레이닝과 그룹 수업을 진행하고 있으며, 체형 교정과 다이어트를 전문으로 합니다.

**전문 분야:**
- 체형 교정 및 자세 개선
- 효과적인 다이어트 프로그램 설계
- 개인 맞춤형 운동 계획 수립
- 올바른 운동 폼 교정
- 생활 습관 개선 상담

**이런 분께 추천합니다:**
- 잘못된 자세로 인한 체형 불균형이 있는 분
- 건강하게 다이어트하고 싶은 분
- 운동 초보자도 안전하게 시작할 수 있는 분
- 개인에게 맞는 운동법을 찾고 싶은 분

함께 건강하고 아름다운 몸매를 만들어 가요!`,
    categories: ["체형 교정", "다이어트", "자세 교정"],
    profileImage:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  M002: {
    id: "M002",
    mentorId: "MENTOR002",
    mentorName: "박지훈",
    experience: 7,
    price: 65000,
    oneLineIntro:
      "벌크업과 근력 강화 전문 트레이너로 강한 몸을 만들어 드립니다.",
    content: `7년 차 벌크업 및 근력 강화 전문 트레이너 박지훈입니다.

현재 보디빌딩 선수로 활동하며 다수의 대회 입상 경력을 보유하고 있습니다.

**주요 경력:**
- 보디빌딩 대회 다수 입상
- 웨이트 트레이닝 전문 지도
- 근육량 증가 프로그램 설계
- 운동 영양학 상담

**전문 프로그램:**
1. 초보자를 위한 웨이트 트레이닝 기초
2. 벌크업을 위한 고강도 근력 운동
3. 단계별 근육량 증가 프로그램
4. 보충제 및 식단 관리 상담
5. 부상 방지를 위한 안전한 운동법

체계적인 근력 강화로 당신의 목표를 달성해보세요!`,
    categories: ["벌크업", "근력 강화", "식단 관리"],
    profileImage:
      "https://images.unsplash.com/photo-1583341612074-ccea5cd64f6a?w=150&h=150&fit=crop&crop=face",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
  },
  M003: {
    id: "M003",
    mentorId: "MENTOR003",
    mentorName: "이수민",
    experience: 4,
    price: 45000,
    oneLineIntro:
      "홈 트레이닝과 스트레칭 전문가로 집에서도 효과적인 운동을 도와드립니다.",
    content: `4년 차 홈 트레이닝 및 스트레칭 전문 트레이너 이수민입니다.

필라테스와 요가 자격증을 보유하고 있으며, 집에서 할 수 있는 효과적인 운동법을 전문으로 합니다.

**전문 분야:**
- 홈 트레이닝 프로그램 설계
- 유연성 향상 스트레칭
- 필라테스 기반 코어 강화
- 요가를 통한 몸과 마음의 균형
- 자세 교정 운동

**프로그램 특징:**
- 별도 장비 없이 맨몸으로 하는 운동
- 짧은 시간으로 최대 효과
- 초보자도 쉽게 따라할 수 있는 동작
- 일상생활 속 스트레칭 루틴
- 개인별 유연성 수준에 맞춘 프로그램

바쁜 일상 속에서도 건강을 챙기세요!`,
    categories: ["홈 트레이닝", "유연성·스트레칭", "자세 교정"],
    profileImage:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=150&h=150&fit=crop&crop=face",
    createdAt: "2024-01-08T11:00:00Z",
    updatedAt: "2024-01-22T16:30:00Z",
  },
  M004: {
    id: "M004",
    mentorId: "MENTOR004",
    mentorName: "정대영",
    experience: 8,
    price: 70000,
    oneLineIntro:
      "재활 운동과 부상 예방 전문가로 안전하고 효과적인 운동을 제공합니다.",
    content: `8년 차 재활 운동 및 부상 예방 전문 트레이너 정대영입니다.

운동처방사 자격증과 물리치료 관련 교육을 이수하여 부상자 및 운동 복귀를 전문으로 합니다.

**전문 자격:**
- 운동처방사 자격증 보유
- 스포츠 재활 전문 과정 수료
- 기능적 움직임 평가(FMS) 자격
- 교정 운동 전문가

**전문 서비스:**
1. 부상 후 운동 복귀 프로그램
2. 만성 통증 개선 운동
3. 기능적 움직임 평가 및 교정
4. 스포츠 부상 예방 교육
5. 개인별 맞춤 재활 운동 계획

안전하고 과학적인 접근으로 건강한 운동 생활을 시작하세요!`,
    categories: ["재활 운동", "부상 상담", "유연성·스트레칭"],
    profileImage:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    createdAt: "2024-01-05T14:00:00Z",
    updatedAt: "2024-01-25T10:15:00Z",
  },
  M005: {
    id: "M005",
    mentorId: "MENTOR005",
    mentorName: "최영희",
    experience: 6,
    price: 40000,
    oneLineIntro:
      "다이어트 식단 관리와 홈 트레이닝 전문가로 건강한 라이프스타일을 만들어 드립니다.",
    content: `6년 차 다이어트 및 식단 관리 전문 트레이너 최영희입니다.

영양사 자격증을 보유하고 있으며, 운동과 식단을 병행한 건강한 다이어트를 전문으로 합니다.

**전문 자격:**
- 스포츠 영양사 자격증
- 다이어트 상담사 자격증
- 홈 트레이닝 지도자 자격증

**전문 프로그램:**
- 개인별 맞춤 다이어트 식단 계획
- 칼로리 계산 및 영양소 밸런스 조절
- 집에서 할 수 있는 다이어트 운동
- 건강한 식습관 형성 코칭
- 요요 없는 체중 관리 방법

**서비스 특징:**
- 무리한 굶기 다이어트 NO
- 개인 라이프스타일에 맞춘 계획
- 지속 가능한 건강 습관 만들기
- 정기적인 진도 체크 및 피드백

건강하고 아름다운 몸매, 함께 만들어 가요!`,
    categories: ["다이어트", "식단 관리", "홈 트레이닝"],
    profileImage:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    createdAt: "2024-01-12T13:30:00Z",
    updatedAt: "2024-01-28T09:45:00Z",
  },
  // 추가 데이터...
};

const categoryColors = [
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-purple-100 text-purple-800",
  "bg-orange-100 text-orange-800",
  "bg-pink-100 text-pink-800",
  "bg-indigo-100 text-indigo-800",
];

export function MentoringDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mentoringData, setMentoringData] =
    useState<MentoringDetailData | null>(null);
  const [reservations, setReservations] = useState<
    ReservationData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [tempStatus, setTempStatus] = useState<
    Record<string, ReservationData["status"]>
  >({});

  useEffect(() => {
    if (id && mockDetailData[id]) {
      setMentoringData(mockDetailData[id]);
      setReservations(mockReservationData[id] || []);
    }
    setLoading(false);
  }, [id]);

  const handleBackToList = () => {
    navigate(`/web-admin#mentoring`);
  };

  const handleAddReservation = () => {
    alert("예약 추가 기능을 구현해야 합니다.");
  };

  const handleStatusChange = (
    reservationId: string,
    newStatus: ReservationData["status"],
  ) => {
    setTempStatus((prev) => ({
      ...prev,
      [reservationId]: newStatus,
    }));
  };

  const handleStatusUpdate = (reservationId: string) => {
    const newStatus = tempStatus[reservationId];
    if (newStatus) {
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === reservationId
            ? { ...reservation, status: newStatus }
            : reservation,
        ),
      );
      // 임시 상태 초기화
      setTempStatus((prev) => {
        const newTemp = { ...prev };
        delete newTemp[reservationId];
        return newTemp;
      });
    }
  };

  const handleDeleteReservation = (reservationId: string) => {
    setReservations((prevReservations) =>
      prevReservations.filter(
        (reservation) => reservation.id !== reservationId,
      ),
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price) + "원";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (
    status: ReservationData["status"],
  ) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800"
          >
            대기중
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800"
          >
            승인됨
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800"
          >
            거절됨
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800"
          >
            완료
          </Badge>
        );
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        로딩 중...
      </div>
    );
  }

  if (!mentoringData) {
    return (
      <div className="text-center py-12">
        <h3>멘토링을 찾을 수 없습니다</h3>
        <Button
          onClick={handleBackToList}
          className="mt-4"
          variant="outline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 액션 버튼 */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          수정
        </Button>
        <Button variant="destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          삭제
        </Button>
      </div>

      {/* 멘토링 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            멘토링 정보
          </CardTitle>
          <CardDescription>
            멘토링 ID: {mentoringData.id}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 멘토 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 멘토 프로필 */}
            <div className="space-y-4">
              {mentoringData.profileImage && (
                <div className="flex justify-center md:justify-start">
                  <ImageWithFallback
                    src={mentoringData.profileImage}
                    alt={`${mentoringData.mentorName} 프로필`}
                    className="w-20 h-20 rounded-full object-cover border"
                  />
                </div>
              )}

              <div className="text-center md:text-left space-y-2">
                <h3>{mentoringData.mentorName}</h3>
                <p className="text-muted-foreground">
                  경력 {mentoringData.experience}년
                </p>
                <p className="text-muted-foreground">
                  가격 {mentoringData.price}원 / 세션
                </p>
                <Badge
                  variant="secondary"
                  className="inline-block"
                >
                  멘토 ID: {mentoringData.mentorId}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* 한줄소개 */}
          <div>
            <label className="font-medium">한줄소개</label>
            <p className="mt-1 text-muted-foreground">
              {mentoringData.oneLineIntro}
            </p>
          </div>

          {/* 카테고리 */}
          <div>
            <label className="font-medium flex items-center gap-2">
              <Tag className="h-4 w-4" />
              카테고리
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {mentoringData.categories.map(
                (category, index) => (
                  <Badge
                    key={category}
                    variant="outline"
                    className={
                      categoryColors[
                        index % categoryColors.length
                      ]
                    }
                  >
                    {category}
                  </Badge>
                ),
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 상세 내용 */}
      <Card>
        <CardHeader>
          <CardTitle>상세 내용</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans">
              {mentoringData.content}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* 예약 목록 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                예약 목록
              </CardTitle>
              <CardDescription>
                총 {reservations.length}개의 예약이 있습니다.
              </CardDescription>
            </div>
            <Button onClick={handleAddReservation} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              예약 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {reservations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                예약된 멘토링이 없습니다.
              </p>
              <Button
                onClick={handleAddReservation}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />첫 번째 예약
                추가하기
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-8">
                      멘티 ID
                    </TableHead>
                    <TableHead>멘티 이름</TableHead>
                    <TableHead>요청 시간</TableHead>
                    <TableHead>현재 상태</TableHead>
                    <TableHead>수정</TableHead>
                    <TableHead className="text-right pr-8">
                      삭제
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium pl-8 py-6">
                        {reservation.menteeId}
                      </TableCell>
                      <TableCell className="py-3">
                        {reservation.menteeName}
                      </TableCell>
                      <TableCell className="py-3">
                        {formatDateTime(
                          reservation.requestTime,
                        )}
                      </TableCell>
                      <TableCell className="py-3">
                        {getStatusBadge(reservation.status)}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <Select
                            value={
                              tempStatus[reservation.id] ||
                              reservation.status
                            }
                            onValueChange={(
                              newStatus: ReservationData["status"],
                            ) =>
                              handleStatusChange(
                                reservation.id,
                                newStatus,
                              )
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">
                                대기중
                              </SelectItem>
                              <SelectItem value="approved">
                                승인됨
                              </SelectItem>
                              <SelectItem value="rejected">
                                거절됨
                              </SelectItem>
                              <SelectItem value="completed">
                                완료
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(
                                reservation.id,
                              )
                            }
                            disabled={
                              !tempStatus[reservation.id] ||
                              tempStatus[reservation.id] ===
                                reservation.status
                            }
                          >
                            수정
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 pr-8">
                        <div className="flex justify-end">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                삭제
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  예약 삭제 확인
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  정말로 이 예약을
                                  삭제하시겠습니까?
                                  <br />
                                  <strong>
                                    {reservation.menteeName}
                                  </strong>
                                  님의 예약이 영구적으로
                                  삭제됩니다.
                                  <br />이 작업은 되돌릴 수
                                  없습니다.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  취소
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteReservation(
                                      reservation.id,
                                    )
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  삭제
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}