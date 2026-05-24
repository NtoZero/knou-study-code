import AILectureLayout from "@/components/layout/AILectureLayout";
import { AIExamLecture } from "@/components/aiReview/AIExamLecture";

export default function AILecture15() {
  return (
    <AILectureLayout lectureId={15}>
      <AIExamLecture lectureId={15} />
    </AILectureLayout>
  );
}
