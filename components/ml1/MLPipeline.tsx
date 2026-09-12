"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import StepControls from "@/components/common/StepControls";
import { ArrowRight, Info } from "lucide-react";

type NodeKind = "data" | "pre" | "feat" | "core" | "result";

interface PipeNode {
  id: string;
  row: "learn" | "infer";
  label: string;
  english?: string;
  kind: NodeKind;
  definition: string;
  detail: string;
}

const nodes: PipeNode[] = [
  {
    id: "train-data",
    row: "learn",
    label: "학습 데이터 집합",
    english: "training data",
    kind: "data",
    definition: "학습 단계(learning stage)의 입력 데이터.",
    detail:
      "학습 단계에는 충분히 많은 양의 학습 데이터가 필요. 시스템을 개발하는 단계이므로, 주어진 데이터 집합을 분석하여 입력과 출력을 잘 매핑해 주는 함수를 찾음.",
  },
  {
    id: "learn-pre",
    row: "learn",
    label: "전처리",
    english: "preprocessing",
    kind: "pre",
    definition: "중복·불필요한 데이터 제거 및 분석에 용이한 형태로 데이터 가공·변환.",
    detail:
      "문제 및 입력 데이터 유형에 의존적이며 머신러닝과 직접 관련 없음. 강의 예 — 영상들의 크기가 서로 다르면 크기를 일정하게 맞추고, 입력값들의 범위가 서로 다르면 그 범위를 일정하게 만들어 줌.",
  },
  {
    id: "learn-feat",
    row: "learn",
    label: "특징추출",
    english: "feature extraction",
    kind: "feat",
    definition: "데이터 분석·처리를 위한 핵심적인 정보 추출.",
    detail:
      "데이터 특성에 의존하지만, “어떤 핵심 정보를 추출할 것인가?”는 머신러닝의 주요 문제 영역. 핵심 정보만 남겨 계산량과 메모리 같은 비용 문제도 줄임.",
  },
  {
    id: "learn-core",
    row: "learn",
    label: "학습 (데이터 분석)",
    kind: "core",
    definition: "추출한 특징을 기반으로 데이터를 분석하여 학습을 수행하는 단계.",
    detail:
      "머신러닝이 관심을 갖는 영역은 특징추출과 이 학습(분석) 단계. 학습의 결과로 입력 x를 출력 y로 매핑해 주는 함수를 얻음.",
  },
  {
    id: "learn-result",
    row: "learn",
    label: "학습 결과 — 함수 y = f(x)",
    kind: "result",
    definition: "입·출력 매핑 형태의 함수로 표현된 학습 결과.",
    detail:
      "학습 결과인 함수가 추론 단계에서 그대로 사용됨. 이 함수를 찾는 것이 곧 학습이며, 함수의 모양을 결정하는 매개변수를 찾는 일과 같음.",
  },
  {
    id: "test-data",
    row: "infer",
    label: "테스트 데이터",
    english: "test data",
    kind: "data",
    definition: "추론 단계(inference stage)의 입력 데이터.",
    detail:
      "학습이 끝난 후 그 시스템을 실제 데이터에 적용하는 단계의 입력. 학습 데이터와 같지 않은 데이터를 사용.",
  },
  {
    id: "infer-pre",
    row: "infer",
    label: "전처리",
    english: "preprocessing",
    kind: "pre",
    definition: "추론 단계에서도 학습 단계와 동일한 전처리를 적용.",
    detail:
      "학습 단계와 추론 단계 모두 입력 데이터의 전처리가 필요. 학습할 때와 다른 형태로 데이터를 넣으면 학습 결과를 그대로 쓸 수 없음.",
  },
  {
    id: "infer-feat",
    row: "infer",
    label: "특징추출",
    english: "feature extraction",
    kind: "feat",
    definition: "추론 단계에서도 학습 단계와 동일한 특징추출을 적용.",
    detail:
      "학습에 사용한 것과 같은 방식으로 핵심 정보를 뽑아내야 학습 결과인 함수에 그대로 입력할 수 있음.",
  },
  {
    id: "infer-core",
    row: "infer",
    label: "분류 · 회귀 · 군집화",
    kind: "core",
    definition: "학습된 함수를 이용해 실제 데이터 분석 작업을 수행.",
    detail:
      "머신러닝에서 다루는 데이터 분석 주제가 바로 이 분류(classification), 회귀(regression), 군집화(clustering).",
  },
  {
    id: "infer-result",
    row: "infer",
    label: "판단 결과",
    kind: "result",
    definition: "추론 단계의 최종 출력.",
    detail:
      "실제 시스템의 성능 평가는 테스트 데이터를 사용하는 이 추론 단계에서 이뤄짐.",
  },
];

