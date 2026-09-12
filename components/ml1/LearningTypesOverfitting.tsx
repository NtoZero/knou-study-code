"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { AlertTriangle, Flag } from "lucide-react";

/* ── 머신러닝의 유형 ───────────────────────────────────── */

interface LearningType {
  key: string;
  name: string;
  english: string;
  alias?: string;
  points: string[];
  leadsTo: string;
  tone: string;
}

const learningTypes: LearningType[] = [
  {
    key: "sup",
    name: "지도학습",
    english: "supervised learning",
    alias: "교사학습",
    points: [
      "학습할 때 시스템에 출력해야 할 목표 출력값(‘교사 supervisor’)을 함께 제공",
      "목표 출력값이 이런 입력이 들어왔을 때 어느 방향으로 가야 하는지 학습 방향을 알려줌",
      "클래스 레이블링 문제 → 준/반지도학습, 약지도학습, 자기지도학습 등으로 확장",
    ],
    leadsTo: "분류 · 회귀",
    tone: "cyan",
  },
  {
    key: "unsup",
    name: "비지도학습",
    english: "unsupervised learning",
    alias: "비교사학습",
    points: [
      "목표 출력값에 대한 아무런 정보 없이 학습을 진행",
      "입력값 xᵢ만 주어진 상태에서 데이터끼리 서로 구분",
    ],
    leadsTo: "군집화",
    tone: "sky",
  },
  {
    key: "rl",
    name: "강화학습",
    english: "reinforcement learning",
    points: [
      "원하는 출력값을 모르거나 알 수 없는 경우에 사용",
      "출력값에 대한 교사 신호가 ‘보상 reward’ 형태로 주어짐",
      "교사 신호는 정확한 값이 아니고, 출력값 각각에 대해서 즉시 주어지지 않을 수 있음",
      "교재 14장에서 자세히 다룸",
    ],
    leadsTo: "바둑 · 게임 · 제어 문제",
    tone: "slate",
  },
];

const labelingVariants = [
  {
    name: "준(반)지도학습",
    english: "semi-supervised learning",
    desc: "지도학습과 비지도학습을 섞어서 사용하며, 레이블이 없는 데이터도 함께 학습에 포함.",
  },
  {
    name: "약지도학습",
    english: "weakly supervised learning",
    desc: "부정확하거나 대략적인 레이블만으로도 학습을 수행.",
  },
  {
    name: "자기지도학습",
    english: "self-supervised learning",
    desc: "레이블이 없는 많은 양의 데이터에 스스로 레이블을 붙인 뒤 학습을 수행.",
  },
];

/* ── 복잡도 실험 데이터 (모듈 로드 시 결정론적으로 생성) ──── */

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

const X_MAX = 1.6;
const trueFn = (x: number) => 0.55 * Math.sin(2.6 * x) + 0.15 * x;

interface CPoint {
  x: number;
  y: number;
  label: 0 | 1;
  off: number;
}

/** 학습 데이터 — 확률적 잡음으로 일부 데이터의 클래스가 뒤바뀜 */
const trainSet: CPoint[] = (() => {
  const r = mulberry32(20250101);
  const pts: CPoint[] = [];
  for (let i = 0; i < 44; i++) {
    const x = -X_MAX + r() * 2 * X_MAX;
    let label: 0 | 1 = r() < 0.5 ? 1 : 0;
    const off = 0.06 + 0.78 * r();
    const y = trueFn(x) + (label === 1 ? off : -off);
    if (off < 0.3 && r() < 0.85) label = (1 - label) as 0 | 1;
    pts.push({ x, y, label, off });
  }
  return pts;
})();

/**
 * 테스트(검증) 데이터 — 학습 데이터와 같은 모집단에서 뽑은 다른 표본집합.
 * 경계에 아주 가까운 데이터는 여기서도 반대쪽 클래스로 관찰될 수 있으므로,
 * 아무리 잘 맞춘 결정경계라도 검증 오차가 0이 되지는 않는다.
 */
