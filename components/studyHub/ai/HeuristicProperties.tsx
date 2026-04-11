"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Ruler, Clock } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

/**
 * 휴리스틱 속성 (허용성, 일관성) 인터랙티브 설명
 */

type Tab = "admissible" | "consistent" | "timeHeuristic";

const TABS: { key: Tab; label: string }[] = [
  { key: "admissible", label: "허용성 (Admissibility)" },
  { key: "consistent", label: "일관성 (Consistency)" },
  { key: "timeHeuristic", label: "시간 기준 휴리스틱" },
];

export default function HeuristicProperties() {
  const [tab, setTab] = useState<Tab>("admissible");
  const [showCounter, setShowCounter] = useState(false);

  return (
    <section>
      <SectionTitle
        title="휴리스틱의 두 가지 속성"
        subtitle="A* 최적성을 보장하기 위한 조건"
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              tab === t.key
                ? "bg-indigo-500 text-white shadow"
                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "admissible" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-900/40 dark:bg-gray-900">
            <div className="mb-2 text-sm font-bold text-indigo-600">
              h(n) ≤ h*(n)
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              모든 노드 n에서 휴리스틱 값 h(n)이 <b>실제 최적 잔여 비용 h*(n)</b>을
              절대 초과하지 않음. 즉 <b>낙관적(optimistic)</b> 추정.
            </p>
            <div className="mt-3 rounded-lg bg-indigo-50 p-3 text-xs dark:bg-indigo-950/30">
              <b>직선거리 휴리스틱은 왜 허용적인가?</b>
              <br />
              실제 도로는 곡선·우회로를 포함하므로 <b>두 점 사이 실제 이동거리 ≥ 직선거리</b>임
              (삼각부등식). 따라서 직선거리는 항상 실제 최단거리 이하 → 허용적.
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs dark:border-amber-900/40 dark:bg-amber-950/20">
            <div className="mb-2 flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-300">
              <XCircle size={14} /> 반례: 허용적이지 않은 휴리스틱
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              만약 어떤 노드에서 h(n)이 실제 잔여 비용보다 <b>크다고 설정</b>되면,
              그 노드를 포함하는 "진짜 최적 경로"가 f값에서 불리해져 다른
              (더 비용 큰) 경로가 먼저 목표에 도달하는 일이 생길 수 있음.
              그 결과 A*가 <b>진짜 최단 경로를 놓칠 수 있음</b>.
            </p>
          </div>
        </motion.div>
      )}

      {tab === "consistent" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-900/40 dark:bg-gray-900">
            <div className="mb-2 text-sm font-bold text-indigo-600">
              h(n) ≤ c(n, n') + h(n')
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              모든 엣지 (n → n')에 대해, n에서의 예측 비용은{" "}
              <b>"엣지 비용 + n'에서의 예측 비용"</b>을 초과하지 않음. 이는 곧 f값이 경로를 따라{" "}
              <b>단조 증가</b>함을 의미함 (monotonicity).
            </p>
            <div className="mt-3 rounded-lg bg-indigo-50 p-3 text-xs dark:bg-indigo-950/30">
              <b>의미:</b> 일관성을 만족하면 한 번 CLOSED에 들어간 노드는 다시{" "}
              더 좋은 g로 갱신될 일이 없어서, <b>graph-search(CLOSED 사용) A*도 최적 보장</b>.
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <button
              onClick={() => setShowCounter((s) => !s)}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              {showCounter ? "반례 카드 접기" : "반례 카드 펼치기"}
            </button>
            {showCounter && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-100"
              >
                <b>허용은 하지만 일관성은 깨지는 예:</b> 세 노드 X, Y, Goal이
                있고 c(X,Y)=1, c(Y,Goal)=1이라 하자. 실제로는 h*(X)=2, h*(Y)=1.
                여기서 h(X)=2, h(Y)=0 이라 두면 두 값 모두 h* 이하이므로 허용.
                하지만 h(X)=2 &gt; c(X,Y) + h(Y)=1+0=1 → 일관성 조건 위반. 이런 상황에서
                tree-search A*는 여전히 최적이지만 graph-search는 재확장이 필요함.
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {tab === "timeHeuristic" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-900/40 dark:bg-gray-900">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-indigo-600">
              <Clock size={14} /> 거리 → 시간 휴리스틱
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              비용 단위가 <b>시간(h)</b>일 때 "직선거리 / 속도" 형태의 휴리스틱을
              허용적으로 만들려면, <b>분모 속도는 그래프 내에서 가능한 최대 속도</b>여야 함.
            </p>
            <div className="mt-3 grid gap-2 text-xs">
              <div className="rounded-lg bg-indigo-50 p-3 dark:bg-indigo-950/30">
                <b>왜 최대 속도여야 하는가?</b>
                <br />
                실제 이동 시간 ≥ (실제 거리) / (최대 속도) ≥ (직선거리) / (최대 속도).
                즉 최대 속도로 나누면 실제 최소 이동 시간보다 <b>작거나 같음</b>이 보장됨.
              </div>
              <div className="rounded-lg bg-amber-50 p-3 text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
                <b>주의:</b> 만약 분모에 "평균" 속도나 "최소" 속도를 쓰면, 실제보다 더{" "}
                <b>긴 시간</b>으로 예측될 수 있어 <b>허용성이 깨질 수 있음</b>.
                과제에서 주어지는 구체 속도 수치를 그대로 쓰되, 그 값이 그래프 내에서 최대 속도인지{" "}
                스스로 판단할 것.
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-900/40 dark:bg-gray-900">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-indigo-600">
              <Ruler size={14} /> 단위 변환의 기본
            </div>
            <div className="text-xs font-mono text-gray-700 dark:text-gray-300">
              시간 [h] = 거리 [km] / 속도 [km/h]
            </div>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              분수 형태를 그대로 남겨 두면 반올림으로 인한 일관성 붕괴를 막을 수 있음.
              풀이 과정에서는 정확한 기약분수로 표기하는 것이 안전함.
            </p>
          </div>
        </motion.div>
      )}

      <div className="mt-5 rounded-lg border-l-4 border-indigo-500 bg-indigo-50 p-3 text-xs text-gray-700 dark:bg-indigo-950/30 dark:text-gray-300">
        <CheckCircle2 size={14} className="mb-1 inline text-indigo-600" />{" "}
        <b>정리:</b> 허용성 ⊂ 일관성. 일관성이 성립하면 허용성도 자동 성립. 반대는
        성립하지 않음.
      </div>
    </section>
  );
}
