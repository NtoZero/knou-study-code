import SoftwareLectureLayout from "@/components/layout/SoftwareLectureLayout";
import SoftwareLectureReview from "@/components/softwareShared/SoftwareLectureReview";

export default function SoftwareLecture13Page() {
  return (
    <SoftwareLectureLayout lectureId={13}>
      <SoftwareLectureReview lectureId={13} />
    </SoftwareLectureLayout>
  );
}
