"use client";

import { useState, type ReactNode } from "react";
import {
  Eye,
  GitBranch,
  Grid3X3,
  Layers,
  Network,
  RotateCcw,
  Sigma,
  SlidersHorizontal,
  Target,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

type Tone = "cyan" | "emerald" | "rose" | "violet" | "amber";

const toneClasses: Record<Tone, string> = {
  cyan: "bg-cyan-500",
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
};

function fmt(value: number) {
  if (!Number.isFinite(value)) return "-";
  return Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

function softmax(values: number[]) {
  const max = Math.max(...values);
  const expValues = values.map((value) => Math.exp(value - max));
  const expSum = expValues.reduce((sum, value) => sum + value, 0);
  return expValues.map((value) => value / expSum);
}

function LabFrame({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-teal-200 bg-white p-6 shadow-sm dark:border-teal-900 dark:bg-gray-900">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
          {icon}
        </div>
        <SectionTitle title={title} subtitle={subtitle} />
      </div>
      {children}
    </section>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-3 text-sm font-bold text-teal-700 dark:text-teal-300">{title}</div>
      {children}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="mb-3 block text-xs font-semibold text-gray-600 dark:text-gray-300">
      <div className="mb-1 flex items-center justify-between gap-3">
        <span>{label}</span>
        <span className="font-mono">{fmt(value)}</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-teal-500"
      />
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm dark:bg-gray-900">
      <span className="text-gray-600 dark:text-gray-300">{label}</span>
      <span className="font-mono font-bold">{typeof value === "number" ? fmt(value) : value}</span>
    </div>
  );
}

function Bar({ label, value, tone = "cyan" }: { label: string; value: number; tone?: Tone }) {
  const width = clamp(value, 0, 1) * 100;
  return (
    <div className="mb-3">
      <div className="mb-1 flex justify-between text-xs font-semibold">
        <span>{label}</span>
        <span className="font-mono">{fmt(value)}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800">
        <div className={`h-2 rounded-full transition-all ${toneClasses[tone]}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-3 py-2 text-xs font-bold transition ${
        active
          ? "border-teal-500 bg-teal-500 text-white"
          : "border-gray-200 bg-white text-gray-600 hover:border-teal-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
      }`}
    >
      {children}
    </button>
  );
}

function StepList({ steps, active }: { steps: string[]; active: number }) {
  return (
    <div className="space-y-2">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`rounded-md border px-3 py-2 text-xs leading-5 ${
            index <= active
              ? "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950/50 dark:text-teal-200"
              : "border-gray-200 bg-white text-gray-500 dark:border-gray-800 dark:bg-gray-900"
          }`}
        >
          <span className="mr-2 font-mono font-bold">{index + 1}</span>
          {step}
        </div>
      ))}
    </div>
  );
}

function triangular(x: number, left: number, peak: number, right: number) {
  if (x <= left || x >= right) return 0;
  if (x === peak) return 1;
  if (x < peak) return (x - left) / (peak - left);
  return (right - x) / (right - peak);
}

function FuzzyLab() {
  const [x, setX] = useState(5);
  const [muB, setMuB] = useState(0.55);
  const muA = triangular(x, 1, 4, 8);
  const union = Math.max(muA, muB);
  const intersection = Math.min(muA, muB);
  const complement = 1 - muA;
  const implication = Math.min(1, 1 - muA + muB);
  const defuzz = union + intersection === 0 ? 0 : (union * 75 + intersection * 35) / (union + intersection);

  return (
    <LabFrame title="퍼지집합 연산과 추론 계산" subtitle="소속도 값을 바꾸며 max/min/보수와 비퍼지화 결과를 확인" icon={<SlidersHorizontal size={18} />}>
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="소속함수">
          <Slider label="입력 x" value={x} min={0} max={10} step={0.1} onChange={setX} />
          <Bar label="μA(x)" value={muA} tone="cyan" />
          <Bar label="μB(x)" value={muB} tone="amber" />
          <Slider label="μB 직접 조정" value={muB} min={0} max={1} step={0.05} onChange={setMuB} />
        </Panel>
        <Panel title="연산표">
          <div className="space-y-2">
            <Stat label="A∪B=max" value={union} />
            <Stat label="A∩B=min" value={intersection} />
            <Stat label="A보수=1-A" value={complement} />
            <Stat label="a→b=min(1,1-a+b)" value={implication} />
          </div>
        </Panel>
        <Panel title="추론 단계">
          <StepList
            active={3}
            steps={[
              `입력 퍼지화: μA=${fmt(muA)}, μB=${fmt(muB)}`,
              `규칙 강도: min(μA, μB)=${fmt(intersection)}`,
              `결론 결합: max 계열 값 ${fmt(union)}`,
              `비퍼지화 예시 출력 ${fmt(defuzz)}`,
            ]}
          />
        </Panel>
      </div>
    </LabFrame>
  );
}

const visionMatrix = [
  [20, 35, 170, 190],
  [25, 160, 180, 70],
  [40, 55, 150, 210],
  [30, 45, 90, 220],
];

