import SecurityLectureLayout from "@/components/layout/SecurityLectureLayout";
import NetworkThreatExplorer from "@/components/security6/NetworkThreatExplorer";
import SecurityGoalsExplorer from "@/components/security6/SecurityGoalsExplorer";
import OSISecurityLayerMap from "@/components/security6/OSISecurityLayerMap";
import SecurityMechanismExplorer from "@/components/security6/SecurityMechanismExplorer";
import TCPIPSecurityProtocols from "@/components/security6/TCPIPSecurityProtocols";
import SecurityExamQuiz from "@/components/securityShared/SecurityExamQuiz";

export default function Lecture6() {
  return (
    <SecurityLectureLayout lectureId={6}>
      <NetworkThreatExplorer />
      <SecurityGoalsExplorer />
      <OSISecurityLayerMap />
      <SecurityMechanismExplorer />
      <TCPIPSecurityProtocols />
      <SecurityExamQuiz lectureId={6} />
    </SecurityLectureLayout>
  );
}
