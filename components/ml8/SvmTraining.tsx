"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Database } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { separableData } from "./svmData";
import {
  decision,
  linearKernel,
  linearWeights,
  trainSvm,
  type SmoStep,
  type Vec,
} from "./svmCore";
import { C1_COLOR, C2_COLOR, SV_COLOR, clipLine, fmt, makeScale, signed, type Frame } from "./plotUtils";

const F: Frame = { xMin: 0, xMax: 8.5, yMin: -0.5, yMax: 7.5, width: 320, height: 300, pad: 14 };
const s = makeScale(F);

/* 실제로 이원적 문제를 푼다 */
const rawTrace: SmoStep[] = [];
const MODEL = trainSvm(separableData, linearKernel, Infinity, rawTrace);
const W_HAT = linearWeights(MODEL);
const N = separableData.length;

/** Q(α)가 더 이상 눈에 띄게 변하지 않는 지점까지만 보여 준다 */
const TRACE: { alpha: number[]; q: number; b: number; pair: [number, number] | null }[] = (() => {
  const out: { alpha: number[]; q: number; b: number; pair: [number, number] | null }[] = [
    { alpha: new Array(N).fill(0), q: 0, b: 0, pair: null },
  ];
  for (const st of rawTrace) {
    out.push({ alpha: st.alpha, q: st.q, b: st.b, pair: st.pair });
    if (Math.abs(st.q - MODEL.q) < 1e-5 && out.length > 3) break;
  }
  out.push({ alpha: MODEL.alpha, q: MODEL.q, b: MODEL.w0, pair: null });
  return out;
})();

const label = (i: number) => `x${i + 1}`;
const vecStr = (v: Vec) => `(${v[0]}, ${v[1]})`;

const DERIVATION = [
  {
    title: "라그랑주 함수 만들기",
    eq: "J(w, w₀, α) = ½‖w‖² − Σᵢ αᵢ{yᵢ(wᵀxᵢ + w₀) − 1}",
    tag: "식 10-11",
    body: "최소화할 J(w) = ‖w‖²/2 (식 10-10)와 조건 yᵢ(wᵀxᵢ + w₀) − 1 ≥ 0 (식 10-8)을 라그랑주 승수 αᵢ ≥ 0 (i = 1, …, N)으로 묶어 하나의 함수식으로 표현. 이 함수를 w와 w₀에 대해 극소화하고 α = (α₁, …, α_N)에 대해 극대화하면 원하는 조건을 만족하는 파라미터를 찾을 수 있음.",
  },
  {
    title: "w에 대해 미분",
    eq: "∂J/∂w = w − Σᵢ αᵢyᵢxᵢ = 0  ⇒  w = Σᵢ αᵢyᵢxᵢ",
    tag: "식 10-12",
    body: "½‖w‖² = ½wᵀw를 w로 미분하면 w, 두 번째 항에서는 w와 곱해진 αᵢyᵢxᵢ만 남음.",
  },
  {
    title: "w₀에 대해 미분",
    eq: "∂J/∂w₀ = −Σᵢ αᵢyᵢ = 0",
    tag: "식 10-13",
    body: "w₀는 두 번째 항에만 αᵢyᵢw₀ 꼴로 들어 있으므로 αᵢyᵢ의 합만 남음.",
  },
  {
    title: "대입 → 이원적 문제 Q(α)",
    eq: "Q(α) = Σᵢ αᵢ − ½ Σᵢ Σⱼ αᵢαⱼyᵢyⱼxᵢᵀxⱼ,   Σᵢ αᵢyᵢ = 0,  αᵢ ≥ 0",
    tag: "식 10-14, 10-15",
    body: "w = Σαᵢyᵢxᵢ를 넣으면 ½‖w‖²는 ½ΣΣαᵢαⱼyᵢyⱼxᵢᵀxⱼ, Σαᵢyᵢwᵀxᵢ는 ΣΣαᵢαⱼyᵢyⱼxᵢᵀxⱼ가 되고, Σαᵢyᵢw₀는 Σαᵢyᵢ = 0이라 사라지며 Σαᵢ만 남음. α만으로 표현된 이 문제가 원래 라그랑주 함수에 대한 이원적 문제(dual problem). Q(α)는 αᵢ에 대한 이차함수이므로 이차계획법(quadratic programming)으로 간단히 해를 구할 수 있고, 유일한 최대값을 가짐.",
  },
  {
    title: "추정치 α̂로 ŵ, ŵ₀ 계산",
    eq: "ŵ = Σᵢ α̂ᵢyᵢxᵢ,   ŵ₀ = (1/N) Σᵢ (yᵢ − ŵᵀxᵢ) = (1/N) Σᵢ (yᵢ − Σⱼ α̂ⱼyⱼxⱼᵀxᵢ)",
    tag: "식 10-16, 10-17",
    body: "Q(α)를 최대화하는 추정치 α̂ᵢ를 찾으면 식 10-12, 10-13으로부터 ŵ와 ŵ₀도 찾을 수 있음. 학습 데이터 (xᵢ, yᵢ)와 α̂ᵢ만 있으면 파라미터가 모두 계산된다는 뜻.",
  },
];

