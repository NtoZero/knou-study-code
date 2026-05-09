import SecurityLectureLayout from "@/components/layout/SecurityLectureLayout";
import IDSArchitectureDiagram from "@/components/security8/IDSArchitectureDiagram";
import IDSAnalysisMethodsComparison from "@/components/security8/IDSAnalysisMethodsComparison";
import IDSClassificationTree from "@/components/security8/IDSClassificationTree";
import IPSExplorer from "@/components/security8/IPSExplorer";
import Lecture8Quiz from "@/components/security8/Lecture8Quiz";

export default function Lecture8() {
  return (
    <SecurityLectureLayout lectureId={8}>
      <IDSArchitectureDiagram />
      <IDSAnalysisMethodsComparison />
      <IDSClassificationTree />
      <IPSExplorer />
      <Lecture8Quiz />
    </SecurityLectureLayout>
  );
}
