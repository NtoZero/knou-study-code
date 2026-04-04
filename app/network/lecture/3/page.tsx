import LectureLayout from "@/components/layout/LectureLayout";
import NetworkTopology from "@/components/lecture3/NetworkTopology";
import TransmissionMedia from "@/components/lecture3/TransmissionMedia";
import NetworkDevices from "@/components/lecture3/NetworkDevices";

export default function Lecture3() {
  return (
    <LectureLayout lectureId={3}>
      <TransmissionMedia />
      <NetworkTopology />
      <NetworkDevices />
    </LectureLayout>
  );
}
