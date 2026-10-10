"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, ComputedNote, Formula, Hint, Scroller, Slider } from "./ui";
import { fmt } from "./nets";

interface Act {
  id: string;
  name: string;
  expr: string;
  dExpr: string;
  f: (u: number) => number;
  df: (u: number) => number;
  color: string;
  note: string;
}

const LEAK = 0.1;

const ACTS: Act[] = [
  {
    id: "sigmoid",
    name: "시그모이드",
    expr: "φ(u) = 1 / (1 + e⁻ᵘ)",
    dExpr: "φ′(u) = φ(u)(1 − φ(u))",
    f: (u) => 1 / (1 + Math.exp(-u)),
    df: (u) => {
      const y = 1 / (1 + Math.exp(-u));
      return y * (1 - y);
    },
    color: "#0284c7",
    note: "큰 값이 들어오면 0 또는 1로 포화 — 미분값이 0에 가까워진다",
  },
  {
    id: "tanh",
    name: "하이퍼탄젠트",
    expr: "φ(u) = tanh(u)",
    dExpr: "φ′(u) = 1 − tanh²(u)",
    f: (u) => Math.tanh(u),
    df: (u) => 1 - Math.tanh(u) ** 2,
    color: "#7c3aed",
    note: "시그모이드와 마찬가지로 양 끝에서 포화된다",
  },
  {
    id: "relu",
    name: "ReLU",
    expr: "φ_ReLU(u) = max(0, u)",
    dExpr: "φ′(u) = 1 (u > 0), 0 (u < 0)",
    f: (u) => Math.max(0, u),
    df: (u) => (u > 0 ? 1 : 0),
    color: "#65a30d",
    note: "입력을 그대로 전달하고 미분값도 0이 아닌 1 — 계산도 빠르다",
  },
  {
    id: "softplus",
    name: "softplus",
    expr: "φ(u) = ln(1 + eᵘ)",
    dExpr: "φ′(u) = 1 / (1 + e⁻ᵘ)",
    f: (u) => Math.log(1 + Math.exp(u)),
    df: (u) => 1 / (1 + Math.exp(-u)),
    color: "#ea580c",
    note: "ReLU의 꺾인 모서리를 매끄럽게 만든 함수",
  },
  {
    id: "leaky",
    name: "leaky ReLU",
    expr: `φ(u) = u (u > 0), ${LEAK}u (u ≤ 0)`,
    dExpr: `φ′(u) = 1 (u > 0), ${LEAK} (u < 0)`,
    f: (u) => (u > 0 ? u : LEAK * u),
    df: (u) => (u > 0 ? 1 : LEAK),
    color: "#be123c",
    note: "음수 쪽에도 작은 기울기를 남겨 둔다. 그 기울기를 학습으로 정하면 pReLU",
  },
];

const W = 360;
const H = 210;
const PAD = { l: 32, r: 12, t: 12, b: 26 };
const U_MIN = -4;
const U_MAX = 4;
const Y_MIN = -1.6;
const Y_MAX = 3.2;

const pxRaw = (u: number) => PAD.l + ((u - U_MIN) / (U_MAX - U_MIN)) * (W - PAD.l - PAD.r);
const pyRaw = (v: number) => H - PAD.b - ((Math.max(Y_MIN, Math.min(Y_MAX, v)) - Y_MIN) / (Y_MAX - Y_MIN)) * (H - PAD.t - PAD.b);
  const px = (v: number) => Math.round(pxRaw(v) * 100) / 100;
  const py = (v: number) => Math.round(pyRaw(v) * 100) / 100;

function curveOf(f: (u: number) => number) {
  const pts: string[] = [];
  for (let u = U_MIN; u <= U_MAX; u += 0.04) pts.push(`${px(u)},${py(f(u))}`);
  return pts.join(" ");
}

const DEPTHS = [1, 2, 3, 5, 8, 12];

