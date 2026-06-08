import StudyHeader from "@/components/studyHub/StudyHeader";
import StudyStageTabs from "@/components/studyHub/StudyStageTabs";
import Link from "next/link";
import { BookOpenCheck, Radio } from "lucide-react";

import ShannonWeaverModel from "@/components/studyHub/network/ShannonWeaverModel";
import CommunicationElementsMapping from "@/components/studyHub/network/CommunicationElementsMapping";
import HACvsTraditional from "@/components/studyHub/network/HACvsTraditional";
import SWMappingBuilder from "@/components/studyHub/network/SWMappingBuilder";
import HACTypesExplorer from "@/components/studyHub/network/HACTypesExplorer";
import ProtocolDesignPatterns from "@/components/studyHub/network/ProtocolDesignPatterns";
import HAIProtocolBuilder from "@/components/studyHub/network/HAIProtocolBuilder";
import BlackboxProblemScenarios from "@/components/studyHub/network/BlackboxProblemScenarios";
import HumanInTheLoopStrategies from "@/components/studyHub/network/HumanInTheLoopStrategies";
import EssayWritingTips from "@/components/studyHub/network/EssayWritingTips";
import EssayStructureBuilder from "@/components/studyHub/network/EssayStructureBuilder";
import NetworkCommonMistakes from "@/components/studyHub/network/NetworkCommonMistakes";
import NetworkRandomDrills from "@/components/studyHub/network/NetworkRandomDrills";
import NetworkQuizSection from "@/components/studyHub/network/NetworkQuizSection";
import AssignmentHintCards from "@/components/studyHub/network/AssignmentHintCards";

export default function NetworkStudyHub() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <StudyHeader
        icon={Radio}
        subject="정보통신망"
        type="공통형 · 30점"
        title="HAC(Human-AI Communication) 정의와 미래 발전 전략"
        description="Shannon-Weaver 모델을 확장하여 인간-AI 통신을 정보통신 관점에서 재정의하고, AI-AI 블랙박스화에 대응하는 인간 개입형 프로토콜을 설계하는 과제"
        accent={{
          gradient: "from-orange-500 to-pink-500",
          bgLight: "bg-orange-50 dark:bg-orange-950/40",
          border: "border-orange-500",
          text: "text-orange-600",
        }}
        objectives={[
          "Shannon-Weaver 모델 6요소의 정의와 기능 이해",
          "HAC의 기술적 메커니즘과 전통 통신과의 차이 분석",
          "HAC 유형별 프로토콜·채널·노이즈 특성 파악",
          "AI-AI 블랙박스 문제의 윤리적·기술적 함의 이해",
          "인간 개입형 인터페이스·프로토콜 설계 원리 습득",
        ]}
      />

      <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
        <Link
          href="/network/past-exam"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-800"
        >
          <BookOpenCheck size={16} />
          2015~2019 기말 기출분석 보기
        </Link>
        <p className="mt-2 text-sm leading-6 text-emerald-900 dark:text-emerald-100">
          정보통신망 기말 대비용 출제축 분석과 재구성 문제 페이지로 이동합니다.
        </p>
      </div>

      <StudyStageTabs
        accent={{
          bg: "bg-orange-500",
          bgLight: "bg-orange-50 dark:bg-orange-950/40",
          text: "text-orange-600",
          border: "border-orange-500",
        }}
        foundation={
          <>
            <ShannonWeaverModel />
            <CommunicationElementsMapping />
            <HACvsTraditional />
            <SWMappingBuilder />
          </>
        }
        problem={
          <>
            <HACTypesExplorer />
            <ProtocolDesignPatterns />
            <HAIProtocolBuilder />
          </>
        }
        applied={
          <>
            <BlackboxProblemScenarios />
            <HumanInTheLoopStrategies />
            <EssayWritingTips />
            <EssayStructureBuilder />
            <NetworkCommonMistakes />
            <NetworkRandomDrills />
            <NetworkQuizSection />
            <AssignmentHintCards />
          </>
        }
      />
    </div>
  );
}
