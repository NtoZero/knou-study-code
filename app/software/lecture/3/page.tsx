import SoftwareLectureLayout from "@/components/layout/SoftwareLectureLayout";
import SoftwareLectureReview from "@/components/softwareShared/SoftwareLectureReview";

export default function SoftwareLecture3Page() {
  return (
    <SoftwareLectureLayout lectureId={3}>
      <SoftwareLectureReview lectureId={3} />
    </SoftwareLectureLayout>
  );
}
