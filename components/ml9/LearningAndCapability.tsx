"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { fmt, signed } from "./nn";

type LearnKind = "supervised" | "unsupervised" | "reinforcement";

const KINDS: Record<
  LearnKind,
  { label: string; sub: string; lines: string[]; algo: string; color: string }
> = {
  supervised: {
    label: "지도학습",
    sub: "교사학습",
    lines: [
      "입력값 xᵢ에 대한 목표 출력값 tᵢ가 함께 주어짐 → 학습 데이터 {(xᵢ, tᵢ)} (i = 1, …, N)",
      "입력 xᵢ에 대한 신경망의 출력 yᵢ가 원하는 목표 출력 tᵢ에 가까워지도록 가중치 w를 수정",
    ],
    algo: "오류 역전파 학습 알고리즘 (error backpropagation learning algorithm)",
    color: "fuchsia",
  },
  unsupervised: {
    label: "비지도학습",
    sub: "비교사학습",
    lines: ["입력값 xᵢ만 주어짐 → 비슷한 입력에 대해 비슷한 출력을 내도록 학습"],
    algo: "self-organizing feature map, Boltzmann machine",
    color: "emerald",
  },
  reinforcement: {
    label: "강화학습",
    sub: "",
    lines: ["입력에 대한 신경망의 출력값의 보상이 최대가 되도록 가중치를 수정"],
    algo: "",
    color: "amber",
  },
};

const ABILITIES = [
  {
    t: "표현 능력",
    en: "representation",
    d: "입출력을 매핑하는 어떤 형태의 함수도 원하는 오차 수준까지 근사해서 표현할 수 있음. 하나 이상의 은닉층을 가진 신경망은 어떤 형태의 함수도 원하는 오차 수준까지 근사 가능하다는 것이 수학적으로 이미 증명되어 있음.",
  },
  {
    t: "학습 능력",
    en: "learning",
    d: "함수의 형태를 결정하는 가중치 파라미터는 사용자가 일일이 정해 줄 필요 없이 데이터를 이용한 학습을 통해 스스로 찾을 수 있음.",
  },
  {
    t: "일반화 능력",
    en: "generalization",
    d: "주어진 데이터에 대해 단순히 암기·저장하는 것이 아니라 데이터로부터 일반화된 규칙을 스스로 찾을 수 있으므로 새로운 데이터에 대해서도 처리할 수 있음.",
  },
];

const ETA = 0.15;

