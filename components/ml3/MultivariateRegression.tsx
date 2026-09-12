"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";

/* ------------------------------------------------------------------ */
/* 행렬 유틸 — 외부 라이브러리 없이 직접 구현                             */
/* ------------------------------------------------------------------ */

type Mat = number[][];

function transpose(a: Mat): Mat {
  return a[0].map((_, j) => a.map((row) => row[j]));
}

function matMul(a: Mat, b: Mat): Mat {
  const n = a.length;
  const m = b[0].length;
  const k = b.length;
  const out: Mat = Array.from({ length: n }, () => new Array<number>(m).fill(0));
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < m; j += 1) {
      let s = 0;
      for (let t = 0; t < k; t += 1) s += a[i][t] * b[t][j];
      out[i][j] = s;
    }
  }
  return out;
}

/** 가우스-조던 소거로 정방행렬의 역행렬을 구함 (3×3 포함) */
function inverse(a: Mat): Mat | null {
  const n = a.length;
  const m: Mat = a.map((row, i) => [
    ...row,
    ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  ]);
  for (let col = 0; col < n; col += 1) {
    let pivot = col;
    for (let r = col + 1; r < n; r += 1) {
      if (Math.abs(m[r][col]) > Math.abs(m[pivot][col])) pivot = r;
    }
    if (Math.abs(m[pivot][col]) < 1e-12) return null;
    [m[col], m[pivot]] = [m[pivot], m[col]];
    const pv = m[col][col];
    for (let j = 0; j < 2 * n; j += 1) m[col][j] /= pv;
    for (let r = 0; r < n; r += 1) {
      if (r === col) continue;
      const f = m[r][col];
      if (f === 0) continue;
      for (let j = 0; j < 2 * n; j += 1) m[r][j] -= f * m[col][j];
    }
  }
  return m.map((row) => row.slice(n));
}

/* ------------------------------------------------------------------ */
/* 나이·몸무게 → 수축기 혈압 데모 데이터                                 */
/* ------------------------------------------------------------------ */

type Row = { age: number; weight: number; bp: number };

const DEMO_ROWS: Row[] = [
  { age: 35, weight: 60, bp: 114 },
  { age: 42, weight: 72, bp: 124 },
  { age: 50, weight: 68, bp: 127 },
  { age: 57, weight: 81, bp: 138 },
  { age: 63, weight: 75, bp: 141 },
  { age: 70, weight: 88, bp: 152 },
];

/* ------------------------------------------------------------------ */
/* 초평면 도식                                                          */
/* ------------------------------------------------------------------ */