function Vision8Lab() {
  const [threshold, setThreshold] = useState(140);
  const [mode, setMode] = useState<4 | 8>(4);
  const [quantLevels, setQuantLevels] = useState(4);
  const objectCount = visionMatrix.flat().filter((value) => value >= threshold).length;
  const quantize = (value: number) => Math.floor(value / (256 / quantLevels)) * (256 / quantLevels);

  return (
    <LabFrame title="픽셀 연결성과 임계값 분할" subtitle="밝기 행렬을 직접 이진화하고 4-이웃/8-이웃 기준 차이를 판별" icon={<Grid3X3 size={18} />}>
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="처리 단계">
          <StepList active={2} steps={["영상 취득", "전처리", "영상 분할", "정규화", "영상 표현", "분석"]} />
        </Panel>
        <Panel title="이웃 연결성">
          <div className="mb-3 flex gap-2">
            <Toggle active={mode === 4} onClick={() => setMode(4)}>4-이웃</Toggle>
            <Toggle active={mode === 8} onClick={() => setMode(8)}>8-이웃</Toggle>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 9 }).map((_, index) => {
              const row = Math.floor(index / 3);
              const col = index % 3;
              const isCenter = row === 1 && col === 1;
              const isNeighbor = mode === 8 || row === 1 || col === 1;
              return (
                <div
                  key={index}
                  className={`flex aspect-square items-center justify-center rounded border text-xs font-bold ${
                    isCenter
                      ? "border-teal-500 bg-teal-500 text-white"
                      : isNeighbor
                        ? "border-cyan-300 bg-cyan-100 text-cyan-700 dark:bg-cyan-950"
                        : "border-gray-200 bg-white text-gray-400 dark:border-gray-800 dark:bg-gray-900"
                  }`}
                >
                  {isCenter ? "p" : isNeighbor ? "n" : ""}
                </div>
              );
            })}
          </div>
        </Panel>
        <Panel title="임계치 분할">
          <Slider label="임계값" value={threshold} min={30} max={220} step={5} onChange={setThreshold} />
          <Slider label="양자화 단계" value={quantLevels} min={2} max={16} step={2} onChange={setQuantLevels} />
          <div className="grid grid-cols-4 gap-1">
            {visionMatrix.flat().map((value, index) => (
              <div
                key={`${value}-${index}`}
                className={`flex aspect-square items-center justify-center rounded text-[11px] font-mono ${
                  value >= threshold ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                }`}
                title={`quantized=${fmt(quantize(value))}`}
              >
                {value}
              </div>
            ))}
          </div>
          <div className="mt-3">
            <Stat label="객체 픽셀 수" value={objectCount} />
          </div>
        </Panel>
      </div>
    </LabFrame>
  );
}

