import AILectureLayout from "@/components/layout/AILectureLayout";
import { AIExamLecture } from "@/components/aiReview/AIExamLecture";

export default function AILecture6() {
  return (
    <AILectureLayout lectureId={6}>
      <AIExamLecture lectureId={6} />
    </AILectureLayout>
  );
}
