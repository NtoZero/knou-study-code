import LectureLayout from "@/components/layout/LectureLayout";
import ParityCheck from "@/components/lecture5/ParityCheck";
import ChecksumVisualizer from "@/components/lecture5/ChecksumVisualizer";
import CRCVisualizer from "@/components/lecture5/CRCVisualizer";
import ARQMethods from "@/components/lecture5/ARQMethods";
import SlidingWindow from "@/components/lecture5/SlidingWindow";
import ErrorControlTree from "@/components/lecture5/ErrorControlTree";

export default function Lecture5() {
  return (
    <LectureLayout lectureId={5}>
      <ErrorControlTree />
      <ParityCheck />
      <ChecksumVisualizer />
      <CRCVisualizer />
      <ARQMethods />
      <SlidingWindow />
    </LectureLayout>
  );
}
