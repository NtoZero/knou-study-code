"use client";

import { useState } from "react";
import { RotateCcw, Play } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, Scroller, ComputedNote, fmt, q12 } from "@/components/dlShared/ui";
import { F, Slider2, StepBar, Cell, r2, sig } from "@/components/dl2/ui2";

interface Weights {
  /** w1[i][j] — 입력 i번에서 은닉 j번으로 가는 연결 */
  w1: number[][];
  b1: number[];
  /** w2[j] — 은닉 j번에서 출력 뉴런으로 가는 연결 */
  w2: number[];
  b2: number;
}

/** 이 페이지에서 정한 예시 — 입력 2, 은닉 2, 출력 1의 작은 망 */
const INIT: Weights = {
  w1: [
    [0.5, -0.3],
    [0.8, 0.4],
  ],
  b1: [0.1, -0.2],
  w2: [0.6, -0.9],
  b2: 0.2,
};
const X = [1.0, 0.5];
const Y = 1;

function forward(w: Weights) {
  const u = [
    q12(X[0] * w.w1[0][0] + X[1] * w.w1[1][0] + w.b1[0]),
    q12(X[0] * w.w1[0][1] + X[1] * w.w1[1][1] + w.b1[1]),
  ];
  const o = [sig(u[0]), sig(u[1])];
  const uo = q12(o[0] * w.w2[0] + o[1] * w.w2[1] + w.b2);
  const yh = sig(uo);
  const err = q12(yh - Y);
  const E = q12(0.5 * err * err);
  return { u, o, uo, yh, err, E };
}

function backward(w: Weights, f: ReturnType<typeof forward>) {
  // 출력층 — δ = ŷ(1−ŷ)(ŷ − y)
  const dOut = q12(q12(f.yh * (1 - f.yh)) * f.err);
  // 은닉층 — δ_j = o_j(1−o_j) · (δ_out · w_j)
  const back = [q12(dOut * w.w2[0]), q12(dOut * w.w2[1])];
  const dHid = [
    q12(q12(f.o[0] * (1 - f.o[0])) * back[0]),
    q12(q12(f.o[1] * (1 - f.o[1])) * back[1]),
  ];
  const gw2 = [q12(dOut * f.o[0]), q12(dOut * f.o[1])];
  const gw1 = [
    [q12(dHid[0] * X[0]), q12(dHid[1] * X[0])],
    [q12(dHid[0] * X[1]), q12(dHid[1] * X[1])],
  ];
  return { dOut, back, dHid, gw2, gb2: dOut, gw1, gb1: dHid };
}

function update(w: Weights, g: ReturnType<typeof backward>, eta: number): Weights {
  return {
    w1: [
      [q12(w.w1[0][0] - eta * g.gw1[0][0]), q12(w.w1[0][1] - eta * g.gw1[0][1])],
      [q12(w.w1[1][0] - eta * g.gw1[1][0]), q12(w.w1[1][1] - eta * g.gw1[1][1])],
    ],
    b1: [q12(w.b1[0] - eta * g.gb1[0]), q12(w.b1[1] - eta * g.gb1[1])],
    w2: [q12(w.w2[0] - eta * g.gw2[0]), q12(w.w2[1] - eta * g.gw2[1])],
    b2: q12(w.b2 - eta * g.gb2),
  };
}

const STEPS = [
  { key: "fw", label: "순전파" },
  { key: "err", label: "오차" },
  { key: "bp", label: "역전파" },
  { key: "upd", label: "가중치 갱신" },
];

