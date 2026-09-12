"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import StepControls from "@/components/common/StepControls";
import KMeansCanvas from "./KMeansCanvas";
import {
  KMEANS_DATA,
  farthestPointInit,
  runKMeans,
  type Point,
} from "./kmeansCore";

interface Preset {
  id: string;
  name: string;
  note: string;
  init: Point[];
  warning?: boolean;
}

const PRESETS: Preset[] = [
  {
    id: "slow",
    name: "초기값 A — 여러 번 반복 후 수렴",
    note: "세 대표 벡터를 한쪽 구석에 몰아 두고 시작",
    init: [
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 4.0 },
      { x: 3.0, y: 1.0 },
    ],
  },
  {
    id: "fast",
    name: "초기값 B — 빠르게 수렴",
    note: "세 덩어리에 가깝게 흩어 두고 시작",
    init: [
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 6.0 },
      { x: 7.0, y: 9.0 },
    ],
  },
  {
    id: "bad",
    name: "초기값 C — 적절한 클러스터를 찾지 못함",
    note: "두 대표 벡터를 같은 덩어리 위쪽에 붙여 둔 경우",
    init: [
      { x: 1.0, y: 3.5 },
      { x: 6.5, y: 7.5 },
      { x: 8.5, y: 6.0 },
    ],
    warning: true,
  },
];

const INIT_METHODS = [
  {
    title: "랜덤하게 임의로 정하는 방법",
    desc: "데이터 집합에서 K개를 아무렇게나 뽑아 초기 대표 벡터로 삼음.",
  },
  {
    title: "거리가 떨어진 데이터를 고르는 방법",
    desc: "데이터 집합에서 어느 정도 거리가 떨어진 것들을 골라 초기 대표 벡터로 정함.",
  },
  {
    title: "입력 공간을 영역으로 나누는 방법",
    desc: "전체 입력 공간을 영역으로 나눈 뒤 각 영역에서 하나씩 랜덤하게 선택.",
  },
  {
    title: "여러 번 수행하고 좋은 결과를 선택하는 방법",
    desc: "초기값을 바꿔 가며 여러 번 반복 수행하고 그중 좋은 결과를 선택. K-평균은 학습에 시간이 많이 걸리지 않아 여러 번 수행해도 부담이 크지 않으므로 현실적으로 많이 쓰임.",
    highlight: true,
  },
];

