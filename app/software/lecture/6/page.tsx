import SoftwareLectureLayout from "@/components/layout/SoftwareLectureLayout";
import SoftwareLectureReview from "@/components/softwareShared/SoftwareLectureReview";

export default function SoftwareLecture6Page() {
  return (
    <SoftwareLectureLayout lectureId={6}>
      <SoftwareLectureReview lectureId={6} />
    </SoftwareLectureLayout>
  );
}