export default function ActivationSwap() {
  const [shown, setShown] = useState<string[]>(["sigmoid", "tanh", "relu"]);
  const [showD, setShowD] = useState(true);
  const [u, setU] = useState(1.5);

  const toggle = (id: string) =>
    setShown((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const chain = useMemo(
    () =>
      ACTS.map((a) => ({
        act: a,
        d: a.df(u),
        products: DEPTHS.map((n) => Math.pow(a.df(u), n)),
      })),
    [u],
  );

  return (
    <section id="activation-swap" className="scroll-mt-32">
      <SectionTitle
        title="느린 학습의 개선 ① 활성화 함수의 변화"
        subtitle="미분값을 층 수만큼 곱해 보면 왜 ReLU로 바꾸는지가 숫자로 보입니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "12.2.2 (1) 활성화 함수의 변화(그림 12-5)",
            slides: "느린 학습의 개선 기법 ① 활성화 함수의 변화",
          }}
        >
          <Card>
            <CardTitle>기울기가 줄어들지 않는 함수로 바꾼다</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              기울기 소멸 문제는 활성화 함수에 기인하므로, 시그모이드 함수나 하이퍼탄젠트 함수 대신{" "}
              <strong>기울기가 줄어들지 않는 새로운 활성화 함수</strong>를 사용하면 이를 해결할 수 있습니다.
              따라서 심층 신경망에서는 활성화 함수로 <strong>ReLU 함수</strong>와 이를 변형한 softplus,
              leaky ReLU, pReLU 등을 사용합니다.
            </p>

            <div className="mb-3 mt-4 flex flex-wrap items-center gap-2">
              {ACTS.map((a) => (
                <Chip key={a.id} active={shown.includes(a.id)} onClick={() => toggle(a.id)}>
                  {a.name}
                </Chip>
              ))}
              <Chip active={showD} onClick={() => setShowD(!showD)}>
                미분함수 겹쳐 보기
              </Chip>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_230px]">
              <Scroller>
                <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[320px]">
                  <line x1={PAD.l} y1={py(0)} x2={W - PAD.r} y2={py(0)} stroke="#cbd5e1" />
                  <line x1={px(0)} y1={PAD.t} x2={px(0)} y2={H - PAD.b} stroke="#e2e8f0" />
                  {[-1, 1, 2, 3].map((v) => (
                    <g key={v}>
                      <line x1={PAD.l - 3} y1={py(v)} x2={PAD.l} y2={py(v)} stroke="#cbd5e1" />
                      <text x={PAD.l - 5} y={py(v) + 3} fontSize="8" textAnchor="end" fill="#94a3b8">
                        {v}
                      </text>
                    </g>
                  ))}
                  {ACTS.filter((a) => shown.includes(a.id)).map((a) => (
                    <g key={a.id}>
                      {showD && (
                        <polyline
                          points={curveOf(a.df)}
                          fill="none"
                          stroke={a.color}
                          strokeWidth={1.2}
                          strokeDasharray="4 3"
                          opacity={0.75}
                        />
                      )}
                      <polyline points={curveOf(a.f)} fill="none" stroke={a.color} strokeWidth={2} />
                    </g>
                  ))}
                  <line
                    x1={px(u)}
                    y1={PAD.t}
                    x2={px(u)}
                    y2={H - PAD.b}
                    stroke="#0f172a"
                    strokeWidth={1}
                    strokeDasharray="2 3"
                  />
                  {ACTS.filter((a) => shown.includes(a.id)).map((a) => (
                    <circle key={a.id} cx={px(u)} cy={py(a.f(u))} r={3.2} fill={a.color} />
                  ))}
                  <text x={W - PAD.r} y={H - 6} fontSize="9" textAnchor="end" fill="#94a3b8">
                    u
                  </text>
                </svg>
              </Scroller>

              <div className="space-y-3">
                <Slider label="가중합 u" value={u} min={-4} max={4} step={0.1} onChange={setU} display={fmt(u, 1)} />
                <div className="space-y-1.5">
                  {ACTS.filter((a) => shown.includes(a.id)).map((a) => (
                    <div key={a.id} className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                      <p className="text-[11px] font-bold" style={{ color: a.color }}>
                        {a.name}
                      </p>
                      <p className="font-mono text-[10.5px] text-gray-600 dark:text-gray-300">
                        φ({fmt(u, 1)}) = {fmt(a.f(u), 4)} / φ′({fmt(u, 1)}) = {fmt(a.df(u), 4)}
                      </p>
                    </div>
                  ))}
                </div>
                <Hint>실선이 함수, 점선이 그 미분함수입니다. 두 곡선 모두 정의식으로 직접 계산했습니다.</Hint>
              </div>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.2.2 — 역전파되며 미분값이 계속 곱해진다",
            slides: "(2) 느린 학습 — 기울기 소멸 문제의 연쇄 곱",
          }}
        >
          <Card>
            <CardTitle>층을 지날 때마다 미분값이 곱해진다</CardTitle>
            <Formula note="강의록이 보여 주는 연쇄 — 층을 하나 더 지날 때마다 φ′이 한 번 더 곱해진다">
              ∂E/∂w₁ = (∂E/∂출력)·(∂출력/∂은닉2)·(∂은닉2/∂은닉1)·(∂은닉1/∂w₁) → φ′ₒ · φ′ₕ₂ · φ′ₕ₁ …
            </Formula>

            <Scroller>
              <table className="mt-3 w-full min-w-[520px] text-[11.5px]">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                    <th className="px-2 py-1.5 font-semibold">활성화 함수</th>
                    <th className="px-2 py-1.5 font-semibold">φ′({fmt(u, 1)})</th>
                    {DEPTHS.map((d) => (
                      <th key={d} className="px-2 py-1.5 font-semibold">
                        {d}층
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chain.map((c) => (
                    <tr key={c.act.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="px-2 py-1.5 font-semibold" style={{ color: c.act.color }}>
                        {c.act.name}
                      </td>
                      <td className="px-2 py-1.5 font-mono">{fmt(c.d, 4)}</td>
                      {c.products.map((p, i) => (
                        <td
                          key={DEPTHS[i]}
                          className={`px-2 py-1.5 font-mono ${
                            p < 1e-3 ? "text-rose-600" : p >= 0.5 ? "text-lime-700 dark:text-lime-400" : ""
                          }`}
                        >
                          {p === 0 ? "0" : p < 1e-4 ? p.toExponential(1) : fmt(p, 4)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Scroller>

            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              u = {fmt(u, 1)}일 때 시그모이드의 미분값은 {fmt(ACTS[0].df(u), 4)}입니다. 이 값이 12층을 거치며
              계속 곱해지면 {ACTS[0].df(u) ** 12 < 1e-4 ? (ACTS[0].df(u) ** 12).toExponential(1) : fmt(ACTS[0].df(u) ** 12, 6)}
              까지 줄어듭니다. 가중치 수정폭은 기울기의 크기에 비례하므로, 입력층 쪽 가중치는 사실상 고쳐지지
              않습니다. ReLU는 u {">"} 0인 한 미분값이 1이라 몇 층을 거쳐도 1에 머무릅니다 — 이것이 ReLU로 바꾸는
              이유입니다.
            </p>

            <ComputedNote>
              표는 모든 층의 가중합 u가 같고 연결 가중치가 1이라고 두어, <strong>활성화 함수의 미분값만</strong>{" "}
              층 수만큼 곱한 값입니다. 실제 신경망에서는 가중치도 함께 곱해집니다. 교재·강의록은 “1보다 작은
              미분값들이 계속해서 곱해져 점점 작아진다”고 설명하고 수치는 제시하지 않습니다.
            </ComputedNote>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
