"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Zap, RefreshCw, Info } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import NetworkTerm from "./NetworkTerm";

type ElementKey =
  | "source"
  | "transmitter"
  | "channel"
  | "receiver"
  | "destination"
  | "noise";

type NoiseType = "physical" | "semantic";

interface ElementInfo {
  key: ElementKey;
  label: string;
  role: string;
  definition: string;
  example: string;
  hacContext: string;
}

const ELEMENTS: ElementInfo[] = [
  {
    key: "source",
    label: "Information Source",
    role: "정보원",
    definition:
      "전달하고자 하는 메시지(message)를 생산하는 주체. 원천 정보는 이 단계에서 의미를 가진 형태로 존재함.",
    example: "사람이 떠올리는 말, 센서가 감지한 측정값 m",
    hacContext: "HAC(인간→AI): 인간 사용자 · HAC(AI→인간): AI 모델 추론 엔진",
  },
  {
    key: "transmitter",
    label: "Transmitter (Encoder)",
    role: "송신기 · 인코더",
    definition:
      "메시지를 채널이 전달할 수 있는 신호 s(t)로 변환. 부호화(encoding) · 변조(modulation) 수행.",
    example: "마이크, 모뎀, 문자 → 비트 → 전파 변환 장치",
    hacContext:
      "HAC(인간→AI): 키보드·마이크·카메라 + 토크나이저 · HAC(AI→인간): 언어 생성 모듈(디코더)",
  },
  {
    key: "channel",
    label: "Channel",
    role: "채널(전송 매체)",
    definition:
      "신호를 송신 측에서 수신 측으로 전달하는 물리적 · 논리적 매체. 손실과 왜곡이 발생할 수 있음.",
    example: "유선(구리선, 광섬유), 무선(전파), 공기(음성)",
    hacContext: "HAC: HTTPS REST API, WebSocket, gRPC 등 — 논리적 채널",
  },
  {
    key: "receiver",
    label: "Receiver (Decoder)",
    role: "수신기 · 디코더",
    definition:
      "채널을 통해 전달된 신호 r(t)를 복원하고 복호화하여 원 메시지 추정치 m'를 만듦.",
    example: "스피커, 복조기, 디코딩 회로",
    hacContext:
      "HAC(인간→AI): 토크나이저 + 임베딩 변환기(AI 전처리) · HAC(AI→인간): 렌더링 엔진",
  },
  {
    key: "destination",
    label: "Destination",
    role: "목적지",
    definition:
      "복원된 메시지가 최종적으로 도착하는 지점. 의미를 해석하고 행동으로 연결하는 최종 수신 주체.",
    example: "청자, 사용자 애플리케이션, 제어 시스템",
    hacContext:
      "HAC(인간→AI): AI 추론 엔진 · HAC(AI→인간): 인간 사용자(능동적 해석자)",
  },
  {
    key: "noise",
    label: "Noise Source",
    role: "잡음원",
    definition:
      "채널을 통과하는 동안 신호를 왜곡 · 변형 · 손상시키는 요인. 전기적·환경적·의미적 요인을 포괄.",
    example: "전자기 간섭, 열잡음, 패킷 손실, 오탈자",
    hacContext:
      "HAC 노이즈는 의미론적(semantic) — 프롬프트 모호성, 환각, 컨텍스트 유실이 핵심",
  },
];

const NOISE_TYPES = {
  physical: {
    label: "물리적 노이즈 (전통 통신)",
    color: "bg-red-500",
    border: "border-red-400",
    bg: "bg-red-50 dark:bg-red-950/30",
    items: [
      { name: "전기적 간섭", desc: "전자기장이 구리선 신호를 왜곡" },
      { name: "열잡음(Thermal Noise)", desc: "전자의 열적 진동이 무작위 잡음 생성" },
      { name: "상호 변조 잡음", desc: "비선형 소자에서 주파수 간 간섭" },
      { name: "패킷 손실", desc: "네트워크 혼잡으로 데이터 단위 유실" },
      { name: "신호 감쇠(Attenuation)", desc: "거리에 따른 신호 세기 약화" },
    ],
  },
  semantic: {
    label: "의미론적 노이즈 (HAC 특유)",
    color: "bg-violet-500",
    border: "border-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    items: [
      { name: "프롬프트 모호성", desc: "인간 의도가 불명확한 자연어로 표현됨" },
      { name: "환각(Hallucination)", desc: "LLM이 사실이 아닌 정보를 그럴듯하게 생성" },
      { name: "컨텍스트 유실", desc: "토큰 윈도우 한계로 초기 맥락이 잘림" },
      { name: "비대칭 인코딩", desc: "인간과 AI의 코드 체계(언어 vs 벡터)가 근본적으로 다름" },
      { name: "출력 해석 오류", desc: "AI 응답을 인간이 잘못 이해하는 수신 측 노이즈" },
    ],
  },
};

