import LectureLayout from "@/components/layout/LectureLayout";
import SwitchingComparison from "@/components/lecture4/SwitchingComparison";
import MultiplexingVisualizer from "@/components/lecture4/MultiplexingVisualizer";

export default function Lecture4() {
  return (
    <LectureLayout lectureId={4}>
      <SwitchingComparison />
      <MultiplexingVisualizer />
    </LectureLayout>
  );
}
