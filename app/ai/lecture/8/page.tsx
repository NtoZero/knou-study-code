import AILectureLayout from "@/components/layout/AILectureLayout";
import { AIExamLecture } from "@/components/aiReview/AIExamLecture";

export default function AILecture8() {
  return (
    <AILectureLayout lectureId={8}>
      <AIExamLecture lectureId={8} />
    </AILectureLayout>
  );
}
