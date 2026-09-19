"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import {
  dot,
  gaussianKernel,
  linearKernel,
  phi,
  polyKernel,
  sigmoidKernel,
  type Vec,
} from "./svmCore";
import { fmt } from "./plotUtils";

const SIGMAS = [0.2, 0.5, 1, 2, 5];
const SIGMA_COLORS = ["#e11d48", "#f59e0b", "#10b981", "#4f46e5", "#64748b"];

function NumberStepper({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <label className="flex items-center gap-2 text-xs">
      <span className="w-8 shrink-0 font-mono font-bold">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="min-w-0 flex-1 accent-indigo-600"
      />
      <span className="w-10 text-right font-mono">{fmt(value, 2)}</span>
    </label>
  );
}

const STAGES = [
  {
    id: "①",
    text: (
      <>
        N개의 입출력 쌍으로 이루어진 학습 데이터 집합 X = {"{(xᵢ, yᵢ)}"}ᵢ₌₁,…,N을 준비하고,{" "}
        <mark className="rounded bg-amber-200 px-1 dark:bg-amber-700/60">하이퍼파라미터 c와 커널 함수 k(xᵢ, xⱼ)를 정의</mark>
        함. 목표 출력값은 yᵢ ∈ {"{−1, 1}"}.
      </>
    ),
  },
  {
    id: "②-1",
    text: (
      <>
        Q(α) = Σαᵢ − ½ΣΣαᵢαⱼyᵢyⱼ
        <mark className="rounded bg-amber-200 px-1 dark:bg-amber-700/60">k(xᵢ, xⱼ)</mark>, 조건 Σαᵢyᵢ = 0,{" "}
        <mark className="rounded bg-amber-200 px-1 dark:bg-amber-700/60">0 ≤ αᵢ ≤ c</mark> (i = 1, …, N)를 정의.
      </>
    ),
  },
  { id: "②-2", text: <>주어진 조건을 만족하면서 Q(α)를 최대화하는 추정치 α̂ᵢ를 이차계획법에 의해 찾음.</> },
  { id: "②-3", text: <>α̂ᵢ ≠ 0이 되는 서포트 벡터를 찾아 집합 Xₛ = {"{xᵢ ∈ X | α̂ᵢ ≠ 0}"}를 생성.</> },
  {
    id: "②-4",
    text: (
      <>
        ŵ₀ = (1/Nₛ) Σ_{"{xᵢ∈Xₛ}"} (yᵢ − Σ_{"{xⱼ∈Xₛ}"} α̂ⱼyⱼ
        <mark className="rounded bg-amber-200 px-1 dark:bg-amber-700/60">k(xᵢ, xⱼ)</mark>)를 계산. Nₛ는 Xₛ의 원소의 수.
      </>
    ),
  },
  { id: "②-5", text: <>서포트 벡터 집합 Xₛ와 파라미터 벡터 α̂, 그리고 ŵ₀를 저장.</> },
  {
    id: "③",
    text: (
      <>
        새로운 데이터 x가 주어지면 f(x) = sign(Σ_{"{xᵢ∈Xₛ}"} α̂ᵢyᵢ
        <mark className="rounded bg-amber-200 px-1 dark:bg-amber-700/60">k(xᵢ, x)</mark> + ŵ₀)로 분류.
      </>
    ),
  },
];

