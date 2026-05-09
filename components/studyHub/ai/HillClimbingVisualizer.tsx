"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Shuffle, ChevronRight } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

/* ------------------------------------------------------------------ */
/* 1차원 지형 정의                                                        */
/* 지형 함수 h(x): x ∈ [0, 100] → [0, 100] (높을수록 좋음)              */
/* ------------------------------------------------------------------ */

function landscape(x: number): number {
  // 지역 최대치 60 (x≈25), 전역 최대치 90 (x≈70), 고원 구간 x≈45~52
  return (
    20 * Math.sin((x / 100) * Math.PI * 0.8) +
    30 * Math.exp(-((x - 25) ** 2) / 100) +
    45 * Math.exp(-((x - 70) ** 2) / 200) +
    8  * Math.exp(-((x - 48) ** 2) / 15) +   // 고원 흉내
    5
  );
}

// SVG 좌표 변환
const SVG_W = 500;
const SVG_H = 180;
function toSVG(x: number, y: number): [number, number] {
  const sx = (x / 100) * SVG_W;
  const sy = SVG_H - (y / 100) * SVG_H * 0.92 - 8;
  return [sx, sy];
}

// 지형 폴리라인 포인트 생성
const CURVE_POINTS = Array.from({ length: 201 }, (_, i) => {
  const x = i / 2;
  const [sx, sy] = toSVG(x, landscape(x));
  return `${sx},${sy}`;
}).join(" ");

/* ------------------------------------------------------------------ */
/* 언덕오르기 시뮬레이션                                                   */
/* ------------------------------------------------------------------ */
function hillClimbStep(x: number, stepSize = 3): number {
  const left  = landscape(Math.max(0,   x - stepSize));
  const right = landscape(Math.min(100, x + stepSize));
  const cur   = landscape(x);
  if (right > cur && right >= left) return Math.min(100, x + stepSize);
  if (left  > cur) return Math.max(0,   x - stepSize);
  return x; // 정상(이웃이 모두 낮거나 같음)
}

/* ------------------------------------------------------------------ */
/* 문제 유형별 시나리오                                                    */
/* ------------------------------------------------------------------ */
const PROBLEM_SCENARIOS = [
  {
    id: "local",
    label: "지역최대치 문제",
    icon: "⛰️",
    startX: 15,
    color: "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
    desc: "출발점이 25 근처이면 지역 최대치(높이≈60)에서 멈춤. 전역 최대치(높이≈90, x≈70)에 도달하지 못함.",
    issue: "주변 이웃 상태가 모두 현재보다 낮을 때 탐색 종료 → 전역 최적이 아닐 수 있음.",
  },
  {
    id: "plateau",
    label: "고원 문제",
    icon: "🏔️",
    startX: 44,
    color: "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    desc: "x≈48 근처 평탄 구간. 이웃 상태가 모두 비슷한 높이라 방향 판단 불가.",
    issue: "평가함수 값이 변하지 않아 다음 이동 방향을 결정할 수 없음 → 진행 중단.",
  },
  {
    id: "global",
    label: "전역 최적 (성공 예시)",
    icon: "🚀",
    startX: 58,
    color: "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    desc: "출발점이 전역 최대치(x≈70) 근처라면 성공적으로 도달.",
    issue: "운 좋게 전역 최적 근처에서 시작했을 때만 가능.",
  },
];

/* ------------------------------------------------------------------ */
/* 모의 담금질 설명 데이터                                                 */
/* ------------------------------------------------------------------ */
const SA_STEPS = [
  { icon:"🌡️", label:"높은 온도 초기", desc:"나쁜 방향으로도 높은 확률로 이동. 지형 전체를 자유롭게 탐색." },
  { icon:"📉", label:"온도 서서히 감소", desc:"시간이 지날수록 나쁜 방향으로의 이동 확률이 줄어듦." },
  { icon:"0️⃣", label:"온도 → 0", desc:"나쁜 방향 이동 확률이 0에 수렴. 일반 언덕오르기처럼 동작." },
];

