"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import CPMTerm from "./CPMTerm";

/* ---------------------------------------------------------------------
 * CPM 계산 워크스루
 * - 두 개의 가공 네트워크 예제 (과제와 전혀 다른 ID/구조/기간)
 *   EX_A: 6노드 · merge 1개 · fork 1개 (기본)
 *   EX_B: 8노드 · merge 3개 · fork 3개 (과제 수준 복합)
 * - Step별 Forward Pass → Backward Pass → 임계 경로 하이라이트
 * ------------------------------------------------------------------- */

interface CPMNode {
  id: string;
  duration: number;
  x: number;
  y: number;
  pred: string[];
}

interface Example {
  key: string;
  label: string;
  subtitle: string;
  nodes: CPMNode[];
  forward: Record<string, { est: number; eft: number; reason: string }>;
  backward: Record<string, { lst: number; lft: number; reason: string }>;
  forwardOrder: string[];
  backwardOrder: string[];
  critical: string[]; // critical path in order (not just set)
  edges: { from: string; to: string }[];
  viewBox: string;
  duration: number;
}

/* ---------- EX_A: 6노드 기본 ---------- */
const EX_A_NODES: CPMNode[] = [
  { id: "P", duration: 3, x: 80, y: 160, pred: [] },
  { id: "Q", duration: 4, x: 260, y: 70, pred: ["P"] },
  { id: "R", duration: 5, x: 260, y: 160, pred: ["P"] },
  { id: "S", duration: 6, x: 260, y: 250, pred: ["P"] },
  { id: "U", duration: 1, x: 440, y: 250, pred: ["S"] },
  { id: "T", duration: 2, x: 600, y: 160, pred: ["Q", "R", "U"] },
];

const EX_A: Example = {
  key: "A",
  label: "예제 A · 기본 (6노드)",
  subtitle: "첫 접근용 · merge 1개 + fork 1개",
  nodes: EX_A_NODES,
  viewBox: "0 0 720 340",
  duration: 12,
  forward: {
    P: { est: 0, eft: 3, reason: "시작 작업: EST=0, EFT=0+3=3" },
    Q: { est: 3, eft: 7, reason: "선행 {P}의 EFT=3 → EST=3, EFT=3+4=7" },
    R: { est: 3, eft: 8, reason: "선행 {P}의 EFT=3 → EST=3, EFT=3+5=8" },
    S: { est: 3, eft: 9, reason: "선행 {P}의 EFT=3 → EST=3, EFT=3+6=9" },
    U: { est: 9, eft: 10, reason: "선행 {S}의 EFT=9 → EST=9, EFT=9+1=10" },
    T: {
      est: 10,
      eft: 12,
      reason:
        "선행 {Q,R,U}의 EFT={7,8,10} → max=10 → EST=10, EFT=10+2=12",
    },
  },
  backward: {
    T: {
      lst: 10,
      lft: 12,
      reason: "종료 작업: LFT = 프로젝트 기간 12 → LST = 12−2 = 10",
    },
    U: { lst: 9, lft: 10, reason: "후행 {T}의 LST=10 → LFT=10, LST=10−1=9" },
    R: { lst: 5, lft: 10, reason: "후행 {T}의 LST=10 → LFT=10, LST=10−5=5" },
    Q: { lst: 6, lft: 10, reason: "후행 {T}의 LST=10 → LFT=10, LST=10−4=6" },
    S: { lst: 3, lft: 9, reason: "후행 {U}의 LST=9 → LFT=9, LST=9−6=3" },
    P: {
      lst: 0,
      lft: 3,
      reason: "후행 {Q,R,S}의 LST={6,5,3} → min=3 → LFT=3, LST=3−3=0",
    },
  },
  forwardOrder: ["P", "Q", "R", "S", "U", "T"],
  backwardOrder: ["T", "U", "R", "Q", "S", "P"],
  critical: ["P", "S", "U", "T"],
  edges: [
    { from: "P", to: "Q" },
    { from: "P", to: "R" },
    { from: "P", to: "S" },
    { from: "Q", to: "T" },
    { from: "R", to: "T" },
    { from: "S", to: "U" },
    { from: "U", to: "T" },
  ],
};

