import AILectureLayout from "@/components/layout/AILectureLayout";
import ProblemRepresentation from "@/components/ai2/ProblemRepresentation";
import SearchMethodClassification from "@/components/ai2/SearchMethodClassification";
import DFSSimulator from "@/components/ai2/DFSSimulator";
import BFSSimulator from "@/components/ai2/BFSSimulator";
import UniformCostSimulator from "@/components/ai2/UniformCostSimulator";
import QuizSection from "@/components/ai2/QuizSection";

export default function AILecture2() {
  return (
    <AILectureLayout lectureId={2}>
      <ProblemRepresentation />
      <SearchMethodClassification />
      <DFSSimulator />
      <BFSSimulator />
      <UniformCostSimulator />
      <QuizSection />
    </AILectureLayout>
  );
}
