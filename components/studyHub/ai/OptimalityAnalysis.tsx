"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

/**
 * 최적성 일반 조건 분석 (마 문항 대비)
 */

type Case = "ucs" | "astar-admissible" | "astar-violated";

const CASES: { key: Case; title: string; ok: boolean; body: string[] }[] = [
  {
    key: "ucs",
    title: "UCS — 비용 c(n,n') ≥ 0 이면 최적",
    ok: true,
    body: [
      "UCS는 경로비용 g가 작은 노드부터 확장함.",
      "모든 엣지 비용이 음수가 아니면 OPEN의 최소 g는 시간이 지나도 감소하지 않음.",
      "따라서 목표 노드가 꺼내지는 순간의 g는 해당 목표까지의 최단 비용이 보장됨.",
      "반대로 음수 비용이 존재하면, 이미 CLOSED에 들어간 노드도 재평가해야 해서 UCS는 최적성을 잃음.",
    ],
  },
  {
    key: "astar-admissible",
    title: "A* — 허용적 h 이면 tree-search 최적",
    ok: true,
    body: [
      "h(n) ≤ h*(n) 이므로 f(n) = g(n) + h(n) ≤ g(n) + h*(n) = 해당 경로의 실제 총 비용.",
      "최적 경로 위의 어떤 부분 노드 n*도 f(n*) ≤ C* (최적 총 비용) 를 만족.",
      "따라서 A*가 f값이 C* 이상인 어떤 suboptimal 목표를 꺼내기 전에, 반드시 C* 이하의 f를 가진 n* 가 먼저 꺼내짐 → 결국 최적 경로 복원 가능.",
      "Graph-search(CLOSED) 에서는 여기에 더해 일관성(consistency)이 있어야 재확장 없이 최적 보장.",
    ],
  },
  {
    key: "astar-violated",
    title: "A* — 허용성 위반 시 최적성 붕괴 가능",
    ok: false,
    body: [
      "어떤 노드에서 h 가 실제보다 크면, 최적 경로 위의 그 노드의 f 값이 부풀려짐.",
      "그 결과 실제로는 더 긴 경로였던 대안이 먼저 OPEN 큐에서 꺼내져 목표에 도달하게 됨.",
      "UCS와 달리 A*는 이런 잘못된 h에 대한 안전장치를 알고리즘 자체로 가지고 있지 않음.",
      "과제에서 주어진 h가 허용적인지 검토하는 것이 마 문항 답변의 핵심.",
    ],
  },
];

