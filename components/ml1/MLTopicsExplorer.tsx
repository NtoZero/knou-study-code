"use client";

import { useMemo, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { ArrowRight, Check, X } from "lucide-react";

/* ── 결정론적 데이터 생성 ──────────────────────────────── */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussPair(rand: () => number): [number, number] {
  const u1 = Math.max(rand(), 1e-9);
  const u2 = rand();
  const r = Math.sqrt(-2 * Math.log(u1));
  return [r * Math.cos(2 * Math.PI * u2), r * Math.sin(2 * Math.PI * u2)];
}

/* 분류용 2차원 데이터 — C1은 x2 > x1 쪽, C2는 반대쪽 */
interface LabeledPoint {
  x1: number;
  x2: number;
  y: 0 | 1; // 1 → C1, 0 → C2
}

const classifyData: LabeledPoint[] = (() => {
  const rand = mulberry32(31337);
  const pts: LabeledPoint[] = [];
  for (let i = 0; i < 34; i++) {
    const [a, b] = gaussPair(rand);
    pts.push({ x1: -1.0 + a * 0.95, x2: 1.0 + b * 0.95, y: 1 });
  }
  for (let i = 0; i < 34; i++) {
    const [a, b] = gaussPair(rand);
    pts.push({ x1: 1.0 + a * 0.95, x2: -1.0 + b * 0.95, y: 0 });
  }
  return pts;
})();

/* 회귀용 데이터 */
interface RegPoint {
  x: number;
  y: number;
}

const regressionData: RegPoint[] = (() => {
  const rand = mulberry32(90210);
  return Array.from({ length: 14 }, (_, i) => {
    const x = 0.6 + i * 0.65;
    const [n] = gaussPair(rand);
    return { x, y: 0.72 * x + 1.3 + n * 0.85 };
  });
})();

const leastSquares = (() => {
  const n = regressionData.length;
  const sx = regressionData.reduce((a, p) => a + p.x, 0);
  const sy = regressionData.reduce((a, p) => a + p.y, 0);
  const sxx = regressionData.reduce((a, p) => a + p.x * p.x, 0);
  const sxy = regressionData.reduce((a, p) => a + p.x * p.y, 0);
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const intercept = (sy - slope * sx) / n;
  return { slope, intercept };
})();

/* 군집화용 데이터 */
const clusterCenters: [number, number][] = [
  [-1.6, -1.0],
  [1.7, -1.2],
  [0.2, 1.8],
];

const clusterData: { x: number; y: number }[] = (() => {
  const rand = mulberry32(555111);
  const pts: { x: number; y: number }[] = [];
  clusterCenters.forEach(([cx, cy]) => {
    for (let i = 0; i < 28; i++) {
      const [a, b] = gaussPair(rand);
      pts.push({ x: cx + a * 0.55, y: cy + b * 0.55 });
    }
  });
  return pts;
})();

const badCentroids: [number, number][] = [
  [-0.35, 0.15],
  [0.35, -0.1],
  [0.0, 0.5],
];

/**
 * 클러스터 내의 분산을 실제로 최소로 만드는 대표 벡터.
 * 데이터를 만들 때 쓴 중심에서 출발해 K-평균 반복(소속 판정 → 평균 갱신)으로 수렴시킨 값이며,
 * 각 대표 벡터는 자기 클러스터에 속한 데이터의 평균과 일치한다.
 */
const bestCentroids: [number, number][] = (() => {
  let cent = clusterCenters.map((c) => [c[0], c[1]] as [number, number]);
  for (let iter = 0; iter < 60; iter++) {
    const acc = cent.map(() => [0, 0, 0]);
    clusterData.forEach((p) => {
      let best = 0;
      let bestD = Infinity;
      cent.forEach((c, i) => {
        const d = (p.x - c[0]) ** 2 + (p.y - c[1]) ** 2;
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      acc[best][0] += p.x;
      acc[best][1] += p.y;
      acc[best][2] += 1;
    });
    cent = cent.map((c, i) =>
      acc[i][2] === 0 ? c : ([acc[i][0] / acc[i][2], acc[i][1] / acc[i][2]] as [number, number])
    );
  }
  return cent;
})();

/** 전체 데이터의 분산 — 막대 눈금의 기준. 최적 군집에서 (내 분산 + 간 분산)과 같아진다 */
const clusterTotalVariance = (() => {
  const gx = clusterData.reduce((a, p) => a + p.x, 0) / clusterData.length;
  const gy = clusterData.reduce((a, p) => a + p.y, 0) / clusterData.length;
  return clusterData.reduce((a, p) => a + (p.x - gx) ** 2 + (p.y - gy) ** 2, 0) / clusterData.length;
})();

/* 특징추출용 3차원 데이터 — 두 덩어리가 x2 방향으로 떨어져 있음 */
interface Point3 {
  x1: number;
  x2: number;
  x3: number;
  g: 0 | 1;
}

const data3d: Point3[] = (() => {
  const rand = mulberry32(424242);
  const pts: Point3[] = [];
  for (let g = 0; g < 2; g++) {
    for (let i = 0; i < 45; i++) {
      const [a, b] = gaussPair(rand);
      const [c] = gaussPair(rand);
      pts.push({
        x1: a * 1.25,
        x2: (g === 0 ? -1.35 : 1.35) + b * 0.42,
        x3: c * 1.25,
        g: g as 0 | 1,
      });
    }
  }
  return pts;
})();

const planes = [
  { key: "12", label: "x1 · x2 평면", ax: "x1", ay: "x2" },
  { key: "23", label: "x2 · x3 평면", ax: "x2", ay: "x3" },
  { key: "13", label: "x1 · x3 평면", ax: "x1", ay: "x3" },
] as const;

type PlaneKey = (typeof planes)[number]["key"];

function projectTo(plane: PlaneKey, p: Point3): [number, number] {
  if (plane === "12") return [p.x1, p.x2];
  if (plane === "23") return [p.x2, p.x3];
  return [p.x1, p.x3];
}

/** 두 덩어리 중심 사이의 거리를 퍼짐으로 나눈 분리도 */
function separationScore(plane: PlaneKey): number {
  const groups: [number, number][][] = [[], []];
  data3d.forEach((p) => groups[p.g].push(projectTo(plane, p)));
  const mean = (g: [number, number][]) =>
    [g.reduce((a, v) => a + v[0], 0) / g.length, g.reduce((a, v) => a + v[1], 0) / g.length] as [
      number,
      number
    ];
  const m0 = mean(groups[0]);
  const m1 = mean(groups[1]);
  const spread = (g: [number, number][], m: [number, number]) =>
    Math.sqrt(g.reduce((a, v) => a + (v[0] - m[0]) ** 2 + (v[1] - m[1]) ** 2, 0) / g.length);
  const d = Math.hypot(m0[0] - m1[0], m0[1] - m1[1]);
  return d / ((spread(groups[0], m0) + spread(groups[1], m1)) / 2);
}

const planeScores: Record<PlaneKey, number> = {
  "12": separationScore("12"),
  "23": separationScore("23"),
  "13": separationScore("13"),
};

/* ── 판매 예측 차트 (2010~2018 과거 판매량 → 2019.8 예측) ── */

/** 2019년 8월 = 2019 + 7/12 */
const FORECAST_YEAR = 2019 + 7 / 12;
/** x축: 2010 → 40px, 1년당 25.2px (2019.8이 오른쪽 끝 안쪽에 오도록) */
const salesX = (year: number) => 40 + (year - 2010) * 25.2;
/** y축: 0 → 140px, 판매량 60 → 20px (1단위 = 2px) */
const salesY = (v: number) => 140 - v * 2;

const salesSeries = [
  {
    name: "상품A",
    color: "#0891b2",
    values: [22, 26, 29, 33, 37, 41, 45, 48, 51],
    forecast: 53,
  },
  {
    name: "상품B",
    color: "#f59e0b",
    values: [9, 10, 11, 11, 12, 13, 13, 14, 14],
    forecast: 15,
  },
];

/* ── 공통 입·출력 관계 도식 ────────────────────────────── */

function IORelation({
  dataset,
  result,
  goal,
  inference,
}: {
  dataset: ReactNode;
  result: ReactNode;
  goal: ReactNode;
  inference: ReactNode;
}) {
  return (
    <div className="mb-6 rounded-xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-900 dark:bg-cyan-950/40">
      <p className="mb-3 text-xs font-bold tracking-wide text-cyan-700 dark:text-cyan-300">
        입·출력 관계
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div className="rounded-lg bg-white p-3 dark:bg-gray-900">
          <p className="text-[11px] font-semibold text-gray-500">학습 데이터 구성</p>
          <div className="mt-1 text-sm text-gray-800 dark:text-gray-100">{dataset}</div>
        </div>
        <div className="flex items-center justify-center">
          <ArrowRight size={16} className="rotate-90 text-cyan-500 md:rotate-0" />
        </div>
        <div className="rounded-lg bg-white p-3 dark:bg-gray-900">
          <p className="text-[11px] font-semibold text-gray-500">학습 결과</p>
          <div className="mt-1 text-sm text-gray-800 dark:text-gray-100">{result}</div>
        </div>
        <div className="flex items-center justify-center">
          <ArrowRight size={16} className="rotate-90 text-cyan-500 md:rotate-0" />
        </div>
        <div className="rounded-lg bg-white p-3 dark:bg-gray-900">
          <p className="text-[11px] font-semibold text-gray-500">학습 목표</p>
          <div className="mt-1 text-sm text-gray-800 dark:text-gray-100">{goal}</div>
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-600 dark:text-gray-300">
        <strong>추론 단계</strong> — {inference}
      </p>
    </div>
  );
}

function Chips({ items, tone }: { items: string[]; tone: "cyan" | "sky" | "slate" }) {
  const cls =
    tone === "cyan"
      ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/70 dark:text-cyan-200"
      : tone === "sky"
        ? "bg-sky-100 text-sky-800 dark:bg-sky-900/70 dark:text-sky-200"
        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((it) => (
        <span key={it} className={`rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>
          {it}
        </span>
      ))}
    </div>
  );
}

/* ── 좌표 변환 헬퍼 ────────────────────────────────────── */

const V = 260;
const M = 26;
const mapTo = (v: number, min: number, max: number) => M + ((v - min) / (max - min)) * (V - M * 2);
const mapToY = (v: number, min: number, max: number) => V - M - ((v - min) / (max - min)) * (V - M * 2);

/* ── 탭 ───────────────────────────────────────────────── */

const topicTabs = [
  { key: "cls", label: "분류", english: "classification" },
  { key: "reg", label: "회귀", english: "regression" },
  { key: "clu", label: "군집화", english: "clustering" },
  { key: "fea", label: "특징추출", english: "feature extraction" },
] as const;

type TopicKey = (typeof topicTabs)[number]["key"];

/* ── 본문 ─────────────────────────────────────────────── */

export default function MLTopicsExplorer() {
  const [tab, setTab] = useState<TopicKey>("cls");

  // 분류
  const [slope, setSlope] = useState(1);
  // 회귀
  const [regSlope, setRegSlope] = useState(0.35);
  const [regIntercept, setRegIntercept] = useState(2.6);
  // 군집화
  const [quality, setQuality] = useState(100);
  // 특징추출
  const [plane, setPlane] = useState<PlaneKey>("12");

  /* 분류 계산 */
  const clsResult = useMemo(() => {
    let wrong = 0;
    const marks = classifyData.map((p) => {
      const g = p.x2 - slope * p.x1;
      const pred: 0 | 1 = g >= 0 ? 1 : 0;
      const ok = pred === p.y;
      if (!ok) wrong += 1;
      return { ...p, ok };
    });
    const total = classifyData.length;
    return {
      marks,
      wrong,
      rate: ((total - wrong) / total) * 100,
      error: (wrong / total) * 100,
    };
  }, [slope]);

  /** 결정경계를 그릴 x1의 반폭 — |slope·x1| ≤ 3.5가 되도록 잘라 기울기를 왜곡하지 않는다 */
  const boundaryHalfSpan = Math.min(3.5, Math.abs(slope) < 1e-9 ? 3.5 : 3.5 / Math.abs(slope));

  /* 회귀 계산 */
  const regResult = useMemo(() => {
    const residuals = regressionData.map((p) => p.y - (regSlope * p.x + regIntercept));
    const sse = residuals.reduce((a, r) => a + r * r, 0);
    return { residuals, sse, mse: sse / regressionData.length };
  }, [regSlope, regIntercept]);

  /* 군집화 계산 */
  const cluResult = useMemo(() => {
    const t = quality / 100;
    const centroids = bestCentroids.map(
      (good, i) =>
        [
          badCentroids[i][0] + (good[0] - badCentroids[i][0]) * t,
          badCentroids[i][1] + (good[1] - badCentroids[i][1]) * t,
        ] as [number, number]
    );
    const assign = clusterData.map((p) => {
      let best = 0;
      let bestD = Infinity;
      centroids.forEach((c, i) => {
        const d = (p.x - c[0]) ** 2 + (p.y - c[1]) ** 2;
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      return best;
    });
    const within =
      clusterData.reduce((acc, p, i) => {
        const c = centroids[assign[i]];
        return acc + (p.x - c[0]) ** 2 + (p.y - c[1]) ** 2;
      }, 0) / clusterData.length;
    const gx = clusterData.reduce((a, p) => a + p.x, 0) / clusterData.length;
    const gy = clusterData.reduce((a, p) => a + p.y, 0) / clusterData.length;
    const counts = [0, 0, 0];
    assign.forEach((a) => (counts[a] += 1));
    const between =
      centroids.reduce((acc, c, i) => acc + counts[i] * ((c[0] - gx) ** 2 + (c[1] - gy) ** 2), 0) /
      clusterData.length;
    return { centroids, assign, within, between };
  }, [quality]);

  const clusterColors = ["#0891b2", "#f59e0b", "#7c3aed"];

  return (
    <section>
      <SectionTitle
        title="머신러닝에서 다루는 주제"
        subtitle="데이터 분석(분류 · 회귀 · 군집화)과 데이터 표현(특징추출)"
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm font-bold">데이터 분석 data analysis</p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">분류 · 회귀 · 군집화</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm font-bold">데이터 표현 data representation</p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            특징추출 — 딥러닝에서는 표현학습(representation learning)이라 부름
          </p>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {topicTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-cyan-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {t.label} <span className="text-xs opacity-70">{t.english}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ────────────── 분류 ────────────── */}
        {tab === "cls" && (
          <motion.div key="cls" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <p className="mb-4 text-sm leading-relaxed text-gray-700 dark:text-gray-200">
              입력 데이터가 어떤 <strong>부류(class)</strong>에 속하는지를 자동으로 판단하는 문제.
            </p>

            <IORelation
              dataset={
                <span>
                  D = {"{"}(x<sub>i</sub>, y<sub>i</sub>){"}"}<sub>i=1…N</sub>, &nbsp;y<sub>i</sub> ∈ {"{"}0, 1, ⋯,
                  M−1{"}"}
                </span>
              }
              result={<span>결정경계 g(x; θ) = 0, 결정함수 g(x; θ)</span>}
              goal={<span>분류오차를 최소화하는 최적의 결정경계 g(x; θ) = 0을 찾는 것</span>}
              inference={
                <span>
                  새 데이터 x<sub>new</sub>에 대해 g(x<sub>new</sub>; θ)의 부호를 보고 결정규칙으로 클래스
                  레이블을 판정.
                </span>
              }
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[auto_1fr]">
              <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
                <svg viewBox={`0 0 ${V} ${V}`} className="w-full max-w-[300px]" role="img" aria-label="2차원 분류 예제">
                  <line x1={M} y1={V - M} x2={V - M} y2={V - M} stroke="#94a3b8" strokeWidth="1.2" />
                  <line x1={M} y1={M} x2={M} y2={V - M} stroke="#94a3b8" strokeWidth="1.2" />
                  <text x={V - M} y={V - M + 15} textAnchor="end" fontSize="10" fill="#64748b">
                    x1
                  </text>
                  <text x={M - 6} y={M + 2} textAnchor="end" fontSize="10" fill="#64748b">
                    x2
                  </text>
                  {/* 결정경계 x2 = slope · x1 — 기울기를 유지한 채 축 범위(±3.5)에서 잘라 낸다 */}
                  <line
                    x1={mapTo(-boundaryHalfSpan, -3.5, 3.5)}
                    y1={mapToY(-slope * boundaryHalfSpan, -3.5, 3.5)}
                    x2={mapTo(boundaryHalfSpan, -3.5, 3.5)}
                    y2={mapToY(slope * boundaryHalfSpan, -3.5, 3.5)}
                    stroke="#0891b2"
                    strokeWidth="2.4"
                  />
                  {clsResult.marks.map((p, i) => {
                    const cx = mapTo(p.x1, -3.5, 3.5);
                    const cy = mapToY(p.x2, -3.5, 3.5);
                    const color = p.ok ? (p.y === 1 ? "#0f172a" : "#475569") : "#dc2626";
                    return p.y === 1 ? (
                      <g key={i}>
                        <line x1={cx - 4} y1={cy} x2={cx + 4} y2={cy} stroke={color} strokeWidth="2" />
                        <line x1={cx} y1={cy - 4} x2={cx} y2={cy + 4} stroke={color} strokeWidth="2" />
                      </g>
                    ) : (
                      <rect key={i} x={cx - 3.4} y={cy - 3.4} width="6.8" height="6.8" fill="none" stroke={color} strokeWidth="1.8" />
                    );
                  })}
                  <text x={mapTo(-2.4, -3.5, 3.5)} y={mapToY(2.6, -3.5, 3.5)} fontSize="13" fontWeight="bold" fill="#0f172a">
                    C1
                  </text>
                  <text x={mapTo(2.0, -3.5, 3.5)} y={mapToY(-2.6, -3.5, 3.5)} fontSize="13" fontWeight="bold" fill="#475569">
                    C2
                  </text>
                </svg>
                <p className="pb-1 text-center text-xs text-gray-500">
                  십자 = C1, 사각형 = C2, 빨간 표시 = 오분류된 데이터
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                  <label className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">결정경계의 기울기 a</span>
                    <span className="font-mono tabular-nums text-cyan-700 dark:text-cyan-300">
                      {slope.toFixed(1)}
                    </span>
                  </label>
                  <input
                    type="range"
                    min={-2}
                    max={3}
                    step={0.1}
                    value={slope}
                    onChange={(e) => setSlope(Number(e.target.value))}
                    className="mt-2 w-full accent-cyan-600"
                  />
                  <p className="mt-2 font-mono text-sm text-gray-700 dark:text-gray-200">
                    g(x) = g(x1, x2) = x2 − {slope.toFixed(1)} · x1 = 0
                  </p>
                  <button
                    onClick={() => setSlope(1)}
                    className="mt-2 rounded-lg bg-gray-100 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                  >
                    강의 예시 g(x) = x2 − x1 = 0
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-cyan-300 bg-cyan-50 p-4 dark:border-cyan-800 dark:bg-cyan-950/50">
                    <p className="text-xs text-cyan-800 dark:text-cyan-300">분류율 classification rate</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-cyan-700 dark:text-cyan-200">
                      {clsResult.rate.toFixed(1)}%
                    </p>
                    <p className="mt-1 text-[11px] text-gray-500">분류 성공 개수 / 전체 개수 × 100</p>
                  </div>
                  <div className="rounded-xl border border-red-300 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/40">
                    <p className="text-xs text-red-700 dark:text-red-300">분류 오차 classification error</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-red-600 dark:text-red-300">
                      {clsResult.error.toFixed(1)}%
                    </p>
                    <p className="mt-1 text-[11px] text-gray-500">
                      오분류 {clsResult.wrong}개 / 전체 {classifyData.length}개
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 text-sm dark:bg-gray-800">
                  <p className="font-mono text-gray-700 dark:text-gray-200">
                    E(D; θ) = (1/N) Σ<sub>(xi, yi) ∈ D</sub> δ( y<sub>i</sub> − y(x<sub>i</sub>) )
                  </p>
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                    δ 함수는 괄호 안의 값이 0이면 0을, 0이 아니면 1을 돌려줌. 목표 출력값과 시스템
                    출력값이 같으면 학습이 잘된 것이고 다르면 잘못된 것이므로,{" "}
                    <strong>잘못된 것만 개수를 세는 방식</strong>.
                  </p>
                  <p className="mt-2 font-mono text-xs text-gray-700 dark:text-gray-200">
                    y(x) = 1 &nbsp;if g(x) ≥ 0 (x ∈ C1) &nbsp;/&nbsp; y(x) = 0 &nbsp;if g(x) &lt; 0 (x ∈ C2)
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                <p className="mb-2 text-sm font-bold">용어 정리</p>
                <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    · <strong>결정경계</strong> decision boundary — g(x) = 0으로 경계 지어지는 입력
                    공간상의 경계
                  </li>
                  <li>
                    · <strong>결정함수 / 판별함수</strong> — g(x) 자체
                  </li>
                  <li>
                    · <strong>결정규칙</strong> — g(x)를 이용해 데이터가 최종적으로 어떤 클래스에 속할지
                    판정하는 규칙
                  </li>
                  <li>
                    · <strong>오분류</strong> — 결정경계가 잘못 놓여 C1 데이터가 C2 영역에, 또는 그 반대로
                    들어가는 것
                  </li>
                </ul>
              </div>
              <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                <div>
                  <p className="mb-2 text-sm font-bold">응용 — &ldquo;~ 인식&rdquo;</p>
                  <Chips items={["숫자 인식", "얼굴 인식", "생체 인식", "음성 인식", "객체 인식"]} tone="cyan" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-bold">생체 인식에 쓰이는 특징</p>
                  <Chips
                    items={[
                      "걸음걸이",
                      "홍채",
                      "망막",
                      "얼굴 온도",
                      "치아",
                      "키보드 타이핑 습관",
                      "음성",
                      "필기",
                      "손 모양",
                      "지문",
                      "귀 모양",
                    ]}
                    tone="sky"
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-bold">적용 방법</p>
                  <Chips
                    items={[
                      "베이즈 분류기",
                      "K-최근접이웃 방법",
                      "결정 트리",
                      "랜덤 포레스트",
                      "SVM",
                      "신경망 (MLP, CNN, LSTM)",
                    ]}
                    tone="slate"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ────────────── 회귀 ────────────── */}
        {tab === "reg" && (
          <motion.div key="reg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <p className="mb-4 text-sm leading-relaxed text-gray-700 dark:text-gray-200">
              입력 변수와 출력 변수 사이의 매핑 관계 <strong>y = f(x; θ)</strong>를 찾는 것.
            </p>

            <IORelation
              dataset={
                <span>
                  D = {"{"}(x<sub>i</sub>, y<sub>i</sub>){"}"}<sub>i=1…N</sub>, &nbsp;y<sub>i</sub> ∈ R
                  (연속적인 실수값)
                </span>
              }
              result={<span>회귀함수 y = f(x; θ)</span>}
              goal={<span>회귀오차를 최소화하는 최적의 회귀함수 y = f(x; θ)를 찾는 것</span>}
              inference={
                <span>
                  새 데이터 x<sub>new</sub>를 회귀함수에 넣어 예측 결과 y<sub>new</sub> = f(x<sub>new</sub>;
                  θ)를 얻음.
                </span>
              }
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[auto_1fr]">
              <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
                <svg viewBox={`0 0 ${V} ${V}`} className="w-full max-w-[300px]" role="img" aria-label="회귀 직선과 잔차">
                  <line x1={M} y1={V - M} x2={V - M} y2={V - M} stroke="#94a3b8" strokeWidth="1.2" />
                  <line x1={M} y1={M} x2={M} y2={V - M} stroke="#94a3b8" strokeWidth="1.2" />
                  <text x={V - M} y={V - M + 15} textAnchor="end" fontSize="10" fill="#64748b">
                    x
                  </text>
                  <text x={M - 6} y={M + 2} textAnchor="end" fontSize="10" fill="#64748b">
                    y
                  </text>
                  <line
                    x1={mapTo(0, 0, 10)}
                    y1={mapToY(Math.max(0, Math.min(12, regIntercept)), 0, 12)}
                    x2={mapTo(10, 0, 10)}
                    y2={mapToY(Math.max(0, Math.min(12, regSlope * 10 + regIntercept)), 0, 12)}
                    stroke="#0891b2"
                    strokeWidth="2.4"
                  />
                  {regressionData.map((p, i) => {
                    const fx = regSlope * p.x + regIntercept;
                    return (
                      <g key={i}>
                        <line
                          x1={mapTo(p.x, 0, 10)}
                          y1={mapToY(p.y, 0, 12)}
                          x2={mapTo(p.x, 0, 10)}
                          y2={mapToY(fx, 0, 12)}
                          stroke="#f59e0b"
                          strokeWidth="1.6"
                        />
                        <circle cx={mapTo(p.x, 0, 10)} cy={mapToY(p.y, 0, 12)} r="3.4" fill="#0f172a" />
                      </g>
                    );
                  })}
                </svg>
                <p className="pb-1 text-center text-xs text-gray-500">
                  주황 세로선 = 각 데이터의 잔차 (y<sub>i</sub> − f(x<sub>i</sub>; θ))
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                  <label className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">회귀직선의 기울기</span>
                    <span className="font-mono tabular-nums text-cyan-700 dark:text-cyan-300">
                      {regSlope.toFixed(2)}
                    </span>
                  </label>
                  <input
                    type="range"
                    min={-0.5}
                    max={1.6}
                    step={0.01}
                    value={regSlope}
                    onChange={(e) => setRegSlope(Number(e.target.value))}
                    className="mt-1 w-full accent-cyan-600"
                  />
                  <label className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">회귀직선의 절편</span>
                    <span className="font-mono tabular-nums text-cyan-700 dark:text-cyan-300">
                      {regIntercept.toFixed(2)}
                    </span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={6}
                    step={0.01}
                    value={regIntercept}
                    onChange={(e) => setRegIntercept(Number(e.target.value))}
                    className="mt-1 w-full accent-cyan-600"
                  />
                  <button
                    onClick={() => {
                      setRegSlope(Number(leastSquares.slope.toFixed(2)));
                      setRegIntercept(Number(leastSquares.intercept.toFixed(2)));
                    }}
                    className="mt-3 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-cyan-700"
                  >
                    제곱오차를 최소화하는 회귀함수 찾기
                  </button>
                </div>

                <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40">
                  <p className="text-xs text-amber-800 dark:text-amber-300">제곱오차 squared error</p>
                  <p className="mt-1 font-mono text-sm text-gray-700 dark:text-gray-200">
                    E(D; θ) = (1/N) Σ<sub>(xi, yi) ∈ D</sub> ( y<sub>i</sub> − f(x<sub>i</sub>; θ) )<sup>2</sup>
                  </p>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-amber-700 dark:text-amber-300">
                    {regResult.mse.toFixed(3)}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    잔차 제곱의 합 = {regResult.sse.toFixed(3)} (데이터 {regressionData.length}개)
                  </p>
                </div>
              </div>
            </div>

            {/* 판매 예측 */}
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                <p className="mb-2 text-sm font-bold">판매 예측 — 시계열 예측의 예</p>
                <div className="overflow-x-auto">
                  <svg viewBox="0 0 300 170" className="w-full min-w-[280px]" role="img" aria-label="판매 예측 그래프">
                    <line x1="34" y1={salesY(0)} x2="292" y2={salesY(0)} stroke="#94a3b8" strokeWidth="1" />
                    <line x1="34" y1="12" x2="34" y2={salesY(0)} stroke="#94a3b8" strokeWidth="1" />
                    {[0, 20, 40, 60].map((v) => (
                      <g key={v}>
                        <line
                          x1="34"
                          y1={salesY(v)}
                          x2="292"
                          y2={salesY(v)}
                          stroke="#e2e8f0"
                          strokeWidth="0.8"
                        />
                        <text x="30" y={salesY(v) + 3} textAnchor="end" fontSize="8" fill="#94a3b8">
                          {v}
                        </text>
                      </g>
                    ))}
                    {[2010, 2012, 2014, 2016, 2018].map((y) => (
                      <text key={y} x={salesX(y)} y="154" textAnchor="middle" fontSize="9" fill="#64748b">
                        {y}
                      </text>
                    ))}
                    {salesSeries.map((s) => (
                      <g key={s.name}>
                        <polyline
                          points={s.values
                            .map((v, i) => `${salesX(2010 + i)},${salesY(v)}`)
                            .join(" ")}
                          fill="none"
                          stroke={s.color}
                          strokeWidth="2"
                        />
                        <line
                          x1={salesX(2018)}
                          y1={salesY(s.values[s.values.length - 1])}
                          x2={salesX(FORECAST_YEAR)}
                          y2={salesY(s.forecast)}
                          stroke={s.color}
                          strokeWidth="2"
                          strokeDasharray="4 3"
                        />
                        <circle cx={salesX(FORECAST_YEAR)} cy={salesY(s.forecast)} r="3.5" fill={s.color} />
                        <text
                          x={salesX(FORECAST_YEAR)}
                          y={salesY(s.forecast) - 7}
                          textAnchor="end"
                          fontSize="9"
                          fontWeight="bold"
                          fill={s.color}
                        >
                          {s.forecast}
                        </text>
                      </g>
                    ))}
                    <text x="40" y="24" fontSize="10" fill="#0e7490" fontWeight="bold">
                      2019.8 예측 — 상품A : 53 / 상품B : 15
                    </text>
                  </svg>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
                  {salesSeries.map((s) => (
                    <span key={s.name} className="flex items-center gap-1.5">
                      <span className="h-0.5 w-4" style={{ backgroundColor: s.color }} />
                      {s.name}
                    </span>
                  ))}
                  <span>실선 = 관측된 과거 판매량, 점선 = 예측</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  2010년부터 2018년까지의 과거 판매 데이터를 이용해 2019년 8월의 판매량을 추정.
                </p>
              </div>
              <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                <div>
                  <p className="mb-2 text-sm font-bold">응용 — &ldquo;~ 예측&rdquo;</p>
                  <Chips items={["시장 예측", "환율 예측", "주가 예측", "판매 예측"]} tone="cyan" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-bold">강의에서 든 회귀 문제의 예</p>
                  <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-200">
                    <li>· BMI 수치 → 체지방률</li>
                    <li>· 기저질환, 성별, 나이 → 특정 질병의 위험도</li>
                    <li>· 국어·영어·수학 점수 → 특정 대학의 합격 가능성</li>
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-sm font-bold">적용 방법</p>
                  <Chips items={["선형회귀", "비선형회귀", "로지스틱 회귀", "SVM", "신경망"]} tone="slate" />
                </div>
                <p className="rounded-lg bg-cyan-50 p-3 text-xs text-cyan-900 dark:bg-cyan-950/50 dark:text-cyan-200">
                  분류는 출력이 <strong>이산적인 값</strong>(0부터 M−1 중 하나), 회귀는 출력이{" "}
                  <strong>연속적인 실수값</strong>. 따라서 분류 문제는 회귀 문제의 특별한 경우로 볼 수 있음.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ────────────── 군집화 ────────────── */}
        {tab === "clu" && (
          <motion.div key="clu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <p className="mb-4 text-sm leading-relaxed text-gray-700 dark:text-gray-200">
              주어진 데이터 집합을 단순히 입력값의 <strong>유사성</strong>에 따라 서로 비슷한 임의의 복수
              개의 그룹(군집 cluster)으로 묶는 문제.
            </p>

            <IORelation
              dataset={
                <span>
                  D = {"{"}x<sub>i</sub>{"}"}<sub>i=1…N</sub> &nbsp;— <strong>목표 출력값 y<sub>i</sub> 없음</strong>
                </span>
              }
              result={
                <span>
                  서로소(disjoint)인 K개의 부분집합 D = D<sub>1</sub> ∪ D<sub>2</sub> ∪ ⋯ ∪ D<sub>K</sub>.
                  각 클러스터의 대표 벡터 또는 분포함수로도 표현 가능.
                </span>
              }
              goal={
                <span>
                  최적의 클러스터 집합을 찾는 것 — 클러스터 <strong>내</strong>의 분산은 최소, 클러스터{" "}
                  <strong>간</strong>의 분산은 최대
                </span>
              }
              inference={
                <span>
                  Prob(x<sub>new</sub> ∈ D<sub>i</sub>)를 계산하고 argmax<sub>i</sub>로 소속 클러스터를 판정.
                  군집화는 학습만 수행하고 끝나는 경우도 많음.
                </span>
              }
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[auto_1fr]">
              <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
                <svg viewBox={`0 0 ${V} ${V}`} className="w-full max-w-[300px]" role="img" aria-label="군집화 결과">
                  <line x1={M} y1={V - M} x2={V - M} y2={V - M} stroke="#e2e8f0" strokeWidth="1" />
                  <line x1={M} y1={M} x2={M} y2={V - M} stroke="#e2e8f0" strokeWidth="1" />
                  {clusterData.map((p, i) => (
                    <circle
                      key={i}
                      cx={mapTo(p.x, -3.2, 3.2)}
                      cy={mapToY(p.y, -3.2, 3.2)}
                      r="3.2"
                      fill={clusterColors[cluResult.assign[i]]}
                      opacity={0.75}
                    />
                  ))}
                  {cluResult.centroids.map((c, i) => (
                    <g key={i}>
                      <circle
                        cx={mapTo(c[0], -3.2, 3.2)}
                        cy={mapToY(c[1], -3.2, 3.2)}
                        r="8"
                        fill="none"
                        stroke={clusterColors[i]}
                        strokeWidth="2.5"
                      />
                      <text
                        x={mapTo(c[0], -3.2, 3.2) + 11}
                        y={mapToY(c[1], -3.2, 3.2) + 4}
                        fontSize="12"
                        fontWeight="bold"
                        fill={clusterColors[i]}
                      >
                        m{i + 1}
                      </text>
                    </g>
                  ))}
                </svg>
                <p className="pb-1 text-center text-xs text-gray-500">
                  색 = 소속 클러스터 D<sub>1</sub>, D<sub>2</sub>, D<sub>3</sub> / 원 = 대표 벡터 m
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                  <label className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">대표 벡터의 위치 (K = 3)</span>
                    <span className="font-mono tabular-nums text-cyan-700 dark:text-cyan-300">
                      {quality === 100 ? "좋은 군집" : quality === 0 ? "나쁜 군집" : `${quality}%`}
                    </span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="mt-2 w-full accent-cyan-600"
                  />
                  <div className="mt-1 flex justify-between gap-3 text-[11px] text-gray-500">
                    <span>나쁜 군집 — 대표 벡터가 한곳에 몰림</span>
                    <span className="text-right">좋은 군집 — 대표 벡터 = 각 클러스터의 평균</span>
                  </div>
                  <p className="mt-2 text-[11px] text-gray-500">
                    슬라이더를 100까지 밀면 각 대표 벡터가 자기 클러스터에 속한 데이터의 평균에
                    놓이며, 이때 클러스터 내의 분산이 가장 작아짐.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                    <p className="text-xs text-gray-500">클러스터 내의 분산 (최소가 목표)</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-cyan-700 dark:text-cyan-300">
                      {cluResult.within.toFixed(3)}
                    </p>
                    <div className="mt-2 h-2 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
                      <motion.div
                        className="h-full bg-cyan-600"
                        animate={{ width: `${Math.min(100, (cluResult.within / clusterTotalVariance) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                    <p className="text-xs text-gray-500">클러스터 간의 분산 (최대가 목표)</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-violet-600 dark:text-violet-300">
                      {cluResult.between.toFixed(3)}
                    </p>
                    <div className="mt-2 h-2 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
                      <motion.div
                        className="h-full bg-violet-500"
                        animate={{ width: `${Math.min(100, (cluResult.between / clusterTotalVariance) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 text-sm dark:bg-gray-800">
                  <p className="text-gray-700 dark:text-gray-200">
                    D = D<sub>1</sub> ∪ D<sub>2</sub> ∪ ⋯ ∪ D<sub>K</sub> — <strong>서로소 disjoint</strong>란
                    부분집합 간에 교집합이 없다는 뜻.
                  </p>
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                    학습 결과는 ① 서로 겹치지 않는 부분집합 ② 각 클러스터의 <strong>대표 벡터</strong>(평균)
                    ③ 각 클러스터의 확률분포 함수 세 가지 형태로 표현 가능.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                <p className="mb-2 text-sm font-bold">응용</p>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    · <strong>데이터 그룹핑</strong> — 여러 영상이 주어지면 산이 있는 그림, 호수가 있는
                    그림, 빌딩이 있는 그림끼리 기계가 알아서 묶음
                  </li>
                  <li>
                    · <strong>영상 분할</strong> — 영상의 각 화소를 하나의 데이터로 취급하고, 화소들이 가진
                    값을 바탕으로 그룹핑한 결과
                  </li>
                  <li>
                    · <strong>시멘틱 영상 분할</strong> — 영상 분할에 의미를 덧붙인 것. MRI나 CT 영상에서
                    &ldquo;여기가 암 조직이다&rdquo;와 같이 의미를 부여하여 분할
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                <p className="mb-2 text-sm font-bold">적용 방법</p>
                <Chips items={["K-평균 군집화", "계층적 군집화", "가우시안 혼합 모델"]} tone="slate" />
                <p className="mt-4 rounded-lg bg-cyan-50 p-3 text-xs text-cyan-900 dark:bg-cyan-950/50 dark:text-cyan-200">
                  분류나 회귀는 입력 데이터에 목표 출력값이 함께 주어지지만, 군집화는{" "}
                  <strong>목표 출력값이 없음</strong>. 입력 데이터만 주어진 상태에서 서로 구분함.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ────────────── 특징추출 ────────────── */}
        {tab === "fea" && (
          <motion.div key="fea" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <p className="mb-4 text-sm leading-relaxed text-gray-700 dark:text-gray-200">
              원래 데이터로부터 <strong>분석에 적용하기 좋은 특징</strong>을 찾아내는 문제. 영상 데이터의
              차원 축소, 데이터 시각화 등에 활용.
            </p>

            <IORelation
              dataset={
                <span>
                  D = {"{"}x<sub>i</sub>{"}"}, 또는 D = {"{"}(x<sub>i</sub>, y<sub>i</sub>){"}"} — 목표
                  출력값이 있을 수도, 없을 수도 있음
                </span>
              }
              result={<span>변환함수 z = f(x; θ) (embedding / transformation function)</span>}
              goal={
                <span>
                  분석 목적에 따라 달라짐 — PCA는 정보 손실량 최소화, LDA는 분류 정보를 최대한 유지
                </span>
              }
              inference={
                <span>
                  새 데이터 x<sub>new</sub>를 변환함수에 넣어 특징벡터 z<sub>new</sub> = f(x<sub>new</sub>; θ)를
                  얻음.
                </span>
              }
            />

            <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
              3차원 데이터를 사영하여 2차원으로 줄이는 방법은 여러 가지. 아래 세 선택지를 눌러, 두 덩어리가
              잘 나뉘는 방향이 어느 쪽인지 확인해 보기.
            </p>

            <div className="mb-4 flex flex-wrap gap-2">
              {planes.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPlane(p.key)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    plane === p.key
                      ? "bg-cyan-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {p.label}
                  {planeScores[p.key] > 1.2 ? (
                    <Check size={14} className={plane === p.key ? "text-white" : "text-emerald-600"} />
                  ) : (
                    <X size={14} className={plane === p.key ? "text-white" : "text-red-500"} />
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[auto_1fr]">
              <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
                <svg viewBox={`0 0 ${V} ${V}`} className="w-full max-w-[300px]" role="img" aria-label="사영된 2차원 데이터">
                  <line x1={M} y1={V - M} x2={V - M} y2={V - M} stroke="#94a3b8" strokeWidth="1.2" />
                  <line x1={M} y1={M} x2={M} y2={V - M} stroke="#94a3b8" strokeWidth="1.2" />
                  <text x={V - M} y={V - M + 15} textAnchor="end" fontSize="10" fill="#64748b">
                    {planes.find((p) => p.key === plane)!.ax}
                  </text>
                  <text x={M - 6} y={M + 2} textAnchor="end" fontSize="10" fill="#64748b">
                    {planes.find((p) => p.key === plane)!.ay}
                  </text>
                  {data3d.map((p, i) => {
                    const [a, b] = projectTo(plane, p);
                    return (
                      <circle
                        key={i}
                        cx={mapTo(a, -4, 4)}
                        cy={mapToY(b, -4, 4)}
                        r="3.2"
                        fill={p.g === 0 ? "#0891b2" : "#f59e0b"}
                        opacity={0.78}
                      />
                    );
                  })}
                </svg>
                <p className="pb-1 text-center text-xs text-gray-500">
                  파랑 · 주황 = 서로 다른 두 덩어리
                </p>
              </div>

              <div className="space-y-4">
                <div
                  className={`rounded-xl border p-5 ${
                    planeScores[plane] > 1.2
                      ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40"
                      : "border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/40"
                  }`}
                >
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    {planes.find((p) => p.key === plane)!.label} —{" "}
                    {planeScores[plane] > 1.2 ? "두 덩어리가 잘 나뉨" : "두 덩어리가 겹침"}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    두 덩어리 중심 사이의 거리를 퍼짐으로 나눈 값 ={" "}
                    <strong className="tabular-nums">{planeScores[plane].toFixed(2)}</strong>
                  </p>
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                    분류가 목적이라면, 사영했을 때 두 덩어리가 쉽게 구분되는 방향으로 차원을 축소하는
                    것이 좋음. 어느 방향으로 사영할지는 문제의 특성에 따라 달라짐.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                  <p className="mb-3 text-sm font-bold">특징추출 방법과 목적</p>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[380px] border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 text-left dark:border-gray-700">
                          <th className="px-2 py-2 font-semibold text-gray-500">방법</th>
                          <th className="px-2 py-2 font-semibold text-gray-500">목적</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <td className="px-2 py-2 font-medium">PCA (주성분분석)</td>
                          <td className="px-2 py-2 text-gray-600 dark:text-gray-300">
                            차원을 축소하되 원래 데이터가 갖는 <strong>정보 손실량을 최소화</strong>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <td className="px-2 py-2 font-medium">LDA (선형판별분석)</td>
                          <td className="px-2 py-2 text-gray-600 dark:text-gray-300">
                            <strong>분류를 위해 필요한 정보를 최대한 유지</strong>하면서 축소
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <td className="px-2 py-2 font-medium">MDS</td>
                          <td className="px-2 py-2 text-gray-600 dark:text-gray-300">
                            데이터 사이의 거리 관계를 유지하며 저차원으로 표현
                          </td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 font-medium">t-SNE</td>
                          <td className="px-2 py-2 text-gray-600 dark:text-gray-300">
                            특히 <strong>데이터 시각화</strong> 용도로 많이 사용
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-xl bg-cyan-50 p-4 text-sm text-cyan-900 dark:bg-cyan-950/50 dark:text-cyan-200">
                  <p className="font-bold">데이터 시각화 — MNIST의 예</p>
                  <p className="mt-1 leading-relaxed">
                    하나의 데이터가 28 × 28이면 flatten 시 <strong>784차원</strong>이 되어 너무 큼. 이를
                    t-SNE로 <strong>2차원</strong>으로 줄여 2차원 공간에 나타내면 숫자별로 색을 달리해
                    분포를 눈으로 확인할 수 있음.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
