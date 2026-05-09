"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Inbox, CheckSquare, Zap, ArrowRight } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

/* ------------------------------------------------------------------ */
/* 탐색 알고리즘 공통 구조 단계 애니메이션                                   */
/* ------------------------------------------------------------------ */

interface AlgoStep {
  id: number;
  label: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  desc: string;
  detail: string;
}

const ALGO_STEPS: AlgoStep[] = [
  {
    id: 1,
    label: "출발노드 삽입",
    icon: "📥",
    color: "text-blue-700 dark:text-blue-300",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-300 dark:border-blue-800",
    desc: "출발노드에 경로비용 0을 지정하여 OPEN에 삽입.",
    detail: "CLOSED는 비어있음. OPEN = [출발노드]",
  },
  {
    id: 2,
    label: "OPEN에서 노드 선택",
    icon: "🎯",
    color: "text-purple-700 dark:text-purple-300",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-300 dark:border-purple-800",
    desc: "OPEN에서 정해진 기준으로 노드 n을 꺼냄.",
    detail: "어떤 기준으로 고르느냐 = 알고리즘의 핵심\n• DFS: 가장 최근 생성 (스택)\n• BFS: 가장 먼저 생성 (큐)\n• UCS: 경로비용 g(n) 최소\n• A*: f(n) = g(n)+ĥ(n) 최소",
  },
  {
    id: 3,
    label: "목표 확인",
    icon: "✅",
    color: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-300 dark:border-emerald-800",
    desc: "n이 목표노드이면 탐색 성공 — 경로 반환.",
    detail: "부모 포인터를 역추적하면 출발→목표 경로를 복원할 수 있음.",
  },
  {
    id: 4,
    label: "노드 확장 (Expand)",
    icon: "🌿",
    color: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-300 dark:border-amber-800",
    desc: "n에 적용 가능한 모든 연산자를 적용해 후계노드를 생성.",
    detail: "각 후계노드에 부모 n의 포인터를 첨부 (경로 역추적용).\n생성된 후계노드는 중복 검사 후 OPEN에 추가.",
  },
  {
    id: 5,
    label: "n → CLOSED 이동",
    icon: "📦",
    color: "text-gray-700 dark:text-gray-300",
    bg: "bg-gray-50 dark:bg-gray-900",
    border: "border-gray-300 dark:border-gray-700",
    desc: "확장이 끝난 n을 CLOSED로 이동. 재확장 방지.",
    detail: "CLOSED에 있는 노드를 다시 OPEN에 넣지 않아 무한 루프를 막음.\n단, 더 저렴한 경로가 발견되면 예외적으로 처리(UCS/A*).",
  },
  {
    id: 6,
    label: "OPEN이 빌 때까지 반복",
    icon: "🔁",
    color: "text-indigo-700 dark:text-indigo-300",
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    border: "border-indigo-300 dark:border-indigo-800",
    desc: "OPEN이 비어있으면 탐색 실패 (해 없음).",
    detail: "2번으로 돌아가 반복. OPEN이 빌 때까지 목표를 못 찾으면 해가 없다는 의미.",
  },
];