const STEPS = [
  {
    id: "①",
    title: "학습 데이터 집합 준비",
    text: "N개의 입출력 쌍으로 이루어진 학습 데이터 집합 X = {(xᵢ, yᵢ)}ᵢ₌₁,…,N을 준비함. 이때 목표 출력값은 yᵢ ∈ {−1, 1}.",
    ex: `이 예: N = ${N}, C₁ 6개(yᵢ = +1), C₂ 6개(yᵢ = −1)`,
  },
  {
    id: "②-1",
    title: "목적함수 Q(α) 정의",
    text: "Q(α) = Σαᵢ − ½ΣΣαᵢαⱼyᵢyⱼxᵢᵀxⱼ, 조건 Σαᵢyᵢ = 0, αᵢ ≥ 0 (i = 1, …, N).",
    ex: "12개의 αᵢ에 대한 이차함수",
  },
  {
    id: "②-2",
    title: "이차계획법으로 α̂ᵢ 찾기",
    text: "주어진 조건을 만족하면서 Q(α)를 최대화하는 추정치 α̂ᵢ를 이차계획법에 의해 찾음.",
    ex: `Q(α̂) = ${fmt(MODEL.q, 4)}`,
  },
  {
    id: "②-3",
    title: "서포트 벡터 집합 Xₛ 생성",
    text: "α̂ᵢ ≠ 0이 되는 서포트 벡터를 찾아 집합 Xₛ = {xᵢ ∈ X | α̂ᵢ ≠ 0}를 생성함.",
    ex: `Xₛ = {${MODEL.sv.map((i) => vecStr(separableData[i].x)).join(", ")}}, Nₛ = ${MODEL.sv.length}`,
  },
  {
    id: "②-4",
    title: "ŵ₀ 계산",
    text: "ŵ₀ = (1/Nₛ) Σ_{xᵢ∈Xₛ} (yᵢ − Σ_{xⱼ∈Xₛ} α̂ⱼyⱼxⱼᵀxᵢ). Nₛ는 집합 Xₛ의 원소의 수.",
    ex: `ŵ₀ = ${fmt(MODEL.w0, 4)}`,
  },
  {
    id: "②-5",
    title: "저장",
    text: "서포트 벡터 집합 Xₛ와 파라미터 벡터 α̂, 그리고 ŵ₀를 저장해 둠.",
    ex: `저장: 서포트 벡터 ${MODEL.sv.length}개, α̂ ${MODEL.sv.length}개, ŵ₀ 1개`,
  },
  {
    id: "③",
    title: "새 데이터 분류",
    text: "새로운 데이터 x가 주어지면 저장해 둔 서포트 벡터와 파라미터를 이용해 f(x) = sign(Σ_{xᵢ∈Xₛ} α̂ᵢyᵢxᵢᵀx + ŵ₀)로 분류를 수행함.",
    ex: "아래 그림을 눌러 직접 분류",
  },
];

