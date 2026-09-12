"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { MousePointerClick } from "lucide-react";

/* ---------- 고정 학습 데이터 ---------- */

type Pt = { x: number; y: number; c: 0 | 1 };

const TRAIN: Pt[] = [
  { x: 1.0, y: 1.2, c: 0 },
  { x: 1.8, y: 0.9, c: 0 },
  { x: 1.3, y: 2.1, c: 0 },
  { x: 2.2, y: 1.7, c: 0 },
  { x: 0.9, y: 2.6, c: 0 },
  { x: 2.6, y: 2.5, c: 0 },
  { x: 1.7, y: 3.2, c: 0 },
  { x: 2.9, y: 1.3, c: 0 },
  { x: 2.4, y: 3.4, c: 0 },
  { x: 3.1, y: 2.6, c: 0 },
  { x: 0.6, y: 1.7, c: 0 },
  { x: 3.4, y: 3.6, c: 0 },
  { x: 4.6, y: 3.4, c: 0 },
  { x: 2.0, y: 4.2, c: 0 },
  { x: 4.3, y: 4.4, c: 1 },
  { x: 4.5, y: 3.8, c: 1 },
  { x: 3.7, y: 4.5, c: 1 },
  { x: 5.4, y: 5.2, c: 1 },
  { x: 6.1, y: 4.8, c: 1 },
  { x: 5.0, y: 6.2, c: 1 },
  { x: 6.8, y: 6.0, c: 1 },
  { x: 5.9, y: 6.9, c: 1 },
  { x: 7.1, y: 5.1, c: 1 },
  { x: 6.3, y: 7.2, c: 1 },
  { x: 4.9, y: 5.5, c: 1 },
  { x: 7.4, y: 6.4, c: 1 },
  { x: 5.6, y: 4.1, c: 1 },
];

/**
 * K값 미리보기용 대규모 데이터 — 결정론적 생성기라 서버·클라이언트 결과가 동일.
 *
 * 두 클래스를 겹치게 두고, 상대 클래스 영역 안에 소수의 데이터를 섞어 둔다.
 * 이 섞인 데이터가 K = 1에서 작은 섬 모양의 결정영역을 만들어 과다적합을 드러내고,
 * K가 커지면 사라진다. 클래스 개수를 C₁ 60개 / C₂ 48개로 다르게 두었으므로
 * K가 전체 데이터 수에 가까워지면 비율이 큰 C₁ 쪽으로 전체가 쏠린다.
 */
