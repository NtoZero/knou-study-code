"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Route,
  Equal,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import AITerm from "./AITerm";

/* ------------------------------------------------------------
 * VerificationTechniques — 검산 기법 4종 교육
 *
 * 1. 경로 전수 탐색
 * 2. A* == UCS 일치 확인 (허용적일 때)
 * 3. 확장 횟수 A* ≤ UCS
 * 4. 허용성 깨지면 A* > UCS 가능
 * ---------------------------------------------------------- */

/* 경로 전수 탐색 예제 그래프 (가공 — 작은 4노드) */
const DEMO_GRAPH = {
  nodes: ["α", "β", "γ", "ζ"],
  edges: [
    { from: "α", to: "β", cost: 4 },
    { from: "α", to: "γ", cost: 3 },
    { from: "β", to: "ζ", cost: 2 },
    { from: "γ", to: "β", cost: 1 },
    { from: "γ", to: "ζ", cost: 5 },
  ],
};

function enumeratePaths(
  start: string,
  goal: string,
): { path: string[]; cost: number }[] {
  const results: { path: string[]; cost: number }[] = [];
  const dfs = (
    cur: string,
    visited: Set<string>,
    path: string[],
    cost: number,
  ) => {
    if (cur === goal) {
      results.push({ path: [...path], cost });
      return;
    }
    for (const e of DEMO_GRAPH.edges) {
      if (e.from === cur && !visited.has(e.to)) {
        visited.add(e.to);
        path.push(e.to);
        dfs(e.to, visited, path, cost + e.cost);
        path.pop();
        visited.delete(e.to);
      }
    }
  };
  dfs(start, new Set([start]), [start], 0);
  return results.sort((a, b) => a.cost - b.cost);
}

type TechKey = "enum" | "equal" | "expand" | "break";

const TECHS: { key: TechKey; title: string; icon: typeof Route }[] = [
  { key: "enum", title: "검산 1. 경로 전수 탐색", icon: Route },
  { key: "equal", title: "검산 2. A* = UCS 일치", icon: Equal },
  { key: "expand", title: "검산 3. A* ≤ UCS 확장 횟수", icon: TrendingDown },
  { key: "break", title: "검산 4. 허용성 깨지면?", icon: AlertTriangle },
];