function Vision9Lab() {
  const [qx, setQx] = useState(4);
  const [qy, setQy] = useState(3);
  const [metric, setMetric] = useState<"euclidean" | "city" | "mahalanobis" | "bayes">("euclidean");
  const [k, setK] = useState(3);
  const [sigmaX, setSigmaX] = useState(2);
  const [sigmaY, setSigmaY] = useState(1.3);
  const [rho, setRho] = useState(0.35);
  const classA = { x: 2, y: 2, prior: 0.6, likelihood: 0.7 };
  const classB = { x: 7, y: 5, prior: 0.4, likelihood: 0.9 };
  const samples = [
    { x: 2, y: 2, cls: "A" },
    { x: 3, y: 4, cls: "A" },
    { x: 1, y: 5, cls: "A" },
    { x: 7, y: 5, cls: "B" },
    { x: 8, y: 3, cls: "B" },
    { x: 6, y: 2, cls: "B" },
    { x: 5, y: 6, cls: "B" },
  ];
  const euA = Math.hypot(qx - classA.x, qy - classA.y);
  const euB = Math.hypot(qx - classB.x, qy - classB.y);
  const cityA = Math.abs(qx - classA.x) + Math.abs(qy - classA.y);
  const cityB = Math.abs(qx - classB.x) + Math.abs(qy - classB.y);
  const bayesA = classA.prior * classA.likelihood;
  const bayesB = classB.prior * classB.likelihood;
  const mahalanobis = (center: { x: number; y: number }) => {
    const dx = (qx - center.x) / sigmaX;
    const dy = (qy - center.y) / sigmaY;
    const denom = Math.max(0.05, 1 - rho * rho);
    return Math.sqrt(Math.max(0, (dx * dx - 2 * rho * dx * dy + dy * dy) / denom));
  };
  const mahaA = mahalanobis(classA);
  const mahaB = mahalanobis(classB);
  const scoreA = metric === "euclidean" ? euA : metric === "city" ? cityA : metric === "mahalanobis" ? mahaA : -bayesA;
  const scoreB = metric === "euclidean" ? euB : metric === "city" ? cityB : metric === "mahalanobis" ? mahaB : -bayesB;
  const nearest = samples
    .map((sample) => ({ ...sample, distance: Math.hypot(qx - sample.x, qy - sample.y) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k);
  const voteA = nearest.filter((sample) => sample.cls === "A").length;
  const voteB = nearest.length - voteA;

  return (
    <LabFrame title="특징공간 거리와 분류 판정" subtitle="질의 특징 벡터를 움직이며 거리 기반 분류와 베이즈 판정을 비교" icon={<Target size={18} />}>
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="질의 특징 벡터">
          <Slider label="x1" value={qx} min={0} max={9} step={1} onChange={setQx} />
          <Slider label="x2" value={qy} min={0} max={7} step={1} onChange={setQy} />
          <div className="grid grid-cols-10 gap-1">
            {Array.from({ length: 80 }).map((_, index) => {
              const x = index % 10;
              const y = 7 - Math.floor(index / 10);
              const here = x === qx && y === qy;
              const sample = samples.find((item) => item.x === x && item.y === y);
              return (
                <div
                  key={index}
                  className={`aspect-square rounded ${
                    here
                      ? "bg-violet-500"
                      : sample?.cls === "A"
                        ? "bg-emerald-500"
                        : sample?.cls === "B"
                          ? "bg-rose-500"
                          : "bg-gray-200 dark:bg-gray-800"
                  }`}
                />
              );
            })}
          </div>
        </Panel>
        <Panel title="분류 기준">
          <div className="mb-3 flex flex-wrap gap-2">
            <Toggle active={metric === "euclidean"} onClick={() => setMetric("euclidean")}>유클리드</Toggle>
            <Toggle active={metric === "city"} onClick={() => setMetric("city")}>도시블록</Toggle>
            <Toggle active={metric === "mahalanobis"} onClick={() => setMetric("mahalanobis")}>마할라노비스</Toggle>
            <Toggle active={metric === "bayes"} onClick={() => setMetric("bayes")}>베이즈</Toggle>
          </div>
          <Slider label="k-NN의 k" value={k} min={1} max={5} step={2} onChange={setK} />
          <div className="space-y-2">
            <Stat label="A 거리/점수" value={metric === "euclidean" ? euA : metric === "city" ? cityA : metric === "mahalanobis" ? mahaA : bayesA} />
            <Stat label="B 거리/점수" value={metric === "euclidean" ? euB : metric === "city" ? cityB : metric === "mahalanobis" ? mahaB : bayesB} />
            <Stat label="판정" value={scoreA <= scoreB ? "A" : "B"} />
            <Stat label="k-NN 투표" value={voteA >= voteB ? `A ${voteA}:${voteB}` : `B ${voteB}:${voteA}`} />
          </div>
        </Panel>
        <Panel title="개념 검산">
          <Slider label="마할라노비스 σx" value={sigmaX} min={0.8} max={4} step={0.1} onChange={setSigmaX} />
          <Slider label="마할라노비스 σy" value={sigmaY} min={0.8} max={4} step={0.1} onChange={setSigmaY} />
          <Slider label="상관 ρ" value={rho} min={-0.8} max={0.8} step={0.05} onChange={setRho} />
          <StepList
            active={3}
            steps={[
              "정규화로 크기·위치 차이 완화",
              "특징벡터를 특징공간의 점으로 표현",
              "거리측정자 또는 사후확률 기준 적용",
              "마할라노비스 거리는 분산·공분산으로 축의 성격을 반영",
              "가장 가까운 클래스 또는 큰 확률 선택",
            ]}
          />
          <div className="mt-4">
            <Bar label="PCA 1주성분 분산" value={0.72} tone="violet" />
            <Bar label="PCA 2주성분 분산" value={0.21} tone="cyan" />
            <Bar label="나머지 분산" value={0.07} tone="amber" />
          </div>
        </Panel>
      </div>
    </LabFrame>
  );
}

const inductiveSamples = [
  { score: 0.96, positive: true },
  { score: 0.9, positive: true },
  { score: 0.86, positive: false },
  { score: 0.82, positive: true },
  { score: 0.79, positive: false },
  { score: 0.75, positive: true },
  { score: 0.7, positive: true },
  { score: 0.66, positive: false },
  { score: 0.62, positive: true },
  { score: 0.59, positive: true },
  { score: 0.55, positive: false },
  { score: 0.52, positive: true },
  { score: 0.48, positive: false },
  { score: 0.45, positive: true },
  { score: 0.41, positive: false },
  { score: 0.38, positive: true },
  { score: 0.34, positive: true },
  { score: 0.31, positive: false },
  { score: 0.27, positive: true },
  { score: 0.24, positive: false },
  { score: 0.21, positive: true },
  { score: 0.18, positive: false },
  { score: 0.15, positive: false },
  { score: 0.12, positive: true },
];

function ML10Lab() {
  const [tp, setTp] = useState(18);
  const [fp, setFp] = useState(1);
  const [fn, setFn] = useState(2);
  const [tn, setTn] = useState(9);
  const [focus, setFocus] = useState<"tp" | "fp" | "fn" | "tn">("tp");
  const [metricFocus, setMetricFocus] = useState<"precision" | "recall" | "f1" | "accuracy" | "specificity">("precision");
  const [hypothesisThreshold, setHypothesisThreshold] = useState(0.5);
  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
  const f1 = 2 * tp + fp + fn === 0 ? 0 : (2 * tp) / (2 * tp + fp + fn);
  const accuracy = tp + fp + fn + tn === 0 ? 0 : (tp + tn) / (tp + fp + fn + tn);
  const specificity = tn + fp === 0 ? 0 : tn / (tn + fp);
  const metricCells = {
    precision: ["tp", "fp"],
    recall: ["tp", "fn"],
    f1: ["tp", "fp", "fn"],
    accuracy: ["tp", "tn", "fp", "fn"],
    specificity: ["tn", "fp"],
  }[metricFocus];
  const metricFormula = {
    precision: "TP/(TP+FP)",
    recall: "TP/(TP+FN)",
    f1: "2TP/(2TP+FP+FN)",
    accuracy: "(TP+TN)/(TP+TN+FP+FN)",
    specificity: "TN/(TN+FP)",
  }[metricFocus];
  const focusText = {
    tp: "실제 양성을 양성으로 맞힌 경우",
    fp: "실제 음성을 양성으로 잘못 예측한 경우",
    fn: "실제 양성을 음성으로 놓친 경우",
    tn: "실제 음성을 음성으로 맞힌 경우",
  }[focus];
  const hypothesisCounts = inductiveSamples.reduce(
    (counts, sample) => {
      const predictedPositive = sample.score >= hypothesisThreshold;
      if (sample.positive && predictedPositive) counts.tp += 1;
      if (!sample.positive && predictedPositive) counts.fp += 1;
      if (sample.positive && !predictedPositive) counts.fn += 1;
      if (!sample.positive && !predictedPositive) counts.tn += 1;
      return counts;
    },
    { tp: 0, fp: 0, fn: 0, tn: 0 },
  );
  const hypothesisPrecision =
    hypothesisCounts.tp + hypothesisCounts.fp === 0 ? 0 : hypothesisCounts.tp / (hypothesisCounts.tp + hypothesisCounts.fp);
  const hypothesisRecall =
    hypothesisCounts.tp + hypothesisCounts.fn === 0 ? 0 : hypothesisCounts.tp / (hypothesisCounts.tp + hypothesisCounts.fn);

  return (
    <LabFrame title="분할표와 학습 유형 판별" subtitle="TP/FN/FP/TN 값을 바꿔 정밀도·재현율·F1·정확도를 검산" icon={<GitBranch size={18} />}>
      <div className="grid gap-4 lg:grid-cols-4">
        <Panel title="학습 유형 조건">
          <StepList active={3} steps={["레이블 있음: 지도학습", "입력만 있음: 비지도학습", "보상 있음: 강화학습", "기존 모델 미세조정: 전이학습"]} />
        </Panel>
        <Panel title="분할표 입력">
          <Slider label="TP" value={tp} min={0} max={30} step={1} onChange={setTp} />
          <Slider label="FP" value={fp} min={0} max={30} step={1} onChange={setFp} />
          <Slider label="FN" value={fn} min={0} max={30} step={1} onChange={setFn} />
          <Slider label="TN" value={tn} min={0} max={30} step={1} onChange={setTn} />
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {[
              { id: "tp", label: "실제 양성 / 예측 양성", name: "TP", value: tp },
              { id: "fn", label: "실제 양성 / 예측 음성", name: "FN", value: fn },
              { id: "fp", label: "실제 음성 / 예측 양성", name: "FP", value: fp },
              { id: "tn", label: "실제 음성 / 예측 음성", name: "TN", value: tn },
            ].map((cell) => (
              <button
                key={cell.id}
                type="button"
                onClick={() => setFocus(cell.id as "tp" | "fp" | "fn" | "tn")}
                className={`rounded-md border p-2 text-left ${
                  focus === cell.id || metricCells.includes(cell.id)
                    ? "border-teal-400 bg-teal-50 dark:bg-teal-950"
                    : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                }`}
              >
                <div className="font-bold">{cell.name}</div>
                <div className="text-[10px] leading-4 text-gray-500 dark:text-gray-400">{cell.label}</div>
                <div className="mt-1 font-mono">{cell.value}</div>
              </button>
            ))}
          </div>
        </Panel>
        <Panel title="지표 계산">
          <div className="mb-3 flex flex-wrap gap-2">
            {[
              ["precision", "정밀도"],
              ["recall", "재현율"],
              ["f1", "F1"],
              ["accuracy", "정확도"],
              ["specificity", "특이도"],
            ].map(([id, label]) => (
              <Toggle key={id} active={metricFocus === id} onClick={() => setMetricFocus(id as typeof metricFocus)}>
                {label}
              </Toggle>
            ))}
          </div>
          <div className="space-y-2">
            <Stat label="정밀도 TP/(TP+FP)" value={precision} />
            <Stat label="재현율 TP/(TP+FN)" value={recall} />
            <Stat label="F1" value={f1} />
            <Stat label="정확도" value={accuracy} />
            <Stat label="특이도 TN/(TN+FP)" value={specificity} />
          </div>
          <div className="mt-3 rounded-md bg-white p-3 text-xs leading-5 dark:bg-gray-900">
            <span className="font-bold">{focus.toUpperCase()}</span> {focusText}
            <div className="mt-2 rounded-md bg-teal-50 p-2 font-mono text-teal-800 dark:bg-teal-950 dark:text-teal-200">
              선택 지표: {metricFormula}
            </div>
          </div>
        </Panel>
        <Panel title="귀납 가설 경계">
          <Slider label="판정 임계치" value={hypothesisThreshold} min={0.15} max={0.9} step={0.05} onChange={setHypothesisThreshold} />
          <div className="mb-3 grid grid-cols-6 gap-1">
            {inductiveSamples.map((sample, index) => {
              const predictedPositive = sample.score >= hypothesisThreshold;
              const state = sample.positive && predictedPositive ? "TP" : !sample.positive && predictedPositive ? "FP" : sample.positive ? "FN" : "TN";
              return (
                <div
                  key={`${sample.score}-${index}`}
                  title={`${state} score=${fmt(sample.score)}`}
                  className={`aspect-square rounded ${
                    state === "TP"
                      ? "bg-emerald-500"
                      : state === "FP"
                        ? "bg-amber-400"
                        : state === "FN"
                          ? "bg-rose-500"
                          : "bg-gray-300 dark:bg-gray-800"
                  }`}
                />
              );
            })}
          </div>
          <div className="space-y-2">
            <Stat label="TP / FP" value={`${hypothesisCounts.tp} / ${hypothesisCounts.fp}`} />
            <Stat label="FN / TN" value={`${hypothesisCounts.fn} / ${hypothesisCounts.tn}`} />
            <Bar label="정밀도" value={hypothesisPrecision} tone="emerald" />
            <Bar label="재현율" value={hypothesisRecall} tone="rose" />
          </div>
          <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
            임계치를 높이면 가설이 엄격해져 양성 판정이 줄고, 보통 거짓 양성은 줄지만 거짓 음성이 늘 수 있음.
          </p>
        </Panel>
      </div>
    </LabFrame>
  );
}

const regressionSamples = [
  { x: 1, y: 2 },
  { x: 2, y: 3 },
  { x: 3, y: 4 },
];

function ML11Lab() {
  const [w0, setW0] = useState(0.3);
  const [w1, setW1] = useState(0.5);
  const [eta, setEta] = useState(0.1);
  const [traceStep, setTraceStep] = useState(4);
  const [z1, setZ1] = useState(1.2);
  const [z2, setZ2] = useState(0.4);
  const [z3, setZ3] = useState(-0.6);
  const errors = regressionSamples.map((sample) => w0 + w1 * sample.x - sample.y);
  const mse = errors.reduce((sum, error) => sum + error * error, 0) / regressionSamples.length;
  const grad0 = (2 / regressionSamples.length) * errors.reduce((sum, error) => sum + error, 0);
  const grad1 = (2 / regressionSamples.length) * errors.reduce((sum, error, index) => sum + error * regressionSamples[index].x, 0);
  const nextW0 = w0 - eta * grad0;
  const nextW1 = w1 - eta * grad1;
  const curve = [-0.5, 0.2, 0.9, 1.6, 2.3].map((candidate) => {
    const candidateErrors = regressionSamples.map((sample) => w0 + candidate * sample.x - sample.y);
    return candidateErrors.reduce((sum, error) => sum + error * error, 0) / regressionSamples.length;
  });
  const maxCurve = Math.max(...curve);
  const trace = Array.from({ length: 9 }).reduce<Array<{ w0: number; w1: number; mse: number }>>((steps, _, index) => {
    if (index === 0) return [{ w0, w1, mse }];
    const previous = steps[index - 1];
    const stepErrors = regressionSamples.map((sample) => previous.w0 + previous.w1 * sample.x - sample.y);
    const stepGrad0 = (2 / regressionSamples.length) * stepErrors.reduce((sum, error) => sum + error, 0);
    const stepGrad1 = (2 / regressionSamples.length) * stepErrors.reduce((sum, error, sampleIndex) => sum + error * regressionSamples[sampleIndex].x, 0);
    const updatedW0 = previous.w0 - eta * stepGrad0;
    const updatedW1 = previous.w1 - eta * stepGrad1;
    const updatedErrors = regressionSamples.map((sample) => updatedW0 + updatedW1 * sample.x - sample.y);
    return [
      ...steps,
      {
        w0: updatedW0,
        w1: updatedW1,
        mse: updatedErrors.reduce((sum, error) => sum + error * error, 0) / regressionSamples.length,
      },
    ];
  }, []);
  const traceMax = Math.max(...trace.map((step) => step.mse), 0.001);
  const selectedTrace = trace[traceStep];
  const unstable = eta > 0.22 && trace[trace.length - 1].mse > trace[0].mse;
  const logits = [z1, z2, z3];
  const maxLogit = Math.max(...logits);
  const expValues = logits.map((value) => Math.exp(value - maxLogit));
  const expSum = expValues.reduce((sum, value) => sum + value, 0);
  const probabilities = softmax(logits);

  return (
    <LabFrame title="선형회귀와 경사하강 갱신" subtitle="가중치와 학습률을 바꿔 MSE와 다음 업데이트 값을 계산" icon={<Sigma size={18} />}>
      <div className="grid gap-4 lg:grid-cols-4">
        <Panel title="선형가설">
          <Slider label="w0" value={w0} min={-1} max={3} step={0.1} onChange={setW0} />
          <Slider label="w1" value={w1} min={-1} max={3} step={0.1} onChange={setW1} />
          <Stat label="MSE" value={mse} />
          <div className="mt-4 flex h-24 items-end gap-1 rounded-md bg-white p-2 dark:bg-gray-900">
            {curve.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t ${index === 2 ? "bg-violet-500" : "bg-cyan-400"}`}
                  style={{ height: `${Math.max(8, (value / maxCurve) * 72)}px` }}
                />
                <span className="text-[10px]">{fmt(value)}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="경사하강">
          <Slider label="η" value={eta} min={0.01} max={0.5} step={0.01} onChange={setEta} />
          <Slider label="반복 단계" value={traceStep} min={0} max={8} step={1} onChange={setTraceStep} />
          <div className="space-y-2">
            <Stat label="∂C/∂w0" value={grad0} />
            <Stat label="∂C/∂w1" value={grad1} />
            <Stat label="다음 w0" value={nextW0} />
            <Stat label="다음 w1" value={nextW1} />
            <Stat label={`k=${traceStep} MSE`} value={selectedTrace.mse} />
          </div>
          <div className="mt-4 flex h-24 items-end gap-1 rounded-md bg-white p-2 dark:bg-gray-900">
            {trace.map((step, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t ${index === traceStep ? "bg-violet-500" : "bg-teal-400"}`}
                  style={{ height: `${Math.max(6, (step.mse / traceMax) * 72)}px` }}
                />
                <span className="text-[10px]">{index}</span>
              </div>
            ))}
          </div>
          {unstable && (
            <div className="mt-3 rounded-md bg-rose-50 p-2 text-xs leading-5 text-rose-800 dark:bg-rose-950 dark:text-rose-200">
              학습률이 커서 진동하거나 비용이 커질 수 있음.
            </div>
          )}
        </Panel>
        <Panel title="k-means 한 단계">
          <StepList active={2} steps={["초기 중심 C1=2, C2=8", "표본을 가까운 중심에 할당", "각 군집 평균으로 중심 갱신", "중심 변화가 작을 때까지 반복"]} />
        </Panel>
        <Panel title="다항 로지스틱 소프트맥스">
          <Slider label="z1" value={z1} min={-3} max={3} step={0.1} onChange={setZ1} />
          <Slider label="z2" value={z2} min={-3} max={3} step={0.1} onChange={setZ2} />
          <Slider label="z3" value={z3} min={-3} max={3} step={0.1} onChange={setZ3} />
          {probabilities.map((value, index) => (
            <Bar key={index} label={`P(class ${index + 1})`} value={value} tone={index === 0 ? "violet" : index === 1 ? "cyan" : "amber"} />
          ))}
          <div className="space-y-2">
            <Stat label="exp 합" value={expSum} />
            <Stat label="확률 합" value={probabilities.reduce((sum, value) => sum + value, 0)} />
            <Stat label="판정" value={`class ${probabilities.indexOf(Math.max(...probabilities)) + 1}`} />
          </div>
          <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
            소프트맥스는 클래스별 선형 점수를 확률분포로 바꿔 전체 합이 1이 되게 함.
          </p>
        </Panel>
      </div>
    </LabFrame>
  );
}

