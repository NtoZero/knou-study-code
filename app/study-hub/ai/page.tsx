import StudyHeader from "@/components/studyHub/StudyHeader";
import StudyStageTabs from "@/components/studyHub/StudyStageTabs";
import { Target } from "lucide-react";

import StateSpaceIntro from "@/components/studyHub/ai/StateSpaceIntro";
import UCSAlgorithmVisualizer from "@/components/studyHub/ai/UCSAlgorithmVisualizer";
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
        type="공통형 · 30점"
        title="균일비용 탐색 · A* 알고리즘으로 최단 경로 탐색"
        description="도로망 그래프에서 거리 기준 UCS·A*, 시간 기준 UCS·A*로 최적 경로를 찾고 일반화된 최적성 조건을 분석하는 과제. 교재·강의를 기반으로 원리부터 풀이법까지 다룸."
        accent={{
          gradient: "from-indigo-500 to-purple-500",
          bgLight: "bg-indigo-50 dark:bg-indigo-950/40",
          border: "border-indigo-500",
          text: "text-indigo-600",
        }}
        objectives={[
          "상태공간 그래프·탐색 트리의 관계 이해",
          "균일비용 탐색(UCS) 알고리즘의 확장 순서 원리",
          "A* 알고리즘의 평가함수 f(n) = g(n) + h(n) 이해",
          "허용성(admissibility) · 일관성(consistency) 조건 분석",
          "거리 기준 ↔ 시간 기준 비용·휴리스틱 변환",
          "탐색 트리 작성 규약(경로비용·확장 순서 표기)",
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
            <StateSpaceIntro />
            <UCSAlgorithmVisualizer />
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