const WEAVER_LEVELS = [
  {
    level: "A. 기술적 문제",
    q: "얼마나 정확히 통신 기호가 전달되는가?",
    scope: "비트 오류율, SNR, 대역폭",
    color: "border-sky-300 bg-sky-50/60 dark:border-sky-800 dark:bg-sky-950/30",
    textColor: "text-sky-600",
  },
  {
    level: "B. 의미론적 문제",
    q: "전달된 기호가 의도한 의미를 얼마나 정확히 전달하는가?",
    scope: "해석, 번역, 문맥 이해",
    color:
      "border-amber-300 bg-amber-50/60 dark:border-amber-800 dark:bg-amber-950/30",
    textColor: "text-amber-600",
  },
  {
    level: "C. 효과성 문제",
    q: "받은 의미가 수신자의 행동을 원하는 방향으로 유도하는가?",
    scope: "설득력, 행동 변화, 태도 변화",
    color:
      "border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/30",
    textColor: "text-emerald-600",
  },
];

export default function ShannonWeaverModel() {
  const [selected, setSelected] = useState<ElementKey | null>("source");
  const [noiseOn, setNoiseOn] = useState(false);
  const [noiseType, setNoiseType] = useState<NoiseType>("physical");
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackStep, setFeedbackStep] = useState(0);

  const selectedInfo = ELEMENTS.find((e) => e.key === selected);

  // 피드백 루프 스텝별 설명
  const FEEDBACK_STEPS = [
    { label: "① 인간 → AI 요청", detail: "질문·지시를 자연어로 전송" },
    { label: "② AI 응답 수신", detail: "AI가 확률적 추론으로 응답 생성" },
    { label: "③ 응답 평가", detail: "인간이 응답 품질을 검토" },
    {
      label: "④ 프롬프트 정제",
      detail: "불완전한 응답 → 후속 질문 또는 재지시",
    },
    { label: "⑤ 반복(이터레이션)", detail: "목표 달성까지 루프 반복" },
  ];

  return (
    <section>
      <SectionTitle
        title="1. Shannon-Weaver 통신 모델"
        subtitle="1948년 Shannon, 1949년 Weaver 확장 · 6가지 핵심 요소와 3단계 문제"
      />

      <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-6 dark:border-orange-900/50 dark:from-orange-950/30 dark:to-gray-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-orange-600">
            <Radio size={16} /> 요소 클릭 → 정의 확인
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setNoiseOn((v) => !v)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                noiseOn
                  ? "bg-red-500 text-white shadow"
                  : "bg-white text-gray-600 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700"
              }`}
            >
              <Zap size={12} /> 노이즈 {noiseOn ? "ON" : "OFF"}
            </button>
            <button
              onClick={() => {
                setShowFeedback((v) => !v);
                setFeedbackStep(0);
              }}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                showFeedback
                  ? "bg-orange-500 text-white shadow"
                  : "bg-white text-gray-600 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700"
              }`}
            >
              <RefreshCw size={12} /> 피드백 루프
            </button>
          </div>
        </div>

        {/* SVG 모델 */}
        <div className="overflow-x-auto">
          <svg
            viewBox="0 0 820 260"
            className="mx-auto w-full min-w-[720px] max-w-4xl"
          >
            {/* 노이즈 신호 애니메이션 */}
            {noiseOn && (
              <g>
                <motion.circle
                  cx="420"
                  cy="120"
                  r="5"
                  fill="#ef4444"
                  animate={{ cy: [120, 98, 145, 108, 135, 120], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <motion.line
                  x1="380" y1="200" x2="420" y2="150"
                  stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </g>
            )}

            {/* 피드백 루프 화살표 */}
            {showFeedback && (
              <g>
                <motion.path
                  d="M 810 160 C 810 230 10 230 10 160"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2.5"
                  strokeDasharray="8 4"
                  markerEnd="url(#arrowFeedback)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
                <text x="415" y="250" textAnchor="middle" fontSize="10" fill="#f97316" fontWeight="700">
                  ← 피드백 루프 (프롬프트 정제)
                </text>
              </g>
            )}

            {boxes.map((b) => (
              <g
                key={b.key}
                onClick={() => setSelected(b.key)}
                style={{ cursor: "pointer" }}
              >
                <rect
                  x={b.x}
                  y={b.y}
                  width={b.w}
                  height={b.h}
                  rx="10"
                  fill={selected === b.key ? "#f97316" : "#fff"}
                  stroke="#f97316"
                  strokeWidth={selected === b.key ? 3 : 2}
                  className="transition-all"
                />
                <text
                  x={b.x + b.w / 2}
                  y={b.y + b.h / 2 - 4}
                  textAnchor="middle"
                  fill={selected === b.key ? "#fff" : "#1f2937"}
                  fontSize="11"
                  fontWeight="700"
                >
                  {b.label1}
                </text>
                <text
                  x={b.x + b.w / 2}
                  y={b.y + b.h / 2 + 12}
                  textAnchor="middle"
                  fill={selected === b.key ? "#fff" : "#6b7280"}
                  fontSize="10"
                >
                  {b.label2}
                </text>
              </g>
            ))}

            {arrows.map((a, i) => (
              <g key={i}>
                <motion.line
                  x1={a.x1}
                  y1="120"
                  x2={a.x2}
                  y2="120"
                  stroke={noiseOn && a.noisy ? "#ef4444" : "#f97316"}
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                  animate={
                    noiseOn && a.noisy
                      ? { strokeDasharray: ["0 6", "6 0"] }
                      : {}
                  }
                  transition={{ duration: 0.4, repeat: Infinity }}
                />
                {a.label && (
                  <text
                    x={(a.x1 + a.x2) / 2}
                    y="112"
                    textAnchor="middle"
                    fontSize="9"
                    fill="#6b7280"
                  >
                    {a.label}
                  </text>
                )}
              </g>
            ))}

            {/* 노이즈 박스 */}
            <g
              onClick={() => setSelected("noise")}
              style={{ cursor: "pointer" }}
            >
              <rect
                x="370"
                y="180"
                width="100"
                height="40"
                rx="10"
                fill={
                  selected === "noise"
                    ? "#ef4444"
                    : noiseOn
                      ? "#fecaca"
                      : "#fff"
                }
                stroke="#ef4444"
                strokeWidth="2"
              />
              <text
                x="420"
                y="203"
                textAnchor="middle"
                fill={selected === "noise" ? "#fff" : "#b91c1c"}
                fontSize="11"
                fontWeight="700"
              >
                Noise Source
              </text>
            </g>
            <line
              x1="420"
              y1="180"
              x2="420"
              y2="150"
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="4 3"
            />

            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill="#f97316" />
              </marker>
              <marker
                id="arrowFeedback"
                markerWidth="8"
                markerHeight="8"
                refX="1"
                refY="4"
                orient="auto"
              >
                <polygon points="8 0, 0 4, 8 8" fill="#f97316" />
              </marker>
            </defs>
          </svg>
        </div>

        {/* 선택된 요소 설명 */}
        <AnimatePresence mode="wait">
          {selectedInfo && (
            <motion.div
              key={selectedInfo.key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-5 rounded-xl border border-orange-300 bg-white p-4 dark:border-orange-800 dark:bg-gray-900"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-orange-600">
                    <NetworkTerm term={selectedInfo.key} label={selectedInfo.role} />
                  </div>
                  <div className="text-base font-semibold">
                    {selectedInfo.label}
                  </div>
                </div>
                <Info size={14} className="shrink-0 text-orange-400 mt-1" />
              </div>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                {selectedInfo.definition}
              </p>
              <div className="mt-2 rounded-lg bg-orange-50 px-3 py-2 text-xs text-orange-900 dark:bg-orange-950/40 dark:text-orange-200">
                <span className="font-semibold">전통 예:</span> {selectedInfo.example}
              </div>
              <div className="mt-2 rounded-lg bg-violet-50 px-3 py-2 text-xs text-violet-900 dark:bg-violet-950/40 dark:text-violet-200">
                <span className="font-semibold">HAC 맥락:</span> {selectedInfo.hacContext}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 피드백 루프 단계별 설명 */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden rounded-2xl border border-orange-400 bg-orange-50/60 p-5 dark:border-orange-700 dark:bg-orange-950/30"
          >
            <div className="mb-3 text-sm font-bold text-orange-700 dark:text-orange-300">
              피드백 루프 — HAC에서의 양방향 확장
            </div>
            <p className="mb-4 text-xs text-gray-600 dark:text-gray-400">
              Shannon 원모델은 <strong>단방향</strong>이었으나, HAC는 본질적으로
              대화형 양방향 통신. Weaver가 추가한 피드백 개념을 HAC에서는
              &apos;프롬프트 정제(prompt refinement)&apos;로 재해석 가능.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {FEEDBACK_STEPS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setFeedbackStep(i)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                    feedbackStep === i
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-600 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {s.label.split(" ")[0]}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={feedbackStep}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="rounded-xl bg-white p-4 dark:bg-gray-900"
              >
                <div className="text-sm font-bold text-orange-600">
                  {FEEDBACK_STEPS[feedbackStep].label}
                </div>
                <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">
                  {FEEDBACK_STEPS[feedbackStep].detail}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 노이즈 유형 토글: 물리적 vs 의미론적 */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-bold">
            <NetworkTerm term="noise" label="노이즈" /> 유형 비교
          </div>
          <div className="flex gap-1.5 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
            {(["physical", "semantic"] as NoiseType[]).map((t) => (
              <button
                key={t}
                onClick={() => setNoiseType(t)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  noiseType === t
                    ? t === "physical"
                      ? "bg-red-500 text-white shadow"
                      : "bg-violet-500 text-white shadow"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {t === "physical" ? "물리적 (전통)" : "의미론적 (HAC)"}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={noiseType}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            <div
              className={`rounded-xl border p-4 ${NOISE_TYPES[noiseType].bg} ${NOISE_TYPES[noiseType].border}`}
            >
              <div
                className={`mb-3 text-xs font-bold uppercase tracking-wider ${
                  noiseType === "physical" ? "text-red-600" : "text-violet-600"
                }`}
              >
                {NOISE_TYPES[noiseType].label}
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {NOISE_TYPES[noiseType].items.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-lg bg-white/70 px-3 py-2 dark:bg-gray-900/60"
                  >
                    <div className="text-xs font-semibold">{item.name}</div>
                    <div className="text-[11px] text-gray-500">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            {noiseType === "semantic" && (
              <div className="mt-3 rounded-lg border border-violet-300 bg-violet-50/40 p-3 text-xs text-violet-800 dark:border-violet-800 dark:bg-violet-950/20 dark:text-violet-300">
                <strong>핵심 포인트:</strong> HAC에서의 노이즈는
                프로토콜의 구문(syntax) 수준이 아닌 <strong>의미(semantic) 수준</strong>의
                문제. Shannon 모델을 HAC에 그대로 적용할 때 이 차이를 반드시 설명해야
                고점.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Weaver 3단계 */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 text-sm font-bold">
          <NetworkTerm term="Weaver" label="Weaver" />의 1949년 확장: 통신의 3단계 문제
        </div>
        <p className="mb-4 text-xs text-gray-500">
          Shannon의 순수 기술적 모델을 Weaver가 의미·효과 차원까지 확장.
          HAC에서는 세 층위가 모두 동시에 작동함.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {WEAVER_LEVELS.map((l, i) => (
            <div
              key={l.level}
              className={`rounded-lg border p-3 ${l.color}`}
            >
              <div className={`text-[10px] font-bold ${l.textColor}`}>
                LEVEL {i + 1}
              </div>
              <div className="mt-0.5 text-sm font-semibold">{l.level}</div>
              <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">
                {l.q}
              </p>
              <div className="mt-2 text-[11px] text-gray-500">{l.scope}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-dashed border-orange-300 bg-orange-50/30 p-3 text-xs text-orange-800 dark:border-orange-800 dark:bg-orange-950/20 dark:text-orange-300">
          <strong>HAC 시사점:</strong> 전통 통신은 주로 Level A(기술적)에 집중했지만,
          HAC는 Level B(의미)와 Level C(효과)가 동시에 핵심 문제가 됨.
          서술 시 이 세 층위를 구분하면 깊이 있는 분석이 됨.
        </div>
      </div>
    </section>
  );
}

const boxes: {
  key: ElementKey;
  x: number;
  y: number;
  w: number;
  h: number;
  label1: string;
  label2: string;
}[] = [
  { key: "source", x: 10, y: 90, w: 120, h: 60, label1: "Information", label2: "Source" },
  { key: "transmitter", x: 160, y: 90, w: 120, h: 60, label1: "Transmitter", label2: "(Encoder)" },
  { key: "channel", x: 360, y: 90, w: 120, h: 60, label1: "Channel", label2: "매체" },
  { key: "receiver", x: 540, y: 90, w: 120, h: 60, label1: "Receiver", label2: "(Decoder)" },
  { key: "destination", x: 690, y: 90, w: 120, h: 60, label1: "Destination", label2: "목적지" },
];

const arrows: { x1: number; x2: number; label?: string; noisy?: boolean }[] = [
  { x1: 130, x2: 160, label: "m" },
  { x1: 280, x2: 360, label: "s(t)" },
  { x1: 480, x2: 540, label: "r(t)", noisy: true },
  { x1: 660, x2: 690, label: "m'" },
];
