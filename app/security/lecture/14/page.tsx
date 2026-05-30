import SecurityLectureLayout from "@/components/layout/SecurityLectureLayout";
import SecurityLectureReview from "@/components/securityShared/SecurityLectureReview";
import { getSecurityLectureContent } from "@/components/securityShared/lectureData";

export default function Lecture14() {
  return (
    <SecurityLectureLayout lectureId={14}>
      <SecurityLectureReview content={getSecurityLectureContent(14)} />
    </SecurityLectureLayout>
  );
}
