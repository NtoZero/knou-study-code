import SoftwareLectureLayout from "@/components/layout/SoftwareLectureLayout";
import SoftwareLectureReview from "@/components/softwareShared/SoftwareLectureReview";

export default function SoftwareLecture5Page() {
  return (
    <SoftwareLectureLayout lectureId={5}>
      <SoftwareLectureReview lectureId={5} />
    </SoftwareLectureLayout>
  );
}
