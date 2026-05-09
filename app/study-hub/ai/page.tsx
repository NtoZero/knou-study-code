import StudyHeader from "@/components/studyHub/StudyHeader";
import StudyStageTabs from "@/components/studyHub/StudyStageTabs";
import { Target } from "lucide-react";

import AIOverviewIntro from "@/components/studyHub/ai/AIOverviewIntro";
import ProblemSolvingBasics from "@/components/studyHub/ai/ProblemSolvingBasics";
import BlindSearchVisualizer from "@/components/studyHub/ai/BlindSearchVisualizer";
import SearchMechanismBasics from "@/components/studyHub/ai/SearchMechanismBasics";
import StateSpaceIntro from "@/components/studyHub/ai/StateSpaceIntro";
import UCSIntro from "@/components/studyHub/ai/UCSIntro";
import EvalFunctionIntro from "@/components/studyHub/ai/EvalFunctionIntro";
import UCSAlgorithmVisualizer from "@/components/studyHub/ai/UCSAlgorithmVisualizer";
import HeuristicSearchIntro from "@/components/studyHub/ai/HeuristicSearchIntro";
import HillClimbingVisualizer from "@/components/studyHub/ai/HillClimbingVisualizer";
import AStarAlgorithmVisualizer from "@/components/studyHub/ai/AStarAlgorithmVisualizer";
import HeuristicProperties from "@/components/studyHub/ai/HeuristicProperties";
import UCSTreeBuildingGuide from "@/components/studyHub/ai/UCSTreeBuildingGuide";
import AStarTreeBuildingGuide from "@/components/studyHub/ai/AStarTreeBuildingGuide";
import CostConversionTips from "@/components/studyHub/ai/CostConversionTips";
import SearchAutoCalculator from "@/components/studyHub/ai/SearchAutoCalculator";
import OptimalityAnalysis from "@/components/studyHub/ai/OptimalityAnalysis";
import CommonMistakes from "@/components/studyHub/ai/CommonMistakes";
import PracticeGraph from "@/components/studyHub/ai/PracticeGraph";
import VerificationTechniques from "@/components/studyHub/ai/VerificationTechniques";
import AIRandomDrills from "@/components/studyHub/ai/AIRandomDrills";
import AIQuizSection from "@/components/studyHub/ai/AIQuizSection";
import AssignmentHints from "@/components/studyHub/ai/AssignmentHints";

export default function AIStudyHub() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <StudyHeader
        icon={Target}
        subject="인공지능"
        type="1~3강 · 기초부터 A* 까지"
        title="인공지능 개요 · 문제풀이 · 탐색 알고리즘"
        description="AI가 무엇인지부터 시작해, 문제를 상태공간으로 표현하는 법, DFS·BFS·UCS·A* 탐색 알고리즘까지 단계적으로 학습합니다. 처음 인공지능을 배우는 분도 이해할 수 있도록 기초 개념부터 구성했습니다."
        accent={{
          gradient: "from-indigo-500 to-purple-500",
          bgLight: "bg-indigo-50 dark:bg-indigo-950/40",
          border: "border-indigo-500",
          text: "text-indigo-600",
        }}
        objectives={[
          "인공지능의 정의·역사·종류(약한/강한/생성형 AI) 이해",
          "AI 구현 접근방법: 기호처리·통계·연결주의",
          "상태·연산자·상태공간으로 문제를 표현하는 법",
          "DFS(깊이우선)·BFS(너비우선) 맹목적 탐색 원리",
          "균일비용 탐색(UCS) — 비용 기반 최적 경로 탐색",
          "A* 알고리즘 — 휴리스틱으로 더 똑똑하게 탐색",
          "허용성(admissibility) 조건과 최적성 보장",
        ]}
      />
      <StudyStageTabs
        accent={{
          bg: "bg-indigo-500",
          bgLight: "bg-indigo-50 dark:bg-indigo-950/40",
          text: "text-indigo-600",
          border: "border-indigo-500",
        }}
        foundation={
          <>
            <AIOverviewIntro />
            <ProblemSolvingBasics />
            <BlindSearchVisualizer />
            <SearchMechanismBasics />
            <StateSpaceIntro />
            <UCSIntro />
            <EvalFunctionIntro />
            <UCSAlgorithmVisualizer />
            <HeuristicSearchIntro />
            <HillClimbingVisualizer />
            <AStarAlgorithmVisualizer />
            <HeuristicProperties />
          </>
        }
        problem={
          <>
            <UCSTreeBuildingGuide />
            <AStarTreeBuildingGuide />
            <CostConversionTips />
            <SearchAutoCalculator />
          </>
        }
        applied={
          <>
            <OptimalityAnalysis />
            <CommonMistakes />
            <VerificationTechniques />
            <AIRandomDrills />
            <AIQuizSection />
            <AssignmentHints />
            <PracticeGraph />
          </>
        }
      />
    </div>
  );
}
