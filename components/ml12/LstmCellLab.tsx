"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, CalcRow, Chip, ComputedNote, Formula, Hint, Scroller, Slider } from "./ui";
import { LSTM_W, fmt, lstmStep } from "./rnnCore";

/* ─────────── 셀 구조 그림 ─────────── */

const GATES = [
  { key: "f", cx: 100, label: "f_t", w: "W_f", fn: "σ" },
  { key: "i", cx: 145, label: "i_t", w: "W_i", fn: "σ" },
  { key: "c", cx: 205, label: "c̃_t", w: "W_c", fn: "tanh" },
  { key: "o", cx: 258, label: "o_t", w: "W_o", fn: "σ" },
];

const ZONES = [
  { key: "forget", title: "① 망각 게이트", x: 76, y: 32, w: 50, h: 150 },
  { key: "input", title: "② 입력 게이트", x: 126, y: 70, w: 104, h: 112 },
  { key: "update", title: "③ 셀 상태 갱신", x: 36, y: 30, w: 200, h: 34 },
  { key: "output", title: "④ 출력 계산", x: 234, y: 30, w: 114, h: 152 },
] as const;

type ZoneKey = (typeof ZONES)[number]["key"];

function LstmDiagram({ zone }: { zone: ZoneKey }) {
  const z = ZONES.find((v) => v.key === zone)!;
  return (
    <svg viewBox="0 0 360 215" className="h-auto w-full" style={{ minWidth: 330 }}>
      <rect
        x={36}
        y={28}
        width={312}
        height={156}
        rx={10}
        className="fill-gray-50 stroke-gray-200 dark:fill-gray-800/40 dark:stroke-gray-700"
        strokeWidth={1.2}
      />
      <motion.rect
        initial={false}
        animate={{ x: z.x, y: z.y, width: z.w, height: z.h }}
        rx={8}
        fill="#ef4444"
        opacity={0.12}
        stroke="#ef4444"
        strokeWidth={1.6}
        strokeDasharray="4 3"
      />

      {/* 셀 상태의 길 */}
      <line x1={36} y1={46} x2={348} y2={46} stroke="#a855f7" strokeWidth={2.4} markerEnd="url(#lstm-p)" />
      <text x={2} y={38} className="fill-gray-600 text-[9px] font-bold dark:fill-gray-300">
        c_(t−1)
      </text>
      <text x={326} y={38} className="fill-gray-600 text-[9px] font-bold dark:fill-gray-300">
        c_t
      </text>

      {/* 망각 게이트의 곱 */}
      <circle cx={100} cy={46} r={9} className="fill-white stroke-gray-500 dark:fill-gray-900" strokeWidth={1.3} />
      <text x={100} y={50} textAnchor="middle" className="fill-gray-600 text-[10px] font-bold dark:fill-gray-300">
        ×
      </text>
      {/* 셀 상태 갱신의 덧셈 */}
      <circle cx={175} cy={46} r={9} className="fill-white stroke-gray-500 dark:fill-gray-900" strokeWidth={1.3} />
      <text x={175} y={50} textAnchor="middle" className="fill-gray-600 text-[10px] font-bold dark:fill-gray-300">
        +
      </text>
      {/* 입력 게이트의 곱 */}
      <circle cx={175} cy={88} r={9} className="fill-white stroke-gray-500 dark:fill-gray-900" strokeWidth={1.3} />
      <text x={175} y={92} textAnchor="middle" className="fill-gray-600 text-[10px] font-bold dark:fill-gray-300">
        ×
      </text>
      <line x1={175} y1={79} x2={175} y2={56} stroke="#6b7280" strokeWidth={1.4} />
      <line x1={145} y1={122} x2={145} y2={88} stroke="#6b7280" strokeWidth={1.4} />
      <line x1={145} y1={88} x2={166} y2={88} stroke="#6b7280" strokeWidth={1.4} />
      <line x1={205} y1={122} x2={205} y2={88} stroke="#6b7280" strokeWidth={1.4} />
      <line x1={205} y1={88} x2={184} y2={88} stroke="#6b7280" strokeWidth={1.4} />
      <line x1={100} y1={122} x2={100} y2={56} stroke="#6b7280" strokeWidth={1.4} />

      {/* 출력 계산 */}
      <line x1={305} y1={46} x2={305} y2={59} stroke="#a855f7" strokeWidth={1.6} />
      <rect x={289} y={59} width={32} height={22} rx={6} fill="#fee2e2" stroke="#ef4444" strokeWidth={1.3} />
      <text x={305} y={74} textAnchor="middle" className="fill-red-700 text-[9px] font-bold">
        tanh
      </text>
      <line x1={305} y1={81} x2={305} y2={101} stroke="#6b7280" strokeWidth={1.4} />
      <circle cx={305} cy={110} r={9} className="fill-white stroke-gray-500 dark:fill-gray-900" strokeWidth={1.3} />
      <text x={305} y={114} textAnchor="middle" className="fill-gray-600 text-[10px] font-bold dark:fill-gray-300">
        ×
      </text>
      <line x1={258} y1={122} x2={258} y2={110} stroke="#6b7280" strokeWidth={1.4} />
      <line x1={258} y1={110} x2={296} y2={110} stroke="#6b7280" strokeWidth={1.4} />
      <line x1={314} y1={110} x2={348} y2={110} stroke="#ef4444" strokeWidth={2} markerEnd="url(#lstm-r)" />
      <text x={330} y={126} textAnchor="middle" className="fill-gray-600 text-[9px] font-bold dark:fill-gray-300">
        h_t
      </text>
      <line x1={330} y1={104} x2={330} y2={16} stroke="#6b7280" strokeWidth={1.4} markerEnd="url(#lstm-g)" />
      <text x={330} y={11} textAnchor="middle" className="fill-gray-600 text-[9px] font-bold dark:fill-gray-300">
        y_t
      </text>

      {/* 게이트 블록 */}
      {GATES.map((g) => (
        <g key={g.key}>
          <rect
            x={g.cx - 16}
            y={122}
            width={32}
            height={22}
            rx={6}
            fill={g.fn === "σ" ? "#dbeafe" : "#fee2e2"}
            stroke={g.fn === "σ" ? "#2563eb" : "#ef4444"}
            strokeWidth={1.3}
          />
          <text
            x={g.cx}
            y={137}
            textAnchor="middle"
            className={`${g.fn === "σ" ? "fill-blue-700" : "fill-red-700"} text-[9px] font-bold`}
          >
            {g.fn}
          </text>
          <text x={g.cx} y={118} textAnchor="middle" className="fill-gray-600 text-[8.5px] font-bold dark:fill-gray-300">
            {g.label}
          </text>
          <text x={g.cx} y={158} textAnchor="middle" className="fill-gray-500 text-[8px] font-bold">
            {g.w}
          </text>
          <line x1={g.cx} y1={162} x2={g.cx} y2={176} stroke="#6b7280" strokeWidth={1.3} />
        </g>
      ))}

      {/* 입력 버스 */}
      <line x1={36} y1={176} x2={290} y2={176} stroke="#6b7280" strokeWidth={1.6} />
      <text x={2} y={180} className="fill-gray-600 text-[9px] font-bold dark:fill-gray-300">
        h_(t−1)
      </text>
      <line x1={65} y1={202} x2={65} y2={176} stroke="#6b7280" strokeWidth={1.4} />
      <text x={65} y={212} textAnchor="middle" className="fill-gray-600 text-[9px] font-bold dark:fill-gray-300">
        x_t
      </text>

      <defs>
        <marker id="lstm-p" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill="#a855f7" />
        </marker>
        <marker id="lstm-r" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill="#ef4444" />
        </marker>
        <marker id="lstm-g" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill="#6b7280" />
        </marker>
      </defs>
    </svg>
  );
}

