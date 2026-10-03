"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, ComputedNote, Hint, Scroller } from "./ui";
import {
  TANH,
  fmt,
  forward,
  initMlp,
  meanSquaredError,
  misclassRate,
  mulberry32,
  onlineStep,
  shuffled,
  type Mlp,
  type Sample,
} from "./mlpCore";

const X1_MAX = 1.5 * Math.PI;
const X2_MAX = 1.5;
const N = 400;
const MAX_EPOCH = 300;
const CHUNK = 10;
const ETA = 0.1;

const H_CHOICES = [2, 3, 5, 10];

/** 강의록 — 은닉 뉴런의 개수에 따른 분류 오차 */
const SLIDE_TABLE: Record<number, string> = { 2: "6%", 3: "5%", 5: "1.5%", 10: "1%" };

interface Point extends Sample {
  raw: [number, number];
  c1: boolean;
}

const DATA: Point[] = (() => {
  const rng = mulberry32(11);
  const out: Point[] = [];
  for (let i = 0; i < N; i += 1) {
    const x1 = (rng() * 3 - 1.5) * Math.PI;
    const x2 = rng() * 3 - 1.5;
    const c1 = x2 > Math.cos(x1);
    out.push({
      x: [x1 / X1_MAX, x2 / X2_MAX],
      t: c1 ? [1, -1] : [-1, 1],
      raw: [x1, x2],
      c1,
    });
  }
  return out;
})();

const W = 460;
const H = 240;
const PAD = { l: 32, r: 12, t: 12, b: 26 };
const sx = (x1: number) => PAD.l + ((x1 + X1_MAX) / (2 * X1_MAX)) * (W - PAD.l - PAD.r);
const sy = (x2: number) => H - PAD.b - ((x2 + X2_MAX) / (2 * X2_MAX)) * (H - PAD.t - PAD.b);

const TRUE_CURVE = (() => {
  const p: string[] = [];
  for (let i = 0; i <= 160; i += 1) {
    const x1 = -X1_MAX + (2 * X1_MAX * i) / 160;
    p.push(`${sx(x1)},${sy(Math.cos(x1))}`);
  }
  return p.join(" ");
})();

/** 각 x₁ 열에서 y₁ − y₂의 부호가 바뀌는 x₂를 찾아 결정경계를 그린다 */
function boundarySegments(net: Mlp): string[] {
  const cols = 90;
  const rows = 70;
  const found: (number | null)[] = [];
  for (let i = 0; i <= cols; i += 1) {
    const x1 = -X1_MAX + (2 * X1_MAX * i) / cols;
    let prevX2 = X2_MAX;
    let prevD = NaN;
    let hit: number | null = null;
    for (let j = 0; j <= rows; j += 1) {
      const x2 = X2_MAX - (2 * X2_MAX * j) / rows;
      const { y } = forward(net, [x1 / X1_MAX, x2 / X2_MAX]);
      const d = y[0] - y[1];
      if (j > 0 && Number.isFinite(prevD) && prevD * d < 0) {
        hit = prevX2 + ((x2 - prevX2) * (0 - prevD)) / (d - prevD);
        break;
      }
      prevD = d;
      prevX2 = x2;
    }
    found.push(hit);
  }
  const segs: string[] = [];
  let cur: string[] = [];
  for (let i = 0; i <= cols; i += 1) {
    const x1 = -X1_MAX + (2 * X1_MAX * i) / cols;
    if (found[i] === null) {
      if (cur.length > 1) segs.push(cur.join(" "));
      cur = [];
    } else {
      cur.push(`${sx(x1)},${sy(found[i] as number)}`);
    }
  }
  if (cur.length > 1) segs.push(cur.join(" "));
  return segs;
}

interface State {
  epoch: number;
  err: number;
  mse: number;
  segs: string[];
  curve: number[];
}

const EMPTY: State = { epoch: 0, err: NaN, mse: NaN, segs: [], curve: [] };

