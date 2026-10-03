"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ComputedNote, Formula, Hint, Scroller, Slider } from "./ui";
import { fmt } from "./mlpCore";

/* 굴곡이 둘인 오차함수 — 전역 극소와 지역 극소를 한 그림에 담기 위한 예시 함수 */
const E = (t: number) => ((t * t - 4) ** 2) / 8 + t / 2 + 1;
const dE = (t: number) => (t * (t * t - 4)) / 4 + 0.5;

const T_MIN = -3.2;
const T_MAX = 3.0;
const MAX_STEPS = 200;
const DIVERGE = 8;

/* 수치적으로 찾아 둔 극소점 */
const GLOBAL_MIN = -2.2143;
const LOCAL_MIN = 1.6751;

const W = 460;
const H = 230;
const PAD = { l: 34, r: 14, t: 14, b: 26 };
const E_MAX = 6.2;
const E_MIN = -0.6;
const sx = (t: number) => PAD.l + ((t - T_MIN) / (T_MAX - T_MIN)) * (W - PAD.l - PAD.r);
const sy = (e: number) => H - PAD.b - ((e - E_MIN) / (E_MAX - E_MIN)) * (H - PAD.t - PAD.b);

const CURVE = (() => {
  const pts: string[] = [];
  for (let t = T_MIN; t <= T_MAX + 1e-9; t += 0.02) pts.push(`${sx(t)},${sy(E(t))}`);
  return pts.join(" ");
})();

interface Run {
  path: number[];
  diverged: boolean;
  settled: number | null;
}

function runDescent(theta0: number, eta: number): Run {
  const path = [theta0];
  let t = theta0;
  for (let i = 0; i < MAX_STEPS; i += 1) {
    const next = t - eta * dE(t);
    if (!Number.isFinite(next) || Math.abs(next) > DIVERGE) {
      path.push(Math.sign(next) * DIVERGE);
      return { path, diverged: true, settled: null };
    }
    path.push(next);
    if (Math.abs(next - t) < 1e-7) {
      t = next;
      break;
    }
    t = next;
  }
  const settled = Math.abs(dE(t)) < 1e-3 ? t : null;
  return { path, diverged: false, settled };
}

const SOLUTIONS = [
  {
    head: "학습률을 적응적으로 조정",
    body: "수정폭을 결정하는 학습률 η를 학습 진행에 따라 바꾸어 준다.",
  },
  {
    head: "시뮬레이티드 어닐링",
    body: "학습의 초기 단계에서는 지역 극소로부터 빠져나올 수 있는 여지를 만들어 준다.",
  },
  {
    head: "초기치를 바꿔 여러 번 학습",
    body: "탐색의 시작점을 결정하는 초기치를 변화시키면서 여러 번 학습을 시도해 원하는 정도의 오차를 얻어 낸다.",
  },
  {
    head: "충분히 많은 은닉 노드",
    body: "충분히 많은 수의 은닉 노드를 사용해 원하는 정도의 오차를 얻도록 시도해 본다.",
  },
];

