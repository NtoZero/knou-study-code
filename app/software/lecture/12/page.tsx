import SoftwareLectureLayout from "@/components/layout/SoftwareLectureLayout";
import SoftwareLectureReview from "@/components/softwareShared/SoftwareLectureReview";

export default function SoftwareLecture12Page() {
  return (
    <SoftwareLectureLayout lectureId={12}>
      <SoftwareLectureReview lectureId={12} />
    </SoftwareLectureLayout>
  );
}
