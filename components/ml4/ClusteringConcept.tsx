"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Layers, Target, Activity } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

interface P {
  x: number;
  y: number;
}

/** 분류 / 군집화 대비에 함께 쓰는 동일한 점 구름 */
const GROUP_0: P[] = [
  { x: 1.5, y: 6.2 },
  { x: 2.2, y: 7.0 },
  { x: 2.9, y: 6.4 },
  { x: 1.8, y: 5.4 },
  { x: 2.6, y: 5.8 },
  { x: 3.3, y: 6.9 },
  { x: 1.2, y: 6.8 },
  { x: 2.4, y: 6.1 },
  { x: 3.1, y: 5.6 },
  { x: 2.0, y: 7.4 },
];

const GROUP_1: P[] = [
  { x: 5.8, y: 3.2 },
  { x: 6.5, y: 4.0 },
  { x: 7.2, y: 3.4 },
  { x: 6.0, y: 2.4 },
  { x: 6.8, y: 2.8 },
  { x: 7.5, y: 3.9 },
  { x: 5.5, y: 3.8 },
  { x: 6.3, y: 3.1 },
  { x: 7.0, y: 2.6 },
  { x: 6.9, y: 4.3 },
];

const SIZE = 240;
const PAD = 22;
const MIN = 0;
const MAX = 9;

function sx(x: number) {
  return PAD + ((x - MIN) / (MAX - MIN)) * (SIZE - 2 * PAD);
}
function sy(y: number) {
  return SIZE - PAD - ((y - MIN) / (MAX - MIN)) * (SIZE - 2 * PAD);
}

function Axes() {
  return (
    <>
      <line
        x1={PAD}
        y1={SIZE - PAD}
        x2={SIZE - PAD}
        y2={SIZE - PAD}
        stroke="currentColor"
        strokeWidth="1"
      />
      <line
        x1={PAD}
        y1={PAD}
        x2={PAD}
        y2={SIZE - PAD}
        stroke="currentColor"
        strokeWidth="1"
      />
    </>
  );
}

const RESULT_CARDS = [
  {
    id: "subset",
    icon: Layers,
    title: "서로소인 부분집합 Dᵢ",
    desc: "D = D₁ ∪ D₂ ∪ … ∪ D_K 로 나눈 결과 자체. 서로소이므로 부분집합 간에 교집합이 없음.",
  },
  {
    id: "centroid",
    icon: Target,
    title: "클러스터의 대표 벡터(평균)의 집합",
    desc: "각 클러스터에 속하는 데이터들의 평균. K-평균 군집화 알고리즘이 만들어 내는 학습 결과가 바로 이것.",
  },
  {
    id: "dist",
    icon: Activity,
    title: "각 클러스터의 확률분포",
    desc: "각 클러스터를 하나의 확률분포로 표현한 결과. 가우시안 혼합 모델이 이 관점에 해당.",
  },
];

const METHODS = [
  { name: "K-평균 군집화", english: "K-means clustering" },
  { name: "계층적 군집화", english: "hierarchical clustering" },
  { name: "가우시안 혼합 모델", english: "Gaussian mixture model" },
];

