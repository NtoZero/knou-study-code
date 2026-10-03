"use client";

import { useEffect, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, ComputedNote, Hint, Scroller, Slider } from "./ui";
import {
  batchStep,
  cloneMlp,
  fmt,
  initMlp,
  meanSquaredError,
  mulberry32,
  onlineStep,
  shuffled,
  type Sample,
} from "./mlpCore";

const N = 60;
const EPOCHS = 200;

const MODES = [
  {
    key: "online" as const,
    label: "온라인 모드",
    color: "#0284c7",
    rule: "각 데이터에 대해서 가중치 수정",
    count: "N개의 데이터 → N번의 가중치 수정",
    trait: "오차 감소 속도는 빠르나 학습이 불안정적",
  },
  {
    key: "batch" as const,
    label: "배치 모드",
    color: "#16a34a",
    rule: "N개의 모든 데이터에 대한 오차를 모두 더한 후 한 번의 가중치 수정",
    count: "N개의 데이터 → 1번의 가중치 수정",
    trait: "오차 감소 속도는 느리나 학습은 안정적",
  },
  {
    key: "mini" as const,
    label: "미니 배치 모드",
    color: "#d97706",
    rule: "데이터를 작은 부분집합으로 나누고, 각 부분집합은 배치 모드로 처리",
    count: "N개를 m개의 그룹으로 나눔 → m번의 가중치 수정",
    trait: "데이터 규모가 큰 경우에 적합 — 두 모드의 장단점을 상호 보완",
  },
];

type ModeKey = (typeof MODES)[number]["key"];

function makeData(): Sample[] {
  const rng = mulberry32(3);
  const data: Sample[] = [];
  for (let i = 0; i < N; i += 1) {
    const x1 = rng() * 2 - 1;
    const x2 = rng() * 2 - 1;
    data.push({ x: [x1, x2], t: x2 > 0.6 * Math.sin(3 * x1) ? [1, 0] : [0, 1] });
  }
  return data;
}

interface Run {
  curve: number[];
  updates: number;
  rises: number;
}

function train(eta: number, miniSize: number): Record<ModeKey, Run> {
  const data = makeData();
  const base = initMlp(2, 6, 2, mulberry32(99), { scale: 0.6 });
  const out = {} as Record<ModeKey, Run>;
  for (const mode of MODES) {
    const net = cloneMlp(base);
    const rng = mulberry32(5);
    const curve: number[] = [];
    let updates = 0;
    for (let ep = 0; ep < EPOCHS; ep += 1) {
      if (mode.key === "online") {
        for (const s of shuffled(data, rng)) {
          onlineStep(net, s, eta);
          updates += 1;
        }
      } else if (mode.key === "batch") {
        batchStep(net, data, eta);
        updates += 1;
      } else {
        const sh = shuffled(data, rng);
        for (let i = 0; i < sh.length; i += miniSize) {
          batchStep(net, sh.slice(i, i + miniSize), eta);
          updates += 1;
        }
      }
      curve.push(meanSquaredError(net, data));
    }
    let rises = 0;
    for (let i = 1; i < curve.length; i += 1) if (curve[i] > curve[i - 1]) rises += 1;
    out[mode.key] = { curve, updates, rises };
  }
  return out;
}

const W = 440;
const H = 190;
const PAD = { l: 38, r: 12, t: 14, b: 26 };
const Y_MAX = 0.27;
const px = (e: number) => PAD.l + (e / (EPOCHS - 1)) * (W - PAD.l - PAD.r);
const py = (v: number) => H - PAD.b - (Math.min(v, Y_MAX) / Y_MAX) * (H - PAD.t - PAD.b);