export default function GradientDescentLab() {
  const [theta0, setTheta0] = useState(0);
  const [eta, setEta] = useState(0.3);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const run = useMemo(() => runDescent(theta0, eta), [theta0, eta]);
  const last = run.path.length - 1;
  const cur = Math.min(step, last);
  const theta = run.path[cur];
  const grad = dE(theta);
  const delta = -eta * grad;

  useEffect(() => {
    setStep(0);
    setPlaying(false);
  }, [theta0, eta]);

  useEffect(() => {
    if (!playing) return;
    if (cur >= last) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setStep((s) => s + 1), 90);
    return () => clearTimeout(id);
  }, [playing, cur, last]);

  const outcome = run.diverged
    ? { label: "발산", tone: "text-rose-600 dark:text-rose-400", why: "수정폭이 너무 커서 오차값이 오히려 커지는 방향으로 튀어 나갑니다. 학습이 불안정해진 경우입니다." }
    : run.settled === null
      ? { label: "수렴하지 못함", tone: "text-amber-600 dark:text-amber-400", why: `${MAX_STEPS}번을 반복해도 한 점에 멈추지 못하고 극소점 주변을 오갑니다. η를 줄이면 안정적으로 멈춥니다.` }
      : Math.abs(run.settled - GLOBAL_MIN) < 0.05
        ? { label: "전역 극소에 도달", tone: "text-sky-600 dark:text-sky-400", why: "오차함수 전체에서 가장 낮은 지점에 멈췄습니다." }
        : { label: "지역 극소에 갇힘", tone: "text-rose-600 dark:text-rose-400", why: "기울기가 0이 되는 점에서 더 이상 움직이지 않습니다. 전역 극소는 왼쪽에 따로 있지만, 기울기 정보만으로는 그곳으로 갈 방법이 없습니다." };

  const tangentHalf = 0.55;
  const tangent = {
    x1: sx(Math.max(T_MIN, theta - tangentHalf)),
    y1: sy(E(theta) + grad * Math.max(-tangentHalf, T_MIN - theta)),
    x2: sx(Math.min(T_MAX, theta + tangentHalf)),
    y2: sy(E(theta) + grad * Math.min(tangentHalf, T_MAX - theta)),
  };

  return (
    <section id="gradient-descent" className="scroll-mt-32">
      <SectionTitle
        title="기울기 강하 학습법과 지역 극소"
        subtitle="η와 시작점을 바꿔 가며 실제로 반복 계산한 궤적입니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "11.3.1 다층 퍼셉트론의 학습 — 기울기 강하 학습법",
            slides: "기울기 강하 학습법",
          }}
        >
          <Card>
            <CardTitle>기울기 강하 학습법의 일반식</CardTitle>
            <Formula note="η는 학습의 속도를 조정하는 작은 실수값 — 학습률(learning rate)">
              θ<sup>(τ+1)</sup> = θ<sup>(τ)</sup> + Δθ<sup>(τ)</sup> = θ<sup>(τ)</sup> − η ∂E(θ<sup>(τ)</sup>)/∂θ
            </Formula>
            <Hint>
              한 번에 전체 탐색공간의 최적해를 얻는 것이 아니라, 어떤 시점 τ의 파라미터 θ<sup>(τ)</sup> 주변
              정보만으로 오차값을 감소시킬 수 있는 방향을 찾아 θ<sup>(τ+1)</sup>을 얻는 과정을 반복합니다.
              오차값을 감소시키는 방향은 오차함수를 파라미터로 편미분해 얻는 기울기에 비례하므로,
              현재 기울기를 보고 내리막이 되는 방향으로 조금씩 수정합니다. η가 크면 학습 속도가 빨라지나
              학습이 불안정해지고, 작으면 안정적이지만 느려집니다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "11.3.2 학습의 고려사항 — 지역 극소의 문제",
            slides: "MLP 학습의 고려사항 — 지역 극소의 문제",
            lecture: "조금씩 움직이면 극소점 도달은 보장되지만 그것이 전역 극소라는 보장은 전혀 없다는 점을 갈라서 설명",
          }}
        >
          <Card>
            <CardTitle>직접 굴려 보기</CardTitle>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_250px]">
              <Scroller>
                <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[420px]">
                  <line x1={PAD.l} y1={sy(0)} x2={W - PAD.r} y2={sy(0)} stroke="#e2e8f0" />
                  <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} stroke="#cbd5e1" />
                  <polyline points={CURVE} fill="none" stroke="#0284c7" strokeWidth={2} />

                  {/* 극소점 표시 */}
                  <circle cx={sx(GLOBAL_MIN)} cy={sy(E(GLOBAL_MIN))} r={4} fill="#16a34a" />
                  <text x={sx(GLOBAL_MIN)} y={sy(E(GLOBAL_MIN)) + 17} fontSize="9" textAnchor="middle" fill="#16a34a">
                    전역 극소
                  </text>
                  <circle cx={sx(LOCAL_MIN)} cy={sy(E(LOCAL_MIN))} r={4} fill="#f59e0b" />
                  <text x={sx(LOCAL_MIN)} y={sy(E(LOCAL_MIN)) + 17} fontSize="9" textAnchor="middle" fill="#d97706">
                    지역 극소
                  </text>

                  {/* 지나온 궤적 */}
                  {run.path.slice(0, cur + 1).map((t, i) =>
                    Math.abs(t) > DIVERGE - 1e-9 ? null : (
                      <circle key={i} cx={sx(t)} cy={sy(E(t))} r={2.2} fill="#64748b" opacity={0.35} />
                    ),
                  )}

                  {/* 접선 */}
                  <line
                    x1={tangent.x1}
                    y1={tangent.y1}
                    x2={tangent.x2}
                    y2={tangent.y2}
                    stroke="#dc2626"
                    strokeWidth={1.4}
                    strokeDasharray="4 3"
                  />
                  {/* 수정량 Δθ */}
                  <line
                    x1={sx(theta)}
                    y1={H - PAD.b}
                    x2={sx(Math.max(T_MIN, Math.min(T_MAX, theta + delta)))}
                    y2={H - PAD.b}
                    stroke="#dc2626"
                    strokeWidth={3}
                    markerEnd="url(#gd-arrow)"
                  />
                  <defs>
                    <marker id="gd-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6 Z" fill="#dc2626" />
                    </marker>
                  </defs>
                  <line
                    x1={sx(theta)}
                    y1={sy(E(theta))}
                    x2={sx(theta)}
                    y2={H - PAD.b}
                    stroke="#94a3b8"
                    strokeWidth={0.8}
                    strokeDasharray="2 3"
                  />
                  <circle cx={sx(theta)} cy={sy(E(theta))} r={5.5} fill="#dc2626" />

                  <text x={PAD.l - 4} y={PAD.t + 8} fontSize="9" textAnchor="end" fill="#94a3b8">
                    E(θ)
                  </text>
                  <text x={W - PAD.r} y={H - 8} fontSize="9" textAnchor="end" fill="#94a3b8">
                    θ
                  </text>
                </svg>
              </Scroller>

              <div className="space-y-3">
                <Slider
                  label="시작점 θ⁽⁰⁾"
                  value={theta0}
                  min={T_MIN}
                  max={T_MAX}
                  step={0.1}
                  onChange={setTheta0}
                  display={fmt(theta0, 1)}
                />
                <Slider
                  label="학습률 η"
                  value={eta}
                  min={0.05}
                  max={2}
                  step={0.05}
                  onChange={setEta}
                  display={fmt(eta, 2)}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPlaying((p) => !p)}
                    disabled={cur >= last}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
                  >
                    {playing ? <Pause size={13} /> : <Play size={13} />}
                    {playing ? "멈춤" : "반복 실행"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.min(s + 1, last))}
                    disabled={cur >= last}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
                  >
                    한 걸음
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(0);
                      setPlaying(false);
                    }}
                    className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-gray-500 dark:border-gray-700"
                    aria-label="처음으로"
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>

                <div className="rounded-lg bg-gray-50 p-2.5 font-mono text-[10.5px] leading-5 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  <div>τ = {cur}</div>
                  <div>θ⁽τ⁾ = {fmt(theta, 4)}</div>
                  <div>∂E/∂θ = {fmt(grad, 4)}</div>
                  <div className="text-rose-600 dark:text-rose-400">
                    Δθ = −η·∂E/∂θ = {fmt(delta, 4)}
                  </div>
                  <div>E(θ⁽τ⁾) = {fmt(E(theta), 4)}</div>
                </div>

                <div className="rounded-lg border border-gray-200 p-2.5 dark:border-gray-700">
                  <p className={`text-xs font-bold ${outcome.tone}`}>{outcome.label}</p>
                  <p className="mt-1 text-[11px] leading-5 text-gray-600 dark:text-gray-400">{outcome.why}</p>
                </div>
              </div>
            </div>
            <ComputedNote>
              이 오차 곡선은 전역 극소와 지역 극소를 한 화면에 담기 위해 만든 설명용 1차원 함수입니다.
              교재·강의록에는 같은 모양의 그림만 있고 함수식은 제시되지 않습니다. 궤적의 모든 점은 위 식을
              그대로 반복 계산한 값입니다.
            </ComputedNote>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "11.3.2 학습의 고려사항 — 지역 극소의 문제",
            slides: "MLP 학습의 고려사항 — 지역 극소의 문제",
          }}
        >
          <Card>
            <CardTitle>지역 극소의 문제와 해결책</CardTitle>
            <p className="mb-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              수정폭을 충분히 작게 하면 기울기를 따라 오차값이 점점 감소하다가 기울기가 0이 되는 점에서
              멈추게 되어 <strong>극소값을 찾는 것이 보장</strong>됩니다. 그러나 이렇게 찾아지는 해는 어디까지나
              지역 극소입니다. 시작점이 전역 극소에서 멀면 학습 도중 처음 만나는 지역 극소에 도달한 뒤 더
              이상 움직이지 않습니다. 다만 찾아진 지역 극소가 원하는 정도의 오차를 준다면 크게 문제되지 않습니다.
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {SOLUTIONS.map((s, i) => (
                <div
                  key={s.head}
                  className="rounded-lg border border-gray-200 p-2.5 dark:border-gray-700"
                >
                  <p className="text-[12px] font-bold text-sky-700 dark:text-sky-300">
                    {i < 2 ? "" : "현실적인 해결책 · "}
                    {s.head}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-5 text-gray-600 dark:text-gray-400">{s.body}</p>
                </div>
              ))}
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