/* ------------------------------------------------------------------ */
/* 메인 컴포넌트                                                          */
/* ------------------------------------------------------------------ */
export default function HillClimbingVisualizer() {
  const [activeScenario, setActiveScenario] = useState(PROBLEM_SCENARIOS[0]);
  const [posX, setPosX] = useState(PROBLEM_SCENARIOS[0].startX);
  const [running, setRunning] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [path, setPath] = useState<number[]>([PROBLEM_SCENARIOS[0].startX]);
  const [saStep, setSaStep] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function reset(scenario = activeScenario) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setStuck(false);
    setPosX(scenario.startX);
    setPath([scenario.startX]);
  }

  useEffect(() => { reset(activeScenario); }, [activeScenario]); // eslint-disable-line

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setPosX(prev => {
        const next = hillClimbStep(prev);
        if (next === prev) {
          setStuck(true);
          setRunning(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          return prev;
        }
        setPath(p => [...p, next]);
        return next;
      });
    }, 400);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const curH = landscape(posX);
  const [dotX, dotY] = toSVG(posX, curH);
  const globalMax = Math.max(...Array.from({length:201},(_,i)=>landscape(i/2)));

  return (
    <section className="space-y-10">
      <SectionTitle
        title="3강 · 언덕오르기 탐색 · 모의 담금질"
        subtitle="경험적 탐색의 첫 번째 방법 — 목표 방향으로만 움직이지만 함정이 있습니다"
      />

      {/* ── 언덕오르기 개념 ─────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-900/40 dark:bg-indigo-950/20">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-600"/>
            <h3 className="text-sm font-bold text-indigo-800 dark:text-indigo-200">언덕오르기 탐색이란?</h3>
          </div>
          <p className="text-xs text-indigo-800 dark:text-indigo-200">
            현재 상태의 후계노드 중 평가함수 <b>ĥ(n)이 최소(목표에 가장 가까운)인 노드</b>만 선택해 이동.
            지나온 비용 g(n)은 고려하지 않음.
          </p>
          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="rounded bg-indigo-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">평가함수</span>
              <span className="text-gray-600 dark:text-gray-400">ĥ(n) — 현재→목표 예측비용만 사용</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-indigo-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">탐색 방향</span>
              <span className="text-gray-600 dark:text-gray-400">깊이우선 탐색과 유사하게 진행</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-indigo-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">최적성</span>
              <span className="text-red-600 dark:text-red-400">❌ 보장 안 됨</span>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">등산 문제 비유</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            짙은 안개 속 초행길 등산. 지도도 없고 길도 없음.
            오직 <b>발 아래 경사</b>만 느끼며 가장 가파른 오르막 방향으로 이동.
          </p>
          <div className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <p><b>상태:</b> 등산가의 좌표 + 고도</p>
            <p><b>연산자:</b> 동·서·남·북으로 정해진 거리 이동</p>
            <p><b>목표상태:</b> 주변 모든 방향이 현재보다 낮은 상태 (정상)</p>
          </div>
        </div>
      </div>

      {/* ── 인터랙티브 시뮬레이션 ─────────────────────────────────── */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">
          언덕오르기 시뮬레이션 — 출발 위치별 결과
        </h3>

        {/* 시나리오 선택 */}
        <div className="mb-3 grid gap-2 sm:grid-cols-3">
          {PROBLEM_SCENARIOS.map(s=>(
            <button
              key={s.id}
              onClick={()=>{ setActiveScenario(s); }}
              className={`rounded-xl border-2 p-3 text-left transition-all ${s.color} ${
                activeScenario.id===s.id ? "shadow-md ring-2 ring-indigo-400/40" : "opacity-65 hover:opacity-90"
              }`}
            >
              <div className="mb-0.5 text-lg">{s.icon}</div>
              <div className={`text-[11px] font-bold ${s.badge.split(" ").slice(1).join(" ")}`}>{s.label}</div>
              <div className="mt-0.5 text-[10px] text-gray-500">출발: x={s.startX}</div>
            </button>
          ))}
        </div>

        {/* 지형 SVG */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full">
            {/* 지형 */}
            <polyline points={CURVE_POINTS} fill="none" stroke="#818cf8" strokeWidth={2.5}/>
            {/* 아래 채우기 */}
            <polygon
              points={`0,${SVG_H} ${CURVE_POINTS} ${SVG_W},${SVG_H}`}
              fill="#eef2ff"
              className="dark:fill-indigo-950/30"
            />
            {/* 지나온 경로 */}
            {path.length > 1 && (
              <polyline
                points={path.map(x=>{const[sx,sy]=toSVG(x,landscape(x));return`${sx},${sy}`;}).join(" ")}
                fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 2"
              />
            )}
            {/* 현재 위치 */}
            <motion.circle
              cx={dotX} cy={dotY} r={8}
              fill={stuck ? "#ef4444" : "#f59e0b"}
              stroke="#fff" strokeWidth={2}
              animate={{ cx: dotX, cy: dotY }}
              transition={{ type:"spring", stiffness:200, damping:20 }}
            />
            {/* 레이블 */}
            <text x={dotX+10} y={dotY-4} fontSize={9} fill="#b45309" fontWeight={700}>
              h={curH.toFixed(1)}
            </text>
            {/* 전역 최대치 표시 */}
            {(() => {
              const gx = 70;
              const [sx,sy] = toSVG(gx, landscape(gx));
              return (
                <>
                  <line x1={sx} y1={sy-12} x2={sx} y2={sy} stroke="#10b981" strokeWidth={1.5} strokeDasharray="3 2"/>
                  <text x={sx} y={sy-16} fontSize={8} fill="#059669" textAnchor="middle" fontWeight={700}>전역최대</text>
                </>
              );
            })()}
          </svg>

          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              현재 위치: x={posX.toFixed(0)}, 높이={curH.toFixed(1)} &nbsp;|&nbsp;
              전역 최대: {globalMax.toFixed(1)}
              {stuck && <span className="ml-2 font-bold text-red-500">⛔ 멈춤!</span>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={()=>reset()}
                className="rounded-lg border px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                초기화
              </button>
              <button
                onClick={()=>setRunning(r=>!r)}
                disabled={stuck}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-all disabled:opacity-40 ${
                  running ? "bg-gray-500" : "bg-indigo-500 hover:bg-indigo-600"
                }`}
              >
                {running ? "⏸ 정지" : "▶ 탐색 시작"}
              </button>
            </div>
          </div>
        </div>

        {/* 시나리오 설명 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScenario.id}
            initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            className={`mt-3 rounded-xl border-2 p-4 ${activeScenario.color}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{activeScenario.icon}</span>
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{activeScenario.desc}</p>
                <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                  <b>문제:</b> {activeScenario.issue}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── 세 가지 문제점 정리 ──────────────────────────────────── */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">
          언덕오르기의 세 가지 함정
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon:"⛰️", title:"지역최대치 문제", sub:"Local Maximum", desc:"전역 최대가 아닌 주변의 극대치에서 탐색 종료. 모든 이웃이 현재보다 낮아 보이지만 실제 정상은 더 멀리 있음.", color:"bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/40" },
            { icon:"🏔️", title:"고원 문제", sub:"Plateau", desc:"평탄한 구간에서 이웃 상태들이 모두 비슷한 높이. 어느 방향으로 이동해야 할지 판단 불가능.", color:"bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40" },
            { icon:"🏔️", title:"능선 문제", sub:"Ridge", desc:"가능한 이동 방향에서는 경사가 하강하지만, 대각선 방향으로는 상승 경로가 존재. 탐색이 실제 방향을 놓침.", color:"bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-900/40" },
          ].map(p=>(
            <div key={p.title} className={`rounded-xl border p-4 ${p.color}`}>
              <div className="mb-2 text-xl">{p.icon}</div>
              <div className="mb-0.5 text-sm font-bold text-gray-800 dark:text-gray-200">{p.title}</div>
              <div className="mb-2 text-[10px] text-gray-400">{p.sub}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 모의 담금질 ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6 dark:border-sky-900/40 dark:bg-sky-950/20">
        <div className="mb-4 flex items-center gap-2">
          <Shuffle size={18} className="text-sky-600"/>
          <h3 className="text-base font-bold text-sky-800 dark:text-sky-200">모의 담금질 — 지역최대치 탈출</h3>
        </div>
        <p className="mb-4 text-xs text-sky-800 dark:text-sky-200">
          금속을 <b>가열 후 천천히 식히는 풀림(Annealing)</b>에서 착안. 초기엔 나쁜 방향으로도 확률적으로 이동하여
          지역최대치를 탈출하고, 시간이 지날수록 온도가 낮아지면서 수렴합니다.
        </p>

        {/* 핵심 메커니즘 */}
        <div className="mb-4 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-3 dark:bg-gray-900">
            <div className="mb-2 text-[11px] font-bold text-sky-700 dark:text-sky-300">ΔE &lt; 0 (개선)</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              평가함수 값이 좋아짐 → <b>무조건 이동</b>. 언덕오르기와 동일.
            </p>
          </div>
          <div className="rounded-xl bg-white p-3 dark:bg-gray-900">
            <div className="mb-2 text-[11px] font-bold text-sky-700 dark:text-sky-300">ΔE ≥ 0 (악화)</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              값이 나빠지더라도 확률 <b>e<sup>−ΔE/T</sup></b>로 이동.
              온도 T가 높을수록 이동 확률이 높음.
            </p>
          </div>
        </div>

        {/* 온도 단계 */}
        <div className="flex items-start gap-2 overflow-x-auto pb-1">
          {SA_STEPS.map((s,i)=>(
            <div key={i} className="flex shrink-0 items-start gap-1">
              <button
                onClick={()=>setSaStep(saStep===i?null:i)}
                className={`flex flex-col items-center gap-1 rounded-xl border px-4 py-3 text-center transition-all ${
                  saStep===i
                    ? "border-sky-400 bg-sky-100 shadow-sm dark:border-sky-700 dark:bg-sky-900/50"
                    : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                }`}
              >
                <span className="text-2xl">{s.icon}</span>
                <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">{s.label}</span>
              </button>
              {i<SA_STEPS.length-1 && <ChevronRight size={14} className="mt-5 shrink-0 text-gray-300"/>}
            </div>
          ))}
        </div>
        <AnimatePresence>
          {saStep!==null && (
            <motion.div
              initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}
              className="overflow-hidden"
            >
              <div className="mt-2 rounded-lg bg-sky-100 p-3 text-xs text-sky-800 dark:bg-sky-900/50 dark:text-sky-200">
                {SA_STEPS[saStep].desc}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 의사코드 */}
        <div className="mt-4 rounded-xl bg-gray-900 p-4 text-[11px] leading-relaxed text-gray-200 font-mono">
          <div className="text-gray-400 mb-1">// 모의 담금질 알고리즘</div>
          <div>현재상태 ← 초기상태;</div>
          <div>for t = 1 to ∞ do</div>
          <div className="pl-4 text-yellow-300">T = temperature(t);  <span className="text-gray-500">// 시간에 따라 서서히 감소</span></div>
          <div className="pl-4">if T == 0 then return 현재상태;</div>
          <div className="pl-4">차기상태 = 후계노드 중 <span className="text-emerald-300">임의 선택</span>;</div>
          <div className="pl-4">ΔE = h(차기) − h(현재);</div>
          <div className="pl-4 text-blue-300">if ΔE &lt; 0 then 현재상태 = 차기상태;  <span className="text-gray-500">// 개선 → 무조건 이동</span></div>
          <div className="pl-4 text-orange-300">else 확률 e^(−ΔE/T) 로 차기상태 선택;  <span className="text-gray-500">// 악화 → 확률적 이동</span></div>
          <div>end-for;</div>
        </div>

        <div className="mt-3 rounded-lg bg-white/70 p-2 text-[11px] text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
          <b>핵심:</b> 언덕오르기의 지역최대치 문제를 확률적 이동으로 탈출. 단, 최적해를 <b>보장하지는 않음</b>.
          실제 해의 품질은 온도 감소 스케줄(temperature schedule)에 의존.
        </div>
      </div>

      {/* ── 언덕오르기 vs 모의담금질 vs A* 비교 ─────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h4 className="mb-3 text-xs font-bold text-gray-600 dark:text-gray-400">
          경험적 탐색 3총사 비교
        </h4>
        <div className="grid gap-2 sm:grid-cols-3 text-xs">
          {[
            { name:"언덕오르기", eval:"ĥ(n)", optimal:"✗", memory:"O(1)", note:"빠르지만 지역최적에 빠짐" },
            { name:"모의 담금질", eval:"ĥ(n) + 확률", optimal:"✗(근사)", memory:"O(1)", note:"지역최적 탈출 가능, 느림" },
            { name:"A*", eval:"g(n)+ĥ(n)", optimal:"✅ (ĥ≤h 조건)", memory:"지수", note:"최적 보장, 메모리 많이 씀" },
          ].map(row=>(
            <div key={row.name} className="rounded-lg bg-white p-3 dark:bg-gray-800">
              <div className="mb-1 font-bold text-gray-800 dark:text-gray-200">{row.name}</div>
              <div className="space-y-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                <p>평가함수: <span className="font-mono text-indigo-600 dark:text-indigo-400">{row.eval}</span></p>
                <p>최적성: {row.optimal}</p>
                <p>메모리: {row.memory}</p>
                <p className="text-gray-400 italic">{row.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
