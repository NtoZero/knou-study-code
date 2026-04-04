"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import PseudocodeViewer from "@/components/common/PseudocodeViewer";

/* ── Landscape for SA visualization ── */
const landscapePoints = 80;
function landscape(x: number): number {
  // Multi-modal function with a global min around x=0.7
  return (
    3 +
    2 * Math.sin(x * 4) +
    Math.sin(x * 10) +
    0.5 * Math.cos(x * 7) -
    0.3 * x * x
  );
}

function buildLandscape() {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= landscapePoints; i++) {
    const x = (i / landscapePoints) * 10;
    pts.push({ x, y: landscape(x) });
  }
  return pts;
}

const landPts = buildLandscape();
const minY = Math.min(...landPts.map((p) => p.y));
const maxY = Math.max(...landPts.map((p) => p.y));

function toSvg(x: number, y: number, w: number, h: number) {
  const sx = (x / 10) * w;
  const sy = h - ((y - minY) / (maxY - minY + 1)) * (h - 20) - 10;
  return { sx, sy };
}

/* ── Pseudocode lines ── */
const pseudocodeLines = [
  { text: "현재상태 ← 문제의 초기상태;", comment: "초기화" },
  { text: "for t = 1 to ∞ do" },
  { text: "    T = temperature(t);", comment: "온도 감소" },
  { text: "    if T == 0 then return 현재상태;" },
  { text: "    차기상태 = 현재상태의 후계노드 중 임의 선택;" },
  { text: "    ΔE = h(차기상태) − h(현재상태);" },
  { text: "    if ΔE < 0 then" },
  { text: "        현재상태 = 차기상태;", comment: "개선 → 무조건 이동" },
  { text: "    else" },
  { text: "        확률 e^(−ΔE/T)에 따라 이동;", comment: "악화 허용" },
  { text: "    end-if;" },
  { text: "end-for;" },
];

