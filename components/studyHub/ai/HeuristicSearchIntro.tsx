"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Compass, ArrowRight } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

/* ------------------------------------------------------------------ */
/* UCS 한계 시각 — 같은 그래프에서 UCS가 전방향 확장하는 모습               */
/* ------------------------------------------------------------------ */

// 단순 격자 그래프: 출발(S) 중심, 목표(G)는 오른쪽 끝
// UCS는 비용 순서대로 사방으로 퍼지고, 경험적 탐색은 G 방향으로 집중

type NodeId = "S"|"A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I";

const NODES: {id:NodeId; x:number; y:number; h:number}[] = [
  { id:"S", x:80,  y:150, h:8 },
  { id:"A", x:200, y:70,  h:6 },
  { id:"B", x:200, y:150, h:5 },
  { id:"C", x:200, y:230, h:7 },
  { id:"D", x:320, y:70,  h:4 },
  { id:"E", x:320, y:150, h:3 },
  { id:"F", x:320, y:230, h:5 },
  { id:"G", x:440, y:150, h:0 },
  { id:"H", x:440, y:70,  h:2 },
  { id:"I", x:440, y:230, h:3 },
];

const EDGES: {from:NodeId;to:NodeId;cost:number}[] = [
  {from:"S",to:"A",cost:3},{from:"S",to:"B",cost:2},{from:"S",to:"C",cost:4},
  {from:"A",to:"D",cost:3},{from:"A",to:"E",cost:4},
  {from:"B",to:"D",cost:2},{from:"B",to:"E",cost:2},{from:"B",to:"F",cost:3},
  {from:"C",to:"E",cost:3},{from:"C",to:"F",cost:2},
  {from:"D",to:"H",cost:2},{from:"E",to:"G",cost:3},{from:"F",to:"I",cost:2},
  {from:"H",to:"G",cost:3},{from:"I",to:"G",cost:4},
];

// UCS 확장 순서 (g 기준)
const UCS_ORDER: NodeId[] = ["S","B","A","C","D","E","F","G"];
// 경험적 탐색은 G 방향 집중
const HEURISTIC_ORDER: NodeId[] = ["S","B","E","G"];

/* ------------------------------------------------------------------ */
/* 평가함수 3가지 기호 설명                                               */
/* ------------------------------------------------------------------ */
const EVAL_TERMS = [
  {
    symbol: "g(n)",
    color: "border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    title: "실제 경로비용",
    desc: "출발노드 S에서 노드 n까지 실제로 소비된 경로비용. 탐색을 진행하면서 정확히 계산 가능.",
    example: "S→B→E 경로라면 g(E) = 2+2 = 4",
    used: "UCS, A*",
  },
  {
    symbol: "h(n)",
    color: "border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/30",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
    title: "실제 잔여비용 (미지)",
    desc: "노드 n에서 목표노드 G까지 실제로 필요한 최소 비용. 목표에 도달하기 전에는 알 수 없음.",
    example: "h(E)=3 (실제 E→G 최소비용) — 탐색 전엔 모름",
    used: "이론적 기준값 (실제 사용 불가)",
  },
  {
    symbol: "ĥ(n)",
    color: "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    title: "휴리스틱 — h(n) 예측값",
    desc: "경험적 지식으로 h(n)을 추정한 값. 항상 정확하진 않지만 대부분 좋은 방향을 가리킴.",
    example: "직선거리로 목표까지 거리 추정 → ĥ(E)=3",
    used: "언덕오르기, A*",
  },
];

/* ------------------------------------------------------------------ */
/* 탐색 방법별 평가함수 사용 분류                                          */
/* ------------------------------------------------------------------ */
const SEARCH_TABLE = [
  { name:"DFS / BFS",   type:"맹목적",   eval:"없음",         optimal:"DFS: ✗  BFS: ✗(비용)", note:"순서만으로 탐색, 비용·휴리스틱 모두 무시" },
  { name:"UCS",          type:"맹목적",   eval:"g(n)",         optimal:"✅ 최소비용", note:"비용은 알지만 목표 방향 정보 없음" },
  { name:"언덕오르기",   type:"경험적",   eval:"ĥ(n)",         optimal:"✗",  note:"목표 방향은 알지만 지나온 비용 무시 → 지역최적 빠짐" },
  { name:"A*",           type:"경험적",   eval:"f̂(n)=g(n)+ĥ(n)", optimal:"✅ (ĥ≤h 조건)", note:"실제 비용(g)+방향 예측(ĥ) → f̂ 최소 노드 우선 확장" },
];