function NN12Lab() {
  const [x1, setX1] = useState(1);
  const [x2, setX2] = useState(2);
  const [w1, setW1] = useState(0.6);
  const [w2, setW2] = useState(-0.4);
  const [bias, setBias] = useState(0.2);
  const [fn, setFn] = useState<"step" | "sigmoid" | "tanh" | "relu">("sigmoid");
  const u = x1 * w1 + x2 * w2 + bias;
  const output = fn === "step" ? (u >= 0 ? 1 : 0) : fn === "sigmoid" ? sigmoid(u) : fn === "tanh" ? Math.tanh(u) : Math.max(0, u);

  return (
    <LabFrame title="뉴런 계산과 XOR 한계" subtitle="가중합, 활성함수, 흥분성/금지 연결, 선형 분리 한계를 함께 확인" icon={<Network size={18} />}>
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="뉴런 입력">
          <Slider label="x1" value={x1} min={-3} max={3} step={1} onChange={setX1} />
          <Slider label="x2" value={x2} min={-3} max={3} step={1} onChange={setX2} />
          <Slider label="w1" value={w1} min={-2} max={2} step={0.1} onChange={setW1} />
          <Slider label="w2" value={w2} min={-2} max={2} step={0.1} onChange={setW2} />
          <Slider label="b" value={bias} min={-2} max={2} step={0.1} onChange={setBias} />
        </Panel>
        <Panel title="활성함수">
          <div className="mb-3 flex flex-wrap gap-2">
            {(["step", "sigmoid", "tanh", "relu"] as const).map((item) => (
              <Toggle key={item} active={fn === item} onClick={() => setFn(item)}>{item}</Toggle>
            ))}
          </div>
          <div className="space-y-2">
            <Stat label="u=Σxw+b" value={u} />
            <Stat label="y=f(u)" value={output} />
            <Stat label="w1 연결" value={w1 >= 0 ? "흥분성" : "금지"} />
          </div>
        </Panel>
        <Panel title="XOR 판별">
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            {["00→0", "01→1", "10→1", "11→0"].map((item) => (
              <div key={item} className="rounded-md bg-white p-3 font-mono font-bold dark:bg-gray-900">{item}</div>
            ))}
          </div>
          <div className="mt-3 rounded-md bg-rose-50 p-3 text-xs leading-5 text-rose-800 dark:bg-rose-950 dark:text-rose-200">
            XOR는 양성 점이 대각선에 놓여 단층 퍼셉트론의 하나의 직선으로 분리되지 않음.
          </div>
        </Panel>
      </div>
    </LabFrame>
  );
}

