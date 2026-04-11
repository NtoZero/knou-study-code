"use client";

import { useState } from "react";
import { HelpCircle, Lightbulb } from "lucide-react";

/* ---------------------------------------------------------------
 * AITerm — 인공지능 용어 + 물음표 호버 툴팁
 *
 * 사용 예:
 *   <AITerm term="UCS" />
 *   <AITerm term="g" label="g(n)" />
 *   <AITerm term="admissible" label="허용성" />
 *
 * 사용처: 테이블 헤더, 공식 카드 라벨, 단계별 로그의 phase 라벨,
 *          드릴 문제 본문 전문 용어. 설명 문단 본문에는 사용하지 않음.
 * ------------------------------------------------------------- */

interface TermInfo {
  full: string;
  korean: string;
  def: string;
  formula?: string;
  intuition?: string;
}

const TERMS: Record<string, TermInfo> = {
  UCS: {
    full: "Uniform-Cost Search",
    korean: "균일비용 탐색",
    def: "OPEN의 노드들 중 출발노드로부터의 경로비용 g(n)이 최소인 노드를 선택하여 확장하는 탐색 방법. 간선 비용이 0 이상이면 최적 경로 보장.",
    formula: "select argmin g(n)",
    intuition:
      "다익스트라와 사실상 동일. g가 작은 순으로 꺼내므로, 목표가 꺼내지는 순간이 곧 최소비용.",
  },
  AStar: {
    full: "A* Algorithm",
    korean: "A* 알고리즘",
    def: "평가함수 f(n) = g(n) + h(n)이 최소인 노드를 우선 확장하는 경험적 탐색. 허용적(admissible) h에서 최적 경로를 보장.",
    formula: "f(n) = g(n) + h(n)",
    intuition:
      "UCS(g만 사용)에 목표까지 예측 비용 h를 더해 '얼마나 가망 있는 경로인가'를 선택 기준으로.",
  },
  g: {
    full: "g(n) — Path Cost from Start",
    korean: "경로비용",
    def: "출발노드 S에서 노드 n까지 도달하는 데 소비한 실제 경로비용. 지금까지 걸어온 거리/시간.",
    formula: "g(n) = Σ c(이전, 현재)",
    intuition:
      "이미 지불한 확정 비용. 새 경로가 기존 g보다 크면 폐기(✕), 작으면 갱신.",
  },
  h: {
    full: "h(n) — Heuristic Estimate",
    korean: "휴리스틱 예측비용",
    def: "노드 n에서 목표노드 G까지 도달하는 데 필요한 비용의 예측치. 경험적 지식을 평가함수에 반영한 값.",
    intuition:
      "과대추정하면 A* 최적성이 깨질 수 있음. 직선거리·맨해튼거리 등이 전형적.",
  },
  hhat: {
    full: "ĥ(n) — Predicted Heuristic",
    korean: "예측 휴리스틱",
    def: "교재 표기. 경험적 지식을 이용하여 실제 잔여비용 h(n)을 예측한 값. ĥ(n) ≤ h(n)이면 허용적.",
    formula: "ĥ(n) ≤ h(n)",
  },
  f: {
    full: "f(n) — Evaluation Function",
    korean: "평가함수",
    def: "A* 알고리즘에서 확장 우선순위 결정에 쓰이는 값. 이미 쓴 비용(g)과 앞으로 예측되는 비용(h)의 합.",
    formula: "f(n) = g(n) + h(n)",
    intuition:
      "'이 경로로 갔을 때 목표까지 총 비용이 얼마일 것 같은가'의 낙관적 예측.",
  },
  OPEN: {
    full: "OPEN List",
    korean: "OPEN 리스트",
    def: "앞으로 확장할 후보 노드를 저장하는 자료구조. UCS는 g 오름차순, A*는 f 오름차순으로 정렬.",
    intuition:
      "다음에 누구를 꺼낼지 결정하는 '대기열'. 같은 상태가 더 작은 비용으로 갱신될 수 있음.",
  },
  CLOSED: {
    full: "CLOSED List",
    korean: "CLOSED 리스트",
    def: "이미 확장한 노드를 저장하는 자료구조. 중복 생성 방지와 경로 추적에 사용.",
    intuition:
      "'이미 처리 완료' 도장. 일관성 있는 h에서 CLOSED 노드는 재확장할 필요가 없음.",
  },
  expand: {
    full: "Expand (Node Expansion)",
    korean: "확장",
    def: "OPEN에서 꺼낸 노드의 모든 후계노드를 생성하고, 각 후계의 비용을 계산하여 OPEN에 삽입하는 연산.",
    intuition:
      "알고리즘의 '한 걸음'. 몇 회 확장했는지는 효율성 지표.",
  },
  goal: {
    full: "Goal Test",
    korean: "목표 도달",
    def: "UCS·A*는 목표 노드가 OPEN에서 '확장 대상으로 꺼내질 때' 종료함. 생성 시점이 아님.",
    intuition:
      "'목표를 보자마자 끝'이 아니라 '목표가 가장 유망해질 때 끝'. 그래야 최적성이 보장됨.",
  },
  stateSpace: {
    full: "State Space Graph",
    korean: "상태공간 그래프",
    def: "가능한 모든 상태를 노드로, 상태 전이를 간선으로 표현한 그래프. 탐색은 이 그래프 위에서 시작 상태로부터 목표 상태를 찾는 일.",
  },
  searchTree: {
    full: "Search Tree",
    korean: "탐색트리",
    def: "탐색 과정에서 실제로 확장·생성된 노드들을 부모-자식 관계로 나타낸 트리. 같은 상태라도 경로가 다르면 다른 노드로 표시.",
    intuition:
      "상태공간 그래프는 '지도', 탐색트리는 '그 지도 위를 실제로 걸어본 자취'.",
  },
  admissible: {
    full: "Admissibility",
    korean: "허용성",
    def: "휴리스틱 h(n)이 실제 최소비용 h*(n)을 절대 과대추정하지 않는 성질. A* 최적성의 필요충분조건(tree-search 기준).",
    formula: "h(n) ≤ h*(n)",
    intuition:
      "'낙관적 추정'. 실제보다 살짝 짧게 예측하는 건 OK, 길게 예측하면 최적 경로를 놓칠 수 있음.",
  },
  consistent: {
    full: "Consistency (Monotonicity)",
    korean: "일관성",
    def: "모든 엣지 (n → n′)에 대해 h(n) ≤ c(n,n′) + h(n′). graph-search A*도 최적성을 보장하기 위한 조건.",
    formula: "h(n) ≤ c(n,n′) + h(n′)",
    intuition:
      "삼각부등식과 동형. 일관성 ⇒ 허용성. 일관적이면 CLOSED 재확장이 필요 없음.",
  },
  heuristic: {
    full: "Heuristic",
    korean: "휴리스틱 (경험적 규칙)",
    def: "항상 옳지는 않지만 대부분의 경우에 잘 맞는 경험적 규칙. 탐색에서는 목표까지의 예측비용을 계산하는 함수로 등장.",
  },
  straightDist: {
    full: "Straight-line Distance",
    korean: "직선거리",
    def: "두 지점을 직선으로 이은 거리. 실제 도로거리는 이보다 짧을 수 없어(삼각부등식), 최단거리 탐색의 표준 허용 휴리스틱.",
    formula: "실제 거리 ≥ 직선거리",
    intuition:
      "어떤 우회로도 직선을 이기지 못함. 따라서 직선거리는 항상 낙관적 = 허용적.",
  },
  evalFunc: {
    full: "Evaluation Function",
    korean: "평가함수",
    def: "어떤 상태가 목표상태 탐색에 바람직한 정도를 평가하기 위한 척도. 경험적 탐색에서 확장 순서를 결정.",
  },
  optimality: {
    full: "Optimality",
    korean: "최적성",
    def: "알고리즘이 반환하는 해가 실제 최소비용 해임이 보장되는 성질. UCS는 비음 비용, A*는 허용적 h에서 성립.",
  },
  triangle: {
    full: "Triangle Inequality",
    korean: "삼각부등식",
    def: "세 점 사이의 거리에서 한 변은 나머지 두 변의 합 이하. 직선거리가 어떤 도로경로보다 짧거나 같은 이유.",
    formula: "d(A,C) ≤ d(A,B) + d(B,C)",
  },
  reexpand: {
    full: "Re-expansion",
    korean: "재확장",
    def: "CLOSED에 있던 노드가 더 작은 비용으로 다시 발견되어 재차 확장되는 일. 일관성 있는 h에서는 발생하지 않음.",
    intuition:
      "허용적이지만 일관적이지 않은 h는 tree-search는 괜찮지만 graph-search에서 재확장 처리가 필요.",
  },
  tieBreak: {
    full: "Tie Breaking",
    korean: "기존 우수 판단",
    def: "중복 생성된 동일 상태가 등장했을 때 g(또는 f)가 더 작은 쪽을 남기는 규칙. 같은 값이면 관례(알파벳/생성순)로 처리.",
    formula: "keep min(g_new, g_old)",
    intuition:
      "'같은 도시를 더 싸게 가는 경로가 있으면 그쪽으로 갱신'. 더 비싸면 ✕로 폐기.",
  },
  vmax: {
    full: "v_max (Maximum Speed)",
    korean: "도로망 최대 속도",
    def: "그래프의 모든 간선 중 가장 높은 이동 속도. 시간 기반 h(n)=직선거리/v가 허용적이려면 분모가 v_max 이상이어야 함.",
    formula: "h(n) = 직선거리 / v_max",
    intuition:
      "최대 속도로 직진해도 걸리는 시간이 '가장 낙관적' 예측. 이보다 더 작게 예측하면 허용성 깨짐.",
  },
};

