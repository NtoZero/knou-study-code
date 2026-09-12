"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MousePointerClick, Shuffle, CheckCircle2 } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import StepControls from "@/components/common/StepControls";
import KMeansCanvas from "./KMeansCanvas";
import {
  CLUSTER_COLORS,
  KMEANS_DATA,
  randomInit,
  runKMeans,
  type Point,
} from "./kmeansCore";

/** 초기 렌더가 항상 같도록 K별 초기 대표 벡터를 상수로 고정 */
const DEFAULT_INIT: Record<number, Point[]> = {
  2: [
    { x: 3.0, y: 3.0 },
    { x: 5.5, y: 4.5 },
  ],
  3: [
    { x: 0.5, y: 0.5 },
    { x: 0.5, y: 4.0 },
    { x: 3.0, y: 1.0 },
  ],
  4: [
    { x: 1.0, y: 1.0 },
    { x: 1.0, y: 9.0 },
    { x: 9.0, y: 9.0 },
    { x: 9.0, y: 1.0 },
  ],
};

const STAGES = [
  { no: "①", label: "시작(초기화)" },
  { no: "②", label: "데이터 그룹핑" },
  { no: "③", label: "대표 벡터 수정" },
  { no: "④", label: "반복 여부 결정" },
];

const CONSIDERATIONS = [
  {
    no: "⑴",
    text: "대표 벡터 계산과 데이터 그룹핑 과정의 반복적인 수행을 통해 좋은 군집을 찾는 것이 확실히 보장되는가?",
    next: "다음 절 — 목적함수 J와 반복 수행 과정의 의미",
  },
  {
    no: "⑵",
    text: "초기 대표 벡터의 설정이 군집화 성능에 미치는 영향은?",
    next: "다음 절 — 초기값 의존성 비교 실험",
  },
  {
    no: "⑶",
    text: "데이터에 의존하는 적절한 K값을 어떻게 선택할 것인가?",
    next: "다음 절 — K값 선택과 계층적 군집화",
  },
];

