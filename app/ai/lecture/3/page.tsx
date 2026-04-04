import AILectureLayout from "@/components/layout/AILectureLayout";
import EvaluationFunctions from "@/components/ai3/EvaluationFunctions";
import HillClimbingExplorer from "@/components/ai3/HillClimbingExplorer";
import SimulatedAnnealingDemo from "@/components/ai3/SimulatedAnnealingDemo";
import AStarSimulator from "@/components/ai3/AStarSimulator";
import QuizSection from "@/components/ai3/QuizSection";

export default function AILecture3() {
  return (
    <AILectureLayout lectureId={3}>
      <EvaluationFunctions />
      <HillClimbingExplorer />
      <SimulatedAnnealingDemo />
      <AStarSimulator />
      <QuizSection />
    </AILectureLayout>
  );
}
