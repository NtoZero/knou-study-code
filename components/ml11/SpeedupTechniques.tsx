"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ComputedNote, Formula, Hint, Scroller, Slider, Tag } from "./ui";
import { PL, fmt, optRun, type OptMethod } from "./nets";

const STEPS = 1200;
const TOL = 0.3;

interface MethodDef {
  key: OptMethod;
  label: string;
  color: string;
  rule: string;
}

const METHODS: MethodDef[] = [
  { key: "plain", label: "기본 기울기 강하", color: "#64748b", rule: "Δθ⁽τ⁾ = −η ∇θ E(θ⁽τ⁾)" },
  {
    key: "momentum",
    label: "모멘텀",
    color: "#65a30d",
    rule: "Δθ⁽τ⁾ = −η ∇θ E(θ⁽τ⁾) + γ Δθ⁽τ⁻¹⁾  (식 12-2)",
  },
  {
    key: "nag",
    label: "NAG",
    color: "#0284c7",
    rule: "Δθ⁽τ⁾ = −η ∇θ E(θ⁽τ⁾ + γ Δθ⁽τ⁻¹⁾) + γ Δθ⁽τ⁻¹⁾  (식 12-3)",
  },
  {
    key: "adaptive",
    label: "적응적 학습률",
    color: "#ea580c",
    rule: "변화폭의 누적합으로 가중치마다 학습률을 조정 — RMSProp · AdaDelta",
  },
  { key: "adam", label: "Adam", color: "#be123c", rule: "RMSProp과 모멘텀 방법의 결합" },
];

const W = 440;
const H = 190;
const PAD = { l: 34, r: 12, t: 14, b: 26 };

/* 학습률에 따른 학습 양상 — E(θ) = ½θ² */
function bowl(eta: number, steps: number) {
  const path = [5];
  let t = 5;
  for (let i = 0; i < steps; i += 1) {
    t -= eta * t;
    if (!Number.isFinite(t) || Math.abs(t) > 60) {
      path.push(Math.sign(t) * 60);
      break;
    }
    path.push(t);
  }
  return path;
}

