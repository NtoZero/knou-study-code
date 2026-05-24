import AILectureLayout from "@/components/layout/AILectureLayout";
import { AIExamLecture } from "@/components/aiReview/AIExamLecture";

export default function AILecture13() {
  return (
    <AILectureLayout lectureId={13}>
      <AIExamLecture lectureId={13} />
    </AILectureLayout>
  );
}