const BIG: Pt[] = (() => {
  let seed = 20250101;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const gauss = () => {
    const u = Math.max(rnd(), 1e-6);
    const v = rnd();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const clamp = (v: number) => Math.min(7.9, Math.max(0.1, v));
  const C1 = { cx: 2.6, cy: 2.8 };
  const C2 = { cx: 5.6, cy: 5.4 };
  const SD = 1.15;
  const pts: Pt[] = [];
  const add = (ctr: { cx: number; cy: number }, c: 0 | 1, n: number, spread: number) => {
    for (let i = 0; i < n; i++) {
      pts.push({ x: clamp(ctr.cx + gauss() * spread), y: clamp(ctr.cy + gauss() * spread), c });
    }
  };
  add(C1, 0, 52, SD);
  add(C2, 1, 38, SD);
  add(C2, 0, 8, SD * 0.7); // 상대 영역에 섞인 C₁ 데이터
  add(C1, 1, 10, SD * 0.7); // 상대 영역에 섞인 C₂ 데이터
  return pts;
})();

const BIG_C1 = BIG.filter((p) => p.c === 0).length;

/* ---------- 거리 함수 (직접 구현) ---------- */

type MetricKey = "l2" | "l1" | "lp" | "dot" | "cos" | "nl2" | "maha";

const metrics: { key: MetricKey; name: string; note: string }[] = [
  { key: "l2", name: "2차 노름 (유클리디안 거리)", note: "√(Σ(xⱼ − xᵢⱼ)²) — 가장 기본이 되는 거리"},
  { key: "l1", name: "1차 노름 (Manhattan distance)", note: "Σ|xⱼ − xᵢⱼ| — 축 방향 이동 거리의 합"},
  { key: "lp", name: "p차 노름", note: "(Σ|xⱼ − xᵢⱼ|ᵖ)^(1/p) — p = 1이면 1차 노름, p = 2이면 2차 노름"},
  { key: "dot", name: "내적", note: "x · xᵢ — 값이 클수록 가까운 것으로 간주하여 순위를 매김"},
  { key: "cos", name: "코사인 거리", note: "1 − (x · xᵢ)/(‖x‖‖xᵢ‖) — 크기를 무시하고 방향만 비교"},
  {
    key: "nl2",
    name: "정규화된 유클리디안 거리",
    note: "요소별로 표준편차 값으로 나누어 준 후 유클리디안 거리를 계산",
  },
  {
    key: "maha",
    name: "마할라노비스 거리",
    note: "√((x − xᵢ)ᵀΣ⁻¹(x − xᵢ)) — 데이터 분포의 공분산을 반영한 거리",
  },
];

function stats(data: Pt[]) {
  const n = data.length;
  const mx = data.reduce((s, p) => s + p.x, 0) / n;
  const my = data.reduce((s, p) => s + p.y, 0) / n;
  let vxx = 0;
  let vyy = 0;
  let vxy = 0;
  data.forEach((p) => {
    vxx += (p.x - mx) ** 2;
    vyy += (p.y - my) ** 2;
    vxy += (p.x - mx) * (p.y - my);
  });
  vxx /= n;
  vyy /= n;
  vxy /= n;
  return { sdx: Math.sqrt(vxx), sdy: Math.sqrt(vyy), vxx, vyy, vxy };
}

function distance(
  metric: MetricKey,
  p: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  st: ReturnType<typeof stats>
): number {
  const dx = ax - bx;
  const dy = ay - by;
  switch (metric) {
    case "l2":
      return Math.sqrt(dx * dx + dy * dy);
    case "l1":
      return Math.abs(dx) + Math.abs(dy);
    case "lp":
      return (Math.abs(dx) ** p + Math.abs(dy) ** p) ** (1 / p);
    case "dot":
      return -(ax * bx + ay * by);
    case "cos": {
      const na = Math.hypot(ax, ay);
      const nb = Math.hypot(bx, by);
      if (na < 1e-9 || nb < 1e-9) return 1;
      return 1 - (ax * bx + ay * by) / (na * nb);
    }
    case "nl2":
      return Math.sqrt((dx / st.sdx) ** 2 + (dy / st.sdy) ** 2);
    case "maha": {
      const det = st.vxx * st.vyy - st.vxy * st.vxy;
      if (Math.abs(det) < 1e-9) return Math.sqrt(dx * dx + dy * dy);
      const ix = (st.vyy * dx - st.vxy * dy) / det;
      const iy = (-st.vxy * dx + st.vxx * dy) / det;
      return Math.sqrt(Math.max(0, dx * ix + dy * iy));
    }
  }
}

/* ---------- 캔버스 ---------- */

const D_MAX = 8;
const S = 340;
const COLOR1 = "#8b5cf6";
const COLOR2 = "#d946ef";

const nnSteps = [
  "주어진 데이터 x와 모든 학습 데이터 x₁, x₂, ⋯, x_N 과의 거리를 계산한다.",
  "거리가 가장 가까운 데이터를 찾아 x_min 으로 둔다. x_min = argmin_{xᵢ∈X} d(x, xᵢ)",
  "x_min이 속하는 클래스에 할당한다. 즉, y(x_min)과 같은 값을 가지도록 y(x)를 결정한다.",
];

const knnSteps = [
  "주어진 데이터 x와 모든 학습 데이터 x₁, x₂, ⋯, x_N 과의 거리를 계산한다.",
  "거리가 가장 가까운 것부터 순서대로 K개의 데이터를 찾아 후보집합 N(x) = {x₁, x₂, ⋯, x_K}를 만든다.",
  "후보집합의 각 원소가 어떤 클래스에 속하는지 그 레이블값 y(x₁), y(x₂), ⋯, y(x_K)을 찾는다.",
  "찾아진 레이블값 중 가장 많은 빈도수를 차지하는 클래스를 찾아 x를 그 클래스에 할당한다.",
];

const PREVIEW_KS = [1, 5, 20, 100];
const PREVIEW_GRID = 26;

export default function KNNSimulator() {
  const [k, setK] = useState(5);
  const [metric, setMetric] = useState<MetricKey>("l2");
  const [pNorm, setPNorm] = useState(3);
  const [query, setQuery] = useState({ x: 4.0, y: 4.0 });
  const [step, setStep] = useState(3);
  const svgRef = useRef<SVGSVGElement>(null);

  const st = useMemo(() => stats(TRAIN), []);

  const ranked = useMemo(() => {
    return TRAIN.map((t, i) => ({
      ...t,
      i,
      d: distance(metric, pNorm, query.x, query.y, t.x, t.y, st),
    })).sort((a, b) => a.d - b.d);
  }, [metric, pNorm, query, st]);

  const neighbors = ranked.slice(0, Math.min(k, TRAIN.length));
  const k1 = neighbors.filter((n) => n.c === 0).length;
  const k2 = neighbors.length - k1;
  const verdict: 0 | 1 = k1 >= k2 ? 0 : 1;

  /** K값에 따른 결정경계 미리보기 */
  const previews = useMemo(() => {
    const bst = stats(BIG);
    const cell = D_MAX / PREVIEW_GRID;
    return PREVIEW_KS.map((kk) => {
      const runs: { row: number; from: number; to: number; cls: number }[] = [];
      for (let r = 0; r < PREVIEW_GRID; r++) {
        const yv = (r + 0.5) * cell;
        let start = 0;
        let cur = -1;
        for (let c = 0; c < PREVIEW_GRID; c++) {
          const xv = (c + 0.5) * cell;
          const ds = BIG.map((t, i) => ({
            d: distance("l2", 2, xv, yv, t.x, t.y, bst),
            c: t.c,
            i,
          })).sort((a, b) => a.d - b.d);
          const take = ds.slice(0, Math.min(kk, BIG.length));
          const v1 = take.filter((t) => t.c === 0).length;
          const cls = v1 >= take.length - v1 ? 0 : 1;
          if (c === 0) {
            cur = cls;
            start = 0;
          } else if (cls !== cur) {
            runs.push({ row: r, from: start, to: c, cls: cur });
            cur = cls;
            start = c;
          }
        }
        runs.push({ row: r, from: start, to: PREVIEW_GRID, cls: cur });
      }
      return { k: kk, runs };
    });
  }, []);

  const sc = (v: number) => (v / D_MAX) * S;
  const scY = (v: number) => S - sc(v);

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width) * D_MAX;
    const ny = D_MAX - ((e.clientY - rect.top) / rect.height) * D_MAX;
    setQuery({
      x: Math.min(D_MAX, Math.max(0, Number(nx.toFixed(2)))),
      y: Math.min(D_MAX, Math.max(0, Number(ny.toFixed(2)))),
    });
  };

  const applyPreset = () => {
    setK(5);
    setMetric("l2");
    setQuery({ x: 4.0, y: 4.0 });
    setStep(3);
  };

  const activeMetric = metrics.find((m) => m.key === metric) ?? metrics[0];

  return (
    <section>
      <SectionTitle
        title="K-최근접이웃(K-NN) 분류기"
        subtitle="학습 데이터와의 거리를 기반으로 분류하는 데이터 기반 방법"
      />

      {/* 최근접이웃 분류기 (K=1) */}
      <h3 className="mb-2 text-base font-bold">최근접이웃 분류기 — K-NN에서 K = 1인 경우</h3>
      <div className="mb-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          클래스와 상관없이 모든 데이터 중에서 가장 작은 거리값을 갖는 데이터의 클래스로 할당.
        </p>
        <div className="mt-3 space-y-1 rounded-lg bg-gray-50 p-3 font-mono text-xs dark:bg-gray-800">
          <p>x_min = argmin_{"{xᵢ∈X}"} d(x, xᵢ)</p>
          <p>y(x) = y(x_min)</p>
        </div>
        <ol className="mt-3 space-y-1.5">
          {nnSteps.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-bold text-violet-500">{i + 1}.</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mb-10 rounded-xl border-l-4 border-fuchsia-400 bg-fuchsia-50 p-4 dark:bg-fuchsia-950">
        <p className="text-sm font-bold">최근접이웃 분류기의 문제점 — 과다적합</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-white p-3 dark:bg-gray-900">
            <p className="text-xs text-gray-500">베이즈 분류기</p>
            <p className="mt-1 text-2xl font-bold text-violet-600 dark:text-violet-400">6.5%</p>
            <p className="mt-1 text-[11px] text-gray-400">테스트 데이터에 대한 오차</p>
          </div>
          <div className="rounded-lg bg-white p-3 dark:bg-gray-900">
            <p className="text-xs text-gray-500">최근접이웃 분류기</p>
            <p className="mt-1 text-2xl font-bold text-fuchsia-600 dark:text-fuchsia-400">13.5%</p>
            <p className="mt-1 text-[11px] text-gray-400">테스트 데이터에 대한 오차</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
          학습 데이터에 지나치게 맞춘 복잡한 결정경계가 만들어져 과다적합이 발생하고, 테스트 데이터에서는 오히려 오차가 커짐. 이 문제를 완화하려고 이웃을 K개로 늘린 것이 K-최근접이웃 분류기.
        </p>
      </div>

      {/* 시뮬레이터 */}
      <h3 className="mb-2 text-base font-bold">K-NN 시뮬레이터</h3>
      <p className="mb-3 flex items-center gap-1.5 text-sm text-gray-500">
        <MousePointerClick size={14} />
        캔버스를 눌러 새 데이터 x의 위치를 정하고, K값과 거리 함수를 바꿔볼 것.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
        <div className="rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${S} ${S}`}
            className="w-full cursor-crosshair"
            onClick={handleClick}
            role="img"
          >
            <rect x="0" y="0" width={S} height={S} fill="transparent" />
            {[0, 2, 4, 6, 8].map((t) => (
              <g key={t}>
                <line x1={sc(t)} y1={0} x2={sc(t)} y2={S} stroke="#9ca3af" strokeWidth="0.4" opacity={0.35} />
                <line x1={0} y1={scY(t)} x2={S} y2={scY(t)} stroke="#9ca3af" strokeWidth="0.4" opacity={0.35} />
                <text x={Math.min(sc(t) + 3, S - 9)} y={S - 3} fontSize="9" fill="#9ca3af">
                  {t}
                </text>
              </g>
            ))}

            {/* 후보집합 연결선 */}
            {step >= 2 &&
              neighbors.map((n) => (
                <line
                  key={`ln-${n.i}`}
                  x1={sc(query.x)}
                  y1={scY(query.y)}
                  x2={sc(n.x)}
                  y2={scY(n.y)}
                  stroke={n.c === 0 ? COLOR1 : COLOR2}
                  strokeWidth="1.2"
                  strokeDasharray="3 2"
                  opacity={0.75}
                />
              ))}

            {/* 학습 데이터 */}
            {TRAIN.map((t, i) => {
              const inSet = step >= 2 && neighbors.some((n) => n.i === i);
              return (
                <circle
                  key={i}
                  cx={sc(t.x)}
                  cy={scY(t.y)}
                  r={inSet ? 7 : 5}
                  fill={t.c === 0 ? COLOR1 : COLOR2}
                  opacity={step >= 2 && !inSet ? 0.3 : 0.95}
                  stroke={inSet ? "#111827" : "none"}
                  strokeWidth={inSet ? 1.5 : 0}
                />
              );
            })}

            {/* 새 데이터 x */}
            <g>
              <circle
                cx={sc(query.x)}
                cy={scY(query.y)}
                r="9"
                fill="none"
                stroke={step >= 4 ? (verdict === 0 ? COLOR1 : COLOR2) : "#111827"}
                strokeWidth="2"
                className={step >= 4 ? "" : "dark:stroke-gray-100"}
              />
              <circle cx={sc(query.x)} cy={scY(query.y)} r="3" fill="#111827" className="dark:fill-gray-100" />
              <text
                x={sc(query.x) + 12}
                y={scY(query.y) - 8}
                fontSize="12"
                fontWeight="bold"
                fill="#111827"
                className="dark:fill-gray-100"
              >
                x
              </text>
            </g>
          </svg>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-medium">K값</label>
              <span className="font-mono text-sm text-violet-600 dark:text-violet-400">{k}</span>
            </div>
            <input
              type="range"
              min={1}
              max={TRAIN.length}
              step={1}
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
              className="mt-2 w-full accent-violet-500"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[1, 3, 5, 20].map((v) => (
                <button
                  key={v}
                  onClick={() => setK(v)}
                  className={`rounded px-2 py-1 text-xs ${
                    k === v
                      ? "bg-violet-500 text-white"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  K={v}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
            <label className="text-sm font-medium">거리 함수</label>
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value as MetricKey)}
              className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs dark:border-gray-700 dark:bg-gray-900"
            >
              {metrics.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.name}
                </option>
              ))}
            </select>
            <p className="mt-2 text-[11px] text-gray-500">{activeMetric.note}</p>
            {metric === "lp" && (
              <div className="mt-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs">p</span>
                  <span className="font-mono text-xs text-gray-500">{pNorm}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={6}
                  step={1}
                  value={pNorm}
                  onChange={(e) => setPNorm(Number(e.target.value))}
                  className="mt-1 w-full accent-violet-500"
                />
              </div>
            )}
          </div>

          <button
            onClick={applyPreset}
            className="w-full rounded-xl bg-violet-500 px-3 py-2 text-xs font-medium text-white hover:bg-violet-600"
          >
            강의록 예 재현 — K = 5, K₁ = 2, K₂ = 3 → C₂
          </button>

          <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 dark:border-violet-800 dark:bg-violet-950">
            <p className="text-xs font-medium text-gray-500">후보집합 N(x)의 투표</p>
            <div className="mt-2 space-y-2">
              <VoteBar label="K₁(x) — C₁" value={k1} total={neighbors.length} color="bg-violet-500" />
              <VoteBar label="K₂(x) — C₂" value={k2} total={neighbors.length} color="bg-fuchsia-500" />
            </div>
            <p className="mt-3 font-mono text-[11px] text-gray-500">
              y(x) = argmax{"{"}K₁(x), K₂(x){"}"}
            </p>
            {k1 === k2 && (
              <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400">
                K₁ = K₂ 인 동점 — 최빈 클래스가 하나로 정해지지 않음. 이 시뮬레이터는 동점일 때 C₁로 정하도록 두었으며, 실제로는 K를 홀수로 잡아 동점을 피함.
              </p>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={verdict}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-2"
              >
                <span
                  className={`inline-block rounded-full px-3 py-1 text-sm font-bold text-white ${
                    verdict === 0 ? "bg-violet-500" : "bg-fuchsia-500"
                  }`}
                >
                  x ∈ {verdict === 0 ? "C₁" : "C₂"}
                </span>
              </motion.div>
            </AnimatePresence>
            <p className="mt-2 text-[11px] text-gray-400">
              x = ({query.x.toFixed(2)}, {query.y.toFixed(2)})
            </p>
          </div>
        </div>
      </div>

      {/* 수행 단계 */}
      <h3 className="mb-2 mt-8 text-base font-bold">K-최근접이웃 분류기의 수행 단계</h3>
      <div className="mb-3 flex flex-wrap gap-2">
        {knnSteps.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i + 1)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              step === i + 1
                ? "bg-violet-500 text-white"
                : step > i + 1
                  ? "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            단계 {i + 1}
          </button>
        ))}
      </div>
      <div className="mb-4 space-y-2">
        {knnSteps.map((s, i) => (
          <div
            key={i}
            className={`rounded-xl border p-3 text-sm transition-colors ${
              step === i + 1
                ? "border-violet-300 bg-violet-50 dark:border-violet-700 dark:bg-violet-950"
                : "border-gray-200 dark:border-gray-800"
            }`}
          >
            <span className="mr-2 font-bold text-violet-500">{i + 1}.</span>
            <span className={step >= i + 1 ? "" : "text-gray-400"}>{s}</span>
          </div>
        ))}
      </div>
      {step >= 3 && (
        <div className="mb-10 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table className="w-full min-w-[420px] text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-3 py-2">순위</th>
                <th className="px-3 py-2">학습 데이터 xᵢ</th>
                <th className="px-3 py-2">
                  {metric === "dot" ? "순위값 −(x · xᵢ)" : "거리 d(x, xᵢ)"}
                </th>
                <th className="px-3 py-2">레이블 y(xᵢ)</th>
              </tr>
            </thead>
            <tbody>
              {neighbors.map((n, i) => (
                <tr key={n.i} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-3 py-1.5">{i + 1}</td>
                  <td className="px-3 py-1.5 font-mono">
                    ({n.x.toFixed(1)}, {n.y.toFixed(1)})
                  </td>
                  <td className="px-3 py-1.5 font-mono">{n.d.toFixed(3)}</td>
                  <td className="px-3 py-1.5">
                    <span
                      className={`rounded px-2 py-0.5 font-bold text-white ${
                        n.c === 0 ? "bg-violet-500" : "bg-fuchsia-500"
                      }`}
                    >
                      {n.c === 0 ? "C₁" : "C₂"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 설계 고려사항 */}
      <h3 className="mb-2 text-base font-bold">K-최근접이웃 분류기의 설계 고려사항</h3>
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
          <p className="text-sm font-bold text-violet-600 dark:text-violet-400">⑴ 적절한 K값의 결정</p>
          <ul className="mt-2 space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
            <li>· K = 1 → 바로 이웃한 데이터에만 의존하여 클래스가 결정 → 노이즈에 민감, 과다적합 발생.</li>
            <li>
              · K ≫ 1 → 주어진 데이터 주변 영역이 아닌 전체 데이터 영역에서 각 클래스가 차지하는 비율(사전확률)에 의존.
            </li>
            <li>
              · 주어진 문제(학습 데이터)에 의존적 — 실용적으로는 학습 데이터에 대한 분류를 통해 가장 좋은 성능을 주는 값의 선택도 가능.
            </li>
          </ul>
        </div>
        <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
          <p className="text-sm font-bold text-violet-600 dark:text-violet-400">
            ⑵ 거리 함수 — 주어진 데이터와 학습 데이터 간의 거리 계산 방법
          </p>
          <ul className="mt-2 space-y-1">
            {metrics.map((m) => (
              <li key={m.key} className="text-xs">
                <span className="font-medium">{m.name}</span>
                <span className="text-gray-500"> — {m.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mb-3 text-sm font-medium">K값에 따른 결정경계의 변화</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {previews.map((pv) => (
          <div key={pv.k} className="rounded-xl border border-gray-200 p-2 dark:border-gray-800">
            <svg viewBox="0 0 100 100" className="w-full">
              {pv.runs.map((run, i) => (
                <rect
                  key={i}
                  x={(run.from / PREVIEW_GRID) * 100}
                  y={100 - ((run.row + 1) / PREVIEW_GRID) * 100}
                  width={((run.to - run.from) / PREVIEW_GRID) * 100}
                  height={100 / PREVIEW_GRID + 0.3}
                  fill={run.cls === 0 ? COLOR1 : COLOR2}
                  opacity={0.22}
                />
              ))}
              {BIG.map((t, i) => (
                <circle
                  key={i}
                  cx={(t.x / D_MAX) * 100}
                  cy={100 - (t.y / D_MAX) * 100}
                  r="1.3"
                  fill={t.c === 0 ? COLOR1 : COLOR2}
                />
              ))}
            </svg>
            <p className="mt-1 text-center text-xs font-medium">K = {pv.k}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-500">
        K가 작으면 경계가 잘게 흔들리고(과다적합), K가 커지면 경계가 단순해지다가 결국 전체 데이터에서 각 클래스가 차지하는 비율 쪽으로 쏠림. 위 데이터는 전체 {BIG.length}개 중 C₁이 {BIG_C1}개로 더 많아, K = 100에서는 전체 영역이 C₁ 한 클래스로 덮임 — 이때는 주변 이웃이 아니라 사전확률이 결과를 정한 것. K가 학습 데이터 수 {BIG.length}개를 넘으면 이웃을 더 고를 수 없으므로 전체 데이터로 잘라서 계산.
      </p>
    </section>
  );
}

function VoteBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-[11px]">
        <span className="font-mono">{label}</span>
        <span className="font-mono font-bold">{value}</span>
      </div>
      <div className="mt-1 h-3 overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
        <motion.div className={`h-full ${color}`} animate={{ width: `${pct}%` }} transition={{ duration: 0.2 }} />
      </div>
    </div>
  );
}
