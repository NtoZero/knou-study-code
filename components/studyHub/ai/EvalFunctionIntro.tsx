"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Eye, EyeOff, Lightbulb, TrendingUp } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

/**
 * 평가함수 기호 입문 — g, h, ĥ, f̂ 을 처음 보는 사람을 위한 직관적 설명
 * 교재 3장 식 (3-1), (3-2), (3-3) 기반
 */

type SymKey = "g" | "h" | "hhat" | "fhat";

const SYMBOLS: {
  key: SymKey;
  symbol: string;
  name: string;
  formula: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  knowable: boolean;
  analogy: string;
  detail: string;
  source: string;
}[] = [
  {
    key: "g",
    symbol: "g(n)",
    name: "실제 경로비용",
    formula: "g(n) = g(부모) + C(부모, n)",
    color: "border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30",
    badgeBg: "bg-blue-100 dark:bg-blue-900/50",
    badgeText: "text-blue-700 dark:text-blue-300",
    icon: MapPin,
    knowable: true,
    analogy: "지금까지 걸어온 거리 — 출발지에서 현재 노드까지 실제로 지불한 비용의 합.",
    detail:
      "탐색이 진행되면서 노드를 확장할 때마다 정확히 계산됩니다. UCS는 이 값만으로 OPEN을 정렬합니다. 더 싼 경로가 새로 발견되면 g 값을 갱신합니다.",
    source: "교재 식 (3-1), p.58 — g(nᵢ) = g(n) + C(n, nᵢ)",
  },
  {
    key: "h",
    symbol: "h(n)",
    name: "실제 잔여비용 (이론값)",
    formula: "h(n) = n → 목표까지 실제 최소 비용",
    color: "border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/30",
    badgeBg: "bg-rose-100 dark:bg-rose-900/50",
    badgeText: "text-rose-700 dark:text-rose-300",
    icon: EyeOff,
    knowable: false,
    analogy: "목적지까지 남은 실제 거리 — 이론상으로만 존재하며, 목표에 도달하기 전까지는 정확히 알 수 없습니다.",
    detail:
      "A* 알고리즘의 이상적 평가함수 f(n) = g(n) + h(n) (교재 식 3-2)에 쓰이지만, h(n)을 정확히 계산하는 것은 탐색을 완료하기 전에는 불가능합니다. 그래서 경험적 예측값 ĥ(n)으로 대체합니다.",
    source: "교재 식 (3-2), p.71 — f(n) = g(n) + h(n) (이론적 기준)",
  },
  {
    key: "hhat",
    symbol: "ĥ(n)",
    name: "휴리스틱 — h(n) 예측치",
    formula: "ĥ(n) ≤ h(n) 이면 허용적(admissible)",
    color: "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30",
    badgeBg: "bg-emerald-100 dark:bg-emerald-900/50",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    icon: Eye,
    knowable: true,
    analogy: "나침반 — 정확한 거리는 모르지만 목표가 어느 방향에 있는지는 알 수 있습니다. 직선거리처럼 항상 낙관적(짧게) 추정합니다.",
    detail:
      "경험적 지식으로 h(n)을 추정한 값입니다. 언덕오르기 탐색은 ĥ(n)만 사용하고, A*는 g(n)과 함께 씁니다. 항상 실제보다 짧게 추정해야(ĥ ≤ h) 최적 경로가 보장됩니다.",
    source: "교재 p.62, 71 — ĥ(n)은 h(n)의 경험적 예측치",
  },
  {
    key: "fhat",
    symbol: "f̂(n)",
    name: "A* 평가함수 (실제 사용)",
    formula: "f̂(n) = g(n) + ĥ(n)",
    color: "border-indigo-300 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950/30",
    badgeBg: "bg-indigo-100 dark:bg-indigo-900/50",
    badgeText: "text-indigo-700 dark:text-indigo-300",
    icon: TrendingUp,
    knowable: true,
    analogy: "내비게이션 — 지금까지 달린 거리(g)에 목적지까지 예상 거리(ĥ)를 더해 '이 경로로 갔을 때 총 얼마나 걸릴 것 같은가'를 판단합니다.",
    detail:
      "A* 알고리즘이 실제로 OPEN 리스트 정렬에 사용하는 값입니다. f̂(n)이 최소인 노드를 먼저 확장합니다. ĥ가 h를 과대추정하지 않으면(허용적이면) A*는 최소비용 경로를 보장합니다.",
    source: "교재 식 (3-3), p.71 — f̂(n) = g(n) + ĥ(n)",
  },
];

