"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { ACTIVATIONS, fmt, signed, type ActId } from "./nn";

/* 설명을 위해 정한 작은 다층 퍼셉트론 — n = 3, m = 2, M = 2 */
const N = 3;
const M_HID = 2;
const M_OUT = 2;

/** W[i][j] — 입력 노드 xᵢ 에서 은닉 노드 zⱼ 로의 연결 가중치 wᵢⱼ */
const W: number[][] = [
  [0.8, -0.5],
  [-0.6, 0.9],
  [0.4, 0.7],
];
/** 은닉 노드로의 바이어스 w₀ⱼ */
const W0: number[] = [-0.3, 0.2];
/** V[j][k] — 은닉 노드 zⱼ 에서 출력 노드 y_k 로의 연결 가중치 vⱼₖ */
const V: number[][] = [
  [1.2, -0.9],
  [-0.7, 1.1],
];
/** 출력 노드로의 바이어스 v₀ₖ */
const V0: number[] = [0.1, -0.2];

type Pick = { layer: "hidden" | "output"; index: number } | null;

const SUB = ["₁", "₂", "₃"];

export default function MlpStructure() {
  const [x, setX] = useState<number[]>([1, 0.5, -0.8]);
  const [hidAct, setHidAct] = useState<ActId>("tanh");
  const [outAct, setOutAct] = useState<ActId>("linear");
  const [pick, setPick] = useState<Pick>({ layer: "hidden", index: 0 });

  const phiH = ACTIVATIONS.find((a) => a.id === hidAct)!;
  const phiO = ACTIVATIONS.find((a) => a.id === outAct)!;

  const uH = Array.from({ length: M_HID }, (_, j) =>
    x.reduce((acc, xi, i) => acc + W[i][j] * xi, 0) + W0[j],
  );
  const z = uH.map((u) => phiH.f(u));
  const uO = Array.from({ length: M_OUT }, (_, k) =>
    z.reduce((acc, zj, j) => acc + V[j][k] * zj, 0) + V0[k],
  );
  const y = uO.map((u) => phiO.f(u));

  const Wsvg = 360;
  const Hsvg = 240;
  const xPos = [55, 180, 305];
  const inY = Array.from({ length: N }, (_, i) => 60 + i * 60);
  const hidY = Array.from({ length: M_HID }, (_, j) => 90 + j * 60);
  const outY = Array.from({ length: M_OUT }, (_, k) => 90 + k * 60);

  const isHidPicked = (j: number) => pick?.layer === "hidden" && pick.index === j;
  const isOutPicked = (k: number) => pick?.layer === "output" && pick.index === k;

  return (
    <section id="mlp" className="scroll-mt-32">
      <SectionTitle
        title="11.2.2 다층 퍼셉트론의 구조와 함수식"
        subtitle="노드를 누르면 그 노드의 수식과 실제 계산이 함께 보임"
      />

      {/* ── 다층 퍼셉트론의 세 가지 구성 요소 ── */}
      <Sourced
        refs={{
          textbook: "11.2.2 다층 퍼셉트론",
          slides: "다층 퍼셉트론",
        }}
        className="mb-4"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">
            다층 퍼셉트론 (MLP, Multi-Layer Perceptron) — 세 가지 구성 요소로 정리
          </h3>
          <p className="mt-1 text-xs text-gray-500">“다층” → 1개 이상의 은닉층을 가짐.</p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {[
              {
                n: "① 뉴런",
                d: "비선형 매핑을 위한 활성화 함수 사용 — 시그모이드 함수 1/(1 + e⁻ᵘ), 하이퍼탄젠트 함수 (1 − e⁻²ᵘ)/(1 + e⁻²ᵘ)",
              },
              { n: "② 연결 구조", d: "다층, 전방향, 완전연결" },
              { n: "③ 학습 알고리즘", d: "지도학습 → 오류 역전파 알고리즘 (10강)" },
            ].map((c) => (
              <div key={c.n} className="rounded-lg bg-fuchsia-50 p-3 dark:bg-fuchsia-950/30">
                <p className="text-xs font-bold text-fuchsia-700 dark:text-fuchsia-300">{c.n}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">{c.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <p className="text-xs font-bold">퍼셉트론과 달라지는 점</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                퍼셉트론은 은닉층이 없고 계단함수를 써서 직선 하나만 만든다. 다층 퍼셉트론은 은닉층을
                두고 은닉 뉴런에 비선형 활성화 함수를 써서 복잡한 비선형 결정경계를 만든다.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <p className="text-xs font-bold">그대로인 점</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                둘 다 전방향·완전연결 구조이고, 목표 출력값을 사용하는 지도학습을 한다.
              </p>
            </div>
          </div>
        </div>
      </Sourced>

      {/* ── 기호 정의 ── */}
      <Sourced
        refs={{
          textbook: "11.2.2 다층 퍼셉트론 (그림 11-10)",
          slides: "다층 퍼셉트론의 구조와 함수식",
        }}
        className="mb-4"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">기호의 정의</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            다층 퍼셉트론은 1개 또는 그 이상의 은닉층을 가지는 다층 전방향 신경망 구조. n개의 입력 뉴런을
            가지는 입력층, m개의 은닉 뉴런을 가지는 은닉층, M개의 출력 뉴런을 가지는 출력층으로 구성됨.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[420px] text-xs">
              <tbody>
                {[
                  ["xᵢ", "입력 노드의 값 (i = 1, …, n)"],
                  ["zⱼ", "은닉 노드의 출력값 (j = 1, …, m)"],
                  ["y_k", "출력 노드의 출력값 (k = 1, …, M)"],
                  ["wᵢⱼ", "입력 노드 xᵢ 에서 은닉 노드 zⱼ 로의 연결 가중치"],
                  ["vⱼₖ", "은닉 노드 zⱼ 에서 출력 노드 y_k 로의 연결 가중치"],
                  ["w₀ⱼ, v₀ₖ", "각각 은닉 노드와 출력 노드로의 바이어스 입력 가중치"],
                  ["φ_h, φ_o", "각각 은닉 뉴런과 출력 뉴런의 활성화 함수"],
                  ["θ", "모든 가중치를 묶어서 나타낸 하나의 파라미터 (θ = W ∪ V)"],
                ].map(([sym, desc]) => (
                  <tr key={sym} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="w-24 py-1.5 pr-3 font-mono font-bold text-fuchsia-700 dark:text-fuchsia-300">
                      {sym}
                    </td>
                    <td className="py-1.5 text-gray-700 dark:text-gray-300">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            입력값은 n차원 벡터 x = [x₁, x₂, …, xₙ], 출력값은 M차원 벡터 y = [y₁, y₂, …, y_M]로 나타내고,
            모든 가중치를 묶어 하나의 파라미터 θ로 나타내면 입력 x가 주어졌을 때 k번째 출력 노드의 출력
            y_k는 함수 f_k(x, θ)로 나타낼 수 있음.
          </p>
        </div>
      </Sourced>

      {/* ── 네 가지 수식 ── */}
      <Sourced
        refs={{
          textbook: "11.2.2 다층 퍼셉트론 (식 11-4, 식 11-5)",
          slides: "다층 퍼셉트론의 구조와 함수식",
          lecture: "이 네 가지 수식과 θ가 W와 V를 합친 학습 대상이라는 표기는 반드시 기억해 두라고, 다음 시간 학습 알고리즘에서 그대로 쓴다고 못 박음",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-fuchsia-200 bg-fuchsia-50 p-5 dark:border-fuchsia-900 dark:bg-fuchsia-950/30">
          <h3 className="text-base font-bold text-fuchsia-800 dark:text-fuchsia-200">
            외워 두어야 하는 네 개의 식
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              { t: "j번째 은닉 노드의 가중합", e: "uⱼʰ = Σᵢ₌₁ⁿ wᵢⱼxᵢ + w₀ⱼ", pickTo: "hidden" },
              { t: "j번째 은닉 노드의 출력", e: "zⱼ = φ_h(uⱼʰ)", pickTo: "hidden" },
              { t: "k번째 출력 노드의 가중합", e: "u_kᵒ = Σⱼ₌₁ᵐ vⱼₖzⱼ + v₀ₖ", pickTo: "output" },
              { t: "k번째 출력 노드의 출력", e: "y_k = φ_o(u_kᵒ)", pickTo: "output" },
            ].map((f) => (
              <div
                key={f.e}
                className={`rounded-lg border bg-white p-3 transition-colors dark:bg-gray-900 ${
                  pick?.layer === f.pickTo
                    ? "border-fuchsia-400 shadow-sm dark:border-fuchsia-600"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <p className="text-[11px] text-gray-500">{f.t}</p>
                <p className="mt-0.5 overflow-x-auto font-mono text-sm">{f.e}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 overflow-x-auto rounded-lg bg-white p-3 dark:bg-gray-900">
            <p className="min-w-[380px] font-mono text-sm leading-7">
              y_k = f_k(x, θ) = φ_o( Σⱼ₌₁ᵐ vⱼₖ φ_h( Σᵢ₌₁ⁿ wᵢⱼxᵢ + w₀ⱼ ) + v₀ₖ )
              <span className="ml-2 text-xs text-gray-500">(식 11-4)</span>
            </p>
            <p className="mt-2 min-w-[380px] text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              θ = W ∪ V — 학습해야 할 대상은 입력층↔은닉층의 가중치 W와 은닉층↔출력층의 가중치 V를 모두
              합친 것.
            </p>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            다층 퍼셉트론의 경우는 퍼셉트론과 달리 연속한 실수값을 다룰 수 있는 형태로 정의되었기 때문에
            활성화 함수도 계단함수와 같은 불연속 함수가 아닌 실수값을 가지는 연속 함수로 정의됨.{" "}
            <strong>은닉 뉴런에는 반드시 시그모이드나 하이퍼탄젠트와 같은 비선형 함수를 사용</strong>하는
            반면, 출력 뉴런의 경우에는 선형 가중합을 그대로 출력값으로 주는 선형함수를 사용하기도 함.
          </p>
        </div>
      </Sourced>

      {/* ── 구조도 + 순전파 계산 ── */}
      <Sourced
        refs={{
          textbook: "11.2.2 다층 퍼셉트론 (그림 11-10, 식 11-5)",
          slides: "다층 퍼셉트론의 구조와 함수식",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">입력에서 출력까지 실제로 계산해 보기 (n = 3, m = 2, M = 2)</h3>
          <p className="mt-1 text-xs text-gray-500">
            노드를 눌러 그 노드의 계산을 펼쳐 봄. 가중치는 설명을 위해 정한 값이며, 실제로는 학습으로 정해짐.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
            <div className="overflow-x-auto">
              <svg viewBox={`0 0 ${Wsvg} ${Hsvg}`} className="w-full min-w-[340px] rounded-lg border border-gray-100 dark:border-gray-800">
                <rect x={0} y={0} width={Wsvg} height={Hsvg} fill="#ffffff" />
                {/* 간선 */}
                {inY.map((iy, i) =>
                  hidY.map((hy, j) => (
                    <line
                      key={`w${i}${j}`}
                      x1={xPos[0] + 14}
                      y1={iy}
                      x2={xPos[1] - 14}
                      y2={hy}
                      stroke={isHidPicked(j) ? "#a21caf" : "#e9d5ff"}
                      strokeWidth={isHidPicked(j) ? 1.8 : 1}
                    />
                  )),
                )}
                {hidY.map((hy, j) =>
                  outY.map((oy, k) => (
                    <line
                      key={`v${j}${k}`}
                      x1={xPos[1] + 14}
                      y1={hy}
                      x2={xPos[2] - 14}
                      y2={oy}
                      stroke={isOutPicked(k) ? "#ea580c" : "#fed7aa"}
                      strokeWidth={isOutPicked(k) ? 1.8 : 1}
                    />
                  )),
                )}

                {/* 입력층 */}
                {inY.map((iy, i) => (
                  <g key={`in${i}`}>
                    <circle cx={xPos[0]} cy={iy} r={14} fill="#dbeafe" stroke="#2563eb" strokeWidth={1.4} />
                    <text x={xPos[0]} y={iy - 1} fontSize="9" textAnchor="middle" fill="#1e3a8a">
                      x{SUB[i]}
                    </text>
                    <text x={xPos[0]} y={iy + 9} fontSize="8" textAnchor="middle" fill="#1e3a8a">
                      {fmt(x[i], 1)}
                    </text>
                  </g>
                ))}
                {/* 은닉층 */}
                {hidY.map((hy, j) => (
                  <g key={`h${j}`} onClick={() => setPick({ layer: "hidden", index: j })} className="cursor-pointer">
                    <circle
                      cx={xPos[1]}
                      cy={hy}
                      r={16}
                      fill="#fae8ff"
                      stroke="#a21caf"
                      strokeWidth={isHidPicked(j) ? 3 : 1.4}
                    />
                    <text x={xPos[1]} y={hy - 2} fontSize="9" textAnchor="middle" fill="#86198f">
                      z{SUB[j]}
                    </text>
                    <text x={xPos[1]} y={hy + 8} fontSize="8" textAnchor="middle" fill="#86198f">
                      {fmt(z[j], 2)}
                    </text>
                  </g>
                ))}
                {/* 출력층 */}
                {outY.map((oy, k) => (
                  <g key={`o${k}`} onClick={() => setPick({ layer: "output", index: k })} className="cursor-pointer">
                    <circle
                      cx={xPos[2]}
                      cy={oy}
                      r={16}
                      fill="#fed7aa"
                      stroke="#ea580c"
                      strokeWidth={isOutPicked(k) ? 3 : 1.4}
                    />
                    <text x={xPos[2]} y={oy - 2} fontSize="9" textAnchor="middle" fill="#9a3412">
                      y{SUB[k]}
                    </text>
                    <text x={xPos[2]} y={oy + 8} fontSize="8" textAnchor="middle" fill="#9a3412">
                      {fmt(y[k], 2)}
                    </text>
                  </g>
                ))}

                <text x={xPos[0]} y={Hsvg - 12} fontSize="9" textAnchor="middle" fill="#64748b">
                  입력층 (n = 3)
                </text>
                <text x={xPos[1]} y={Hsvg - 12} fontSize="9" textAnchor="middle" fill="#64748b">
                  은닉층 (m = 2)
                </text>
                <text x={xPos[2]} y={Hsvg - 12} fontSize="9" textAnchor="middle" fill="#64748b">
                  출력층 (M = 2)
                </text>
                <text x={xPos[0]} y={22} fontSize="8" textAnchor="middle" fill="#94a3b8">
                  wᵢⱼ
                </text>
                <text x={(xPos[1] + xPos[2]) / 2} y={22} fontSize="8" textAnchor="middle" fill="#94a3b8">
                  vⱼₖ
                </text>
              </svg>
            </div>

            <div>
              <div className="space-y-1.5">
                {x.map((xi, i) => (
                  <label key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-8 shrink-0 font-mono font-bold">x{SUB[i]}</span>
                    <input
                      type="range"
                      min={-1}
                      max={1}
                      step={0.1}
                      value={xi}
                      onChange={(e) =>
                        setX((p) => p.map((v, j) => (j === i ? Number(e.target.value) : v)))
                      }
                      className="min-w-0 flex-1 accent-blue-600"
                    />
                    <span className="w-9 shrink-0 text-right font-mono">{fmt(xi, 1)}</span>
                  </label>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <label className="text-xs">
                  <span className="font-semibold">은닉 뉴런 φ_h</span>
                  <select
                    value={hidAct}
                    onChange={(e) => setHidAct(e.target.value as ActId)}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-gray-900"
                  >
                    {ACTIVATIONS.filter((a) => a.id === "sigmoid" || a.id === "tanh").map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs">
                  <span className="font-semibold">출력 뉴런 φ_o</span>
                  <select
                    value={outAct}
                    onChange={(e) => setOutAct(e.target.value as ActId)}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-gray-900"
                  >
                    {ACTIVATIONS.filter(
                      (a) => a.id === "sigmoid" || a.id === "tanh" || a.id === "linear",
                    ).map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* 선택한 노드의 계산 */}
              <div className="mt-3 overflow-x-auto rounded-lg bg-gray-50 p-3 font-mono text-[11px] leading-6 dark:bg-gray-800/60">
                {pick?.layer === "hidden" ? (
                  <>
                    <p className="min-w-[320px] font-bold text-fuchsia-700 dark:text-fuchsia-300">
                      은닉 노드 z{SUB[pick.index]}
                    </p>
                    <p className="min-w-[320px]">
                      u{SUB[pick.index]}ʰ ={" "}
                      {x
                        .map((xi, i) => `${fmt(W[i][pick.index], 1)}×${fmt(xi, 1)}`)
                        .join(" + ")
                        .replace(/\+ -/g, "− ")}{" "}
                      {signed(W0[pick.index], 1)}
                    </p>
                    <p className="min-w-[320px]">
                      {"      "}= {fmt(uH[pick.index], 3)}
                    </p>
                    <p className="min-w-[320px]">
                      z{SUB[pick.index]} = φ_h({fmt(uH[pick.index], 3)}) ={" "}
                      <strong>{fmt(z[pick.index], 4)}</strong>{" "}
                      <span className="text-gray-500">({phiH.name})</span>
                    </p>
                  </>
                ) : pick?.layer === "output" ? (
                  <>
                    <p className="min-w-[320px] font-bold text-orange-700 dark:text-orange-300">
                      출력 노드 y{SUB[pick.index]}
                    </p>
                    <p className="min-w-[320px]">
                      u{SUB[pick.index]}ᵒ ={" "}
                      {z
                        .map((zj, j) => `${fmt(V[j][pick.index], 1)}×${fmt(zj, 3)}`)
                        .join(" + ")
                        .replace(/\+ -/g, "− ")}{" "}
                      {signed(V0[pick.index], 1)}
                    </p>
                    <p className="min-w-[320px]">
                      {"      "}= {fmt(uO[pick.index], 3)}
                    </p>
                    <p className="min-w-[320px]">
                      y{SUB[pick.index]} = φ_o({fmt(uO[pick.index], 3)}) ={" "}
                      <strong>{fmt(y[pick.index], 4)}</strong>{" "}
                      <span className="text-gray-500">({phiO.name})</span>
                    </p>
                  </>
                ) : (
                  <p className="min-w-[320px] text-gray-500">노드를 눌러 보세요.</p>
                )}
              </div>

              {/* 전체 가중치 */}
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[320px] text-[11px]">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                      <th className="py-1 pr-2">W (wᵢⱼ)</th>
                      <th className="py-1 pr-2">z₁로</th>
                      <th className="py-1 pr-2">z₂로</th>
                      <th className="py-1 pr-2">V (vⱼₖ)</th>
                      <th className="py-1 pr-2">y₁로</th>
                      <th className="py-1">y₂로</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {[0, 1, 2].map((i) => (
                      <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 pr-2 text-gray-500">x{SUB[i]}</td>
                        <td className="py-1 pr-2">{fmt(W[i][0], 1)}</td>
                        <td className="py-1 pr-2">{fmt(W[i][1], 1)}</td>
                        <td className="py-1 pr-2 text-gray-500">{i < 2 ? `z${SUB[i]}` : "바이어스"}</td>
                        <td className="py-1 pr-2">{i < 2 ? fmt(V[i][0], 1) : fmt(V0[0], 1)}</td>
                        <td className="py-1">{i < 2 ? fmt(V[i][1], 1) : fmt(V0[1], 1)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="py-1 pr-2 text-gray-500">바이어스</td>
                      <td className="py-1 pr-2">{fmt(W0[0], 1)}</td>
                      <td className="py-1 pr-2">{fmt(W0[1], 1)}</td>
                      <td className="py-1 pr-2" colSpan={3} />
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-[11px] text-gray-500">
                학습 대상 θ = W ∪ V — 지금 구조에서는 {N * M_HID + M_HID} + {M_HID * M_OUT + M_OUT} ={" "}
                {N * M_HID + M_HID + M_HID * M_OUT + M_OUT}개의 값.
              </p>
            </div>
          </div>
        </div>
      </Sourced>
    </section>
  );
}
