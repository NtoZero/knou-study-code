"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, CalcRow, ComputedNote, Formula, Hint, Scroller, Slider } from "./ui";
import { GRU_W, fmt, gruStep } from "./rnnCore";

function GruDiagram() {
  return (
    <svg viewBox="0 0 360 215" className="h-auto w-full" style={{ minWidth: 330 }}>
      <rect
        x={36}
        y={28}
        width={312}
        height={158}
        rx={10}
        className="fill-gray-50 stroke-gray-200 dark:fill-gray-800/40 dark:stroke-gray-700"
        strokeWidth={1.2}
      />
      {/* 출력이 지나가는 길 */}
      <line x1={36} y1={46} x2={348} y2={46} stroke="#ef4444" strokeWidth={2.4} markerEnd="url(#gru-r)" />
      <text x={2} y={38} className="fill-gray-600 text-[9px] font-bold dark:fill-gray-300">
        h_(t−1)
      </text>
      <text x={330} y={38} className="fill-gray-600 text-[9px] font-bold dark:fill-gray-300">
        h_t
      </text>

      {/* (1 − z) ⊙ h_(t−1) */}
      <circle cx={160} cy={46} r={9} className="fill-white stroke-gray-500 dark:fill-gray-900" strokeWidth={1.3} />
      <text x={160} y={50} textAnchor="middle" className="fill-gray-600 text-[10px] font-bold dark:fill-gray-300">
        ×
      </text>
      <rect x={146} y={64} width={28} height={20} rx={5} className="fill-white stroke-gray-400 dark:fill-gray-900" strokeWidth={1.2} />
      <text x={160} y={78} textAnchor="middle" className="fill-gray-600 text-[9px] font-bold dark:fill-gray-300">
        1−
      </text>
      <line x1={160} y1={64} x2={160} y2={56} stroke="#6b7280" strokeWidth={1.3} />
      <line x1={160} y1={120} x2={160} y2={84} stroke="#6b7280" strokeWidth={1.3} />

      {/* 더하기 */}
      <circle cx={265} cy={46} r={9} className="fill-white stroke-gray-500 dark:fill-gray-900" strokeWidth={1.3} />
      <text x={265} y={50} textAnchor="middle" className="fill-gray-600 text-[10px] font-bold dark:fill-gray-300">
        +
      </text>
      {/* z ⊙ h̃ */}
      <circle cx={265} cy={86} r={9} className="fill-white stroke-gray-500 dark:fill-gray-900" strokeWidth={1.3} />
      <text x={265} y={90} textAnchor="middle" className="fill-gray-600 text-[10px] font-bold dark:fill-gray-300">
        ×
      </text>
      <line x1={265} y1={77} x2={265} y2={56} stroke="#6b7280" strokeWidth={1.3} />
      <line x1={160} y1={104} x2={265} y2={104} stroke="#6b7280" strokeWidth={1.3} />
      <line x1={265} y1={104} x2={265} y2={96} stroke="#6b7280" strokeWidth={1.3} />
      <line x1={215} y1={120} x2={215} y2={86} stroke="#6b7280" strokeWidth={1.3} />
      <line x1={215} y1={86} x2={256} y2={86} stroke="#6b7280" strokeWidth={1.3} />

      {/* 리셋 게이트의 곱 */}
      <circle cx={108} cy={96} r={9} className="fill-white stroke-gray-500 dark:fill-gray-900" strokeWidth={1.3} />
      <text x={108} y={100} textAnchor="middle" className="fill-gray-600 text-[10px] font-bold dark:fill-gray-300">
        ×
      </text>
      <line x1={108} y1={46} x2={108} y2={87} stroke="#6b7280" strokeWidth={1.3} />
      <line x1={90} y1={120} x2={90} y2={96} stroke="#6b7280" strokeWidth={1.3} />
      <line x1={90} y1={96} x2={99} y2={96} stroke="#6b7280" strokeWidth={1.3} />
      <line x1={108} y1={105} x2={108} y2={158} stroke="#6b7280" strokeWidth={1.3} />
      <line x1={108} y1={158} x2={203} y2={158} stroke="#6b7280" strokeWidth={1.3} />
      <line x1={203} y1={158} x2={203} y2={142} stroke="#6b7280" strokeWidth={1.3} />

      {/* 게이트 블록 */}
      {[
        { cx: 90, fn: "σ", label: "r_t", w: "W_r", tone: "blue" },
        { cx: 160, fn: "σ", label: "z_t", w: "W_z", tone: "blue" },
        { cx: 215, fn: "tanh", label: "h̃_t", w: "W_h", tone: "red" },
      ].map((g) => (
        <g key={g.label}>
          <rect
            x={g.cx - (g.fn === "tanh" ? 18 : 16)}
            y={120}
            width={g.fn === "tanh" ? 36 : 32}
            height={22}
            rx={6}
            fill={g.tone === "blue" ? "#dbeafe" : "#fee2e2"}
            stroke={g.tone === "blue" ? "#2563eb" : "#ef4444"}
            strokeWidth={1.3}
          />
          <text
            x={g.cx}
            y={135}
            textAnchor="middle"
            className={`${g.tone === "blue" ? "fill-blue-700" : "fill-red-700"} text-[9px] font-bold`}
          >
            {g.fn}
          </text>
          <text x={g.cx} y={116} textAnchor="middle" className="fill-gray-600 text-[8.5px] font-bold dark:fill-gray-300">
            {g.label}
          </text>
          <text x={g.cx + 22} y={136} className="fill-gray-500 text-[8px] font-bold">
            {g.w}
          </text>
        </g>
      ))}
      <line x1={90} y1={142} x2={90} y2={176} stroke="#6b7280" strokeWidth={1.3} />
      <line x1={160} y1={142} x2={160} y2={176} stroke="#6b7280" strokeWidth={1.3} />
      <line x1={228} y1={142} x2={228} y2={176} stroke="#6b7280" strokeWidth={1.3} />

      {/* 입력 버스 */}
      <line x1={55} y1={46} x2={55} y2={176} stroke="#6b7280" strokeWidth={1.3} />
      <line x1={55} y1={176} x2={240} y2={176} stroke="#6b7280" strokeWidth={1.6} />
      <line x1={70} y1={200} x2={70} y2={176} stroke="#6b7280" strokeWidth={1.3} />
      <text x={70} y={210} textAnchor="middle" className="fill-gray-600 text-[9px] font-bold dark:fill-gray-300">
        x_t
      </text>

      <text x={74} y={20} className="fill-gray-500 text-[8.5px] font-bold">
        리셋 게이트
      </text>
      <text x={146} y={20} className="fill-gray-500 text-[8.5px] font-bold">
        갱신 게이트
      </text>

      <defs>
        <marker id="gru-r" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill="#ef4444" />
        </marker>
      </defs>
    </svg>
  );
}

