"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { mulberry32, type Label, type Pt } from "./ensembleCore";

/* 설명용 모형 — 탐지 대상(+1)은 오른쪽 위의 작은 원 영역, 나머지는 배경(−1) */
const OBJ = { x: 6.5, y: 6, r: 1.3 };
const truth = (p: Pt): Label => (Math.hypot(p.x - OBJ.x, p.y - OBJ.y) < OBJ.r ? 1 : -1);

const DATA: Pt[] = (() => {
  const rand = mulberry32(2024);
  const pts: Pt[] = [];
  for (let k = 0; k < 70; k += 1) pts.push({ x: 0.3 + rand() * 9.4, y: 0.3 + rand() * 9.4 });
  for (let k = 0; k < 20; k += 1) {
    const a = rand() * 2 * Math.PI;
    const d = rand() * 2.2;
    pts.push({ x: OBJ.x + d * Math.cos(a), y: OBJ.y + d * Math.sin(a) });
  }
  return pts;
})();
const TRUTH = DATA.map(truth);

const sigmoid = (v: number) => 1 / (1 + Math.exp(-v));

/** 단계가 높을수록 더 복잡하고 정확한 학습기. 판별값 g > 0 이면 +1, 신뢰도는 |g|가 클수록 1에 가까움 */
const STAGES = [
  {
    name: "h₁ — 넓은 원 (대략적)",
    cost: 1,
    g: (p: Pt) => 2.8 - Math.hypot(p.x - OBJ.x, p.y - OBJ.y),
    k: 1.5,
  },
  {
    name: "h₂ — 사각형 영역",
    cost: 5,
    g: (p: Pt) => Math.min(1.7 - Math.abs(p.x - OBJ.x), 1.7 - Math.abs(p.y - OBJ.y)),
    k: 3,
  },
  {
    name: "h₃ — 정밀한 원",
    cost: 20,
    g: (p: Pt) => OBJ.r - Math.hypot(p.x - OBJ.x, p.y - OBJ.y),
    k: 6,
  },
];
const STAGE_COLORS = ["#16a34a", "#d97706", "#dc2626"];

const S = 260;
const P = 14;
const sx = (x: number) => P + (x / 10) * (S - 2 * P);
const sy = (y: number) => S - P - (y / 10) * (S - 2 * P);

