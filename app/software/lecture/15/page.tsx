import SoftwareLectureLayout from "@/components/layout/SoftwareLectureLayout";
import SoftwareLectureReview from "@/components/softwareShared/SoftwareLectureReview";

export default function SoftwareLecture15Page() {
  return (
    <SoftwareLectureLayout lectureId={15}>
      <SoftwareLectureReview lectureId={15} />
    </SoftwareLectureLayout>
  );
}