export default function LearningModes() {
  const [eta, setEta] = useState(1);
  const [miniSize, setMiniSize] = useState(10);
  const [shown, setShown] = useState<ModeKey[]>(["online", "batch", "mini"]);
  const [runs, setRuns] = useState<Record<ModeKey, Run> | null>(null);

  useEffect(() => {
    setRuns(train(eta, miniSize));
  }, [eta, miniSize]);

  const toggle = (k: ModeKey) =>
    setShown((prev) => (prev.includes(k) ? prev.filter((v) => v !== k) : [...prev, k]));

  return (
    <section id="learning-modes" className="scroll-mt-32">
      <SectionTitle
        title="학습 모드의 결정 — 온라인 · 배치 · 미니 배치"
        subtitle="같은 데이터, 같은 초기 가중치로 세 모드를 실제로 학습시켜 비교합니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "11.3.3 다층 퍼셉트론의 학습 전략 — 학습 모드의 설정",
            slides: "MLP의 학습 전략 — 학습 모드의 결정",
          }}
        >
          <Card>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {MODES.map((m) => (
                <div key={m.key} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <p className="text-[12.5px] font-bold" style={{ color: m.color }}>
                    {m.label}
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-gray-700 dark:text-gray-200">{m.rule}</p>
                  <p className="mt-1.5 rounded bg-gray-50 px-2 py-1 font-mono text-[10.5px] text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {m.count}
                  </p>
                  <p className="mt-1.5 text-[11px] leading-5 text-gray-500 dark:text-gray-400">{m.trait}</p>
                </div>
              ))}
            </div>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "11.3.3 — 학습 모드의 설정", slides: "MLP의 학습 전략 — 학습 모드의 결정" }}>
          <Card>
            <CardTitle>세 모드를 같은 조건에서 돌려 보기</CardTitle>
            <div className="mb-3 flex flex-wrap gap-2">
              {MODES.map((m) => (
                <Chip key={m.key} active={shown.includes(m.key)} onClick={() => toggle(m.key)}>
                  {m.label}
                </Chip>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
              <Scroller>
                {!runs ? (
                  <p className="py-16 text-center text-xs text-gray-400">학습 중…</p>
                ) : (
                  <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[400px]">
                    <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="#cbd5e1" />
                    <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} stroke="#cbd5e1" />
                    {[0, 0.05, 0.1, 0.15, 0.2, 0.25].map((v) => (
                      <g key={v}>
                        <line x1={PAD.l - 3} y1={py(v)} x2={PAD.l} y2={py(v)} stroke="#cbd5e1" />
                        <text x={PAD.l - 5} y={py(v) + 3} fontSize="8" textAnchor="end" fill="#94a3b8">
                          {v.toFixed(2)}
                        </text>
                      </g>
                    ))}
                    {MODES.filter((m) => shown.includes(m.key)).map((m) => (
                      <polyline
                        key={m.key}
                        points={runs[m.key].curve.map((v, i) => `${px(i)},${py(v)}`).join(" ")}
                        fill="none"
                        stroke={m.color}
                        strokeWidth={1.8}
                      />
                    ))}
                    <text x={W - PAD.r} y={H - 5} fontSize="9" textAnchor="end" fill="#94a3b8">
                      학습 에포크 수
                    </text>
                    <text x={PAD.l + 4} y={PAD.t + 9} fontSize="9" fill="#94a3b8">
                      E(X, θ)
                    </text>
                  </svg>
                )}
              </Scroller>

              <div className="space-y-3">
                <Slider label="학습률 η" value={eta} min={0.2} max={4} step={0.2} onChange={setEta} display={fmt(eta, 1)} />
                <Slider
                  label="미니 배치 크기"
                  value={miniSize}
                  min={5}
                  max={30}
                  step={5}
                  onChange={setMiniSize}
                  display={`${miniSize}개 (그룹 ${Math.ceil(N / miniSize)}개)`}
                />
                <Hint>
                  데이터 {N}개, 입력 2 · 은닉 6 · 출력 2의 다층 퍼셉트론, 활성화 함수는 모두 시그모이드,
                  초기 가중치는 세 모드가 완전히 같습니다. {EPOCHS} 에포크를 돌립니다.
                </Hint>
              </div>
            </div>

            {runs && (
              <Scroller>
                <table className="mt-4 w-full min-w-[460px] text-[11.5px]">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                      <th className="px-2 py-1.5 font-semibold">모드</th>
                      <th className="px-2 py-1.5 font-semibold">가중치 수정 횟수</th>
                      <th className="px-2 py-1.5 font-semibold">20 에포크 오차</th>
                      <th className="px-2 py-1.5 font-semibold">{EPOCHS} 에포크 오차</th>
                      <th className="px-2 py-1.5 font-semibold">오차가 늘어난 에포크</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MODES.map((m) => (
                      <tr key={m.key} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-2 py-1.5 font-semibold" style={{ color: m.color }}>
                          {m.label}
                        </td>
                        <td className="px-2 py-1.5 font-mono">{runs[m.key].updates.toLocaleString()}</td>
                        <td className="px-2 py-1.5 font-mono">{fmt(runs[m.key].curve[19], 4)}</td>
                        <td className="px-2 py-1.5 font-mono">
                          {fmt(runs[m.key].curve[EPOCHS - 1], 4)}
                        </td>
                        <td className="px-2 py-1.5 font-mono">
                          {runs[m.key].rises} / {EPOCHS - 1}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Scroller>
            )}

            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              마지막 열이 교재가 말하는 <strong>안정성</strong>입니다. 온라인 모드는 데이터 하나하나에
              반응해 가중치를 고치므로 전체 오차가 중간중간 다시 커지는 에포크가 많고, 배치 모드는 모든
              데이터의 오차를 합해 한 번만 고치므로 오차가 거의 단조롭게 줄어듭니다. 대신 같은 에포크
              수에서 오차가 줄어든 정도는 온라인 모드 쪽이 큽니다. 미니 배치는 그 사이에 놓입니다.
            </p>

            <ComputedNote>
              이 실험의 데이터와 수치는 이 페이지에서 직접 학습시켜 얻은 값으로, 교재·강의록에는 세 모드의
              설명만 있고 비교 수치는 없습니다. 모드별 가중치 수정 횟수는 정의에서 바로 나오는 값입니다.
            </ComputedNote>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
