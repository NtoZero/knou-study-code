import SecurityLectureLayout from "@/components/layout/SecurityLectureLayout";
import WebThreatSimulator from "@/components/security10/WebThreatSimulator";
import MobileSecurityOverview from "@/components/security10/MobileSecurityOverview";
import WirelessSecurityEvolution from "@/components/security10/WirelessSecurityEvolution";
import RSNProtocolExplorer from "@/components/security10/RSNProtocolExplorer";
import WPA2vsWPA3Comparison from "@/components/security10/WPA2vsWPA3Comparison";
import SecurityExamQuiz from "@/components/securityShared/SecurityExamQuiz";

export default function Lecture10() {
  return (
    <SecurityLectureLayout lectureId={10}>
      <WebThreatSimulator />
      <MobileSecurityOverview />
      <WirelessSecurityEvolution />
      <RSNProtocolExplorer />
      <WPA2vsWPA3Comparison />
      <SecurityExamQuiz lectureId={10} />
    </SecurityLectureLayout>
  );
}
