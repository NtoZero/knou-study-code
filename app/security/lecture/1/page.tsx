import SecurityLectureLayout from "@/components/layout/SecurityLectureLayout";
import SecurityLectureReview from "@/components/securityShared/SecurityLectureReview";
import { getSecurityLectureContent } from "@/components/securityShared/lectureData";

export default function Lecture1() {
  return (
    <SecurityLectureLayout lectureId={1}>
      <SecurityLectureReview content={getSecurityLectureContent(1)} />
    </SecurityLectureLayout>
  );
}
