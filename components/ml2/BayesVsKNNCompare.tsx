"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { ChevronDown } from "lucide-react";

/* ---------- 데이터 (결정론적 생성 — 서버·클라이언트 동일) ---------- */

type Pt = { x: number; y: number; c: 0 | 1 };

function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

const NONLINEAR: Pt[] = (() => {
  const rnd = makeRng(97531);
  const pts: Pt[] = [];
  for (let i = 0; i < 60; i++) {
    const t = (Math.PI * i) / 59;
    pts.push({
      x: 3.0 + 2.6 * Math.cos(t) + (rnd() - 0.5) * 0.6,
      y: 3.0 + 2.6 * Math.sin(t) + (rnd() - 0.5) * 0.6,
      c: 0,
    });
    pts.push({
      x: 5.0 + 2.6 * Math.cos(t) + (rnd() - 0.5) * 0.6,
      y: 4.2 - 2.6 * Math.sin(t) + (rnd() - 0.5) * 0.6,
      c: 1,
    });
  }
  return pts;
})();

const LINEAR: Pt[] = (() => {
  const rnd = makeRng(13579);
  const g = () => {
    const u = Math.max(rnd(), 1e-6);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd());
  };
  const pts: Pt[] = [];
  for (let i = 0; i < 60; i++) {
    pts.push({ x: 2.4 + g() * 0.85, y: 2.6 + g() * 0.85, c: 0 });
    pts.push({ x: 5.6 + g() * 0.85, y: 5.4 + g() * 0.85, c: 1 });
  }
  return pts;
})();

/* ---------- 분류기 (직접 구현) ---------- */

type Gauss = { mx: number; my: number; a: number; b: number; c: number; lnDet: number };

function fitGaussian(data: Pt[], cls: 0 | 1): Gauss {
  const sub = data.filter((p) => p.c === cls);
  const n = sub.length;
  const mx = sub.reduce((s, p) => s + p.x, 0) / n;
  const my = sub.reduce((s, p) => s + p.y, 0) / n;
  let a = 0;
  let b = 0;
  let c = 0;
  sub.forEach((p) => {
    a += (p.x - mx) ** 2;
    b += (p.x - mx) * (p.y - my);
    c += (p.y - my) ** 2;
  });
  a /= n;
  b /= n;
  c /= n;
  const det = Math.max(a * c - b * b, 1e-9);
  return { mx, my, a, b, c, lnDet: Math.log(det) };
}

function gaussScore(g: Gauss, x: number, y: number): number {
  const dx = x - g.mx;
  const dy = y - g.my;
  const det = Math.max(g.a * g.c - g.b * g.b, 1e-9);
  const ix = (g.c * dx - g.b * dy) / det;
  const iy = (-g.b * dx + g.a * dy) / det;
  return dx * ix + dy * iy + g.lnDet; // 작을수록 그 클래스
}

function knnClass(data: Pt[], x: number, y: number, k: number): 0 | 1 {
  const ds = data
    .map((p) => ({ d: (p.x - x) ** 2 + (p.y - y) ** 2, c: p.c }))
    .sort((u, v) => u.d - v.d)
    .slice(0, k);
  const v0 = ds.filter((d) => d.c === 0).length;
  return v0 >= ds.length - v0 ? 0 : 1;
}

const D_MAX = 8;
const GRID = 48;
const COLOR1 = "#8b5cf6";
const COLOR2 = "#d946ef";

type Run = { row: number; from: number; to: number; cls: number };

function buildRuns(classify: (x: number, y: number) => 0 | 1): Run[] {
  const cell = D_MAX / GRID;
  const runs: Run[] = [];
  for (let r = 0; r < GRID; r++) {
    const yv = (r + 0.5) * cell;
    let start = 0;
    let cur = -1;
    for (let c = 0; c < GRID; c++) {
      const cls = classify((c + 0.5) * cell, yv);
      if (c === 0) {
        cur = cls;
        start = 0;
      } else if (cls !== cur) {
        runs.push({ row: r, from: start, to: c, cls: cur });
        cur = cls;
        start = c;
      }
    }
    runs.push({ row: r, from: start, to: GRID, cls: cur });
  }
  return runs;
}