export default function SimulatedAnnealingDemo() {
  const [temperature, setTemperature] = useState(100);
  const [deltaE, setDeltaE] = useState(5);
  const [calcDeltaE, setCalcDeltaE] = useState("5");
  const [calcT, setCalcT] = useState("100");

  // SA simulation state
  const [saPos, setSaPos] = useState(2.0); // x position
  const [saHistory, setSaHistory] = useState<number[]>([2.0]);
  const [saTemp, setSaTemp] = useState(100);
  const [saRunning, setSaRunning] = useState(false);
  const [saStep, setSaStep] = useState(0);
  const [saLastAction, setSaLastAction] = useState<"init" | "improve" | "accept" | "reject">("init");

  const acceptance = deltaE < 0 ? 1 : Math.exp(-deltaE / temperature);

  // Calculator
  const calcDE = parseFloat(calcDeltaE) || 0;
  const calcTVal = parseFloat(calcT) || 0.01;
  const calcProb = calcDE < 0 ? 1 : Math.exp(-calcDE / calcTVal);

  const saHighlightedLines = useMemo(() => {
    if (saStep === 0) return [0];
    switch (saLastAction) {
      case "improve": return [1, 2, 4, 5, 6, 7];
      case "accept": return [1, 2, 4, 5, 8, 9];
      case "reject": return [1, 2, 4, 5, 8, 9];
      default: return [1, 2];
    }
  }, [saStep, saLastAction]);

  const resetSA = useCallback(() => {
    setSaPos(2.0);
    setSaHistory([2.0]);
    setSaTemp(100);
    setSaStep(0);
    setSaRunning(false);
    setSaLastAction("init");
  }, []);

  const stepSA = useCallback(() => {
    setSaPos((prev) => {
      const currentH = landscape(prev);
      const delta = (Math.random() - 0.5) * 1.5;
      const nextX = Math.max(0, Math.min(10, prev + delta));
      const nextH = landscape(nextX);
      const de = nextH - currentH; // For minimization we want lower
      const t = Math.max(0.01, saTemp * 0.92);

      let accept = false;
      if (de < 0) {
        accept = true;
        setSaLastAction("improve");
      } else {
        accept = Math.random() < Math.exp(-de / (t / 20));
        setSaLastAction(accept ? "accept" : "reject");
      }

      setSaTemp(t);
      setSaStep((s) => s + 1);

      const newPos = accept ? nextX : prev;
      setSaHistory((h) => [...h.slice(-40), newPos]);
      return newPos;
    });
  }, [saTemp]);

  const runSA = useCallback(() => {
    setSaRunning(true);
    let steps = 0;
    const interval = setInterval(() => {
      stepSA();
      steps++;
      if (steps >= 50) {
        clearInterval(interval);
        setSaRunning(false);
      }
    }, 150);
  }, [stepSA]);

  const svgW = 600;
  const svgH = 200;

  return (
    <section>
      <SectionTitle
        title="3. 모의 담금질 (Simulated Annealing)"
        subtitle="전역최소치를 구하기 위한 확률적 접근방법. 금속의 풀림(annealing) 과정에서 착안."
      />

      {/* Concept */}
      <div className="mb-6 rounded-xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-800 dark:bg-teal-900/20">
        <p className="text-sm text-teal-800 dark:text-teal-200">
          <span className="font-bold">Annealing(풀림)</span>: 금속이나 유리를 일정한 온도로 가열한 다음에 천천히 식혀
          내부 조직을 고르게 하고 응력을 제거하는 열처리 조작.
          이 원리를 최적화에 적용하여 지역최소치에 갇히지 않고 전역최소치를 찾음.
        </p>
      </div>

      {/* Core Mechanism */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <h4 className="mb-2 text-sm font-bold text-green-700 dark:text-green-300">
            ΔE &lt; 0 (개선)
          </h4>
          <p className="text-sm text-green-600 dark:text-green-400">
            평가함수 값이 감소 → <span className="font-bold">무조건 이동</span>
          </p>
        </div>
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
          <h4 className="mb-2 text-sm font-bold text-orange-700 dark:text-orange-300">
            ΔE &ge; 0 (악화)
          </h4>
          <p className="text-sm text-orange-600 dark:text-orange-400">
            확률 <span className="font-mono font-bold">e^(-ΔE/T)</span>에 따라 이동.
            T 높을 때 확률 높고, T→0이면 확률→0.
          </p>
        </div>
      </div>

      {/* Interactive Temperature / ΔE controls */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
          이동 확률 체험
        </h3>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-500">
                온도 T = {temperature.toFixed(1)}
              </label>
              <input
                type="range"
                min={0.1}
                max={200}
                step={0.1}
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-teal-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0.1 (수렴)</span>
                <span>200 (탐사)</span>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-gray-500">
                ΔE = {deltaE.toFixed(1)}
              </label>
              <input
                type="range"
                min={-10}
                max={20}
                step={0.1}
                value={deltaE}
                onChange={(e) => setDeltaE(parseFloat(e.target.value))}
                className="w-full accent-teal-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>-10 (개선)</span>
                <span>+20 (악화)</span>
              </div>
            </div>
          </div>

          {/* Result display */}
          <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
            <p className="text-xs text-gray-500">이동 확률</p>
            <motion.p
              key={`${deltaE}-${temperature}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`mt-2 text-4xl font-bold ${
                acceptance >= 0.8
                  ? "text-green-500"
                  : acceptance >= 0.3
                    ? "text-amber-500"
                    : "text-red-500"
              }`}
            >
              {(acceptance * 100).toFixed(1)}%
            </motion.p>
            <p className="mt-2 text-xs text-gray-500">
              {deltaE < 0 ? (
                <span className="font-bold text-green-600 dark:text-green-400">ΔE &lt; 0 → 무조건 이동</span>
              ) : (
                <span>
                  e^(-{deltaE.toFixed(1)}/{temperature.toFixed(1)}) ={" "}
                  {acceptance.toFixed(4)}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Calculator */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
          확률 계산기
        </h3>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-gray-500">ΔE</label>
            <input
              type="number"
              value={calcDeltaE}
              onChange={(e) => setCalcDeltaE(e.target.value)}
              className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-gray-500">T</label>
            <input
              type="number"
              value={calcT}
              onChange={(e) => setCalcT(e.target.value)}
              className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
            />
          </div>
          <div className="rounded-lg bg-teal-50 px-4 py-2 dark:bg-teal-900/20">
            <span className="text-xs text-gray-500">확률 = </span>
            <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
              {(calcProb * 100).toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Key insight */}
        <div className="mt-4 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
          <p className="text-xs text-amber-700 dark:text-amber-300">
            <span className="font-bold">핵심 통찰:</span> T가 높을 때 악화 방향 이동 확률도 높아
            넓은 탐사(exploration)를 촉진하고, T가 0에 수렴하면 개선 방향으로만 이동하여 수렴.
          </p>
        </div>
      </div>

      {/* SA Visualization */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
          모의 담금질 시뮬레이션
        </h3>

        <div className="relative mx-auto" style={{ maxWidth: svgW }}>
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full">
            {/* Landscape */}
            <path
              d={
                `M 0,${svgH} ` +
                landPts
                  .map((p) => {
                    const { sx, sy } = toSvg(p.x, p.y, svgW, svgH);
                    return `L ${sx},${sy}`;
                  })
                  .join(" ") +
                ` L ${svgW},${svgH} Z`
              }
              fill="url(#saGrad)"
              stroke="#14b8a6"
              strokeWidth={1.5}
            />
            <defs>
              <linearGradient id="saGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            {/* History trail */}
            {saHistory.map((hx, i) => {
              const hy = landscape(hx);
              const { sx, sy } = toSvg(hx, hy, svgW, svgH);
              return (
                <circle
                  key={i}
                  cx={sx}
                  cy={sy}
                  r={2}
                  fill="#f43f5e"
                  opacity={0.2 + (i / saHistory.length) * 0.8}
                />
              );
            })}

            {/* Current position */}
            {(() => {
              const { sx, sy } = toSvg(saPos, landscape(saPos), svgW, svgH);
              return (
                <motion.circle
                  cx={sx}
                  cy={sy}
                  r={7}
                  fill="#f43f5e"
                  stroke="white"
                  strokeWidth={2}
                  animate={{ cx: sx, cy: sy }}
                  transition={{ type: "spring", stiffness: 200 }}
                />
              );
            })()}
          </svg>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm">
          <span className="text-gray-500">
            T = <span className="font-bold text-teal-600 dark:text-teal-400">{saTemp.toFixed(1)}</span>
          </span>
          <span className="text-gray-500">
            단계 = <span className="font-bold">{saStep}</span>
          </span>
          <span className="text-gray-500">
            h = <span className="font-bold">{landscape(saPos).toFixed(2)}</span>
          </span>
        </div>

        <div className="mt-3 flex justify-center gap-2">
          <button
            onClick={stepSA}
            disabled={saRunning}
            className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 disabled:opacity-40"
          >
            한 단계
          </button>
          <button
            onClick={runSA}
            disabled={saRunning}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-40"
          >
            {saRunning ? "실행 중..." : "50단계 실행"}
          </button>
          <button
            onClick={resetSA}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
          >
            초기화
          </button>
        </div>
      </div>

      {/* Pseudocode */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
          알고리즘 의사코드
        </h3>
        <PseudocodeViewer
          lines={pseudocodeLines}
          highlightedLines={saHighlightedLines}
          accentColor="teal"
        />
      </div>
    </section>
  );
}
