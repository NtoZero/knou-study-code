"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { overlapData } from "./svmData";
import { decision, linearKernel, linearWeights, trainSvm, type Vec } from "./svmCore";
import {
  C1_COLOR,
  C2_COLOR,
  ERR_COLOR,
  SV_COLOR,
  clipLine,
  fmt,
  makeScale,
  type Frame,
} from "./plotUtils";

const F: Frame = { xMin: 0, xMax: 8, yMin: 0, yMax: 8, width: 320, height: 320, pad: 12 };
const s = makeScale(F);

const C_VALUES = [0.01, 0.05, 0.1, 0.5, 1, 10];

/** 각 c로 슬랙변수를 가진 SVM을 실제로 학습한 결과 */
const RESULTS = C_VALUES.map((c) => {
  const model = trainSvm(overlapData, linearKernel, c);
  const w = linearWeights(model);
  const wn = Math.hypot(w[0], w[1]);
  const g = overlapData.map((d) => decision(model, d.x));
  const xi = overlapData.map((d, i) => Math.max(0, 1 - d.y * g[i]));
  const sumXi = xi.reduce((a, b) => a + b, 0);
  return {
    c,
    model,
    w,
    wn,
    g,
    xi,
    sumXi,
    margin: 2 / wn,
    inside: xi.filter((v) => v > 1e-9).length,
    wrong: xi.filter((v) => v > 1).length,
    J: 0.5 * wn * wn + c * sumXi,
  };
});