function NN13Lab() {
  const [eta, setEta] = useState(0.2);
  const [delta, setDelta] = useState(0.4);
  const [out, setOut] = useState(0.7);
  const [momentum, setMomentum] = useState(0.6);
  const [prev, setPrev] = useState(-0.05);
  const [bpStep, setBpStep] = useState(2);
  const dw = -eta * delta * out + momentum * prev;
  const hiddenOut = 0.62;
  const yHat = 0.73;
  const y = 1;
  const outputDelta = (yHat - y) * yHat * (1 - yHat);
  const hiddenDelta = outputDelta * 0.8 * hiddenOut * (1 - hiddenOut);
  const bpCards = [
    ["순전파", `은닉 출력 o=${fmt(hiddenOut)}, 최종 출력 yhat=${fmt(yHat)}`],
    ["손실", `C=1/2(yhat-y)^2=${fmt(0.5 * (yHat - y) ** 2)}`],
    ["출력층 δ", `δ=(yhat-y)yhat(1-yhat)=${fmt(outputDelta)}`],
    ["은닉층 δ", `δh=δout*w*oh(1-oh)=${fmt(hiddenDelta)}`],
    ["가중치 갱신", `Δw=-ηδo=${fmt(-eta * outputDelta * hiddenOut)}`],
  ];

  return (
    <LabFrame title="역전파와 모멘텀 갱신" subtitle="순전파 뒤 출력층에서 은닉층 방향으로 체인 룰과 Δw를 추적" icon={<RotateCcw size={18} />}>
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="역전파 단계">
          <Slider label="추적 단계" value={bpStep} min={0} max={4} step={1} onChange={setBpStep} />
          <StepList active={bpStep} steps={["입력층에서 출력 계산", "손실함수 계산", "출력층 δ 계산", "은닉층 δ 전달", "가중치 갱신"]} />
          <div className="mt-3 rounded-md bg-white p-3 text-xs leading-5 dark:bg-gray-900">
            <div className="font-bold text-teal-700 dark:text-teal-300">{bpCards[bpStep][0]}</div>
            <div className="mt-1 font-mono">{bpCards[bpStep][1]}</div>
          </div>
        </Panel>
        <Panel title="Δw 계산">
          <Slider label="η" value={eta} min={0.01} max={0.5} step={0.01} onChange={setEta} />
          <Slider label="δ" value={delta} min={-1} max={1} step={0.05} onChange={setDelta} />
          <Slider label="o" value={out} min={0} max={1} step={0.05} onChange={setOut} />
          <Slider label="α" value={momentum} min={0} max={1} step={0.05} onChange={setMomentum} />
          <Slider label="이전 Δw" value={prev} min={-0.5} max={0.5} step={0.05} onChange={setPrev} />
          <Stat label="Δw=-ηδo+αΔw이전" value={dw} />
        </Panel>
        <Panel title="구조 비교">
          <StepList active={2} steps={["RBM: 가시층-은닉층 층간연결만 존재", "SOM: 비지도 경쟁학습", "LVQ: 지도 경쟁학습"]} />
        </Panel>
      </div>
    </LabFrame>
  );
}

