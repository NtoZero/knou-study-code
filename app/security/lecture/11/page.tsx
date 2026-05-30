import SecurityLectureLayout from "@/components/layout/SecurityLectureLayout";
import SecurityLectureReview from "@/components/securityShared/SecurityLectureReview";
import { getSecurityLectureContent } from "@/components/securityShared/lectureData";

export default function Lecture11() {
  return (
    <SecurityLectureLayout lectureId={11}>
      <SecurityLectureReview content={getSecurityLectureContent(11)} />
    </SecurityLectureLayout>
  );
}
