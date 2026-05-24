import AILectureLayout from "@/components/layout/AILectureLayout";
import { AIExamLecture } from "@/components/aiReview/AIExamLecture";

export default function AILecture7() {
  return (
    <AILectureLayout lectureId={7}>
      <AIExamLecture lectureId={7} />
    </AILectureLayout>
  );
}
