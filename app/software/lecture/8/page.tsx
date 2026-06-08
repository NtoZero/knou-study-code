import SoftwareLectureLayout from "@/components/layout/SoftwareLectureLayout";
import SoftwareLectureReview from "@/components/softwareShared/SoftwareLectureReview";

export default function SoftwareLecture8Page() {
  return (
    <SoftwareLectureLayout lectureId={8}>
      <SoftwareLectureReview lectureId={8} />
    </SoftwareLectureLayout>
  );
}
