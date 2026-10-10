"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ComputedNote, Formula, Hint, Scroller, Slider } from "./ui";
import { findMinima, fmt, lmE, lmRun, type LmMethod } from "./nets";

const STEPS = 400;
const TOL = 0.3;

interface MethodDef {
  key: string;
  label: string;
  color: string;
  method: LmMethod;
  eta: number;
  decay: number;
  note: string;
}

const METHODS: MethodDef[] = [
  {
    key: "small",
    label: "학습률 고정 η = 0.08",
    color: "#dc2626",
    method: "fixed",
    eta: 0.08,
    decay: 1,
    note: "기본 기울기 강하 — 가장 가까운 극소로 내려가 멈춘다",
  },
  {
    key: "big",
    label: "학습률 고정 η = 1.0",
    color: "#f59e0b",
    method: "fixed",
    eta: 1,
    decay: 1,
    note: "수정폭이 커서 한 극소에 머무르지 못하고 계속 흔들린다",
  },
  {
    key: "anneal",
    label: "시뮬레이티드 어닐링 η₀ = 1.0, 한 걸음마다 ×0.99",
    color: "#65a30d",
    method: "anneal",
    eta: 1,
    decay: 0.99,
    note: "처음에는 크게, 점차적으로 줄여 간다",
  },
  {
    key: "sgd",
    label: "확률적 기울기 강하 η = 0.08",
    color: "#2563eb",
    method: "stochastic",
    eta: 0.08,
    decay: 1,
    note: "한 번에 하나의 샘플만 사용 — 샘플마다 기울기가 달라 흔들린다",
  },
];

const W = 460;
const H = 210;
const PAD = { l: 34, r: 12, t: 14, b: 28 };
const X_MIN = -5.4;
const X_MAX = 5.4;