/* ---------- 비교표 ---------- */

const compareRows = [
  {
    bayes: "각 클래스에 대한 확률분포함수를 가우시안으로 미리 가정하고 추정",
    knn: "확률분포 모델을 미리 가정하지 않고 데이터 집합을 이용하여 추정",
  },
  {
    bayes: "학습 데이터를 통해 평균과 표준편차만 추정하여 활용",
    knn: "새 데이터가 주어질 때마다 학습 데이터 전체와의 거리 계산이 필요",
  },
];

const bayesConclusion = "→ 분류 과정에서 학습 데이터 불필요";
const knnConclusion = ["→ 항상 학습 데이터 필요 / 저장", "→ 비용(계산량, 메모리) 증가"];

/* ---------- 그 밖의 분류기들 ---------- */

const others = [
  {
    name: "로지스틱 회귀",
    chapter: "교재 5장",
    summary: "회귀 기법을 분류 문제로 확장",
    detail: [
      "연속값을 예측하는 회귀 기법을 클래스 확률 예측에 맞게 바꾸어 분류에 사용.",
      "2강에서 다룬 확률 기반 관점과 이어지며, 3강 회귀와 함께 살펴보게 됨.",
    ],
  },
  {
    name: "결정 트리",
    chapter: "교재 9장",
    summary: "속성들의 정보를 순차적으로 적용하여 분류",
    detail: [
      "속성 조건을 차례로 적용하여 데이터를 나누어 가며 클래스를 결정.",
      "판단 결과에 대한 설명력이 우수.",
    ],
  },
  {
    name: "서포트벡터머신(SVM)",
    chapter: "교재 10장",
    summary: "결정경계의 마진을 최대화하는 목적함수 사용",
    detail: [
      "결정경계와 가장 가까운 데이터 사이의 여유(마진)를 최대로 만드는 경계를 찾음.",
      "일반화 성능이 우수.",
    ],
  },
  {
    name: "신경망(딥러닝 모델)",
    chapter: "교재 11장 ~",
    summary: "복잡한 결정경계를 신경망 모델로 정의하여 학습",
    detail: [
      "복잡한 결정경계를 신경망 모델로 정의하고 데이터로부터 학습.",
      "특징추출 단계까지 한 번에 학습.",
    ],
  },
];

