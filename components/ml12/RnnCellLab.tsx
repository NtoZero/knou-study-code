"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, CalcRow, ComputedNote, Formula, Hint, Scroller, Slider } from "./ui";
import { RNN_W, fmt, runRnn, type Vec } from "./rnnCore";

const SUB = "₀₁₂₃₄₅₆₇₈₉";
const sub = (n: number) => SUB[n] ?? String(n);

const vec = (v: Vec) => `[${fmt(v[0], 3)}, ${fmt(v[1], 3)}]`;

function CellDiagram() {
  return (
    <svg viewBox="0 0 300 180" className="h-auto w-full min-w-[260px]">
      <rect
        x={58}
        y={44}
        width={184}
        height={92}
        rx={10}
        className="fill-gray-50 stroke-gray-200 dark:fill-gray-800/50 dark:stroke-gray-700"
        strokeWidth={1.2}
      />
      {/* h_(t−1) 입력 */}
      <text x={6} y={96} className="fill-gray-600 text-[10px] font-bold dark:fill-gray-300">
        h_(t−1)
      </text>
      <line x1={46} y1={92} x2={112} y2={92} stroke="#ef4444" strokeWidth={2} markerEnd="url(#cell-a)" />
      <text x={62} y={85} className="fill-red-500 text-[9px] font-bold">
        W_hh
      </text>
      {/* x_t 입력 */}
      <text x={92} y={172} textAnchor="middle" className="fill-gray-600 text-[10px] font-bold dark:fill-gray-300">
        x_t
      </text>
      <line x1={92} y1={158} x2={92} y2={104} stroke="#6b7280" strokeWidth={1.8} markerEnd="url(#cell-g)" />
      <text x={96} y={132} className="fill-gray-500 text-[9px] font-bold">
        W_xh
      </text>
      {/* 덧셈 */}
      <circle cx={122} cy={92} r={11} className="fill-white stroke-gray-400 dark:fill-gray-900" strokeWidth={1.4} />
      <text x={122} y={96} textAnchor="middle" className="fill-gray-600 text-[11px] font-bold dark:fill-gray-300">
        +
      </text>
      {/* tanh */}
      <rect x={146} y={79} width={44} height={26} rx={6} fill="#fee2e2" stroke="#ef4444" strokeWidth={1.4} />
      <text x={168} y={96} textAnchor="middle" className="fill-red-700 text-[10px] font-bold">
        tanh
      </text>
      <line x1={133} y1={92} x2={144} y2={92} stroke="#6b7280" strokeWidth={1.6} />
      {/* h_t 출력 */}
      <line x1={190} y1={92} x2={262} y2={92} stroke="#ef4444" strokeWidth={2} markerEnd="url(#cell-a)" />
      <text x={266} y={96} className="fill-gray-600 text-[10px] font-bold dark:fill-gray-300">
        h_t
      </text>
      {/* y_t */}
      <line x1={222} y1={86} x2={222} y2={34} stroke="#6b7280" strokeWidth={1.8} markerEnd="url(#cell-g)" />
      <text x={226} y={60} className="fill-gray-500 text-[9px] font-bold">
        W_hy
      </text>
      <text x={222} y={24} textAnchor="middle" className="fill-gray-600 text-[10px] font-bold dark:fill-gray-300">
        y_t
      </text>
      <defs>
        <marker id="cell-a" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill="#ef4444" />
        </marker>
        <marker id="cell-g" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill="#6b7280" />
        </marker>
      </defs>
    </svg>
  );
}

