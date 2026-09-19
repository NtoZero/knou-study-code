"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { RefreshCw, Grid3x3 } from "lucide-react";

/* ── 7×5 이진 영상 (강의록 예시 패턴) ─────────────────────── */

const ROWS = 7;
const COLS = 5;

const initialPixels: number[] = [
  1, 1, 1, 1, 0,
  1, 0, 0, 0, 0,
  1, 0, 1, 1, 0,
  1, 1, 0, 0, 1,
  0, 0, 0, 0, 1,
  1, 0, 0, 0, 1,
  1, 1, 1, 1, 1,
];

/* ── 결정론적 난수 (버튼을 눌러야만 새 표본 생성) ──────────── */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Point {
  x: number;
  y: number;
}

/** 평균 (3,3), 분산 단위행렬인 가우시안 모집단에서 N개의 표본을 추출 */
function drawSample(seed: number, n: number): Point[] {
  const rand = mulberry32(seed);
  const out: Point[] = [];
  for (let i = 0; i < n; i++) {
    const u1 = Math.max(rand(), 1e-9);
    const u2 = rand();
    const r = Math.sqrt(-2 * Math.log(u1));
    out.push({
      x: 3 + r * Math.cos(2 * Math.PI * u2),
      y: 3 + r * Math.sin(2 * Math.PI * u2),
    });
  }
  return out;
}

const INITIAL_SEED = 20260101;

/* ── 산점도 ────────────────────────────────────────────── */

const VIEW = 240;
const PAD = 28;
const DOMAIN_MIN = -0.6;
const DOMAIN_MAX = 6.6;

const toSvgX = (v: number) =>
  PAD + ((v - DOMAIN_MIN) / (DOMAIN_MAX - DOMAIN_MIN)) * (VIEW - PAD * 2);
const toSvgY = (v: number) =>
  VIEW - PAD - ((v - DOMAIN_MIN) / (DOMAIN_MAX - DOMAIN_MIN)) * (VIEW - PAD * 2);

function ScatterPlot({
  points,
  caption,
  showContour,
}: {
  points: Point[];
  caption: string;
  showContour: boolean;
}) {
  const dense = points.length > 400;
  const path = dense
    ? points.map((p) => `M${toSvgX(p.x).toFixed(1)} ${toSvgY(p.y).toFixed(1)}h0.01`).join("")
    : "";

  return (
    <figure className="rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900">
      <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="w-full max-w-full" role="img" aria-label={caption}>
        <rect
          x={PAD}
          y={PAD}
          width={VIEW - PAD * 2}
          height={VIEW - PAD * 2}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="1"
        />
        {showContour &&
          [1, 2, 3].map((r) => (
            <circle
              key={r}
              cx={toSvgX(3)}
              cy={toSvgY(3)}
              r={(r / (DOMAIN_MAX - DOMAIN_MIN)) * (VIEW - PAD * 2)}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity={0.75}
            />
          ))}
        {dense ? (
          <path
            d={path}
            stroke="#0891b2"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
            opacity={0.35}
          />
        ) : (
          points.map((p, i) => (
            <circle key={i} cx={toSvgX(p.x)} cy={toSvgY(p.y)} r="2.6" fill="#0891b2" opacity={0.85} />
          ))
        )}
        <line x1={PAD} y1={VIEW - PAD} x2={VIEW - PAD} y2={VIEW - PAD} stroke="#94a3b8" strokeWidth="1.2" />
        <line x1={PAD} y1={PAD} x2={PAD} y2={VIEW - PAD} stroke="#94a3b8" strokeWidth="1.2" />
        <text x={VIEW - PAD} y={VIEW - PAD + 16} textAnchor="end" fontSize="11" fill="#64748b">
          x1
        </text>
        <text x={PAD - 8} y={PAD + 4} textAnchor="end" fontSize="11" fill="#64748b">
          x2
        </text>
      </svg>
      <figcaption className="pb-1 text-center text-xs text-gray-500">{caption}</figcaption>
    </figure>
  );
}

/* ── 본문 ──────────────────────────────────────────────── */

