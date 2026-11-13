"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import {
  Card,
  CardTitle,
  Formula,
  Hint,
  ComputedNote,
  Slider,
  Chip,
  Scroller,
  Tag,
  fmt,
  q12,
} from "@/components/dlShared/ui";

const sigmoid = (u: number) => 1 / (1 + Math.exp(-u));
const dSigmoid = (u: number) => {
  const s = sigmoid(u);
  return s * (1 - s);
};

const ACTS = [
  { id: "sig0", label: "시그모이드 (u ≈ 0, 미분 최대)", d: 0.25 },
  { id: "sigSat", label: "시그모이드 (포화 구간)", d: 0.05 },
  { id: "relu", label: "ReLU (양수 입력 구간)", d: 1 },
] as const;

type ActId = (typeof ACTS)[number]["id"];

const SW = 460;
const SH = 220;
const SPAD = 34;
const U_R = 6;

function r2(v: number) {
  return Math.round(v * 100) / 100;
}
const ux = (u: number) => r2(SPAD + ((u + U_R) / (2 * U_R)) * (SW - 2 * SPAD));
const uy = (y: number) => r2(SH - SPAD - (y / 1.08) * (SH - 2 * SPAD));

export default function UnstableGradient() {
  const [u, setU] = useState(0);
  const [act, setAct] = useState<ActId>("sig0");
  const [layers, setLayers] = useState(6);
  const [wScale, setWScale] = useState(1);

  const sigCurve = useMemo(() => {
    const a: string[] = [];
    const b: string[] = [];
    for (let i = 0; i <= 160; i++) {
      const t = -U_R + (2 * U_R * i) / 160;
      a.push(`${ux(t)},${uy(q12(sigmoid(t)))}`);
      b.push(`${ux(t)},${uy(q12(dSigmoid(t)))}`);
    }
    return { s: a.join(" "), d: b.join(" ") };
  }, []);

  const deriv = ACTS.find((a) => a.id === act)?.d ?? 0.25;
  const factor = q12(deriv * wScale);

  const chain = useMemo(() => {
    const out: number[] = [];
    let v = 1;
    for (let l = 1; l <= layers; l++) {
      v = q12(v * factor);
      out.push(v);
    }
    return out;
  }, [factor, layers]);

  const final = chain.length ? chain[chain.length - 1] : 1;
  const state =
    final < 0.01
      ? { label: "경사 소멸", tone: "sky", note: "입력층 쪽 가중치가 거의 업데이트되지 않음" }
      : final > 100
        ? { label: "경사 폭발", tone: "rose", note: "경사가 점점 커져 연결 가중치가 발산" }
        : { label: "비교적 안정", tone: "emerald", note: "층을 거쳐도 경사의 크기가 유지됨" };

  const stateTone = {
    sky: "bg-sky-50 text-sky-800 dark:bg-sky-950/40 dark:text-sky-200",
    rose: "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200",
    emerald: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
  }[state.tone];

  /** 자릿수가 크게 벌어지므로 막대는 상용로그로 재어 그린다 */
  const barH = (v: number) => {
    const lg = Math.log10(Math.max(v, 1e-12));
    const clamped = Math.max(-8, Math.min(8, lg));
    return r2(((clamped + 8) / 16) * 120);
  };

  return (
    <section id="unstable-gradient" className="scroll-mt-32">
      <SectionTitle
        title="불안정한 경사 문제"
        subtitle="층이 깊어질수록 경사가 사라지거나 터집니다"
      />

      <div className="space-y-4">
        <Sourced
          className="min-w-0"
          badgeClassName="mb-2 min-w-0"
          refs={{
            slides: "경사 소멸(vanishing gradient) 문제",
            lecture: "시그모이드 미분의 최댓값 0.25",
          }}
        >
          <Card>
            <CardTitle>경사 소멸 — 1보다 작은 값을 계속 곱하면</CardTitle>
            <p className="mb-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              심층망을 학습하는 과정에서 <strong>입력층으로 갈수록 경사의 크기가 0에 근접</strong>하여
              연결 가중치의 업데이트가 진행되지 않는 현상.
            </p>

            <Scroller>
              <svg
                viewBox={`0 0 ${SW} ${SH}`}
                width={SW}
                className="min-w-[420px] max-w-full"
                role="img"
                aria-label="시그모이드 함수와 그 미분"
              >
                <rect x={SPAD} y={SPAD - 20} width={SW - 2 * SPAD} height={SH - 2 * SPAD + 20} rx={6} className="fill-gray-50 dark:fill-gray-900" />

                {/* 포화 구간 표시 */}
                <rect x={ux(-6)} y={SPAD - 20} width={ux(-3) - ux(-6)} height={SH - 2 * SPAD + 20} className="fill-rose-500/10" />
                <rect x={ux(3)} y={SPAD - 20} width={ux(6) - ux(3)} height={SH - 2 * SPAD + 20} className="fill-rose-500/10" />
                <text x={ux(-4.5)} y={SPAD - 6} textAnchor="middle" className="fill-rose-500 text-[10px] font-semibold">
                  포화
                </text>
                <text x={ux(4.5)} y={SPAD - 6} textAnchor="middle" className="fill-rose-500 text-[10px] font-semibold">
                  포화
                </text>

                <polyline points={sigCurve.s} fill="none" strokeWidth={2.4} className="stroke-gray-800 dark:stroke-gray-100" />
                <polyline points={sigCurve.d} fill="none" strokeWidth={2.2} strokeDasharray="4 3" className="stroke-blue-500" />

                <line x1={ux(u)} y1={SPAD - 20} x2={ux(u)} y2={SH - SPAD} strokeWidth={1.3} strokeDasharray="3 3" className="stroke-rose-500" />
                <circle cx={ux(u)} cy={uy(q12(dSigmoid(u)))} r={5} className="fill-blue-600" />

                {[0, 0.25, 0.5, 0.75, 1].map((y) => (
                  <text key={y} x={SPAD - 6} y={uy(y) + 4} textAnchor="end" className="fill-gray-400 text-[9.5px]">
                    {y}
                  </text>
                ))}
                <text x={SW - SPAD} y={SH - SPAD + 16} textAnchor="end" className="fill-gray-400 text-[10px]">
                  u
                </text>
              </svg>
            </Scroller>

            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <Slider label="입력 u" value={u} min={-6} max={6} step={0.1} onChange={setU} display={fmt(u, 1)} />
              <div className="flex gap-2">
                <div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800">
                  <p className="text-[10.5px] font-semibold text-gray-500">φ(u)</p>
                  <p className="font-mono text-sm font-bold text-gray-800 dark:text-gray-100">
                    {fmt(sigmoid(u), 4)}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-950/40">
                  <p className="text-[10.5px] font-semibold text-blue-700 dark:text-blue-300">φ′(u)</p>
                  <p className="font-mono text-sm font-bold text-blue-800 dark:text-blue-200">
                    {fmt(dSigmoid(u), 4)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <Formula note="u = 0에서 φ(0) = 0.5이므로 미분은 0.5 × 0.5 = 0.25 — 이것이 최댓값">
                φ′(u) = φ(u)(1 − φ(u))
              </Formula>
            </div>

            <Hint>
              u를 0에서 멀리 밀어 보면 미분이 빠르게 0으로 떨어집니다. 역전파는 이 미분들을 출력층에서
              입력층까지 계속 곱해 가므로, 층이 깊을수록 곱해지는 개수가 늘어납니다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          className="min-w-0"
          badgeClassName="mb-2 min-w-0"
          refs={{
            slides: "경사 소멸(vanishing gradient) 문제",
            lecture: "경사 폭발의 원인",
          }}
        >
          <Card>
            <CardTitle>층을 따라 내려가며 경사가 어떻게 되는지</CardTitle>

            <div className="mb-3 flex flex-wrap gap-2">
              {ACTS.map((a) => (
                <Chip key={a.id} active={act === a.id} onClick={() => setAct(a.id)}>
                  {a.label}
                </Chip>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Slider label="층 수" value={layers} min={1} max={12} step={1} onChange={setLayers} display={`${layers}층`} />
              <Slider
                label="가중치 크기 배율"
                value={wScale}
                min={0.5}
                max={5}
                step={0.1}
                onChange={setWScale}
                display={`×${fmt(wScale, 1)}`}
              />
            </div>

            <Scroller>
              <div className="mt-3 flex min-w-[420px] items-end gap-1.5">
                {chain.map((v, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <span className="font-mono text-[9.5px] text-gray-500">
                      {v >= 0.001 && v < 10000 ? fmt(v, 3) : v.toExponential(1)}
                    </span>
                    <div
                      className={`w-full rounded-t ${
                        v < 0.01 ? "bg-sky-400" : v > 100 ? "bg-rose-500" : "bg-emerald-500"
                      }`}
                      style={{ height: `${barH(v)}px` }}
                    />
                    <span className="text-[9.5px] text-gray-400">{i + 1}</span>
                  </div>
                ))}
              </div>
            </Scroller>
            <p className="mt-1 text-center text-[10.5px] text-gray-400">
              출력층에서 몇 개 층을 내려왔는지 (경사 크기를 출력층에서 1로 두었을 때의 배율)
            </p>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800">
                <p className="text-[10.5px] font-semibold text-gray-500">한 층당 배율</p>
                <p className="font-mono text-sm font-bold text-gray-800 dark:text-gray-100">
                  {fmt(factor, 3)}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800">
                <p className="text-[10.5px] font-semibold text-gray-500">{layers}층 아래에서</p>
                <p className="font-mono text-sm font-bold text-gray-800 dark:text-gray-100">
                  {final >= 0.001 && final < 10000 ? fmt(final, 5) : final.toExponential(2)}배
                </p>
              </div>
              <div className={`rounded-lg p-2.5 ${stateTone}`}>
                <p className="text-[12.5px] font-bold">{state.label}</p>
                <p className="mt-0.5 text-[11px] leading-4">{state.note}</p>
              </div>
            </div>

            <ComputedNote>
              한 층당 배율은 &lsquo;활성함수의 미분 × 가중치 크기 배율&rsquo;로 이 페이지에서 단순하게
              잡은 예시입니다. 시그모이드 미분의 최댓값 0.25는 강의에서 계산해 보인 값이고, 포화 구간의
              0.05와 가중치 배율은 이 페이지에서 정한 값입니다.
            </ComputedNote>
          </Card>
        </Sourced>

        <div className="grid gap-4 lg:grid-cols-2">
          <Sourced
            className="min-w-0"
            badgeClassName="mb-2 min-w-0"
            refs={{
              slides: "경사 소멸 문제의 개선 방법",
              lecture: "스킵 연결의 효과",
            }}
          >
            <Card className="h-full">
              <CardTitle>경사 소멸 문제의 개선 방법</CardTitle>
              <ul className="space-y-1.5 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                <li>
                  · <strong>활성함수 개선</strong> — 시그모이드 대신 ReLU, Leaky ReLU, GELU, Swish
                </li>
                <li>
                  · <strong>스킵 연결</strong> — 층을 건너뛰는 연결을 두어 역전파 때 경사가 그 길로
                  내려감. 거치는 층이 줄어 곱해지는 미분의 개수도 줄어듦
                </li>
                <li>
                  · <strong>가중치의 적절한 초기화</strong>
                </li>
                <li>
                  · <strong>배치 정규화</strong>
                </li>
              </ul>

              {/* 스킵 연결 도식 */}
              <Scroller>
                <svg viewBox="0 0 320 86" width="320" className="mt-3 w-full max-w-[320px]" role="img" aria-label="스킵 연결 구조">
                  <line x1={14} y1={36} x2={296} y2={36} strokeWidth={1.5} className="stroke-gray-400" />
                  {[
                    { x: 40, t: "Layer-1" },
                    { x: 108, t: "ReLU" },
                    { x: 176, t: "Layer-2" },
                  ].map((b) => (
                    <g key={b.t}>
                      <rect x={b.x} y={20} width={52} height={32} rx={4} className="fill-gray-200 dark:fill-gray-700" />
                      <text x={b.x + 26} y={40} textAnchor="middle" className="fill-gray-700 text-[9.5px] dark:fill-gray-100">
                        {b.t}
                      </text>
                    </g>
                  ))}
                  <circle cx={248} cy={36} r={10} className="fill-none stroke-gray-500" strokeWidth={1.5} />
                  <text x={248} y={40} textAnchor="middle" className="fill-gray-600 text-[11px] dark:fill-gray-200">
                    +
                  </text>
                  <text x={10} y={40} className="fill-gray-600 text-[10px] dark:fill-gray-200">
                    x
                  </text>
                  <path d="M 24 44 L 24 72 L 248 72 L 248 48" fill="none" strokeWidth={1.8} className="stroke-rose-500" />
                  <text x={136} y={82} textAnchor="middle" className="fill-rose-500 text-[9.5px] font-semibold">
                    스킵 연결
                  </text>
                </svg>
              </Scroller>
            </Card>
          </Sourced>

          <Sourced
            className="min-w-0"
            badgeClassName="mb-2 min-w-0"
            refs={{
              slides: "경사 폭발(exploding gradient) 문제",
            }}
          >
            <Card className="h-full">
              <CardTitle>경사 폭발 문제</CardTitle>
              <p className="mb-2 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                경사의 크기가 점점 더 커져 연결 가중치가 발산하는 상황.
              </p>
              <div className="grid gap-2">
                <div className="rounded-lg border border-rose-100 bg-rose-50/60 p-3 dark:border-rose-900/60 dark:bg-rose-950/30">
                  <p className="text-[11px] font-bold text-rose-700 dark:text-rose-300">원인</p>
                  <ul className="mt-1 space-y-0.5 text-[12px] leading-5 text-gray-700 dark:text-gray-200">
                    <li>· 부적절한 가중치 초깃값</li>
                    <li>· 지나치게 높은 학습률 등</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-3 dark:border-emerald-900/60 dark:bg-emerald-950/30">
                  <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">개선 방법</p>
                  <ul className="mt-1 space-y-0.5 text-[12px] leading-5 text-gray-700 dark:text-gray-200">
                    <li>· 배치 정규화</li>
                    <li>· 경사 절단(gradient clipping)</li>
                    <li>· 규제(regularization)</li>
                    <li>· 최적화 알고리즘의 개선(Adam, RMSprop 등)</li>
                  </ul>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Tag tone="rose">소멸과 폭발은 반대 방향이지만 둘 다 &lsquo;불안정한 경사&rsquo;</Tag>
              </div>
            </Card>
          </Sourced>
        </div>
      </div>
    </section>
  );
}
