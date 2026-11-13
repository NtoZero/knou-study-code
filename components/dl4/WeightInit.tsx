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
  num,
  q12,
} from "@/components/dlShared/ui";

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return (s + 0.5) / 4294967296;
  };
}

/** 고정 시드 정규분포 표본 — 같은 입력이면 항상 같은 점이 찍힌다 */
function normals(count: number, sd: number, seed: number): number[] {
  const rnd = lcg(seed);
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const u1 = rnd();
    const u2 = rnd();
    out.push(q12(Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2) * sd));
  }
  return out;
}

function uniforms(count: number, limit: number, seed: number): number[] {
  const rnd = lcg(seed);
  const out: number[] = [];
  for (let i = 0; i < count; i++) out.push(q12((rnd() * 2 - 1) * limit));
  return out;
}

const DOT_W = 440;
const AXIS_R = 1.4;
function r2(v: number) {
  return Math.round(v * 100) / 100;
}
const dx = (v: number) => r2(20 + ((Math.max(-AXIS_R, Math.min(AXIS_R, v)) + AXIS_R) / (2 * AXIS_R)) * (DOT_W - 40));

type InitKey = "he_normal" | "glorot_normal" | "tiny" | "big";

const PROP: Record<InitKey, { label: string; varW: (fi: number, fo: number) => number; tone: string }> = {
  he_normal: { label: "he_normal", varW: (fi) => 2 / fi, tone: "stroke-emerald-500" },
  glorot_normal: { label: "glorot_normal", varW: (fi, fo) => 2 / (fi + fo), tone: "stroke-sky-500" },
  tiny: { label: "고정 σ = 0.01", varW: () => 0.0001, tone: "stroke-violet-500" },
  big: { label: "고정 σ = 1", varW: () => 1, tone: "stroke-rose-500" },
};

