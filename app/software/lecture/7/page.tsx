import SoftwareLectureLayout from "@/components/layout/SoftwareLectureLayout";
import SoftwareLectureReview from "@/components/softwareShared/SoftwareLectureReview";

export default function SoftwareLecture7Page() {
  return (
    <SoftwareLectureLayout lectureId={7}>
      <SoftwareLectureReview lectureId={7} />
    </SoftwareLectureLayout>
  );
}
