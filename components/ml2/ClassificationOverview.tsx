"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { ArrowRight, ArrowDown, Target, Layers } from "lucide-react";

type FlowNode = {
  id: string;
  label: string;
  formula: string;
  caption: string;
  detail: string[];
  tone: string;
};

const flowNodes: FlowNode[] = [
  {
    id: "train-data",
    label: "학습 데이터 집합",
    formula: "D = {(xᵢ, yᵢ)}ᵢ₌₁…ₙ",
    caption: "입력과 목표 출력값의 쌍",
    detail: [
      "각 데이터는 입력 벡터 xᵢ와 클래스 레이블 yᵢ의 쌍으로 주어짐.",
      "레이블은 yᵢ ∈ {0, 1, ⋯, M − 1} 로 M개의 클래스 중 하나를 가리킴.",
      "목표 출력값이 함께 제공되므로 분류는 지도학습에 해당.",
    ],
    tone: "violet",
  },
  {
    id: "learning",
    label: "학습 (데이터 분석)",
    formula: "θ ← D",
    caption: "결정경계의 파라미터를 찾는 과정",
    detail: [
      "학습 데이터를 분석하여 결정경계를 규정하는 파라미터 θ를 결정.",
      "학습 결과로 결정함수/판별함수 g(x; θ)를 얻음.",
    ],
    tone: "violet",
  },
  {
    id: "boundary",
    label: "결정경계",
    formula: "g(x; θ) = 0",
    caption: "결정함수 / 판별함수 g(x; θ)",
    detail: [
      "학습 결과는 결정경계 g(x; θ) = 0 으로 표현되며, g(x; θ)를 결정함수 또는 판별함수라고 부름.",
      "결정경계를 기준으로 입력 공간이 클래스별 결정영역으로 나뉨.",
    ],
    tone: "fuchsia",
  },
  {
    id: "test",
    label: "테스트 데이터",
    formula: "x_new",
    caption: "새로 분류할 입력",
    detail: [
      "학습에 사용되지 않은 새로운 데이터 x_new가 분류기에 입력됨.",
      "학습이 끝난 분류기는 x_new에 대해 판별함수 값을 계산.",
    ],
    tone: "purple",
  },
  {
    id: "decide",
    label: "판별함수 값 판정",
    formula: "g(x_new; θ) ≥ 0 ?",
    caption: "부호에 따라 영역 결정",
    detail: [
      "판별함수 값의 부호가 어느 결정영역에 속하는지를 알려줌.",
      "이진 클래스에서는 하나의 판별함수 부호만으로 클래스가 결정됨.",
    ],
    tone: "purple",
  },
  {
    id: "label",
    label: "클래스 레이블",
    formula: "y_new = 0 또는 1",
    caption: "이진 클래스의 경우",
    detail: [
      "g(x_new) ≥ 0 이면 y_new = 0.",
      "g(x_new) < 0 이면 y_new = 1.",
      "출력은 실수값이 아니라 이산적인 클래스 레이블.",
      "레이블을 붙이는 방식은 문제마다 달라, 뒤의 베이즈 분류기에서는 같은 이진 분류를 y(x) = 1 / −1 로 표기함. 어느 쪽이든 판별함수의 부호 하나로 두 클래스를 가른다는 점은 같으며, 0·1 과 1·−1 을 섞어 쓰지 않도록 주의.",
    ],
    tone: "slate",
  },
];

const toneClass: Record<string, { box: string; text: string }> = {
  violet: {
    box: "border-violet-300 bg-violet-50 dark:border-violet-700 dark:bg-violet-950",
    text: "text-violet-700 dark:text-violet-300",
  },
  fuchsia: {
    box: "border-fuchsia-300 bg-fuchsia-50 dark:border-fuchsia-700 dark:bg-fuchsia-950",
    text: "text-fuchsia-700 dark:text-fuchsia-300",
  },
  purple: {
    box: "border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-950",
    text: "text-purple-700 dark:text-purple-300",
  },
  slate: {
    box: "border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-900",
    text: "text-slate-700 dark:text-slate-300",
  },
};

const classifierList = [
  "베이즈 분류기",
  "K-최근접이웃 방법",
  "결정 트리",
  "랜덤 포레스트",
  "SVM",
  "신경망(MLP, CNN, LSTM)",
];

const applications = [
  {
    name: "숫자 인식",
    db: "MNIST database",
    desc: "손으로 쓴 숫자 이미지를 0∼9의 10개 클래스로 구분.",
  },
  {
    name: "얼굴 인식",
    db: "FERET database",
    desc: "얼굴 영상을 미리 등록된 인물 클래스 중 하나로 구분.",
  },
];

const approaches = [
  {
    key: "prob",
    title: "확률 기반 방법",
    core: "조건부확률 P(Cₖ|x)를 추정하여 분류",
    rep: "베이즈(Bayes) 분류기",
    detail: [
      "데이터가 각 클래스로부터 생성되었을 확률을 확률모델로 추정.",
      "클래스별 확률밀도 p(x|Cₖ)와 사전확률 p(Cₖ)로부터 사후확률 P(Cₖ|x)를 계산.",
      "사후확률이 가장 큰 클래스로 할당하는 것이 결정규칙.",
    ],
    tone: "violet",
  },
  {
    key: "data",
    title: "데이터 기반 방법",
    core: "데이터 간의 관계를 바탕으로 분류",
    rep: "K-최근접이웃(K-Nearest Neighbor, K-NN) 분류기",
    detail: [
      "확률분포 모델을 미리 가정하지 않음.",
      "새 데이터와 학습 데이터 사이의 거리를 직접 계산하여 이웃을 찾음.",
      "가까운 이웃들의 레이블 분포로 클래스를 결정.",
    ],
    tone: "fuchsia",
  },
];