function HyperplaneDiagram({ w }: { w: number[] | null }) {
  const ageMin = 30;
  const ageMax = 75;
  const wtMin = 55;
  const wtMax = 92;
  const bpMin = 100;
  const bpMax = 165;

  const nx = (age: number) => (age - ageMin) / (ageMax - ageMin);
  const ny = (wt: number) => (wt - wtMin) / (wtMax - wtMin);
  const nz = (bp: number) => (bp - bpMin) / (bpMax - bpMin);

  const proj = (x: number, y: number, z: number): [number, number] => [
    56 + x * 190 + y * 88,
    212 - z * 132 - y * 58,
  ];

  const planeZ = (age: number, wt: number) =>
    w ? w[0] + w[1] * age + w[2] * wt : (bpMin + bpMax) / 2;

  const corners: [number, number][] = [
    [ageMin, wtMin],
    [ageMax, wtMin],
    [ageMax, wtMax],
    [ageMin, wtMax],
  ];
  const planePts = corners
    .map(([a, b]) => proj(nx(a), ny(b), Math.min(1, Math.max(0, nz(planeZ(a, b))))))
    .map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`)
    .join(" ");

  const o = proj(0, 0, 0);
  const xAxis = proj(1.05, 0, 0);
  const yAxis = proj(0, 1.05, 0);
  const zAxis = proj(0, 0, 1.05);

  return (
    <svg viewBox="0 0 380 250" className="w-full" role="img" aria-label="나이와 몸무게에 대한 수축기 혈압 초평면">
      {/* 축 */}
      <line x1={o[0]} y1={o[1]} x2={xAxis[0]} y2={xAxis[1]} stroke="currentColor" className="text-gray-400" strokeWidth="1.5" />
      <line x1={o[0]} y1={o[1]} x2={yAxis[0]} y2={yAxis[1]} stroke="currentColor" className="text-gray-400" strokeWidth="1.5" />
      <line x1={o[0]} y1={o[1]} x2={zAxis[0]} y2={zAxis[1]} stroke="currentColor" className="text-gray-400" strokeWidth="1.5" />
      <text x={xAxis[0] + 2} y={xAxis[1] + 14} fontSize="10" fill="currentColor" className="text-gray-500">나이 x₁</text>
      <text x={yAxis[0] + 4} y={yAxis[1] + 4} fontSize="10" fill="currentColor" className="text-gray-500">몸무게 x₂</text>
      <text x={zAxis[0] - 16} y={zAxis[1] - 6} fontSize="10" fill="currentColor" className="text-gray-500">수축기 혈압 y</text>

      {/* 초평면 */}
      <polygon points={planePts} fill="#f97316" fillOpacity="0.22" stroke="#f97316" strokeWidth="1.5" />

      {/* 데이터 점과 수직선 */}
      {DEMO_ROWS.map((r) => {
        const base = proj(nx(r.age), ny(r.weight), 0);
        const top = proj(nx(r.age), ny(r.weight), Math.min(1, Math.max(0, nz(r.bp))));
        const onPlane = proj(
          nx(r.age),
          ny(r.weight),
          Math.min(1, Math.max(0, nz(planeZ(r.age, r.weight))))
        );
        return (
          <g key={`${r.age}-${r.weight}`}>
            <line x1={base[0]} y1={base[1]} x2={top[0]} y2={top[1]} stroke="currentColor" className="text-gray-300 dark:text-gray-600" strokeDasharray="2 2" />
            <line x1={onPlane[0]} y1={onPlane[1]} x2={top[0]} y2={top[1]} stroke="#e11d48" strokeWidth="1.8" />
            <circle cx={top[0]} cy={top[1]} r="4" fill="#1f2937" className="dark:fill-gray-100" />
          </g>
        );
      })}
      <text x="200" y="240" fontSize="9" textAnchor="middle" fill="currentColor" className="text-gray-400">
        빨간 세로선 = 각 데이터의 잔차
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 차원 검산 퀴즈 (n = 3, N = 5 고정)                                    */
/* ------------------------------------------------------------------ */

type DimQ = { q: string; options: string[]; answer: number; why: string };

const DIM_QUIZ: DimQ[] = [
  {
    q: "입력이 n = 3차원이고 데이터가 N = 5개일 때, 확장된 입력 x̃의 shape은?",
    options: ["3 × 1", "4 × 1", "5 × 1", "5 × 4"],
    answer: 1,
    why: "매개변수 w가 w₀부터 w₃까지 (n+1) = 4개이므로, 입력에도 상수값 요소 1을 추가하여 (n+1) × 1 = 4 × 1로 맞춘다.",
  },
  {
    q: "같은 조건에서 데이터 집합의 행렬 X의 shape은?",
    options: ["4 × 5", "5 × 3", "5 × 4", "4 × 4"],
    answer: 2,
    why: "X는 각 데이터의 x̃ᵢᵀ를 한 행씩 쌓은 것이므로 행이 데이터 개수 N = 5, 열이 (n+1) = 4가 되어 N × (n+1) = 5 × 4이다.",
  },
  {
    q: "y = Xw 에서 y의 shape은?",
    options: ["5 × 1", "4 × 1", "1 × 5", "5 × 4"],
    answer: 0,
    why: "(N × (n+1)) · ((n+1) × 1) = (5 × 4) · (4 × 1) = 5 × 1. 안쪽 차원 4가 상쇄되고 바깥 차원만 남는다.",
  },
];

/* ------------------------------------------------------------------ */
/* 최적 파라미터 전개 단계                                               */
/* ------------------------------------------------------------------ */

const DERIVATION = [
  { formula: "E(w) = (y − Xw)ᵀ(y − Xw)", note: "목표 출력값과 모델 출력값 차이에 대한 2차 노름 형태의 오차함수." },
  { formula: "∂E(w) / ∂w = 2Xᵀ(y − Xw) = 0", note: "오차함수를 매개변수 벡터 w에 대해 미분하여 0이 되는 점을 찾는다." },
  { formula: "2Xᵀy − 2XᵀXw = 0", note: "괄호를 전개한다." },
  { formula: "XᵀXw = Xᵀy", note: "양변을 2로 나누고 항을 옮긴다. 이를 정규방정식 형태라고 한다." },
  { formula: "w = (XᵀX)⁻¹Xᵀy", note: "양변에 (XᵀX)⁻¹를 곱하면 w가 남는다. 다변량에서도 매개변수는 주어진 데이터와 목표 출력값만으로 계산 가능." },
  { formula: "f(x_new) = wᵀx̃_new", note: "새로운 데이터의 예측. x̃_new는 x₁부터 x_n 앞에 1을 하나 추가한 것." },
];

/* ------------------------------------------------------------------ */

export default function MultivariateRegression() {
  const [n, setN] = useState(3);
  const [N, setNN] = useState(5);
  const [derivStep, setDerivStep] = useState(0);
  const [quizAns, setQuizAns] = useState<(number | null)[]>([null, null, null]);

  const [rows, setRows] = useState<Row[]>(DEMO_ROWS);
  const [predAge, setPredAge] = useState("48");
  const [predWeight, setPredWeight] = useState("74");

  const fit = useMemo(() => {
    const X: Mat = rows.map((r) => [1, r.age, r.weight]);
    const y: Mat = rows.map((r) => [r.bp]);
    const Xt = transpose(X);
    const XtX = matMul(Xt, X);
    const Xty = matMul(Xt, y);
    const inv = inverse(XtX);
    if (!inv) return null;
    const wMat = matMul(inv, Xty);
    const w = wMat.map((r) => r[0]);
    const preds = rows.map((r) => w[0] + w[1] * r.age + w[2] * r.weight);
    const residuals = rows.map((r, i) => r.bp - preds[i]);
    const sse = residuals.reduce((s, e) => s + e * e, 0);
    return { X, XtX, Xty, inv, w, preds, residuals, sse };
  }, [rows]);

  const predAgeNum = Number(predAge);
  const predWeightNum = Number(predWeight);
  const predValid =
    fit !== null && Number.isFinite(predAgeNum) && Number.isFinite(predWeightNum);
  const predBp = predValid ? fit.w[0] + fit.w[1] * predAgeNum + fit.w[2] * predWeightNum : null;

  const setBp = (idx: number, raw: string) => {
    const v = Number(raw);
    if (!Number.isFinite(v)) return;
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, bp: v } : r)));
  };

  const shapes: [string, string, string][] = [
    ["x̃", `${n + 1} × 1`, "입력에 상수값 요소 1을 추가한 확장 입력"],
    ["w", `${n + 1} × 1`, "w₀ ~ w_n, 총 (n+1)개의 파라미터"],
    ["f(x) = wᵀx̃", `(1 × ${n + 1}) · (${n + 1} × 1) = 1 × 1`, "하나의 실수값이 나옴"],
    ["X", `${N} × ${n + 1}`, "각 데이터의 x̃ᵢᵀ를 한 행씩 쌓은 것"],
    ["y = Xw", `(${N} × ${n + 1}) · (${n + 1} × 1) = ${N} × 1`, "N개 데이터의 출력 벡터"],
    ["XᵀX", `${n + 1} × ${n + 1}`, "역행렬을 취할 수 있는 정방행렬"],
    ["Xᵀy", `${n + 1} × 1`, "w와 같은 shape"],
    ["w = (XᵀX)⁻¹Xᵀy", `(${n + 1} × ${n + 1}) · (${n + 1} × 1) = ${n + 1} × 1`, "최종 파라미터"],
  ];

  return (
    <section>
      <SectionTitle
        title="05. 다변량 선형회귀"
        subtitle="여러 개의 입력을 사용하여 하나의 출력을 예측 — n차원 공간에서 초평면을 찾는 문제"
      />

      {/* 개념 + 초평면 */}
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-800 dark:bg-orange-950">
          <p className="text-sm text-gray-700 dark:text-gray-200">
            입력이 여러 개의 값으로 구성되는 경우, 하나의 입력 x를 <strong>n차원 입력 벡터</strong>
            <span className="ml-1 font-mono">x = (x₁, x₂, ⋯, x_n)</span> 으로 나타냄.
          </p>
          <div className="mt-4 rounded-lg border border-orange-200 bg-white p-4 dark:border-orange-800 dark:bg-gray-900">
            <p className="text-xs text-gray-500 dark:text-gray-400">회귀함수</p>
            <p className="mt-1 overflow-x-auto font-mono text-sm font-bold text-orange-700 dark:text-orange-300">
              f(x) = w₀ + w₁x₁ + w₂x₂ + ⋯ + w_n x_n
            </p>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
              추정이 필요한 파라미터는 (w₀, w₁, ⋯, w_n) 총 <strong>(n + 1)개</strong>.
            </p>
          </div>
          <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-gray-700 dark:border-amber-700 dark:bg-amber-950 dark:text-gray-200">
            <strong className="text-amber-700 dark:text-amber-300">초평면</strong> — 2차원에서는 직선이지만 3차원부터는 평면이고,
            그 이상은 그릴 수 없으므로 초평면이라 부름. 입출력 관계를 설명하는 n차원 공간의 초평면을 찾는 문제.
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <p className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-200">나이와 몸무게에 따른 수축기 혈압</p>
          <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
            입력 2개 → 3차원 공간의 평면. 아래 계산 데모의 w가 이 평면을 결정함.
          </p>
          <HyperplaneDiagram w={fit ? fit.w : null} />
        </div>
      </div>

      {/* 행렬 표현 + 차원 검산 */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-200">행렬 형태의 표현과 차원 검산</h3>
        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          입력 차원 n과 데이터 개수 N을 바꾸면 각 행렬의 shape이 어떻게 달라지는지 확인.
        </p>

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-300">
              <span>입력 차원 n</span>
              <span className="font-mono text-orange-600 dark:text-orange-300">{n}</span>
            </span>
            <input
              type="range"
              min={1}
              max={6}
              step={1}
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
              className="mt-1 w-full accent-orange-500"
            />
          </label>
          <label className="block">
            <span className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-300">
              <span>데이터 개수 N</span>
              <span className="font-mono text-orange-600 dark:text-orange-300">{N}</span>
            </span>
            <input
              type="range"
              min={2}
              max={12}
              step={1}
              value={N}
              onChange={(e) => setNN(Number(e.target.value))}
              className="mt-1 w-full accent-orange-500"
            />
          </label>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full min-w-[460px] text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              <tr>
                <th className="px-3 py-2 text-left font-medium">기호</th>
                <th className="px-3 py-2 text-left font-medium">shape</th>
                <th className="px-3 py-2 text-left font-medium">의미</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {shapes.map(([sym, shape, meaning]) => (
                <tr key={sym}>
                  <td className="whitespace-nowrap px-3 py-2 font-mono text-gray-800 dark:text-gray-100">{sym}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-mono text-orange-600 dark:text-orange-300">{shape}</td>
                  <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="overflow-x-auto rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
            <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">하나의 데이터에 대한 행렬 표현</p>
            <p className="min-w-max font-mono text-xs text-gray-800 dark:text-gray-100">
              x̃ = [1; x₁; x₂; ⋯; x_n],&nbsp; w = [w₀; w₁; ⋯; w_n]
            </p>
            <p className="mt-1 min-w-max font-mono text-xs text-gray-800 dark:text-gray-100">
              f(x) = [w₀, w₁, ⋯, w_n] · [1; x₁; ⋯; x_n] = wᵀx̃
            </p>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
            <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">데이터 집합에 대한 행렬 표현</p>
            <p className="min-w-max font-mono text-xs text-gray-800 dark:text-gray-100">
              X = [1, x₁ᵀ; 1, x₂ᵀ; ⋯; 1, x_Nᵀ] = [x̃₁ᵀ; x̃₂ᵀ; ⋯; x̃_Nᵀ]
            </p>
            <p className="mt-1 min-w-max font-mono text-xs text-gray-800 dark:text-gray-100">
              y = [y₁; y₂; ⋯; y_N] = Xw
            </p>
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          매개변수 w는 (n+1)차원인데 입력 x는 n차원이므로, 차원을 맞추기 위해 입력에 <strong>상수값 요소 1을 추가</strong>하여 x̃를 만듦.
        </p>
      </div>

      {/* 차원 검산 퀴즈 */}
      <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950">
        <h3 className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-200">차원 검산 퀴즈</h3>
        <p className="mb-4 text-xs text-gray-600 dark:text-gray-300">입력 차원 n = 3, 데이터 개수 N = 5인 경우를 기준으로 답하기.</p>
        <div className="space-y-4">
          {DIM_QUIZ.map((q, qi) => {
            const chosen = quizAns[qi];
            return (
              <div key={q.q} className="rounded-lg border border-amber-200 bg-white p-4 dark:border-amber-800 dark:bg-gray-900">
                <p className="mb-3 text-sm font-medium text-gray-800 dark:text-gray-100">
                  {qi + 1}. {q.q}
                </p>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt, oi) => {
                    let cls =
                      "border-gray-200 bg-gray-50 text-gray-700 hover:bg-amber-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-amber-900/20";
                    if (chosen !== null) {
                      if (oi === q.answer)
                        cls = "border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-300";
                      else if (oi === chosen)
                        cls = "border-rose-400 bg-rose-50 text-rose-700 dark:border-rose-600 dark:bg-rose-950 dark:text-rose-300";
                      else cls = "border-gray-200 bg-gray-50 text-gray-400 opacity-60 dark:border-gray-700 dark:bg-gray-800";
                    }
                    return (
                      <button
                        key={opt}
                        onClick={() =>
                          setQuizAns((prev) => prev.map((v, i) => (i === qi ? (v === null ? oi : v) : v)))
                        }
                        disabled={chosen !== null}
                        className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors ${cls}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                <AnimatePresence>
                  {chosen !== null && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                        {chosen === q.answer ? (
                          <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />
                        ) : (
                          <XCircle size={14} className="mt-0.5 shrink-0 text-rose-500" />
                        )}
                        <span>{q.why}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        {quizAns.every((v) => v !== null) && (
          <button
            onClick={() => setQuizAns([null, null, null])}
            className="mt-4 flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:bg-gray-900 dark:text-amber-300"
          >
            <RotateCcw size={13} /> 다시 풀기
          </button>
        )}
      </div>

      {/* 최적 파라미터 유도 */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">오차함수와 최적 파라미터 w</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setDerivStep((s) => Math.max(0, s - 1))}
              disabled={derivStep === 0}
              className="rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-600 disabled:opacity-30 dark:border-gray-700 dark:text-gray-300"
            >
              이전
            </button>
            <button
              onClick={() => setDerivStep((s) => Math.min(DERIVATION.length - 1, s + 1))}
              disabled={derivStep === DERIVATION.length - 1}
              className="rounded-lg bg-orange-500 px-3 py-1 text-xs font-medium text-white disabled:opacity-30"
            >
              다음 단계
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {DERIVATION.map((d, i) => (
            <motion.div
              key={d.formula}
              animate={{ opacity: i <= derivStep ? 1 : 0.22 }}
              className={`rounded-lg border p-3 ${
                i === derivStep
                  ? "border-orange-400 bg-orange-50 dark:border-orange-600 dark:bg-orange-950"
                  : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
              }`}
            >
              <div className="overflow-x-auto">
                <p className="min-w-max font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {i <= derivStep ? d.formula : "· · ·"}
                </p>
              </div>
              {i === derivStep && (
                <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-300">{d.note}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 2입력 실제 계산 데모 */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
            2입력 실제 계산 — w = (XᵀX)⁻¹Xᵀy
          </h3>
          <button
            onClick={() => setRows(DEMO_ROWS)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <RotateCcw size={13} /> 데이터 초기화
          </button>
        </div>
        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          나이(x₁)·몸무게(x₂)로 수축기 혈압(y)을 예측. 혈압 값을 바꾸면 3 × 3 역행렬부터 다시 계산됨.
        </p>

        {!fit && (
          <div className="rounded-lg border border-rose-300 bg-rose-50 p-4 text-xs text-rose-700 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-300">
            XᵀX 의 역행렬이 존재하지 않아 w = (XᵀX)⁻¹Xᵀy 를 계산할 수 없음. 입력 열이 서로 비례하거나 데이터 개수가
            파라미터 개수보다 적으면 이런 상태가 됨. 데이터를 초기화하면 다시 계산됨.
          </div>
        )}

        {fit && (
          <>
            <div className="mb-4 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full min-w-[460px] text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">1</th>
                    <th className="px-3 py-2 text-left font-medium">나이 x₁</th>
                    <th className="px-3 py-2 text-left font-medium">몸무게 x₂</th>
                    <th className="px-3 py-2 text-left font-medium">혈압 y</th>
                    <th className="px-3 py-2 text-right font-medium">예측 f(x)</th>
                    <th className="px-3 py-2 text-right font-medium">잔차</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {rows.map((r, i) => (
                    <tr key={`${r.age}-${r.weight}`}>
                      <td className="px-3 py-1.5 font-mono text-gray-400">1</td>
                      <td className="px-3 py-1.5 font-mono">{r.age}</td>
                      <td className="px-3 py-1.5 font-mono">{r.weight}</td>
                      <td className="px-3 py-1.5">
                        <input
                          type="number"
                          step={1}
                          value={r.bp}
                          onChange={(e) => setBp(i, e.target.value)}
                          className="w-20 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-xs dark:border-gray-700 dark:bg-gray-800"
                        />
                      </td>
                      <td className="px-3 py-1.5 text-right font-mono text-orange-600 dark:text-orange-300">
                        {fit.preds[i].toFixed(2)}
                      </td>
                      <td
                        className={`px-3 py-1.5 text-right font-mono ${
                          fit.residuals[i] >= 0 ? "text-rose-600 dark:text-rose-400" : "text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {fit.residuals[i] >= 0 ? "+" : "−"}
                        {Math.abs(fit.residuals[i]).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <MatrixCard title="XᵀX  (3 × 3)" m={fit.XtX} digits={0} />
              <MatrixCard title="(XᵀX)⁻¹  (3 × 3)" m={fit.inv} digits={5} />
              <MatrixCard title="Xᵀy  (3 × 1)" m={fit.Xty} digits={0} />
            </div>

            <div className="mt-4 rounded-lg border-2 border-orange-400 bg-orange-50 p-4 dark:border-orange-600 dark:bg-orange-950">
              <p className="text-xs text-gray-500 dark:text-gray-400">w = (XᵀX)⁻¹Xᵀy</p>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {["w₀ (절편)", "w₁ (나이)", "w₂ (몸무게)"].map((label, i) => (
                  <div key={label} className="rounded-lg bg-white p-3 text-center dark:bg-gray-900">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="mt-1 font-mono text-base font-bold text-orange-700 dark:text-orange-300">
                      {fit.w[i].toFixed(4)}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-3 overflow-x-auto font-mono text-xs text-gray-700 dark:text-gray-200">
                f(x) = {fit.w[0].toFixed(3)} + {fit.w[1].toFixed(3)}·나이 + {fit.w[2].toFixed(3)}·몸무게
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">잔차 제곱합 Σeᵢ² = {fit.sse.toFixed(4)}</p>
            </div>

            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <p className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                새로운 데이터의 예측 — f(x_new) = wᵀx̃_new
              </p>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <label className="text-gray-600 dark:text-gray-300">나이</label>
                <input
                  type="number"
                  value={predAge}
                  onChange={(e) => setPredAge(e.target.value)}
                  className="w-20 rounded border border-gray-200 bg-white px-2 py-1 font-mono text-xs dark:border-gray-700 dark:bg-gray-900"
                />
                <label className="text-gray-600 dark:text-gray-300">몸무게</label>
                <input
                  type="number"
                  value={predWeight}
                  onChange={(e) => setPredWeight(e.target.value)}
                  className="w-20 rounded border border-gray-200 bg-white px-2 py-1 font-mono text-xs dark:border-gray-700 dark:bg-gray-900"
                />
                <span className="text-gray-400">→</span>
                <span className="rounded-lg bg-fuchsia-100 px-3 py-1 font-mono text-sm font-bold text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300">
                  수축기 혈압 {predBp === null ? "—" : predBp.toFixed(2)}
                </span>
              </div>
              <p className="mt-2 font-mono text-[11px] text-gray-500 dark:text-gray-400">
                x̃_new = [1; {predAge}; {predWeight}]
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function MatrixCard({ title, m, digits }: { title: string; m: Mat; digits: number }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
      <p className="mb-2 font-mono text-xs text-gray-500 dark:text-gray-400">{title}</p>
      <div className="overflow-x-auto">
        <table className="min-w-max font-mono text-[11px]">
          <tbody>
            {m.map((row, i) => (
              <tr key={i}>
                {row.map((v, j) => (
                  <td key={j} className="px-1.5 py-0.5 text-right text-gray-800 dark:text-gray-100">
                    {v.toFixed(digits)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