export default function BayesVsKNNCompare() {
  const [nonlinear, setNonlinear] = useState(true);
  const [openCard, setOpenCard] = useState<string | null>(null);

  const data = nonlinear ? NONLINEAR : LINEAR;

  const panels = useMemo(() => {
    const g0 = fitGaussian(data, 0);
    const g1 = fitGaussian(data, 1);
    const bayes = buildRuns((x, y) => (gaussScore(g0, x, y) <= gaussScore(g1, x, y) ? 0 : 1));
    const knn = buildRuns((x, y) => knnClass(data, x, y, 5));

    const err = (classify: (x: number, y: number) => 0 | 1) =>
      data.filter((p) => classify(p.x, p.y) !== p.c).length / data.length;

    return {
      bayes,
      knn,
      bayesErr: err((x, y) => (gaussScore(g0, x, y) <= gaussScore(g1, x, y) ? 0 : 1)),
      knnErr: err((x, y) => knnClass(data, x, y, 5)),
    };
  }, [data]);

  return (
    <section>
      <SectionTitle
        title="가우시안 베이즈 분류기 vs K-최근접이웃 분류기"
        subtitle="확률 기반 방법과 데이터 기반 방법의 차이"
      />

      {/* 비교표 */}
      <div className="mb-8 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="bg-violet-50 px-4 py-3 font-bold text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                가우시안 베이즈 분류기
              </th>
              <th className="bg-fuchsia-50 px-4 py-3 font-bold text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300">
                K-최근접이웃 분류기
              </th>
            </tr>
          </thead>
          <tbody>
            {compareRows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                <td className="px-4 py-3 align-top text-gray-700 dark:text-gray-300">· {row.bayes}</td>
                <td className="px-4 py-3 align-top text-gray-700 dark:text-gray-300">· {row.knn}</td>
              </tr>
            ))}
            <tr>
              <td className="bg-violet-50 px-4 py-3 align-top font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                {bayesConclusion}
              </td>
              <td className="bg-fuchsia-50 px-4 py-3 align-top font-medium text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300">
                {knnConclusion.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 비선형 분포 토글 */}
      <h3 className="mb-2 text-base font-bold">데이터 분포가 복잡한 비선형 구조를 가지는 경우</h3>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setNonlinear(true)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            nonlinear
              ? "bg-violet-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          비선형 분포
        </button>
        <button
          onClick={() => setNonlinear(false)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            !nonlinear
              ? "bg-violet-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          가우시안에 가까운 분포
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          { title: "가우시안 베이즈 분류기", runs: panels.bayes, err: panels.bayesErr, tone: "violet" },
          { title: "K-최근접이웃 분류기 (K = 5)", runs: panels.knn, err: panels.knnErr, tone: "fuchsia" },
        ].map((panel) => (
          <div
            key={panel.title}
            className="rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900"
          >
            <p
              className={`px-2 pt-1 text-xs font-bold ${
                panel.tone === "violet"
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-fuchsia-600 dark:text-fuchsia-400"
              }`}
            >
              {panel.title}
            </p>
            <svg viewBox="0 0 200 200" className="w-full">
              {panel.runs.map((run, i) => (
                <rect
                  key={i}
                  x={(run.from / GRID) * 200}
                  y={200 - ((run.row + 1) / GRID) * 200}
                  width={((run.to - run.from) / GRID) * 200}
                  height={200 / GRID + 0.3}
                  fill={run.cls === 0 ? COLOR1 : COLOR2}
                  opacity={0.18}
                />
              ))}
              {data.map((p, i) => (
                <circle
                  key={i}
                  cx={(p.x / D_MAX) * 200}
                  cy={200 - (p.y / D_MAX) * 200}
                  r="2"
                  fill={p.c === 0 ? COLOR1 : COLOR2}
                />
              ))}
            </svg>
            <p className="px-2 pb-1 text-[11px] text-gray-500">
              학습 데이터에 대한 분류오차 {(panel.err * 100).toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
        가우시안 베이즈 분류기는 클래스마다 하나의 가우시안을 가정하므로 결정경계가 매끄러운 형태로 제한되는 반면, K-최근접이웃 분류기는 분포 모델을 가정하지 않아 데이터를 따라 구부러지는 결정경계를 만들 수 있음.
      </p>

      {/* 그 밖의 분류기들 */}
      <h3 className="mb-2 mt-8 text-base font-bold">그 밖의 분류기들</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {others.map((o) => {
          const open = openCard === o.name;
          return (
            <button
              key={o.name}
              onClick={() => setOpenCard(open ? null : o.name)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                open
                  ? "border-violet-300 bg-violet-50 dark:border-violet-700 dark:bg-violet-950"
                  : "border-gray-200 bg-white hover:border-violet-300 dark:border-gray-800 dark:bg-gray-900"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold">{o.name}</p>
                  <p className="mt-0.5 text-[11px] text-gray-400">{o.chapter}</p>
                </div>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{o.summary}</p>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 space-y-1 overflow-hidden"
                  >
                    {o.detail.map((d, i) => (
                      <li key={i} className="flex gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="text-violet-400">·</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </section>
  );
}
