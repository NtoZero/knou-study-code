import AILectureLayout from "@/components/layout/AILectureLayout";
import { AIExamLecture } from "@/components/aiReview/AIExamLecture";

export default function AILecture12() {
  return (
    <AILectureLayout lectureId={12}>
      <AIExamLecture lectureId={12} />
    </AILectureLayout>
  );
}
