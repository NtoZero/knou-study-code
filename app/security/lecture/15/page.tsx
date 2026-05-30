import SecurityLectureLayout from "@/components/layout/SecurityLectureLayout";
import SecurityLectureReview from "@/components/securityShared/SecurityLectureReview";
import { getSecurityLectureContent } from "@/components/securityShared/lectureData";

export default function Lecture15() {
  return (
    <SecurityLectureLayout lectureId={15}>
      <SecurityLectureReview content={getSecurityLectureContent(15)} />
    </SecurityLectureLayout>
  );
}
