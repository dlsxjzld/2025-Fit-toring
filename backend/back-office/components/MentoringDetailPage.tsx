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
      activeMenu="mentoring"
    >
        {/* 멘토링 상세 컴포넌트 */}
        <MentoringDetail />
    </DashboardLayout>
  );
}