/* ─────────── 네 가지 계산 요소의 설명 ─────────── */

const STEPS: {
  key: ZoneKey;
  title: string;
  en: string;
  formula: string;
  note: string;
  body: string;
}[] = [
  {
    key: "forget",
    title: "① 망각 게이트",
    en: "forget gate",
    formula: "f_t = σ( W_f [h_(t−1), x_t] + b_f )",
    note: "식 12-15",
    body: "셀 상태 정보 c_(t−1)을 어느 정도 잊어버릴 것인가를 결정하는 부분입니다. σ는 시그모이드 활성화 함수로 [0.0, 1.0] 범위의 실수를 출력하고, 이렇게 계산된 f_t가 셀 상태 갱신을 위해 사용됩니다. f_t가 c_(t−1)에 곱해지므로 셀 상태 정보는 [0, c_(t−1)] 범위로 변경됩니다. f_t가 0이면 곱해진 값도 0이 되어 셀 상태의 정보를 완전히 잊어버리게 되고, 1이면 c_(t−1)이 주어진 그대로 활용됩니다.",
  },
  {
    key: "input",
    title: "② 입력 게이트",
    en: "input gate",
    formula: "i_t = σ( W_i [h_(t−1), x_t] + b_i )   ·   c̃_t = tanh( W_c [h_(t−1), x_t] + b_c )",
    note: "식 12-16 · 12-17",
    body: "셀 상태에 새로운 정보를 추가하는 정도를 조정하는 부분입니다. 입력 게이트 i_t와 셀 상태의 후보 c̃_t 두 신호를 계산하고 두 신호를 곱해서 셀 상태에 더합니다. c̃_t는 셀이 출력할 후보의 값(또는 셀 상태에 추가될 새로운 정보)으로, 이 후보값을 얼마나 셀 상태로 전달할지를 결정하기 위해 입력 게이트의 값 i_t가 곱해져서 셀 출력 후보값은 [0, c̃_t] 범위로 조정됩니다.",
  },
  {
    key: "update",
    title: "③ 셀 상태 갱신",
    en: "cell-state update",
    formula: "c_t = c_(t−1) ⊙ f_t + i_t ⊙ c̃_t",
    note: "식 12-18 — ⊙는 아다마르 곱(차원이 같은 두 행렬에서 요소별 곱셈)",
    body: "망각 게이트에 의해 [0, c_(t−1)] 범위로 수정된 셀 상태 정보와, 입력 게이트를 통해 [0, c̃_t] 범위로 조정된 셀 출력의 후보값을 더해서 새로운 셀 상태 c_t가 갱신됩니다. 이 식을 통해 LSTM 셀은 기억하거나 잊어야 할 정보의 일부를 결정하고 새로운 정보를 추가할 수 있습니다.",
  },
  {
    key: "output",
    title: "④ 출력 계산",
    en: "output gate & cell output",
    formula: "o_t = σ( W_o [h_(t−1), x_t] + b_o )   ·   h_t = o_t ⊙ tanh(c_t)   ·   y_t = φ_softmax( W_hy h_t + b_y )",
    note: "식 12-19 · 12-20 · 12-21",
    body: "출력 게이트 o_t는 현재 셀 상태의 중요도를 반영하여 출력 정도를 조정합니다. 셀의 출력 h_t는 새로운 셀 상태 c_t에 tanh 함수를 적용해서 결정하되, 이 값을 그대로 최종 출력으로 전달하는 것이 아니라 앞서 계산한 출력 게이트 o_t와 곱해져서 출력의 크기를 조절합니다.",
  },
];