const testSet: CPoint[] = (() => {
  const r = mulberry32(20260201);
  const pts: CPoint[] = [];
  for (let i = 0; i < 72; i++) {
    const x = -X_MAX + r() * 2 * X_MAX;
    let label: 0 | 1 = r() < 0.5 ? 1 : 0;
    const off = 0.03 + 0.45 * r();
    const y = trueFn(x) + (label === 1 ? off : -off);
    if (off < 0.13 && r() < 0.7) label = (1 - label) as 0 | 1;
    pts.push({ x, y, label, off });
  }
  return pts;
})();

/** 실제 경계로 판정했을 때 어긋나는 학습 데이터 = 확률적 잡음 */
const noisyPoints = trainSet
  .filter((p) => (p.y > trueFn(p.x) ? 1 : 0) !== p.label)
  .sort((a, b) => a.off - b.off);

const linearFit = (() => {
  const n = trainSet.length;
  const sx = trainSet.reduce((a, p) => a + p.x, 0);
  const sy = trainSet.reduce((a, p) => a + p.y, 0);
  const sxx = trainSet.reduce((a, p) => a + p.x * p.x, 0);
  const sxy = trainSet.reduce((a, p) => a + p.x * p.y, 0);
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  return { slope, intercept: (sy - slope * sx) / n };
})();

const BUMP_W = 0.17;

/** 복잡도 c에서의 결정경계 */
function boundaryAt(x: number, c: number): number {
  const lin = linearFit.slope * x + linearFit.intercept;
  let value: number;
  if (c <= 1) value = lin;
  else if (c === 2) value = 0.7 * lin + 0.3 * trueFn(x);
  else value = trueFn(x);

  // 복잡도 3 → 잡음을 하나도 따라가지 않음, 복잡도 10 → 잡음 데이터를 전부 따라감
  const bumps = Math.max(
    0,
    Math.min(noisyPoints.length, Math.round(((c - 3) / 7) * noisyPoints.length))
  );
  for (let i = 0; i < bumps; i++) {
    const p = noisyPoints[i];
    const need = p.y - trueFn(p.x) + (p.label === 1 ? -0.1 : 0.1);
    value += need * Math.exp(-(((x - p.x) / BUMP_W) ** 2));
  }
  return value;
}

function errorRate(set: CPoint[], c: number): number {
  const wrong = set.filter((p) => (p.y > boundaryAt(p.x, c) ? 1 : 0) !== p.label).length;
  return (wrong / set.length) * 100;
}

const COMPLEXITIES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const trainCurve = COMPLEXITIES.map((c) => errorRate(trainSet, c));
const testCurve = COMPLEXITIES.map((c) => errorRate(testSet, c));
const optimalComplexity = COMPLEXITIES[testCurve.indexOf(Math.min(...testCurve))];

/* ── 과다적합 / 고급 주제 ──────────────────────────────── */

const overfitRemedies = [
  "다양한 변형을 가진 충분한 학습 데이터 사용",
  "조기 종료 early stopping 방법",
  "정규항을 가진 오차함수 사용",
  "여러 복잡도의 후보 모델을 학습한 후 최적 모델 선택 방법",
];

const advancedTopics = [
  {
    name: "앙상블 학습",
    english: "ensemble learning",
    desc: "복수 개의 간단한 학습 시스템을 결합하여 일반화 성능을 향상시키는 방법.",
  },
  {
    name: "능동 학습",
    english: "active learning",
    desc: "학습 과정에서 데이터를 선별적으로 선택하여 수행하는 방법.",
  },
  {
    name: "메타학습 · 자동 머신러닝",
    english: "meta-learning / auto ML",
    desc: "학습 시스템의 복잡도 등의 하이퍼파라미터까지 학습을 통해 최적화하는 방법.",
  },
  {
    name: "지속 · 증분학습",
    english: "continual / incremental learning",
    desc: "기존에 학습된 내용에 대한 손실 없이 새로운 내용을 추가로 학습하는 방법.",
  },
];

/* ── 좌표 변환 ─────────────────────────────────────────── */

const BW = 300;
const BH = 240;
const bx = (x: number) => 20 + ((x + 1.75) / 3.5) * (BW - 40);
const by = (y: number) => BH - 20 - ((y + 1.9) / 3.8) * (BH - 40);

