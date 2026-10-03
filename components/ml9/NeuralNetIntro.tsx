"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Cpu } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";

/* ── 생물학적 신경세포의 구성 요소와 인공 뉴런에서의 대응 ── */
interface Part {
  id: string;
  bio: string;
  bioEn: string;
  role: string;
  artificial: string;
  detail: string;
  color: string;
}

const PARTS: Part[] = [
  {
    id: "dendrite",
    bio: "수상돌기",
    bioEn: "dendrite",
    role: "입력",
    artificial: "입력 x₁, x₂, …, xₙ",
    detail:
      "다른 여러 신경세포로부터 입력을 받아들이는 역할. 인공 뉴런에서는 n개의 입력값이 들어오는 자리에 해당함.",
    color: "#2563eb",
  },
  {
    id: "synapse",
    bio: "시냅스",
    bioEn: "synapse",
    role: "연결 강도",
    artificial: "가중치 w₁, w₂, …, wₙ",
    detail:
      "신경세포들이 연결되는 부분. 하나의 출력이 그대로 전달되는 것이 아니라 어느 정도의 강도로 연결되어 있느냐에 따라 전달되는 정보의 양이 달라짐. 이 연결 강도가 가중치(weight)이며, 양의 가중치는 흥분성(excitatory) 연결, 음의 가중치는 억제성(inhibitory) 연결.",
    color: "#c026d3",
  },
  {
    id: "soma",
    bio: "세포체",
    bioEn: "cell body",
    role: "연산",
    artificial: "가중합 u = Σ wᵢxᵢ 와 활성화 함수 φ",
    detail:
      "다른 세포들로부터 입력된 정보를 정해진 방식에 따라 처리하는 부분. 들어온 입력이 모두 합해져 일정한 임계치 이상이 되면 세포가 활성화되어 활동전위(스파이크)를 발생시킴.",
    color: "#16a34a",
  },
  {
    id: "axon",
    bio: "축색",
    bioEn: "axon",
    role: "출력",
    artificial: "출력 φ(u)",
    detail:
      "처리된 정보를 다른 신경세포로 전달하기 위해 지나가는 경로. 인공 뉴런에서는 활성화 함수를 통과해 나온 하나의 출력값에 해당함.",
    color: "#ea580c",
  },
];

const APPROACHES = [
  {
    name: "기호주의",
    en: "symbolic AI",
    accent: "amber",
    bullets: [
      "논리를 바탕으로 규칙을 지식으로 표현하고 탐색·추론으로 문제를 해결",
      "부울 논리 · 규칙 기반 지식 표현 · PROLOG",
      "사람이 지식을 추출해 프로그램으로 옮김",
    ],
    icon: "IF … THEN …",
    example: "IBM Deep Blue (체스 AI)",
  },
  {
    name: "연결주의",
    en: "connectionist AI",
    accent: "fuchsia",
    bullets: [
      "뇌에서 영감을 받은 계산 모형 — 간단한 소자를 많이 연결해 처리",
      "신경망: 퍼셉트론 → 다층 퍼셉트론 → 딥러닝",
      "데이터로부터 필요한 규칙을 학습으로 스스로 뽑아냄",
    ],
    icon: "x → Σw·x → φ → y",
    example: "딥러닝",
  },
];