// 도로망 비유 시각화용 노드
const ROAD_NODES = [
  { id: "서울", x: 60,  y: 120, goal: false },
  { id: "대전", x: 200, y: 120, goal: false },
  { id: "대구", x: 340, y: 120, goal: false },
  { id: "부산", x: 480, y: 120, goal: true  },
];
const ROAD_EDGES = [
  { from: 0, to: 1, dist: 140 },
  { from: 1, to: 2, dist: 130 },
  { from: 2, to: 3, dist: 90  },
];
// 서울→대전→대구 까지 왔다고 가정
const CURRENT = 2; // 대구

export default function EvalFunctionIntro() {
  const [active, setActive] = useState<SymKey>("g");

  const cur = SYMBOLS.find((s) => s.key === active)!;
  const Icon = cur.icon;

  return (
    <section className="space-y-6">
      <SectionTitle
        title="평가함수 기호 — g, h, ĥ, f̂ 이 뭔가요?"
        subtitle="탐색 알고리즘이 다음에 어떤 노드를 고를지 결정하는 기준값입니다"
      />

      {/* 도로 비유 */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 space-y-3">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          <strong>비유:</strong> 서울→부산 자동차 여행. 지금 대구까지 왔습니다.
        </p>
        <div className="overflow-x-auto">
          <svg viewBox="0 0 560 200" className="w-full max-w-xl mx-auto" style={{ minWidth: 320 }}>
            {/* 도로 */}
            {ROAD_EDGES.map((e, i) => {
              const a = ROAD_NODES[e.from];
              const b = ROAD_NODES[e.to];
              const isGone = e.from < CURRENT; // 이미 지나온 구간
              const isCurrent = e.from === CURRENT - 1 && e.to === CURRENT;
              return (
                <g key={i}>
                  <line
                    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke={isGone || isCurrent ? "#3b82f6" : "#e2e8f0"}
                    strokeWidth={isGone || isCurrent ? 3 : 2}
                    strokeDasharray={e.to >= CURRENT + 1 ? "6,4" : undefined}
                  />
                  <text
                    x={(a.x + b.x) / 2} y={a.y - 10}
                    textAnchor="middle" fontSize={11}
                    fill={isGone || isCurrent ? "#2563eb" : "#94a3b8"}
                    fontWeight={isGone || isCurrent ? "700" : "400"}
                  >
                    {e.dist}km
                  </text>
                </g>
              );
            })}

            {/* 노드 */}
            {ROAD_NODES.map((n, i) => (
              <g key={n.id}>
                <circle
                  cx={n.x} cy={n.y} r={26}
                  fill={
                    i === CURRENT ? "#6366f1" :
                    n.goal ? "#10b981" :
                    i < CURRENT ? "#bfdbfe" : "#f1f5f9"
                  }
                  stroke={
                    i === CURRENT ? "#4338ca" :
                    n.goal ? "#059669" : "#cbd5e1"
                  }
                  strokeWidth={2}
                />
                <text
                  x={n.x} y={n.y + 5}
                  textAnchor="middle" fontSize={12} fontWeight="700"
                  fill={i === CURRENT || n.goal ? "#fff" : i < CURRENT ? "#1e3a8a" : "#64748b"}
                >
                  {n.id}
                </text>
                {i === CURRENT && (
                  <text x={n.x} y={n.y + 42} textAnchor="middle" fontSize={10} fill="#6366f1" fontWeight="600">
                    ← 현재위치
                  </text>
                )}
              </g>
            ))}

            {/* 범례 */}
            <rect x={10} y={160} width={12} height={4} rx={2} fill="#3b82f6" />
            <text x={26} y={168} fontSize={10} fill="#64748b">지나온 경로</text>
            <line x1={100} y1={164} x2={116} y2={164} stroke="#e2e8f0" strokeWidth={2} strokeDasharray="4,3" />
            <text x={120} y={168} fontSize={10} fill="#64748b">남은 경로(미지)</text>
            <circle cx={215} cy={164} r={5} fill="#10b981" />
            <text x={224} y={168} fontSize={10} fill="#64748b">목표</text>

            {/* g/h 표시 */}
            <text x={130} y={155} textAnchor="middle" fontSize={11} fill="#2563eb" fontWeight="700">
              g = 140+130 = 270km
            </text>
            <text x={410} y={155} textAnchor="middle" fontSize={11} fill="#be185d" fontWeight="700">
              h = ? (실제 90km)
            </text>
            <text x={410} y={170} textAnchor="middle" fontSize={10} fill="#059669">
              ĥ ≈ 직선거리 ~75km (추정)
            </text>
          </svg>
        </div>

        {/* 기호별 해석 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            { sym: "g(대구)", val: "270km", sub: "서울→대구 실제 거리", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40" },
            { sym: "h(대구)", val: "90km", sub: "대구→부산 실제 거리 (도착 전엔 모름)", color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-950/30" },
            { sym: "ĥ(대구)", val: "≈75km", sub: "직선거리로 추정", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
            { sym: "f̂(대구)", val: "≈345km", sub: "270 + 75 (총 예측 거리)", color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
          ].map((item) => (
            <div key={item.sym} className={`rounded-lg ${item.bg} px-3 py-2 space-y-0.5`}>
              <div className={`font-mono font-bold ${item.color}`}>{item.sym}</div>
              <div className={`text-base font-bold ${item.color}`}>{item.val}</div>
              <div className="text-slate-500 dark:text-slate-400 leading-tight">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 기호 카드 선택 */}
      <div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
          각 기호를 클릭해 자세한 설명을 확인하세요.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SYMBOLS.map((s) => {
            const SIcon = s.icon;
            return (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                className={`rounded-xl border-2 p-3 text-left transition-all ${s.color} ${
                  active === s.key
                    ? "shadow-md ring-2 ring-indigo-400/40 opacity-100"
                    : "opacity-60 hover:opacity-90"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xl font-black text-slate-800 dark:text-slate-100">
                    {s.symbol}
                  </span>
                  <SIcon size={14} className="text-slate-500 shrink-0" />
                </div>
                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 leading-tight">
                  {s.name}
                </div>
                <div className={`mt-1.5 text-[10px] rounded-full px-1.5 py-0.5 inline-block font-bold ${s.badgeBg} ${s.badgeText}`}>
                  {s.knowable ? "계산 가능" : "탐색 전 알 수 없음"}
                </div>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className={`mt-3 rounded-xl border-2 p-5 space-y-3 ${cur.color}`}
          >
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-mono font-black ${cur.badgeText.replace("text-", "text-")}`}>
                {cur.symbol}
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{cur.name}</span>
              {!cur.knowable && (
                <span className="ml-auto text-[10px] rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 px-2 py-0.5 font-bold">
                  직접 계산 불가
                </span>
              )}
            </div>

            <div className="rounded-lg bg-white/60 dark:bg-slate-800/60 px-3 py-2 font-mono text-sm font-bold text-slate-700 dark:text-slate-200">
              {cur.formula}
            </div>

            <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <Lightbulb size={15} className="shrink-0 mt-0.5 text-amber-500" />
              <p>{cur.analogy}</p>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {cur.detail}
            </p>

            <div className="text-[11px] text-slate-500 dark:text-slate-500 border-t border-slate-200 dark:border-slate-700 pt-2">
              {cur.source}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 흐름도: 어떤 알고리즘이 무엇을 쓰나 */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300">
          알고리즘별 사용 기호
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="py-2 px-4 text-left font-semibold text-slate-500">알고리즘</th>
                <th className="py-2 px-4 text-center font-mono text-blue-600">g(n)</th>
                <th className="py-2 px-4 text-center font-mono text-rose-500">h(n)</th>
                <th className="py-2 px-4 text-center font-mono text-emerald-600">ĥ(n)</th>
                <th className="py-2 px-4 text-center font-mono text-indigo-600">f̂(n)</th>
                <th className="py-2 px-4 text-left font-semibold text-slate-500">정렬 기준</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "BFS / DFS", g: "—", h: "—", hh: "—", fh: "—", sort: "삽입 순서 (비용 무시)", cls: "bg-slate-50 dark:bg-slate-800/40" },
                { name: "균일비용 탐색 (UCS)", g: "✅", h: "—", hh: "—", fh: "—", sort: "g(n) 오름차순", cls: "" },
                { name: "언덕오르기", g: "—", h: "이론", hh: "✅", fh: "—", sort: "ĥ(n) 오름차순", cls: "bg-slate-50 dark:bg-slate-800/40" },
                { name: "A* 알고리즘", g: "✅", h: "이론", hh: "✅", fh: "✅", sort: "f̂(n) 오름차순", cls: "bg-indigo-50/50 dark:bg-indigo-950/20" },
              ].map((row) => (
                <tr key={row.name} className={`border-b border-slate-100 dark:border-slate-800 ${row.cls}`}>
                  <td className="py-2 px-4 font-medium text-slate-700 dark:text-slate-300">{row.name}</td>
                  <td className="py-2 px-4 text-center">{row.g}</td>
                  <td className="py-2 px-4 text-center text-slate-400">{row.h}</td>
                  <td className="py-2 px-4 text-center">{row.hh}</td>
                  <td className="py-2 px-4 text-center">{row.fh}</td>
                  <td className="py-2 px-4 text-slate-600 dark:text-slate-400">{row.sort}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
          h(n) 이론 = 이론상 존재하나 탐색 전 계산 불가 / ✅ = 실제로 계산·사용
        </div>
      </div>
    </section>
  );
}
