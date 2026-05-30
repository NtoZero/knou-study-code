import SecurityLectureLayout from "@/components/layout/SecurityLectureLayout";
import SecuritySystemsOverview from "@/components/security7/SecuritySystemsOverview";
import FirewallArchitectureExplorer from "@/components/security7/FirewallArchitectureExplorer";
import VPNConceptVisualizer from "@/components/security7/VPNConceptVisualizer";
import SecurityExamQuiz from "@/components/securityShared/SecurityExamQuiz";

export default function Lecture7() {
  return (
    <SecurityLectureLayout lectureId={7}>
      <SecuritySystemsOverview />
      <FirewallArchitectureExplorer />
      <VPNConceptVisualizer />
      <SecurityExamQuiz lectureId={7} />
    </SecurityLectureLayout>
  );
}