export default function NeuralNetIntro() {
  const [part, setPart] = useState<string>("synapse");
  const active = PARTS.find((p) => p.id === part)!;

  return (
    <section id="intro" className="scroll-mt-32">
      <SectionTitle
        title="11.1 신경망 개요 — 생물학적 신경망에서 인공 신경망으로"
        subtitle="인공지능의 두 접근법, 신경망·심층 신경망·딥러닝의 관계, 그리고 신경세포를 수학으로 옮기는 과정"
      />

      {/* ── 인공지능의 두 가지 접근법 ── */}
      <Sourced refs={{ slides: "인공지능의 두 가지 접근법" }} className="mb-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">인공지능의 두 가지 접근법</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            둘은 비슷한 시기에 시작되었지만 문제를 푸는 방식 자체가 다름. 9강에서 다루는 신경망은
            오른쪽 갈래에서 출발함.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {APPROACHES.map((a) => (
              <div
                key={a.name}
                className={`rounded-xl border p-4 ${
                  a.accent === "amber"
                    ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30"
                    : "border-fuchsia-200 bg-fuchsia-50 dark:border-fuchsia-900 dark:bg-fuchsia-950/30"
                }`}
              >
                <p
                  className={`text-sm font-bold ${
                    a.accent === "amber"
                      ? "text-amber-700 dark:text-amber-300"
                      : "text-fuchsia-700 dark:text-fuchsia-300"
                  }`}
                >
                  {a.name}
                  <span className="ml-1 text-[11px] font-normal opacity-70">{a.en}</span>
                </p>
                <p className="mt-2 rounded-lg bg-white/70 px-2 py-1 font-mono text-[11px] dark:bg-gray-900/60">
                  {a.icon}
                </p>
                <ul className="mt-2 space-y-1">
                  {a.bullets.map((b) => (
                    <li key={b} className="flex gap-1.5 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                      <span className="shrink-0 opacity-50">·</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-[11px] text-gray-500">대표 사례 — {a.example}</p>
              </div>
            ))}
          </div>
        </div>
      </Sourced>

      {/* ── 신경망과 딥러닝 ── */}
      <Sourced
        refs={{
          textbook: "11.1.1 신경망이란?",
          slides: "신경망과 딥러닝",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">신경망 · 심층 신경망 · 딥러닝</h3>
          <div className="mt-3 space-y-2">
            {[
              {
                t: "신경망",
                en: "신경회로망, neural networks",
                d: "인간 뇌의 구조와 뇌에서 수행되는 정보처리 방식을 모방함으로써 인간이 지능적으로 처리하는 복잡한 정보처리 능력을 기계를 통해 실현하고자 하는 연구. 생물학적 신경회로망을 모델링한 수학적 함수이며, 데이터를 이용하여 원하는 입출력 매핑함수의 형태를 스스로 찾는 학습능력을 가짐. 학습 방식 및 구조에 따라 다양한 모델이 존재함.",
              },
              {
                t: "심층 신경망",
                en: "deep neural network",
                d: "신경망 모델 중 가장 발전된 형태를 갖는 것. 다수의 은닉층을 갖는 신경망 모델.",
              },
              {
                t: "딥러닝",
                en: "deep learning",
                d: "심층 신경망을 이용한 데이터 분석(학습)에 초점을 둔 머신러닝 기술. 곧 “심층 신경망 기반의 머신러닝”이며, 딥러닝의 출발은 신경망.",
              },
            ].map((x, i) => (
              <div
                key={x.t}
                className="rounded-lg border-l-4 border-fuchsia-400 bg-fuchsia-50/60 p-3 dark:bg-fuchsia-950/20"
                style={{ marginLeft: `${i * 14}px` }}
              >
                <p className="text-sm font-bold text-fuchsia-700 dark:text-fuchsia-300">
                  {x.t}
                  <span className="ml-1.5 text-[11px] font-normal text-gray-500">{x.en}</span>
                </p>
                <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">{x.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-gray-500">
            셋은 나란한 개념이 아니라 겹겹이 들어 있는 관계 — 신경망 ⊃ 심층 신경망, 그 심층 신경망을
            쓰는 머신러닝이 딥러닝.
          </p>
        </div>
      </Sourced>

      {/* ── 생물학적 신경망: 뇌의 규모와 적응성 ── */}
      <Sourced
        refs={{
          textbook: "11.1.1 신경망이란? · 11.1.2 생물학적 신경망",
          slides: "생물학적 신경망 — 뇌의 구조",
        }}
        className="mb-6"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-2xl font-bold text-fuchsia-600 dark:text-fuchsia-400">100억 개 이상</p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">뇌의 신경세포 수</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-2xl font-bold text-fuchsia-600 dark:text-fuchsia-400">60조 이상</p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">신경세포 간 연결 수</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm font-bold">연결은 태어날 때 완성되지 않음</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              자라면서 자극을 받고 처리하는 과정에서 연결 정도가 스스로 조정됨 → 환경에 대한
              <strong> 적응성(adaptation)</strong>과 새로운 것에 대한 <strong>학습(learning)</strong>{" "}
              능력의 기본.
            </p>
          </div>
        </div>
      </Sourced>

      {/* ── 신경세포 구조 대응도 (인터랙티브) ── */}
      <Sourced
        refs={{
          textbook: "11.1.2 생물학적 신경망 (그림 11-1)",
          slides: "생물학적 신경망 — 신경세포의 구조",
          lecture: "자극이 그대로 넘어가는 것이 아니라 시냅스의 연결 강도(가중치)에 따라 달라진다는 점, 그리고 양의 가중치가 흥분성·음의 가중치가 억제성이라는 점을 꼭 기억해 두라고 짚음",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">신경세포의 구조 — 부위를 누르면 인공 뉴런에서의 자리가 보임</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            외부 혹은 다른 신경세포들로부터 주어지는 자극(전기적 신호)은 세포체로 흘러들어오고, 이들이
            모두 합해져서 일정한 임계치 이상이 되면 세포는 활성화되어 활동전위(스파이크)를 발생시킴. 이는
            축색을 따라 이동하여 시냅스를 통해 다른 신경세포로 전달됨.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
            <div className="overflow-x-auto">
              <svg viewBox="0 0 360 230" className="w-full min-w-[320px] rounded-lg border border-gray-100 dark:border-gray-800">
                <rect x={0} y={0} width={360} height={230} fill="#ffffff" />

                {/* 수상돌기 */}
                <g
                  onClick={() => setPart("dendrite")}
                  className="cursor-pointer"
                  opacity={part === "dendrite" ? 1 : 0.55}
                >
                  {[
                    "M95,115 L45,70 M95,115 L35,100 M95,115 L40,140 M95,115 L55,170",
                    "M60,70 L48,55 M60,70 L70,52",
                    "M45,160 L32,172 M45,160 L52,178",
                  ].map((d, i) => (
                    <path key={i} d={d} stroke={PARTS[0].color} strokeWidth={part === "dendrite" ? 3 : 2} fill="none" strokeLinecap="round" />
                  ))}
                  <text x={32} y={44} fontSize="10" fontWeight="bold" fill={PARTS[0].color}>
                    수상돌기
                  </text>
                  <text x={32} y={56} fontSize="8" fill={PARTS[0].color}>
                    입력
                  </text>
                </g>

                {/* 세포체 */}
                <g onClick={() => setPart("soma")} className="cursor-pointer" opacity={part === "soma" ? 1 : 0.55}>
                  <ellipse
                    cx={120}
                    cy={115}
                    rx={34}
                    ry={28}
                    fill="#dcfce7"
                    stroke={PARTS[2].color}
                    strokeWidth={part === "soma" ? 3 : 1.6}
                  />
                  <circle cx={120} cy={115} r={10} fill="#bbf7d0" stroke={PARTS[2].color} strokeWidth={1.2} />
                  <text x={120} y={118} fontSize="7" textAnchor="middle" fill="#166534">
                    세포핵
                  </text>
                  <text x={120} y={160} fontSize="10" fontWeight="bold" textAnchor="middle" fill={PARTS[2].color}>
                    세포체
                  </text>
                  <text x={120} y={171} fontSize="8" textAnchor="middle" fill={PARTS[2].color}>
                    연산
                  </text>
                </g>

                {/* 축색 */}
                <g onClick={() => setPart("axon")} className="cursor-pointer" opacity={part === "axon" ? 1 : 0.55}>
                  <path
                    d="M154,115 L262,115"
                    stroke={PARTS[3].color}
                    strokeWidth={part === "axon" ? 8 : 6}
                    strokeLinecap="round"
                  />
                  <text x={200} y={104} fontSize="10" fontWeight="bold" textAnchor="middle" fill={PARTS[3].color}>
                    축색
                  </text>
                  <text x={200} y={135} fontSize="8" textAnchor="middle" fill={PARTS[3].color}>
                    출력
                  </text>
                </g>

                {/* 시냅스 */}
                <g onClick={() => setPart("synapse")} className="cursor-pointer" opacity={part === "synapse" ? 1 : 0.55}>
                  <path d="M262,115 L300,88 M262,115 L305,115 M262,115 L300,142" stroke={PARTS[1].color} strokeWidth={2} fill="none" />
                  {[
                    [300, 88],
                    [305, 115],
                    [300, 142],
                  ].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r={part === "synapse" ? 7 : 5} fill={PARTS[1].color} />
                  ))}
                  <text x={330} y={70} fontSize="10" fontWeight="bold" textAnchor="middle" fill={PARTS[1].color}>
                    시냅스
                  </text>
                  <text x={330} y={82} fontSize="8" textAnchor="middle" fill={PARTS[1].color}>
                    가중치
                  </text>
                  {/* 흥분성 / 억제성 */}
                  <text x={316} y={92} fontSize="11" fontWeight="bold" fill="#dc2626">
                    +
                  </text>
                  <text x={318} y={119} fontSize="11" fontWeight="bold" fill="#dc2626">
                    +
                  </text>
                  <text x={316} y={147} fontSize="11" fontWeight="bold" fill="#2563eb">
                    −
                  </text>
                </g>

                {/* 신호의 흐름 */}
                <motion.circle
                  initial={false}
                  animate={{ cx: [160, 258], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                  cy={115}
                  r={3.5}
                  fill="#fbbf24"
                />
                <text x={8} y={214} fontSize="8" fill="#94a3b8">
                  신호의 흐름: 수상돌기 → 세포체 → 축색 → 시냅스 → 다음 신경세포
                </text>
              </svg>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5">
                {PARTS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPart(p.id)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
                      part === p.id
                        ? "border-transparent text-white"
                        : "border-gray-200 bg-white text-gray-500 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:hover:text-gray-200"
                    }`}
                    style={part === p.id ? { backgroundColor: p.color } : undefined}
                  >
                    {p.bio}
                  </button>
                ))}
              </div>

              <div className="mt-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1 font-bold" style={{ color: active.color }}>
                    <Brain size={14} />
                    {active.bio}
                  </span>
                  <span className="text-[11px] text-gray-400">{active.bioEn}</span>
                  <span className="text-gray-300">→</span>
                  <span className="inline-flex items-center gap-1 font-bold text-gray-800 dark:text-gray-200">
                    <Cpu size={14} />
                    {active.artificial}
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-semibold text-gray-500">기능 — {active.role}</p>
                <p className="mt-2 text-xs leading-relaxed text-gray-700 dark:text-gray-300">{active.detail}</p>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 dark:border-rose-900 dark:bg-rose-950/30">
                  <p className="text-xs font-bold text-rose-700 dark:text-rose-300">
                    흥분성 연결 (excitatory) · 양의 가중치
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-gray-700 dark:text-gray-300">
                    정보를 받아들이는 신경세포의 활성화 정도를 <strong>증가</strong>시킴.
                  </p>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/30">
                  <p className="text-xs font-bold text-blue-700 dark:text-blue-300">
                    억제성 연결 (inhibitory) · 음의 가중치
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-gray-700 dark:text-gray-300">
                    반대로 신경세포의 활성화 정도를 <strong>감소</strong>시킴.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Sourced>

      {/* ── 계층 연결 ── */}
      <Sourced
        refs={{
          textbook: "11.1.2 생물학적 신경망 — 계층 연결",
          slides: "생물학적 신경망 — 신경세포의 연결 구조",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">계층 연결 (layered connection, 층상 연결)</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            생물체의 신경 시스템에서 가장 대표적으로 관찰되는 연결 구조. 인간의 망막에서 관찰되는
            세포들도 계층적 연결 구조로 되어 있어, 망막의 가장 바깥쪽에 있는 세포에서 빛 자극을 받아
            반응하면 그 정보가 다음 단계로 전달되어 가장 안쪽의 신경절세포로 모인 후 시신경섬유를 통해
            뇌로 전달됨. 이처럼 세포들의 기능에 따라 나뉜 층상 구조는{" "}
            <strong>인공 신경망을 개발하는 데 기본적인 모델</strong>이 되었음.
          </p>
          <div className="mt-4 overflow-x-auto">
            <svg viewBox="0 0 400 120" className="w-full min-w-[340px] max-w-[520px]">
              {[
                { label: "빛 자극", x: 30, n: 0 },
                { label: "바깥층 세포", x: 110, n: 4 },
                { label: "중간층 세포", x: 200, n: 3 },
                { label: "신경절세포", x: 290, n: 2 },
                { label: "뇌", x: 370, n: 0 },
              ].map((L, li) => (
                <g key={L.label}>
                  {Array.from({ length: L.n }).map((_, i) => (
                    <circle
                      key={i}
                      cx={L.x}
                      cy={30 + i * 18 + (4 - L.n) * 9}
                      r={6}
                      fill="#f0abfc"
                      stroke="#a21caf"
                      strokeWidth={1.2}
                    />
                  ))}
                  <text x={L.x} y={110} fontSize="8" textAnchor="middle" fill="#64748b">
                    {L.label}
                  </text>
                  {li < 4 && (
                    <path
                      d={`M${L.x + (L.n ? 10 : 16)},60 L${L.x + 70},60`}
                      stroke="#cbd5e1"
                      strokeWidth={1.4}
                      markerEnd=""
                    />
                  )}
                </g>
              ))}
              <text x={200} y={14} fontSize="9" textAnchor="middle" fill="#a21caf">
                기능에 따라 나뉜 층 → 한 방향으로 전달
              </text>
            </svg>
          </div>
        </div>
      </Sourced>

      {/* ── 3가지 핵심 구성 요소 ── */}
      <Sourced
        refs={{
          textbook: "11.1.3 신경망의 구성 요소",
          slides: "From 생물학적 신경망 To 인공 신경망 — 인공신경망의 3가지 핵심 구성 요소",
          lecture: "어떤 신경망 모델이든 이 세 가지만 확인하면 파악되고, 셋 중 하나를 바꾸면 새 모델이 된다는 점이 출발점이라고 반복해 강조",
        }}
      >
        <div className="rounded-xl border border-fuchsia-200 bg-fuchsia-50 p-5 dark:border-fuchsia-900 dark:bg-fuchsia-950/30">
          <h3 className="text-base font-bold text-fuchsia-800 dark:text-fuchsia-200">
            인공 신경망의 3가지 핵심 구성 요소
          </h3>
          <p className="mt-1 text-xs text-fuchsia-700/80 dark:text-fuchsia-300/80">
            신경망은 크게 세 가지 요소, 즉 인공 신경세포(뉴런) · 연결 구조 · 학습 규칙에 의해 정의됨.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                n: "①",
                t: "신경세포",
                en: "neuron, node, unit",
                d: "하나의 신경세포가 수행하는 기능적 측면을 수학적 함수로 정의",
                anchor: "#neuron",
              },
              {
                n: "②",
                t: "신경망 구조",
                en: "network structure",
                d: "신경세포들 간의 정보 전달을 위한 연결 구조",
                anchor: "#architecture",
              },
              {
                n: "③",
                t: "학습 알고리즘",
                en: "learning algorithm",
                d: "신경망이 원하는 기능을 수행할 수 있도록 신경세포들 간의 연결 강도를 조정하는 방법",
                anchor: "#learning",
              },
            ].map((c) => (
              <a
                key={c.t}
                href={c.anchor}
                className="block rounded-xl border border-fuchsia-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-fuchsia-900 dark:bg-gray-900"
              >
                <p className="text-sm font-bold">
                  <span className="mr-1 text-fuchsia-600 dark:text-fuchsia-400">{c.n}</span>
                  {c.t}
                </p>
                <p className="text-[10px] text-gray-400">{c.en}</p>
                <p className="mt-2 text-xs leading-relaxed text-gray-700 dark:text-gray-300">{c.d}</p>
              </a>
            ))}
          </div>
        </div>
      </Sourced>
    </section>
  );
}