/* ─────────── 게이트 막대 ─────────── */

function GateBar({ label, value, tone }: { label: string; value: number; tone: string }) {
  const pct = Math.max(0, Math.min(1, (value + 1) / 2));
  const zero = 0.5;
  const left = Math.min(pct, zero);
  const width = Math.abs(pct - zero);
  return (
    <div>
      <div className="mb-0.5 flex items-baseline justify-between text-[10.5px]">
        <span className="font-semibold text-gray-600 dark:text-gray-300">{label}</span>
        <span className="font-mono font-bold text-red-500">{fmt(value, 4)}</span>
      </div>
      <div className="relative h-3 w-full rounded bg-gray-100 dark:bg-gray-800">
        <div className="absolute left-1/2 top-0 h-3 w-px bg-gray-300 dark:bg-gray-600" />
        <motion.div
          initial={false}
          animate={{ left: `${left * 100}%`, width: `${width * 100}%` }}
          className={`absolute top-0 h-3 rounded ${tone}`}
        />
      </div>
    </div>
  );
}

export default function LstmCellLab() {
  const [zone, setZone] = useState<ZoneKey>("forget");
  const [x, setX] = useState(1);
  const [hPrev, setHPrev] = useState(0.3);
  const [cPrev, setCPrev] = useState(0.6);

  const s = useMemo(() => lstmStep(x, hPrev, cPrev), [x, hPrev, cPrev]);
  const step = STEPS.find((v) => v.key === zone)!;

  // 시각 1에만 입력을 넣고 이후에는 0을 넣었을 때 셀 상태가 어떻게 유지되는가
  const run = useMemo(() => {
    const out = [];
    let h = 0;
    let c = 0;
    for (let t = 0; t < 6; t += 1) {
      const r = lstmStep(t === 0 ? x : 0, h, c);
      h = r.h;
      c = r.c;
      out.push({ ...r, t: t + 1 });
    }
    return out;
  }, [x]);

  /** 여섯 시각 동안 망각 게이트가 실제로 움직인 범위 */
  const fLo = Math.min(...run.map((r) => r.f));
  const fHi = Math.max(...run.map((r) => r.f));

  return (
    <section id="lstm" className="scroll-mt-32">
      <SectionTitle
        title="LSTM 셀의 구조와 기능"
        subtitle="세 개의 게이트가 셀 내의 데이터 흐름을 어떻게 제어하는지 값으로 확인합니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "12.4.3 (1) LSTM — 단순 RNN 셀과의 비교, 3개의 게이트",
            slides: "LSTM 셀 구조 — 기본 RNN 셀 vs LSTM 셀",
          }}
        >
          <Card>
            <CardTitle>단순 RNN 셀과 무엇이 다른가</CardTitle>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50">
                <p className="text-[12px] font-bold text-gray-700 dark:text-gray-200">기본 RNN 셀</p>
                <p className="mt-1 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  순환의 대상은 h_t 하나. tanh 하나로 상태를 갱신합니다.
                </p>
              </div>
              <div className="rounded-lg border border-red-100 bg-red-50/60 p-3 dark:border-red-900/50 dark:bg-red-950/30">
                <p className="text-[12px] font-bold text-red-600 dark:text-red-300">LSTM 셀</p>
                <p className="mt-1 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  시간 t에서의 셀의 출력 h_t뿐만 아니라{" "}
                  <strong>셀의 내부 상태(셀이 기억하고 있는 과거 내용)를 나타내는 c_t도 순환의
                  대상</strong>입니다.
                </p>
              </div>
            </div>
            <p className="mt-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              LSTM 셀에는 3개의 게이트가 존재하며, 이런 게이트는{" "}
              <strong>0.0~1.0 사이의 실수값</strong>을 가지고 셀 내의 데이터 흐름을 제어합니다.
            </p>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                { n: "망각 게이트", e: "forget gate", d: "셀 상태의 정보를 어느 정도 지우고 남길 것인지를 조정" },
                { n: "입력 게이트", e: "input gate", d: "셀 상태에 새로운 정보를 추가하는 정도를 조정" },
                { n: "출력 게이트", e: "output gate", d: "현재 셀 상태의 중요도를 반영하여 출력 정도를 조정" },
              ].map((g) => (
                <div key={g.n} className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/60">
                  <p className="text-[12px] font-bold text-gray-700 dark:text-gray-200">{g.n}</p>
                  <p className="text-[10px] text-gray-400">{g.e}</p>
                  <p className="mt-1 text-[11px] leading-5 text-gray-600 dark:text-gray-300">{g.d}</p>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <Hint>
                망각 게이트는 1997년 제프 호크라이터(Sepp Hochreiter)가 LSTM을 제안할 당시에는
                없었으며, 2000년 펠릭스 거스(Felix Gers)에 의해 추가되었고 현재에는 거의 표준처럼
                사용되고 있습니다.
              </Hint>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.4.3 (1) — LSTM 셀의 기능(그림 12-28), 식 12-15 ~ 12-21",
            slides: "LSTM 셀의 기능 — 망각 게이트 · 입력 게이트 · 셀 상태 갱신 · 출력 계산",
          }}
        >
          <Card>
            <CardTitle>네 가지 계산 요소 — 눌러서 자리 확인</CardTitle>
            <div className="mb-3 flex flex-wrap gap-2">
              {STEPS.map((v) => (
                <Chip key={v.key} active={zone === v.key} onClick={() => setZone(v.key)}>
                  {v.title}
                </Chip>
              ))}
            </div>
            <Scroller>
              <LstmDiagram zone={zone} />
            </Scroller>
            <div className="mt-3 space-y-2">
              <p className="text-[12px] font-bold text-red-500">
                {step.title} <span className="font-normal text-gray-400">{step.en}</span>
              </p>
              <Formula note={step.note}>{step.formula}</Formula>
              <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">{step.body}</p>
            </div>
            <div className="mt-3">
              <Hint>
                LSTM은 3개의 입력(x_t, c_(t−1), h_(t−1))을 받아 네 종류의 계산을 수행하는 부분으로
                구성됩니다. 3개의 게이트를 위한 가중치(W_f, W_i, W_o)와 W_c(단순 RNN의 은닉 노드의
                가중치 W_hh에 해당)가 학습 대상이 됩니다.
              </Hint>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.4.3 (1) — 식 12-15 ~ 12-20의 계산",
            slides: "LSTM 셀의 기능 — 게이트 값과 셀 상태",
          }}
        >
          <Card>
            <CardTitle>게이트 값 흐름 계산기</CardTitle>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
              <Slider
                label="직전 셀 상태 c_(t−1)"
                value={cPrev}
                min={-2}
                max={2}
                step={0.1}
                onChange={setCPrev}
                display={fmt(cPrev, 1)}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="space-y-2.5">
                <p className="text-[11px] font-semibold text-gray-500">게이트 값 — σ는 0과 1 사이</p>
                <GateBar label="f_t  망각 게이트" value={s.f} tone="bg-blue-500" />
                <GateBar label="i_t  입력 게이트" value={s.i} tone="bg-emerald-500" />
                <GateBar label="c̃_t  셀 상태 후보 (tanh)" value={s.cTilde} tone="bg-amber-500" />
                <GateBar label="o_t  출력 게이트" value={s.o} tone="bg-violet-500" />
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold text-gray-500">계산 과정</p>
                <CalcRow
                  label="f_t"
                  expr={`σ(${fmt(LSTM_W.f.u, 1)}·${fmt(hPrev, 2)} + ${fmt(LSTM_W.f.v, 1)}·${fmt(x, 1)} + ${fmt(LSTM_W.f.b, 1)}) = σ(${fmt(s.fPre, 3)})`}
                  value={fmt(s.f, 4)}
                />
                <CalcRow label="c_(t−1) ⊙ f_t" expr={`${fmt(cPrev, 2)} × ${fmt(s.f, 4)} — 남길 기억`} value={fmt(s.kept, 4)} />
                <CalcRow
                  label="i_t"
                  expr={`σ(${fmt(s.iPre, 3)})`}
                  value={fmt(s.i, 4)}
                />
                <CalcRow
                  label="c̃_t"
                  expr={`tanh(${fmt(s.cTildePre, 3)})`}
                  value={fmt(s.cTilde, 4)}
                />
                <CalcRow label="i_t ⊙ c̃_t" expr={`${fmt(s.i, 4)} × ${fmt(s.cTilde, 4)} — 더할 새 정보`} value={fmt(s.added, 4)} />
                <CalcRow
                  label="c_t"
                  expr={`${fmt(s.kept, 4)} + ${fmt(s.added, 4)}`}
                  value={fmt(s.c, 4)}
                  tone="accent"
                />
                <CalcRow label="o_t" expr={`σ(${fmt(s.oPre, 3)})`} value={fmt(s.o, 4)} />
                <CalcRow
                  label="h_t"
                  expr={`${fmt(s.o, 4)} × tanh(${fmt(s.c, 4)})`}
                  value={fmt(s.h, 4)}
                  tone="accent"
                />
              </div>
            </div>

            <div className="mt-3">
              <ComputedNote>
                게이트 가중치는 이 페이지에서 정한 값입니다 — W_f(U=1.2, V=0.9, b=0.5),
                W_i(U=−0.6, V=1.4, b=−0.2), W_c(U=0.7, V=1.1, b=0), W_o(U=0.4, V=1.3, b=−0.3).
                강의록 표기대로 W[h_(t−1), x_t] = U h_(t−1) + V x_t로 계산했고, 이해를 돕기 위해
                모든 값을 1차원 스칼라로 두었습니다. 교재·강의록에는 수식만 있고 수치는 제시되어
                있지 않습니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.4.3 (1) — 장기 의존성 문제의 해결",
            slides: "LSTM 셀의 기능 — 셀 상태 갱신",
          }}
        >
          <Card>
            <CardTitle>시각 1에만 입력을 주고 이후에는 0을 주면</CardTitle>
            <Scroller>
              <svg viewBox="0 0 440 150" className="h-auto w-full min-w-[400px]">
                <line x1={44} y1={100} x2={430} y2={100} stroke="#d1d5db" strokeWidth={1} />
                <text x={6} y={104} className="fill-gray-400 text-[9px]">
                  0
                </text>
                <text x={6} y={28} className="fill-gray-400 text-[9px]">
                  +1.5
                </text>
                {run.map((r, i) => {
                  const bx = 72 + i * 62;
                  const scale = 48;
                  const cH = Math.min(Math.abs(r.c) * scale, 76);
                  const hH = Math.min(Math.abs(r.h) * scale, 76);
                  return (
                    <g key={r.t}>
                      <motion.rect
                        initial={false}
                        animate={{ y: r.c >= 0 ? 100 - cH : 100, height: cH }}
                        x={bx - 22}
                        width={18}
                        rx={3}
                        fill="#a855f7"
                      />
                      <motion.rect
                        initial={false}
                        animate={{ y: r.h >= 0 ? 100 - hH : 100, height: hH }}
                        x={bx + 2}
                        width={18}
                        rx={3}
                        fill="#ef4444"
                      />
                      <text x={bx - 1} y={118} textAnchor="middle" className="fill-gray-500 text-[9px] font-semibold">
                        t = {r.t}
                      </text>
                      <text x={bx - 1} y={132} textAnchor="middle" className="fill-gray-400 text-[8.5px]">
                        x = {fmt(r.x, 1)}
                      </text>
                      <text x={bx - 13} y={144} textAnchor="middle" className="fill-violet-500 text-[8px] font-bold">
                        {fmt(r.c, 2)}
                      </text>
                      <text x={bx + 11} y={144} textAnchor="middle" className="fill-red-500 text-[8px] font-bold">
                        {fmt(r.h, 2)}
                      </text>
                    </g>
                  );
                })}
                <rect x={300} y={6} width={9} height={9} rx={2} fill="#a855f7" />
                <text x={313} y={14} className="fill-gray-500 text-[9px]">
                  셀 상태 c_t
                </text>
                <rect x={374} y={6} width={9} height={9} rx={2} fill="#ef4444" />
                <text x={387} y={14} className="fill-gray-500 text-[9px]">
                  출력 h_t
                </text>
              </svg>
            </Scroller>
            <div className="mt-2">
              <Hint>
                시각 1 이후로는 입력이 없으므로, 뒤쪽 시각의 c_t는 전적으로 시각 1에 들어온
                정보가 얼마나 남았는지를 보여 줍니다. 그 남는 양을 정하는 것이 망각 게이트입니다 —
                c_t = c_(t−1) ⊙ f_t + i_t ⊙ c̃_t 에서 f_t가 곱해지는 몫이기 때문입니다. 지금
                가중치에서 f_t는{" "}
                <span className="font-mono font-bold">
                  {fmt(fLo, 2)}~{fmt(fHi, 2)}
                </span>{" "}
                사이이고, 시각 1에 c₁ ={" "}
                <span className="font-mono font-bold">{fmt(run[0].c, 2)}</span>였던 셀 상태가 시각
                6에 <span className="font-mono font-bold">{fmt(run[5].c, 2)}</span>가 되었습니다.
                한 번에 지워지는 것이 아니라 매 시각 f_t배씩 옅어지는 모양입니다. f_t가 1에
                가까우면 c_(t−1)이 거의 그대로 넘어가고 0이면 즉시 지워지는데, 그 양 끝은 바로 위
                ‘장기 의존성’에서 망각 게이트 값을 직접 움직여 확인할 수 있습니다. 위쪽
                슬라이더로 입력 x를 바꾸면 처음 들어간 정보의 크기가 달라집니다.
              </Hint>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
