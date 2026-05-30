import SecurityLectureLayout from "@/components/layout/SecurityLectureLayout";
import SecurityLectureReview from "@/components/securityShared/SecurityLectureReview";
import { getSecurityLectureContent } from "@/components/securityShared/lectureData";

export default function Lecture12() {
  return (
    <SecurityLectureLayout lectureId={12}>
      <SecurityLectureReview content={getSecurityLectureContent(12)} />
    </SecurityLectureLayout>
  );
}
