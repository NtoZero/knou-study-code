import SoftwareLectureLayout from "@/components/layout/SoftwareLectureLayout";
import SoftwareLectureReview from "@/components/softwareShared/SoftwareLectureReview";

export default function SoftwareLecture10Page() {
  return (
    <SoftwareLectureLayout lectureId={10}>
      <SoftwareLectureReview lectureId={10} />
    </SoftwareLectureLayout>
  );
}