export default function WeightInit() {
  const [fanIn, setFanIn] = useState(128);
  const [fanOut, setFanOut] = useState(128);
  const [tab, setTab] = useState<"spread" | "signal">("spread");
  const [prop, setProp] = useState<InitKey>("he_normal");

  const v = useMemo(() => {
    const gl = q12(Math.sqrt(6 / (fanIn + fanOut)));
    const gn = q12(Math.sqrt(2 / (fanIn + fanOut)));
    const hl = q12(Math.sqrt(6 / fanIn));
    const hn = q12(Math.sqrt(2 / fanIn));
    return { gl, gn, hl, hn };
  }, [fanIn, fanOut]);

  const dots = useMemo(
    () => ({
      gl: uniforms(44, v.gl, 1_000_001),
      gn: normals(44, v.gn, 1_000_002),
      hl: uniforms(44, v.hl, 1_000_003),
      hn: normals(44, v.hn, 1_000_004),
    }),
    [v],
  );

  /** ReLU를 쓰는 층에서 출력 분산 / 입력 분산 = fan_in × Var(w) / 2 — 이 페이지에서 쓰는 계산 */
  const chain = useMemo(() => {
    const factor = q12((fanIn * PROP[prop].varW(fanIn, fanOut)) / 2);
    const out: number[] = [];
    let cur = 1;
    for (let l = 1; l <= 8; l++) {
      cur = q12(cur * factor);
      out.push(cur);
    }
    return { factor, out };
  }, [prop, fanIn, fanOut]);

  const rows = [
    { name: "GlorotUniform", kind: "균등분포", expr: "limit = √(6 / (fan_in + fan_out))", val: v.gl, label: "limit", dots: dots.gl, act: "sigmoid 유형", code: "glorot_uniform" },
    { name: "GlorotNormal", kind: "정규분포", expr: "σ = √(2 / (fan_in + fan_out))", val: v.gn, label: "σ", dots: dots.gn, act: "sigmoid 유형", code: "glorot_normal" },
    { name: "HeUniform", kind: "균등분포", expr: "limit = √(6 / fan_in)", val: v.hl, label: "limit", dots: dots.hl, act: "ReLU 유형", code: "he_uniform" },
    { name: "HeNormal", kind: "정규분포", expr: "σ = √(2 / fan_in)", val: v.hn, label: "σ", dots: dots.hn, act: "ReLU 유형", code: "he_normal" },
  ];

  const barH = (x: number) => {
    const lg = Math.log10(Math.max(x, 1e-14));
    return r2(((Math.max(-10, Math.min(10, lg)) + 10) / 20) * 110);
  };

  return (
    <section id="weight-init" className="scroll-mt-32">
      <SectionTitle
        title="가중치의 초기화"
        subtitle="랜덤 값으로 두되, 팬-인·팬-아웃에 맞춰 범위를 정합니다"
      />

      <div className="space-y-4">
        <Sourced
          refs={{
            slides: "1. 사전 학습에 의한 가중치 초기화 — 심층 신뢰망(deep belief nets, DBN)을 이용한 가중치 초기화",
            lecture: "제한 볼츠만 머신을 쌓아 비지도 방식으로 사전 학습한 가중치를 초깃값으로 쓴다고 설명",
          }}
        >
          <Card>
            <CardTitle>시작은 사전 학습 — Geoffrey Hinton 등(2006)</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              연결 가중치를 단순히 랜덤 값으로 초기화하는 것보다는 적절한 방식으로 초기화함으로써 성능을
              개선할 수 있음 → <strong>심층 신뢰망을 사전 학습</strong>하여 연결 가중치를 초기화.
            </p>
            <Hint>
              이후에는 이렇게 복잡한 사전 학습 대신, 더 단순한 규칙으로 초깃값의 범위만 잘 정해도 된다는
              연구가 이어짐 — 다음의 Glorot·He 초기화.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "2. Glorot 초기화 방법 / 3. He 초기화 방법",
            lecture: "Glorot는 팬-인과 팬-아웃을 모두 고려하고, He는 팬-인만 고려한다고 대비해 설명",
          }}
        >
          <Card>
            <CardTitle>네 가지 초기화기 — 팬-인·팬-아웃을 바꿔 보며 비교</CardTitle>

            <div className="mb-3 grid gap-3 sm:grid-cols-2">
              <Slider label="fan_in (입력의 개수)" value={fanIn} min={2} max={512} step={2} onChange={setFanIn} display={num(fanIn)} />
              <Slider label="fan_out (출력의 수)" value={fanOut} min={2} max={512} step={2} onChange={setFanOut} display={num(fanOut)} />
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
              <Chip
                active={fanIn === 8 && fanOut === 2}
                onClick={() => {
                  setFanIn(8);
                  setFanOut(2);
                }}
              >
                Dense(2) · 입력 8개인 경우
              </Chip>
              <Chip
                active={fanIn === 128 && fanOut === 128}
                onClick={() => {
                  setFanIn(128);
                  setFanOut(128);
                }}
              >
                fan_in = fan_out = 128
              </Chip>
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
              <Chip active={tab === "spread"} onClick={() => setTab("spread")}>
                초깃값이 퍼지는 범위
              </Chip>
              <Chip active={tab === "signal"} onClick={() => setTab("signal")}>
                층을 거치며 신호가 어떻게 되나
              </Chip>
            </div>

            {tab === "spread" ? (
              <>
                <Scroller>
                  <div className="min-w-[440px] space-y-3">
                    {rows.map((r) => (
                      <div key={r.name}>
                        <div className="mb-1 flex flex-wrap items-baseline gap-2">
                          <span className="font-mono text-[12px] font-bold text-gray-800 dark:text-gray-100">
                            {r.name}
                          </span>
                          <span className="text-[10.5px] text-gray-400">{r.kind}</span>
                          <span className="ml-auto font-mono text-[11.5px] font-semibold text-rose-600 dark:text-rose-400">
                            {r.label} = {fmt(r.val, 4)}
                          </span>
                        </div>
                        <svg viewBox={`0 0 ${DOT_W} 30`} width={DOT_W} className="w-full" role="img" aria-label={`${r.name}의 초깃값 분포`}>
                          <rect x={10} y={4} width={DOT_W - 20} height={22} rx={4} className="fill-gray-50 dark:fill-gray-900" />
                          <line x1={dx(0)} y1={4} x2={dx(0)} y2={26} strokeWidth={1} className="stroke-gray-300 dark:stroke-gray-700" />
                          {r.dots.map((w, i) => (
                            <circle key={i} cx={dx(w)} cy={15} r={2.6} className="fill-rose-500/70" />
                          ))}
                        </svg>
                      </div>
                    ))}
                  </div>
                </Scroller>
                <p className="mt-1 text-center text-[10px] text-gray-400">
                  가로축 −{AXIS_R} ~ +{AXIS_R} — 팬-인을 키우면 네 분포 모두 0 쪽으로 좁아짐
                </p>
              </>
            ) : (
              <>
                <div className="mb-3 flex flex-wrap gap-2">
                  {(Object.keys(PROP) as InitKey[]).map((k) => (
                    <Chip key={k} active={prop === k} onClick={() => setProp(k)}>
                      {PROP[k].label}
                    </Chip>
                  ))}
                </div>
                <Scroller>
                  <div className="flex min-w-[400px] items-end gap-2">
                    {chain.out.map((x, i) => (
                      <div key={i} className="flex flex-1 flex-col items-center gap-1">
                        <span className="font-mono text-[9px] text-gray-500">
                          {x >= 0.001 && x < 1000 ? fmt(x, 3) : x.toExponential(1)}
                        </span>
                        <div
                          className={`w-full rounded-t ${
                            x < 0.05 ? "bg-sky-400" : x > 20 ? "bg-rose-500" : "bg-emerald-500"
                          }`}
                          style={{ height: `${barH(x)}px` }}
                        />
                        <span className="text-[9.5px] text-gray-400">{i + 1}층</span>
                      </div>
                    ))}
                  </div>
                </Scroller>
                <p className="mt-1 text-center text-[10.5px] text-gray-400">
                  첫 층 입력의 분산을 1로 두었을 때, 층을 거친 뒤의 분산 (한 층당 ×{fmt(chain.factor, 4)})
                </p>
                <ComputedNote>
                  ReLU를 쓰는 층에서 &lsquo;출력 분산 ÷ 입력 분산 = fan_in × Var(w) ÷ 2&rsquo;로 두고 이
                  페이지에서 계산한 예시입니다. 강의록에 적힌 수치가 아니며, limit·σ 식만 강의록을 그대로
                  따랐습니다.
                </ComputedNote>
              </>
            )}

            <Scroller>
              <table className="mt-4 w-full min-w-[480px] text-left text-[11.5px]">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700">
                    <th className="py-1.5 pr-2 font-semibold">초기화기</th>
                    <th className="py-1.5 pr-2 font-semibold">정하는 값</th>
                    <th className="py-1.5 pr-2 font-semibold">지금 값</th>
                    <th className="py-1.5 pr-2 font-semibold">맞는 활성함수</th>
                    <th className="py-1.5 font-semibold">kernel_initializer</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.name} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-1.5 pr-2 font-mono font-semibold text-gray-800 dark:text-gray-100">
                        {r.name}
                      </td>
                      <td className="py-1.5 pr-2 font-mono text-gray-600 dark:text-gray-300">{r.expr}</td>
                      <td className="py-1.5 pr-2 font-mono font-bold text-rose-600 dark:text-rose-400">
                        {fmt(r.val, 4)}
                      </td>
                      <td className="py-1.5 pr-2 text-gray-600 dark:text-gray-300">{r.act}</td>
                      <td className="py-1.5 font-mono text-gray-600 dark:text-gray-300">
                        &apos;{r.code}&apos;
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Scroller>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-sky-100 bg-sky-50/60 p-3 dark:border-sky-900/60 dark:bg-sky-950/30">
                <p className="text-[11px] font-bold text-sky-700 dark:text-sky-300">
                  Glorot — Xavier Glorot, Yoshua Bengio(2010)
                </p>
                <p className="mt-1 text-[12px] leading-5 text-gray-700 dark:text-gray-200">
                  연결 가중치를 뉴런의 <strong>팬-인(fan-in)과 팬-아웃(fan-out)</strong>에 따라 결정되는
                  값의 범위에 속하는 랜덤 값으로 초기화(sigmoid 유형의 활성함수 사용 모델).
                </p>
              </div>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-3 dark:border-emerald-900/60 dark:bg-emerald-950/30">
                <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                  He — Kaiming He, et al(2015)
                </p>
                <p className="mt-1 text-[12px] leading-5 text-gray-700 dark:text-gray-200">
                  ReLU 유형의 활성함수를 사용하는 신경망에 적합한 초기화 방법을 제안. <strong>팬-인</strong>을
                  기준으로 정해지는 범위의 랜덤 값에 따라 가중치를 초기화함.
                </p>
              </div>
            </div>

            <div className="mt-3">
              <Formula note="Glorot는 fan_in + fan_out, He는 fan_in만 — 분모가 다른 것이 두 방법의 차이">
                Glorot: σ = √(2 / (fan_in + fan_out))　vs　He: σ = √(2 / fan_in)
              </Formula>
            </div>

            <div className="mt-3">
              <Scroller>
                <pre className="min-w-[340px] overflow-x-auto rounded-lg bg-gray-900 p-3 text-[11.5px] leading-5 text-gray-100">
{`from tensorflow.keras import layers
dense_layer = layers.Dense(10, activation='relu',
                           kernel_initializer='he_normal')`}
                </pre>
              </Scroller>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Tag tone="rose">
                Glorot나 He 기법으로 파라미터를 초기화하면 층을 거치며 신호의 분산이 폭발하거나 소실되는
                것을 억제
              </Tag>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
