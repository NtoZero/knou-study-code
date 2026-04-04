import AILectureLayout from "@/components/layout/AILectureLayout";
import MinimaxExplorer from "@/components/ai4/MinimaxExplorer";
import AlphaBetaPruning from "@/components/ai4/AlphaBetaPruning";
import MCTSSteps from "@/components/ai4/MCTSSteps";
import AlphaGoArchitecture from "@/components/ai4/AlphaGoArchitecture";
import QuizSection from "@/components/ai4/QuizSection";

export default function AILecture4() {
  return (
    <AILectureLayout lectureId={4}>
      <MinimaxExplorer />
      <AlphaBetaPruning />
      <MCTSSteps />
      <AlphaGoArchitecture />
      <QuizSection />
    </AILectureLayout>
  );
}
