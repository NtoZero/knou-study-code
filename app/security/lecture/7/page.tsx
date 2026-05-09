import SecurityLectureLayout from "@/components/layout/SecurityLectureLayout";
import SecuritySystemsOverview from "@/components/security7/SecuritySystemsOverview";
import FirewallArchitectureExplorer from "@/components/security7/FirewallArchitectureExplorer";
import VPNConceptVisualizer from "@/components/security7/VPNConceptVisualizer";
import Lecture7Quiz from "@/components/security7/Lecture7Quiz";

export default function Lecture7() {
  return (
    <SecurityLectureLayout lectureId={7}>
      <SecuritySystemsOverview />
      <FirewallArchitectureExplorer />
      <VPNConceptVisualizer />
      <Lecture7Quiz />
    </SecurityLectureLayout>
  );
}