export default function LearningAndCapability() {
  const [kind, setKind] = useState<LearnKind>("supervised");
  /** 헤브 규칙 시연 — 두 뉴런이 함께 활성화된 횟수만큼 연결 강도가 커진다 */
  const [bell, setBell] = useState(true);
  const [food, setFood] = useState(true);
  const [w, setW] = useState(0.2);
  const [tau, setTau] = useState(0);

  const bothActive = bell && food;
  const deltaW = bothActive ? ETA : 0;
  const k = KINDS[kind];

  const applyStep = () => {
    setW((prev) => Math.min(1.5, prev + deltaW));
    setTau((t) => t + 1);
  };

  return (
    <section id="learning" className="scroll-mt-32">
      <SectionTitle
        title="11.1.3 ③ 학습 · 11.1.4 신경망의 특성"
        subtitle="학습이란 연결 강도를 바꾸는 일 — 그리고 응용 관점에서 신경망은 하나의 함수"
      />

      {/* ── 인간 뇌에서의 학습: 헤브 규칙 ── */}
      <Sourced
        refs={{
          textbook: "11.1.3 신경망의 구성 요소 — 헤브의 학습 규칙",
          slides: "신경망의 구성 요소 ③ 학습 — 인간 뇌에서의 학습",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">헤브의 학습 규칙 (Hebbian learning rule)</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            도널드 올딩 헤브(Donald Olding Hebb)에 의해 개발된 가장 기본적인 방법으로,{" "}
            <strong>연결된 두 신경세포가 동시에 활성화되면 가중치를 증가시키는 방향으로 학습</strong>함.
            파블로프의 개 실험이 이 규칙으로 설명되는 대표적인 사례. 이후 좀 더 발전된 형태로 퍼셉트론
            학습과 델타 학습, 그리고 이를 발전시킨 오류 역전파 학습 알고리즘 등이 있음.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
            <div className="overflow-x-auto">
              <svg viewBox="0 0 320 150" className="w-full min-w-[300px] rounded-lg border border-gray-100 dark:border-gray-800">
                <rect x={0} y={0} width={320} height={150} fill="#ffffff" />
                <circle cx={60} cy={50} r={22} fill={bell ? "#fae8ff" : "#f8fafc"} stroke={bell ? "#a21caf" : "#cbd5e1"} strokeWidth={bell ? 2.4 : 1.4} />
                <text x={60} y={48} fontSize="9" textAnchor="middle" fill={bell ? "#86198f" : "#94a3b8"}>
                  종소리
                </text>
                <text x={60} y={60} fontSize="8" textAnchor="middle" fill={bell ? "#86198f" : "#94a3b8"}>
                  {bell ? "활성" : "비활성"}
                </text>

                <circle cx={60} cy={112} r={22} fill={food ? "#fae8ff" : "#f8fafc"} stroke={food ? "#a21caf" : "#cbd5e1"} strokeWidth={food ? 2.4 : 1.4} />
                <text x={60} y={110} fontSize="9" textAnchor="middle" fill={food ? "#86198f" : "#94a3b8"}>
                  먹이
                </text>
                <text x={60} y={122} fontSize="8" textAnchor="middle" fill={food ? "#86198f" : "#94a3b8"}>
                  {food ? "활성" : "비활성"}
                </text>

                <circle cx={248} cy={81} r={26} fill="#fed7aa" stroke="#ea580c" strokeWidth={1.8} />
                <text x={248} y={78} fontSize="9" textAnchor="middle" fill="#9a3412">
                  침 분비
                </text>
                <text x={248} y={90} fontSize="8" textAnchor="middle" fill="#9a3412">
                  반응 뉴런
                </text>

                <line x1={82} y1={50} x2={222} y2={73} stroke="#a21caf" strokeWidth={1 + w * 4} opacity={0.85} />
                <line x1={82} y1={112} x2={222} y2={90} stroke="#cbd5e1" strokeWidth={2.4} />
                <text x={150} y={48} fontSize="10" fontWeight="bold" textAnchor="middle" fill="#86198f">
                  w = {fmt(w, 2)}
                </text>
                <text x={150} y={128} fontSize="8" textAnchor="middle" fill="#94a3b8">
                  (원래부터 강한 연결)
                </text>
                {bothActive && (
                  <motion.circle
                    initial={false}
                    animate={{ cx: [90, 218], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1.3, repeat: Infinity, ease: "linear" }}
                    cy={62}
                    r={3.5}
                    fill="#fbbf24"
                  />
                )}
                <text x={10} y={16} fontSize="8" fill="#64748b">
                  선 굵기 = 연결 강도
                </text>
              </svg>
            </div>

            <div>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { label: "종소리 뉴런", on: bell, toggle: () => setBell((v) => !v) },
                    { label: "먹이 뉴런", on: food, toggle: () => setFood((v) => !v) },
                  ] as const
                ).map((b) => (
                  <button
                    key={b.label}
                    type="button"
                    aria-pressed={b.on}
                    onClick={b.toggle}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                      b.on
                        ? "border-fuchsia-500 bg-fuchsia-500 text-white"
                        : "border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900"
                    }`}
                  >
                    {b.label} {b.on ? "활성" : "비활성"}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={applyStep}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-fuchsia-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-fuchsia-700"
                >
                  <Play size={14} />
                  자극 한 번 주기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setW(0.2);
                    setTau(0);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800 dark:border-gray-700 dark:hover:text-gray-200"
                >
                  <RotateCcw size={14} />
                  되돌리기
                </button>
              </div>
              <div className="mt-3 overflow-x-auto rounded-lg bg-gray-50 p-3 font-mono text-xs leading-6 dark:bg-gray-800/60">
                <p className="min-w-[260px]">자극 횟수 τ = {tau}</p>
                <p className="min-w-[260px]">
                  Δw = {bothActive ? `${fmt(ETA, 2)} (두 뉴런이 동시에 활성)` : "0 (동시에 활성이 아님)"}
                </p>
                <p className="min-w-[260px] font-bold">
                  w⁽ᵗ⁺¹⁾ = w⁽ᵗ⁾ {signed(deltaW, 2)} = {fmt(w, 2)}
                </p>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                종소리와 먹이를 함께 주는 일이 반복될수록 종소리 쪽 연결 강도가 커져, 나중에는 종소리만으로도
                침 분비 뉴런이 활성화됨. 두 뉴런 중 하나만 활성이면 강도가 늘지 않음.
              </p>
            </div>
          </div>
        </div>
      </Sourced>

      {/* ── 인공신경망에서의 학습 ── */}
      <Sourced
        refs={{
          textbook: "11.1.3 신경망의 구성 요소 — 신경망에서의 학습",
          slides: "신경망의 구성 요소 ③ 학습 — 인공신경망에서의 학습이란?",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-fuchsia-200 bg-fuchsia-50 p-5 dark:border-fuchsia-900 dark:bg-fuchsia-950/30">
          <h3 className="text-base font-bold text-fuchsia-800 dark:text-fuchsia-200">
            인공신경망에서의 학습이란?
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            신경망에서의 학습이란 신경망이 원하는 기능을 수행할 수 있도록{" "}
            <strong>시냅스의 연결 강도(가중치)를 변화시키는 것</strong>. 곧 신경망에 어떤 입력 x가
            주어졌을 때 최종적으로 내는 출력 y가 원하는 값이 되도록 반복적인 가중치 수정을 통해 점점 원하는
            기능에 근접해 가는 것.
          </p>
          <div className="mt-3 overflow-x-auto rounded-lg bg-white p-3 dark:bg-gray-900">
            <p className="min-w-[300px] text-center font-mono text-base">
              w⁽ᵗ⁺¹⁾ = w⁽ᵗ⁾ + Δw⁽ᵗ⁾
            </p>
            <div className="mt-2 flex min-w-[300px] justify-center gap-6 text-[11px] text-gray-500">
              <span>학습 후 가중치</span>
              <span>현재 가중치</span>
              <span>가중치 변화량</span>
            </div>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            가중치 변화량 Δw를 결정하는 방법이 곧 <strong>학습 알고리즘</strong>이며, 여기에 학습 데이터가
            쓰임.
          </p>
          <div className="mt-3 overflow-x-auto">
            <div className="flex min-w-[460px] items-center gap-2 text-[11px]">
              {["헤브의 학습 규칙", "퍼셉트론 학습", "델타 학습", "오류 역전파 학습 알고리즘"].map(
                (x, i) => (
                  <span key={x} className="flex items-center gap-2">
                    <span className="rounded-full border border-fuchsia-300 bg-white px-2.5 py-1 font-semibold text-fuchsia-700 dark:border-fuchsia-800 dark:bg-gray-900 dark:text-fuchsia-300">
                      {x}
                    </span>
                    {i < 3 && <span className="text-fuchsia-400">→</span>}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </Sourced>

      {/* ── 학습의 종류 ── */}
      <Sourced
        refs={{ slides: "신경망의 구성 요소 ③ 학습 — 학습의 종류" }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">학습의 종류</h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(Object.keys(KINDS) as LearnKind[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setKind(id)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  kind === id
                    ? "border-fuchsia-500 bg-fuchsia-500 text-white"
                    : "border-gray-200 bg-white text-gray-500 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-900"
                }`}
              >
                {KINDS[id].label}
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <p className="text-sm font-bold">
              {k.label}
              {k.sub && <span className="ml-1.5 text-[11px] font-normal text-gray-500">{k.sub}</span>}
            </p>
            <ul className="mt-2 space-y-1">
              {k.lines.map((l) => (
                <li key={l} className="flex gap-1.5 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                  <span className="shrink-0 opacity-50">·</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
            {k.algo && (
              <p className="mt-2 rounded-lg bg-gray-50 p-2 font-mono text-[11px] text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
                {k.algo}
              </p>
            )}
          </div>
        </div>
      </Sourced>

      {/* ── 11.1.4 신경망의 특성 ── */}
      <Sourced
        refs={{
          textbook: "11.1.4 신경망의 특성 (그림 11-7)",
          slides: "신경망의 특성 — 응용 관점에서의 신경망에 대한 이해",
        }}
        className="mb-3"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">응용 관점에서 신경망은 하나의 함수</h3>
          <div className="mt-3 overflow-x-auto">
            <svg viewBox="0 0 360 120" className="w-full min-w-[320px] max-w-[460px] rounded-lg border border-gray-100 dark:border-gray-800">
              <rect x={0} y={0} width={360} height={120} fill="#ffffff" />
              <rect x={115} y={40} width={130} height={48} rx={10} fill="#fdf4ff" stroke="#a21caf" strokeWidth={1.8} />
              <text x={180} y={70} fontSize="16" textAnchor="middle" fill="#86198f" fontStyle="italic">
                f (x ; w)
              </text>
              <line x1={40} y1={64} x2={110} y2={64} stroke="#2563eb" strokeWidth={2} />
              <path d="M104,60 L110,64 L104,68" fill="none" stroke="#2563eb" strokeWidth={2} />
              <text x={28} y={60} fontSize="12" textAnchor="middle" fill="#1e3a8a" fontStyle="italic">
                x
              </text>
              <text x={28} y={76} fontSize="9" textAnchor="middle" fill="#64748b">
                입력
              </text>
              <line x1={250} y1={64} x2={318} y2={64} stroke="#ea580c" strokeWidth={2} />
              <path d="M312,60 L318,64 L312,68" fill="none" stroke="#ea580c" strokeWidth={2} />
              <text x={334} y={60} fontSize="12" textAnchor="middle" fill="#9a3412" fontStyle="italic">
                y
              </text>
              <text x={334} y={76} fontSize="9" textAnchor="middle" fill="#64748b">
                출력
              </text>
              <line x1={180} y1={22} x2={180} y2={38} stroke="#a21caf" strokeWidth={1.4} strokeDasharray="3 2" />
              <text x={180} y={18} fontSize="9" textAnchor="middle" fill="#86198f">
                가중치 파라미터 w
              </text>
              <text x={180} y={106} fontSize="9" textAnchor="middle" fill="#64748b">
                활성화 함수와 연결 구조는 설계 시점에 고정 · 함수의 모양은 w가 결정
              </text>
            </svg>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            함수 f의 구체적인 형태는 모델 설계 시점에서 고정되는 신경세포의 활성화 함수와 신경망의 연결
            구조가 아닌, <strong>학습을 통해 정해지는 신경망의 연결 가중치 w에 의해 결정</strong>됨. 따라서
            신경망을 사용해서 분류와 회귀 등의 문제를 해결한다는 것은 주어진 데이터를 사용해서 신경망을
            학습하는 과정이며, 신경망을 학습하는 과정은 결국 함수 f의 형태를 결정짓는 파라미터를 찾는 과정.
          </p>
        </div>
      </Sourced>

      <Sourced
        refs={{
          textbook: "11.1.4 신경망의 특성",
          slides: "신경망의 특성 — 왜 신경망인가?",
          lecture: "어떤 함수든 표현할 수 있다는 것과 그중에서 원하는 것을 찾아내는 것은 다른 문제이고, 찾는 일을 맡는 것이 학습 능력이라고 둘을 갈라 설명",
        }}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {ABILITIES.map((a) => (
            <div
              key={a.t}
              className="h-full rounded-xl border border-fuchsia-200 bg-fuchsia-50 p-4 dark:border-fuchsia-900 dark:bg-fuchsia-950/30"
            >
              <p className="text-sm font-bold text-fuchsia-700 dark:text-fuchsia-300">
                {a.t}
                <span className="ml-1 text-[10px] font-normal opacity-70">{a.en}</span>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-gray-700 dark:text-gray-300">{a.d}</p>
            </div>
          ))}
        </div>
      </Sourced>
    </section>
  );
}