const EW = 300;
const EH = 200;
const ex = (c: number) => 34 + ((c - 1) / 9) * (EW - 54);
const ey = (v: number) => EH - 28 - (v / 38) * (EH - 48);

/* ── 본문 ─────────────────────────────────────────────── */

export default function LearningTypesOverfitting() {
  const [complexity, setComplexity] = useState(1);
  const [dataset, setDataset] = useState<"train" | "test">("train");
  const [openType, setOpenType] = useState<string>("sup");

  const activeSet = dataset === "train" ? trainSet : testSet;

  const curvePath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 140; i++) {
      const x = -1.75 + (i / 140) * 3.5;
      const y = Math.max(-1.9, Math.min(1.9, boundaryAt(x, complexity)));
      pts.push(`${i === 0 ? "M" : "L"}${bx(x).toFixed(1)} ${by(y).toFixed(1)}`);
    }
    return pts.join(" ");
  }, [complexity]);

  const marks = useMemo(
    () =>
      activeSet.map((p) => ({
        ...p,
        ok: (p.y > boundaryAt(p.x, complexity) ? 1 : 0) === p.label,
      })),
    [activeSet, complexity]
  );

  const wrongCount = marks.filter((m) => !m.ok).length;
  const currentTrain = trainCurve[complexity - 1];
  const currentTest = testCurve[complexity - 1];

  const zone =
    complexity < optimalComplexity
      ? { label: "과소적합", cls: "bg-amber-500" }
      : complexity === optimalComplexity
        ? { label: "최적의 복잡도", cls: "bg-emerald-600" }
        : { label: "과다적합", cls: "bg-red-600" };

  return (
    <section>
      <SectionTitle
        title="학습 시스템 관련 개념"
        subtitle="머신러닝의 유형, 학습 시스템의 복잡도와 과다적합"
      />

      {/* 머신러닝의 유형 */}
      <h3 className="mb-3 text-base font-bold">머신러닝의 유형</h3>
      <div className="mb-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {learningTypes.map((t) => {
          const active = openType === t.key;
          const toneBox =
            t.tone === "cyan"
              ? "border-cyan-300 bg-cyan-50 dark:border-cyan-800 dark:bg-cyan-950/40"
              : t.tone === "sky"
                ? "border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/40"
                : "border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60";
          return (
            <button
              key={t.key}
              onClick={() => setOpenType(t.key)}
              className={`rounded-xl border p-5 text-left transition-shadow ${toneBox} ${
                active ? "ring-2 ring-cyan-500 ring-offset-1 dark:ring-offset-gray-950" : ""
              }`}
            >
              <div className="flex flex-wrap items-baseline gap-2">
                <p className="text-base font-bold text-gray-800 dark:text-gray-100">{t.name}</p>
                {t.alias && <p className="text-xs text-gray-500">{t.alias}</p>}
              </div>
              <p className="text-xs text-gray-500">{t.english}</p>
              <AnimatePresence initial={false}>
                {active && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 space-y-1.5 overflow-hidden"
                  >
                    {t.points.map((p) => (
                      <li key={p} className="flex gap-2 text-sm text-gray-700 dark:text-gray-200">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-500" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
              <p className="mt-3 text-xs font-bold text-cyan-700 dark:text-cyan-300">→ {t.leadsTo}</p>
            </button>
          );
        })}
      </div>

      {/* 클래스 레이블링 */}
      <div className="mb-10 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <p className="text-sm font-bold">클래스 레이블링 비용 문제</p>
        <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          지도학습에는 목표 출력값이 필요하며, 이를 만드는 작업을 <strong>클래스 레이블링</strong>이라
          부름. 인터넷에서 모은 영상마다 사람 얼굴·동물 얼굴·산·건물이라고 일일이 붙여야 하므로 비용이
          많이 들고 어려움. 이 때문에 아래와 같은 변형된 학습 방법들이 사용됨.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {labelingVariants.map((v) => (
            <div key={v.name} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{v.name}</p>
              <p className="text-[11px] text-gray-500">{v.english}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-gray-600 dark:text-gray-300">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 학습 시스템의 복잡도 */}
      <h3 className="mb-1 text-base font-bold">학습 시스템의 복잡도</h3>
      <p className="mb-4 text-sm text-gray-500">
        복잡도를 올리면 결정경계가 선형에서 점점 구불구불해짐. 학습 오차는 계속 줄어들지만 검증 오차는
        어느 지점부터 다시 올라감.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex min-w-[240px] flex-1 items-center gap-3">
          <label className="shrink-0 text-sm text-gray-600 dark:text-gray-300">복잡도</label>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={complexity}
            onChange={(e) => setComplexity(Number(e.target.value))}
            className="w-full accent-cyan-600"
          />
          <span className="w-6 shrink-0 text-sm font-bold tabular-nums text-cyan-700 dark:text-cyan-300">
            {complexity}
          </span>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold text-white ${zone.cls}`}>
          {zone.label}
        </span>
        <div className="flex overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          {(["train", "test"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDataset(d)}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                dataset === d
                  ? "bg-cyan-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300"
              }`}
            >
              {d === "train" ? "학습 데이터" : "테스트 데이터"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 결정경계 */}
        <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
          <div className="overflow-x-auto">
            <svg viewBox={`0 0 ${BW} ${BH}`} className="w-full min-w-[260px] max-w-full" role="img" aria-label="복잡도에 따른 결정경계">
              <rect x="20" y="20" width={BW - 40} height={BH - 40} fill="none" stroke="#e2e8f0" strokeWidth="1" />
              <path d={curvePath} fill="none" stroke="#0891b2" strokeWidth="2.4" />
              {marks.map((p, i) => {
                const cx = bx(p.x);
                const cy = by(p.y);
                const color = p.ok ? (p.label === 1 ? "#0f172a" : "#64748b") : "#dc2626";
                return p.label === 1 ? (
                  <g key={i}>
                    <line x1={cx - 3.6} y1={cy} x2={cx + 3.6} y2={cy} stroke={color} strokeWidth="1.8" />
                    <line x1={cx} y1={cy - 3.6} x2={cx} y2={cy + 3.6} stroke={color} strokeWidth="1.8" />
                  </g>
                ) : (
                  <rect key={i} x={cx - 3} y={cy - 3} width="6" height="6" fill="none" stroke={color} strokeWidth="1.6" />
                );
              })}
              <text x={bx(-1.5)} y={by(1.55)} fontSize="12" fontWeight="bold" fill="#0f172a">
                C1
              </text>
              <text x={bx(1.25)} y={by(-1.55)} fontSize="12" fontWeight="bold" fill="#64748b">
                C2
              </text>
            </svg>
          </div>
          <p className="pb-1 text-center text-xs text-gray-500">
            {dataset === "train" ? "학습 데이터" : "테스트 데이터"} 위의 결정경계 — 빨간 표시가 오분류
            데이터 ({wrongCount}개 / {activeSet.length}개)
          </p>
        </div>

        {/* 오차 곡선 */}
        <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
          <div className="overflow-x-auto">
            <svg viewBox={`0 0 ${EW} ${EH}`} className="w-full min-w-[260px] max-w-full" role="img" aria-label="복잡도에 따른 오차 곡선">
              {/* 구간 음영 */}
              <rect x={ex(1) - 6} y="14" width={ex(optimalComplexity) - ex(1) - 4} height={EH - 42} fill="#fef3c7" opacity="0.6" />
              <rect
                x={ex(optimalComplexity) + 4}
                y="14"
                width={ex(10) - ex(optimalComplexity)}
                height={EH - 42}
                fill="#fee2e2"
                opacity="0.6"
              />
              <text x={(ex(1) + ex(optimalComplexity)) / 2} y="26" textAnchor="middle" fontSize="10" fill="#b45309">
                과소적합
              </text>
              <text x={(ex(optimalComplexity) + ex(10)) / 2} y="26" textAnchor="middle" fontSize="10" fill="#b91c1c">
                과다적합
              </text>

              <line x1="34" y1={EH - 28} x2={EW - 14} y2={EH - 28} stroke="#94a3b8" strokeWidth="1" />
              <line x1="34" y1="14" x2="34" y2={EH - 28} stroke="#94a3b8" strokeWidth="1" />
              <text x="30" y="20" textAnchor="end" fontSize="10" fill="#64748b">
                오차
              </text>
              <text x={EW - 14} y={EH - 12} textAnchor="end" fontSize="10" fill="#64748b">
                복잡도
              </text>

              {/* 조기 종료 지점 */}
              <line
                x1={ex(optimalComplexity)}
                y1="14"
                x2={ex(optimalComplexity)}
                y2={EH - 28}
                stroke="#059669"
                strokeWidth="1.6"
                strokeDasharray="4 3"
              />
              <text x={ex(optimalComplexity) + 4} y={EH - 34} fontSize="10" fill="#047857" fontWeight="bold">
                조기 종료
              </text>

              <polyline
                points={COMPLEXITIES.map((c, i) => `${ex(c)},${ey(testCurve[i])}`).join(" ")}
                fill="none"
                stroke="#dc2626"
                strokeWidth="2.2"
              />
              <polyline
                points={COMPLEXITIES.map((c, i) => `${ex(c)},${ey(trainCurve[i])}`).join(" ")}
                fill="none"
                stroke="#0891b2"
                strokeWidth="2.2"
              />
              {COMPLEXITIES.map((c, i) => (
                <g key={c}>
                  <circle cx={ex(c)} cy={ey(testCurve[i])} r={c === complexity ? 4.5 : 2.4} fill="#dc2626" />
                  <circle cx={ex(c)} cy={ey(trainCurve[i])} r={c === complexity ? 4.5 : 2.4} fill="#0891b2" />
                </g>
              ))}
              <line
                x1={ex(complexity)}
                y1="14"
                x2={ex(complexity)}
                y2={EH - 28}
                stroke="#0f172a"
                strokeWidth="1"
                opacity="0.35"
              />
            </svg>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 pb-1 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 bg-cyan-600" /> 학습 오차 {currentTrain.toFixed(1)}%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 bg-red-600" /> 검증 오차 {currentTest.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-2 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
        <Flag size={16} className="mt-0.5 shrink-0" />
        <p className="leading-relaxed">
          <strong>조기 종료 early stopping</strong> — 별도의 검증용 데이터를 만들어 학습할 때마다 함께
          성능을 평가하고, 학습 오차는 계속 떨어지는데 어느 순간 검증 오차가 다시 올라가면 그 지점에서
          과다적합이 발생했다고 보고 학습을 멈춤. 이 실험에서는 복잡도 {optimalComplexity}이 그 지점.
        </p>
      </div>

      {/* 과다적합 */}
      <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangle size={18} className="text-red-600" />
          <h3 className="text-base font-bold text-red-800 dark:text-red-200">
            과다적합 (과적합) overfitting
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
          학습 시스템이 학습 데이터에 대해서만 지나치게 적합한 형태로 결정경계가 형성되는 현상.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-lg bg-white p-4 dark:bg-gray-900">
            <p className="text-xs font-bold text-gray-500">원인</p>
            <ul className="mt-1.5 space-y-1 text-sm text-gray-700 dark:text-gray-200">
              <li>· 학습 데이터의 확률적 잡음</li>
              <li>· 학습 데이터 개수의 부족</li>
            </ul>
          </div>
          <div className="rounded-lg bg-white p-4 dark:bg-gray-900">
            <p className="text-xs font-bold text-gray-500">영향</p>
            <p className="mt-1.5 text-sm text-gray-700 dark:text-gray-200">
              일반화 성능 저하 초래 — 일반화 오차가 커짐
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 dark:bg-gray-900">
            <p className="text-xs font-bold text-gray-500">복잡도를 조정하는 방법</p>
            <ul className="mt-1.5 space-y-1 text-sm text-gray-700 dark:text-gray-200">
              {overfitRemedies.map((r) => (
                <li key={r}>· {r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 고급 주제 */}
      <h3 className="mt-10 mb-3 text-base font-bold">머신러닝의 고급 주제</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {advancedTopics.map((t) => (
          <div
            key={t.name}
            className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
          >
            <p className="text-sm font-bold text-cyan-700 dark:text-cyan-300">{t.name}</p>
            <p className="text-[11px] text-gray-500">{t.english}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{t.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
