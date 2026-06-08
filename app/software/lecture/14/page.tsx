import SoftwareLectureLayout from "@/components/layout/SoftwareLectureLayout";
import SoftwareLectureReview from "@/components/softwareShared/SoftwareLectureReview";

export default function SoftwareLecture14Page() {
  return (
    <SoftwareLectureLayout lectureId={14}>
      <SoftwareLectureReview lectureId={14} />
    </SoftwareLectureLayout>
  );
}
