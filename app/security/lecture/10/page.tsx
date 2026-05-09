import SecurityLectureLayout from "@/components/layout/SecurityLectureLayout";
import WebThreatSimulator from "@/components/security10/WebThreatSimulator";
import WirelessSecurityEvolution from "@/components/security10/WirelessSecurityEvolution";
import RSNProtocolExplorer from "@/components/security10/RSNProtocolExplorer";
import WPA2vsWPA3Comparison from "@/components/security10/WPA2vsWPA3Comparison";
import Lecture10Quiz from "@/components/security10/Lecture10Quiz";

export default function Lecture10() {
  return (
    <SecurityLectureLayout lectureId={10}>
      <WebThreatSimulator />
      <WirelessSecurityEvolution />
      <RSNProtocolExplorer />
      <WPA2vsWPA3Comparison />
      <Lecture10Quiz />
    </SecurityLectureLayout>
  );
}