export default function ClassificationOverview() {
  const [activeNode, setActiveNode] = useState<string>("train-data");
  const [activeApproach, setActiveApproach] = useState<string | null>(null);

  const selected = flowNodes.find((n) => n.id === activeNode) ?? flowNodes[0];

  return (
    <section>
      <SectionTitle
        title="분류의 개념"
        subtitle="분류기의 입출력 관계와 결정경계를 얻기 위한 두 가지 접근법"
      />

      {/* 정의 */}
      <div className="mb-6 rounded-xl border border-violet-200 bg-violet-50 p-5 dark:border-violet-800 dark:bg-violet-950">
        <p className="text-sm font-medium text-violet-700 dark:text-violet-300">분류</p>
        <p className="mt-2 text-lg font-bold">
          입력 데이터를 <span className="text-violet-600 dark:text-violet-400">이미 정의된 몇 개의 클래스</span>로 구분하는 문제
        </p>
      </div>

      {/* 적용 예 */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {applications.map((app) => (
          <div
            key={app.name}
            className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-violet-500" />
              <span className="font-bold">{app.name}</span>
            </div>
            <p className="mt-1 text-xs text-gray-400">[{app.db}]</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{app.desc}</p>
          </div>
        ))}
      </div>

      {/* 사용되는 방법 */}
      <div className="mb-10 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
        <p className="mb-3 text-sm font-medium text-gray-500">분류에 사용되는 방법</p>
        <div className="flex flex-wrap gap-2">
          {classifierList.map((c) => (
            <span
              key={c}
              className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900 dark:text-violet-300"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* 입출력 관계 도식 */}
      <h3 className="mb-3 text-base font-bold">분류기의 입출력 관계</h3>
      <p className="mb-4 text-sm text-gray-500">각 단계를 눌러 무슨 일이 일어나는지 확인.</p>

      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {flowNodes.map((node, i) => {
          const tone = toneClass[node.tone];
          const active = activeNode === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setActiveNode(node.id)}
              className={`rounded-xl border-2 p-3 text-left transition-all ${
                active
                  ? `${tone.box} ring-2 ring-violet-400`
                  : "border-gray-200 bg-white hover:border-violet-300 dark:border-gray-800 dark:bg-gray-900"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-gray-400">{i + 1}</span>
                <span className={`text-sm font-bold ${active ? tone.text : ""}`}>{node.label}</span>
              </div>
              <p className="mt-1 font-mono text-xs text-gray-600 dark:text-gray-400">{node.formula}</p>
              <p className="mt-1 text-[11px] text-gray-400">{node.caption}</p>
              <div className="mt-1 flex justify-end text-gray-300">
                {i < flowNodes.length - 1 &&
                  (i % 3 === 2 ? <ArrowDown size={12} /> : <ArrowRight size={12} />)}
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="mb-10 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900"
        >
          <p className={`text-sm font-bold ${toneClass[selected.tone].text}`}>{selected.label}</p>
          <ul className="mt-2 space-y-1.5">
            {selected.detail.map((d, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-violet-400">·</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>

      {/* 학습 목표 */}
      <div className="mb-10 rounded-xl border-l-4 border-violet-500 bg-violet-50 p-5 dark:bg-violet-950">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-violet-600 dark:text-violet-400" />
          <p className="font-bold">학습 목표 &mdash; 최적의 결정경계를 찾는 것</p>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="rounded-lg bg-white p-3 text-sm dark:bg-gray-900">
            <span className="font-medium text-violet-600 dark:text-violet-400">&lsquo;최적&rsquo;의 의미 ①</span>
            <p className="mt-1 text-gray-600 dark:text-gray-400">분류율의 최대화</p>
          </div>
          <div className="rounded-lg bg-white p-3 text-sm dark:bg-gray-900">
            <span className="font-medium text-violet-600 dark:text-violet-400">&lsquo;최적&rsquo;의 의미 ②</span>
            <p className="mt-1 text-gray-600 dark:text-gray-400">분류오차의 최소화</p>
          </div>
        </div>
      </div>

      {/* 두 접근법 분기 */}
      <h3 className="mb-1 text-base font-bold">결정경계를 얻기 위한 두 가지 접근법</h3>
      <p className="mb-4 text-sm text-gray-500">
        이 분기가 2강 전체의 구조 &mdash; 확률 기반은 베이즈 분류기로, 데이터 기반은 K-최근접이웃 분류기로 이어짐.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {approaches.map((a) => {
          const tone = toneClass[a.tone];
          const open = activeApproach === a.key;
          return (
            <button
              key={a.key}
              onClick={() => setActiveApproach(open ? null : a.key)}
              className={`rounded-xl border-2 p-4 text-left transition-all ${
                open ? tone.box : "border-gray-200 bg-white hover:border-violet-300 dark:border-gray-800 dark:bg-gray-900"
              }`}
            >
              <p className={`text-sm font-bold ${tone.text}`}>{a.title}</p>
              <p className="mt-2 text-sm font-medium">{a.core}</p>
              <p className="mt-2 text-xs text-gray-500">대표 방법: {a.rep}</p>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 space-y-1 overflow-hidden"
                  >
                    {a.detail.map((d, i) => (
                      <li key={i} className="flex gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="text-violet-400">·</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
              {!open && <p className="mt-2 text-[11px] text-gray-400">눌러서 자세히 보기</p>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
