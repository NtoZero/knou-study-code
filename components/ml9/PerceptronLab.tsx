"use client";

import { useMemo, useState } from "react";
import { ChevronRight, FastForward, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import {
  LOGIC_SETS,
  clipLine,
  errorCount,
  fmt,
  makeScale,
  runPerceptron,
  signed,
  step,
  type Frame,
} from "./nn";

type Task = "AND" | "OR" | "XOR";

const F: Frame = { xMin: -0.4, xMax: 1.4, yMin: -0.4, yMax: 1.4, width: 230, height: 230, pad: 26 };
const s = makeScale(F);

const INIT = { w1: 0, w2: 0, w0: 0 };
const MAX_EPOCHS = 40;

export default function PerceptronLab() {
  const [task, setTask] = useState<Task>("AND");
  const [eta, setEta] = useState(0.5);
  const [cursor, setCursor] = useState(0);

  const data = LOGIC_SETS[task];
  const run = useMemo(() => runPerceptron(data, eta, INIT, MAX_EPOCHS), [data, eta]);

  const total = run.records.length;
  const at = Math.min(cursor, total);
  const current = at > 0 ? run.records[at - 1] : null;
  const state = current ? current.after : INIT;
  const nextRec = at < total ? run.records[at] : null;

  const errs = errorCount(data, state);
  const line = clipLine(state.w1, state.w2, state.w0, F);

  const reset = () => setCursor(0);
  const stepOnce = () => setCursor((c) => Math.min(total, c + 1));
  const runEpoch = () => setCursor((c) => Math.min(total, c + 4));

  const epochChartW = 300;
  const epochChartH = 90;
  /* 돌린 에포크를 모두 그린다 — 아래 문구의 에포크 수와 그림의 가로축이 어긋나지 않게 */
  const maxEpochShown = run.epochErrors.length;

  return (
    <section id="perceptron" className="scroll-mt-32">
      <SectionTitle
        title="11.2.1 M-P 뉴런과 퍼셉트론"
        subtitle="최초의 신경망 모델과 그 학습 규칙 — 식 11-3을 한 패턴씩 직접 적용해 봄"
      />

      {/* ── M-P 뉴런 ── */}
      <Sourced
        refs={{
          textbook: "11.2.1 M-P 뉴런과 퍼셉트론 (식 11-2)",
          slides: "M-P 뉴런",
        }}
        className="mb-4"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">M-P 뉴런 (1943)</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            신경망 연구의 첫 시도. 워런 맥컬록(Warren MaCulloch)과 월터 피츠(Walter Pitts)가 신경세포를
            모방하여 <strong>논리 함수를 구현하는 모델</strong>을 만들기 위해 제안함. 구조는 앞 절의
            기본적인 신경망과 같으며, 활성화 함수로 <strong>계단함수</strong>를 적용함으로써 이진 출력을
            내도록 고안함.
          </p>
          <div className="mt-3 overflow-x-auto rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
            <p className="min-w-[280px] font-mono text-sm">
              yⱼ = φ_step( Σ<sub>i=1</sub>
              <sup>n</sup> wᵢⱼxᵢ + w₀ⱼ )
              <span className="ml-2 text-xs text-gray-500">(식 11-2)</span>
            </p>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            yⱼ는 j번째 출력 뉴런(노드)의 출력값, <strong>w₀는 식 11-1의 θ와 동일한 임계치 역할</strong>을
            하는 것으로 <strong>바이어스(bias)</strong>라고 부름. 즉, 입력의 가중합이 −w₀보다 크지 못하면
            0의 출력을 냄.
          </p>
          <p className="mt-2 rounded-lg bg-slate-100 p-2.5 text-[11px] leading-relaxed text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
            임계치 θ를 식의 오른쪽에서 왼쪽으로 옮겨 쓴 것이 바이어스 w₀ — u ≥ θ 와 u − θ ≥ 0 이 같은
            말이므로, 항상 1이 들어오는 입력 하나를 더 두고 그 가중치를 w₀ = −θ로 두면 임계치를 가중치처럼
            함께 학습할 수 있음.
          </p>
        </div>
      </Sourced>

      {/* ── 퍼셉트론 구조 ── */}
      <Sourced
        refs={{
          textbook: "11.2.1 M-P 뉴런과 퍼셉트론 (그림 11-8)",
          slides: "퍼셉트론 Perceptron",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">퍼셉트론 (Perceptron, 1958)</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            M-P 뉴런을 여러 개 결합하여 네트워크 형태를 갖춘 신경망을 제안한 것이 1958년에 개발된 프랭크
            로젠블랫(Frank Rosenblatt)의 퍼셉트론. 신경세포들의 연결을 통하여 패턴인식을 수행하는 최초의
            기계이며, <strong>단층 전방향 신경망</strong>(single-layer feed forward network) 구조.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {[
              { t: "뉴런", d: "M-P 뉴런 → 계단함수" },
              { t: "연결 구조", d: "단층, 전방향, 완전 연결 (fully-connected)" },
              { t: "학습 규칙", d: "이진 입출력을 사용한 지도학습" },
            ].map((c) => (
              <div key={c.t} className="rounded-lg bg-fuchsia-50 p-3 dark:bg-fuchsia-950/30">
                <p className="text-xs font-bold text-fuchsia-700 dark:text-fuchsia-300">{c.t}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">{c.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            처음 발표되었을 당시 주목을 받았던 가장 큰 이유는 <strong>원하는 패턴을 학습할 수 있는 학습
            능력(가중치 조절 규칙)</strong>을 갖추고 있었기 때문. 학습의 기본 규칙은 “만일 어떤 입력
            뉴런의 활성이 어떤 출력 뉴런이 잘못된 결과를 내는 데 공헌하였다면, 두 신경세포 간의 연결
            가중치를 그것에 비례하여 조절해 주어야 한다”.
          </p>
          <div className="mt-3 overflow-x-auto rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
            <p className="min-w-[300px] font-mono text-sm">
              wᵢⱼ⁽ᵗ⁺¹⁾ = wᵢⱼ⁽ᵗ⁾ + η(tⱼ − yⱼ)xᵢ
              <span className="ml-2 text-xs text-gray-500">(식 11-3)</span>
            </p>
            <div className="mt-2 flex min-w-[300px] gap-5 text-[11px] text-gray-500">
              <span>η — 학습률 (learning rate)</span>
              <span>tⱼ — 목표 출력값</span>
              <span>yⱼ — 실제 출력</span>
            </div>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            목표 출력값과 현재 출력값의 차이에 입력값을 곱하여 이에 비례하는 작은 값으로 가중치를 수정함.
            이렇게 함으로써 목표 출력값을 사용하여 신경망의 학습을 인위적으로 제어할 수 있음.{" "}
            <strong>퍼셉트론은 목표 출력값을 사용하므로 지도학습을 하는 신경망.</strong>
          </p>
        </div>
      </Sourced>

      {/* ── 학습 규칙 단계 실행 ── */}
      <Sourced
        refs={{
          textbook: "11.2.1 M-P 뉴런과 퍼셉트론 (식 11-3)",
          slides: "퍼셉트론 — 학습 규칙",
          lecture: "목표 출력이 0인데 1이 나왔으면 값을 줄이는 쪽으로, 1인데 0이 나왔으면 키우는 쪽으로 가중치가 움직인다고 부호를 따라가며 설명",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">학습 규칙을 한 패턴씩 적용해 보기</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            두 입력과 한 출력을 가지는 퍼셉트론. 바이어스는 항상 1이 들어오는 입력에 대한 가중치 w₀로 두고
            같은 식으로 수정함. 처음 가중치는 모두 0.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex gap-1.5">
              {(["AND", "OR", "XOR"] as Task[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTask(t);
                    setCursor(0);
                  }}
                  className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                    task === t
                      ? "border-fuchsia-500 bg-fuchsia-500 text-white"
                      : "border-gray-200 bg-white text-gray-500 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-900"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <label className="flex min-w-[180px] flex-1 items-center gap-2 text-xs">
              <span className="shrink-0 font-mono font-bold">학습률 η</span>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.1}
                value={eta}
                onChange={(e) => {
                  setEta(Number(e.target.value));
                  setCursor(0);
                }}
                className="min-w-0 flex-1 accent-fuchsia-600"
              />
              <span className="w-8 shrink-0 text-right font-mono">{fmt(eta, 1)}</span>
            </label>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={stepOnce}
              disabled={at >= total}
              className="inline-flex items-center gap-1.5 rounded-lg bg-fuchsia-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-fuchsia-700 disabled:opacity-40"
            >
              <ChevronRight size={14} />
              한 패턴 적용
            </button>
            <button
              type="button"
              onClick={runEpoch}
              disabled={at >= total}
              className="inline-flex items-center gap-1.5 rounded-lg border border-fuchsia-300 px-3 py-1.5 text-sm font-medium text-fuchsia-700 hover:bg-fuchsia-50 disabled:opacity-40 dark:border-fuchsia-800 dark:text-fuchsia-300 dark:hover:bg-fuchsia-950/40"
            >
              <FastForward size={14} />
              한 에포크(4패턴)
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800 dark:border-gray-700 dark:hover:text-gray-200"
            >
              <RotateCcw size={14} />
              처음으로
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,230px)_minmax(0,1fr)]">
            {/* 결정경계 그림 */}
            <div className="overflow-x-auto">
              <svg viewBox={`0 0 ${F.width} ${F.height}`} className="w-full min-w-[220px] rounded-lg border border-gray-100 dark:border-gray-800">
                <rect x={0} y={0} width={F.width} height={F.height} fill="#ffffff" />
                <line x1={s.sx(F.xMin)} y1={s.sy(0)} x2={s.sx(F.xMax)} y2={s.sy(0)} stroke="#e2e8f0" />
                <line x1={s.sx(0)} y1={s.sy(F.yMin)} x2={s.sx(0)} y2={s.sy(F.yMax)} stroke="#e2e8f0" />
                <text x={s.sx(0) - 6} y={s.sy(1) + 3} fontSize="8" textAnchor="end" fill="#94a3b8">
                  1
                </text>
                <text x={s.sx(1)} y={s.sy(0) + 12} fontSize="8" textAnchor="middle" fill="#94a3b8">
                  1
                </text>
                <text x={F.width - 6} y={s.sy(0) - 4} fontSize="8" textAnchor="end" fill="#94a3b8">
                  x₁
                </text>
                <text x={s.sx(0) + 5} y={14} fontSize="8" fill="#94a3b8">
                  x₂
                </text>
                {line && (
                  <line
                    x1={s.sx(line[0][0])}
                    y1={s.sy(line[0][1])}
                    x2={s.sx(line[1][0])}
                    y2={s.sy(line[1][1])}
                    stroke="#a21caf"
                    strokeWidth={2.2}
                  />
                )}
                {data.map((d, i) => {
                  const y = step(state.w1 * d.x1 + state.w2 * d.x2 + state.w0);
                  const wrong = y !== d.t;
                  const isNext = nextRec && nextRec.patternIndex === i;
                  return (
                    <g key={i}>
                      {isNext && <circle cx={s.sx(d.x1)} cy={s.sy(d.x2)} r={12} fill="#fbbf24" opacity={0.3} />}
                      <circle
                        cx={s.sx(d.x1)}
                        cy={s.sy(d.x2)}
                        r={7}
                        fill={d.t === 1 ? "#a21caf" : "#ffffff"}
                        stroke={wrong ? "#dc2626" : "#a21caf"}
                        strokeWidth={wrong ? 3 : 1.8}
                      />
                      <text x={s.sx(d.x1) + 11} y={s.sy(d.x2) - 8} fontSize="8" fill="#64748b">
                        ({d.x1},{d.x2})→{d.t}
                      </text>
                    </g>
                  );
                })}
                <text x={8} y={F.height - 8} fontSize="8" fill="#64748b">
                  ● t = 1 · ○ t = 0 · 빨간 테두리 = 지금 틀린 패턴
                </text>
              </svg>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800/60">
                  <p className="text-[10px] text-gray-500">적용한 수정 횟수</p>
                  <p className="font-mono text-base font-bold">
                    {at} / {total}
                  </p>
                </div>
                <div
                  className={`rounded-lg p-2 ${
                    errs === 0 ? "bg-emerald-50 dark:bg-emerald-950/40" : "bg-rose-50 dark:bg-rose-950/30"
                  }`}
                >
                  <p className="text-[10px] text-gray-500">현재 오분류</p>
                  <p
                    className={`font-mono text-base font-bold ${
                      errs === 0 ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"
                    }`}
                  >
                    {errs} / 4
                  </p>
                </div>
              </div>
            </div>

            {/* 계산 과정 */}
            <div>
              <div className="overflow-x-auto rounded-lg bg-gray-50 p-3 font-mono text-[11px] leading-6 dark:bg-gray-800/60">
                <p className="min-w-[320px] font-bold">
                  지금 가중치 — w₁ = {fmt(state.w1, 2)}, w₂ = {fmt(state.w2, 2)}, w₀ = {fmt(state.w0, 2)}
                </p>
                {current ? (
                  <>
                    <p className="min-w-[320px] text-gray-500">
                      방금 적용 — 에포크 {current.epoch}, 패턴 ({current.x1}, {current.x2}), t = {current.t}
                    </p>
                    <p className="min-w-[320px]">
                      u = {fmt(current.before.w1, 2)}×{current.x1} + {fmt(current.before.w2, 2)}×{current.x2} +{" "}
                      {fmt(current.before.w0, 2)} = {fmt(current.u, 2)} → y = {current.y}
                    </p>
                    <p className={`min-w-[320px] ${current.changed ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                      η(t − y) = {fmt(eta, 2)}×({current.t} − {current.y}) = {fmt(current.delta, 2)}
                      {current.changed ? " → 가중치 수정" : " → 맞혔으므로 변화 없음"}
                    </p>
                    <p className="min-w-[320px]">
                      w₁ ← {fmt(current.before.w1, 2)} {signed(current.delta * current.x1, 2)} ={" "}
                      {fmt(current.after.w1, 2)}
                    </p>
                    <p className="min-w-[320px]">
                      w₂ ← {fmt(current.before.w2, 2)} {signed(current.delta * current.x2, 2)} ={" "}
                      {fmt(current.after.w2, 2)}
                    </p>
                    <p className="min-w-[320px]">
                      w₀ ← {fmt(current.before.w0, 2)} {signed(current.delta, 2)} = {fmt(current.after.w0, 2)}
                    </p>
                  </>
                ) : (
                  <p className="min-w-[320px] text-gray-500">
                    아직 아무 패턴도 적용하지 않음. 모든 가중치가 0이므로 u = 0 ≥ 0 → 네 패턴 모두 y = 1.
                  </p>
                )}
                {nextRec && (
                  <p className="min-w-[320px] text-amber-600 dark:text-amber-400">
                    다음 차례 — ({nextRec.x1}, {nextRec.x2}), t = {nextRec.t}
                  </p>
                )}
              </div>

              {/* 에포크별 오분류 */}
              <div className="mt-3 overflow-x-auto">
                <p className="mb-1 text-[11px] font-bold text-gray-500">에포크별 오분류 개수</p>
                <svg viewBox={`0 0 ${epochChartW} ${epochChartH}`} className="w-full min-w-[280px] max-w-[420px]">
                  <line x1={22} y1={epochChartH - 18} x2={epochChartW - 6} y2={epochChartH - 18} stroke="#cbd5e1" />
                  <line x1={22} y1={6} x2={22} y2={epochChartH - 18} stroke="#cbd5e1" />
                  {[0, 2, 4].map((v) => (
                    <text key={v} x={18} y={epochChartH - 18 - (v / 4) * (epochChartH - 28) + 3} fontSize="7" textAnchor="end" fill="#94a3b8">
                      {v}
                    </text>
                  ))}
                  {run.epochErrors.slice(0, maxEpochShown).map((e, i) => {
                    const bw = (epochChartW - 34) / maxEpochShown;
                    const h = (e / 4) * (epochChartH - 28);
                    const doneHere = at >= (i + 1) * 4;
                    return (
                      <rect
                        key={i}
                        x={24 + i * bw}
                        y={epochChartH - 18 - h}
                        width={Math.max(2, bw - 2)}
                        height={h}
                        fill={e === 0 ? "#16a34a" : "#a21caf"}
                        opacity={doneHere ? 0.95 : 0.3}
                      />
                    );
                  })}
                  <text x={epochChartW - 6} y={epochChartH - 5} fontSize="7" textAnchor="end" fill="#94a3b8">
                    에포크 →
                  </text>
                </svg>
              </div>

              <p
                className={`mt-2 rounded-lg p-3 text-xs leading-relaxed ${
                  run.convergedEpoch
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                    : "bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-200"
                }`}
              >
                {run.convergedEpoch ? (
                  <>
                    <strong>{task}는 {run.convergedEpoch}번째 에포크에서 오분류 0에 도달</strong> — 직선 하나로
                    나눌 수 있는 문제이므로 학습 규칙이 유한 번 만에 멈춤.
                  </>
                ) : (
                  <>
                    <strong>{task}는 {run.epochErrors.length}에포크를 돌려도 오분류 0에 도달하지 못함</strong> — 가중치가
                    같은 값으로 되돌아오는 순환에 빠져 네 패턴을 모두 맞히는 상태에 들어가지 못함. 학습률을
                    바꿔도 결과는 같음. 이유는 아래 XOR 문제에서.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </Sourced>
    </section>
  );
}
