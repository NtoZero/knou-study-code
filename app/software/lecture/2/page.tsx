import SoftwareLectureLayout from "@/components/layout/SoftwareLectureLayout";
import SoftwareLectureReview from "@/components/softwareShared/SoftwareLectureReview";

export default function SoftwareLecture2Page() {
  return (
    <SoftwareLectureLayout lectureId={2}>
      <SoftwareLectureReview lectureId={2} />
    </SoftwareLectureLayout>
  );
}