function DL14Lab() {
  const [layers, setLayers] = useState(8);
  const [derivative, setDerivative] = useState(0.25);
  const [inputSize, setInputSize] = useState(28);
  const [filter, setFilter] = useState(5);
  const [stride, setStride] = useState(2);
  const [padding, setPadding] = useState(2);
  const [inChannels, setInChannels] = useState(1);
  const [outChannels, setOutChannels] = useState(6);
  const [dropout, setDropout] = useState(0.4);
  const gradient = derivative ** layers;
  const outputSize = Math.floor((inputSize - filter + 2 * padding) / stride + 1);
  const parameterCount = (filter * filter * inChannels + 1) * outChannels;
  const activeNeurons = Math.round(12 * (1 - dropout));

  return (
    <LabFrame title="경사 소멸과 CNN 출력 크기" subtitle="층 수·미분값·stride·padding을 바꿔 딥러닝 계산 기준을 검산" icon={<Layers size={18} />}>
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="경사 소멸">
          <Slider label="층 수" value={layers} min={1} max={12} step={1} onChange={setLayers} />
          <Slider label="층당 미분값" value={derivative} min={0.05} max={0.95} step={0.05} onChange={setDerivative} />
          <Bar label="입력층까지 전달되는 경사" value={gradient} tone="rose" />
        </Panel>
        <Panel title="합성곱 파라미터">
          <Slider label="입력 크기" value={inputSize} min={8} max={64} step={1} onChange={setInputSize} />
          <Slider label="필터 크기" value={filter} min={1} max={9} step={1} onChange={setFilter} />
          <Slider label="stride" value={stride} min={1} max={4} step={1} onChange={setStride} />
          <Slider label="padding" value={padding} min={0} max={5} step={1} onChange={setPadding} />
          <Slider label="입력 채널" value={inChannels} min={1} max={8} step={1} onChange={setInChannels} />
          <Slider label="필터 수" value={outChannels} min={1} max={32} step={1} onChange={setOutChannels} />
        </Panel>
        <Panel title="검산">
          <Slider label="드롭아웃 비율" value={dropout} min={0} max={0.8} step={0.1} onChange={setDropout} />
          <div className="mb-3 grid grid-cols-6 gap-1">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className={`aspect-square rounded ${index < activeNeurons ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-800"}`}
              />
            ))}
          </div>
          <div className="space-y-2">
            <Stat label="Sout" value={outputSize > 0 ? outputSize : "불가"} />
            <Stat label="특징맵 수" value={outChannels} />
            <Stat label="파라미터 수" value={parameterCount} />
            <Stat label="드롭아웃" value="훈련 중 일시 제거" />
            <Stat label="평가 시" value="모든 뉴런 사용" />
          </div>
        </Panel>
      </div>
    </LabFrame>
  );
}