export default function DataRepresentation() {
  const [pixels, setPixels] = useState<number[]>(initialPixels);
  const [seed, setSeed] = useState(INITIAL_SEED);
  const [sampleSize, setSampleSize] = useState<50 | 10000>(50);
  const [fourPanels, setFourPanels] = useState(false);
  const [showContour, setShowContour] = useState(true);

  const dimension = ROWS * COLS;

  const togglePixel = (i: number) =>
    setPixels((prev) => prev.map((v, idx) => (idx === i ? (v === 1 ? 0 : 1) : v)));

  const mainSample = useMemo(() => drawSample(seed, sampleSize), [seed, sampleSize]);
  const panelSamples = useMemo(
    () => [0, 1, 2, 3].map((k) => drawSample(seed + k * 7919, 50)),
    [seed]
  );

  return (
    <section>
      <SectionTitle
        title="데이터 표현과 데이터 분포"
        subtitle="머신러닝에서 데이터는 모두 랜덤 벡터로 표현 — 직접 화소를 바꾸며 열벡터를 만들어 보기"
      />

      {/* 열벡터 표기 규칙 */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[auto_1fr]">
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-900 dark:bg-cyan-950/40">
          <p className="mb-3 text-sm font-bold text-cyan-900 dark:text-cyan-100">
            n 차원 열벡터의 표기
          </p>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold italic text-gray-900 dark:text-gray-100">x</span>
            <span className="text-lg text-gray-500">=</span>
            <span className="flex items-stretch gap-1">
              <span className="w-1.5 rounded-l border-y-2 border-l-2 border-gray-400" />
              <span className="flex flex-col items-center py-1 text-xs tabular-nums text-gray-700 dark:text-gray-200">
                <span>x1</span>
                <span>x2</span>
                <span>…</span>
                <span>xn</span>
              </span>
              <span className="w-1.5 rounded-r border-y-2 border-r-2 border-gray-400" />
            </span>
            <span className="text-lg text-gray-500">=</span>
            <span className="text-sm text-gray-700 dark:text-gray-200">
              [x1, x2, …, xn]<sup>T</sup>
            </span>
          </div>
          <ul className="mt-4 space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
            <li>· 벡터는 <strong>진하게, 소문자</strong>로 표기</li>
            <li>· 열벡터의 크기는 <strong>n × 1</strong></li>
            <li>· 세로로 쓰기 어려우므로 <strong>전치</strong>하여 <strong>1 × n</strong>으로 나타내기도 함</li>
            <li>· 이 x는 <strong>n차원 공간상의 한 점</strong>에 해당</li>
          </ul>
        </div>

        {/* 7x5 → flatten */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold">7 × 5 이진 영상 → flatten</p>
            <button
              onClick={() => setPixels(initialPixels)}
              className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            >
              <RefreshCw size={12} /> 예시 패턴으로
            </button>
          </div>
          <div className="flex flex-wrap items-start gap-5">
            <div>
              <div
                className="grid gap-0.5"
                style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`, width: 130 }}
              >
                {pixels.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => togglePixel(i)}
                    aria-label={`화소 ${i + 1} ${v === 1 ? "켜짐" : "꺼짐"}`}
                    className={`aspect-square rounded-[2px] border transition-colors ${
                      v === 1
                        ? "border-cyan-700 bg-cyan-600"
                        : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 text-center text-xs text-gray-500">7 × 5 (이진값)</p>
            </div>

            <div className="min-w-[120px] flex-1">
              <p className="text-xs text-gray-500">
                2차원 배열을 1차원으로 펴는 것이 <strong>flatten</strong>
              </p>
              <p className="mt-1 text-sm font-bold text-cyan-700 dark:text-cyan-300">
                {dimension}차원 벡터
              </p>
              <div className="mt-2 overflow-x-auto">
                <p className="min-w-[280px] break-all rounded-lg bg-gray-50 p-2 font-mono text-[11px] leading-relaxed text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  x = [{pixels.join(",")}]<sup>T</sup>
                </p>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                모든 데이터가 벡터로 표현되므로, 실제 데이터 처리는 벡터 연산을 이용해 수행.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 데이터 집합 = n×N 행렬 */}
      <div className="mb-10 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-2 flex items-center gap-2">
          <Grid3x3 size={16} className="text-cyan-600" />
          <p className="text-sm font-bold">데이터 집합 X → n × N 행렬</p>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          하나의 데이터가 n × 1 열벡터이고 그런 데이터가 N개 있으면, 데이터 집합은 n × N 행렬로 표현.
        </p>
        <div className="mt-3 overflow-x-auto">
          <div className="flex min-w-[300px] items-center gap-3 text-sm">
            <span className="font-bold italic">X</span>
            <span className="text-gray-500">=</span>
            <span className="flex items-stretch gap-1">
              <span className="w-1.5 rounded-l border-y-2 border-l-2 border-gray-400" />
              <span className="flex gap-3 px-1 py-2 font-bold italic text-cyan-700 dark:text-cyan-300">
                <span>x1</span>
                <span>x2</span>
                <span className="not-italic text-gray-500">⋯</span>
                <span>xN</span>
              </span>
              <span className="w-1.5 rounded-r border-y-2 border-r-2 border-gray-400" />
            </span>
            <span className="text-xs text-gray-500">(n행 × N열)</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          머신러닝에서는 하나의 데이터가 가지는 특성뿐 아니라, 전체 데이터 집합이 어떤{" "}
          <strong>분포 특성</strong>을 가지는지도 중요하게 다룸. 2차원 데이터의 분포는{" "}
          <strong>산점도 scatter plot</strong>으로 확인.
        </p>
      </div>

      {/* 표본추출 시뮬레이터 */}
      <h3 className="mb-1 text-base font-bold">표본추출 시뮬레이터</h3>
      <p className="mb-4 text-sm text-gray-500">
        가우시안 분포, 평균 (3, 3), 분산 단위행렬인 모집단에서 데이터를 뽑아 산점도로 표시.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          {([50, 10000] as const).map((n) => (
            <button
              key={n}
              onClick={() => {
                setSampleSize(n);
                setFourPanels(false);
              }}
              disabled={fourPanels}
              className={`px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-40 ${
                sampleSize === n && !fourPanels
                  ? "bg-cyan-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300"
              }`}
            >
              N = {n === 10000 ? "10,000" : n}
            </button>
          ))}
        </div>
        <button
          onClick={() => setSeed((s) => s + 1)}
          className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-cyan-700"
        >
          <RefreshCw size={14} /> 새 표본 뽑기
        </button>
        <button
          onClick={() => setFourPanels((v) => !v)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            fourPanels
              ? "bg-sky-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          4개 표본집합 나란히 보기 (N = 50)
        </button>
        <button
          onClick={() => setShowContour((v) => !v)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            showContour
              ? "bg-amber-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          모집단 밀도함수 등고선
        </button>
      </div>

      <motion.div key={`${seed}-${sampleSize}-${fourPanels}`} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}>
        {fourPanels ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {panelSamples.map((pts, i) => (
              <ScatterPlot
                key={i}
                points={pts}
                caption={`표본집합 ${i + 1} (N = 50)`}
                showContour={showContour}
              />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-md">
            <ScatterPlot
              points={mainSample}
              caption={`표본집합 (N = ${sampleSize === 10000 ? "10,000" : sampleSize})`}
              showContour={showContour}
            />
          </div>
        )}
      </motion.div>

      <div className="mt-4 space-y-2 rounded-xl border border-cyan-200 bg-cyan-50 p-5 text-sm leading-relaxed text-gray-700 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-gray-200">
        <p>
          · 같은 모집단에서 50개씩 뽑아도 표본집합은 매번 서로 다름 —{" "}
          <strong>확률적 불확실성</strong>이 존재하기 때문.
        </p>
        <p>
          · 우리가 사용하는 <strong>학습 데이터 집합은 표본집합 중 하나에 불과</strong>. 학습 데이터에
          너무 집착하지 말고 전체 모집단이 어떤 분포를 가질지를 항상 고민하며 개발해야 함.
        </p>
        <p>
          · N = 50일 때보다 N = 10,000일 때의 분포가 원래 모집단에 더 가까움. 즉 학습할 때는 가능한 많은
          양의 데이터를 사용하는 것이 좋음.
        </p>
        <p>
          · 등고선은 모집단의 <strong>확률밀도함수</strong>를 나타내며, 가운데에 데이터가 많이 모이고
          양옆으로 퍼질수록 적어짐.
        </p>
      </div>
    </section>
  );
}