// 간단 반례 그래프 시각화용 — 허용성 위반 예
// S→A (비용 1), S→B (비용 2), A→G (비용 10), B→G (비용 1)
// 진짜 최적: S→B→G = 3
// 허용적이지 않은 h: h(A)=0, h(B)=5, h(G)=0 → f(S.A)=1, f(S.B)=7
// A*가 A를 먼저 확장하여 S→A→G=11 반환 (틀린 해)
export default function OptimalityAnalysis() {
  const [active, setActive] = useState<Case>("astar-admissible");
  const [showCounter, setShowCounter] = useState(false);

  const cur = CASES.find((c) => c.key === active)!;

  return (
    <section>
      <SectionTitle
        title="최적 경로 탐색 가능성 일반론"
        subtitle="(마) 문항 대비 — 각 알고리즘의 최적성 조건 정리"
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {CASES.map((c) => (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              active === c.key
                ? c.ok
                  ? "bg-indigo-500 text-white shadow"
                  : "bg-amber-500 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            {c.ok ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
            {c.title}
          </button>
        ))}
      </div>

      <motion.div
        key={active}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl border p-5 ${
          cur.ok
            ? "border-indigo-200 bg-indigo-50 dark:border-indigo-900/40 dark:bg-indigo-950/20"
            : "border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20"
        }`}
      >
        <div
          className={`mb-3 text-sm font-bold ${
            cur.ok ? "text-indigo-700 dark:text-indigo-300" : "text-amber-700 dark:text-amber-300"
          }`}
        >
          {cur.title}
        </div>
        <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
          {cur.body.map((b, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <button
          onClick={() => setShowCounter((s) => !s)}
          className="flex items-center gap-2 text-xs font-bold text-indigo-600"
        >
          <ShieldAlert size={14} />
          {showCounter ? "반례 그래프 접기" : "반례: 허용성 위반으로 A*가 최적을 놓치는 예"}
        </button>
        {showCounter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3"
          >
            <svg viewBox="0 0 420 200" className="w-full">
              <line x1={70} y1={100} x2={200} y2={50} stroke="#94a3b8" strokeWidth={2} />
              <line x1={70} y1={100} x2={200} y2={150} stroke="#94a3b8" strokeWidth={2} />
              <line x1={200} y1={50} x2={340} y2={100} stroke="#94a3b8" strokeWidth={2} />
              <line x1={200} y1={150} x2={340} y2={100} stroke="#94a3b8" strokeWidth={2} />
              <text x={130} y={68} fontSize={11} fill="#6366f1" fontWeight={600}>1</text>
              <text x={130} y={140} fontSize={11} fill="#6366f1" fontWeight={600}>2</text>
              <text x={275} y={68} fontSize={11} fill="#6366f1" fontWeight={600}>10</text>
              <text x={275} y={140} fontSize={11} fill="#6366f1" fontWeight={600}>1</text>
              <Node cx={70} cy={100} label="S" sub="h=?" />
              <Node cx={200} cy={50} label="A" sub="h=0" />
              <Node cx={200} cy={150} label="B" sub="h=5" />
              <Node cx={340} cy={100} label="G" sub="h=0" />
            </svg>
            <div className="mt-2 rounded bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
              <b>분석:</b> 진짜 최적은 S→B→G = 3 인데 h(B)=5가 실제 잔여 비용 1을 과대평가 (허용성 위반).
              <br />
              f(S·A) = 1+0 = 1, f(S·B) = 2+5 = 7 → A*는 A쪽으로 먼저 전개. 결과적으로 S→A→G = 11 이라는 {" "}
              <b>suboptimal 해를 반환</b>할 수 있음. UCS는 같은 그래프에서 여전히 3을 찾음.
            </div>
          </motion.div>
        )}
      </div>

      {/* 허용성 경계 탐색: 슬라이더로 분모 속도 조절 */}
      <AdmissibilitySlider />

      <div className="mt-4 rounded-lg border-l-4 border-indigo-500 bg-indigo-50 p-3 text-xs text-gray-700 dark:bg-indigo-950/30 dark:text-gray-300">
        <b>(마) 문항 답안 포인트:</b> 주어진 h의 <b>허용성</b>(그리고 가능하면 <b>일관성</b>)을 직접 검증하는
        것이 핵심. 거리 기준 h는 보통 직선거리로 자연스럽게 허용적이며, 시간 기준 h는 분모의 속도가{" "}
        최대 속도 이상이어야 허용적임을 논증할 것.
      </div>
    </section>
  );
}

/* 허용성 경계 슬라이더 — v_max와 h 분모의 관계를 시각적으로 */
function AdmissibilitySlider() {
  const [vDivisor, setVDivisor] = useState(20); // h(n) = d_straight / v
  // 가공 시나리오: 직선거리 2km, 실제 도로 최단 시간은 '최대 시속 v_real 기준'
  const straight = 2; // km
  const vRealMax = 30; // 그래프 내 최대 시속 (가공)
  const actualMin = straight / vRealMax; // 가장 낙관적 실제 시간
  const hVal = straight / vDivisor;
  const admissible = hVal <= actualMin + 1e-9;

  return (
    <div className="mt-4 rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-900/40 dark:bg-gray-900">
      <div className="mb-2 text-sm font-bold text-indigo-700 dark:text-indigo-300">
        허용성 경계 탐색 — 시간 휴리스틱의 분모 속도 조절
      </div>
      <p className="mb-3 text-xs text-gray-600 dark:text-gray-400">
        가공 시나리오: 어떤 노드 x와 목표 사이 직선거리가{" "}
        <b>{straight}km</b>이고, 이 구간을 지나는 가장 빠른 도로의 평균 시속은{" "}
        <b>{vRealMax}km/h</b>입니다. h 정의에 쓸 분모 속도(v)를 조정해
        허용성이 유지되는/깨지는 구간을 관찰해 보세요.
      </p>
      <div className="mb-3 flex items-center gap-3">
        <label className="text-[11px] text-gray-500">v (km/h):</label>
        <input
          type="range"
          min={5}
          max={60}
          step={1}
          value={vDivisor}
          onChange={(e) => setVDivisor(Number(e.target.value))}
          className="flex-1 accent-indigo-500"
        />
        <span className="w-12 text-center font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300">
          {vDivisor}
        </span>
      </div>
      <div className="grid gap-2 text-[11px] sm:grid-cols-3">
        <div className="rounded-lg bg-indigo-50 p-2 dark:bg-indigo-950/30">
          <div className="text-gray-500">h(x) = {straight}/{vDivisor}</div>
          <div className="font-mono font-bold text-indigo-700 dark:text-indigo-300">
            {hVal.toFixed(4)} h
          </div>
        </div>
        <div className="rounded-lg bg-indigo-50 p-2 dark:bg-indigo-950/30">
          <div className="text-gray-500">
            실제 최소 시간 ≥ {straight}/{vRealMax}
          </div>
          <div className="font-mono font-bold text-indigo-700 dark:text-indigo-300">
            {actualMin.toFixed(4)} h
          </div>
        </div>
        <div
          className={`rounded-lg p-2 text-center font-bold ${
            admissible
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
              : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300"
          }`}
        >
          {admissible
            ? "허용적 (h ≤ 실제)"
            : "허용성 위반 (h > 실제)"}
        </div>
      </div>
      <div className="mt-3 text-[11px] text-gray-600 dark:text-gray-400">
        <b>관찰:</b> v &lt; {vRealMax}일 때 h는 {straight}/v &gt; {straight}/{vRealMax}가
        되어 실제 시간보다 더 큰 값을 예측(과대추정). v ≥ {vRealMax}여야
        일반적으로 허용성 유지. 이것이 바로 <b>v_max 이상의 분모를 써야 하는
        이유</b>.
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 text-[11px]">
        <div className="rounded-lg bg-indigo-50/60 p-2 dark:bg-indigo-950/20">
          <b>직선거리/15 (느린 분모):</b> 분모가 실제 최대 시속(30km/h)보다
          작아 과대추정 위험.
        </div>
        <div className="rounded-lg bg-indigo-50/60 p-2 dark:bg-indigo-950/20">
          <b>직선거리/30 (v_max 분모):</b> 어떤 경로도 이보다 더 빠를 수 없으므로
          항상 허용적.
        </div>
      </div>
    </div>
  );
}

function Node({
  cx,
  cy,
  label,
  sub,
}: {
  cx: number;
  cy: number;
  label: string;
  sub: string;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={22} fill="#eef2ff" stroke="#4338ca" strokeWidth={2} />
      <text x={cx} y={cy - 1} textAnchor="middle" fontSize={13} fontWeight={700} fill="#1e1b4b">
        {label}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize={8} fill="#1e1b4b">
        {sub}
      </text>
    </g>
  );
}
