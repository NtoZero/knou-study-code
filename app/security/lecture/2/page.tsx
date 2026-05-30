import SecurityLectureLayout from "@/components/layout/SecurityLectureLayout";
import SecurityLectureReview from "@/components/securityShared/SecurityLectureReview";
import { getSecurityLectureContent } from "@/components/securityShared/lectureData";

export default function Lecture2() {
  return (
    <SecurityLectureLayout lectureId={2}>
      <SecurityLectureReview content={getSecurityLectureContent(2)} />
    </SecurityLectureLayout>
  );
}
