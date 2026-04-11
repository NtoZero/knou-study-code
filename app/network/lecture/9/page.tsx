import LectureLayout from "@/components/layout/LectureLayout";
import TransportOverview from "@/components/lecture9/TransportOverview";
import UDPDatagramHeader from "@/components/lecture9/UDPDatagramHeader";
import TCPSegmentHeader from "@/components/lecture9/TCPSegmentHeader";
import TCPHandshake from "@/components/lecture9/TCPHandshake";
import TCPReliability from "@/components/lecture9/TCPReliability";
import Quiz9 from "@/components/lecture9/Quiz9";

export default function Lecture9() {
  return (
    <LectureLayout lectureId={9}>
      <TransportOverview />
      <UDPDatagramHeader />
      <TCPSegmentHeader />
      <TCPHandshake />
      <TCPReliability />
      <Quiz9 />
    </LectureLayout>
  );
}
