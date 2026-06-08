import LectureLayout from "@/components/layout/LectureLayout";
import NetworkAdvancedLecture from "@/components/networkAdvanced/NetworkAdvancedLecture";

export default function Lecture12() {
  return (
    <LectureLayout lectureId={12}>
      <NetworkAdvancedLecture lectureId={12} />
    </LectureLayout>
  );
}