export default function InitializationDependence() {
  const [leftId, setLeftId] = useState("slow");
  const [rightId, setRightId] = useState("fast");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const left = PRESETS.find((p) => p.id === leftId) as Preset;
  const right = PRESETS.find((p) => p.id === rightId) as Preset;

  const runLeft = useMemo(() => runKMeans(KMEANS_DATA, left.init), [left.init]);
  const runRight = useMemo(() => runKMeans(KMEANS_DATA, right.init), [right.init]);

  const totalSteps = Math.max(runLeft.frames.length, runRight.frames.length);

  useEffect(() => {
    if (!playing) return;
    if (step >= totalSteps - 1) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setStep((s) => s + 1), 900);
    return () => clearTimeout(timer);
  }, [playing, step, totalSteps]);

  useEffect(() => {
    setStep(0);
    setPlaying(false);
  }, [leftId, rightId]);

  const kChart = useMemo(
    () =>
      [1, 2, 3, 4, 5, 6].map((k) => {
        const result = runKMeans(KMEANS_DATA, farthestPointInit(KMEANS_DATA, k));
        return { k, J: result.finalObjective };
      }),
    []
  );
  const maxKJ = Math.max(...kChart.map((d) => d.J));

  const renderSide = (preset: Preset, run: ReturnType<typeof runKMeans>, setId: (v: string) => void) => {
    const frame = run.frames[Math.min(step, run.frames.length - 1)];
    const finished = step >= run.frames.length - 1;
    return (
      <div
        className={`rounded-xl border p-4 ${
          preset.warning
            ? "border-amber-300 bg-amber-50/50 dark:border-amber-700 dark:bg-amber-950/20"
            : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
        }`}
      >
        <select
          value={preset.id}
          onChange={(e) => setId(e.target.value)}
          className="mb-2 w-full rounded-lg border border-gray-200 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        >
          {PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <p className="mb-2 text-xs text-gray-500">{preset.note}</p>
        <KMeansCanvas points={KMEANS_DATA} frame={frame} />
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
            <p className="text-[11px] text-gray-500">현재 단계</p>
            <p className="text-sm font-bold">
              {frame.phase === "init"
                ? "초기화"
                : frame.phase === "grouping"
                ? "그룹핑"
                : "대표 벡터 수정"}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
            <p className="text-[11px] text-gray-500">반복 횟수</p>
            <p className="text-sm font-bold">
              {frame.iteration}
              {finished && ` (수렴 ${run.iterations}회)`}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
            <p className="text-[11px] text-gray-500">J</p>
            <p className="text-sm font-bold">
              {frame.objective === null ? "—" : frame.objective.toFixed(1)}
            </p>
          </div>
        </div>
        {finished && (
          <p
            className={`mt-2 rounded-lg p-2 text-xs ${
              preset.warning
                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
            }`}
          >
            최종 J = {run.finalObjective.toFixed(2)} · {run.iterations}회 반복 후 수렴
            {preset.warning &&
              " — 하나의 덩어리가 둘로 쪼개지고 나머지 두 덩어리가 하나로 묶여 버림"}
          </p>
        )}
      </div>
    );
  };

  return (
    <section>
      <SectionTitle
        title="⑵ 초기값 의존성과 ⑶ K값 선택"
        subtitle="같은 데이터라도 초기 대표 벡터에 따라 결과가 달라지는 문제"
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <p className="text-sm text-gray-500">
          두 시뮬레이션을 동시에 한 단계씩 진행하며 반복 횟수와 최종 J를 비교
        </p>
        <div className="ml-auto">
          <StepControls
            step={Math.min(step, totalSteps - 1)}
            totalSteps={totalSteps}
            playing={playing}
            onPlay={() => setPlaying(true)}
            onStop={() => setPlaying(false)}
            onReset={() => {
              setStep(0);
              setPlaying(false);
            }}
            onNext={() => setStep((s) => Math.min(s + 1, totalSteps - 1))}
            onPrev={() => setStep((s) => Math.max(s - 1, 0))}
          />
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {renderSide(left, runLeft, setLeftId)}
        {renderSide(right, runRight, setRightId)}
      </div>

      <p className="mb-10 rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
        초기에 임의로 결정하는 대표 벡터에 따라 최종적인 결과가 달라짐. 강의록의 예에서도
        같은 데이터에 대해 한쪽은 7번 반복 후 수렴하고 다른 쪽은 2번 반복 후 수렴함. 심한
        경우 초기값을 잘못 설정하면 원하는 적절한 클러스터를 찾지 못하는 경우도 발생하므로,
        위 목록에서 초기값 C를 골라 직접 확인해 볼 것.
      </p>

      {/* 초기값 설정 방법 */}
      <div className="mb-10">
        <h3 className="mb-3 text-base font-bold">초기값을 설정하는 방법들</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {INIT_METHODS.map((m) => (
            <div
              key={m.title}
              className={`rounded-xl border p-4 ${
                m.highlight
                  ? "border-teal-300 bg-teal-50 dark:border-teal-700 dark:bg-teal-950/40"
                  : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
              }`}
            >
              <p className="text-sm font-bold">{m.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* K값 선택 */}
      <div>
        <h3 className="mb-3 text-base font-bold">⑶ 적절한 K값을 어떻게 선택할 것인가</h3>
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              적절한 K값의 선정은 주어진 문제에 지극히 의존함. 데이터에 따라 그때그때 정할
              수밖에 없으며, K-최근접이웃에서 K값이 데이터 분포 특성에 의존했던 것과 같은
              맥락.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-xs font-bold text-gray-500">현실적인 방법</p>
            <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>· 다양한 K값(2, 3, 4, …)에 대해 군집화 결과들을 비교하여 모델을 선택</li>
              <li>· 계층적 군집화 알고리즘의 사용</li>
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <p className="mb-3 text-sm font-bold">K값에 따른 최종 J</p>
          <div className="space-y-2">
            {kChart.map((d) => (
              <div key={d.k} className="flex items-center gap-3">
                <span className="w-10 shrink-0 font-mono text-xs text-gray-500">
                  K = {d.k}
                </span>
                <div className="h-5 flex-1 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded bg-teal-500"
                    style={{ width: `${Math.max(2, (d.J / maxKJ) * 100)}%` }}
                  />
                </div>
                <span className="w-16 shrink-0 text-right font-mono text-xs">
                  {d.J.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/30">
            <AlertTriangle
              size={16}
              className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
            />
            <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
              J는 K가 커질수록 계속 줄어듦. 데이터 개수만큼 K를 키우면 J는 0이 되므로,
              J값만 보고 K를 정할 수는 없음. 이 데이터에서는 K = 3에서 J가 크게 떨어지고
              그 뒤로는 완만해지는데, 이런 비교는 어디까지나 참고일 뿐이며 적절한 K는
              문제에 따라 정해야 함.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