export default function SlackVariableLab() {
  const [ci, setCi] = useState(3);
  const r = RESULTS[ci];
  const { model, w, wn } = r;

  const lines = useMemo(
    () => ({
      zero: clipLine(w, model.w0, F),
      plus: clipLine(w, model.w0, F, 1),
      minus: clipLine(w, model.w0, F, -1),
    }),
    [w, model.w0],
  );

  const maxM = Math.max(...RESULTS.map((x) => x.margin));
  const maxXi = Math.max(...RESULTS.map((x) => x.sumXi));
  const px = (i: number) => 30 + (i / (C_VALUES.length - 1)) * 250;

  return (
    <section>
      <SectionTitle
        title="10.2.4 슬랙변수를 가진 SVM"
        subtitle="선형 분리가 불가능한 데이터에서 일부 오분류를 허용하는 정도를 슬랙변수 ξ와 하이퍼파라미터 c로 조절"
      />

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <Sourced
          refs={{
            textbook: "10.2.4 (1) 슬랙변수의 도입",
            slides: "슬랙변수를 가진 SVM",
            lecture: "ξ가 클수록 결정경계로부터 더 멀리 넘어가 있다는 뜻이라, 더 심한 오분류를 허용한다고 읽으라고 설명",
          }}
        >
          <div className="h-full rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/40">
            <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">슬랙변수 ξᵢ (i = 1, …, N)</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              일반적으로 학습 데이터가 선형 분리 가능하다고 가정하는 것은 무리가 있어, 선형 분류기로는
              잘못 분류되는 데이터가 존재하게 됨. 이를 처리하기 위해{" "}
              <strong>잘못 분류된 데이터로부터 해당 클래스의 경계까지의 거리</strong>를 나타내는
              슬랙변수 ξᵢ를 도입. <strong>ξᵢ가 클수록 더 심한 오분류를 허용함</strong>을 의미.
            </p>
          </div>
        </Sourced>
        <Sourced
          refs={{
            textbook: "10.2.4 (1) 슬랙변수의 도입 (식 10-20~10-22)",
            slides: "슬랙변수를 가진 SVM — 슬랙변수를 포함한 분류 조건",
          }}
        >
          <div className="h-full rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm font-bold">슬랙변수를 포함한 분류 조건</p>
            <div className="mt-2 overflow-x-auto font-mono text-xs leading-6">
              <p className="min-w-[280px] text-gray-400">기존: wᵀxᵢ + w₀ ≥ +1 for yᵢ = +1 (식 10-21)</p>
              <p className="min-w-[280px]">wᵀxᵢ + w₀ ≥ +1 − ξᵢ for yᵢ = +1</p>
              <p className="min-w-[280px]">wᵀxᵢ + w₀ ≤ −1 + ξᵢ for yᵢ = −1 (식 10-20)</p>
              <p className="min-w-[280px] font-bold">⇒ yᵢ(wᵀxᵢ + w₀) ≥ 1 − ξᵢ (식 10-22)</p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              기존 조건은 C₁의 모든 데이터가 엄격하게 플러스 평면보다 윗부분에 있어야 한다는 뜻.
              슬랙변수를 추가하면 C₁의 데이터가 플러스 평면보다 ξᵢ만큼 아랫부분에 존재할 수 있도록
              허용하게 됨.
            </p>
          </div>
        </Sourced>
      </div>

      <Sourced
        refs={{
          textbook: "10.2.4 (2) 파라미터의 추정 (식 10-23~10-29)",
          slides: "슬랙변수를 가진 SVM — ŵ, ŵ₀는 슬랙변수가 없는 경우와 완전히 동일 · 슬랙변수와 커널을 가진 SVM 분류기의 학습과 인식 과정 — 하이퍼파라미터 c, 0 ≤ αᵢ ≤ c",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">파라미터의 추정 — 하이퍼파라미터 c</h3>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="overflow-x-auto rounded-lg bg-indigo-50 p-3 font-mono text-xs leading-6 dark:bg-indigo-950/40">
              <p className="min-w-[300px] text-sm">J(w, ξ) = ½‖w‖² + c Σᵢ ξᵢ (식 10-23)</p>
              <p className="min-w-[300px]">조건: yᵢ(wᵀxᵢ + w₀) ≥ 1 − ξᵢ, ξᵢ ≥ 0 (식 10-24)</p>
              <p className="mt-2 min-w-[300px]">
                J(w, w₀, α, ξ, β) = ½‖w‖² + cΣξᵢ − Σαᵢ{"{"}yᵢ(wᵀxᵢ + w₀) − 1 + ξᵢ{"}"} − Σβᵢξᵢ (식 10-25)
              </p>
              <p className="mt-2 min-w-[300px]">Q(α) = Σαᵢ − ½ΣΣαᵢαⱼyᵢyⱼxᵢᵀxⱼ (식 10-26)</p>
              <p className="min-w-[300px] font-bold">
                Σαᵢyᵢ = 0, <span className="text-rose-600 dark:text-rose-300">0 ≤ αᵢ ≤ c</span> (식 10-27)
              </p>
            </div>
            <ul className="space-y-2 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              <li>
                · 항 cΣξᵢ는 ξᵢ의 값을 가능한 최소화하여 오분류의 허용도를 낮추기 위해 추가됨.{" "}
                <strong>c는 이 최소화 조건을 반영하는 정도를 결정하는 값으로 사용자가 적절히 정해
                주어야 함</strong>(하이퍼파라미터).
              </li>
              <li>
                · <strong>c가 크면</strong> ξᵢ가 커지는 것을 강하게 저지하므로 오분류 오차가 적어짐.{" "}
                <strong>c가 작으면</strong> 오분류 허용도가 높아짐.
              </li>
              <li>
                · βᵢ는 슬랙변수를 양의 값으로 유지하기 위한 새로운 라그랑주 승수. 이원적 문제 Q(α)는
                앞 항과 완전히 일치하고 <strong>αᵢ가 c보다 작거나 같다는 조건만 추가</strong>됨.
              </li>
              <li>
                · α̂ᵢ만 정해지면 ŵ = Σα̂ᵢyᵢxᵢ, ŵ₀의 값은 슬랙변수가 없는 경우와 완전히 일치하므로(식
                10-28, 10-29) 분류 시에도 동일한 분류함수를 씀.
              </li>
            </ul>
          </div>
        </div>
      </Sourced>

      <Sourced
        refs={{
          textbook: "10.2.4 슬랙변수를 가진 SVM (그림 10-6, 10-7)",
          slides: "슬랙변수를 가진 SVM",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">c를 바꿔 가며 학습해 보기</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            선형 분리가 불가능한 28개 데이터(● C₁, ○ C₂). c마다 Q(α)를 0 ≤ αᵢ ≤ c 조건으로 실제로 풀어
            얻은 결정경계. 빨간 선분은 ξᵢ &gt; 0인 데이터가 자기 클래스의 경계(플러스·마이너스 평면)까지
            떨어진 거리.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-sm font-bold">c =</span>
            {C_VALUES.map((c, i) => (
              <button
                key={c}
                onClick={() => setCi(i)}
                className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-colors ${
                  ci === i
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
            <svg viewBox={`0 0 ${F.width} ${F.height}`} className="w-full rounded-lg border border-gray-100 dark:border-gray-800">
              <rect x={0} y={0} width={F.width} height={F.height} fill="#ffffff" />
              {lines.plus && (
                <line
                  x1={s.sx(lines.plus[0][0])}
                  y1={s.sy(lines.plus[0][1])}
                  x2={s.sx(lines.plus[1][0])}
                  y2={s.sy(lines.plus[1][1])}
                  stroke={C1_COLOR}
                  strokeDasharray="5 3"
                />
              )}
              {lines.minus && (
                <line
                  x1={s.sx(lines.minus[0][0])}
                  y1={s.sy(lines.minus[0][1])}
                  x2={s.sx(lines.minus[1][0])}
                  y2={s.sy(lines.minus[1][1])}
                  stroke={C2_COLOR}
                  strokeDasharray="5 3"
                />
              )}
              {lines.zero && (
                <line
                  x1={s.sx(lines.zero[0][0])}
                  y1={s.sy(lines.zero[0][1])}
                  x2={s.sx(lines.zero[1][0])}
                  y2={s.sy(lines.zero[1][1])}
                  stroke="#c026d3"
                  strokeWidth="2"
                />
              )}
              {overlapData.map((d, i) => {
                const xi = r.xi[i];
                if (xi <= 1e-9) return null;
                // 법선 방향으로 g(x) = yᵢ 가 되는 곳까지 — 길이 ξᵢ/‖ŵ‖
                const t = (d.y - r.g[i]) / (wn * wn);
                const end: Vec = [d.x[0] + t * w[0], d.x[1] + t * w[1]];
                return (
                  <line
                    key={`xi${i}`}
                    x1={s.sx(d.x[0])}
                    y1={s.sy(d.x[1])}
                    x2={s.sx(end[0])}
                    y2={s.sy(end[1])}
                    stroke={ERR_COLOR}
                    strokeWidth="1.6"
                  />
                );
              })}
              {overlapData.map((d, i) => {
                const a = model.alpha[i];
                const atC = a >= r.c - 1e-8;
                return (
                  <g key={i}>
                    {a > 0 && (
                      <circle
                        cx={s.sx(d.x[0])}
                        cy={s.sy(d.x[1])}
                        r={8}
                        fill={atC ? "none" : SV_COLOR}
                        stroke={SV_COLOR}
                        strokeWidth={atC ? 1.4 : 0}
                        opacity={atC ? 0.9 : 0.35}
                      />
                    )}
                    <circle
                      cx={s.sx(d.x[0])}
                      cy={s.sy(d.x[1])}
                      r={4}
                      fill={d.y === 1 ? C1_COLOR : "#ffffff"}
                      stroke={d.y === 1 ? C1_COLOR : C2_COLOR}
                      strokeWidth={d.y === 1 ? 1 : 2}
                    />
                  </g>
                );
              })}
            </svg>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  ["마진 M = 2/‖ŵ‖", fmt(r.margin, 3)],
                  ["Σ ξᵢ", fmt(r.sumXi, 3)],
                  ["J(ŵ, ξ)", fmt(r.J, 3)],
                  ["ξᵢ > 0 (마진 침범)", `${r.inside}개`],
                  ["ξᵢ > 1 (오분류)", `${r.wrong}개`],
                  ["서포트 벡터 (α̂ᵢ > 0)", `${model.sv.length}개`],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800/60">
                    <p className="text-[10px] text-gray-500">{k}</p>
                    <p className="font-mono text-base font-bold">{v}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                <p className="text-[11px] font-bold text-gray-500">
                  α̂ᵢ와 상한 c — 채운 초록 원: 0 &lt; α̂ᵢ &lt; c, 빈 초록 원: α̂ᵢ = c ({model.bounded.length}개)
                </p>
                <div className="relative mt-2 flex h-20 items-end gap-[2px]">
                  <div className="absolute inset-x-0 top-2 border-t border-dashed border-rose-400" />
                  <span className="absolute right-0 top-0 text-[9px] text-rose-500">c = {r.c}</span>
                  {model.alpha.map((a, i) => (
                    <div
                      key={i}
                      className="min-w-0 flex-1 rounded-t"
                      style={{
                        height: `${(a / r.c) * 64}px`,
                        backgroundColor: overlapData[i].y === 1 ? C1_COLOR : C2_COLOR,
                      }}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                0 &lt; ξᵢ ≤ 1이면 올바른 쪽에 있지만 마진 안쪽으로 들어온 데이터, ξᵢ &gt; 1이면 결정경계를
                넘어 다른 클래스 영역에 있는 데이터(식 10-22에서 yᵢ(ŵᵀxᵢ + ŵ₀)가 음수가 됨). 빨간 선분의
                길이는 ξᵢ / ‖ŵ‖. ŵ₀는 0 &lt; α̂ᵢ &lt; c인 서포트 벡터로 평균해 구함 — α̂ᵢ = c인 데이터는
                평면 안쪽으로 들어와 있어 yᵢ − ŵᵀxᵢ가 ŵ₀와 같지 않기 때문.
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <p className="mb-1 text-xs font-bold text-gray-500">c에 따른 마진 M과 Σξᵢ</p>
            <svg viewBox="0 0 300 150" className="w-full min-w-[300px] max-w-[520px]">
              <line x1={30} y1={125} x2={290} y2={125} stroke="#cbd5e1" />
              {RESULTS.map((x, i) => (
                <text key={x.c} x={px(i)} y={140} fontSize="8" textAnchor="middle" fill="#94a3b8">
                  {x.c}
                </text>
              ))}
              <path
                d={RESULTS.map((x, i) => `${i === 0 ? "M" : "L"}${px(i)},${125 - (x.margin / maxM) * 105}`).join(" ")}
                fill="none"
                stroke={SV_COLOR}
                strokeWidth="2"
              />
              <path
                d={RESULTS.map((x, i) => `${i === 0 ? "M" : "L"}${px(i)},${125 - (x.sumXi / maxXi) * 105}`).join(" ")}
                fill="none"
                stroke={ERR_COLOR}
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <line x1={px(ci)} y1={14} x2={px(ci)} y2={125} stroke="#c026d3" strokeDasharray="2 2" />
              <text x={32} y={12} fontSize="9" fill="#059669">
                ━ 마진 M
              </text>
              <text x={100} y={12} fontSize="9" fill={ERR_COLOR}>
                ┅ Σξᵢ
              </text>
              <text x={290} y={148} fontSize="8" textAnchor="end" fill="#64748b">
                c (눈금 간격 일정하지 않음)
              </text>
            </svg>
            <p className="mt-2 rounded-lg bg-indigo-50 p-3 text-xs leading-relaxed text-gray-700 dark:bg-indigo-950/40 dark:text-gray-300">
              c를 키울수록 Σξᵢ가 줄어듦 — ξᵢ가 커지는 것을 강하게 저지해 오분류 허용도가 낮아짐. 대신
              마진은 좁아짐. c를 작게 하면 마진은 넓어지고 ξᵢ가 커지는 것을 더 허용함. 어느 쪽이든 결정경계는
              여전히 직선이라, 선형 분리가 불가능한 문제를 <strong>제한적으로만</strong> 해결함.
            </p>
          </div>
        </div>
      </Sourced>
    </section>
  );
}
