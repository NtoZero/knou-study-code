import SoftwareLectureLayout from "@/components/layout/SoftwareLectureLayout";
import SoftwareLectureReview from "@/components/softwareShared/SoftwareLectureReview";

export default function SoftwareLecture11Page() {
  return (
    <SoftwareLectureLayout lectureId={11}>
      <SoftwareLectureReview lectureId={11} />
    </SoftwareLectureLayout>
  );
}
