import StudyHeader from "@/components/studyHub/StudyHeader";
import StudyStageTabs from "@/components/studyHub/StudyStageTabs";
import { Layers } from "lucide-react";

import DXFramework from "@/components/studyHub/software/DXFramework";
import PEEvolutionTimeline from "@/components/studyHub/software/PEEvolutionTimeline";
import IDPArchitecture from "@/components/studyHub/software/IDPArchitecture";
import CPMBasics from "@/components/studyHub/software/CPMBasics";
import CPMCalculationWalkthrough from "@/components/studyHub/software/CPMCalculationWalkthrough";
import SlackTimeCalculator from "@/components/studyHub/software/SlackTimeCalculator";
import PEBenefitsLimitations from "@/components/studyHub/software/PEBenefitsLimitations";
import CPMAdvancedTips from "@/components/studyHub/software/CPMAdvancedTips";

export default function SoftwareStudyHub() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <StudyHeader
        icon={Layers}
        subject="소프트웨어공학"
        type="공통형 · 30점"
        title="Platform Engineering · IDP · CPM 임계경로"
        description="문제 1: DX·PE·IDP 개념 조사 서술 / 문제 2: CPM 네트워크에서 임계경로와 여유시간 계산. 두 문제에 필요한 기초 이론과 유사 유형 풀이법을 정리."
        accent={{
          gradient: "from-emerald-500 to-teal-500",
          bgLight: "bg-emerald-50 dark:bg-emerald-950/40",
          border: "border-emerald-500",
          text: "text-emerald-600",
        }}
        objectives={[
          "Developer Experience(DX)의 3차원 프레임워크 이해",
          "DevOps → SRE → Platform Engineering 진화 흐름 정리",
          "IDP의 5대 구성 요소 및 기대 효과 분석",
          "CPM 네트워크의 EST/EFT/LST/LFT 계산 원리 습득",
          "Forward/Backward pass로 임계 경로·여유시간(Slack) 도출",
        ]}
      />
      <StudyStageTabs
        accent={{
          bg: "bg-emerald-500",
          bgLight: "bg-emerald-50 dark:bg-emerald-950/40",
          text: "text-emerald-600",
          border: "border-emerald-500",
        }}
        foundation={
          <>
            <DXFramework />
            <PEEvolutionTimeline />
            <IDPArchitecture />
            <CPMBasics />
          </>
        }
        problem={
          <>
            <CPMCalculationWalkthrough />
            <SlackTimeCalculator />
          </>
        }
        applied={
          <>
            <PEBenefitsLimitations />
            <CPMAdvancedTips />
          </>
        }
      />
    </div>
  );
}
