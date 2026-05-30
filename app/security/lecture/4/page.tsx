import SecurityLectureLayout from "@/components/layout/SecurityLectureLayout";
import SecurityLectureReview from "@/components/securityShared/SecurityLectureReview";
import { getSecurityLectureContent } from "@/components/securityShared/lectureData";

export default function Lecture4() {
  return (
    <SecurityLectureLayout lectureId={4}>
      <SecurityLectureReview content={getSecurityLectureContent(4)} />
    </SecurityLectureLayout>
  );
}