/* ------------------------------------------------------------------ */
/* 중복 노드 처리 케이스                                                   */
/* ------------------------------------------------------------------ */
const DUPLICATE_CASES = [
  {
    situation: "후계노드가 OPEN에 이미 존재",
    handling: "두 노드 중 비용(g 또는 f̂)이 더 큰 쪽을 제거",
    example: "기존 B(g=5)가 있는데 새로운 B(g=3)가 생성되면 → 기존 B(5) 제거, 새 B(3) 유지",
    color: "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  },
  {
    situation: "후계노드가 CLOSED에 이미 존재",
    handling: "UCS: 새 노드 무조건 제거 (최적성 보장됨) / A*: 비용 비교 후 처리",
    example: "이미 확장된 B(g=3)가 있고, 새 B(g=5)가 생성되면 → 새 B(5) 제거",
    color: "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900",
    badge: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  },
  {
    situation: "완전히 새로운 노드",
    handling: "그냥 OPEN에 삽입하고 정렬",
    example: "처음 만나는 노드 C → OPEN에 추가",
    color: "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  },
];

/* ------------------------------------------------------------------ */
/* 메인 컴포넌트                                                          */
/* ------------------------------------------------------------------ */
export default function SearchMechanismBasics() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section className="space-y-10">
      <SectionTitle
        title="탐색 알고리즘의 공통 구조 — OPEN·CLOSED·확장"
        subtitle="DFS·BFS·UCS·A* 모두 같은 뼈대를 공유합니다. 차이는 오직 '어떤 노드를 다음에 고르느냐'뿐"
      />

      {/* ── OPEN / CLOSED 핵심 개념 ─────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* OPEN */}
        <div className="rounded-2xl border-2 border-blue-300 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-950/30">
          <div className="mb-3 flex items-center gap-2">
            <Inbox size={18} className="text-blue-600" />
            <h3 className="text-base font-bold text-blue-800 dark:text-blue-200">
              OPEN 리스트
            </h3>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
              아직 확장 안 됨
            </span>
          </div>
          <p className="mb-3 text-sm text-blue-900 dark:text-blue-100">
            <b>앞으로 확장(탐색)할 노드들의 대기열.</b>
          </p>
          <ul className="space-y-1.5 text-xs text-blue-800 dark:text-blue-200">
            <li className="flex items-start gap-1.5">
              <ArrowRight size={11} className="mt-0.5 shrink-0" />
              처음에 출발노드 하나만 들어있음
            </li>
            <li className="flex items-start gap-1.5">
              <ArrowRight size={11} className="mt-0.5 shrink-0" />
              노드를 꺼낼 때 <b>어떤 순서로 꺼내느냐</b>가 알고리즘의 성격을 결정
            </li>
            <li className="flex items-start gap-1.5">
              <ArrowRight size={11} className="mt-0.5 shrink-0" />
              DFS → 스택(LIFO) &nbsp;|&nbsp; BFS → 큐(FIFO) &nbsp;|&nbsp; UCS/A* → 우선순위 큐
            </li>
          </ul>
          <div className="mt-3 rounded-lg bg-white/70 p-2 text-[11px] text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            비유: 병원 대기실. 다음에 진료받을 환자 목록.
          </div>
        </div>

        {/* CLOSED */}
        <div className="rounded-2xl border-2 border-gray-300 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2">
            <CheckSquare size={18} className="text-gray-600" />
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">
              CLOSED 리스트
            </h3>
            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-400">
              확장 완료
            </span>
          </div>
          <p className="mb-3 text-sm text-gray-800 dark:text-gray-200">
            <b>이미 확장이 끝난 노드들의 보관함.</b>
          </p>
          <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-1.5">
              <ArrowRight size={11} className="mt-0.5 shrink-0" />
              처음에 비어있음
            </li>
            <li className="flex items-start gap-1.5">
              <ArrowRight size={11} className="mt-0.5 shrink-0" />
              OPEN에서 꺼낸 노드를 확장 후 여기로 이동
            </li>
            <li className="flex items-start gap-1.5">
              <ArrowRight size={11} className="mt-0.5 shrink-0" />
              여기에 있는 노드는 다시 확장하지 않음 → <b>무한 루프 방지</b>
            </li>
          </ul>
          <div className="mt-3 rounded-lg bg-white/70 p-2 text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            비유: 이미 진료 받은 환자 기록부. 재진료(재확장) 안 함.
          </div>
        </div>
      </div>

      {/* ── 노드 확장(Expand) 설명 ──────────────────────────────── */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
        <div className="mb-3 flex items-center gap-2">
          <Zap size={18} className="text-amber-600" />
          <h3 className="text-sm font-bold text-amber-800 dark:text-amber-200">
            노드 확장(Expand)이란?
          </h3>
        </div>
        <p className="mb-4 text-xs text-amber-800 dark:text-amber-200">
          선택한 노드에 <b>모든 가능한 연산자를 적용</b>하여 후계(자식) 노드를 생성하는 것.
        </p>
        {/* 확장 다이어그램 */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {/* 현재 노드 */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-amber-500 bg-amber-100 text-sm font-bold text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
              n
            </div>
            <span className="text-[10px] text-amber-700 dark:text-amber-400">현재 노드</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-500 mb-0.5">연산자 적용</span>
            <ArrowRight size={20} className="text-amber-500" />
          </div>

          {/* 후계 노드들 */}
          <div className="flex flex-col gap-2">
            {["n₁", "n₂", "n₃"].map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold ${
                  i === 0 ? "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                  : i === 1 ? "border-purple-400 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
                  : "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                }`}>
                  {label}
                </div>
                <span className="text-[10px] text-gray-500">
                  {i === 0 ? "g(n₁) = g(n) + C(n,n₁)" : i === 1 ? "g(n₂) = g(n) + C(n,n₂)" : "g(n₃) = g(n) + C(n,n₃)"}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-white/80 p-2 text-[11px] text-gray-600 dark:bg-gray-900/60 dark:text-gray-400">
          각 후계노드에는 ① 부모(n)를 가리키는 포인터 + ② 경로비용 g 값이 함께 저장됩니다. 나중에 포인터를 역추적하면 경로를 복원할 수 있습니다.
        </div>
      </div>

      {/* ── 탐색 알고리즘 일반 구조 ──────────────────────────────── */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">
          탐색 알고리즘 공통 흐름 — 단계를 클릭해 보세요
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {ALGO_STEPS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(activeStep === s.id ? null : s.id)}
              className={`rounded-xl border-2 p-3 text-left transition-all ${s.border} ${s.bg} ${
                activeStep === s.id ? "shadow-md ring-2 ring-indigo-400/40" : "opacity-70 hover:opacity-100"
              }`}
            >
              <div className="mb-1 text-xl">{s.icon}</div>
              <div className={`text-[10px] font-bold ${s.color}`}>STEP {s.id}</div>
              <div className="mt-0.5 text-[11px] font-semibold text-gray-700 dark:text-gray-300 leading-tight">
                {s.label}
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeStep !== null && (() => {
            const s = ALGO_STEPS.find((x) => x.id === activeStep)!;
            return (
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className={`mt-3 rounded-xl border-2 p-4 ${s.border} ${s.bg}`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xl">{s.icon}</span>
                  <span className={`text-sm font-bold ${s.color}`}>{s.label}</span>
                </div>
                <p className="mb-2 text-xs text-gray-700 dark:text-gray-300">{s.desc}</p>
                <div className="rounded-lg bg-white/70 p-2 dark:bg-gray-900/60">
                  {s.detail.split("\n").map((line, i) => (
                    <p key={i} className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>

      {/* ── 중복 노드 처리 ──────────────────────────────────────── */}
      <div>
        <h3 className="mb-1 text-sm font-bold text-gray-700 dark:text-gray-300">
          중복 노드 처리 — 같은 노드가 두 번 생성되면?
        </h3>
        <p className="mb-3 text-xs text-gray-500">
          상태공간 그래프에는 순환(cycle)이 있을 수 있어 같은 노드가 여러 경로로 생성됩니다.
        </p>
        <div className="space-y-2">
          {DUPLICATE_CASES.map((c, i) => (
            <div key={i} className={`rounded-xl border p-4 ${c.color}`}>
              <div className="flex items-start gap-3">
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${c.badge}`}>
                  경우 {i + 1}
                </span>
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{c.situation}</p>
                  <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{c.handling}</p>
                  <p className="mt-1 text-[11px] italic text-gray-500 dark:text-gray-500">예) {c.example}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 알고리즘 비교 한눈에 ─────────────────────────────────── */}
      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20">
        <h4 className="mb-3 text-xs font-bold text-indigo-700 dark:text-indigo-300">
          알고리즘별 "다음 노드 선택" 기준 — 이것만 다릅니다
        </h4>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "DFS", rule: "OPEN 앞(스택 top) 꺼냄", note: "가장 최근 생성된 노드", color: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-300" },
            { name: "BFS", rule: "OPEN 앞(큐 front) 꺼냄", note: "가장 오래전 생성된 노드", color: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-700 dark:text-emerald-300" },
            { name: "UCS", rule: "g(n) 최소 노드", note: "출발지까지 실제 비용이 가장 적은 것", color: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-300" },
            { name: "A*", rule: "f̂(n) = g(n)+ĥ(n) 최소", note: "실제비용 + 목표까지 예측비용 합이 최소", color: "bg-purple-100 dark:bg-purple-900/40", text: "text-purple-700 dark:text-purple-300" },
          ].map((alg) => (
            <div key={alg.name} className={`rounded-lg p-3 ${alg.color}`}>
              <div className={`mb-1 text-sm font-black ${alg.text}`}>{alg.name}</div>
              <div className="text-[11px] font-semibold text-gray-800 dark:text-gray-200">{alg.rule}</div>
              <div className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">{alg.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