/* ---------- EX_B: 8노드 복합 (merge·fork 중첩) ---------- */
const EX_B_NODES: CPMNode[] = [
  { id: "K", duration: 2, x: 70, y: 160, pred: [] },
  { id: "L", duration: 3, x: 220, y: 70, pred: ["K"] },
  { id: "M", duration: 4, x: 220, y: 250, pred: ["K"] },
  { id: "N", duration: 2, x: 380, y: 70, pred: ["L", "M"] },
  { id: "P", duration: 3, x: 380, y: 250, pred: ["M"] },
  { id: "O", duration: 5, x: 540, y: 70, pred: ["N"] },
  { id: "Q", duration: 1, x: 540, y: 250, pred: ["N", "P"] },
  { id: "R", duration: 1, x: 680, y: 160, pred: ["O", "Q"] },
];

const EX_B: Example = {
  key: "B",
  label: "예제 B · 복합 (8노드, merge 3·fork 3)",
  subtitle: "과제 수준 복잡도 · 허브 노드 · 숨은 임계 경로",
  nodes: EX_B_NODES,
  viewBox: "0 0 760 340",
  duration: 14,
  forward: {
    K: { est: 0, eft: 2, reason: "시작 작업: EST=0, EFT=0+2=2" },
    L: { est: 2, eft: 5, reason: "선행 {K}의 EFT=2 → EST=2, EFT=2+3=5" },
    M: { est: 2, eft: 6, reason: "선행 {K}의 EFT=2 → EST=2, EFT=2+4=6" },
    N: {
      est: 6,
      eft: 8,
      reason:
        "선행 {L,M}의 EFT={5,6} → max=6 → EST=6, EFT=6+2=8 (merge 적용)",
    },
    P: { est: 6, eft: 9, reason: "선행 {M}의 EFT=6 → EST=6, EFT=6+3=9" },
    O: { est: 8, eft: 13, reason: "선행 {N}의 EFT=8 → EST=8, EFT=8+5=13" },
    Q: {
      est: 9,
      eft: 10,
      reason:
        "선행 {N,P}의 EFT={8,9} → max=9 → EST=9, EFT=9+1=10 (merge 적용)",
    },
    R: {
      est: 13,
      eft: 14,
      reason:
        "선행 {O,Q}의 EFT={13,10} → max=13 → EST=13, EFT=13+1=14 (종료)",
    },
  },
  backward: {
    R: {
      lst: 13,
      lft: 14,
      reason: "종료 작업: LFT = 프로젝트 기간 14 → LST = 14−1 = 13",
    },
    O: {
      lst: 8,
      lft: 13,
      reason: "후행 {R}의 LST=13 → LFT=13, LST=13−5=8",
    },
    Q: {
      lst: 12,
      lft: 13,
      reason: "후행 {R}의 LST=13 → LFT=13, LST=13−1=12",
    },
    P: {
      lst: 9,
      lft: 12,
      reason: "후행 {Q}의 LST=12 → LFT=12, LST=12−3=9",
    },
    N: {
      lst: 6,
      lft: 8,
      reason:
        "후행 {O,Q}의 LST={8,12} → min=8 → LFT=8, LST=8−2=6 (fork 적용)",
    },
    M: {
      lst: 2,
      lft: 6,
      reason:
        "후행 {N,P}의 LST={6,9} → min=6 → LFT=6, LST=6−4=2 (fork 적용)",
    },
    L: { lst: 3, lft: 6, reason: "후행 {N}의 LST=6 → LFT=6, LST=6−3=3" },
    K: {
      lst: 0,
      lft: 2,
      reason:
        "후행 {L,M}의 LST={3,2} → min=2 → LFT=2, LST=2−2=0 (fork 적용)",
    },
  },
  forwardOrder: ["K", "L", "M", "N", "P", "O", "Q", "R"],
  backwardOrder: ["R", "O", "Q", "P", "N", "M", "L", "K"],
  critical: ["K", "M", "N", "O", "R"],
  edges: [
    { from: "K", to: "L" },
    { from: "K", to: "M" },
    { from: "L", to: "N" },
    { from: "M", to: "N" },
    { from: "M", to: "P" },
    { from: "N", to: "O" },
    { from: "N", to: "Q" },
    { from: "P", to: "Q" },
    { from: "O", to: "R" },
    { from: "Q", to: "R" },
  ],
};

