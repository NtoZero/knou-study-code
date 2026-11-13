"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, Scroller, fmt } from "@/components/dlShared/ui";
import { F, Slider2, Chip2, Cell, r2 } from "@/components/dl2/ui2";

/** 네 개의 입력점 — 강의록 그림과 같은 (0,0) (1,0) (0,1) (1,1) */
const PTS = [
  { x1: 0, x2: 0, name: "a" },
  { x1: 1, x2: 0, name: "d" },
  { x1: 0, x2: 1, name: "c" },
  { x1: 1, x2: 1, name: "b" },
];

const GATES = {
  OR: { label: "OR", y: (a: number, b: number) => (a + b >= 1 ? 1 : 0) },
  XOR: { label: "XOR", y: (a: number, b: number) => (a + b === 1 ? 1 : 0) },
} as const;

type GateKey = keyof typeof GATES;

/** 강의록에 적힌 OR의 파라미터 — w₁ = 1, w₂ = 1, b = −0.5 */
const OR_PRESET = { w1: 1, w2: 1, b: -0.5 };

export default function SingleLayerLimit() {
  const [gate, setGate] = useState<GateKey>("OR");
  const [w1, setW1] = useState(OR_PRESET.w1);
  const [w2, setW2] = useState(OR_PRESET.w2);
  const [b, setB] = useState(OR_PRESET.b);

  // 단위 계단 함수 — 가중합이 0 이상이면 1
  const predict = (x1: number, x2: number) => (w1 * x1 + w2 * x2 + b >= 0 ? 1 : 0);
  const results = PTS.map((p) => ({
    ...p,
    target: GATES[gate].y(p.x1, p.x2),
    out: predict(p.x1, p.x2),
  }));
  const hit = results.filter((r) => r.out === r.target).length;

  // 그림 좌표 — x1, x2 ∈ [−0.4, 1.6] 을 0..200 으로
  const SX = (v: number) => r2(((v + 0.4) / 2) * 200);
  const SY = (v: number) => r2(200 - ((v + 0.4) / 2) * 200);

  // 경계선 w₁x₁ + w₂x₂ + b = 0 을 그림 범위에서 잘라 그린다
  const line = (() => {
    const lo = -0.4;
    const hi = 1.6;
    if (Math.abs(w2) > 1e-6) {
      const f = (x: number) => (-b - w1 * x) / w2;
      return { x1: SX(lo), y1: SY(f(lo)), x2: SX(hi), y2: SY(f(hi)) };
    }
    if (Math.abs(w1) > 1e-6) {
      const x = -b / w1;
      return { x1: SX(x), y1: SY(lo), x2: SX(x), y2: SY(hi) };
    }
    return null;
  })();

  return (
    <section id="single-layer-limit" className="scroll-mt-32">
      <SectionTitle
        title="단층 퍼셉트론의 한계"
        subtitle="하나의 층으로는 직선 하나밖에 긋지 못합니다 — 직접 그어 보세요"
      />

      <Sourced
        refs={{
          slides: "1. 단층 퍼셉트론의 한계 — 선형 함수로 표현되는 결정경계로 국한되는 학습 능력",
          lecture: "XOR은 어떻게 경계를 형성하더라도 완전하게 분리해낼 수 있는 경계가 존재하지 않는다",
        }}
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <Card className="min-w-0">
            <CardTitle>가중치와 바이어스를 움직여 경계를 옮겨 보기</CardTitle>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              {(Object.keys(GATES) as GateKey[]).map((k) => (
                <Chip2 key={k} active={gate === k} onClick={() => setGate(k)}>
                  {GATES[k].label} 문제
                </Chip2>
              ))}
              <button
                type="button"
                onClick={() => {
                  setW1(OR_PRESET.w1);
                  setW2(OR_PRESET.w2);
                  setB(OR_PRESET.b);
                }}
                className="rounded-full px-2 py-1 text-[11px] font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              >
                강의록 값으로
              </button>
            </div>

            <div className="space-y-2.5">
              <Slider2
                label="w₁"
                value={w1}
                min={-2}
                max={2}
                step={0.1}
                onChange={setW1}
                display={fmt(w1, 1)}
              />
              <Slider2
                label="w₂"
                value={w2}
                min={-2}
                max={2}
                step={0.1}
                onChange={setW2}
                display={fmt(w2, 1)}
              />
              <Slider2
                label="b (바이어스)"
                value={b}
                min={-2}
                max={2}
                step={0.1}
                onChange={setB}
                display={fmt(b, 1)}
              />
            </div>

            <F className="mt-3" note="가중합이 0 이상이면 출력 1, 아니면 0 — 계단 함수">
              {fmt(w1, 1)}·x₁ + {fmt(w2, 1)}·x₂ + ({fmt(b, 1)}) = 0
            </F>

            <div
              className={`mt-3 rounded-lg p-3 text-center text-sm font-bold ${
                hit === 4
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
              }`}
            >
              네 점 중 {hit}개 일치
              {gate === "XOR" && hit < 4 && (
                <span className="ml-1 font-normal">— 직선 하나로는 4개를 맞출 수 없습니다</span>
              )}
            </div>
          </Card>

          <Card className="min-w-0">
            <CardTitle>{GATES[gate].label} — 입력 공간과 결정경계</CardTitle>
            <Scroller>
              <svg viewBox="0 0 230 215" className="h-auto w-full min-w-[260px]" role="img">
                {/* 값과 글자를 나눠 넣으면 서버 HTML에 주석 구분자가 들어가는데,
                    <title>은 원문 그대로 읽히는 요소라 브라우저에서는 글자 하나로 합쳐져
                    하이드레이션이 어긋난다. 한 문자열로 만들어 넣는다. */}
                <title>{`${GATES[gate].label} 문제의 입력 공간과 단층 퍼셉트론의 결정경계`}</title>
                {/* 1 출력 영역을 옅게 칠한다 */}
                <defs>
                  <clipPath id="dl2-sl-clip">
                    <rect x="0" y="0" width="200" height="200" />
                  </clipPath>
                </defs>
                <rect
                  x="0"
                  y="0"
                  width="200"
                  height="200"
                  className="fill-gray-50 dark:fill-gray-800/50"
                />
                {line && (
                  <g clipPath="url(#dl2-sl-clip)">
                    <line
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      strokeWidth="2"
                      strokeDasharray="5 3"
                      className="stroke-indigo-500"
                    />
                  </g>
                )}
                {/* 축 */}
                <line x1={SX(-0.4)} y1={SY(0)} x2={SX(1.6)} y2={SY(0)} className="stroke-gray-400" />
                <line x1={SX(0)} y1={SY(-0.4)} x2={SX(0)} y2={SY(1.6)} className="stroke-gray-400" />
                <text x={SX(1.5)} y={SY(0) + 14} className="fill-gray-500 text-[9px]">
                  x₁
                </text>
                <text x={SX(0) - 14} y={SY(1.5)} className="fill-gray-500 text-[9px]">
                  x₂
                </text>

                {results.map((p) => {
                  const cx = SX(p.x1);
                  const cy = SY(p.x2);
                  const ok = p.out === p.target;
                  return (
                    <g key={p.name}>
                      {p.target === 1 ? (
                        <g>
                          <line
                            x1={cx - 6}
                            y1={cy - 6}
                            x2={cx + 6}
                            y2={cy + 6}
                            strokeWidth="3"
                            className={ok ? "stroke-indigo-500" : "stroke-rose-500"}
                          />
                          <line
                            x1={cx - 6}
                            y1={cy + 6}
                            x2={cx + 6}
                            y2={cy - 6}
                            strokeWidth="3"
                            className={ok ? "stroke-indigo-500" : "stroke-rose-500"}
                          />
                        </g>
                      ) : (
                        <circle
                          cx={cx}
                          cy={cy}
                          r="6"
                          strokeWidth="2.5"
                          fill="none"
                          className={ok ? "stroke-indigo-500" : "stroke-rose-500"}
                        />
                      )}
                      <text x={cx + 9} y={cy - 7} className="fill-gray-500 text-[9px]">
                        {p.name}
                      </text>
                    </g>
                  );
                })}

                <g transform="translate(206, 24)">
                  <circle cx="4" cy="-4" r="5" strokeWidth="2" fill="none" className="stroke-gray-500" />
                  <text x="12" y="-1" className="fill-gray-500 text-[8px]">
                    레이블 0
                  </text>
                  <line x1="0" y1="12" x2="8" y2="20" strokeWidth="2.5" className="stroke-gray-500" />
                  <line x1="0" y1="20" x2="8" y2="12" strokeWidth="2.5" className="stroke-gray-500" />
                  <text x="12" y="19" className="fill-gray-500 text-[8px]">
                    레이블 1
                  </text>
                </g>
              </svg>
            </Scroller>

            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {results.map((p) => (
                <Cell
                  key={p.name}
                  label={
                    <span className="inline-flex items-center gap-1">
                      {p.out === p.target ? (
                        <CheckCircle2 size={9} className="text-emerald-500" />
                      ) : (
                        <XCircle size={9} className="text-rose-500" />
                      )}
                      ({p.x1}, {p.x2})
                    </span>
                  }
                  value={`${p.out} / ${p.target}`}
                  highlight={p.out === p.target}
                />
              ))}
            </div>
            <Hint>
              칸의 값은 <strong>퍼셉트론 출력 / 레이블</strong>입니다. 빨간 표시는 틀린 점입니다.
            </Hint>
          </Card>
        </div>
      </Sourced>
    </section>
  );
}