export default function KernelMethod() {
  const [x, setX] = useState<Vec>([1, 2]);
  const [y, setY] = useState<Vec>([1.5, -0.5]);
  const [view, setView] = useState<"linear" | "kernel">("kernel");
  const [pc, setPc] = useState(1);
  const [pd, setPd] = useState(2);
  const [t1, setT1] = useState(0.5);
  const [t2, setT2] = useState(-1);
  const [sigma, setSigma] = useState(1);

  const px = phi(x);
  const py = phi(y);
  const prods = [px[0] * py[0], px[1] * py[1], px[2] * py[2]];
  const phiDot = prods[0] + prods[1] + prods[2];
  const xy = dot(x, y);
  const kernelVal = xy * xy;
  const dist2 = (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2;

  const table = [
    { name: "선형 커널", en: "linear kernel", expr: "k(x, y) = (x·y)", value: linearKernel(x, y), params: "없음" },
    {
      name: "다항식 커널",
      en: "polynomial kernel",
      expr: "k(x, y) = (x·y + c)ᵈ",
      value: polyKernel(pc, pd)(x, y),
      params: `c = ${pc}, d = ${pd}`,
    },
    {
      name: "시그모이드 커널",
      en: "sigmoid kernel",
      expr: "k(x, y) = tanh(θ₁ x·y + θ₂)",
      value: sigmoidKernel(t1, t2)(x, y),
      params: `θ₁ = ${t1}, θ₂ = ${t2}`,
    },
    {
      name: "가우시안 커널",
      en: "gaussian kernel",
      expr: "k(x, y) = exp{−‖x − y‖² / 2σ²}",
      value: gaussianKernel(sigma)(x, y),
      params: `σ = ${sigma}`,
    },
  ];

  const GW = 300;
  const GH = 150;
  const gx = (r: number) => 30 + (r / 4) * (GW - 45);
  const gy = (k: number) => GH - 25 - k * (GH - 45);
  const curDist = Math.sqrt(dist2);

  return (
    <section>
      <SectionTitle
        title="10.3.2 커널법과 SVM"
        subtitle="고차원 매핑 Φ(x)를 직접 계산하지 않고, 두 벡터의 내적을 커널 함수 k(x, y)로 계산"
      />

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <Sourced
          refs={{
            textbook: "10.3.2 커널법과 SVM",
            slides: "커널법과 SVM — 커널 함수",
          }}
        >
          <div className="h-full rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/40">
            <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">커널 함수 (kernel function)</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              n차원의 입력 x를 m차원의 특징 데이터 Φ(x)로 매핑한 후 SVM으로 분류한다고 할 때, m이 아주
              크면 Φ(x)를 사용해 계산하는 것은 현실적이지 못함. 그런데 SVM의 연산은 개개의 값 Φ(x)가
              아니라 <strong>두 벡터의 내적 Φ(x)·Φ(y)</strong>를 사용함. 그래서 고차원 매핑 Φ(x)와 Φ(y)를
              직접 정의하는 대신 <strong>Φ(x)·Φ(y)를 하나의 함수 k(x, y)로 정의</strong>하여 사용하며, 이
              함수를 커널 함수라 함.
            </p>
          </div>
        </Sourced>
        <Sourced
          refs={{
            textbook: "10.3.2 커널법과 SVM",
            slides: "비선형 분류 문제의 해결 방법 — 커널법",
            lecture: "커널법은 고차원 매핑으로 비선형 문제를 선형화하면서 커널 함수로 계산량 증가 문제를 해결하는 방법이라는 정의를 그대로 기억하라고 강조",
          }}
        >
          <div className="h-full rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm font-bold">커널법 (kernel method)</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              <strong>
                고차원 매핑을 통해 비선형 문제를 선형화하여 해결하면서 커널 함수를 통해 계산량 증가의
                문제를 해결하는 방법.
              </strong>{" "}
              SVM을 비롯한 <strong>선형성을 가정하는 방법론</strong>에서 사용되고 있음.
            </p>
          </div>
        </Sourced>
      </div>

      <Sourced
        refs={{
          textbook: "10.3.2 커널법과 SVM (식 10-31)",
          slides: "커널법과 SVM — k(x, y) = Φ(x)·Φ(y) = (x·y)²",
          lecture: "결과식 (x·y)²는 3차원 벡터 연산이 아니라 원래 차원인 2차원 연산이라 계산량을 줄일 수 있다는 점을 짚음",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">커널 트릭 계산기 — Φ(x)·Φ(y)와 k(x, y) = (x·y)²가 같은 값인지 확인</h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
              <NumberStepper label="x₁" value={x[0]} onChange={(v) => setX([v, x[1]])} min={-2} max={2} step={0.5} />
              <NumberStepper label="x₂" value={x[1]} onChange={(v) => setX([x[0], v])} min={-2} max={2} step={0.5} />
            </div>
            <div className="space-y-1 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
              <NumberStepper label="y₁" value={y[0]} onChange={(v) => setY([v, y[1]])} min={-2} max={2} step={0.5} />
              <NumberStepper label="y₂" value={y[1]} onChange={(v) => setY([y[0], v])} min={-2} max={2} step={0.5} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="overflow-x-auto rounded-lg border border-rose-200 bg-rose-50 p-3 font-mono text-xs leading-6 dark:border-rose-900 dark:bg-rose-950/30">
              <p className="font-sans text-[11px] font-bold text-rose-700 dark:text-rose-300">
                방법 1 — 3차원으로 매핑한 뒤 내적
              </p>
              <p className="min-w-[280px]">
                Φ(x) = ({fmt(x[0] ** 2, 3)}, {fmt(px[1], 3)}, {fmt(x[1] ** 2, 3)})
              </p>
              <p className="min-w-[280px]">
                Φ(y) = ({fmt(y[0] ** 2, 3)}, {fmt(py[1], 3)}, {fmt(y[1] ** 2, 3)})
              </p>
              <p className="min-w-[280px]">
                Φ(x)·Φ(y) = {fmt(prods[0], 3)} + {fmt(prods[1], 3)} + {fmt(prods[2], 3)}
              </p>
              <p className="min-w-[280px] text-base font-bold">= {fmt(phiDot, 4)}</p>
              <p className="min-w-[280px] font-sans text-[11px] text-gray-500">
                곱셈: Φ(x), Φ(y) 만들기 4 + 4, 내적 3 → 11번 · 덧셈 2번
              </p>
            </div>
            <div className="overflow-x-auto rounded-lg border border-emerald-200 bg-emerald-50 p-3 font-mono text-xs leading-6 dark:border-emerald-900 dark:bg-emerald-950/30">
              <p className="font-sans text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                방법 2 — 원래 2차원에서 커널 함수로
              </p>
              <p className="min-w-[280px]">
                x·y = ({fmt(x[0], 2)})({fmt(y[0], 2)}) + ({fmt(x[1], 2)})({fmt(y[1], 2)}) = {fmt(xy, 3)}
              </p>
              <p className="min-w-[280px]">
                k(x, y) = (x·y)² = ({fmt(xy, 3)})²
              </p>
              <p className="min-w-[280px] text-base font-bold">= {fmt(kernelVal, 4)}</p>
              <p className="min-w-[280px] font-sans text-[11px] text-gray-500">곱셈: 내적 2 + 제곱 1 → 3번 · 덧셈 1번</p>
            </div>
          </div>
          <p
            className={`mt-3 rounded-lg p-2 text-center text-sm font-bold ${
              Math.abs(phiDot - kernelVal) < 1e-9
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            Φ(x)·Φ(y) = {fmt(phiDot, 4)} = (x·y)² = {fmt(kernelVal, 4)}
          </p>
          <div className="mt-3 overflow-x-auto rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
            <p className="min-w-[380px] font-mono text-xs leading-6">
              k(x, y) = Φ(x)·Φ(y) = (x₁², √2x₁x₂, x₂²)·(y₁², √2y₁y₂, y₂²) = x₁²y₁² + 2x₁x₂y₁y₂ + x₂²y₂² = (x₁y₁ +
              x₂y₂)² = (x·y)²
            </p>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            이 커널 함수를 사용하면 3차원 벡터를 이용한 연산 없이 원래 차원인 2차원에서의 계산만으로
            값이 얻어지므로 계산 비용의 문제를 해결할 수 있음.
          </p>
        </div>
      </Sourced>

      <Sourced
        refs={{
          textbook: "10.3.2 커널법과 SVM (식 10-32~10-34)",
          slides: "커널법과 SVM — 라그랑주 함수, 이원적 문제, 분류 함수",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">SVM 식에서 내적을 커널 함수로 바꾸기</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                ["linear", "선형 SVM (10.2절)"],
                ["kernel", "고차원 매핑 + 커널 함수"],
              ] as const
            ).map(([k, lbl]) => (
              <button
                key={k}
                onClick={() => setView(k)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  view === k
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
          <div className="mt-3 space-y-2 overflow-x-auto">
            {(view === "linear"
              ? [
                  ["라그랑주 함수", <>½‖w‖² − Σαᵢ{"{"}yᵢ(wᵀ<b className="text-indigo-600 dark:text-indigo-300">xᵢ</b> + w₀) − 1{"}"}</>, "식 10-11"],
                  ["이원적 문제", <>Q(α) = Σαᵢ − ½ΣΣαᵢαⱼyᵢyⱼ<b className="text-indigo-600 dark:text-indigo-300">xᵢᵀxⱼ</b></>, "식 10-14"],
                  ["분류 함수", <>f(x) = sign(Σα̂ᵢyᵢ<b className="text-indigo-600 dark:text-indigo-300">xᵢᵀx</b> + ŵ₀)</>, "식 10-19"],
                ]
              : [
                  ["라그랑주 함수", <>L(w, w₀, α) = ½‖w‖² − Σαᵢ{"{"}yᵢ(wᵀ<b className="text-rose-600 dark:text-rose-300">Φ(xᵢ)</b> + w₀) − 1{"}"}</>, "식 10-32"],
                  ["이원적 문제", <>Q(α) = Σαᵢ − ½ΣΣαᵢαⱼyᵢyⱼ<b className="text-rose-600 dark:text-rose-300">Φ(xᵢ)·Φ(xⱼ)</b> = Σαᵢ − ½ΣΣαᵢαⱼyᵢyⱼ<b className="text-emerald-600 dark:text-emerald-300">k(xᵢ, xⱼ)</b></>, "식 10-33"],
                  ["분류 함수", <>f(x) = sign(Σα̂ᵢyᵢ<b className="text-rose-600 dark:text-rose-300">Φ(x)·Φ(xᵢ)</b> + ŵ₀) = sign(Σα̂ᵢyᵢ<b className="text-emerald-600 dark:text-emerald-300">k(x, xᵢ)</b> + ŵ₀)</>, "식 10-34"],
                ]
            ).map(([name, eq, tag]) => (
              <div key={name as string} className="flex min-w-[520px] items-baseline gap-3 rounded-lg bg-gray-50 p-2 dark:bg-gray-800/60">
                <span className="w-24 shrink-0 text-xs font-bold text-gray-500">{name}</span>
                <span className="font-mono text-sm">{eq}</span>
                <span className="ml-auto shrink-0 text-[10px] text-gray-400">{tag}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            라그랑주 함수에는 고차원 벡터 Φ(x)가 주어지지만, 실제로 계산에 사용되는 이원적 문제의 함수
            Q(α)와 분류 함수는 <strong>커널 함수만으로 표현</strong>할 수 있음. 즉 입력 x 대신 Φ(x)를
            쓰되, 계산은 k로 원래 차원에서 함.
          </p>
        </div>
      </Sourced>

      <Sourced
        refs={{
          textbook: "10.3.2 커널법과 SVM (표 10-1 대표적인 커널 함수)",
          slides: "커널법과 SVM — 주로 사용되는 커널 함수",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">대표적인 커널 함수 — 위의 x, y로 직접 계산</h3>
          <p className="mt-1 text-xs text-gray-500">
            x = ({fmt(x[0], 2)}, {fmt(x[1], 2)}), y = ({fmt(y[0], 2)}, {fmt(y[1], 2)}) · x·y = {fmt(xy, 3)} · ‖x − y‖² ={" "}
            {fmt(dist2, 3)}
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700">
                  <th className="p-2 text-left">커널</th>
                  <th className="p-2 text-left">식</th>
                  <th className="p-2 text-left">하이퍼파라미터</th>
                  <th className="p-2 text-right">k(x, y)</th>
                </tr>
              </thead>
              <tbody>
                {table.map((row) => (
                  <tr key={row.name} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2">
                      <span className="font-bold">{row.name}</span>
                      <span className="block text-[10px] text-gray-400">{row.en}</span>
                    </td>
                    <td className="p-2 font-mono">{row.expr}</td>
                    <td className="p-2 font-mono text-indigo-600 dark:text-indigo-300">{row.params}</td>
                    <td className="p-2 text-right font-mono text-sm font-bold">{fmt(row.value, 4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="space-y-1 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
              <NumberStepper label="c" value={pc} onChange={setPc} min={0} max={3} step={0.5} />
              <NumberStepper label="d" value={pd} onChange={setPd} min={1} max={4} step={1} />
            </div>
            <div className="space-y-1 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
              <NumberStepper label="θ₁" value={t1} onChange={setT1} min={-2} max={2} step={0.25} />
              <NumberStepper label="θ₂" value={t2} onChange={setT2} min={-2} max={2} step={0.25} />
            </div>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            각 커널 함수는 고유의 파라미터(다항식 커널의 c와 d, 시그모이드 커널의 θ, 가우시안 커널의
            σ)를 가지고 있으며, 이는 문제의 성격에 맞추어 적절히 조정해 주어야 하는{" "}
            <strong>사용자 정의 파라미터(하이퍼파라미터)</strong>. 다항식 커널에서 c = 0, d = 2로 두면
            앞의 (x·y)²가 됨. 다항식 커널의 c는 슬랙변수의 하이퍼파라미터 c와 같은 글자지만 다른 값.
          </p>

          <div className="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
            <p className="text-[11px] font-bold text-gray-500">가우시안 커널 — 두 점 사이 거리에 따른 k 값과 σ</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SIGMAS.map((sg, i) => (
                <button
                  key={sg}
                  onClick={() => setSigma(sg)}
                  className={`rounded-lg px-2.5 py-1 font-mono text-xs font-medium ${
                    sigma === sg ? "text-white" : "bg-white text-gray-600 dark:bg-gray-900 dark:text-gray-400"
                  }`}
                  style={sigma === sg ? { backgroundColor: SIGMA_COLORS[i] } : undefined}
                >
                  σ = {sg}
                </button>
              ))}
            </div>
            <div className="mt-2 overflow-x-auto">
              <svg viewBox={`0 0 ${GW} ${GH}`} className="w-full min-w-[280px] max-w-[480px]">
                <line x1={30} y1={gy(0)} x2={GW - 10} y2={gy(0)} stroke="#cbd5e1" />
                <line x1={30} y1={gy(1)} x2={30} y2={gy(0)} stroke="#cbd5e1" />
                <text x={26} y={gy(1) + 3} fontSize="8" textAnchor="end" fill="#94a3b8">
                  1
                </text>
                <text x={26} y={gy(0) + 3} fontSize="8" textAnchor="end" fill="#94a3b8">
                  0
                </text>
                {[0, 1, 2, 3, 4].map((t) => (
                  <text key={t} x={gx(t)} y={gy(0) + 12} fontSize="8" textAnchor="middle" fill="#94a3b8">
                    {t}
                  </text>
                ))}
                <text x={GW - 10} y={GH - 3} fontSize="8" textAnchor="end" fill="#64748b">
                  ‖x − y‖
                </text>
                {SIGMAS.map((sg, i) => (
                  <path
                    key={sg}
                    d={Array.from({ length: 81 }, (_, j) => {
                      const r = (j / 80) * 4;
                      return `${j === 0 ? "M" : "L"}${gx(r).toFixed(1)},${gy(Math.exp(-(r * r) / (2 * sg * sg))).toFixed(1)}`;
                    }).join(" ")}
                    fill="none"
                    stroke={SIGMA_COLORS[i]}
                    strokeWidth={sigma === sg ? 2.5 : 1}
                    opacity={sigma === sg ? 1 : 0.35}
                  />
                ))}
                {curDist <= 4 && (
                  <g>
                    <line x1={gx(curDist)} y1={gy(0)} x2={gx(curDist)} y2={gy(1)} stroke="#0f172a" strokeDasharray="2 2" />
                    <circle cx={gx(curDist)} cy={gy(gaussianKernel(sigma)(x, y))} r={4} fill="#0f172a" />
                  </g>
                )}
              </svg>
            </div>
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              위의 x, y 사이 거리 {fmt(curDist, 3)}에서 σ = {sigma}이면 k = {fmt(gaussianKernel(sigma)(x, y), 4)}.
              σ가 작으면 조금만 떨어져도 k가 0에 가까워지고, σ가 크면 멀리 떨어진 점끼리도 k가 큼 — 이
              차이가 아래 실험에서 결정경계 모양의 차이로 나타남.
            </p>
          </div>
        </div>
      </Sourced>

      <Sourced
        refs={{
          textbook: "10.3.2 커널법과 SVM — SVM 분류기의 학습과 인식 단계",
          slides: "슬랙변수와 커널을 가진 SVM 분류기의 학습과 인식 과정",
          lecture: "선형 SVM 단계와 비교해 색으로 표시된 부분, 곧 커널 함수 k와 하이퍼파라미터 c, 그리고 αᵢ ≤ c 조건만 달라졌다고 정리",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">슬랙변수와 커널을 가진 SVM 분류기의 학습과 인식 단계</h3>
          <p className="mt-1 text-xs text-gray-500">
            노란 표시가 선형 SVM의 단계(10.2.3)에서 달라진 부분.
          </p>
          <ol className="mt-3 space-y-2">
            {STAGES.map((st) => (
              <li key={st.id} className="flex gap-3 rounded-lg bg-gray-50 p-3 text-sm leading-relaxed dark:bg-gray-800/60">
                <span className="w-10 shrink-0 font-bold text-indigo-600 dark:text-indigo-300">{st.id}</span>
                <span className="min-w-0 text-gray-700 dark:text-gray-300">{st.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </Sourced>
    </section>
  );
}