const EXAMPLES: Example[] = [EX_A, EX_B];

type Phase = "forward" | "backward" | "critical";
interface Step {
  phase: Phase;
  id?: string;
}

function buildSteps(ex: Example): Step[] {
  return [
    ...ex.forwardOrder.map((id) => ({ phase: "forward" as const, id })),
    ...ex.backwardOrder.map((id) => ({ phase: "backward" as const, id })),
    { phase: "critical" as const },
  ];
}

export default function CPMCalculationWalkthrough() {
  const [exKey, setExKey] = useState<string>(EX_A.key);
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);

  const example = EXAMPLES.find((e) => e.key === exKey)!;
  const steps = buildSteps(example);

  useEffect(() => {
    if (!playing) return;
    if (step >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 1100);
    return () => clearTimeout(t);
  }, [playing, step, steps.length]);

  // Reset when example changes
  const switchExample = (key: string) => {
    setExKey(key);
    setStep(-1);
    setPlaying(false);
  };

  const revealedForward = new Set<string>();
  const revealedBackward = new Set<string>();
  let criticalShown = false;
  let currentId: string | null = null;
  let currentPhase: Phase | null = null;

  for (let i = 0; i <= step && i < steps.length; i++) {
    const s = steps[i];
    if (s.phase === "forward" && s.id) revealedForward.add(s.id);
    if (s.phase === "backward" && s.id) revealedBackward.add(s.id);
    if (s.phase === "critical") criticalShown = true;
    if (i === step) {
      currentPhase = s.phase;
      currentId = s.id ?? null;
    }
  }

  const currentReason =
    currentPhase === "forward" && currentId
      ? example.forward[currentId].reason
      : currentPhase === "backward" && currentId
        ? example.backward[currentId].reason
        : currentPhase === "critical"
          ? `Slack=0인 작업을 이으면 임계 경로: ${example.critical.join(" → ")}. 총 소요 ${example.duration}.`
          : null;

  const criticalSet = new Set(example.critical);

  return (
    <section>
      <SectionTitle
        title="5. CPM 계산 워크스루 · 두 가지 가공 네트워크"
        subtitle="Forward/Backward pass · Step별 도출 · 임계 경로 하이라이트"
      />

      <div className="mb-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-[11px] text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
        두 예제 모두 <strong>과제와 무관한 가공 네트워크</strong>입니다. 작업
        이름·기간·구조가 과제와 완전히 다름. 계산 절차 학습용으로만 사용하세요.
      </div>

      {/* 예제 선택 탭 */}
      <div className="mb-3 flex gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.key}
            onClick={() => switchExample(ex.key)}
            className={`flex-1 rounded-xl border-2 px-4 py-3 text-left transition-all ${
              exKey === ex.key
                ? "border-emerald-500 bg-white shadow-sm dark:bg-gray-900"
                : "border-emerald-100 bg-white/60 hover:border-emerald-300 dark:border-emerald-900/40 dark:bg-gray-900/40"
            }`}
          >
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
              {ex.label}
            </div>
            <div className="mt-0.5 text-[10px] text-gray-500">
              {ex.subtitle}
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 dark:border-emerald-900/50 dark:from-emerald-950/30 dark:to-gray-900">
        {/* 컨트롤 */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (step >= steps.length - 1) setStep(-1);
              setPlaying((p) => !p);
            }}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-600"
          >
            {playing ? <Pause size={12} /> : <Play size={12} />}
            {playing ? "일시정지" : "재생"}
          </button>
          <button
            onClick={() => setStep((s) => Math.min(s + 1, steps.length - 1))}
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
          >
            <SkipForward size={12} /> 한 단계
          </button>
          <button
            onClick={() => {
              setStep(-1);
              setPlaying(false);
            }}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <RotateCcw size={12} /> 초기화
          </button>
          <div className="ml-auto text-[11px] text-gray-500">
            Step {Math.max(step + 1, 0)} / {steps.length}
          </div>
        </div>

        {/* SVG 네트워크 */}
        <div className="overflow-x-auto">
          <svg
            viewBox={example.viewBox}
            className="mx-auto w-full min-w-[680px] max-w-3xl"
          >
            {/* 화살표 */}
            {example.edges.map((e, i) => {
              const from = example.nodes.find((n) => n.id === e.from)!;
              const to = example.nodes.find((n) => n.id === e.to)!;
              // Critical edge: both endpoints in critical path AND consecutive
              const isCritical =
                criticalShown &&
                criticalSet.has(e.from) &&
                criticalSet.has(e.to) &&
                example.critical.indexOf(e.to) ===
                  example.critical.indexOf(e.from) + 1;
              const dx = to.x - from.x;
              const dy = to.y - from.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const ux = dx / dist;
              const uy = dy / dist;
              const r = 38;
              return (
                <line
                  key={i}
                  x1={from.x + ux * r}
                  y1={from.y + uy * r}
                  x2={to.x - ux * r}
                  y2={to.y - uy * r}
                  stroke={isCritical ? "#dc2626" : "#10b981"}
                  strokeWidth={isCritical ? 3 : 2}
                  markerEnd={
                    isCritical ? "url(#arrow-red)" : "url(#arrow-green)"
                  }
                />
              );
            })}

            {/* 노드 */}
            {example.nodes.map((n) => {
              const f = revealedForward.has(n.id) ? example.forward[n.id] : null;
              const b = revealedBackward.has(n.id)
                ? example.backward[n.id]
                : null;
              const isCurrent = currentId === n.id;
              const isCritical = criticalShown && criticalSet.has(n.id);
              return (
                <g key={n.id}>
                  {f && (
                    <text
                      x={n.x}
                      y={n.y - 48}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#059669"
                      fontWeight="700"
                    >
                      EST={f.est} / EFT={f.eft}
                    </text>
                  )}
                  <motion.circle
                    cx={n.x}
                    cy={n.y}
                    r={38}
                    fill={
                      isCritical
                        ? "#fee2e2"
                        : isCurrent
                          ? "#a7f3d0"
                          : f
                            ? "#ffffff"
                            : "#f9fafb"
                    }
                    stroke={
                      isCritical
                        ? "#dc2626"
                        : isCurrent
                          ? "#059669"
                          : "#10b981"
                    }
                    strokeWidth={isCurrent || isCritical ? 3 : 2}
                    animate={{
                      scale: isCurrent ? [1, 1.08, 1] : 1,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  <text
                    x={n.x}
                    y={n.y - 2}
                    textAnchor="middle"
                    fontSize="16"
                    fontWeight="800"
                    fill={isCritical ? "#b91c1c" : "#065f46"}
                  >
                    {n.id}
                  </text>
                  <text
                    x={n.x}
                    y={n.y + 14}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#6b7280"
                  >
                    d={n.duration}
                  </text>
                  {b && (
                    <text
                      x={n.x}
                      y={n.y + 56}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#7c3aed"
                      fontWeight="700"
                    >
                      LST={b.lst} / LFT={b.lft}
                    </text>
                  )}
                </g>
              );
            })}

            <defs>
              <marker
                id="arrow-green"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill="#10b981" />
              </marker>
              <marker
                id="arrow-red"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill="#dc2626" />
              </marker>
            </defs>
          </svg>
        </div>

        {/* 현재 단계 설명 */}
        <div className="mt-4 rounded-lg bg-white p-4 dark:bg-gray-900">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            {currentPhase === "forward" && (
              <CPMTerm term="forward" label="Forward Pass · 선행 → 후행" />
            )}
            {currentPhase === "backward" && (
              <CPMTerm term="backward" label="Backward Pass · 후행 → 선행 역순" />
            )}
            {currentPhase === "critical" && (
              <CPMTerm term="critical" label="임계 경로 · Slack=0 작업 연결" />
            )}
            {currentPhase === null && "재생 또는 한 단계 버튼을 눌러 시작"}
          </div>
          <p className="mt-1 font-mono text-xs text-gray-700 dark:text-gray-300">
            {currentReason ?? "계산이 단계별로 여기에 표시됩니다."}
          </p>
        </div>

        {/* 계산 표 */}
        <div className="relative z-0 mt-4 overflow-visible rounded-lg border border-emerald-200 bg-white dark:border-emerald-900/50 dark:bg-gray-900">
          <table className="w-full text-[11px]">
            <thead className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
              <tr>
                <th className="p-2">작업</th>
                <th className="p-2">
                  <CPMTerm term="duration" label="d" />
                </th>
                <th className="p-2">
                  <CPMTerm term="EST" />
                </th>
                <th className="p-2">
                  <CPMTerm term="EFT" />
                </th>
                <th className="p-2">
                  <CPMTerm term="LST" />
                </th>
                <th className="p-2">
                  <CPMTerm term="LFT" />
                </th>
                <th className="p-2">
                  <CPMTerm term="Slack" />
                </th>
                <th className="p-2">
                  <CPMTerm term="critical" label="Critical?" />
                </th>
              </tr>
            </thead>
            <tbody className="text-center font-mono">
              {example.nodes.map((n) => {
                const f = revealedForward.has(n.id)
                  ? example.forward[n.id]
                  : null;
                const b = revealedBackward.has(n.id)
                  ? example.backward[n.id]
                  : null;
                const slack = f && b ? b.lst - f.est : null;
                const isCrit = slack === 0 && criticalShown;
                return (
                  <tr
                    key={n.id}
                    className={`border-t border-gray-100 dark:border-gray-800 ${
                      isCrit
                        ? "bg-red-50/60 font-bold text-red-700 dark:bg-red-950/20 dark:text-red-300"
                        : ""
                    }`}
                  >
                    <td className="p-2">{n.id}</td>
                    <td className="p-2">{n.duration}</td>
                    <td className="p-2">{f?.est ?? "-"}</td>
                    <td className="p-2">{f?.eft ?? "-"}</td>
                    <td className="p-2">{b?.lst ?? "-"}</td>
                    <td className="p-2">{b?.lft ?? "-"}</td>
                    <td className="p-2">{slack ?? "-"}</td>
                    <td className="p-2">{isCrit ? "★" : ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 예제별 포인트 */}
        {exKey === "B" && (
          <div className="mt-4 rounded-xl border-l-4 border-emerald-500 bg-white p-4 dark:bg-gray-900">
            <div className="mb-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              예제 B 학습 포인트
            </div>
            <ul className="space-y-1 text-[11px] text-gray-600 dark:text-gray-400">
              <li>
                · <strong>N은 merge이자 fork</strong>: 선행 L,M의 EFT 중 max로
                EST 결정, 후속 O,Q의 LST 중 min으로 LFT 결정. 양쪽 규칙 모두 적용.
              </li>
              <li>
                · <strong>K의 fork</strong>: 후속 L(LST=3), M(LST=2) 중 min=2.
                M 쪽이 더 빡빡하므로 K도 그에 맞춰 finish해야 함.
              </li>
              <li>
                · <strong>숨은 임계 경로</strong>: 직관으로는 K→L→N 경로가 더
                짧아 보일 수 있으나, M(d=4)이 L(d=3)보다 길어 실제 임계는 K→M→N→O→R.
              </li>
              <li>
                · <strong>여러 merge 중첩</strong>: N은 L,M에서 merge, Q는 N,P에서
                merge, R은 O,Q에서 merge. 과제의 D, H, J와 유사한 3중 merge 구조.
              </li>
            </ul>
          </div>
        )}
        {exKey === "A" && (
          <div className="mt-4 rounded-xl border-l-4 border-emerald-500 bg-white p-4 dark:bg-gray-900">
            <div className="mb-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              예제 A 학습 포인트
            </div>
            <ul className="space-y-1 text-[11px] text-gray-600 dark:text-gray-400">
              <li>
                · <strong>P의 fork</strong>: 후속 Q(LST=6), R(LST=5), S(LST=3)
                중 min=3. S 경로가 제일 빡빡 → P의 LFT=3.
              </li>
              <li>
                · <strong>T의 merge</strong>: 선행 Q(EFT=7), R(EFT=8), U(EFT=10)
                중 max=10 → T의 EST=10.
              </li>
              <li>
                · forward는 max, backward는 min — 두 규칙을 딱 한 번씩 경험.
                복잡한 예제 B로 넘어가기 전 기본기 확인용.
              </li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