export default function CosBoundaryExperiment() {
  const [hidden, setHidden] = useState(5);
  const [running, setRunning] = useState(false);
  const [state, setState] = useState<State>(EMPTY);
  const netRef = useRef<Mlp | null>(null);
  const rngRef = useRef<() => number>(() => 0);

  const build = useCallback((h: number) => {
    netRef.current = initMlp(2, h, 2, mulberry32(100 + h), {
      scale: 0.8,
      hidden: TANH,
      output: TANH,
    });
    rngRef.current = mulberry32(42);
    const net = netRef.current;
    setState({
      epoch: 0,
      err: misclassRate(net, DATA),
      mse: meanSquaredError(net, DATA),
      segs: boundarySegments(net),
      curve: [meanSquaredError(net, DATA)],
    });
  }, []);

  useEffect(() => {
    setRunning(false);
    build(hidden);
  }, [hidden, build]);

  useEffect(() => {
    if (!running) return;
    const net = netRef.current;
    if (!net) return;
    if (state.epoch >= MAX_EPOCH) {
      setRunning(false);
      return;
    }
    const id = setTimeout(() => {
      const curve = [...state.curve];
      for (let c = 0; c < CHUNK; c += 1) {
        for (const s of shuffled(DATA, rngRef.current)) onlineStep(net, s, ETA);
        curve.push(meanSquaredError(net, DATA));
      }
      setState({
        epoch: state.epoch + CHUNK,
        err: misclassRate(net, DATA),
        mse: meanSquaredError(net, DATA),
        segs: boundarySegments(net),
        curve,
      });
    }, 16);
    return () => clearTimeout(id);
  }, [running, state]);

  const CW = 300;
  const CH = 110;
  const cMax = Math.max(...state.curve, 0.1);
  const cpx = (i: number) => 26 + (i / Math.max(1, MAX_EPOCH)) * (CW - 34);
  const cpy = (v: number) => CH - 20 - (v / cMax) * (CH - 30);

  return (
    <section id="cos-experiment" className="scroll-mt-32">
      <SectionTitle
        title="MLP를 이용한 간단한 분류 실험"
        subtitle="6강에서 에이다부스트로 풀었던 곡선 경계 문제를 다층 퍼셉트론으로 학습시켜 봅니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            slides: "MLP를 이용한 간단한 분류 실험 — 학습 데이터와 결정경계",
            lecture: "6강 에이다부스트에서 선형 분류기를 200개까지 결합해 얻었던 그 결정경계를, 이번에는 다층 퍼셉트론 하나로 풀어 본다고 연결",
          }}
        >
          <Card>
            <CardTitle>문제 설정</CardTitle>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-200 p-2.5 dark:border-gray-700">
                <p className="text-[11px] font-semibold text-gray-500">학습 데이터</p>
                <p className="mt-0.5 font-mono text-[11px] text-gray-700 dark:text-gray-200">
                  {"{(x₁, x₂) | x₁ ∈ [−1.5π, 1.5π], x₂ ∈ [−1.5, 1.5]}"}
                </p>
                <p className="mt-1 text-[11px] text-gray-600 dark:text-gray-300">→ 400개</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-2.5 dark:border-gray-700">
                <p className="text-[11px] font-semibold text-gray-500">목표 출력값</p>
                <p className="mt-0.5 text-[11px] text-gray-700 dark:text-gray-200">
                  C₁ → [1, −1] · C₂ → [−1, 1]
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-2.5 dark:border-gray-700">
                <p className="text-[11px] font-semibold text-gray-500">MLP 구조</p>
                <p className="mt-0.5 text-[11px] text-gray-700 dark:text-gray-200">
                  입력 2 · 은닉층 H개(tanh) · 출력 2(tanh)
                </p>
              </div>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "MLP를 이용한 간단한 분류 실험 — 은닉 뉴런의 개수에 따른 분류 오차와 결정경계의 변화",
          }}
        >
          <Card>
            <CardTitle>은닉 뉴런 수를 바꿔 가며 직접 학습시키기</CardTitle>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-gray-500">은닉 뉴런의 수 H</span>
              {H_CHOICES.map((h) => (
                <Chip key={h} active={hidden === h} onClick={() => setHidden(h)}>
                  {h}
                </Chip>
              ))}
              <button
                type="button"
                onClick={() => setRunning((r) => !r)}
                disabled={state.epoch >= MAX_EPOCH}
                className="ml-auto flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
              >
                {running ? <Pause size={13} /> : <Play size={13} />}
                {running ? "멈춤" : state.epoch > 0 ? "이어서 학습" : "학습 시작"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRunning(false);
                  build(hidden);
                }}
                className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-gray-500 dark:border-gray-700"
                aria-label="초기화"
              >
                <RotateCcw size={13} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
              <Scroller>
                <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[420px]">
                  <rect
                    x={PAD.l}
                    y={PAD.t}
                    width={W - PAD.l - PAD.r}
                    height={H - PAD.t - PAD.b}
                    fill="none"
                    stroke="#cbd5e1"
                  />
                  {DATA.map((p, i) =>
                    p.c1 ? (
                      <path
                        key={i}
                        d={`M${sx(p.raw[0]) - 2.6},${sy(p.raw[1])} h5.2 M${sx(p.raw[0])},${sy(p.raw[1]) - 2.6} v5.2`}
                        stroke="#dc2626"
                        strokeWidth={1.1}
                        opacity={0.75}
                      />
                    ) : (
                      <circle
                        key={i}
                        cx={sx(p.raw[0])}
                        cy={sy(p.raw[1])}
                        r={2.1}
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth={0.9}
                        opacity={0.75}
                      />
                    ),
                  )}
                  <polyline points={TRUE_CURVE} fill="none" stroke="#94a3b8" strokeWidth={1.6} strokeDasharray="5 4" />
                  {state.segs.map((s, i) => (
                    <polyline key={i} points={s} fill="none" stroke="#0f172a" strokeWidth={2.2} />
                  ))}
                  {[-4, -2, 0, 2, 4].map((v) => (
                    <text key={v} x={sx(v)} y={H - 10} fontSize="8" textAnchor="middle" fill="#94a3b8">
                      {v}
                    </text>
                  ))}
                  {[-1.5, 0, 1.5].map((v) => (
                    <text key={v} x={PAD.l - 4} y={sy(v) + 3} fontSize="8" textAnchor="end" fill="#94a3b8">
                      {v}
                    </text>
                  ))}
                  <text x={W - PAD.r} y={H - 10} fontSize="9" textAnchor="end" fill="#64748b">
                    x₁
                  </text>
                  <text x={PAD.l + 4} y={PAD.t + 10} fontSize="9" fill="#64748b">
                    x₂
                  </text>
                </svg>
                <div className="mt-1 flex flex-wrap gap-3 pl-8 text-[10px]">
                  <span className="text-rose-600">✚ C₁ 목표 출력 [1, −1]</span>
                  <span className="text-blue-600">○ C₂ 목표 출력 [−1, 1]</span>
                  <span className="text-gray-500">— — 참 결정경계</span>
                  <span className="text-gray-900 dark:text-gray-100">— 학습된 결정경계</span>
                </div>
              </Scroller>

              <div className="space-y-3">
                <div className="rounded-lg bg-gray-50 p-2.5 font-mono text-[11px] leading-6 dark:bg-gray-800">
                  <div>
                    에포크 {state.epoch} / {MAX_EPOCH}
                  </div>
                  <div>
                    오분류율 ={" "}
                    <span className="font-bold text-sky-600 dark:text-sky-400">
                      {Number.isFinite(state.err) ? `${fmt(state.err * 100, 2)}%` : "—"}
                    </span>
                  </div>
                  <div>E(X, θ) = {Number.isFinite(state.mse) ? fmt(state.mse, 4) : "—"}</div>
                </div>

                <div className="rounded-lg border border-gray-200 p-2 dark:border-gray-700">
                  <p className="mb-1 text-[10.5px] font-semibold text-gray-500">학습 곡선</p>
                  <svg viewBox={`0 0 ${CW} ${CH}`} className="h-auto w-full">
                    <line x1={26} y1={CH - 20} x2={CW - 8} y2={CH - 20} stroke="#cbd5e1" />
                    <line x1={26} y1={10} x2={26} y2={CH - 20} stroke="#cbd5e1" />
                    {state.curve.length > 1 && (
                      <polyline
                        points={state.curve.map((v, i) => `${cpx(i)},${cpy(v)}`).join(" ")}
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth={1.6}
                      />
                    )}
                    <text x={24} y={14} fontSize="7.5" textAnchor="end" fill="#94a3b8">
                      {fmt(cMax, 2)}
                    </text>
                    <text x={24} y={CH - 18} fontSize="7.5" textAnchor="end" fill="#94a3b8">
                      0
                    </text>
                    <text x={CW - 8} y={CH - 6} fontSize="8" textAnchor="end" fill="#94a3b8">
                      학습 에포크 수
                    </text>
                  </svg>
                </div>

                <Scroller>
                  <table className="w-full min-w-[220px] text-[11px]">
                    <thead>
                      <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                        <th className="px-1.5 py-1 font-semibold">은닉 뉴런의 수</th>
                        {H_CHOICES.map((h) => (
                          <th key={h} className="px-1.5 py-1 text-center font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-1.5 py-1 font-semibold text-gray-600 dark:text-gray-300">
                          오분류율
                        </td>
                        {H_CHOICES.map((h) => (
                          <td
                            key={h}
                            className={`px-1.5 py-1 text-center font-mono ${
                              h === hidden ? "font-bold text-sky-600" : "text-gray-500"
                            }`}
                          >
                            {SLIDE_TABLE[h]}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </Scroller>
                <Hint>
                  위 표는 강의록이 제시한 오분류율입니다. 왼쪽 그림은 같은 설정을 이 페이지에서 다시
                  학습시킨 것이라 값이 다릅니다. 특히 H = 2에서는 10% 안팎에 머물러 강의록의 6%와 거의
                  두 배 차이가 납니다.
                </Hint>
              </div>
            </div>

            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              H = 2에서는 꺾인 선 몇 개로만 경계를 만들 수 있어 참 결정경계를 따라가지 못합니다. H를 3, 5로
              늘리면 표현 가능한 함수가 다양해져 경계가 곡선에 가까워집니다. 강의록 표는 H = 10에서
              오분류율이 가장 낮지만, 여기서 다시 학습시킨 결과는 H = 5와 H = 10이 비슷한 수준에 머물고
              순서가 뒤집히기도 합니다. <strong>은닉 노드를 늘린 효과는 노드가 적은 쪽에서 더 뚜렷하고</strong>,
              충분해진 뒤로는 초기 가중치와 학습 횟수가 결과를 더 가릅니다.
            </p>

            <ComputedNote>
              왼쪽 그림의 데이터 400개와 학습 결과는 이 페이지에서 직접 생성·학습한 것입니다. 강의록에는 데이터
              범위·개수·목표 출력값·구조·오분류율 표와 결정경계 그림이 제시되어 있으나 데이터값과 참 결정경계의
              식은 없으므로, 그림의 모양에 맞춰 x₂ = cos x₁을 참 결정경계로 두고 재현했습니다. 학습률{" "}
              {ETA}, 최대 {MAX_EPOCH} 에포크의 온라인 학습입니다.
            </ComputedNote>
          </Card>
        </Sourced>

        <Sourced refs={{ slides: "MLP를 이용한 간단한 분류 실험 — 학습횟수에 따른 학습오차의 변화" }}>
          <Card>
            <CardTitle>학습횟수에 따른 학습오차의 변화</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              강의록은 이 문제를 5,000 에포크까지 학습시킨 곡선을 함께 보여 줍니다. 초기 몇백 에포크에서
              학습오차가 가파르게 떨어진 뒤, 그 이후로는 아주 천천히 줄어듭니다. 위 실험에서도 학습 곡선의
              앞부분이 급하게 내려가고 뒤로 갈수록 완만해지는 같은 모양을 확인할 수 있습니다.
            </p>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
