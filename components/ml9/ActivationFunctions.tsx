"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { ACTIVATIONS, fmt, makeScale, pathOf, type ActId, type Frame } from "./nn";

const F: Frame = { xMin: -3, xMax: 3, yMin: -1.4, yMax: 1.4, width: 160, height: 120, pad: 12 };
const s = makeScale(F);

/** 작은 그래프 하나 — 실제 함수값을 샘플링해 그린다 */
function MiniPlot({
  f,
  color,
  showDerivative,
  df,
  probe,
}: {
  f: (u: number) => number;
  color: string;
  showDerivative: boolean;
  df?: (u: number) => number;
  probe: number;
}) {
  const y = f(probe);
  const yc = Math.max(F.yMin, Math.min(F.yMax, y));
  return (
    <svg viewBox={`0 0 ${F.width} ${F.height}`} className="w-full">
      <rect x={0} y={0} width={F.width} height={F.height} fill="#ffffff" />
      {/* 눈금선 */}
      {[-1, 1].map((v) => (
        <line key={v} x1={s.sx(F.xMin)} y1={s.sy(v)} x2={s.sx(F.xMax)} y2={s.sy(v)} stroke="#f1f5f9" />
      ))}
      <line x1={s.sx(F.xMin)} y1={s.sy(0)} x2={s.sx(F.xMax)} y2={s.sy(0)} stroke="#cbd5e1" />
      <line x1={s.sx(0)} y1={s.sy(F.yMin)} x2={s.sx(0)} y2={s.sy(F.yMax)} stroke="#cbd5e1" />
      <text x={s.sx(0) - 4} y={s.sy(1) + 3} fontSize="7" textAnchor="end" fill="#94a3b8">
        1
      </text>
      <text x={s.sx(0) - 4} y={s.sy(-1) + 3} fontSize="7" textAnchor="end" fill="#94a3b8">
        −1
      </text>
      <text x={s.sx(0) + 4} y={s.sy(0) + 9} fontSize="7" fill="#94a3b8">
        0
      </text>
      <text x={F.width - 4} y={s.sy(0) - 3} fontSize="7" textAnchor="end" fill="#94a3b8">
        u
      </text>
      {showDerivative && df && (
        <path d={pathOf(df, F, 400, 0.6)} fill="none" stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="3 2" />
      )}
      <path d={pathOf(f, F)} fill="none" stroke={color} strokeWidth="2.2" />
      <line x1={s.sx(probe)} y1={s.sy(F.yMin)} x2={s.sx(probe)} y2={s.sy(F.yMax)} stroke="#e2e8f0" />
      <circle cx={s.sx(probe)} cy={s.sy(yc)} r={3.5} fill={color} stroke="#fff" strokeWidth={1} />
    </svg>
  );
}