export default function GruCellLab() {
  const [x, setX] = useState(1);
  const [hPrev, setHPrev] = useState(0.6);
  const [zManual, setZManual] = useState(0.5);

  const s = useMemo(() => gruStep(x, hPrev), [x, hPrev]);

  // z를 직접 움직여 볼 때의 출력 — h̃는 위에서 계산된 값을 그대로 쓴다
  const manual = (1 - zManual) * hPrev + zManual * s.hTilde;

  return (
    <section id="gru" className="scroll-mt-32">
      <SectionTitle
        title="GRU — 게이트 순환 유닛"
        subtitle="LSTM 셀 구조를 좀 더 단순하게 개선한 셀"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "12.4.3 (2) GRU — LSTM과의 차이",
            slides: "GRU — Gated Recurrent Unit",
          }}
        >
          <Card>
            <CardTitle>왜 GRU인가</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              LSTM은 셀 상태 정보를 통해 중요한 입력값을 필요한 기간만큼 기억하고 유지하기 위해{" "}
              <strong>복잡한 연결 구조를 갖고, 이로 인해 많은 파라미터를 가집니다</strong>. 이런
              문제로 기능적으로는 LSTM과 유사하지만, LSTM 셀 구조를 좀 더 단순하게 개선한 것이 바로{" "}
              <strong>2014년에 제안된 GRU(Gated Recurrent Unit, 게이트 순환 유닛)</strong>입니다.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-gray-800/60">
                <p className="text-[12px] font-bold text-gray-700 dark:text-gray-200">
                  입력 2개 · 출력 1개
                </p>
                <p className="mt-1 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  GRU 셀은 단순 RNN 셀과 마찬가지로 2개의 입력(h_(t−1), x_t)과 하나의 출력(h_t)만
                  존재합니다. 즉, LSTM 셀과 달리 <strong>셀 상태 c_t를 사용하지 않고, 셀 상태가
                  셀의 출력 h_t에 통합</strong>되었습니다.
                </p>
              </div>
              <div className="rounded-lg bg-red-50/60 px-3 py-2.5 dark:bg-red-950/30">
                <p className="text-[12px] font-bold text-red-600 dark:text-red-300">게이트 2개</p>
                <p className="mt-1 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  갱신 게이트(update gate) z_t와 리셋 게이트(reset gate) r_t. LSTM 셀의{" "}
                  <strong>입력 게이트와 망각 게이트를 합친 것이 갱신 게이트</strong>이고, 출력을
                  제어하는 출력 게이트가 없어지고 리셋 게이트가 추가되었습니다.
                </p>
              </div>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.4.3 (2) — GRU 셀의 구조(그림 12-29), 식 12-22 ~ 12-25",
            slides: "GRU 셀의 구조 · GRU 셀의 기능",
          }}
        >
          <Card>
            <CardTitle>셀 구조와 네 개의 식</CardTitle>
            <Scroller>
              <GruDiagram />
            </Scroller>
            <div className="mt-3 space-y-2">
              <Formula note="식 12-22 — 이전의 출력 h_(t−1)을 어느 정도 받아들일지 조정">
                r_t = σ( W_r [h_(t−1), x_t] + b_r )
              </Formula>
              <Formula note="식 12-23 — 현 시점의 출력을 위해 받아들일 새로운 내용과 이전의 출력 내용의 비율을 조정">
                z_t = σ( W_z [h_(t−1), x_t] + b_z )
              </Formula>
              <Formula note="식 12-24 — 시간 t에서 추가되는 새로운 내용. 입력 x_t와 리셋 게이트를 거친 이전 출력을 이용">
                h̃_t = tanh( W_h [ r_t ⊙ h_(t−1), x_t ] + b_h )
              </Formula>
              <Formula note="식 12-25 — 이전 상태 정보와 현재 입력 정보를 갱신 게이트의 값의 비율에 따라 합친다">
                h_t = (1 − z_t) ⊙ h_(t−1) + z_t ⊙ h̃_t
              </Formula>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.4.3 (2) — 식 12-22 ~ 12-25의 계산",
            slides: "GRU 셀의 기능 — 리셋 게이트 · 갱신 게이트 · 출력 h_t 계산",
          }}
        >
          <Card>
            <CardTitle>두 게이트 값을 직접 계산</CardTitle>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Slider label="입력 x_t" value={x} min={-2} max={2} step={0.1} onChange={setX} display={fmt(x, 1)} />
              <Slider
                label="직전 출력 h_(t−1)"
                value={hPrev}
                min={-1}
                max={1}
                step={0.05}
                onChange={setHPrev}
                display={fmt(hPrev, 2)}
              />
            </div>
            <div className="mt-3 space-y-1.5">
              <CalcRow
                label="r_t"
                expr={`σ(${fmt(GRU_W.r.u, 1)}·${fmt(hPrev, 2)} + ${fmt(GRU_W.r.v, 1)}·${fmt(x, 1)} + ${fmt(GRU_W.r.b, 1)}) = σ(${fmt(s.rPre, 3)})`}
                value={fmt(s.r, 4)}
              />
              <CalcRow
                label="z_t"
                expr={`σ(${fmt(s.zPre, 3)})`}
                value={fmt(s.z, 4)}
              />
              <CalcRow
                label="r_t ⊙ h"
                expr={`${fmt(s.r, 4)} × ${fmt(hPrev, 2)} — 리셋을 거친 이전 출력`}
                value={fmt(s.gated, 4)}
              />
              <CalcRow
                label="h̃_t"
                expr={`tanh(${fmt(GRU_W.h.u, 1)}·${fmt(s.gated, 4)} + ${fmt(GRU_W.h.v, 1)}·${fmt(x, 1)}) = tanh(${fmt(s.hTildePre, 3)})`}
                value={fmt(s.hTilde, 4)}
              />
              <CalcRow
                label="(1−z)h"
                expr={`${fmt(1 - s.z, 4)} × ${fmt(hPrev, 2)} — 이전 출력에서 남기는 몫`}
                value={fmt(s.kept, 4)}
              />
              <CalcRow
                label="z ⊙ h̃"
                expr={`${fmt(s.z, 4)} × ${fmt(s.hTilde, 4)} — 새 내용에서 받는 몫`}
                value={fmt(s.added, 4)}
              />
              <CalcRow label="h_t" expr="두 몫의 합" value={fmt(s.h, 4)} tone="accent" />
            </div>

            {/* 두 몫의 비율 막대 */}
            <div className="mt-3">
              <p className="mb-1 text-[11px] font-semibold text-gray-500">
                갱신 게이트가 나누는 비율 — z_t = {fmt(s.z, 3)}
              </p>
              <div className="flex h-5 w-full overflow-hidden rounded">
                <motion.div
                  initial={false}
                  animate={{ width: `${(1 - s.z) * 100}%` }}
                  className="flex items-center justify-center bg-gray-400 text-[10px] font-bold text-white"
                >
                  {(1 - s.z) * 100 >= 18 ? `이전 출력 ${fmt((1 - s.z) * 100, 0)}%` : ""}
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{ width: `${s.z * 100}%` }}
                  className="flex items-center justify-center bg-red-500 text-[10px] font-bold text-white"
                >
                  {s.z * 100 >= 18 ? `새 내용 ${fmt(s.z * 100, 0)}%` : ""}
                </motion.div>
              </div>
            </div>

            <div className="mt-3">
              <ComputedNote>
                가중치는 이 페이지에서 정한 값입니다 — W_r(U=−0.8, V=1.1, b=0.2), W_z(U=0.5,
                V=1.2, b=−0.4), W_h(U=1.0, V=0.9, b=0). 1차원 스칼라로 두고 계산했습니다.
                교재·강의록에는 수식만 있고 수치는 제시되어 있지 않습니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.4.3 (2) — 갱신 게이트의 역할(z_t = 1, z_t = 0)",
            slides: "GRU 셀의 기능 — 출력 h_t 계산",
          }}
        >
          <Card>
            <CardTitle>갱신 게이트 하나로 두 역할을 겸한다</CardTitle>
            <div className="mb-3">
              <Slider
                label="갱신 게이트 값 z_t를 직접 움직여 보기"
                value={zManual}
                min={0}
                max={1}
                step={0.01}
                onChange={setZManual}
                display={fmt(zManual, 2)}
              />
            </div>
            <div className="space-y-1.5">
              <CalcRow
                label="(1−z)h"
                expr={`${fmt(1 - zManual, 2)} × ${fmt(hPrev, 2)}`}
                value={fmt((1 - zManual) * hPrev, 4)}
              />
              <CalcRow
                label="z ⊙ h̃"
                expr={`${fmt(zManual, 2)} × ${fmt(s.hTilde, 4)}`}
                value={fmt(zManual * s.hTilde, 4)}
              />
              <CalcRow label="h_t" expr="(1 − z_t) h_(t−1) + z_t h̃_t" value={fmt(manual, 4)} tone="accent" />
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setZManual(1)}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-left transition-colors hover:border-red-300 dark:border-gray-800 dark:bg-gray-800/60"
              >
                <p className="text-[12px] font-bold text-gray-700 dark:text-gray-200">z_t = 1이면</p>
                <p className="mt-1 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  1− 연산을 통과한 신호 (1 − z_t)는 0이 되고, 이 값과 이전의 출력 h_(t−1)을 곱하면
                  0이 되므로 <strong>이전의 내용을 완전히 잊어버리게</strong> 되고, z_t·h̃_t =
                  h̃_t가 되므로 사실상 입력 게이트로서의 동작은 의미가 없게 됩니다.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setZManual(0)}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-left transition-colors hover:border-red-300 dark:border-gray-800 dark:bg-gray-800/60"
              >
                <p className="text-[12px] font-bold text-gray-700 dark:text-gray-200">z_t = 0이면</p>
                <p className="mt-1 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  (1 − z_t)·h_(t−1) = h_(t−1)이 되어 <strong>망각 게이트로서의 기능은 없고</strong>{" "}
                  오직 입력 게이트만 동작하여 h̃_t를 차단하는 효과가 있습니다.
                </p>
              </button>
            </div>
            <div className="mt-3 rounded-lg border border-red-100 bg-red-50/60 px-3 py-2.5 dark:border-red-900/50 dark:bg-red-950/30">
              <p className="text-[12px] font-bold text-red-600 dark:text-red-300">
                위 두 설명을 출력값으로 바꿔 읽으면
              </p>
              <p className="mt-1 text-[12px] leading-6 text-gray-700 dark:text-gray-200">
                두 칸은 <strong>어느 게이트가 작동을 멈추는가</strong>를 말하고 있어 한 번에 잘
                읽히지 않습니다. 슬라이더를 양 끝으로 보내 h_t 값을 보면 간단합니다 —{" "}
                <strong>z_t = 1이면 h_t = h̃_t</strong>(새 후보만 남고 직전 상태는 사라짐),{" "}
                <strong>z_t = 0이면 h_t = h_(t−1)</strong>(직전 상태가 그대로 유지되고 새 후보는
                막힘). 지금 값으로는 각각{" "}
                <span className="font-mono font-bold text-red-500">{fmt(s.hTilde, 4)}</span>와{" "}
                <span className="font-mono font-bold text-red-500">{fmt(hPrev, 4)}</span>입니다.
              </p>
            </div>
            <div className="mt-3 space-y-2">
              <Hint>
                두 계수 (1 − z_t)와 z_t를 더하면 언제나 1이므로, 출력은 결코 저 두 끝값 바깥으로
                나가지 않습니다. 비율대로 그 사이를 오가는 것이 갱신 게이트가 하는 일의 전부입니다.
              </Hint>
              <ComputedNote>
                다른 책이나 라이브러리에서 GRU를 볼 때 주의할 점 하나 — 식 12-25는 z_t를{" "}
                <strong>새 내용 h̃_t</strong> 쪽에 곱하지만, 바깥에서는 z_t를 h_(t−1) 쪽에 곱해
                h_t = z_t ⊙ h_(t−1) + (1 − z_t) ⊙ h̃_t로 쓰는 표기가 더 흔합니다. 식의 모양은
                같고 z_t의 방향만 반대이므로, 이 페이지는 교재 표기를 그대로 따릅니다. 이 비교는
                교재·강의록에 없는 내용이라 참고로만 덧붙입니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
