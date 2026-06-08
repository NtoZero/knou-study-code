import SoftwareLectureLayout from "@/components/layout/SoftwareLectureLayout";
import SoftwareLectureReview from "@/components/softwareShared/SoftwareLectureReview";

export default function SoftwareLecture9Page() {
  return (
    <SoftwareLectureLayout lectureId={9}>
      <SoftwareLectureReview lectureId={9} />
    </SoftwareLectureLayout>
  );
}