export default function ActivationFunctions() {
  const [probe, setProbe] = useState(0.8);
  const [showDerivative, setShowDerivative] = useState(false);
  const [overlay, setOverlay] = useState<ActId[]>(["sigmoid", "tanh", "relu"]);

  const toggleOverlay = (id: ActId) =>
    setOverlay((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const BIG: Frame = { xMin: -4, xMax: 4, yMin: -1.5, yMax: 1.8, width: 360, height: 220, pad: 18 };
  const bs = makeScale(BIG);

  return (
    <section id="activation" className="scroll-mt-32">
      <SectionTitle
        title="활성화 함수 6종"
        subtitle="하나의 뉴런의 특성을 결정하는 함수 — 곡선은 모두 정의식으로 직접 계산해 그림"
      />

      <Sourced
        refs={{
          textbook: "11.1.3 신경망의 구성 요소 (그림 11-3)",
          slides: "신경망의 구성 요소 ① 인공 신경세포 — 활성화 함수",
          lecture: "계단·부호·선형·시그모이드·하이퍼탄젠트·ReLU 이 여섯 가지 이름과 식은 꼭 기억해 두라고 짚으며, 어떤 활성화 함수를 쓰느냐에 따라 신경세포의 특성이 달라진다고 정리",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold">여섯 가지 활성화 함수</h3>
              <p className="mt-1 text-xs text-gray-500">
                세로 점선이 지금 보는 u 값. 각 그래프의 점은 그 u에서의 실제 함숫값.
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs font-medium">
              <input
                type="checkbox"
                checked={showDerivative}
                onChange={(e) => setShowDerivative(e.target.checked)}
                className="accent-fuchsia-600"
              />
              도함수 φ′(u) 겹쳐 보기
            </label>
          </div>

          <label className="mt-4 flex items-center gap-3 text-sm">
            <span className="shrink-0 font-mono font-bold">u</span>
            <input
              type="range"
              min={-3}
              max={3}
              step={0.1}
              value={probe}
              onChange={(e) => setProbe(Number(e.target.value))}
              className="min-w-0 flex-1 accent-fuchsia-600"
            />
            <span className="w-12 shrink-0 text-right font-mono">{fmt(probe, 1)}</span>
          </label>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ACTIVATIONS.map((a) => (
              <div
                key={a.id}
                className="rounded-xl border border-gray-200 p-3 dark:border-gray-700"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-bold" style={{ color: a.color }}>
                    {a.name}
                  </p>
                  <span className="text-[10px] text-gray-400">{a.en}</span>
                </div>
                <div className="mt-1 overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800">
                  <MiniPlot f={a.f} color={a.color} showDerivative={showDerivative} df={a.df} probe={probe} />
                </div>
                <p className="mt-2 break-words font-mono text-[11px] leading-5 text-gray-700 dark:text-gray-300">
                  {a.expr}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    출력 범위 {a.range}
                  </span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      a.differentiable
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                    }`}
                  >
                    {a.differentiable ? "미분 가능" : "미분 불가"}
                  </span>
                </div>
                <p className="mt-1.5 font-mono text-[10px] text-gray-500">
                  φ({fmt(probe, 1)}) = {fmt(a.f(probe), 3)}
                  {showDerivative && a.df ? ` · φ′ = ${fmt(a.df(probe), 3)}` : ""}
                </p>
                {a.breakAt && <p className="mt-1 text-[10px] text-rose-600 dark:text-rose-400">{a.breakAt}</p>}
              </div>
            ))}
          </div>
        </div>
      </Sourced>

      {/* ── 미분 가능성이 왜 중요한가 ── */}
      <Sourced
        refs={{
          textbook: "11.1.3 신경망의 구성 요소 · 11.2.2 다층 퍼셉트론",
          slides: "활성화 함수 · 다층 퍼셉트론 — 뉴런",
          lecture: "학습 과정에서 활성화 함수의 미분값이 필요하기 때문에 다층 퍼셉트론에서는 미분 가능한 함수를 쓴다고 이유를 붙여 설명",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-fuchsia-200 bg-fuchsia-50 p-5 dark:border-fuchsia-900 dark:bg-fuchsia-950/30">
          <h3 className="text-base font-bold text-fuchsia-800 dark:text-fuchsia-200">
            미분 가능성 — 계단·부호함수와 시그모이드·하이퍼탄젠트를 가르는 지점
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-rose-200 bg-white p-3 dark:border-rose-900 dark:bg-gray-900">
              <p className="text-sm font-bold text-rose-700 dark:text-rose-300">계단함수 · 부호함수</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                u = 0에서 값이 뛰므로 <strong>미분 불가</strong>. 출력이 두 값뿐이라 이진 출력에는 맞지만,
                미분값을 써야 하는 학습에는 쓸 수 없음. 퍼셉트론이 계단함수를 쓰는 이유이자, 다층
                퍼셉트론이 쓰지 못하는 이유.
              </p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-white p-3 dark:border-emerald-900 dark:bg-gray-900">
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                시그모이드 · 하이퍼탄젠트
              </p>
              <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                계단함수나 부호함수와는 달리 <strong>미분 가능하다는 장점</strong>이 있으면서도 출력값이
                0에서 1 사이(또는 −1에서 1 사이)로 제한되는 특성을 가짐. 또한 함수의 곡선 형태를
                파라미터의 값에 따라 계단함수에서 선형함수에 이르기까지 자유롭게 근사할 수 있도록 조정할
                수 있음.
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-fuchsia-800 dark:text-fuchsia-200">
            ReLU 함수는 최근의 딥러닝 모델에서 주로 사용됨.
          </p>
        </div>
      </Sourced>

      {/* ── 하이퍼탄젠트의 모양 조절 ── */}
      <Sourced
        refs={{
          textbook: "11.1.3 신경망의 구성 요소 — 곡선 형태의 조정",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">곡선을 겹쳐 비교하기</h3>
          <p className="mt-1 text-xs text-gray-500">
            칩을 눌러 켜고 끔. 같은 축 위에 올려 놓으면 출력 범위와 꺾이는 모양의 차이가 한눈에 보임.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {ACTIVATIONS.map((a) => {
              const on = overlay.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleOverlay(a.id)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
                    on
                      ? "border-transparent text-white"
                      : "border-gray-200 bg-white text-gray-400 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-900"
                  }`}
                  style={on ? { backgroundColor: a.color } : undefined}
                >
                  {a.name}
                </button>
              );
            })}
          </div>
          <div className="mt-3 overflow-x-auto">
            <svg viewBox={`0 0 ${BIG.width} ${BIG.height}`} className="w-full min-w-[340px] max-w-[560px] rounded-lg border border-gray-100 dark:border-gray-800">
              <rect x={0} y={0} width={BIG.width} height={BIG.height} fill="#ffffff" />
              {[-1, 1].map((v) => (
                <line key={v} x1={bs.sx(BIG.xMin)} y1={bs.sy(v)} x2={bs.sx(BIG.xMax)} y2={bs.sy(v)} stroke="#f1f5f9" />
              ))}
              <line x1={bs.sx(BIG.xMin)} y1={bs.sy(0)} x2={bs.sx(BIG.xMax)} y2={bs.sy(0)} stroke="#cbd5e1" />
              <line x1={bs.sx(0)} y1={bs.sy(BIG.yMin)} x2={bs.sx(0)} y2={bs.sy(BIG.yMax)} stroke="#cbd5e1" />
              {[-1, 1].map((v) => (
                <text key={v} x={bs.sx(0) - 5} y={bs.sy(v) + 3} fontSize="8" textAnchor="end" fill="#94a3b8">
                  {v === 1 ? "1" : "−1"}
                </text>
              ))}
              {[-3, -2, -1, 1, 2, 3].map((v) => (
                <text key={v} x={bs.sx(v)} y={bs.sy(0) + 11} fontSize="8" textAnchor="middle" fill="#cbd5e1">
                  {v}
                </text>
              ))}
              {ACTIVATIONS.filter((a) => overlay.includes(a.id)).map((a) => (
                <path key={a.id} d={pathOf(a.f, BIG, 500)} fill="none" stroke={a.color} strokeWidth="2" opacity={0.9} />
              ))}
              <line x1={bs.sx(probe)} y1={bs.sy(BIG.yMin)} x2={bs.sx(probe)} y2={bs.sy(BIG.yMax)} stroke="#e2e8f0" />
              {ACTIVATIONS.filter((a) => overlay.includes(a.id)).map((a) => {
                const y = Math.max(BIG.yMin, Math.min(BIG.yMax, a.f(probe)));
                return <circle key={a.id} cx={bs.sx(probe)} cy={bs.sy(y)} r={3.5} fill={a.color} stroke="#fff" strokeWidth={1} />;
              })}
              <text x={BIG.width - 6} y={14} fontSize="8" textAnchor="end" fill="#94a3b8">
                u = {fmt(probe, 1)}
              </text>
            </svg>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[460px] text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-left text-[11px] text-gray-500 dark:border-gray-700">
                  <th className="py-1.5 pr-2">함수</th>
                  <th className="py-1.5 pr-2">정의</th>
                  <th className="py-1.5 pr-2">출력 범위</th>
                  <th className="py-1.5 pr-2">미분</th>
                  <th className="py-1.5">φ({fmt(probe, 1)})</th>
                </tr>
              </thead>
              <tbody>
                {ACTIVATIONS.map((a) => (
                  <tr key={a.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-1.5 pr-2 font-semibold" style={{ color: a.color }}>
                      {a.name}
                    </td>
                    <td className="py-1.5 pr-2 font-mono text-[10px] text-gray-600 dark:text-gray-400">{a.expr}</td>
                    <td className="py-1.5 pr-2 font-mono text-gray-600 dark:text-gray-400">{a.range}</td>
                    <td className="py-1.5 pr-2">
                      {a.differentiable ? (
                        <span className="text-emerald-600 dark:text-emerald-400">가능</span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400">불가</span>
                      )}
                    </td>
                    <td className="py-1.5 font-mono">{fmt(a.f(probe), 3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Sourced>
    </section>
  );
}
