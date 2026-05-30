import SecurityLectureLayout from "@/components/layout/SecurityLectureLayout";
import SecurityLectureReview from "@/components/securityShared/SecurityLectureReview";
import { getSecurityLectureContent } from "@/components/securityShared/lectureData";

export default function Lecture13() {
  return (
    <SecurityLectureLayout lectureId={13}>
      <SecurityLectureReview content={getSecurityLectureContent(13)} />
    </SecurityLectureLayout>
  );
}
