import SoftwareLectureLayout from "@/components/layout/SoftwareLectureLayout";
import SoftwareLectureReview from "@/components/softwareShared/SoftwareLectureReview";

export default function SoftwareLecture1Page() {
  return (
    <SoftwareLectureLayout lectureId={1}>
      <SoftwareLectureReview lectureId={1} />
    </SoftwareLectureLayout>
  );
}
