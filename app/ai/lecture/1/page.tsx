import AILectureLayout from "@/components/layout/AILectureLayout";
import TuringTestDemo from "@/components/ai1/TuringTestDemo";
import HumanVsAI from "@/components/ai1/HumanVsAI";
import GenerativeAIOverview from "@/components/ai1/GenerativeAIOverview";
import AIHistoryTimeline from "@/components/ai1/AIHistoryTimeline";
import AIApproaches from "@/components/ai1/AIApproaches";
import QuizSection from "@/components/ai1/QuizSection";

export default function AILecture1() {
  return (
    <AILectureLayout lectureId={1}>
      <TuringTestDemo />
      <HumanVsAI />
      <GenerativeAIOverview />
      <AIHistoryTimeline />
      <AIApproaches />
      <QuizSection />
    </AILectureLayout>
  );
}