export default function VerificationTechniques() {
  const [tech, setTech] = useState<TechKey>("enum");
  const paths = useMemo(() => enumeratePaths("α", "ζ"), []);
  const minCost = paths[0]?.cost ?? 0;

  return (
    <section>
      <SectionTitle
        title="검산 기법 4선"
        subtitle="탐색 결과가 정말 맞는지 검증하는 방법"
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {TECHS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTech(t.key)}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                tech === t.key
                  ? "bg-indigo-500 text-white shadow"
                  : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
              }`}
            >
              <Icon size={12} /> {t.title}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tech}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-900/40 dark:bg-gray-900"
        >
          {tech === "enum" && (
            <div>
              <div className="mb-2 flex items-center gap-1 text-sm font-bold text-indigo-700 dark:text-indigo-300">
                <Route size={13} /> 경로 전수 탐색
              </div>
              <p className="mb-3 text-xs text-gray-700 dark:text-gray-300">
                작은 그래프에서는 <b>시작 → 목표의 모든 단순 경로를 열거</b>한 뒤
                가장 비용이 작은 경로와 탐색 결과를 비교합니다. 단순 경로만
                고려하므로 DFS로 완전 열거.
              </p>
              <div className="mb-2 rounded-lg bg-indigo-50 p-3 text-[11px] dark:bg-indigo-950/30">
                <b>가공 예제 (α, β, γ, ζ)</b> — 간선:{" "}
                <span className="font-mono">
                  α-β:4, α-γ:3, β-ζ:2, γ-β:1, γ-ζ:5
                </span>
              </div>
              <ul className="mt-3 space-y-1 text-xs">
                {paths.map((p, i) => (
                  <li
                    key={i}
                    className={`flex items-center justify-between rounded px-2 py-1 ${
                      p.cost === minCost
                        ? "bg-emerald-50 font-bold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200"
                        : "bg-gray-50 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300"
                    }`}
                  >
                    <span className="font-mono">{p.path.join(" → ")}</span>
                    <span>
                      비용 <b>{p.cost}</b>
                      {p.cost === minCost && " ★"}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 rounded-lg border-l-4 border-indigo-500 bg-indigo-50/60 p-2 text-[11px] text-gray-700 dark:bg-indigo-950/30 dark:text-gray-300">
                <AITerm term="UCS" />·<AITerm term="AStar" label="A*" /> 결과가
                이 최소 비용({minCost})과 일치해야 정상. 일치하지 않으면 확장
                단계 어딘가에 계산 실수가 있음.
              </div>
            </div>
          )}

          {tech === "equal" && (
            <div>
              <div className="mb-2 flex items-center gap-1 text-sm font-bold text-indigo-700 dark:text-indigo-300">
                <Equal size={13} /> A* 결과 = UCS 결과 (허용적 h일 때)
              </div>
              <p className="mb-3 text-xs text-gray-700 dark:text-gray-300">
                <AITerm term="admissible" label="허용성" />이 만족되는 h를
                사용한 A*는 <b>UCS와 동일한 최소 비용</b>을 반환해야 합니다.
                경로 자체는 동점이 있으면 다를 수 있지만, <b>총 비용은 같아야</b>{" "}
                함. 두 값이 다르면 둘 중 하나의 계산이 틀렸거나 h가 허용적이지
                않음.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg bg-indigo-50 p-3 text-[11px] dark:bg-indigo-950/30">
                  <b>정상:</b> UCS 총 비용 = A* 총 비용
                  <br />→ 두 결과가 모두 최적 경로
                </div>
                <div className="rounded-lg bg-amber-50 p-3 text-[11px] dark:bg-amber-950/30">
                  <b>의심:</b> A* 총 비용 &gt; UCS 총 비용
                  <br />→ h가 허용적이지 않음을 의심
                </div>
              </div>
              <div className="mt-3 rounded-lg border-l-4 border-indigo-500 bg-indigo-50/60 p-2 text-[11px] text-gray-700 dark:bg-indigo-950/30 dark:text-gray-300">
                <b>활용:</b> 거리 기준 문제에서 직선거리 h로 A*를 풀었는데 UCS와
                비용이 다르다면 100% 계산 실수. 한 발 한 발 g 계산부터 다시 확인.
              </div>
            </div>
          )}

          {tech === "expand" && (
            <div>
              <div className="mb-2 flex items-center gap-1 text-sm font-bold text-indigo-700 dark:text-indigo-300">
                <TrendingDown size={13} /> A* 확장 횟수 ≤ UCS 확장 횟수
              </div>
              <p className="mb-3 text-xs text-gray-700 dark:text-gray-300">
                동일 그래프·동일 목표에서{" "}
                <AITerm term="admissible" label="허용적" /> h를 쓴 A*는 UCS보다{" "}
                <b>같거나 더 적은 횟수</b>로 목표에 도달합니다. A*가 더 많이
                확장했다면 h가 제 역할을 못하거나 h=0(=UCS)에 가까운 상황.
              </p>
              <div className="rounded-lg bg-indigo-50 p-3 text-[11px] dark:bg-indigo-950/30">
                과제 (가)·(나) 풀이에서 UCS 6회 확장 / A* 5회 확장이 나와야
                자연스러움. A* 쪽이 더 많다면 f 계산 실수나 h의 부호·단위 오류를
                점검.
              </div>
            </div>
          )}

          {tech === "break" && (
            <div>
              <div className="mb-2 flex items-center gap-1 text-sm font-bold text-indigo-700 dark:text-indigo-300">
                <AlertTriangle size={13} /> 허용성 깨지면 A* &gt; UCS 가능
              </div>
              <p className="mb-3 text-xs text-gray-700 dark:text-gray-300">
                h가 <b>실제 잔여 비용을 과대추정</b>하는 일부 노드가 있으면, 그
                노드를 포함하는 진짜 최적 경로가 탐색 우선순위에서 밀려서, A*가{" "}
                <b>더 큰 비용의 suboptimal 해</b>를 반환할 수 있습니다.
                <b> 반대 방향(A* &lt; UCS)은 절대 불가능</b>.
              </p>
              <div className="grid gap-2 text-[11px] sm:grid-cols-2">
                <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950/30">
                  <b>가능:</b> A* = UCS (허용적)
                </div>
                <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-950/30">
                  <b>가능:</b> A* &gt; UCS (과대추정 존재)
                </div>
                <div className="col-span-full rounded-lg bg-red-50 p-3 dark:bg-red-950/30">
                  <b>불가능:</b> A* &lt; UCS — 동일 그래프에서 UCS가 반환한
                  값보다 더 작은 총 비용이 존재할 수는 없음. 이 상황이 나오면 UCS
                  풀이부터 재검토.
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 rounded-lg bg-indigo-50 p-3 text-[11px] text-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-100">
        <ShieldCheck size={12} className="mb-0.5 mr-1 inline" />
        <b>제출 전 필수 체크:</b> (가)·(나)가 같은 최소비용을 내고, (나)의 확장
        횟수가 (가)보다 작거나 같은지 확인. (다)·(라)도 동일. 일치하지 않으면
        어느 단계에선가 실수가 있다.
      </div>
    </section>
  );
}
