import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Plus, Eye } from "lucide-react";
import { fetchMentorings, MentoringSummary } from "../../services/mentoringApi";

// 멘토링 데이터 타입
interface MentoringItem {
  id: string;
  mentorName: string;
  categories: string[];
  price: number;
}

const categoryColors = [
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-purple-100 text-purple-800",
  "bg-orange-100 text-orange-800",
  "bg-pink-100 text-pink-800",
  "bg-indigo-100 text-indigo-800",
];

export function MentoringManagement() {
  const navigate = useNavigate();

  const [mentorings, setMentorings] = useState<MentoringItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMentorings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchMentorings();
        setMentorings(data);
        console.log('✅ UI 상태 업데이트 완료:', { loadedCount: data.length });
      } catch (err) {
        setError("멘토링 데이터를 불러오는데 실패했습니다.");
        console.error("❌ 멘토링 로드 실패:", err);
      } finally {
        setIsLoading(false);
        }
      };
      loadMentorings();
    }, []);

  const handleViewDetail = (mentoringId: string) => {
    navigate(ROUTES.getMentoringDetailPath(mentoringId));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price) + "원";
  };

  return (
    <div className="space-y-3">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h2>멘토링 관리</h2>
          <p className="text-muted-foreground">
            등록된 멘토링을 조회하고 관리할 수 있습니다.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />새 멘토링 등록
        </Button>
      </div>

      {/* 멘토링 목록 테이블 */}
      <div className="space-y-3">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-8">
                  멘토링 ID
                </TableHead>
                <TableHead>멘토명</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>가격</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mentorings.map((mentoring) => (
                <TableRow
                  key={mentoring.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleViewDetail(mentoring.id)}
                >
                  <TableCell className="font-medium pl-8 py-3">
                    {mentoring.id}
                  </TableCell>
                  <TableCell className="py-3">
                    {mentoring.mentorName}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {mentoring.categories
                        .slice(0, 3)
                        .map((category, index) => (
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
                        ))}
                      {mentoring.categories.length > 3 && (
                        <Badge
                          variant="outline"
                          className="bg-gray-100 text-gray-600"
                        >
                          +{mentoring.categories.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    {formatPrice(mentoring.price)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
