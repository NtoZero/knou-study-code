"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { Target } from "lucide-react";

/* ── 원영상 래스터 (결정론적으로 생성) ───────────────────── */

const SIZE = 24;

function rasterize(): number[][] {
  const g: number[][] = Array.from({ length: SIZE }, () => new Array(SIZE).fill(0));
  const stroke = (x0: number, y0: number, x1: number, y1: number, w: number) => {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 4;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const cx = x0 + (x1 - x0) * t;
      const cy = y0 + (y1 - y0) * t;
      for (let dy = -w; dy <= w; dy++) {
        for (let dx = -w; dx <= w; dx++) {
          const px = Math.round(cx + dx);
          const py = Math.round(cy + dy);
          if (px >= 0 && px < SIZE && py >= 0 && py < SIZE) g[py][px] = 1;
        }
      }
    }
  };
  // 필기 숫자 '4' 모양의 세 획
  stroke(14, 2, 4, 14, 1);
  stroke(4, 14, 19, 14, 1);
  stroke(15, 2, 15, 21, 1);
  return g;
}

const image = rasterize();
const onPixelCount = image.flat().filter((v) => v === 1).length;

/** 2×2 블록 평균 → 12×12 격자 특징 */
const gridFeature: number[][] = Array.from({ length: SIZE / 2 }, (_, r) =>
  Array.from({ length: SIZE / 2 }, (_, c) => {
    const sum =
      image[r * 2][c * 2] + image[r * 2][c * 2 + 1] + image[r * 2 + 1][c * 2] + image[r * 2 + 1][c * 2 + 1];
    return sum / 4;
  })
);

/** 수직 방향으로 검은 화소가 몇 개 있는지 */
const verticalHistogram: number[] = Array.from({ length: SIZE }, (_, c) =>
  image.reduce((acc, row) => acc + row[c], 0)
);

/** 8방향 성분 — 켜진 화소가 어느 방향의 이웃과 이어지는지 집계 */
const directionLabels = ["→", "↗", "↑", "↖", "←", "↙", "↓", "↘"];
const directionOffsets: [number, number][] = [
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];
const directionFeature: number[] = (() => {
  const counts = new Array(8).fill(0);
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (image[r][c] !== 1) continue;
      directionOffsets.forEach(([dx, dy], k) => {
        const nc = c + dx;
        const nr = r + dy;
        if (nc >= 0 && nc < SIZE && nr >= 0 && nr < SIZE && image[nr][nc] === 1) counts[k] += 1;
      });
    }
  }
  return counts;
})();
const directionMax = Math.max(...directionFeature);

/* ── 사영용 점 구름 (모듈 로드 시 한 번만, 결정론적) ─────── */

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

interface Pt {
  x: number;
  y: number;
}

const cloud: Pt[] = (() => {
  const rand = mulberry32(777001);
  const pts: Pt[] = [];
  const theta = (25 * Math.PI) / 180;
  for (let i = 0; i < 140; i++) {
    const u1 = Math.max(rand(), 1e-9);
    const u2 = rand();
    const r = Math.sqrt(-2 * Math.log(u1));
    const a = r * Math.cos(2 * Math.PI * u2) * 2.1; // 긴 축
    const b = r * Math.sin(2 * Math.PI * u2) * 0.55; // 짧은 축
    pts.push({
      x: a * Math.cos(theta) - b * Math.sin(theta),
      y: a * Math.sin(theta) + b * Math.cos(theta),
    });
  }
  return pts;
})();

function projectedVariance(angleDeg: number): number {
  const rad = (angleDeg * Math.PI) / 180;
  const ux = Math.cos(rad);
  const uy = Math.sin(rad);
  const vals = cloud.map((p) => p.x * ux + p.y * uy);
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  return vals.reduce((a, v) => a + (v - mean) ** 2, 0) / vals.length;
}

const maxVariance = (() => {
  let m = 0;
  for (let d = 0; d < 180; d++) m = Math.max(m, projectedVariance(d));
  return m;
})();

/* ── 탭 정의 ───────────────────────────────────────────── */

