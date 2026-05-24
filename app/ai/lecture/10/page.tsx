import AILectureLayout from "@/components/layout/AILectureLayout";
import { AIExamLecture } from "@/components/aiReview/AIExamLecture";

export default function AILecture10() {
  return (
    <AILectureLayout lectureId={10}>
      <AIExamLecture lectureId={10} />
    </AILectureLayout>
  );
}