export default function KMeansSimulator() {
  const [k, setK] = useState(3);
  const [initial, setInitial] = useState<Point[]>(DEFAULT_INIT[3]);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pickMode, setPickMode] = useState(false);
  const [pending, setPending] = useState<Point[]>([]);

  const run = useMemo(() => runKMeans(KMEANS_DATA, initial), [initial]);
  const frames = run.frames;
  const frame = frames[Math.min(step, frames.length - 1)];

  useEffect(() => {
    if (!playing) return;
    if (step >= frames.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setStep((s) => s + 1), 900);
    return () => clearTimeout(timer);
  }, [playing, step, frames.length]);

  const applyK = useCallback((nextK: number) => {
    setK(nextK);
    setInitial(DEFAULT_INIT[nextK]);
    setStep(0);
    setPlaying(false);
    setPickMode(false);
    setPending([]);
  }, []);

  const handleRandom = () => {
    setInitial(randomInit(KMEANS_DATA, k));
    setStep(0);
    setPlaying(false);
    setPickMode(false);
    setPending([]);
  };

  const handlePick = (p: Point) => {
    const next = [...pending, p];
    if (next.length >= k) {
      setInitial(next);
      setPending([]);
      setPickMode(false);
      setStep(0);
      setPlaying(false);
    } else {
      setPending(next);
    }
  };

  const activeStage =
    frame.phase === "init" ? 1 : frame.phase === "grouping" ? 2 : 3;

  const sizes = useMemo(() => {
    if (frame.phase === "init") return null;
    return frame.centroids.map(
      (_, i) => frame.assignment.filter((a) => a === i).length
    );
  }, [frame]);

  return (
    <section>
      <SectionTitle
        title="K-평균 군집화 시뮬레이터"
        subtitle="②데이터 그룹핑과 ③대표 벡터 수정을 한 단계씩 직접 돌려 보는 실습"
      />

      <div className="mb-6 rounded-xl border border-teal-200 bg-teal-50 p-5 dark:border-teal-800 dark:bg-teal-950/40">
        <p className="text-xs font-bold tracking-wide text-teal-600 dark:text-teal-400">
          K-평균 군집화 K-means clustering
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          주어진 데이터 집합을{" "}
          <strong className="text-teal-700 dark:text-teal-300">평균 정보를 활용하여</strong>{" "}
          K개의 그룹으로 묶는 알고리즘. 학습 결과는 각 그룹에 속하는 데이터들의 평균, 즉{" "}
          <strong className="text-teal-700 dark:text-teal-300">대표 벡터</strong>.
        </p>
      </div>

      {/* 수행 단계 파이프라인 */}
      <div className="mb-6 overflow-x-auto">
        <div className="min-w-[560px]">
          <div className="flex items-stretch gap-2">
            {STAGES.map((s, i) => {
              const isActive =
                i + 1 === activeStage || (i === 3 && frame.converged);
              return (
                <div
                  key={s.no}
                  className={`flex-1 rounded-lg border p-3 transition-colors ${
                    isActive
                      ? "border-teal-500 bg-teal-500 text-white"
                      : "border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                  }`}
                >
                  <p className="text-xs font-bold opacity-80">{s.no}</p>
                  <p className="mt-0.5 text-sm font-medium">{s.label}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-1 flex items-center justify-center gap-2 text-xs text-teal-600 dark:text-teal-400">
            <span className="h-px w-24 bg-teal-400" />
            <span>②~③ 반복</span>
            <span className="h-px w-24 bg-teal-400" />
          </div>
        </div>
      </div>

      {/* 컨트롤 */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500">K</span>
          {[2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => applyK(n)}
              className={`h-8 w-8 rounded-lg text-sm font-bold transition-colors ${
                k === n
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <button
          onClick={handleRandom}
          className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
        >
          <Shuffle size={14} />
          초기 대표 벡터 임의로 선택
        </button>

        <button
          onClick={() => {
            setPickMode((v) => !v);
            setPending([]);
            setPlaying(false);
          }}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            pickMode
              ? "bg-teal-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          <MousePointerClick size={14} />
          캔버스에서 직접 지정
        </button>

        <div className="ml-auto">
          <StepControls
            step={Math.min(step, frames.length - 1)}
            totalSteps={frames.length}
            playing={playing}
            onPlay={() => setPlaying(true)}
            onStop={() => setPlaying(false)}
            onReset={() => {
              setStep(0);
              setPlaying(false);
            }}
            onNext={() => setStep((s) => Math.min(s + 1, frames.length - 1))}
            onPrev={() => setStep((s) => Math.max(s - 1, 0))}
          />
        </div>
      </div>

      {pickMode && (
        <p className="mb-3 rounded-lg bg-teal-50 p-3 text-xs text-teal-800 dark:bg-teal-950/40 dark:text-teal-200">
          캔버스를 클릭해 초기 대표 벡터를 지정하세요. {pending.length} / {k}개 지정됨.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <KMeansCanvas
            points={KMEANS_DATA}
            frame={frame}
            onPick={pickMode ? handlePick : undefined}
            pending={pickMode ? pending : undefined}
            caption="배경의 색 구역 = 대표 벡터들의 수직이등분선으로 나뉜 클러스터 경계"
          />
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-xs font-bold text-gray-500">현재 단계</p>
            <p className="mt-1 text-lg font-bold text-teal-600 dark:text-teal-400">
              {frame.phase === "init" && "① 시작(초기화)"}
              {frame.phase === "grouping" && "② 데이터 그룹핑"}
              {frame.phase === "update" && "③ 대표 벡터 수정"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {frame.phase === "init" &&
                "데이터 집합으로부터 K개의 초기 대표 벡터 m₁,…,m_K를 생성"}
              {frame.phase === "grouping" &&
                "각 데이터에서 K개의 대표 벡터까지 거리를 계산해 가장 가까운 클러스터로 레이블링"}
              {frame.phase === "update" &&
                "각 클러스터에 속한 데이터들의 평균으로 대표 벡터를 갱신"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
              <p className="text-xs text-gray-500">반복 횟수</p>
              <p className="mt-1 text-xl font-bold">{frame.iteration}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
              <p className="text-xs text-gray-500">목적함수 J</p>
              <p className="mt-1 text-xl font-bold">
                {frame.objective === null ? "—" : frame.objective.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-xs text-gray-500">
              대표 벡터 변화량 ‖m_new − m‖ (최댓값)
            </p>
            <p className="mt-1 text-xl font-bold">
              {frame.shift === null ? "—" : frame.shift.toFixed(4)}
            </p>
            {frame.converged && (
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                <CheckCircle2 size={12} />
                수렴 — 대표 벡터의 변화 없음
              </span>
            )}
          </div>

          {sizes && (
            <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
              <p className="mb-2 text-xs text-gray-500">각 클러스터의 데이터 개수</p>
              <div className="space-y-1">
                {sizes.map((n, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          CLUSTER_COLORS[i % CLUSTER_COLORS.length],
                      }}
                    />
                    <span className="font-mono">C{i + 1}</span>
                    <span className="ml-auto font-bold">{n}개</span>
                    <span className="font-mono text-gray-400">
                      m{i + 1} = ({frame.centroids[i].x.toFixed(2)},{" "}
                      {frame.centroids[i].y.toFixed(2)})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 수식 */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-xs font-bold text-teal-600 dark:text-teal-400">
            ② 데이터 그룹핑
          </p>
          <p className="mt-2 break-words font-mono text-xs leading-relaxed">
            C_k = {"{"} xⱼ | d(xⱼ, m_k) ≤ d(xⱼ, mᵢ), i = 1,…,K {"}"}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-xs font-bold text-teal-600 dark:text-teal-400">
            ③ 대표 벡터 수정
          </p>
          <p className="mt-2 break-words font-mono text-xs leading-relaxed">
            m_k^new = (1 / |C_k|) Σ_{"{"}xⱼ ∈ C_k{"}"} xⱼ
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-xs font-bold text-teal-600 dark:text-teal-400">
            ④ 종료 조건
          </p>
          <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            수정 전 m_k와 수정 후 m_k^new의 차이에 변화가 없거나, 설정된 반복 횟수에
            도달할 때까지 ②~④를 반복.
          </p>
        </div>
      </div>

      {/* 세 가지 고려사항 */}
      <div className="mt-8">
        <h3 className="mb-3 text-base font-bold">
          실제 문제에 적용할 때 고려해야 할 사항
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {CONSIDERATIONS.map((c) => (
            <div
              key={c.no}
              className="rounded-xl border-l-4 border-teal-500 bg-white p-4 dark:bg-gray-900"
            >
              <p className="text-sm font-bold text-teal-600 dark:text-teal-400">
                {c.no}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {c.text}
              </p>
              <p className="mt-2 text-xs text-gray-400">{c.next}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