const tabs = [
  { key: "raw", label: "원영상", meta: "120 × 120 → flatten 14,400차원" },
  { key: "grid", label: "격자 특징", meta: "12 × 12 = 144차원" },
  { key: "hist", label: "수직 히스토그램", meta: "열마다 검은 화소 개수" },
  { key: "dir", label: "방향 성분", meta: "8개 방향 정보" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const tabNotes: Record<TabKey, string> = {
  raw: "120×120 영상을 flatten하면 14,400차원이 되어 매우 큼. 이대로 다루면 계산량과 메모리 비용이 과도하게 커짐.",
  grid: "수평·수직으로 각각 12개씩 나눠 격자를 만들고, 각 격자 안에 검은 화소가 얼마나 많은지에 따라 진하게/옅게 표현하면 144차원으로 표현 가능.",
  hist: "수직 방향으로 검은 화소가 몇 개 있는지를 세어 나타내는 특징.",
  dir: "8개 방향 정보를 이용해, 글씨를 쓸 때 어떤 방향으로 먼저 쓰는지를 나타내는 특징.",
};

/* ── 본문 ──────────────────────────────────────────────── */

const P_VIEW = 260;
const P_MID = P_VIEW / 2;
const P_SCALE = 26; // 1 단위 = 26px

const px = (v: number) => P_MID + v * P_SCALE;
const py = (v: number) => P_MID - v * P_SCALE;

export default function FeatureExtractionLab() {
  const [tab, setTab] = useState<TabKey>("raw");
  const [x1, setX1] = useState(2);
  const [x2, setX2] = useState(3);
  const [angle, setAngle] = useState(45);
  const [showLectureCase, setShowLectureCase] = useState(false);

  const rad = (angle * Math.PI) / 180;
  const ux = Math.cos(rad);
  const uy = Math.sin(rad);
  const feature = x1 * ux + x2 * uy;
  const footX = feature * ux;
  const footY = feature * uy;

  const variance = useMemo(() => projectedVariance(angle), [angle]);
  const varRatio = variance / maxVariance;

  const projected = useMemo(() => cloud.map((p) => p.x * ux + p.y * uy), [ux, uy]);

  return (
    <section>
      <SectionTitle
        title="특징추출"
        subtitle="주어진 데이터를 처리하는 데 핵심이 되는 정보를 추출하는 것"
      />

      <div className="mb-6 rounded-xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-900 dark:bg-cyan-950/40">
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
          <strong>목적</strong> — 비용(계산량, 메모리) 절감, 데이터에 포함된 불필요한 정보 제거.
        </p>
      </div>

      {/* 특징 종류 탭 */}
      <div className="mb-3 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-cyan-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-10 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <div className="grid gap-6 md:grid-cols-[auto_1fr]">
          {/* 원영상은 항상 왼쪽에 기준으로 표시 */}
          <div>
            <div
              className="grid gap-px overflow-hidden rounded"
              style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))`, width: 168 }}
            >
              {image.flat().map((v, i) => (
                <div
                  key={i}
                  className={`aspect-square ${
                    v === 1 ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-100 dark:bg-gray-800"
                  }`}
                />
              ))}
            </div>
            <p className="mt-2 text-center text-xs text-gray-500">원영상 (120 × 120)</p>
            <p className="text-center text-[11px] text-gray-400">검은 화소 {onPixelCount}개</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <p className="text-sm font-bold text-cyan-700 dark:text-cyan-300">
                {tabs.find((t) => t.key === tab)!.label}
                <span className="ml-2 text-xs font-normal text-gray-500">
                  {tabs.find((t) => t.key === tab)!.meta}
                </span>
              </p>
              <p className="mt-1 mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {tabNotes[tab]}
              </p>

              {tab === "raw" && (
                <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  <p className="font-mono text-xs">
                    120 × 120 = 14,400 → x = [x1, x2, …, x14400]<sup>T</sup>
                  </p>
                  <p className="mt-2">
                    이렇게 큰 차원을 그대로 쓰는 대신, 아래 세 가지처럼 핵심이 되는 정보만 뽑아내는 것이
                    특징추출.
                  </p>
                </div>
              )}

              {tab === "grid" && (
                <div>
                  <div
                    className="grid gap-px overflow-hidden rounded"
                    style={{ gridTemplateColumns: `repeat(${SIZE / 2}, minmax(0, 1fr))`, width: 168 }}
                  >
                    {gridFeature.flat().map((v, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-cyan-600"
                        style={{ opacity: 0.12 + v * 0.88 }}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    격자 안의 검은 화소 비율이 높을수록 진하게 표현 — 144개의 값으로 축소.
                  </p>
                </div>
              )}

              {tab === "hist" && (
                <div className="overflow-x-auto">
                  <div className="flex min-w-[260px] items-end gap-0.5" style={{ height: 120 }}>
                    {verticalHistogram.map((v, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${(v / SIZE) * 100}%` }}
                        transition={{ delay: i * 0.015 }}
                        className="flex-1 rounded-t bg-cyan-600"
                        title={`${i + 1}번째 열: ${v}개`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    막대 하나가 한 열의 검은 화소 개수 — 24개의 값으로 영상을 표현.
                  </p>
                </div>
              )}

              {tab === "dir" && (
                <div className="flex flex-wrap items-center gap-6">
                  <svg viewBox="0 0 160 160" className="w-40 max-w-full" role="img" aria-label="8방향 성분">
                    <circle cx="80" cy="80" r="62" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                    {directionFeature.map((v, k) => {
                      const a = (k * 45 * Math.PI) / 180;
                      const len = 12 + (v / directionMax) * 50;
                      return (
                        <g key={k}>
                          <line
                            x1="80"
                            y1="80"
                            x2={80 + Math.cos(a) * len}
                            y2={80 - Math.sin(a) * len}
                            stroke="#0891b2"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                          <text
                            x={80 + Math.cos(a) * 74}
                            y={80 - Math.sin(a) * 74 + 4}
                            textAnchor="middle"
                            fontSize="11"
                            fill="#64748b"
                          >
                            {directionLabels[k]}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                  <div className="min-w-[140px] flex-1 space-y-1">
                    {directionFeature.map((v, k) => (
                      <div key={k} className="flex items-center gap-2">
                        <span className="w-5 text-center text-xs text-gray-500">{directionLabels[k]}</span>
                        <div className="h-2.5 flex-1 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
                          <div
                            className="h-full rounded bg-cyan-600"
                            style={{ width: `${(v / directionMax) * 100}%` }}
                          />
                        </div>
                        <span className="w-9 text-right text-xs tabular-nums text-gray-500">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 사영 계산기 */}
      <h3 className="mb-1 text-base font-bold">사영 projection에 의한 특징추출</h3>
      <p className="mb-4 text-sm text-gray-500">
        격자·히스토그램은 영상 데이터에 직관적으로 적용하는 방법. 데이터 유형에 덜 의존적이고 일반적으로
        쓸 수 있는 방법이 사영에 의한 특징추출.
      </p>

      <div className="mb-10 grid gap-4 lg:grid-cols-[auto_1fr]">
        <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
          <svg viewBox={`0 0 ${P_VIEW} ${P_VIEW}`} className="w-full max-w-[300px]" role="img" aria-label="사영 계산기">
            <line x1="10" y1={P_MID} x2={P_VIEW - 10} y2={P_MID} stroke="#cbd5e1" strokeWidth="1" />
            <line x1={P_MID} y1="10" x2={P_MID} y2={P_VIEW - 10} stroke="#cbd5e1" strokeWidth="1" />
            <text x={P_VIEW - 12} y={P_MID + 14} textAnchor="end" fontSize="10" fill="#94a3b8">
              x1
            </text>
            <text x={P_MID + 6} y="18" fontSize="10" fill="#94a3b8">
              x2
            </text>

            {/* 방향 u의 직선 */}
            <line
              x1={px(-ux * 5)}
              y1={py(-uy * 5)}
              x2={px(ux * 5)}
              y2={py(uy * 5)}
              stroke="#0891b2"
              strokeWidth="1.5"
              strokeDasharray="5 4"
            />
            {/* 단위벡터 u */}
            <line
              x1={px(0)}
              y1={py(0)}
              x2={px(ux)}
              y2={py(uy)}
              stroke="#0891b2"
              strokeWidth="3"
              markerEnd="url(#fx-arrow)"
            />
            <defs>
              <marker id="fx-arrow" markerWidth="7" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 7 3, 0 6" fill="#0891b2" />
              </marker>
            </defs>
            <text x={px(ux) + 6} y={py(uy) - 4} fontSize="12" fontWeight="bold" fill="#0e7490">
              u
            </text>

            {/* 수선 */}
            <line
              x1={px(x1)}
              y1={py(x2)}
              x2={px(footX)}
              y2={py(footY)}
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            {/* 데이터 점 x */}
            <circle cx={px(x1)} cy={py(x2)} r="5" fill="#0f172a" className="dark:fill-white" />
            <text x={px(x1) + 8} y={py(x2) - 6} fontSize="12" fontWeight="bold" fill="#0f172a">
              x
            </text>
            {/* 특징값 위치 */}
            <circle cx={px(footX)} cy={py(footY)} r="5" fill="#f59e0b" />
          </svg>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="space-y-4">
            <div>
              <label className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">데이터 x의 첫 번째 값</span>
                <span className="font-mono tabular-nums text-cyan-700 dark:text-cyan-300">
                  {x1.toFixed(1)}
                </span>
              </label>
              <input
                type="range"
                min={-4}
                max={4}
                step={0.5}
                value={x1}
                onChange={(e) => setX1(Number(e.target.value))}
                className="mt-1 w-full accent-cyan-600"
              />
            </div>
            <div>
              <label className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">데이터 x의 두 번째 값</span>
                <span className="font-mono tabular-nums text-cyan-700 dark:text-cyan-300">
                  {x2.toFixed(1)}
                </span>
              </label>
              <input
                type="range"
                min={-4}
                max={4}
                step={0.5}
                value={x2}
                onChange={(e) => setX2(Number(e.target.value))}
                className="mt-1 w-full accent-cyan-600"
              />
            </div>
            <div>
              <label className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">사영 방향 u의 각도</span>
                <span className="font-mono tabular-nums text-cyan-700 dark:text-cyan-300">{angle}°</span>
              </label>
              <input
                type="range"
                min={0}
                max={180}
                step={1}
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="mt-1 w-full accent-cyan-600"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { label: "u = (1, 0) — x축", deg: 0 },
              { label: "u = (0, 1) — x2축", deg: 90 },
              { label: "u = (1, 1)/√2", deg: 45 },
            ].map((p) => (
              <button
                key={p.deg}
                onClick={() => setAngle(p.deg)}
                className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
              >
                {p.label}
              </button>
            ))}
            <button
              onClick={() => {
                setX1(2);
                setX2(3);
                setAngle(45);
                setShowLectureCase(true);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-cyan-700"
            >
              <Target size={12} /> 강의 예시 확인
            </button>
          </div>

          <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <p className="font-mono text-sm text-gray-700 dark:text-gray-200">
              u = ({ux.toFixed(3)}, {uy.toFixed(3)}) &nbsp; (크기 1인 단위벡터)
            </p>
            <p className="mt-1 font-mono text-sm text-gray-700 dark:text-gray-200">
              x<sup>T</sup>u = {x1.toFixed(1)} × {ux.toFixed(3)} + {x2.toFixed(1)} × {uy.toFixed(3)} ={" "}
              <strong className="text-cyan-700 dark:text-cyan-300">{feature.toFixed(3)}</strong>
            </p>
            <p className="mt-2 text-xs text-gray-500">
              2차원 데이터 x가 하나의 값(특징값)으로 축소 — 이것이 사영에 의한 차원 축소.
            </p>
          </div>

          <AnimatePresence>
            {showLectureCase && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 rounded-lg border border-cyan-300 bg-cyan-50 p-4 text-sm dark:border-cyan-800 dark:bg-cyan-950/50">
                  <p className="font-bold text-cyan-800 dark:text-cyan-200">강의 예시</p>
                  <p className="mt-1 text-gray-700 dark:text-gray-200">
                    u = (1, 1)이고 x = (2, 3)이면 x<sup>T</sup>u = 2 + 3 ={" "}
                    <strong>5</strong>. 두 개의 값이 5라는 하나의 값으로 축소.
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    x축으로 수선을 내리면 값은 2, x2축으로 내리면 값은 3. 이것이 사영.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 어느 방향으로 사영하는 것이 좋은가 */}
      <h3 className="mb-1 text-base font-bold">어느 방향으로 사영하는 것이 좋은가</h3>
      <p className="mb-4 text-sm text-gray-500">
        단순히 차원 축소가 아닌 데이터 처리를 위한 핵심 정보의 추출이 더 중요 → 주어진 데이터의{" "}
        <strong>분포 특성을 가장 잘 나타낼 수 있는 방향</strong>. 위의 각도 슬라이더를 돌리면 사영된
        1차원 분포의 퍼짐이 함께 바뀜.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
          <svg viewBox="0 0 260 260" className="w-full max-w-full" role="img" aria-label="점 구름과 사영 방향">
            <line x1="10" y1="130" x2="250" y2="130" stroke="#e2e8f0" strokeWidth="1" />
            <line x1="130" y1="10" x2="130" y2="250" stroke="#e2e8f0" strokeWidth="1" />
            <line
              x1={130 - ux * 120}
              y1={130 + uy * 120}
              x2={130 + ux * 120}
              y2={130 - uy * 120}
              stroke="#0891b2"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            {cloud.map((p, i) => {
              const t = projected[i];
              return (
                <g key={i}>
                  <line
                    x1={130 + p.x * 22}
                    y1={130 - p.y * 22}
                    x2={130 + t * ux * 22}
                    y2={130 - t * uy * 22}
                    stroke="#94a3b8"
                    strokeWidth="0.4"
                    opacity={0.5}
                  />
                  <circle cx={130 + p.x * 22} cy={130 - p.y * 22} r="2.4" fill="#0f172a" opacity={0.55} />
                  <circle cx={130 + t * ux * 22} cy={130 - t * uy * 22} r="2.2" fill="#f59e0b" />
                </g>
              );
            })}
          </svg>
          <p className="pb-1 text-center text-xs text-gray-500">
            검은 점 = 원래 데이터, 주황 점 = u 방향으로 사영된 특징값
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm font-bold">사영된 1차원 분포의 퍼짐 (분산)</p>
          <div className="mt-3 h-4 w-full overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
            <motion.div
              className="h-full rounded bg-cyan-600"
              animate={{ width: `${varRatio * 100}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <p className="mt-2 text-sm tabular-nums text-gray-600 dark:text-gray-300">
            분산 = <strong className="text-cyan-700 dark:text-cyan-300">{variance.toFixed(3)}</strong>{" "}
            <span className="text-xs text-gray-500">(이 데이터에서 가능한 최대 대비 {(varRatio * 100).toFixed(0)}%)</span>
          </p>

          <p className="mt-4 text-xs text-gray-500">사영된 값들이 1차원 축 위에 놓인 모습</p>
          <svg viewBox="0 0 260 40" className="mt-1 w-full max-w-full" role="img" aria-label="사영된 1차원 분포">
            <line x1="10" y1="22" x2="250" y2="22" stroke="#cbd5e1" strokeWidth="1" />
            {projected.map((t, i) => (
              <circle key={i} cx={130 + t * 22} cy="22" r="2.4" fill="#f59e0b" opacity={0.6} />
            ))}
          </svg>

          <p className="mt-3 rounded-lg bg-cyan-50 p-3 text-xs leading-relaxed text-cyan-900 dark:bg-cyan-950/50 dark:text-cyan-200">
            분산이 가장 커지는 방향으로 사영하면 데이터가 퍼져 있는 모양, 즉 분포 특성이 가장 잘
            남음. 반대로 분산이 작아지는 방향에서는 서로 다른 데이터들이 겹쳐 버려 정보가 사라짐.
          </p>
        </div>
      </div>
    </section>
  );
}