export default function AITerm({
  term,
  label,
  className = "",
  tooltipSide = "bottom",
}: {
  term: string;
  label?: string;
  className?: string;
  tooltipSide?: "top" | "bottom";
}) {
  const [open, setOpen] = useState(false);
  const info = TERMS[term];
  const displayLabel = label ?? term;

  if (!info) return <span className={className}>{displayLabel}</span>;

  return (
    <span
      className={`relative inline-flex items-center gap-0.5 ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span>{displayLabel}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:text-indigo-600 focus:text-indigo-600 focus:outline-none"
        aria-label={`${info.full} (${info.korean}) 설명 보기`}
        title={`${info.full} (${info.korean})`}
      >
        <HelpCircle size={11} strokeWidth={2.5} />
      </button>
      {open && (
        <div
          role="tooltip"
          className={`absolute left-1/2 z-50 w-64 -translate-x-1/2 rounded-lg border-2 border-indigo-300 bg-white p-3 text-left font-normal normal-case shadow-xl dark:border-indigo-700 dark:bg-gray-900 ${
            tooltipSide === "top"
              ? "bottom-[calc(100%+6px)]"
              : "top-[calc(100%+6px)]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[11px] font-bold tracking-normal text-indigo-700 dark:text-indigo-300">
            {info.full}
          </div>
          <div className="text-[10px] text-gray-500">{info.korean}</div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-gray-700 dark:text-gray-300">
            {info.def}
          </p>
          {info.formula && (
            <div className="mt-1.5 rounded bg-indigo-50 px-2 py-1 font-mono text-[10px] text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-200">
              {info.formula}
            </div>
          )}
          {info.intuition && (
            <div className="mt-1.5 flex items-start gap-1 border-l-2 border-indigo-400 bg-indigo-50/40 py-1 pl-2 pr-1 text-[10px] text-gray-700 dark:bg-indigo-950/20 dark:text-gray-300">
              <Lightbulb
                size={10}
                className="mt-0.5 shrink-0 text-indigo-500"
              />
              <span>{info.intuition}</span>
            </div>
          )}
        </div>
      )}
    </span>
  );
}