export default function Cascading() {
  const [gamma, setGamma] = useState(0.9);

  const run = useMemo(
    () =>
      DATA.map((p) => {
        for (let s = 0; s < STAGES.length; s += 1) {
          const g = STAGES[s].g(p);
          const pred: Label = g > 0 ? 1 : -1;
          const conf = sigmoid(STAGES[s].k * Math.abs(g));
          const spent = STAGES.slice(0, s + 1).reduce((a, st) => a + st.cost, 0);
          if (conf > gamma || s === STAGES.length - 1) return { stage: s, pred, conf, spent };
        }
        throw new Error("unreachable");
      }),
    [gamma],
  );

  const exits = STAGES.map((_, s) => run.filter((r) => r.stage === s).length);
  const errors = run.filter((r, i) => r.pred !== TRUTH[i]).length;
  const avgCost = run.reduce((a, r) => a + r.spent, 0) / run.length;
  const allLast = STAGES[STAGES.length - 1].cost;

  return (
    <section id="cascading" className="scroll-mt-32">
      <SectionTitle
        title="07. 캐스케이딩"
        subtitle="여러 가지 복잡도를 가진 학습기들을 순차적으로 결합 — 계산 효율을 높이면서 안정적인 성능"
      />

      <Sourced
        className="mb-6"
        refs={{
          textbook: "8.4.2 캐스케이딩 — 그림 8-5",
          slides: "캐스케이딩 cascading",
          lecture: "앞단에는 복잡도가 낮은 학습기, 뒤로 갈수록 복잡도가 높은 학습기를 쓰는 것을 권장하며 '복잡도'와 '순차적 결합'이 키워드라고 짚음",
        }}
      >
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/40">
          <p className="text-xs font-bold tracking-wide text-amber-600 dark:text-amber-400">캐스케이딩 (cascading)</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-800 dark:text-gray-200">
            결합 방법에 중점을 둔 것으로, 처리에 많은 계산 비용이 요구되는 문제에서 계산 효율을
            높이면서 안정적인 성능을 얻기 위하여 전략적으로 여러 가지 복잡도를 가진 학습기를{" "}
            <strong>순차적으로</strong> 결합하는 방법.
          </p>
        </div>
        <div className="mt-3 overflow-x-auto">
          <div className="flex min-w-[520px] items-center gap-2 text-xs">
            <span className="rounded-lg bg-gray-100 px-3 py-2 font-bold dark:bg-gray-800">입력 x</span>
            {["h₁(x)", "h₂(x)", "…", "h_M(x)"].map((h, i) => (
              <div key={h} className="flex items-center gap-2">
                <span className="text-amber-500">→</span>
                {h === "…" ? (
                  <span className="text-gray-400">⋯</span>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <span className="rounded-md bg-amber-500 px-2 py-0.5 font-bold text-white">{h}</span>
                    {i < 3 && (
                      <span className="rounded border border-dashed border-amber-400 px-1.5 py-0.5 text-[10px] text-amber-800 dark:text-amber-200">
                        오류 &lt; ε, 신뢰도 &gt; γ ? yes → 출력 y
                      </span>
                    )}
                    {i === 3 && (
                      <span className="rounded border border-dashed border-amber-400 px-1.5 py-0.5 text-[10px] text-amber-800 dark:text-amber-200">
                        출력 y
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-gray-500">no → 다음 단계의 학습기로</p>
        </div>
      </Sourced>

      <Sourced
        className="mb-6"
        refs={{ textbook: "8.4.2 캐스케이딩 — 학습 단계와 추론 단계" }}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-l-4 border-amber-500 bg-white p-4 text-xs leading-relaxed text-gray-700 shadow-sm dark:bg-gray-900 dark:text-gray-300">
            <p className="mb-1 text-sm font-bold">학습 단계</p>
            먼저 성능은 떨어지지만 계산 비용이 적게 드는 간단한 학습기로 데이터 집합을 학습.
            학습이 완료되면 별도의 데이터 집합에 대한 평가를 수행하여 오류가 일정 수준(ε) 이상인
            데이터들을 찾음. 이때 단순히 오류가 있는 데이터만 고르지 않고, 출력의 신뢰도가 일정
            수준(γ)보다 높지 않은 데이터들도 함께 선택하는 것이 바람직. 선택된 데이터들은 다음
            단계의 학습에 사용.
          </div>
          <div className="rounded-xl border-l-4 border-amber-500 bg-white p-4 text-xs leading-relaxed text-gray-700 shadow-sm dark:bg-gray-900 dark:text-gray-300">
            <p className="mb-1 text-sm font-bold">학습기 선택과 추론 단계</p>
            단순 부스팅처럼 같은 종류의 모델을 써도 되지만, 단계가 높아질수록 이전 단계에서
            바르게 학습되기 힘든 데이터가 쓰이므로 높은 단계일수록 더욱 복잡하면서 성능이 좋은
            학습기가 효과적(예: 다층 퍼셉트론의 은닉 뉴런 수나 은닉층 수를 증가). 추론 단계에서도
            첫 번째 학습기부터 통과시켜 신뢰도가 충분히 높으면 그 결과를 출력하고, 그렇지 않으면
            다음 단계의 학습기로 넘김.
          </div>
        </div>
      </Sourced>

      <Sourced
        className="mb-4"
        refs={{
          textbook: "8.4.2 캐스케이딩 — 장점, 객체 탐지 적용",
        }}
      >
        <h3 className="mb-1 text-base font-bold">추론 단계 시뮬레이션 — 영상의 탐지 문제처럼</h3>
        <p className="mb-3 text-sm text-gray-500">
          점 90개는 영상 속 위치, 원 안쪽이 탐지 대상 객체(+1), 나머지는 쉽게 분류되는 배경(−1).
          설명을 위해 정한 모형: 세 학습기는 넓은 원 → 사각형 → 정밀한 원 순으로 경계가 정교해지고, 한 번 처리하는
          계산 비용을 1, 5, 20으로 둠. 신뢰도는 판별값이 경계에서 멀수록 1에 가깝게 계산. γ를 바꿔
          보기.
        </p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
          <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
            <svg viewBox={`0 0 ${S} ${S}`} className="w-full">
              <rect x={P} y={P} width={S - 2 * P} height={S - 2 * P} fill="#f8fafc" stroke="#cbd5e1" />
              <circle cx={sx(OBJ.x)} cy={sy(OBJ.y)} r={sx(2.8) - sx(0)} fill="none" stroke={STAGE_COLORS[0]} strokeDasharray="4 3" />
              <rect
                x={sx(OBJ.x - 1.7)}
                y={sy(OBJ.y + 1.7)}
                width={sx(3.4) - sx(0)}
                height={sy(0) - sy(3.4)}
                fill="none"
                stroke={STAGE_COLORS[1]}
                strokeDasharray="4 3"
              />
              <circle cx={sx(OBJ.x)} cy={sy(OBJ.y)} r={sx(OBJ.r) - sx(0)} fill="#fde68a" fillOpacity={0.5} stroke={STAGE_COLORS[2]} />
              {DATA.map((p, i) => {
                const r = run[i];
                const wrong = r.pred !== TRUTH[i];
                return (
                  <g key={i}>
                    {TRUTH[i] === 1 ? (
                      <rect x={sx(p.x) - 3.5} y={sy(p.y) - 3.5} width={7} height={7} fill={STAGE_COLORS[r.stage]} />
                    ) : (
                      <circle cx={sx(p.x)} cy={sy(p.y)} r={3.5} fill={STAGE_COLORS[r.stage]} />
                    )}
                    {wrong && <circle cx={sx(p.x)} cy={sy(p.y)} r={6.5} fill="none" stroke="#0f172a" strokeWidth="1.5" />}
                  </g>
                );
              })}
            </svg>
            <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-gray-500">
              {STAGES.map((st, s) => (
                <span key={st.name} className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STAGE_COLORS[s] }} />
                  {s + 1}단계에서 출력
                </span>
              ))}
              <span>■ 객체 · ● 배경 · 검은 원 = 오분류</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-900">
              <span className="font-semibold">신뢰도 기준 γ</span>
              <input
                type="range"
                min={0.55}
                max={0.995}
                step={0.005}
                value={gamma}
                onChange={(e) => setGamma(Number(e.target.value))}
                className="w-40 accent-amber-500"
              />
              <span className="font-mono font-bold">{gamma.toFixed(3)}</span>
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {STAGES.map((st, s) => (
                <div key={st.name} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                  <p className="text-[11px] font-bold" style={{ color: STAGE_COLORS[s] }}>
                    {st.name}
                  </p>
                  <p className="text-[11px] text-gray-500">비용 {st.cost}</p>
                  <p className="mt-1 text-lg font-bold">{exits[s]}개 출력</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-950/40">
                <p className="text-[11px] text-gray-500">데이터 하나당 평균 계산 비용</p>
                <p className="text-lg font-bold">
                  {avgCost.toFixed(2)}{" "}
                  <span className="text-xs font-normal text-gray-500">
                    (모두 h₃로 처리하면 {allLast} → {((1 - avgCost / allLast) * 100).toFixed(0)}% 절약)
                  </span>
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                <p className="text-[11px] text-gray-500">오분류</p>
                <p className="text-lg font-bold">
                  {errors} / {DATA.length}
                </p>
              </div>
            </div>
            <p className="rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
              γ가 낮으면 대부분이 h₁에서 끝나 빠르지만 경계 근처에서 틀리는 데이터가 생기고, γ를
              높이면 애매한 데이터가 뒤 단계로 넘어가 비용이 늘어나는 대신 정확해짐. 배경처럼 쉽게
              분류되는 데이터가 대부분이면 첫 단계에서 대부분이 처리되어 계산 시간이 줄면서도,
              복잡한 데이터는 다음 단계의 학습기가 맡아 성능이 보장됨 — 전체 영상을 스캔해야
              하는 객체 인식·객체 탐지 문제에 효과적.
            </p>
          </div>
        </div>
      </Sourced>
    </section>
  );
}
