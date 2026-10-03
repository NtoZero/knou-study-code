"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Formula, Hint, Scroller, Slider } from "./ui";
import { SIGMOID, forward, fmt, type Mlp } from "./mlpCore";

/** 식을 눈으로 따라가기 위한 고정 가중치 — 설명용 예시값 */
const NET: Mlp = {
  n: 2,
  m: 3,
  M: 2,
  hidden: SIGMOID,
  output: SIGMOID,
  W: [
    [0.1, -0.2, 0.3], // w₀ⱼ
    [0.5, 0.3, -0.6], // w₁ⱼ
    [-0.4, 0.8, 0.2], // w₂ⱼ
  ],
  V: [
    [0.2, -0.1], // v₀ₖ
    [0.6, -0.5],
    [0.7, 0.4],
    [-0.3, 0.9],
  ],
};

const NODE = { x: [60, 180, 300, 420], r: 15 };
const HY = [52, 104, 156];
const XY = [70, 140];
const OY = [78, 130];

export default function MlpRecap() {
  const [x1, setX1] = useState(1);
  const [x2, setX2] = useState(0.5);
  const [focus, setFocus] = useState<"hidden" | "output">("hidden");

  const x = useMemo(() => [x1, x2], [x1, x2]);
  const fw = useMemo(() => forward(NET, x), [x]);

  return (
    <section id="mlp-recap" className="scroll-mt-32">
      <SectionTitle
        title="다층 퍼셉트론의 수학적 표현과 학습"
        subtitle="학습 알고리즘으로 들어가기 전에, 입력에서 출력까지의 네 개의 식을 손으로 따라갑니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            slides: "다층 퍼셉트론의 수학적 표현",
            lecture: "입력에서 출력까지의 네 식을 먼저 확실히 해 두면 이후 학습 알고리즘은 이 식들로 풀어 나간다고 강조",
          }}
        >
          <Card>
            <CardTitle>입력층 → 은닉층 → 출력층의 네 식</CardTitle>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Formula note="j번째 은닉 뉴런으로의 가중합">
                uⱼʰ = Σ<sub>i=1</sub><sup>n</sup> wᵢⱼxᵢ + w₀ⱼ
              </Formula>
              <Formula note="j번째 은닉 뉴런의 출력값">zⱼ = φʰ(uⱼʰ)</Formula>
              <Formula note="k번째 출력 뉴런으로의 가중합">
                uₖᵒ = Σ<sub>j=1</sub><sup>m</sup> vⱼₖzⱼ + v₀ₖ
              </Formula>
              <Formula note="k번째 출력 뉴런의 출력값 = fₖ(x, θ)">yₖ = φᵒ(uₖᵒ)</Formula>
            </div>
            <Hint>
              wᵢⱼ는 i번째 입력과 j번째 은닉 노드를 잇는 가중치, vⱼₖ는 j번째 은닉 노드와 k번째 출력 노드를
              잇는 가중치입니다. 입력층은 n개, 은닉층은 m개, 출력층은 M개이고, 이 둘을 합쳐 파라미터 θ로
              씁니다. w₀ⱼ와 v₀ₖ는 바이어스로, 항상 1인 입력(x₀ = 1, z₀ = 1)에 붙은 가중치로 다룹니다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced refs={{ slides: "다층 퍼셉트론의 수학적 표현", textbook: "11.3.1 다층 퍼셉트론의 학습" }}>
          <Card>
            <CardTitle>전방향으로 한 번 계산해 보기</CardTitle>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <Scroller>
                <svg viewBox="0 0 480 200" className="h-auto w-full min-w-[420px]">
                  {/* 입력 → 은닉 연결 */}
                  {XY.map((iy, i) =>
                    HY.map((hy, j) => (
                      <line
                        key={`w${i}${j}`}
                        x1={NODE.x[0] + NODE.r}
                        y1={iy}
                        x2={NODE.x[1] - NODE.r}
                        y2={hy}
                        stroke={focus === "hidden" ? "#0284c7" : "#cbd5e1"}
                        strokeWidth={focus === "hidden" ? 1.3 : 0.8}
                        opacity={focus === "hidden" ? 0.75 : 0.45}
                      />
                    )),
                  )}
                  {/* 은닉 → 출력 연결 */}
                  {HY.map((hy, j) =>
                    OY.map((oy, k) => (
                      <line
                        key={`v${j}${k}`}
                        x1={NODE.x[2] + NODE.r}
                        y1={hy}
                        x2={NODE.x[3] - NODE.r}
                        y2={oy}
                        stroke={focus === "output" ? "#0284c7" : "#cbd5e1"}
                        strokeWidth={focus === "output" ? 1.3 : 0.8}
                        opacity={focus === "output" ? 0.75 : 0.45}
                      />
                    )),
                  )}
                  {/* 은닉 노드는 uⱼʰ와 zⱼ 두 칸으로 나눠 그린다 */}
                  {HY.map((hy, j) => (
                    <g key={`h${j}`}>
                      <line
                        x1={NODE.x[1] + NODE.r}
                        y1={hy}
                        x2={NODE.x[2] - NODE.r}
                        y2={hy}
                        stroke="#0284c7"
                        strokeWidth={1.2}
                      />
                      <circle cx={NODE.x[1]} cy={hy} r={NODE.r} fill="#e0f2fe" stroke="#0284c7" />
                      <text x={NODE.x[1]} y={hy + 3.5} fontSize="9" textAnchor="middle" fill="#075985">
                        {fmt(fw.uh[j], 2)}
                      </text>
                      <circle cx={NODE.x[2]} cy={hy} r={NODE.r} fill="#0284c7" />
                      <text x={NODE.x[2]} y={hy + 3.5} fontSize="9" textAnchor="middle" fill="#ffffff">
                        {fmt(fw.z[j], 2)}
                      </text>
                    </g>
                  ))}
                  {/* 입력 */}
                  {XY.map((iy, i) => (
                    <g key={`x${i}`}>
                      <circle cx={NODE.x[0]} cy={iy} r={NODE.r} fill="#f1f5f9" stroke="#64748b" />
                      <text x={NODE.x[0]} y={iy + 3.5} fontSize="9" textAnchor="middle" fill="#334155">
                        {fmt(x[i], 2)}
                      </text>
                      <text x={NODE.x[0] - 24} y={iy + 3.5} fontSize="10" textAnchor="middle" fill="#64748b">
                        x{i === 0 ? "₁" : "₂"}
                      </text>
                    </g>
                  ))}
                  {/* 출력 */}
                  {OY.map((oy, k) => (
                    <g key={`y${k}`}>
                      <circle cx={NODE.x[3]} cy={oy} r={NODE.r} fill="#bae6fd" stroke="#0369a1" />
                      <text x={NODE.x[3]} y={oy + 3.5} fontSize="9" textAnchor="middle" fill="#075985">
                        {fmt(fw.y[k], 2)}
                      </text>
                      <text x={NODE.x[3] + 26} y={oy + 3.5} fontSize="10" textAnchor="middle" fill="#64748b">
                        y{k === 0 ? "₁" : "₂"}
                      </text>
                    </g>
                  ))}
                  <text x={NODE.x[0]} y={178} fontSize="9" textAnchor="middle" fill="#94a3b8">
                    입력층 n = 2
                  </text>
                  <text x={(NODE.x[1] + NODE.x[2]) / 2} y={178} fontSize="9" textAnchor="middle" fill="#94a3b8">
                    은닉층 m = 3 (uⱼʰ → zⱼ)
                  </text>
                  <text x={NODE.x[3]} y={178} fontSize="9" textAnchor="middle" fill="#94a3b8">
                    출력층 M = 2
                  </text>
                </svg>
              </Scroller>

              <div className="space-y-3">
                <Slider label="x₁" value={x1} min={-2} max={2} step={0.1} onChange={setX1} display={fmt(x1, 1)} />
                <Slider label="x₂" value={x2} min={-2} max={2} step={0.1} onChange={setX2} display={fmt(x2, 1)} />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFocus("hidden")}
                    className={`flex-1 rounded-lg border px-2 py-1.5 text-[11px] font-semibold ${
                      focus === "hidden"
                        ? "border-sky-600 bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-200"
                        : "border-gray-200 text-gray-500 dark:border-gray-700"
                    }`}
                  >
                    wᵢⱼ 보기
                  </button>
                  <button
                    type="button"
                    onClick={() => setFocus("output")}
                    className={`flex-1 rounded-lg border px-2 py-1.5 text-[11px] font-semibold ${
                      focus === "output"
                        ? "border-sky-600 bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-200"
                        : "border-gray-200 text-gray-500 dark:border-gray-700"
                    }`}
                  >
                    vⱼₖ 보기
                  </button>
                </div>
                <div className="rounded-lg bg-gray-50 p-2.5 font-mono text-[10.5px] leading-5 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  {focus === "hidden" ? (
                    <>
                      <div>u₁ʰ = 0.5·{fmt(x1, 1)} + (−0.4)·{fmt(x2, 1)} + 0.1 = {fmt(fw.uh[0], 3)}</div>
                      <div>z₁ = φʰ(u₁ʰ) = {fmt(fw.z[0], 4)}</div>
                      <div className="mt-1 text-gray-400">u₂ʰ = {fmt(fw.uh[1], 3)} · z₂ = {fmt(fw.z[1], 4)}</div>
                      <div className="text-gray-400">u₃ʰ = {fmt(fw.uh[2], 3)} · z₃ = {fmt(fw.z[2], 4)}</div>
                    </>
                  ) : (
                    <>
                      <div>
                        u₁ᵒ = 0.6·{fmt(fw.z[0], 3)} + 0.7·{fmt(fw.z[1], 3)} + (−0.3)·{fmt(fw.z[2], 3)} + 0.2
                      </div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;= {fmt(fw.uo[0], 4)}</div>
                      <div>y₁ = φᵒ(u₁ᵒ) = {fmt(fw.y[0], 4)}</div>
                      <div className="mt-1 text-gray-400">u₂ᵒ = {fmt(fw.uo[1], 4)} · y₂ = {fmt(fw.y[1], 4)}</div>
                    </>
                  )}
                </div>
                <Hint>
                  은닉 노드와 출력 노드의 활성화 함수는 모두 시그모이드입니다. 가중치는 식을 따라가기 위해
                  고정해 둔 예시값입니다.
                </Hint>
              </div>
            </div>
          </Card>
        </Sourced>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Sourced
            refs={{
              textbook: "11.3.1 다층 퍼셉트론의 학습",
              slides: "MLP의 학습",
            }}
          >
            <Card className="h-full">
              <CardTitle>신경망에서 학습이란</CardTitle>
              <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
                원하는 함수 y = f(x, θ)를 나타내는 <strong>가중치 θ를 찾는 것</strong>입니다. 다층 퍼셉트론의
                학습은 퍼셉트론과 마찬가지로 <strong>지도학습</strong>을 수행하므로, 학습 데이터는 입출력의
                순서쌍 X = {"{"}(xᵢ, tᵢ){"}"} (i = 1, …, N)으로 주어집니다. 학습의 목적은 입력 xᵢ에 대한 신경망의
                출력 yᵢ와 목표 출력 tᵢ의 차이를 최소화하는 것입니다.
              </p>
              <Formula className="mt-3" note="평균 제곱 오차 (식 11-7). 앞의 1/2은 학습식 유도가 간단해지도록 추가한 값">
                E(X, θ) = (1/2N) Σ<sub>i=1</sub><sup>N</sup> ‖tᵢ − f(xᵢ, θ)‖²
              </Formula>
              <Hint>
                최적의 가중치 θ* → 오차함수 E(X, θ)를 최소화하는 θ. 데이터 집합 X는 외부에서 주어지는 값이고
                최적화 대상은 θ뿐이므로 보통 E(θ)로 줄여 씁니다.
              </Hint>
            </Card>
          </Sourced>

          <Sourced refs={{ textbook: "11.3.1 다층 퍼셉트론의 학습 — 오차함수의 형태", slides: "MLP의 학습 — 오차함수 E(θ)의 일반적 형태" }}>
            <Card className="h-full">
              <CardTitle>왜 선형회귀처럼 바로 풀 수 없는가</CardTitle>
              <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
                다층 퍼셉트론이 정의하는 함수 f(x, θ)가 복잡한 비선형함수이므로, 결과적으로 오차함수 E(θ)도
                <strong> 매우 복잡한 형태의 비선형함수</strong>가 됩니다. 따라서 선형회귀의 최소제곱법처럼
                간단한 수식 계산으로 바로 최적해를 찾는 것은 불가능합니다.
              </p>
              <svg viewBox="0 0 280 120" className="mt-3 h-auto w-full">
                <path
                  d="M12 24 C 40 92, 56 40, 78 70 C 98 100, 112 54, 140 88 C 156 86, 176 58, 198 74 C 218 90, 232 36, 268 18"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth={2}
                />
                <line x1={12} y1={108} x2={268} y2={108} stroke="#cbd5e1" />
                <line x1={12} y1={108} x2={12} y2={12} stroke="#cbd5e1" />
                <circle cx={140} cy={88} r={3.5} fill="#dc2626" />
                <text x={140} y={103} fontSize="9" textAnchor="middle" fill="#dc2626">
                  최적해 θ*
                </text>
                <text x={262} y={118} fontSize="9" textAnchor="end" fill="#94a3b8">
                  θ
                </text>
                <text x={18} y={20} fontSize="9" fill="#94a3b8">
                  E(θ)
                </text>
              </svg>
              <Hint>
                굴곡이 여럿인 이 그림이 다음 절의 출발점입니다. 한 번에 최적해를 얻을 수 없으므로,
                비선형함수의 최솟값을 찾아가는 반복적 알고리즘인 기울기 강하 학습법으로 접근합니다.
              </Hint>
            </Card>
          </Sourced>
        </div>
      </div>
    </section>
  );
}
