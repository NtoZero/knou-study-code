import LectureLayout from "@/components/layout/LectureLayout";
import NetworkAdvancedLecture from "@/components/networkAdvanced/NetworkAdvancedLecture";

export default function Lecture11() {
  return (
    <LectureLayout lectureId={11}>
      <NetworkAdvancedLecture lectureId={11} />
    </LectureLayout>
  );
}
