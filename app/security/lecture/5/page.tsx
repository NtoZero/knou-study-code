import SecurityLectureLayout from "@/components/layout/SecurityLectureLayout";
import SecurityLectureReview from "@/components/securityShared/SecurityLectureReview";
import { getSecurityLectureContent } from "@/components/securityShared/lectureData";

export default function Lecture5() {
  return (
    <SecurityLectureLayout lectureId={5}>
      <SecurityLectureReview content={getSecurityLectureContent(5)} />
    </SecurityLectureLayout>
  );
}