export default function ClusteringConcept() {
  const [showLabels, setShowLabels] = useState(false);
  const [resultView, setResultView] = useState("subset");

  /** 대표 벡터와 확률분포 등고선을 모두 실제 데이터에서 계산한다. */
  const stats = useMemo(() => {
    const of = (pts: P[]) => {
      const mx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
      const my = pts.reduce((s, p) => s + p.y, 0) / pts.length;
      const sdx = Math.sqrt(
        pts.reduce((s, p) => s + (p.x - mx) ** 2, 0) / pts.length
      );
      const sdy = Math.sqrt(
        pts.reduce((s, p) => s + (p.y - my) ** 2, 0) / pts.length
      );
      return { x: mx, y: my, sdx, sdy };
    };
    return [of(GROUP_0), of(GROUP_1)];
  }, []);
  const centroids = stats;

  const allPoints = useMemo(() => [...GROUP_0, ...GROUP_1], []);

  return (
    <section>
      <SectionTitle
        title="군집화의 개념"
        subtitle="목표 출력값 없이 데이터의 유사성만으로 그룹을 나누는 비지도학습 문제"
      />

      {/* 정의 */}
      <div className="mb-8 rounded-xl border border-teal-200 bg-teal-50 p-5 dark:border-teal-800 dark:bg-teal-950/40">
        <p className="text-xs font-bold tracking-wide text-teal-600 dark:text-teal-400">
          군집화 clustering
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          데이터 집합의 내재된 분포 특성을 분석하여 서로 교차하지 않는 복수 개의
          부분집합(<strong className="text-teal-700 dark:text-teal-300">군집</strong>,
          cluster)으로 나누는 문제.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          입력 데이터로부터 추출된 특징 공간에서 특징값의{" "}
          <strong className="text-teal-700 dark:text-teal-300">유사성</strong>에 따라
          스스로 비슷한 데이터끼리 묶어서 몇 개의 그룹으로 나누는 문제.
        </p>
      </div>

      {/* 분류 vs 군집화 */}
      <div className="mb-10">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-bold">분류 vs 군집화</h3>
          <button
            onClick={() => setShowLabels((v) => !v)}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              showLabels
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {showLabels ? <Eye size={14} /> : <EyeOff size={14} />}
            레이블 표시 {showLabels ? "켬" : "끔"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 분류 */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="mb-2 text-center text-sm font-bold text-gray-700 dark:text-gray-300">
              분류
            </p>
            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="w-full text-slate-300 dark:text-slate-700"
            >
              <Axes />
              {GROUP_0.map((p, i) => (
                <circle
                  key={`c0-${i}`}
                  cx={sx(p.x)}
                  cy={sy(p.y)}
                  r={4.5}
                  fill={showLabels ? "#2563eb" : "#94a3b8"}
                  fillOpacity={0.9}
                />
              ))}
              {GROUP_1.map((p, i) => (
                <circle
                  key={`c1-${i}`}
                  cx={sx(p.x)}
                  cy={sy(p.y)}
                  r={4.5}
                  fill={showLabels ? "#dc2626" : "#94a3b8"}
                  fillOpacity={0.9}
                />
              ))}
              {showLabels && (
                <>
                  <text
                    x={sx(2.3)}
                    y={sy(8.3)}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="bold"
                    fill="#2563eb"
                  >
                    C1 · 목표 출력값 0
                  </text>
                  <text
                    x={sx(6.6)}
                    y={sy(0.9)}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="bold"
                    fill="#dc2626"
                  >
                    C2 · 목표 출력값 1
                  </text>
                </>
              )}
            </svg>
            <div className="mt-2 space-y-1 text-center">
              <p className="font-mono text-sm text-gray-700 dark:text-gray-300">
                D = {"{"}(xᵢ, yᵢ){"}"} i=1,…,N
              </p>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                지도학습
              </p>
              <p className="text-xs text-gray-500">
                클래스 레이블이 목표 출력값으로 함께 주어짐
              </p>
            </div>
          </div>

          {/* 군집화 */}
          <div className="rounded-xl border border-teal-200 bg-white p-4 dark:border-teal-800 dark:bg-gray-900">
            <p className="mb-2 text-center text-sm font-bold text-teal-700 dark:text-teal-300">
              군집화
            </p>
            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="w-full text-slate-300 dark:text-slate-700"
            >
              <Axes />
              {allPoints.map((p, i) => (
                <circle
                  key={`u-${i}`}
                  cx={sx(p.x)}
                  cy={sy(p.y)}
                  r={4.5}
                  fill="#94a3b8"
                  fillOpacity={0.9}
                />
              ))}
            </svg>
            <div className="mt-2 space-y-1 text-center">
              <p className="font-mono text-sm text-gray-700 dark:text-gray-300">
                D = {"{"}xᵢ{"}"} i=1,…,N
              </p>
              <p className="text-xs font-bold text-teal-600 dark:text-teal-400">
                비지도학습
              </p>
              <p className="text-xs text-gray-500">
                레이블 없이 입력 데이터만 주어짐 — 레이블을 켜도 색이 변하지 않음
              </p>
            </div>
          </div>
        </div>

        <p className="mt-3 rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
          같은 데이터라도 분류에서는 파란색 C1(목표 출력값 0), 빨간색 C2(목표 출력값 1)처럼
          클래스 정보가 함께 주어짐. 군집화에서는 바람직한 출력에 대한 정보 없이 입력
          데이터만 주어짐. 목표 출력값이 있느냐 없느냐에 따라 사용할 수 있는 학습 방법이
          달라짐.
        </p>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
              지금까지 배운 지도학습 방법
            </p>
            <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <li>· 분류 — 베이즈 분류기, K-최근접이웃(K-NN) 분류기</li>
              <li>· 회귀 — 선형회귀, 로지스틱 회귀</li>
            </ul>
          </div>
          <div className="rounded-xl border border-teal-200 bg-white p-4 dark:border-teal-800 dark:bg-gray-900">
            <p className="text-xs font-bold text-teal-600 dark:text-teal-400">
              이번 강의에서 다루는 비지도학습 방법
            </p>
            <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <li>· 군집화 — K-평균 군집화, 계층적 군집화</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 입출력 관계 */}
      <div className="mb-10">
        <h3 className="mb-3 text-base font-bold">군집화의 입출력 관계</h3>
        <div className="overflow-x-auto">
          <div className="flex min-w-[560px] items-stretch gap-3">
            <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <p className="text-xs font-bold text-gray-500">학습 데이터 집합</p>
              <p className="mt-2 font-mono text-sm">D = {"{"}xᵢ{"}"} i=1…N</p>
              <p className="mt-1 text-xs text-gray-500">목표 출력값 없음</p>
            </div>
            <div className="flex items-center text-teal-500">
              <ArrowRight size={20} />
            </div>
            <div className="flex-1 rounded-xl border border-teal-300 bg-teal-50 p-4 dark:border-teal-700 dark:bg-teal-950/40">
              <p className="text-xs font-bold text-teal-600 dark:text-teal-400">
                학습 (데이터 분석)
              </p>
              <p className="mt-2 text-sm font-medium">서로소인 부분집합</p>
              <p className="mt-1 font-mono text-sm">D = D₁ ∪ D₂ ∪ … ∪ D_K</p>
            </div>
            <div className="flex items-center text-teal-500">
              <ArrowRight size={20} />
            </div>
            <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <p className="text-xs font-bold text-gray-500">학습 결과</p>
              <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <li>· 서로소인 부분집합 Dᵢ (i = 1,…,K)</li>
                <li>· 클러스터의 대표 벡터(평균)의 집합</li>
                <li>· 각 클러스터의 확률분포</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto">
          <div className="flex min-w-[560px] items-stretch gap-3">
            <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <p className="text-xs font-bold text-gray-500">테스트 데이터</p>
              <p className="mt-2 font-mono text-sm">x_new</p>
            </div>
            <div className="flex items-center text-teal-500">
              <ArrowRight size={20} />
            </div>
            <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <p className="mt-1 font-mono text-sm">Prob(x_new ∈ Dᵢ)</p>
              <p className="mt-1 text-xs text-gray-500">(i = 1…K)</p>
            </div>
            <div className="flex items-center text-teal-500">
              <ArrowRight size={20} />
            </div>
            <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <p className="text-xs font-bold text-gray-500">소속 클러스터</p>
              <p className="mt-2 font-mono text-sm">
                argmaxᵢ [Prob(x_new ∈ Dᵢ)]
              </p>
            </div>
          </div>
        </div>

        <p className="mt-3 rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
          서로소(disjoint)는 부분집합 간에 교집합이 없다는 뜻. 실제로는 학습만 수행하고
          데이터를 서로 구분하는 데서 끝나는 경우도 많으며, 추론 단계가 굳이 필요 없는
          경우도 있음.
        </p>
      </div>

      {/* 세 가지 학습 결과 */}
      <div className="mb-10">
        <h3 className="mb-3 text-base font-bold">
          군집화의 세 가지 학습 결과 — 카드를 눌러 확인
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {RESULT_CARDS.map((card) => {
            const Icon = card.icon;
            const active = resultView === card.id;
            return (
              <button
                key={card.id}
                onClick={() => setResultView(card.id)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  active
                    ? "border-teal-500 bg-teal-50 dark:border-teal-500 dark:bg-teal-950/50"
                    : "border-gray-200 bg-white hover:border-teal-300 dark:border-gray-700 dark:bg-gray-900"
                }`}
              >
                <Icon
                  size={18}
                  className={active ? "text-teal-600" : "text-gray-400"}
                />
                <p className="mt-2 text-sm font-bold">{card.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  {card.desc}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex justify-center rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="w-full max-w-xs text-slate-300 dark:text-slate-700"
          >
            <Axes />
            {resultView === "dist" &&
              stats.map((m, ci) =>
                [1, 2, 3].map((ring) => (
                  <ellipse
                    key={`ring-${ci}-${ring}`}
                    cx={sx(m.x)}
                    cy={sy(m.y)}
                    rx={(ring * m.sdx * (SIZE - 2 * PAD)) / (MAX - MIN)}
                    ry={(ring * m.sdy * (SIZE - 2 * PAD)) / (MAX - MIN)}
                    fill={ci === 0 ? "#0d9488" : "#0891b2"}
                    fillOpacity={0.07}
                    stroke={ci === 0 ? "#0d9488" : "#0891b2"}
                    strokeOpacity={0.5}
                    strokeWidth="1"
                  />
                ))
              )}
            {GROUP_0.map((p, i) => (
              <circle
                key={`r0-${i}`}
                cx={sx(p.x)}
                cy={sy(p.y)}
                r={4.5}
                fill={resultView === "subset" ? "#0d9488" : "#94a3b8"}
                fillOpacity={resultView === "centroid" ? 0.45 : 0.9}
              />
            ))}
            {GROUP_1.map((p, i) => (
              <circle
                key={`r1-${i}`}
                cx={sx(p.x)}
                cy={sy(p.y)}
                r={4.5}
                fill={resultView === "subset" ? "#0891b2" : "#94a3b8"}
                fillOpacity={resultView === "centroid" ? 0.45 : 0.9}
              />
            ))}
            {resultView === "subset" && (
              <>
                <text
                  x={sx(2.3)}
                  y={sy(8.3)}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#0d9488"
                >
                  D₁
                </text>
                <text
                  x={sx(6.6)}
                  y={sy(0.9)}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#0891b2"
                >
                  D₂
                </text>
              </>
            )}
            {resultView === "centroid" &&
              centroids.map((m, ci) => (
                <g key={`m-${ci}`}>
                  <circle
                    cx={sx(m.x)}
                    cy={sy(m.y)}
                    r={9}
                    fill="none"
                    stroke={ci === 0 ? "#0d9488" : "#0891b2"}
                    strokeWidth="2.5"
                  />
                  <line
                    x1={sx(m.x) - 4}
                    y1={sy(m.y)}
                    x2={sx(m.x) + 4}
                    y2={sy(m.y)}
                    stroke={ci === 0 ? "#0d9488" : "#0891b2"}
                    strokeWidth="2"
                  />
                  <line
                    x1={sx(m.x)}
                    y1={sy(m.y) - 4}
                    x2={sx(m.x)}
                    y2={sy(m.y) + 4}
                    stroke={ci === 0 ? "#0d9488" : "#0891b2"}
                    strokeWidth="2"
                  />
                  <text
                    x={sx(m.x) + 13}
                    y={sy(m.y) + 4}
                    fontSize="12"
                    fontWeight="bold"
                    fill={ci === 0 ? "#0d9488" : "#0891b2"}
                  >
                    m{ci + 1}
                  </text>
                </g>
              ))}
          </svg>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={resultView}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 rounded-lg bg-teal-50 p-3 text-xs leading-relaxed text-teal-800 dark:bg-teal-950/40 dark:text-teal-200"
          >
            {resultView === "subset" &&
              "서로소인 부분집합 D₁, D₂로 나눈 결과. 어느 데이터가 어느 군집에 속하는지만 표현함."}
            {resultView === "centroid" &&
              "각 클러스터에 속하는 데이터들의 평균 = 대표 벡터. K-평균 군집화 알고리즘의 학습 결과가 바로 이 대표 벡터의 집합."}
            {resultView === "dist" &&
              "각 클러스터를 확률분포로 표현한 결과. 등고선은 각 군집의 실제 평균과 축별 표준편차의 1·2·3배 위치에 그린 것으로, 안쪽일수록 그 클러스터에 속할 확률이 큼."}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* 대표적 적용 방법 */}
      <div className="mb-10">
        <h3 className="mb-3 text-base font-bold">대표적 적용 방법</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {METHODS.map((m) => (
            <div
              key={m.name}
              className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
            >
              <p className="text-sm font-bold text-teal-700 dark:text-teal-300">
                {m.name}
              </p>
              <p className="mt-1 text-xs text-gray-500">{m.english}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 적용의 예 */}
      <div className="mb-10">
        <h3 className="mb-3 text-base font-bold">군집화 적용의 예</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm font-bold">장면 영상 데이터의 군집화</p>
            <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              여러 장의 영상을 주고 비슷한 것끼리 묶게 함. 어떤 정보도 주지 않고 데이터만
              준 뒤, 알아서 몇 개의 유사한 그룹으로 묶으라는 문제.
            </p>
            <div className="mt-3 grid grid-cols-6 gap-1">
              {[0, 0, 1, 2, 1, 2, 0, 1, 2, 0, 2, 1].map((g, i) => (
                <div
                  key={i}
                  className="h-6 rounded"
                  style={{
                    backgroundColor: ["#0d9488", "#0891b2", "#059669"][g],
                    opacity: 0.35 + g * 0.15,
                  }}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-400">
              색이 같은 칸 = 하나의 군집으로 묶인 영상
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm font-bold">영상 화소의 군집화에 의한 영상분할</p>
            <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              영상의 각 화소를 하나의 데이터로 취급하고, 각 화소가 가진 색상값의 유사성에
              따라 영역을 나눔.
            </p>
            <svg viewBox="0 0 180 60" className="mt-3 w-full">
              {Array.from({ length: 12 }).map((_, c) =>
                Array.from({ length: 4 }).map((__, r) => {
                  const region = c < 4 ? 0 : c < 8 ? 1 : 2;
                  return (
                    <rect
                      key={`${r}-${c}`}
                      x={c * 15}
                      y={r * 15}
                      width={14}
                      height={14}
                      fill={["#0d9488", "#0891b2", "#059669"][region]}
                      opacity={0.25 + ((r + c) % 3) * 0.12}
                    />
                  );
                })
              )}
            </svg>
            <p className="mt-2 text-xs text-gray-400">
              색상값이 비슷한 화소끼리 묶여 세 영역으로 분할됨
            </p>
          </div>
        </div>
      </div>

      {/* 적용 가능한 데이터 */}
      <div>
        <h3 className="mb-3 text-base font-bold">군집화 적용이 가능한 데이터</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-l-4 border-teal-500 bg-teal-50 p-4 dark:bg-teal-950/40">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              데이터에 대한 클래스 레이블이 주어지지 않는 경우
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-teal-500 bg-teal-50 p-4 dark:bg-teal-950/40">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              데이터에 대한 클래스 레이블링에 비용이 많이 드는 경우
            </p>
            <p className="mt-1 text-xs text-gray-500">
              데이터가 적을 때는 상관없지만, 데이터가 많으면 레이블링 자체에 큰 비용이 듦
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