/* ------------------------------------------------------------------ */
/* 메인                                                                  */
/* ------------------------------------------------------------------ */
export default function HeuristicSearchIntro() {
  const [mode, setMode] = useState<"ucs"|"heuristic">("ucs");
  const [activeTerm, setActiveTerm] = useState<string>("g(n)");

  const expandedSet = mode === "ucs" ? new Set(UCS_ORDER) : new Set(HEURISTIC_ORDER);
  const order = mode === "ucs" ? UCS_ORDER : HEURISTIC_ORDER;

  function nodeById(id:NodeId){ return NODES.find(n=>n.id===id)! }

  function nodeColor(id:NodeId){
    if(!expandedSet.has(id)) return { fill:"#f8fafc", stroke:"#cbd5e1", text:"#94a3b8" };
    if(id==="G") return { fill:"#10b981", stroke:"#059669", text:"#ffffff" };
    if(id==="S") return { fill:"#6366f1", stroke:"#4338ca", text:"#ffffff" };
    return mode==="ucs"
      ? { fill:"#bfdbfe", stroke:"#3b82f6", text:"#1e40af" }
      : { fill:"#bbf7d0", stroke:"#10b981", text:"#065f46" };
  }

  return (
    <section className="space-y-10">
      <SectionTitle
        title="3강 · 경험적 탐색 — 왜 휴리스틱이 필요한가?"
        subtitle="UCS는 최적이지만 느립니다. 목표 방향 정보를 더하면 탐색 범위를 크게 줄일 수 있습니다"
      />

      {/* ── UCS의 한계 ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-600" />
          <h3 className="text-sm font-bold text-amber-800 dark:text-amber-200">맹목적 탐색의 한계</h3>
        </div>
        <p className="text-xs text-amber-800 dark:text-amber-200">
          UCS는 <b>비용이 가장 적은 노드부터</b> 확장합니다. 최적 경로를 <b>반드시</b> 찾지만,
          목표가 어느 방향에 있는지 전혀 모르기 때문에 <b>모든 방향으로 고르게 퍼져나갑니다.</b>
          상태 수가 많으면 탐색 공간이 기하급수적으로 커집니다.
        </p>
        <div className="mt-3 rounded-lg bg-white/70 p-2 text-[11px] text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          비유: 낯선 도시에서 목적지를 찾는데 지도도, 나침반도 없이 가까운 골목부터 차례로 모두 탐색하는 것.
        </div>
      </div>

      {/* ── 시각 비교: UCS vs 경험적 탐색 ───────────────────────── */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">
          같은 그래프 — 탐색 범위 비교
        </h3>
        <div className="mb-3 flex gap-2">
          <button
            onClick={()=>setMode("ucs")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              mode==="ucs"
                ? "bg-blue-500 text-white shadow"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300"
            }`}
          >
            UCS (맹목적)
          </button>
          <button
            onClick={()=>setMode("heuristic")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              mode==="heuristic"
                ? "bg-emerald-500 text-white shadow"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300"
            }`}
          >
            경험적 탐색 (ĥ 활용)
          </button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <svg viewBox="0 0 520 300" className="w-full">
            {EDGES.map((e,i)=>{
              const a=nodeById(e.from), b=nodeById(e.to);
              return (
                <g key={i}>
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#e2e8f0" strokeWidth={2}/>
                  <text x={(a.x+b.x)/2} y={(a.y+b.y)/2-4} fill="#94a3b8" fontSize={9} textAnchor="middle">{e.cost}</text>
                </g>
              );
            })}
            {NODES.map(n=>{
              const c=nodeColor(n.id);
              return (
                <motion.g key={n.id} animate={{ scale: expandedSet.has(n.id) ? 1 : 0.85 }} transition={{duration:0.3}}>
                  <circle cx={n.x} cy={n.y} r={22} fill={c.fill} stroke={c.stroke} strokeWidth={2}/>
                  <text x={n.x} y={n.y+2} textAnchor="middle" fontSize={13} fontWeight={700} fill={c.text}>{n.id}</text>
                  {mode==="heuristic" && expandedSet.has(n.id) && (
                    <text x={n.x} y={n.y+14} textAnchor="middle" fontSize={8} fill={c.text}>h={n.h}</text>
                  )}
                </motion.g>
              );
            })}
          </svg>

          <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
            <div className={`rounded-lg p-2 ${mode==="ucs" ? "bg-blue-50 dark:bg-blue-950/30" : "bg-gray-50 dark:bg-gray-800"}`}>
              <b className="text-blue-700 dark:text-blue-300">UCS 확장:</b>
              <span className="ml-1 text-gray-600 dark:text-gray-400">{UCS_ORDER.join(" → ")}</span>
              <p className="mt-0.5 text-[10px] text-gray-400">{UCS_ORDER.length}개 노드 확장</p>
            </div>
            <div className={`rounded-lg p-2 ${mode==="heuristic" ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-gray-50 dark:bg-gray-800"}`}>
              <b className="text-emerald-700 dark:text-emerald-300">경험적 탐색 확장:</b>
              <span className="ml-1 text-gray-600 dark:text-gray-400">{HEURISTIC_ORDER.join(" → ")}</span>
              <p className="mt-0.5 text-[10px] text-gray-400">{HEURISTIC_ORDER.length}개 노드만 확장</p>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-lg bg-indigo-50 p-3 text-xs dark:bg-indigo-950/30">
          <Compass size={14} className="mt-0.5 shrink-0 text-indigo-500"/>
          <p className="text-indigo-800 dark:text-indigo-200">
            <b>경험적 정보(rule of thumb)</b>: 항상 옳은 것은 아니지만 대부분의 경우에 맞는 규칙.
            목표까지의 <b>직선거리</b>처럼, 실제 경로보다 짧지만 방향 판단에는 충분한 정보.
          </p>
        </div>
      </div>

      {/* ── 평가함수 기호 3가지 ──────────────────────────────────── */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">
          평가함수의 세 가지 기호 — 클릭해서 확인
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {EVAL_TERMS.map(t=>(
            <button
              key={t.symbol}
              onClick={()=>setActiveTerm(t.symbol)}
              className={`rounded-xl border-2 p-3 text-left transition-all ${t.color} ${
                activeTerm===t.symbol ? "shadow-md ring-2 ring-indigo-400/40" : "opacity-70 hover:opacity-100"
              }`}
            >
              <div className="mb-1 font-mono text-lg font-black text-gray-800 dark:text-gray-100">{t.symbol}</div>
              <div className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">{t.title}</div>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {EVAL_TERMS.filter(t=>t.symbol===activeTerm).map(t=>(
            <motion.div
              key={t.symbol}
              initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}
              transition={{duration:0.18}}
              className={`mt-3 rounded-xl border-2 p-4 ${t.color}`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${t.badge}`}>{t.symbol}</span>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{t.title}</span>
              </div>
              <p className="mb-2 text-xs text-gray-700 dark:text-gray-300">{t.desc}</p>
              <div className="rounded-lg bg-white/70 p-2 dark:bg-gray-900/60">
                <span className="text-[10px] font-bold text-gray-500">예시: </span>
                <span className="text-[11px] text-gray-600 dark:text-gray-400">{t.example}</span>
              </div>
              <div className="mt-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${t.badge}`}>사용 알고리즘: {t.used}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* f̂(n) = g(n) + ĥ(n) 합성 공식 */}
        <div className="mt-4 space-y-2">
          {/* 이론값 vs 실용값 구분 */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40 px-4 py-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">교재 식 3-2 (이론):</span>{" "}
            <span className="font-mono">f(n) = g(n) + h(n)</span>
            {" "}— h(n)은 목표까지의 <em>실제</em> 잔여비용. 탐색 전에는 알 수 없으므로 직접 사용 불가.
          </div>
          <div className="flex items-center justify-center gap-3 rounded-xl border border-indigo-300 bg-indigo-50 p-4 dark:border-indigo-700 dark:bg-indigo-950/20">
            <div className="text-center">
              <div className="font-mono text-lg font-black text-blue-600">g(n)</div>
              <div className="text-[10px] text-gray-500">지금까지 실제 비용</div>
            </div>
            <span className="text-xl font-bold text-gray-400">+</span>
            <div className="text-center">
              <div className="font-mono text-lg font-black text-emerald-600">ĥ(n)</div>
              <div className="text-[10px] text-gray-500">h(n)의 경험적 예측치</div>
            </div>
            <span className="text-xl font-bold text-gray-400">=</span>
            <div className="text-center">
              <div className="font-mono text-lg font-black text-indigo-600">f̂(n)</div>
              <div className="text-[10px] text-gray-500">전체 예측 비용</div>
            </div>
            <ArrowRight size={16} className="text-gray-400"/>
            <div className="text-center">
              <div className="text-sm font-bold text-indigo-700 dark:text-indigo-300">A* 실제 평가함수</div>
              <div className="text-[10px] text-gray-500">교재 식 3-3, f̂ 최소 노드를 먼저 확장</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 탐색 방법 분류표 ─────────────────────────────────────── */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">
          탐색 알고리즘 — 어떤 정보를 사용하는가?
        </h3>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                <th className="py-2 pl-4 text-left font-bold text-gray-600 dark:text-gray-400">알고리즘</th>
                <th className="py-2 pl-4 text-left font-bold text-gray-600 dark:text-gray-400">종류</th>
                <th className="py-2 pl-4 text-left font-bold text-gray-600 dark:text-gray-400">평가함수</th>
                <th className="py-2 pl-4 text-left font-bold text-gray-600 dark:text-gray-400">최적성</th>
                <th className="py-2 pl-4 text-left font-bold text-gray-600 dark:text-gray-400">설명</th>
              </tr>
            </thead>
            <tbody>
              {SEARCH_TABLE.map((row,i)=>(
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 pl-4 font-bold text-gray-800 dark:text-gray-200">{row.name}</td>
                  <td className="py-2 pl-4">
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      row.type==="맹목적"
                        ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                    }`}>{row.type}</span>
                  </td>
                  <td className="py-2 pl-4 font-mono text-indigo-600 dark:text-indigo-400">{row.eval}</td>
                  <td className="py-2 pl-4 text-gray-700 dark:text-gray-300">{row.optimal}</td>
                  <td className="py-2 pl-4 text-gray-500 dark:text-gray-400">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
