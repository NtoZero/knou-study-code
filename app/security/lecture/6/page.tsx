import SecurityLectureLayout from "@/components/layout/SecurityLectureLayout";
import NetworkThreatExplorer from "@/components/security6/NetworkThreatExplorer";
import SecurityGoalsExplorer from "@/components/security6/SecurityGoalsExplorer";
import OSISecurityLayerMap from "@/components/security6/OSISecurityLayerMap";
import SecurityMechanismExplorer from "@/components/security6/SecurityMechanismExplorer";
import TCPIPSecurityProtocols from "@/components/security6/TCPIPSecurityProtocols";
import Lecture6Quiz from "@/components/security6/Lecture6Quiz";

export default function Lecture6() {
  return (
    <SecurityLectureLayout lectureId={6}>
      <NetworkThreatExplorer />
      <SecurityGoalsExplorer />
      <OSISecurityLayerMap />
      <SecurityMechanismExplorer />
      <TCPIPSecurityProtocols />
      <Lecture6Quiz />
    </SecurityLectureLayout>
  );
}