function DL15Lab() {
  const [fx, setFx] = useState(2.4);
  const [x, setX] = useState(1.6);
  const [time, setTime] = useState(3);
  const [token, setToken] = useState(1);
  const [gateInput, setGateInput] = useState(0.4);
  const [prevState, setPrevState] = useState(0.7);
  const attention = [
    [0.65, 0.25, 0.1],
    [0.15, 0.55, 0.3],
    [0.2, 0.35, 0.45],
  ];
  const forgetGate = sigmoid(1.3 * gateInput + 0.8 * prevState - 0.2);
  const inputGate = sigmoid(0.9 * gateInput - 0.4 * prevState + 0.1);
  const outputGate = sigmoid(0.7 * gateInput + 0.6 * prevState);
  const candidate = Math.tanh(1.1 * gateInput + 0.3 * prevState);
  const nextCell = forgetGate * prevState + inputGate * candidate;
  const nextHidden = outputGate * Math.tanh(nextCell);
  const gruUpdate = sigmoid(0.8 * gateInput + 0.4 * prevState);

  return (
    <LabFrame title="ResNet·RNN·Attention 구조 추적" subtitle="잔차 합산, 시간 펼침, self-attention 가중치를 시험 기준으로 확인" icon={<Eye size={18} />}>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <Panel title="ResNet 잔차 블록">
          <Slider label="F(x)" value={fx} min={-4} max={4} step={0.1} onChange={setFx} />
          <Slider label="x" value={x} min={-4} max={4} step={0.1} onChange={setX} />
          <Stat label="H(x)=F(x)+x" value={fx + x} />
          <Stat label="채널 불일치" value="1x1 Conv로 보정" />
        </Panel>
        <Panel title="RNN unroll/BPTT">
          <Slider label="현재 시간 t" value={time} min={0} max={4} step={1} onChange={setTime} />
          <StepList active={time} steps={["h0 계산", "h1 계산", "h2 계산", "h3 계산", "h4 계산"]} />
          <div className="mt-3 rounded-md bg-violet-50 p-3 text-xs text-violet-800 dark:bg-violet-950 dark:text-violet-200">
            BPTT는 선택한 시점에서 0 방향으로 역순 전파.
          </div>
        </Panel>
        <Panel title="LSTM/GRU 게이트">
          <Slider label="xt" value={gateInput} min={-2} max={2} step={0.1} onChange={setGateInput} />
          <Slider label="ct-1" value={prevState} min={-2} max={2} step={0.1} onChange={setPrevState} />
          <Bar label="망각 게이트" value={forgetGate} tone="rose" />
          <Bar label="입력 게이트" value={inputGate} tone="cyan" />
          <Bar label="출력 게이트" value={outputGate} tone="emerald" />
          <div className="space-y-2">
            <Stat label="ct" value={nextCell} />
            <Stat label="ht" value={nextHidden} />
            <Stat label="GRU update" value={gruUpdate} />
          </div>
        </Panel>
        <Panel title="Transformer attention">
          <div className="mb-3 flex gap-2">
            {["나는", "야구를", "좋아해"].map((item, index) => (
              <Toggle key={item} active={token === index} onClick={() => setToken(index)}>{item}</Toggle>
            ))}
          </div>
          <div className="mb-3 grid grid-cols-3 gap-1">
            {attention.flat().map((value, index) => (
              <div
                key={index}
                className="flex aspect-square items-center justify-center rounded text-[10px] font-mono text-white"
                style={{ backgroundColor: `rgba(124, 58, 237, ${0.25 + value * 0.75})` }}
              >
                {fmt(value)}
              </div>
            ))}
          </div>
          {attention[token].map((value, index) => (
            <Bar key={index} label={["나는", "야구를", "좋아해"][index]} value={value} tone={index === token ? "violet" : "cyan"} />
          ))}
          <Stat label="순서 정보" value="positional encoding" />
        </Panel>
      </div>
    </LabFrame>
  );
}

export function AIVisualizationLab({ lectureId }: { lectureId: number }) {
  if (lectureId === 7) return <FuzzyLab />;
  if (lectureId === 8) return <Vision8Lab />;
  if (lectureId === 9) return <Vision9Lab />;
  if (lectureId === 10) return <ML10Lab />;
  if (lectureId === 11) return <ML11Lab />;
  if (lectureId === 12) return <NN12Lab />;
  if (lectureId === 13) return <NN13Lab />;
  if (lectureId === 14) return <DL14Lab />;
  if (lectureId === 15) return <DL15Lab />;
  return null;
}
