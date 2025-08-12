import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";
import { MentoringDetail } from "./dashboard/MentoringDetail";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "../constants/routes";

export function MentoringDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleBackToList = () => {
    navigate(`${ROUTES.ROOT}#mentoring`);
  };

  return (
    <DashboardLayout 
      pageTitle="멘토링 상세" 
      activeMenu="mentoring-detail"
    >
      <div className="max-w-6xl mx-auto">
        {/* 뒤로 가기 버튼 */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToList}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            멘토링 목록으로
          </Button>
        </div>
        
        {/* 멘토링 상세 컴포넌트 */}
        <MentoringDetail />
      </div>
    </DashboardLayout>
  );
}