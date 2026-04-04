import LectureLayout from "@/components/layout/LectureLayout";
import OSILayerModel from "@/components/lecture1/OSILayerModel";
import DataCommSystemModel from "@/components/lecture1/DataCommSystemModel";
import NetworkHistory from "@/components/lecture1/NetworkHistory";
import ProtocolElements from "@/components/lecture1/ProtocolElements";
import NetworkScale from "@/components/lecture1/NetworkScale";

export default function Lecture1() {
  return (
    <LectureLayout lectureId={1}>
      <DataCommSystemModel />
      <OSILayerModel />
      <ProtocolElements />
      <NetworkHistory />
      <NetworkScale />
    </LectureLayout>
  );
}