const kindStyle: Record<NodeKind, { box: string; badge?: string; badgeText?: string }> = {
  data: {
    box: "border-slate-300 bg-slate-50 text-slate-800 dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-100",
  },
  pre: {
    box: "border-gray-300 bg-gray-100 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200",
    badge: "bg-gray-400 text-white",
    badgeText: "머신러닝과 직접 관련 없음",
  },
  feat: {
    box: "border-cyan-400 bg-cyan-50 text-cyan-900 dark:border-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-100",
    badge: "bg-cyan-600 text-white",
    badgeText: "머신러닝의 주요 문제 영역",
  },
  core: {
    box: "border-cyan-500 bg-cyan-100 text-cyan-900 dark:border-cyan-500 dark:bg-cyan-900/60 dark:text-cyan-50",
    badge: "bg-cyan-600 text-white",
    badgeText: "머신러닝의 주요 문제 영역",
  },
  result: {
    box: "border-sky-400 bg-sky-50 text-sky-900 dark:border-sky-600 dark:bg-sky-950/60 dark:text-sky-100",
  },
};

export default function MLPipeline() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState<string>("learn-pre");

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      setStep((s) => {
        if (s >= nodes.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 1100);
    return () => window.clearTimeout(timer);
  }, [playing, step]);

  const selectedNode = nodes.find((n) => n.id === selected)!;
  const learnNodes = nodes.filter((n) => n.row === "learn");
  const inferNodes = nodes.filter((n) => n.row === "infer");

  const renderRow = (rowNodes: PipeNode[], title: string, subtitle: string) => (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-3 flex flex-wrap items-baseline gap-2">
        <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-stretch gap-2">
        {rowNodes.map((n, i) => {
          const globalIndex = nodes.findIndex((x) => x.id === n.id);
          const reached = globalIndex <= step;
          const style = kindStyle[n.kind];
          return (
            <div key={n.id} className="flex items-center gap-2">
              {i > 0 && (
                <ArrowRight
                  size={14}
                  className={reached ? "text-cyan-500" : "text-gray-300 dark:text-gray-700"}
                />
              )}
              <motion.button
                onClick={() => setSelected(n.id)}
                animate={{
                  opacity: reached ? 1 : 0.35,
                  scale: globalIndex === step ? 1.04 : 1,
                }}
                transition={{ duration: 0.25 }}
                className={`min-w-[92px] rounded-lg border px-2.5 py-2 text-left text-xs font-medium transition-shadow ${style.box} ${
                  selected === n.id ? "ring-2 ring-cyan-500 ring-offset-1 dark:ring-offset-gray-900" : ""
                }`}
              >
                <span className="block leading-snug">{n.label}</span>
                {n.english && <span className="mt-0.5 block text-[10px] opacity-60">{n.english}</span>}
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <section>
      <SectionTitle
        title="머신러닝의 처리 과정"
        subtitle="학습 단계와 추론 단계 — 단계를 눌러 정의를 확인하거나 재생으로 흐름을 따라가기"
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-gray-400 bg-gray-200 dark:bg-gray-700" />
            머신러닝과 직접 관련 없음
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-cyan-500 bg-cyan-200 dark:bg-cyan-800" />
            머신러닝의 주요 문제 영역
          </span>
        </div>
        <StepControls
          step={step}
          totalSteps={nodes.length}
          playing={playing}
          onPlay={() => {
            if (step >= nodes.length - 1) setStep(0);
            setPlaying(true);
          }}
          onStop={() => setPlaying(false)}
          onReset={() => {
            setPlaying(false);
            setStep(0);
          }}
          onNext={() => setStep((s) => Math.min(s + 1, nodes.length - 1))}
          onPrev={() => setStep((s) => Math.max(s - 1, 0))}
        />
      </div>

      <div className="space-y-3">
        {renderRow(learnNodes, "학습 단계", "learning stage — 시스템을 개발하는 단계")}
        {renderRow(inferNodes, "추론 단계", "inference stage — 학습된 시스템을 실제 데이터에 적용하는 단계")}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedNode.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-900 dark:bg-cyan-950/40"
        >
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-base font-bold text-cyan-900 dark:text-cyan-100">{selectedNode.label}</p>
            {kindStyle[selectedNode.kind].badgeText && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${kindStyle[selectedNode.kind].badge}`}
              >
                {kindStyle[selectedNode.kind].badgeText}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm font-medium text-gray-800 dark:text-gray-100">
            {selectedNode.definition}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {selectedNode.detail}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex gap-2 rounded-lg bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
        <Info size={16} className="mt-0.5 shrink-0 text-slate-500" />
        <p className="leading-relaxed">
          전처리는 문제와 입력 데이터의 유형에 따라 달라지므로 머신러닝에서 깊이 다루지 않음. 반면{" "}
          <strong>특징추출</strong>과 <strong>분류·회귀·군집화</strong>가 머신러닝이 관심을 갖는 영역.
        </p>
      </div>
    </section>
  );
}
