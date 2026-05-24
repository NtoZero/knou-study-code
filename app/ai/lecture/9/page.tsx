import AILectureLayout from "@/components/layout/AILectureLayout";
import { AIExamLecture } from "@/components/aiReview/AIExamLecture";

export default function AILecture9() {
  return (
    <AILectureLayout lectureId={9}>
      <AIExamLecture lectureId={9} />
    </AILectureLayout>
  );
}