export default function BackpropWalkthrough() {
  const [w, setW] = useState<Weights>(INIT);
  const [step, setStep] = useState(0);
  const [eta, setEta] = useState(0.5);
  const [round, setRound] = useState(1);
  const [history, setHistory] = useState<number[]>([]);

  const f = forward(w);
  const g = backward(w, f);
  const next = update(w, g, eta);

  const apply = () => {
    setHistory((h) => [...h, f.E].slice(-24));
    setW(next);
    setRound((r) => r + 1);
    setStep(0);
  };

  const reset = () => {
    setW(INIT);
    setStep(0);
    setRound(1);
    setHistory([]);
  };

  // 그림 좌표
  const NX = [46, 180, 310];
  const NY = { in: [62, 150], hid: [56, 156], out: 106 };

  const lossPts = [...history, f.E];
  const maxLoss = Math.max(...lossPts, 0.0001);

  return (
    <section id="backprop-walkthrough" className="scroll-mt-32">
      <SectionTitle
        title="역전파 한 걸음 따라가기"
        subtitle="순전파 → 오차 → 역전파 → 가중치 갱신. 숫자가 어떻게 바뀌는지 직접 넘겨 보세요"
      />

      <Sourced
        refs={{
          slides: "3. 역전파 알고리즘 — 출력층·은닉층 연결 가중치의 학습, 연결 가중치 업데이트",
          lecture: "지금 계산한 델타는 그 다음 이전 층을 계산할 때 사용되므로 보관해 둔다",
        }}
      >
        <Card>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <StepBar steps={STEPS} current={step} onPick={setStep} />
            <span className="text-[11px] font-semibold text-gray-400">{round}번째 학습</span>
          </div>

          <Scroller>
            <svg viewBox="0 0 400 215" className="h-auto w-full min-w-[380px]" role="img">
              <title>입력 2개, 은닉 2개, 출력 1개로 이루어진 망에서 값이 앞뒤로 흐르는 모습</title>

              {/* 입력 → 은닉 연결 */}
              {[0, 1].map((i) =>
                [0, 1].map((j) => (
                  <line
                    key={`e1-${i}-${j}`}
                    x1={NX[0] + 20}
                    y1={NY.in[i]}
                    x2={NX[1] - 20}
                    y2={NY.hid[j]}
                    strokeWidth={step === 3 ? 2 : 1.2}
                    className={step === 3 ? "stroke-indigo-400" : "stroke-gray-300 dark:stroke-gray-600"}
                  />
                )),
              )}
              {/* 은닉 → 출력 연결 */}
              {[0, 1].map((j) => (
                <line
                  key={`e2-${j}`}
                  x1={NX[1] + 20}
                  y1={NY.hid[j]}
                  x2={NX[2] - 22}
                  y2={NY.out}
                  strokeWidth={step === 3 ? 2 : 1.2}
                  className={step === 3 ? "stroke-indigo-400" : "stroke-gray-300 dark:stroke-gray-600"}
                />
              ))}

              {/* 역전파 화살표 */}
              {step === 2 &&
                [0, 1].map((j) => (
                  <path
                    key={`bp-${j}`}
                    d={`M ${NX[2] - 24} ${NY.out + 10} Q ${r2((NX[1] + NX[2]) / 2)} ${r2(NY.hid[j] + 34)} ${NX[1] + 22} ${NY.hid[j] + 8}`}
                    fill="none"
                    strokeWidth="2"
                    strokeDasharray="5 4"
                    className="stroke-rose-500"
                  />
                ))}

              {/* 입력 노드 */}
              {[0, 1].map((i) => (
                <g key={`in-${i}`}>
                  <circle
                    cx={NX[0]}
                    cy={NY.in[i]}
                    r="19"
                    strokeWidth="1.6"
                    className="fill-white stroke-gray-300 dark:fill-gray-900 dark:stroke-gray-600"
                  />
                  <text
                    x={NX[0]}
                    y={NY.in[i] + 4}
                    textAnchor="middle"
                    className="fill-gray-700 text-[11px] font-bold dark:fill-gray-100"
                  >
                    {fmt(X[i], 1)}
                  </text>
                  <text x={NX[0]} y={NY.in[i] - 25} textAnchor="middle" className="fill-gray-400 text-[9px]">
                    x{i + 1}
                  </text>
                </g>
              ))}

              {/* 은닉 노드 */}
              {[0, 1].map((j) => (
                <g key={`hid-${j}`}>
                  <circle
                    cx={NX[1]}
                    cy={NY.hid[j]}
                    r="22"
                    strokeWidth="1.8"
                    className={
                      step === 0
                        ? "fill-indigo-50 stroke-indigo-500 dark:fill-indigo-950 dark:stroke-indigo-400"
                        : step === 2
                          ? "fill-rose-50 stroke-rose-500 dark:fill-rose-950 dark:stroke-rose-400"
                          : "fill-white stroke-gray-300 dark:fill-gray-900 dark:stroke-gray-600"
                    }
                  />
                  <text
                    x={NX[1]}
                    y={NY.hid[j] + 4}
                    textAnchor="middle"
                    className="fill-gray-800 text-[10px] font-bold dark:fill-gray-100"
                  >
                    {step === 2 ? fmt(g.dHid[j], 4) : fmt(f.o[j], 4)}
                  </text>
                  <text x={NX[1]} y={NY.hid[j] - 28} textAnchor="middle" className="fill-gray-400 text-[9px]">
                    {step === 2 ? `δ${j + 1}` : `o${j + 1} (u=${fmt(f.u[j], 3)})`}
                  </text>
                </g>
              ))}

              {/* 출력 노드 */}
              <circle
                cx={NX[2]}
                cy={NY.out}
                r="24"
                strokeWidth="1.8"
                className={
                  step === 1
                    ? "fill-rose-50 stroke-rose-500 dark:fill-rose-950 dark:stroke-rose-400"
                    : step === 2
                      ? "fill-rose-50 stroke-rose-500 dark:fill-rose-950 dark:stroke-rose-400"
                      : "fill-indigo-50 stroke-indigo-500 dark:fill-indigo-950 dark:stroke-indigo-400"
                }
              />
              <text
                x={NX[2]}
                y={NY.out + 4}
                textAnchor="middle"
                className="fill-gray-800 text-[10px] font-bold dark:fill-gray-100"
              >
                {step === 2 ? fmt(g.dOut, 4) : fmt(f.yh, 4)}
              </text>
              <text x={NX[2]} y={NY.out - 30} textAnchor="middle" className="fill-gray-400 text-[9px]">
                {step === 2 ? "δ_out" : "ŷ"}
              </text>
              <text x={NX[2] + 32} y={NY.out + 4} className="fill-gray-500 text-[10px]">
                y = {Y}
              </text>

              <text x={NX[0]} y="200" textAnchor="middle" className="fill-gray-400 text-[9px]">
                입력층
              </text>
              <text x={NX[1]} y="200" textAnchor="middle" className="fill-gray-400 text-[9px]">
                은닉층
              </text>
              <text x={NX[2]} y="200" textAnchor="middle" className="fill-gray-400 text-[9px]">
                출력층
              </text>
            </svg>
          </Scroller>

          {/* 단계별 설명 */}
          {step === 0 && (
            <div className="space-y-2">
              <F note="앞 층 출력에 가중치를 곱해 더하고, 시그모이드를 통과시킨다">
                u<sub>j</sub> = Σ x<sub>i</sub> w<sub>ij</sub> + b<sub>j</sub> , o<sub>j</sub> = φ(u<sub>j</sub>)
              </F>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
                <Cell label="u₁" value={fmt(f.u[0], 4)} highlight />
                <Cell label="o₁" value={fmt(f.o[0], 4)} highlight />
                <Cell label="u₂" value={fmt(f.u[1], 4)} highlight />
                <Cell label="o₂" value={fmt(f.o[1], 4)} highlight />
                <Cell label="ŷ" value={fmt(f.yh, 4)} highlight />
              </div>
              <Hint>
                입력층에서 출력층 방향으로 한 번 훑어 예측 ŷ를 만듭니다. 이때 각 층의 입력과 출력을
                보관해 둡니다 — 뒤에서 역전파할 때 다시 쓰기 때문입니다.
              </Hint>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-2">
              <F note="출력층에 대해서만 레이블이 주어진다">E = ½ (ŷ − y)²</F>
              <div className="grid grid-cols-3 gap-1.5">
                <Cell label="ŷ" value={fmt(f.yh, 4)} />
                <Cell label="ŷ − y" value={fmt(f.err, 4)} highlight tone="rose" />
                <Cell label="손실 E" value={fmt(f.E, 5)} highlight tone="rose" />
              </div>
              <Hint>
                은닉층 o₁·o₂가 어떤 값이어야 했는지는 데이터 어디에도 없습니다. 오차는 출력에서만
                잴 수 있고, 그 책임을 뒤로 나눠 주는 일이 다음 단계입니다.
              </Hint>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <div className="grid gap-2 sm:grid-cols-2">
                <F note="출력층 — 시그모이드 미분과 오차의 곱">
                  δ<sub>out</sub> = ŷ(1 − ŷ)(ŷ − y)
                </F>
                <F note="은닉층 — 되돌아온 δ에 자기 미분을 곱한다">
                  δ<sub>j</sub> = o<sub>j</sub>(1 − o<sub>j</sub>) · δ<sub>out</sub> w<sub>j</sub>
                </F>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <Cell label="δ_out" value={fmt(g.dOut, 5)} highlight tone="rose" />
                <Cell label="δ₁" value={fmt(g.dHid[0], 5)} highlight tone="rose" />
                <Cell label="δ₂" value={fmt(g.dHid[1], 5)} highlight tone="rose" />
              </div>
              <Hint>
                δ_out에 연결 가중치 w₁ = {fmt(w.w2[0], 3)}, w₂ = {fmt(w.w2[1], 3)}을 곱해 각 은닉
                뉴런으로 되돌려 보낸 값이 {fmt(g.back[0], 5)}, {fmt(g.back[1], 5)}입니다. 여기에
                그 뉴런의 시그모이드 미분 o(1 − o)를 곱한 것이 δ₁, δ₂입니다.
              </Hint>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <div className="grid gap-2 sm:grid-cols-2">
                <F note="그 연결의 δ와 앞 층 출력의 곱에 학습률을 곱한다">
                  Δw<sub>ij</sub> = η δ<sub>j</sub> o<sub>i</sub>
                </F>
                <F note="변화량을 빼 주면 새 가중치가 된다">w(t+1) = w(t) − Δw(t)</F>
              </div>
              <Slider2
                label="학습률 η"
                value={eta}
                min={0.1}
                max={2}
                step={0.1}
                onChange={setEta}
                display={fmt(eta, 1)}
              />
              <Scroller>
                <table className="w-full min-w-[420px] border-collapse text-[11.5px]">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                      <th className="py-1.5 pr-2 font-semibold">가중치</th>
                      <th className="py-1.5 pr-2 font-semibold">지금 값</th>
                      <th className="py-1.5 pr-2 font-semibold">∂E/∂w</th>
                      <th className="py-1.5 pr-2 font-semibold">Δw = η·∂E/∂w</th>
                      <th className="py-1.5 font-semibold">갱신 후</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {[
                      { n: "w₁→출력", cur: w.w2[0], gr: g.gw2[0], nx: next.w2[0] },
                      { n: "w₂→출력", cur: w.w2[1], gr: g.gw2[1], nx: next.w2[1] },
                      { n: "b 출력", cur: w.b2, gr: g.gb2, nx: next.b2 },
                      { n: "x₁→은닉1", cur: w.w1[0][0], gr: g.gw1[0][0], nx: next.w1[0][0] },
                      { n: "x₂→은닉1", cur: w.w1[1][0], gr: g.gw1[1][0], nx: next.w1[1][0] },
                      { n: "x₁→은닉2", cur: w.w1[0][1], gr: g.gw1[0][1], nx: next.w1[0][1] },
                      { n: "x₂→은닉2", cur: w.w1[1][1], gr: g.gw1[1][1], nx: next.w1[1][1] },
                    ].map((r) => (
                      <tr key={r.n} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1.5 pr-2 font-sans font-semibold text-gray-600 dark:text-gray-300">
                          {r.n}
                        </td>
                        <td className="py-1.5 pr-2 text-gray-500">{fmt(r.cur, 4)}</td>
                        <td className="py-1.5 pr-2 text-rose-600 dark:text-rose-400">
                          {fmt(r.gr, 5)}
                        </td>
                        <td className="py-1.5 pr-2 text-gray-500">{fmt(q12(eta * r.gr), 5)}</td>
                        <td className="py-1.5 font-bold text-indigo-700 dark:text-indigo-300">
                          {fmt(r.nx, 4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Scroller>
              <p className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-[11.5px] leading-5 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-200">
                갱신하면 손실이 {fmt(f.E, 5)} → {fmt(forward(next).E, 5)}로 바뀝니다.
              </p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(3, s + 1))}
              disabled={step === 3}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-40"
            >
              다음 단계
            </button>
            <button
              type="button"
              onClick={apply}
              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-300 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-950/40"
            >
              <Play size={12} />
              갱신하고 한 번 더
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <RotateCcw size={12} />
              처음으로
            </button>

            {lossPts.length > 1 && (
              <span className="ml-auto inline-flex items-center gap-2">
                <svg viewBox="0 0 120 32" className="h-8 w-[120px]" role="img">
                  <title>반복할수록 줄어드는 손실</title>
                  <polyline
                    points={lossPts
                      .map(
                        (v, i) =>
                          `${r2((i / Math.max(1, lossPts.length - 1)) * 116 + 2)},${r2(30 - (v / maxLoss) * 26)}`,
                      )
                      .join(" ")}
                    fill="none"
                    strokeWidth="1.8"
                    className="stroke-indigo-500"
                  />
                </svg>
                <span className="text-[11px] font-semibold text-gray-500">손실 변화</span>
              </span>
            )}
          </div>

          <ComputedNote>
            가중치 초깃값, 입력 (x₁, x₂) = (1.0, 0.5), 레이블 y = 1은 계산을 따라갈 수 있도록 이
            페이지에서 정한 예시입니다. 식과 절차는 강의록을 그대로 따릅니다.
          </ComputedNote>
        </Card>
      </Sourced>
    </section>
  );
}
