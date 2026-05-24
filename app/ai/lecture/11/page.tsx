import AILectureLayout from "@/components/layout/AILectureLayout";
import { AIExamLecture } from "@/components/aiReview/AIExamLecture";

export default function AILecture11() {
  return (
    <AILectureLayout lectureId={11}>
      <AIExamLecture lectureId={11} />
    </AILectureLayout>
  );
}