export default function SpeedupTechniques() {
  const [eta, setEta] = useState(0.5);
  const [gamma, setGamma] = useState(0.9);
  const [bowlEta, setBowlEta] = useState(0.4);

  const runs = useMemo(
    () =>
      METHODS.map((m) => ({
        def: m,
        run: optRun(m.key, {
          eta: m.key === "adaptive" || m.key === "adam" ? 0.1 : eta,
          gamma,
          rho: 0.9,
          steps: STEPS,
          start: 0,
          tol: TOL,
        }),
      })),
    [eta, gamma],
  );

  const bowlPath = useMemo(() => bowl(bowlEta, 24), [bowlEta]);

  const pxRaw = (i: number) => PAD.l + (i / STEPS) * (W - PAD.l - PAD.r);
  const pyRaw = (t: number) => H - PAD.b - ((t + 1) / 11) * (H - PAD.t - PAD.b);
  const px = (v: number) => Math.round(pxRaw(v) * 100) / 100;
  const py = (v: number) => Math.round(pyRaw(v) * 100) / 100;

  const clampT = (t: number) => Math.max(-58, Math.min(58, t * 6));
  const bx = (t: number) => 150 + (t / 60) * 130;
  const by = (e: number) => 110 - Math.min(e, 13) * 7;

  return (
    <section id="speedup" className="scroll-mt-32">
      <SectionTitle
        title="느린 학습의 개선 ② ~ ⑥ 초기화 · 모멘텀 · 적응적 학습률 · 배치 정규화 · 2차 미분"
        subtitle="평평한 구간을 건너는 데 몇 걸음이 걸리는지 같은 조건에서 직접 셉니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "12.2.2 (2) 가중치 초기화",
            slides: "느린 학습의 개선 기법 ② 가중치 초기화",
          }}
        >
          <Card>
            <CardTitle>② 가중치 초기화 — 세 가지 금지 사항</CardTitle>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                {
                  bad: "모두 0으로",
                  why: "오류 역전파가 제대로 동작하지 않는다.",
                },
                {
                  bad: "모두 같은 값으로",
                  why: "모든 가중치가 동일하게 변경되어, 노드를 여러 개 둔 의미가 사라진다.",
                },
                {
                  bad: "너무 큰 값으로",
                  why: "학습이 수렴하지 않고 발산하게 만든다. 셀 포화도 일어난다.",
                },
              ].map((x) => (
                <div
                  key={x.bad}
                  className="rounded-lg border border-rose-200 bg-rose-50/50 p-3 dark:border-rose-900 dark:bg-rose-950/30"
                >
                  <Tag tone="rose">{x.bad}</Tag>
                  <p className="mt-1.5 text-[11.5px] leading-5 text-gray-700 dark:text-gray-200">{x.why}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              따라서 가중치는 <strong>셀 포화가 일어나지 않도록 작은 값이면서도, 각 뉴런의 가중치가 서로
              달라지도록 랜덤한 값</strong>이 되어야 합니다. 입력의 가중합 u가 좋은 범위에 있도록 설정한다는
              뜻입니다.
            </p>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.2.2 (3) 모멘텀 · (4) 적응적 학습률",
            slides: "느린 학습의 개선 기법 ③ 모멘텀 · ④ 적응적 학습률",
          }}
        >
          <Card>
            <CardTitle>평평한 구간을 건너기 — 다섯 가지 방법을 같은 조건에서</CardTitle>
            <Formula note="기울기가 어디서나 거의 −0.02로 일정한, 넓고 평평한 구간을 가진 예시 오차함수">
              E(θ) = 0.02·ln(cosh(θ − 9)),  ∂E/∂θ = 0.02·tanh(θ − 9)
            </Formula>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
              <Scroller>
                <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[400px]">
                  <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="#cbd5e1" />
                  <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} stroke="#cbd5e1" />
                  <line
                    x1={PAD.l}
                    y1={py(PL.c)}
                    x2={W - PAD.r}
                    y2={py(PL.c)}
                    stroke="#65a30d"
                    strokeDasharray="4 3"
                  />
                  <text x={W - PAD.r} y={py(PL.c) - 4} fontSize="8.5" textAnchor="end" fill="#4d7c0f">
                    목표 θ = {PL.c}
                  </text>
                  {[0, 3, 6, 9].map((v) => (
                    <g key={v}>
                      <line x1={PAD.l - 3} y1={py(v)} x2={PAD.l} y2={py(v)} stroke="#cbd5e1" />
                      <text x={PAD.l - 5} y={py(v) + 3} fontSize="8" textAnchor="end" fill="#94a3b8">
                        {v}
                      </text>
                    </g>
                  ))}
                  {runs.map((r) => (
                    <polyline
                      key={r.def.key}
                      points={r.run.path
                        .filter((_, i) => i % 4 === 0)
                        .map((t, i) => `${px(i * 4)},${py(t)}`)
                        .join(" ")}
                      fill="none"
                      stroke={r.def.color}
                      strokeWidth={1.8}
                    />
                  ))}
                  <text x={W - PAD.r} y={H - 5} fontSize="9" textAnchor="end" fill="#94a3b8">
                    걸음 수 τ
                  </text>
                  <text x={PAD.l + 4} y={PAD.t + 9} fontSize="9" fill="#94a3b8">
                    θ
                  </text>
                </svg>
              </Scroller>

              <div className="space-y-3">
                <Slider label="학습률 η" value={eta} min={0.1} max={1.5} step={0.1} onChange={setEta} display={fmt(eta, 1)} />
                <Slider
                  label="관성률 γ"
                  value={gamma}
                  min={0}
                  max={0.95}
                  step={0.05}
                  onChange={setGamma}
                  display={fmt(gamma, 2)}
                />
                <Hint>
                  모든 방법이 θ = 0에서 출발합니다. 적응적 학습률과 Adam은 기울기 크기로 보폭을 스스로 정하므로
                  η = 0.1로 따로 고정했습니다.
                </Hint>
              </div>
            </div>

            <Scroller>
              <table className="mt-4 w-full min-w-[520px] text-[11.5px]">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                    <th className="px-2 py-1.5 font-semibold">방법</th>
                    <th className="px-2 py-1.5 font-semibold">수정식</th>
                    <th className="px-2 py-1.5 font-semibold">목표 도달 걸음 수</th>
                    <th className="px-2 py-1.5 font-semibold">기본 대비</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((r) => {
                    const base = runs[0].run.reached;
                    return (
                      <tr key={r.def.key} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-2 py-1.5 font-semibold" style={{ color: r.def.color }}>
                          {r.def.label}
                        </td>
                        <td className="px-2 py-1.5 font-mono text-[10.5px] text-gray-600 dark:text-gray-300">
                          {r.def.rule}
                        </td>
                        <td className="px-2 py-1.5 font-mono">
                          {r.run.reached === null ? `${STEPS}걸음 안에 못 감` : `${r.run.reached}걸음`}
                        </td>
                        <td className="px-2 py-1.5 font-mono">
                          {r.run.reached && base ? `${(base / r.run.reached).toFixed(1)}배 빠름` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Scroller>

            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              모멘텀 항은 <strong>이전의 움직임(관성)을 반영</strong>합니다. 평평한 구간처럼 기울기가 작지만
              방향이 한결같은 곳에서는 같은 방향의 수정이 계속 쌓여 보폭이 커지므로, 학습 속도의 저하를 막습니다.
              γ를 0으로 내리면 모멘텀의 경로가 기본 기울기 강하와 똑같아지는 것을 확인할 수 있습니다. 적응적
              학습률은 기울기 크기 자체가 작아도 누적합으로 나누어 보폭을 유지하므로 역시 빠르게 건너갑니다.
            </p>

            <ComputedNote>
              오차함수와 η·γ 값은 이 페이지에서 정한 것이고, 걸음 수는 각 수정식을 그대로 반복해 센 값입니다.
              교재·강의록에 식으로 제시된 것은 모멘텀(식 12-2)과 NAG(식 12-3)이며, RMSProp·AdaDelta·Adam은
              이름과 성격만 소개됩니다. 여기서는 그 성격(“변화폭의 누적합으로 학습률을 조정”, “RMSProp과 모멘텀의
              결합”)을 그대로 구현해 움직임만 비교했습니다. 이 예에서는 NAG와 모멘텀의 걸음 수가 같거나 한
              걸음밖에 차이 나지 않습니다. 평평한 구간에서는 한 걸음 앞을 내다본 자리의 기울기가 지금 자리의
              기울기와 거의 같기 때문이며, 둘의 차이는 기울기가 급하게 꺾이는 구간에서 드러납니다.
            </ComputedNote>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.2.2 (4) 적응적 학습률(그림 12-6)",
            slides: "느린 학습의 개선 기법 ④ 적응적 학습률",
          }}
        >
          <Card>
            <CardTitle>학습률 하나를 고정했을 때의 두 극단</CardTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[300px_minmax(0,1fr)]">
              <Scroller>
                <svg viewBox="0 0 300 130" className="h-auto w-full min-w-[280px]">
                  <polyline
                    points={Array.from({ length: 121 }, (_, i) => {
                      const t = -60 + i;
                      return `${bx(t)},${by(0.5 * (t / 10) ** 2)}`;
                    }).join(" ")}
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth={1.5}
                  />
                  {bowlPath.map((t, i) => (
                    <g key={i}>
                      {i > 0 && (
                        <line
                          x1={bx(clampT(bowlPath[i - 1]))}
                          y1={by(0.5 * (clampT(bowlPath[i - 1]) / 10) ** 2)}
                          x2={bx(clampT(t))}
                          y2={by(0.5 * (clampT(t) / 10) ** 2)}
                          stroke="#65a30d"
                          strokeWidth={1}
                          opacity={0.5}
                        />
                      )}
                      <circle
                        cx={bx(clampT(t))}
                        cy={by(0.5 * (clampT(t) / 10) ** 2)}
                        r={2.6}
                        fill={i === 0 ? "#0f172a" : "#65a30d"}
                        opacity={1 - i / 40}
                      />
                    </g>
                  ))}
                  <text x={150} y={126} fontSize="8.5" textAnchor="middle" fill="#94a3b8">
                    θ
                  </text>
                </svg>
              </Scroller>
              <div className="space-y-3">
                <Slider
                  label="학습률 η"
                  value={bowlEta}
                  min={0.1}
                  max={2.2}
                  step={0.1}
                  onChange={setBowlEta}
                  display={fmt(bowlEta, 1)}
                />
                <div className="rounded-lg bg-gray-50 p-2.5 font-mono text-[10.5px] leading-5 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  <div>E(θ) = ½θ², θ⁽⁰⁾ = 5 → θ ← (1 − η)θ</div>
                  <div>
                    처음 여섯 걸음: {bowlPath.slice(0, 6).map((v) => fmt(v, 2)).join(" → ")}
                  </div>
                  <div className={Math.abs(bowlPath[bowlPath.length - 1]) > 5 ? "text-rose-600" : ""}>
                    24걸음 뒤 θ = {fmt(bowlPath[bowlPath.length - 1], 4)}
                  </div>
                </div>
                <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                  학습률이 높으면 가중치가 급격히 변경되므로 발산하는 불안정한 형태가 되며, 반대로 너무 작으면
                  안정적이기는 하지만 극소점에 도달하는 데 오랜 시간이 걸립니다. 그래서 학습률을 하나로 고정해
                  쓰기보다 <strong>가중치마다 서로 다른 학습률</strong>을 갖게 하고, 가중치가 변화된 크기의
                  누적합을 활용하여 변화폭에 따라 적응적으로 결정합니다. 대표적인 방법이 RMSProp, AdaDelta,
                  Adam이며, 특히 Adam은 RMSProp과 모멘텀 방법을 결합한 것으로 딥러닝에서 가장 많이 사용됩니다.
                </p>
              </div>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.2.2 (5) 배치 정규화 · (6) 2차 미분 방법",
            slides: "느린 학습의 개선 기법 ⑤ 배치 정규화 · ⑥ 2차 미분 방법",
          }}
        >
          <Card>
            <CardTitle>⑤ 배치 정규화와 ⑥ 2차 미분 방법</CardTitle>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-[12.5px] font-bold text-gray-800 dark:text-gray-100">
                  ⑤ 배치 정규화 batch normalization
                </p>
                <p className="mt-1.5 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  학습하는 동안 각 노드의 <strong>활성화 함수로 들어가는 데이터 배치에 대한 입력</strong>이 셀
                  포화를 발생하지 않는 범위 내에 존재하도록 정규화시키는 방법. 활성화 함수에 대한 입력 분포를
                  항상 일정하게 유지하여 학습 효율을 높인다.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-[12.5px] font-bold text-gray-800 dark:text-gray-100">⑥ 2차 미분 방법</p>
                <p className="mt-1.5 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  기울기의 변화량을 결정할 때 오차함수의 2차 미분인 <strong>곡률(curvature)</strong> 정보를 함께
                  사용하는 방법. 다차원 오차함수의 곡률 정보는 헤시안 행렬 H로 표시된다. 이론적으로는 좋은
                  학습기법이지만 계산에 오랜 시간이 걸려서 작은 모델을 제외하고는 실질적으로 사용하는 데 한계가
                  있다.
                </p>
                <Formula className="mt-2" note="식 12-4">
                  Δθ⁽τ⁾ = −η (H(θ⁽τ⁾))⁻¹ ∇θ E(θ⁽τ⁾)
                </Formula>
              </div>
            </div>
            <Hint>
              배치 정규화가 막아 주는 것은 앞 절에서 본 셀 포화입니다. 들어가는 값의 범위를 손보는 쪽(배치
              정규화)과 함수 자체를 바꾸는 쪽(ReLU)이 같은 문제를 서로 다른 자리에서 다룹니다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
