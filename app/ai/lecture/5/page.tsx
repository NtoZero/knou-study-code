import AILectureLayout from "@/components/layout/AILectureLayout";
import KnowledgePyramid from "@/components/ai5/KnowledgePyramid";
import KnowledgeTypes from "@/components/ai5/KnowledgeTypes";
import LogicRepresentation from "@/components/ai5/LogicRepresentation";
import RuleInference from "@/components/ai5/RuleInference";
import SemanticNetExplorer from "@/components/ai5/SemanticNetExplorer";
import FrameExplorer from "@/components/ai5/FrameExplorer";
import ExpertSystemOverview from "@/components/ai5/ExpertSystemOverview";
import QuizSection from "@/components/ai5/QuizSection";

export default function AILecture5() {
  return (
    <AILectureLayout lectureId={5}>
      <KnowledgePyramid />
      <KnowledgeTypes />
      <LogicRepresentation />
      <RuleInference />
      <SemanticNetExplorer />
      <FrameExplorer />
      <ExpertSystemOverview />
      <QuizSection />
    </AILectureLayout>
  );
}