export default function LocalMinimaLab() {
  const [start, setStart] = useState(3.5);
  const [spread, setSpread] = useState(1.8);

  const minima = useMemo(() => findMinima(-5.5, 5.5, 0.001), []);
  const global = useMemo(
    () => minima.reduce((p, c) => (c.e < p.e ? c : p), minima[0]),
    [minima],
  );

  const runs = useMemo(
    () =>
      METHODS.map((m) => ({
        def: m,
        path: lmRun(start, m.method, {
          eta: m.eta,
          decay: m.decay,
          steps: STEPS,
          samples: 12,
          spread,
          seed: 11,
        }),
      })),
    [start, spread],
  );

  const rates = useMemo(() => {
    const starts: number[] = [];
    for (let t = -5; t <= 5.0001; t += 0.1) starts.push(Number(t.toFixed(1)));
    return METHODS.map((m) => {
      let hit = 0;
      for (const t0 of starts) {
        const path = lmRun(t0, m.method, {
          eta: m.eta,
          decay: m.decay,
          steps: STEPS,
          samples: 12,
          spread,
          seed: 11 + Math.round(t0 * 10),
        });
        const end = path[path.length - 1];
        if (Math.abs(end - global.t) < TOL) hit += 1;
      }
      return { key: m.key, hit, total: starts.length };
    });
  }, [spread, global.t]);

  const eMin = -0.6;
  const eMax = 4.2;
  const pxRaw = (t: number) => PAD.l + ((t - X_MIN) / (X_MAX - X_MIN)) * (W - PAD.l - PAD.r);
  const pyRaw = (e: number) => H - PAD.b - ((Math.min(e, eMax) - eMin) / (eMax - eMin)) * (H - PAD.t - PAD.b);
  const px = (v: number) => Math.round(pxRaw(v) * 100) / 100;
  const py = (v: number) => Math.round(pyRaw(v) * 100) / 100;

  const curve = useMemo(() => {
    const pts: string[] = [];
    for (let t = X_MIN; t <= X_MAX; t += 0.02) pts.push(`${px(t)},${py(lmE(t))}`);
    return pts.join(" ");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id="local-minima" className="scroll-mt-32">
      <SectionTitle
        title="지역 극소 — 기울기 강하 학습법의 근본적인 문제"
        subtitle="극소가 여러 개인 오차함수를 실제로 내려가 보며 회피 대안의 효과를 셉니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "12.2.1 지역 극소",
            slides: "(1) 지역 극소 local minima",
          }}
        >
          <Card>
            <CardTitle>무엇이 문제인가</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              지역 극소(local minima) 문제는 기울기 강하 학습법의 <strong>근본적인 문제</strong>로, 오차가 충분히
              작지 않은 지역 극소에서 학습이 멈춤으로써 원하는 결과를 얻지 못하고 학습이 실패하는 경우입니다. 이
              문제는 <strong>근본적인 해결이 불가능</strong>하지만, 이를 피할 수 있는 대안으로 다음 두 가지를
              사용합니다.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-lime-200 bg-lime-50/60 p-3 dark:border-lime-900 dark:bg-lime-950/30">
                <p className="text-[12.5px] font-bold text-lime-800 dark:text-lime-200">
                  시뮬레이티드 어닐링
                </p>
                <p className="mt-1 text-[11.5px] leading-5 text-gray-700 dark:text-gray-200">
                  수정폭(학습률 η)을 처음에는 크게 설정하고 점차적으로 줄여 가는 방법.
                </p>
              </div>
              <div className="rounded-lg border border-lime-200 bg-lime-50/60 p-3 dark:border-lime-900 dark:bg-lime-950/30">
                <p className="text-[12.5px] font-bold text-lime-800 dark:text-lime-200">
                  확률적 기울기 강하 학습법
                </p>
                <p className="mt-1 text-[11.5px] leading-5 text-gray-700 dark:text-gray-200">
                  한 번에 하나의 샘플만 사용해서 학습을 진행하는 방법. 10강에서 본 온라인 학습법이 그대로 여기서
                  지역 극소를 피하는 수단이 된다.
                </p>
              </div>
            </div>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "12.2.1 — 지역 극소와 전역 극소", slides: "(1) 지역 극소 — 회피 대안" }}>
          <Card>
            <CardTitle>극소가 여섯 개인 오차함수를 직접 내려가 보기</CardTitle>

            <Formula note="이 페이지에서 정한 예시 오차함수 — 극소가 여러 개가 되도록 이차함수에 물결을 더했다">
              E(θ) = 0.15θ² + 0.5·cos(3θ) + 0.06θ
            </Formula>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_230px]">
              <Scroller>
                <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[420px]">
                  <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="#cbd5e1" />
                  <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} stroke="#cbd5e1" />
                  {[0, 1, 2, 3, 4].map((v) => (
                    <g key={v}>
                      <line x1={PAD.l - 3} y1={py(v)} x2={PAD.l} y2={py(v)} stroke="#cbd5e1" />
                      <text x={PAD.l - 5} y={py(v) + 3} fontSize="8" textAnchor="end" fill="#94a3b8">
                        {v}
                      </text>
                    </g>
                  ))}
                  <polyline points={curve} fill="none" stroke="#475569" strokeWidth={1.6} />
                  {minima.map((m) => (
                    <g key={m.t}>
                      <circle
                        cx={px(m.t)}
                        cy={py(m.e)}
                        r={m === global ? 5 : 3.5}
                        fill={m === global ? "#65a30d" : "#f87171"}
                      />
                      <text
                        x={px(m.t)}
                        y={py(m.e) + 15}
                        fontSize="8"
                        textAnchor="middle"
                        fill={m === global ? "#4d7c0f" : "#ef4444"}
                      >
                        {m === global ? "전역" : "지역"}
                      </text>
                    </g>
                  ))}
                  {runs.map((r) => {
                    const end = r.path[r.path.length - 1];
                    return (
                      <g key={r.def.key}>
                        <circle cx={px(end)} cy={py(lmE(end))} r={4.5} fill="none" stroke={r.def.color} strokeWidth={2} />
                      </g>
                    );
                  })}
                  <line
                    x1={px(start)}
                    y1={PAD.t}
                    x2={px(start)}
                    y2={H - PAD.b}
                    stroke="#0f172a"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                  <text x={px(start)} y={PAD.t + 9} fontSize="8.5" textAnchor="middle" fill="#0f172a">
                    시작
                  </text>
                  <text x={W - PAD.r} y={H - 6} fontSize="9" textAnchor="end" fill="#94a3b8">
                    θ
                  </text>
                  <text x={PAD.l + 4} y={PAD.t + 9} fontSize="9" fill="#94a3b8">
                    E(θ)
                  </text>
                </svg>
              </Scroller>

              <div className="space-y-3">
                <Slider
                  label="시작 위치 θ⁽⁰⁾"
                  value={start}
                  min={-5}
                  max={5}
                  step={0.1}
                  onChange={setStart}
                  display={fmt(start, 1)}
                />
                <Slider
                  label="샘플마다의 기울기 차이"
                  value={spread}
                  min={0.4}
                  max={2.2}
                  step={0.2}
                  onChange={setSpread}
                  display={fmt(spread, 1)}
                />
                <Hint>
                  두 번째 슬라이더는 확률적 기울기 강하에만 영향을 줍니다. 샘플마다의 오차함수를 조금씩 다르게
                  두되, 그 평균은 언제나 위 그래프의 E(θ)와 정확히 같도록 맞췄습니다.
                </Hint>
              </div>
            </div>

            <Scroller>
              <table className="mt-4 w-full min-w-[520px] text-[11.5px]">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                    <th className="px-2 py-1.5 font-semibold">방법</th>
                    <th className="px-2 py-1.5 font-semibold">{STEPS}걸음 뒤 θ</th>
                    <th className="px-2 py-1.5 font-semibold">그때의 오차</th>
                    <th className="px-2 py-1.5 font-semibold">마지막 20걸음의 변동폭</th>
                    <th className="px-2 py-1.5 font-semibold">전역 극소 도달</th>
                    <th className="px-2 py-1.5 font-semibold">시작점 101곳 중 전역 도달</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((r) => {
                    const end = r.path[r.path.length - 1];
                    const ok = Math.abs(end - global.t) < TOL;
                    const rate = rates.find((x) => x.key === r.def.key)!;
                    const tail = r.path.slice(-20);
                    const swing = Math.max(...tail) - Math.min(...tail);
                    return (
                      <tr key={r.def.key} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-2 py-1.5 font-semibold" style={{ color: r.def.color }}>
                          {r.def.label}
                          <span className="block text-[10.5px] font-normal text-gray-500">{r.def.note}</span>
                        </td>
                        <td className="px-2 py-1.5 font-mono">{fmt(end, 3)}</td>
                        <td className="px-2 py-1.5 font-mono">{fmt(lmE(end), 4)}</td>
                        <td
                          className={`px-2 py-1.5 font-mono ${swing > 0.05 ? "text-amber-600" : "text-gray-500"}`}
                        >
                          {fmt(swing, 4)}
                        </td>
                        <td className="px-2 py-1.5">
                          {ok ? (
                            <span className="font-semibold text-lime-700 dark:text-lime-400">도달</span>
                          ) : (
                            <span className="text-rose-600">못 미침</span>
                          )}
                        </td>
                        <td className="px-2 py-1.5 font-mono">
                          {rate.hit} / {rate.total}
                          <span className="ml-1 text-gray-500">
                            ({((100 * rate.hit) / rate.total).toFixed(0)}%)
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Scroller>

            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              전역 극소는 θ = {fmt(global.t, 3)}, E = {fmt(global.e, 4)}입니다. 학습률을 작게 고정하면 시작점에서
              가장 가까운 극소로 곧장 내려가 거기서 멈추므로, 시작점이 어디냐에 따라 결과가 갈립니다. 학습률을
              크게 고정하면 어느 극소에도 자리잡지 못하고 계속 흔들립니다. 처음에는 크게 두었다가 점차 줄이는
              어닐링은 두 성질을 차례로 씁니다 — 큰 수정폭일 때는 얕은 골을 그냥 건너뛰고, 수정폭이 작아진 뒤에
              비로소 자리를 잡습니다. ‘전역 극소 도달’ 칸은 <strong>마지막 걸음의 위치</strong>만 보는 것이므로,
              계속 흔들리는 방법도 우연히 전역 극소 근처에서 끝나면 도달로 표시됩니다. 자리를 잡았는지는 바로
              왼쪽의 변동폭 칸과 맨 오른쪽의 시작점 101곳 집계로 가려야 합니다.
            </p>

            <ComputedNote>
              오차함수와 학습률 값은 이 페이지에서 정한 것입니다. 교재·강의록에는 지역 극소와 전역 극소의 개념도만
              있고 수치 예는 없습니다. 표의 수치는 위 식으로 매 걸음을 직접 계산한 결과입니다.
            </ComputedNote>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
