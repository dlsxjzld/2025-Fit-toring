import { useState } from "react";
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

// 멘토링 데이터 타입
interface MentoringItem {
  id: string;
  mentorName: string;
  categories: string[];
  price: number;
}

// 더미 데이터
const mockMentoringData: MentoringItem[] = [
  {
    id: "M001",
    mentorName: "김성현",
    categories: ["체형 교정", "다이어트", "자세 교정"],
    price: 50000,
  },
  {
    id: "M002",
    mentorName: "박지훈",
    categories: ["벌크업", "근력 강화", "식단 관리"],
    price: 65000,
  },
  {
    id: "M003",
    mentorName: "이수민",
    categories: ["홈 트레이닝", "유연성·스트레칭", "자세 교정"],
    price: 45000,
  },
  {
    id: "M004",
    mentorName: "정대영",
    categories: ["재활 운동", "부상 상담", "유연성·스트레칭"],
    price: 70000,
  },
  {
    id: "M005",
    mentorName: "최영희",
    categories: ["다이어트", "식단 관리", "홈 트레이닝"],
    price: 40000,
  },
];

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
              {mockMentoringData.map((mentoring) => (
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