export default function SvmTraining() {
  const [derivStep, setDerivStep] = useState(0);
  const [k, setK] = useState(TRACE.length - 1);
  const [probe, setProbe] = useState<Vec>([3.5, 3]);
  const [stage, setStage] = useState(0);

  const cur = TRACE[k];
  const curModel = useMemo(() => {
    let w0 = 0;
    let w1 = 0;
    cur.alpha.forEach((a, i) => {
      w0 += a * separableData[i].y * separableData[i].x[0];
      w1 += a * separableData[i].y * separableData[i].x[1];
    });
    return { w: [w0, w1] as Vec, b: cur.b };
  }, [cur]);
  const curLine =
    Math.hypot(curModel.w[0], curModel.w[1]) > 1e-9 ? clipLine(curModel.w, curModel.b, F) : null;

  const svTerms = MODEL.sv.map((i) => {
    const d = separableData[i];
    const ip = d.x[0] * probe[0] + d.x[1] * probe[1];
    return { i, a: MODEL.alpha[i], y: d.y, ip, term: MODEL.alpha[i] * d.y * ip };
  });
  const gProbe = decision(MODEL, probe);

  const sumAlphaY = MODEL.alpha.reduce((acc, a, i) => acc + a * separableData[i].y, 0);
  const w0Parts = MODEL.sv.map((i) => {
    const d = separableData[i];
    let inner = 0;
    for (const j of MODEL.sv) {
      const dj = separableData[j];
      inner += MODEL.alpha[j] * dj.y * (dj.x[0] * d.x[0] + dj.x[1] * d.x[1]);
    }
    return { i, value: d.y - inner };
  });
  /** 식 10-17을 모든 학습 데이터 N개에 대해 그대로 평균한 값 — 비교용 */
  const w0AllN =
    separableData.reduce((acc, d) => acc + d.y - (W_HAT[0] * d.x[0] + W_HAT[1] * d.x[1]), 0) / N;

  const onPick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const m = svg.getScreenCTM();
    if (!m) return;
    const p = pt.matrixTransform(m.inverse());
    const [x, y] = s.inv(p.x, p.y);
    setProbe([
      Math.max(F.xMin, Math.min(F.xMax, Number(x.toFixed(1)))),
      Math.max(F.yMin, Math.min(F.yMax, Number(y.toFixed(1)))),
    ]);
  };

  const maxAlpha = Math.max(...MODEL.alpha) * 1.25;
  const qMax = MODEL.q * 1.15;

  return (
    <section>
      <SectionTitle
        title="10.2.2~10.2.3 SVM의 학습과 분류"
        subtitle="라그랑주 승수로 이원적 문제 Q(α)를 세우고, 실제로 풀어서 ŵ, ŵ₀와 서포트 벡터를 얻기"
      />

      {/* 학습 데이터와 조건 */}
      <Sourced
        refs={{
          textbook: "10.2.2 SVM의 학습 (식 10-7~10-10)",
          slides: "SVM의 학습 — 추정해야 할 파라미터가 만족해야 하는 조건",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">학습 데이터와 파라미터가 만족해야 하는 조건</h3>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
              <p className="text-[11px] font-bold text-gray-500">학습 데이터 (식 10-7)</p>
              <p className="mt-1 font-mono text-xs leading-6">
                {"{(xᵢ, yᵢ)}"}ᵢ₌₁,…,N
                <br />
                yᵢ = +1 if xᵢ ∈ C₁
                <br />
                yᵢ = −1 if xᵢ ∈ C₂
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
              <p className="text-[11px] font-bold text-gray-500">두 조건을 하나로 (식 10-9 → 10-8)</p>
              <p className="mt-1 font-mono text-xs leading-6">
                wᵀxᵢ + w₀ ≥ +1 for yᵢ = +1
                <br />
                wᵀxᵢ + w₀ ≤ −1 for yᵢ = −1
                <br />⇒ yᵢ(wᵀxᵢ + w₀) − 1 ≥ 0
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
                모든 데이터에 대해 제대로 분류를 수행하기 위한 조건. yᵢ = −1을 곱하면 부등호 방향이
                바뀌어 두 식이 같은 꼴이 됨.
              </p>
            </div>
            <div className="rounded-lg bg-indigo-50 p-3 dark:bg-indigo-950/40">
              <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-300">
                최소화할 목적함수 (식 10-10)
              </p>
              <p className="mt-1 font-mono text-sm">J(w) = ‖w‖² / 2</p>
              <p className="mt-1 text-[11px] leading-relaxed text-gray-600 dark:text-gray-400">
                마진 최대화 = ‖w‖ 최소화. 하나의 함수식을 최소화하는 동시에 다른 조건을 만족하는
                파라미터를 찾아야 하므로 <strong>라그랑주 승수를 이용한 최적화 방법</strong>을 적용.
              </p>
            </div>
          </div>
        </div>
      </Sourced>

      {/* 유도 단계 */}
      <Sourced
        refs={{
          textbook: "10.2.2 SVM의 학습 (식 10-11~10-17)",
          slides: "SVM의 학습 — 라그랑주 함수, 이원적 문제",
          lecture: "수식이 어렵다면 넘어가도 되고, 라그랑주 함수 → 미분 → 대입 → Q(α) → 이차계획법으로 이어지는 흐름만 잡으라고 안내",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">라그랑주 함수에서 이원적 문제까지</h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {DERIVATION.map((d, i) => (
              <button
                key={d.title}
                onClick={() => setDerivStep(i)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  derivStep === i
                    ? "bg-indigo-600 text-white"
                    : i < derivStep
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {i + 1}. {d.title}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={derivStep}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="mt-4"
            >
              <div className="overflow-x-auto rounded-lg bg-indigo-50 p-3 dark:bg-indigo-950/40">
                <p className="min-w-[420px] font-mono text-sm">{DERIVATION[derivStep].eq}</p>
                <p className="mt-1 text-[11px] text-gray-500">({DERIVATION[derivStep].tag})</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {DERIVATION[derivStep].body}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setDerivStep((v) => Math.max(0, v - 1))}
              disabled={derivStep === 0}
              className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 disabled:opacity-40 dark:bg-gray-800 dark:text-gray-400"
            >
              <ChevronLeft size={14} /> 이전
            </button>
            <button
              onClick={() => setDerivStep((v) => Math.min(DERIVATION.length - 1, v + 1))}
              disabled={derivStep === DERIVATION.length - 1}
              className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40"
            >
              다음 <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </Sourced>

      {/* Q(α) 최대화 실제 풀이 */}
      <Sourced
        refs={{
          textbook: "10.2.2 SVM의 학습 — 이차계획법",
          slides: "SVM의 학습 — 이차계획법을 이용하여 Q(α)를 극대화하는 α̂ᵢ",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">Q(α) 최대화를 실제로 풀어 보기</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            앞 절의 12개 데이터로 Q(α)를 이차계획법으로 풀어 가는 과정. 여기서는 조건 Σαᵢyᵢ = 0을
            지키도록 두 개의 αᵢ를 한 쌍씩 골라 Q(α)가 커지는 쪽으로 고치는 방식으로 계산함. 단계를
            움직이면 α, Q(α), 그때의 결정경계가 함께 바뀜.
          </p>

          <label className="mt-4 flex items-center gap-3 text-sm">
            <span className="shrink-0 font-bold">단계</span>
            <input
              type="range"
              min={0}
              max={TRACE.length - 1}
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
              className="min-w-0 flex-1 accent-indigo-600"
            />
            <span className="w-20 text-right font-mono text-xs">
              {k === 0 ? "시작" : k === TRACE.length - 1 ? "최종 α̂" : `${k}회 갱신`}
            </span>
          </label>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <svg viewBox={`0 0 ${F.width} ${F.height}`} className="w-full rounded-lg border border-gray-100 dark:border-gray-800">
                <rect x={0} y={0} width={F.width} height={F.height} fill="#ffffff" />
                {curLine && (
                  <line
                    x1={s.sx(curLine[0][0])}
                    y1={s.sy(curLine[0][1])}
                    x2={s.sx(curLine[1][0])}
                    y2={s.sy(curLine[1][1])}
                    stroke="#c026d3"
                    strokeWidth="2"
                  />
                )}
                {separableData.map((d, i) => {
                  const on = cur.alpha[i] > 0;
                  const inPair = cur.pair?.includes(i);
                  return (
                    <g key={i}>
                      {on && <circle cx={s.sx(d.x[0])} cy={s.sy(d.x[1])} r={10} fill={SV_COLOR} opacity={0.3} />}
                      {inPair && (
                        <circle cx={s.sx(d.x[0])} cy={s.sy(d.x[1])} r={13} fill="none" stroke="#0f172a" strokeDasharray="2 2" />
                      )}
                      <circle
                        cx={s.sx(d.x[0])}
                        cy={s.sy(d.x[1])}
                        r={4.5}
                        fill={d.y === 1 ? C1_COLOR : "#ffffff"}
                        stroke={d.y === 1 ? C1_COLOR : C2_COLOR}
                        strokeWidth={d.y === 1 ? 1 : 2}
                      />
                      <text x={s.sx(d.x[0]) + 7} y={s.sy(d.x[1]) + 3} fontSize="8" fill="#64748b">
                        {label(i)}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <p className="mt-1 text-[11px] text-gray-400">
                초록: 현재 αᵢ &gt; 0인 데이터 · 점선 원: 이번 단계에서 고친 한 쌍
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                <p className="text-[11px] font-bold text-gray-500">αᵢ 값</p>
                <div className="mt-2 flex h-24 items-end gap-1">
                  {cur.alpha.map((a, i) => (
                    <div key={i} className="flex min-w-0 flex-1 flex-col items-center justify-end">
                      <span className="text-[8px] text-gray-500">{a > 0 ? fmt(a, 3) : ""}</span>
                      <div
                        className="w-full rounded-t"
                        style={{
                          height: `${(a / maxAlpha) * 64}px`,
                          backgroundColor: separableData[i].y === 1 ? C1_COLOR : C2_COLOR,
                        }}
                      />
                      <span className="mt-0.5 text-[8px] text-gray-400">{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                <p className="text-[11px] font-bold text-gray-500">Q(α)의 변화</p>
                <svg viewBox="0 0 260 90" className="mt-1 w-full">
                  <line x1={20} y1={78} x2={255} y2={78} stroke="#cbd5e1" />
                  <line x1={20} y1={78 - (MODEL.q / qMax) * 70} x2={255} y2={78 - (MODEL.q / qMax) * 70} stroke={SV_COLOR} strokeDasharray="3 2" />
                  <text x={253} y={78 - (MODEL.q / qMax) * 70 - 3} fontSize="8" textAnchor="end" fill="#059669">
                    최대 Q(α̂) = {fmt(MODEL.q, 4)}
                  </text>
                  <path
                    d={TRACE.map((t, i) => `${i === 0 ? "M" : "L"}${20 + (i / (TRACE.length - 1)) * 235},${78 - (t.q / qMax) * 70}`).join(" ")}
                    fill="none"
                    stroke={C1_COLOR}
                    strokeWidth="1.8"
                  />
                  <circle cx={20 + (k / (TRACE.length - 1)) * 235} cy={78 - (cur.q / qMax) * 70} r={4} fill="#c026d3" />
                </svg>
                <p className="font-mono text-xs">
                  Q(α) = {fmt(cur.q, 4)} · Σαᵢyᵢ ={" "}
                  {fmt(cur.alpha.reduce((acc, a, i) => acc + a * separableData[i].y, 0), 6)}
                </p>
              </div>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                고칠 때마다 Q(α)는 줄지 않고 커지며, 끝에는 α̂ = (1/8, 1/8, 1/4)만 남고 나머지
                9개는 0이 됨. Q(α)는 α에 대한 이차함수로 유일한 최대값을 가지므로, 고치기를 되풀이하면 그 최대값에
                도달함.
              </p>
            </div>
          </div>
        </div>
      </Sourced>

      {/* 결과 표 */}
      <Sourced
        refs={{
          textbook: "10.2.2 SVM의 학습 — 추정치 α̂ᵢ의 성질",
          slides: "SVM의 학습 — 대부분의 라그랑주 승수 α̂ᵢ는 0",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">최종 α̂ᵢ — 서포트 벡터만 0이 아님</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700">
                  <th className="p-1.5 text-left">i</th>
                  <th className="p-1.5 text-left">xᵢ</th>
                  <th className="p-1.5 text-center">yᵢ</th>
                  <th className="p-1.5 text-right">α̂ᵢ</th>
                  <th className="p-1.5 text-right">yᵢ(ŵᵀxᵢ + ŵ₀) − 1</th>
                  <th className="p-1.5 text-left">판정</th>
                </tr>
              </thead>
              <tbody>
                {separableData.map((d, i) => {
                  const slack = d.y * decision(MODEL, d.x) - 1;
                  const sv = MODEL.alpha[i] > 0;
                  return (
                    <tr
                      key={i}
                      className={`border-b border-gray-100 font-mono dark:border-gray-800 ${
                        sv ? "bg-emerald-50 dark:bg-emerald-950/30" : ""
                      }`}
                    >
                      <td className="p-1.5">{i + 1}</td>
                      <td className="p-1.5">{vecStr(d.x)}</td>
                      <td className="p-1.5 text-center">{d.y > 0 ? "+1" : "−1"}</td>
                      <td className="p-1.5 text-right font-bold">{fmt(MODEL.alpha[i], 4)}</td>
                      <td className="p-1.5 text-right">{fmt(slack, 3)}</td>
                      <td className="p-1.5 font-sans">
                        {sv ? (
                          <span className="font-bold text-emerald-700 dark:text-emerald-300">
                            = 0 → 서포트 벡터
                          </span>
                        ) : (
                          <span className="text-gray-400">&gt; 0 → α̂ᵢ = 0</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="overflow-x-auto rounded-lg bg-gray-50 p-3 font-mono text-xs leading-6 dark:bg-gray-800/60">
              <p className="font-sans text-[11px] font-bold text-gray-500">ŵ = Σ α̂ᵢyᵢxᵢ (식 10-16)</p>
              {MODEL.sv.map((i) => (
                <p key={i} className="min-w-[260px]">
                  {signed(MODEL.alpha[i] * separableData[i].y, 3)} × {vecStr(separableData[i].x)}
                </p>
              ))}
              <p className="min-w-[260px] font-bold">
                = ({fmt(W_HAT[0], 3)}, {fmt(W_HAT[1], 3)})
              </p>
              <p className="min-w-[260px] text-gray-500">검산 Σ α̂ᵢyᵢ = {fmt(sumAlphaY, 6)}</p>
            </div>
            <div className="overflow-x-auto rounded-lg bg-gray-50 p-3 font-mono text-xs leading-6 dark:bg-gray-800/60">
              <p className="font-sans text-[11px] font-bold text-gray-500">
                ŵ₀ = (1/Nₛ) Σ_{"{xᵢ∈Xₛ}"} (yᵢ − Σⱼ α̂ⱼyⱼxⱼᵀxᵢ)
              </p>
              {w0Parts.map((p) => (
                <p key={p.i} className="min-w-[260px]">
                  {label(p.i)}: yᵢ − ŵᵀxᵢ = {fmt(p.value, 3)}
                </p>
              ))}
              <p className="min-w-[260px] font-bold">
                ŵ₀ = ({w0Parts.map((p) => fmt(p.value, 3)).join(" + ")}) / {MODEL.sv.length} ={" "}
                {fmt(MODEL.w0, 3)}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            결정경계와 떨어져 있는 데이터는 yᵢ(ŵᵀxᵢ + ŵ₀) − 1 &gt; 0이라, 라그랑주 함수를 최대화하는
            음이 아닌 αᵢ는 0이 됨. 오직 yᵢ(ŵᵀxᵢ + ŵ₀) − 1 = 0인 데이터, 곧 결정경계에 가장 가까이
            있어 마진을 결정하는 서포트 벡터만 α̂ᵢ ≠ 0. 서포트 벡터에서는 yᵢ − ŵᵀxᵢ가 모두 같은 값
            ŵ₀가 되므로 학습 단계 ②-4에서는 서포트 벡터 Nₛ개로 평균함. 참고로 식 10-17처럼 학습
            데이터 N = {N}개 전체로 평균하면 이 데이터에서는 {fmt(w0AllN, 3)}로 달라지는데, 서포트
            벡터가 아닌 데이터에서는 yᵢ − ŵᵀxᵢ가 ŵ₀와 같지 않기 때문.
          </p>
        </div>
      </Sourced>

      {/* 분류 */}
      <Sourced
        refs={{
          textbook: "10.2.3 SVM에 의한 분류 (식 10-18, 10-19)",
          slides: "SVM에 의한 분류",
          lecture: "모든 학습 데이터의 α를 저장할 필요 없이 서포트 벡터에 해당하는 α와 데이터만 저장하면 되어 저장량과 계산량이 현격히 줄어든다는 점을 결론으로 짚음",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">새로운 데이터의 분류 — 서포트 벡터만으로 계산</h3>
          <div className="mt-2 overflow-x-auto rounded-lg bg-indigo-50 p-3 dark:bg-indigo-950/40">
            <p className="min-w-[420px] font-mono text-sm">
              f(x) = sign(ŵᵀx + ŵ₀) = sign(Σᵢ α̂ᵢyᵢxᵢᵀx + ŵ₀){" "}
              <span className="text-xs text-gray-500">(식 10-19)</span>
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              sign(x)는 부호함수로 x가 양수이면 +1, 음수이면 −1. 결과가 1이면 C₁, −1이면 C₂.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
            <svg
              viewBox={`0 0 ${F.width} ${F.height}`}
              className="w-full cursor-crosshair rounded-lg border border-gray-100 dark:border-gray-800"
              onClick={onPick}
            >
              <rect x={0} y={0} width={F.width} height={F.height} fill="#ffffff" />
              {(() => {
                const l = clipLine(W_HAT, MODEL.w0, F);
                return l ? (
                  <line x1={s.sx(l[0][0])} y1={s.sy(l[0][1])} x2={s.sx(l[1][0])} y2={s.sy(l[1][1])} stroke="#c026d3" strokeWidth="2" />
                ) : null;
              })()}
              {separableData.map((d, i) => {
                const sv = MODEL.alpha[i] > 0;
                return (
                  <g key={i} opacity={sv ? 1 : 0.25}>
                    {sv && <circle cx={s.sx(d.x[0])} cy={s.sy(d.x[1])} r={10} fill={SV_COLOR} opacity={0.35} />}
                    <circle
                      cx={s.sx(d.x[0])}
                      cy={s.sy(d.x[1])}
                      r={4.5}
                      fill={d.y === 1 ? C1_COLOR : "#ffffff"}
                      stroke={d.y === 1 ? C1_COLOR : C2_COLOR}
                      strokeWidth={d.y === 1 ? 1 : 2}
                    />
                  </g>
                );
              })}
              <rect
                x={s.sx(probe[0]) - 6}
                y={s.sy(probe[1]) - 6}
                width={12}
                height={12}
                fill={gProbe > 0 ? C1_COLOR : C2_COLOR}
                stroke="#0f172a"
                strokeWidth="1.5"
                transform={`rotate(45 ${s.sx(probe[0])} ${s.sy(probe[1])})`}
              />
              <text x={s.sx(probe[0]) + 10} y={s.sy(probe[1]) - 8} fontSize="10" fontWeight="bold" fill="#0f172a">
                x ({probe[0]}, {probe[1]})
              </text>
            </svg>
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-lg bg-gray-50 p-3 font-mono text-xs leading-6 dark:bg-gray-800/60">
                {svTerms.map((t) => (
                  <p key={t.i} className="min-w-[300px]">
                    α̂{t.i + 1}y{t.i + 1}x{t.i + 1}ᵀx = {fmt(t.a, 3)} × ({t.y > 0 ? "+1" : "−1"}) × {fmt(t.ip, 2)} ={" "}
                    {fmt(t.term, 3)}
                  </p>
                ))}
                <p className="min-w-[300px]">+ ŵ₀ = {fmt(MODEL.w0, 3)}</p>
                <p className="min-w-[300px] font-bold">
                  합 = {fmt(gProbe, 3)} → f(x) = {gProbe > 0 ? "+1 → C₁" : gProbe < 0 ? "−1 → C₂" : "0"}
                </p>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-xs leading-relaxed text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                <Database size={14} className="mt-0.5 shrink-0" />
                <span>
                  학습 데이터가 많으면 f(x) 계산을 위해 저장할 데이터와 계산량이 커질 수 있으나,
                  대부분의 α̂ᵢ가 0이 되어 사라짐. 이 예에서는 학습 데이터 {N}개 중 서포트 벡터{" "}
                  {MODEL.sv.length}개만 저장하면 되고, 합도 {MODEL.sv.length}개 항만 계산함.
                </span>
              </div>
            </div>
          </div>
        </div>
      </Sourced>

      {/* 학습과 인식 단계 */}
      <Sourced
        refs={{
          textbook: "10.2.3 SVM에 의한 분류 — 선형 SVM 분류기의 학습과 인식 단계",
          slides: "선형 SVM 분류기의 학습과 인식 단계",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">선형 SVM 분류기의 학습과 인식 단계</h3>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[180px_minmax(0,1fr)]">
            <div className="flex flex-wrap gap-1.5 sm:flex-col">
              {STEPS.map((st, i) => (
                <button
                  key={st.id}
                  onClick={() => setStage(i)}
                  className={`rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-colors ${
                    stage === i
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {st.id} {st.title}
                </button>
              ))}
            </div>
            <div className="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-950/40">
              <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                {STEPS[stage].id} {STEPS[stage].title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{STEPS[stage].text}</p>
              <p className="mt-3 rounded bg-white/70 p-2 font-mono text-xs text-gray-700 dark:bg-gray-900/60 dark:text-gray-300">
                {STEPS[stage].ex}
              </p>
            </div>
          </div>
        </div>
      </Sourced>
    </section>
  );
}
