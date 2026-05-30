import SecurityLectureLayout from "@/components/layout/SecurityLectureLayout";
import SecurityLectureReview from "@/components/securityShared/SecurityLectureReview";
import { getSecurityLectureContent } from "@/components/securityShared/lectureData";

export default function Lecture3() {
  return (
    <SecurityLectureLayout lectureId={3}>
      <SecurityLectureReview content={getSecurityLectureContent(3)} />
    </SecurityLectureLayout>
  );
}