export default function RnnCellLab() {
  const [x1a, setX1a] = useState(1);
  const [sel, setSel] = useState(2);

  const inputs = useMemo<Vec[]>(
    () => [
      [x1a, 0],
      [0, 1],
      [1, 1],
      [-1, 0],
    ],
    [x1a],
  );
  const steps = useMemo(() => runRnn(inputs), [inputs]);
  const cur = steps[sel];
  const prevH = sel === 0 ? [0, 0] : steps[sel - 1].h;

  return (
    <section id="rnn-cell" className="scroll-mt-32">
      <SectionTitle
        title="RNN 셀의 구조와 실제 계산"
        subtitle="가중치를 고정해 두고 시각 t를 따라가며 은닉 상태를 직접 계산합니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "12.4.1 — RNN의 구조(그림 12-22), 식 12-10 · 12-11",
            slides: "RNN 셀의 구조",
          }}
        >
          <Card>
            <CardTitle>셀 하나의 안쪽</CardTitle>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <Scroller>
                <CellDiagram />
              </Scroller>
              <div className="space-y-2">
                <Formula note="식 12-10 — b_h는 항상 1을 가지는 바이어스 노드와 연결된 가중치">
                  h_t = f_W(h_(t−1), x_t) = tanh( W_hh h_(t−1) + W_xh x_t + b_h )
                </Formula>
                <Formula note="식 12-11 — 출력층의 활성화 함수 φ로는 보통 소프트맥스 함수를 사용">
                  y_t = φ_softmax( W_hy h_t + b_o )
                </Formula>
                <Hint>
                  W_hh h_(t−1) 항은 은닉층이 저장한 이전 상태에 은닉 노드끼리의 가중치 W_hh를 곱해서
                  은닉층의 상태를 갱신하는 역할을 수행합니다.
                </Hint>
              </div>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.4.1 — 식 12-10 · 12-11의 계산",
            slides: "RNN의 계산 과정 · RNN 셀의 구조",
          }}
        >
          <Card>
            <CardTitle>시각을 따라가며 직접 계산</CardTitle>
            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Slider
                label="시각 1의 첫 번째 입력값 x₁⁽¹⁾"
                value={x1a}
                min={-1}
                max={1}
                step={0.1}
                onChange={setX1a}
                display={fmt(x1a, 1)}
              />
              <Slider
                label="자세히 볼 시각"
                value={sel}
                min={0}
                max={3}
                step={1}
                onChange={setSel}
                display={`t = ${sel + 1}`}
              />
            </div>

            <Scroller>
              <table className="w-full min-w-[460px] border-collapse text-[11.5px]">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700">
                    <th className="px-2 py-1.5 text-left font-semibold">시각</th>
                    <th className="px-2 py-1.5 text-left font-semibold">입력 x_t</th>
                    <th className="px-2 py-1.5 text-left font-semibold">W_hh h_(t−1)</th>
                    <th className="px-2 py-1.5 text-left font-semibold">W_xh x_t</th>
                    <th className="px-2 py-1.5 text-left font-semibold">h_t = tanh(합)</th>
                    <th className="px-2 py-1.5 text-left font-semibold">y_t</th>
                  </tr>
                </thead>
                <tbody>
                  {steps.map((s, i) => (
                    <tr
                      key={s.t}
                      onClick={() => setSel(i)}
                      className={`cursor-pointer border-b border-gray-100 transition-colors dark:border-gray-800 ${
                        i === sel ? "bg-red-50 dark:bg-red-950/30" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <td className="px-2 py-1.5 font-bold text-gray-700 dark:text-gray-200">t = {s.t}</td>
                      <td className="px-2 py-1.5 font-mono text-gray-500">{vec(s.x)}</td>
                      <td className="px-2 py-1.5 font-mono text-gray-500">{vec(s.recur)}</td>
                      <td className="px-2 py-1.5 font-mono text-gray-500">{vec(s.input)}</td>
                      <td className="px-2 py-1.5 font-mono font-bold text-red-500">{vec(s.h)}</td>
                      <td className="px-2 py-1.5 font-mono text-gray-500">{vec(s.y)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Scroller>

            {/* 은닉 상태의 변화 */}
            <div className="mt-4">
              <p className="mb-1 text-[11px] font-semibold text-gray-500">
                은닉 상태 h_t의 두 성분 — 시각이 지나며 어떻게 움직이는가
              </p>
              <Scroller>
                <svg viewBox="0 0 420 110" className="h-auto w-full min-w-[380px]">
                  <line x1={40} y1={55} x2={408} y2={55} stroke="#d1d5db" strokeWidth={1} />
                  <text x={6} y={59} className="fill-gray-400 text-[9px]">
                    0
                  </text>
                  <text x={6} y={22} className="fill-gray-400 text-[9px]">
                    +1
                  </text>
                  <text x={6} y={100} className="fill-gray-400 text-[9px]">
                    −1
                  </text>
                  {steps.map((s, i) => {
                    const bx = 70 + i * 88;
                    return (
                      <g key={s.t}>
                        {s.h.map((v, k) => {
                          const h = Math.abs(v) * 40;
                          const bw = 20;
                          const x = bx + (k === 0 ? -24 : 2);
                          return (
                            <motion.rect
                              key={k}
                              initial={false}
                              animate={{ y: v >= 0 ? 55 - h : 55, height: h }}
                              x={x}
                              width={bw}
                              rx={3}
                              fill={k === 0 ? "#ef4444" : "#fca5a5"}
                              opacity={i === sel ? 1 : 0.55}
                            />
                          );
                        })}
                        <text x={bx - 1} y={104} textAnchor="middle" className="fill-gray-500 text-[9px] font-semibold">
                          t = {s.t}
                        </text>
                      </g>
                    );
                  })}
                  <rect x={300} y={6} width={9} height={9} rx={2} fill="#ef4444" />
                  <text x={313} y={14} className="fill-gray-500 text-[9px]">
                    h_t 1성분
                  </text>
                  <rect x={360} y={6} width={9} height={9} rx={2} fill="#fca5a5" />
                  <text x={373} y={14} className="fill-gray-500 text-[9px]">
                    2성분
                  </text>
                </svg>
              </Scroller>
            </div>

            {/* 선택한 시각의 계산 과정 */}
            <div className="mt-4 space-y-1.5">
              <p className="text-[11px] font-semibold text-gray-500">
                t = {cur.t}의 계산 — 같은 W를 그대로 다시 쓴다
              </p>
              <CalcRow
                label={`h${sub(cur.t - 1)}`}
                expr={sel === 0 ? "초기 상태 h₀" : "직전 시각의 은닉 상태"}
                value={vec(prevH)}
              />
              <CalcRow
                label="W_hh h"
                expr={`[${fmt(RNN_W.hh[0][0], 1)}·${fmt(prevH[0], 3)} + (${fmt(RNN_W.hh[0][1], 1)})·${fmt(prevH[1], 3)}, …]`}
                value={vec(cur.recur)}
              />
              <CalcRow
                label="W_xh x"
                expr={`[${fmt(RNN_W.xh[0][0], 1)}·${fmt(cur.x[0], 2)} + (${fmt(RNN_W.xh[0][1], 1)})·${fmt(cur.x[1], 2)}, …]`}
                value={vec(cur.input)}
              />
              <CalcRow label="합" expr="W_hh h_(t−1) + W_xh x_t + b_h" value={vec(cur.pre)} />
              <CalcRow label="h_t" expr="tanh(합) — 성분마다 따로" value={vec(cur.h)} tone="accent" />
              <CalcRow label="W_hy h_t" expr="출력층으로 가는 가중합 + b_o" value={vec(cur.outPre)} />
              <CalcRow label="y_t" expr="φ_softmax(가중합) — 두 성분의 합은 1" value={vec(cur.y)} tone="accent" />
            </div>

            <div className="mt-3 space-y-2">
              <ComputedNote>
                가중치 W_xh = [[0.5, −0.3], [0.8, 0.2]], W_hh = [[0.6, −0.4], [0.1, 0.7]], W_hy =
                [[1.2, −0.9], [−0.7, 1.1]], 바이어스 0, h₀ = [0, 0], 입력 네 개는 계산을 눈으로
                따라가려고 이 페이지에서 정한 값입니다. 교재와 강의록에는 수식만 있고 구체적인
                수치는 제시되어 있지 않습니다. 표의 값은 모두 식 12-10과 12-11로 그때그때
                계산합니다.
              </ComputedNote>
              <Hint>
                슬라이더로 시각 1의 입력만 바꿔 보세요. t = 2, 3, 4의 은닉 상태까지 전부
                달라집니다. 순환 에지를 타고 과거의 입력이 계속 전달되고 있다는 뜻입니다.
              </Hint>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.4.1 — RNN의 활성화 함수로 tanh를 사용하는 이유",
          }}
        >
          <Card>
            <CardTitle>왜 tanh인가</CardTitle>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-gray-800/60">
                <p className="text-[12px] font-bold text-gray-700 dark:text-gray-200">ReLU 대신</p>
                <p className="mt-1 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  ReLU 함수를 사용하면 순환적인 구조로 인해 h값이 지나치게 커질 수 있습니다. tanh는
                  출력이 −1에서 1 사이로 묶입니다.
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-gray-800/60">
                <p className="text-[12px] font-bold text-gray-700 dark:text-gray-200">
                  시그모이드 대신
                </p>
                <p className="mt-1 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  tanh가 시그모이드 함수보다 기울기 소멸 문제에 좀 더 효과적이라는 것이 알려져
                  있습니다.
                </p>
              </div>
            </div>
            <div className="mt-2">
              <Hint>
                미분값의 최대치를 비교하면 차이가 분명합니다. tanh′(0) = 1이지만 시그모이드는 σ′(0)
                = 0.25입니다. 기울기가 시각마다 곱해지는 구조에서는 이 차이가 거듭제곱으로
                벌어집니다 — 바로 아래 ‘기울기 소멸·폭발’에서 직접 확인합니다.
              </Hint>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
