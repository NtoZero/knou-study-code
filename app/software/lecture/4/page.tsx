import SoftwareLectureLayout from "@/components/layout/SoftwareLectureLayout";
import SoftwareLectureReview from "@/components/softwareShared/SoftwareLectureReview";

export default function SoftwareLecture4Page() {
  return (
    <SoftwareLectureLayout lectureId={4}>
      <SoftwareLectureReview lectureId={4} />
    </SoftwareLectureLayout>
  );
}
