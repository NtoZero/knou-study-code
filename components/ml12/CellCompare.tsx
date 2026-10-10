"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ComputedNote, Hint, Scroller, Slider } from "./ui";
import { blockParams, cellParams } from "./rnnCore";

const ROWS = [
  {
    label: "순환의 대상",
    rnn: "h_t 하나",
    lstm: "h_t와 셀 상태 c_t",
    gru: "h_t 하나 (셀 상태가 출력에 통합)",
  },
  {
    label: "입력",
    rnn: "h_(t−1), x_t",
    lstm: "h_(t−1), c_(t−1), x_t",
    gru: "h_(t−1), x_t",
  },
  {
    label: "출력",
    rnn: "h_t, y_t",
    lstm: "h_t, c_t, y_t",
    gru: "h_t",
  },
  {
    label: "게이트",
    rnn: "없음",
    lstm: "3개 — 망각 · 입력 · 출력",
    gru: "2개 — 리셋 · 갱신",
  },
  {
    label: "셀 안의 가중치 묶음",
    rnn: "1묶음 — W_hh와 W_xh가 한 벌",
    lstm: "4묶음 — W_f, W_i, W_c, W_o",
    gru: "3묶음 — W_r, W_z, W_h",
  },
  {
    label: "학습 방법",
    rnn: "BPTT",
    lstm: "BPTT",
    gru: "BPTT",
  },
];

const COLORS = { rnn: "#9ca3af", lstm: "#ef4444", gru: "#f59e0b" };

export default function CellCompare() {
  const [n, setN] = useState(128);
  const [d, setD] = useState(100);

  const block = blockParams(n, d);
  const p = cellParams(n, d);
  const max = p.lstm;

  const bars: { key: keyof typeof p; name: string; mult: number }[] = [
    { key: "rnn", name: "기본 RNN 셀", mult: 1 },
    { key: "gru", name: "GRU 셀", mult: 3 },
    { key: "lstm", name: "LSTM 셀", mult: 4 },
  ];

  return (
    <section id="lstm-gru-compare" className="scroll-mt-32">
      <SectionTitle
        title="기본 RNN · LSTM · GRU 비교"
        subtitle="구조의 차이가 파라미터 수에서 어떻게 드러나는지 계산합니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "12.4.3 — LSTM과 GRU의 구성",
            slides: "정리하기 — LSTM과 GRU",
          }}
        >
          <Card>
            <CardTitle>세 셀을 나란히</CardTitle>
            <Scroller>
              <table className="w-full min-w-[520px] border-collapse text-[11.5px]">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700">
                    <th className="px-2 py-2 text-left font-semibold"> </th>
                    <th className="px-2 py-2 text-left font-semibold">기본 RNN 셀</th>
                    <th className="px-2 py-2 text-left font-semibold text-red-500">LSTM 셀</th>
                    <th className="px-2 py-2 text-left font-semibold text-amber-500">GRU 셀</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.label} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="px-2 py-2 font-bold text-gray-700 dark:text-gray-200">
                        {r.label}
                      </td>
                      <td className="px-2 py-2 text-gray-600 dark:text-gray-300">{r.rnn}</td>
                      <td className="px-2 py-2 text-gray-600 dark:text-gray-300">{r.lstm}</td>
                      <td className="px-2 py-2 text-gray-600 dark:text-gray-300">{r.gru}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Scroller>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.4.3 (2) — LSTM의 많은 파라미터와 GRU의 단순화",
            slides: "GRU — LSTM 셀 구조를 단순하게 개선한 것",
          }}
        >
          <Card>
            <CardTitle>파라미터 수를 직접 세어 보기</CardTitle>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Slider
                label="은닉 노드 수 n"
                value={n}
                min={8}
                max={256}
                step={8}
                onChange={setN}
                display={`${n}`}
              />
              <Slider
                label="입력 차원 d"
                value={d}
                min={10}
                max={300}
                step={10}
                onChange={setD}
                display={`${d}`}
              />
            </div>

            <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-gray-800/60">
              <p className="text-[11.5px] leading-6 text-gray-600 dark:text-gray-300">
                가중치 묶음 하나의 크기 = U(n×n) + V(n×d) + b(n) = n(n + d + 1) ={" "}
                <span className="font-mono font-bold text-red-500">
                  {n}×({n} + {d} + 1) = {block.toLocaleString()}개
                </span>
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {bars.map((b) => (
                <div key={b.key}>
                  <div className="mb-1 flex items-baseline justify-between text-[11.5px]">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      {b.name}{" "}
                      <span className="font-normal text-gray-400">
                        — 묶음 {b.mult}개
                      </span>
                    </span>
                    <span className="font-mono font-bold" style={{ color: COLORS[b.key] }}>
                      {p[b.key].toLocaleString()}개
                    </span>
                  </div>
                  <div className="h-5 w-full overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
                    <motion.div
                      initial={false}
                      animate={{ width: `${(p[b.key] / max) * 100}%` }}
                      className="h-5 rounded"
                      style={{ backgroundColor: COLORS[b.key] }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-lg bg-red-50/70 px-3 py-2 dark:bg-red-950/30">
                <p className="text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  LSTM ÷ 기본 RNN ={" "}
                  <span className="font-mono font-bold text-red-500">
                    {(p.lstm / p.rnn).toFixed(0)}배
                  </span>{" "}
                  — 같은 입출력 차원과 은닉 노드 수여도 파라미터 수가 같지 않습니다.
                </p>
              </div>
              <div className="rounded-lg bg-amber-50/70 px-3 py-2 dark:bg-amber-950/30">
                <p className="text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  GRU ÷ LSTM ={" "}
                  <span className="font-mono font-bold text-amber-500">
                    {((p.gru / p.lstm) * 100).toFixed(0)}%
                  </span>{" "}
                  — 게이트가 하나 줄어든 만큼 가중치 묶음도 하나 줄어듭니다.
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <ComputedNote>
                파라미터 수를 세는 식 n(n + d + 1)과 n, d의 값은 교재·강의록에 제시되어 있지
                않습니다. 교재는 “LSTM이 복잡한 연결 구조를 갖고 이로 인해 많은 파라미터를
                가진다”고만 서술하므로, 그 ‘많다’가 몇 배인지 보이려고 이 페이지에서 셀의 구조를
                그대로 세어 계산한 값입니다. 게이트마다 h_(t−1)에 곱하는 U, x_t에 곱하는 V, 그리고
                바이어스 b가 한 벌씩 필요하다는 점만 쓰면 바로 나옵니다.
              </ComputedNote>
              <Hint>
                LSTM과 GRU에서는 이전 시점에서의 뉴런(셀)의 출력이 다음 시점으로 전달될 때
                게이트를 이용하여 정보량이 조정됨으로써 신경망이 가지는 시간 의존성을 자유롭게
                제어할 수 있습니다. 이는 학습에서 발생하는 오류 신호의 역방향 전달에서도 동일하게
                적용되어, <strong>기본 RNN에 비해 파라미터 수가 더 많아짐에도 불구하고 학습이 더
                잘되는 것</strong>으로 알려져 있습니다. 한편 LSTM과 GRU의 학습법도 기본 RNN과
                동일하게 BPTT 기법을 사용하며, 게이트를 위해 추가된 모든 파라미터에 동일한 방식으로
                유도된 학습식이 적용됩니다.
              </Hint>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
