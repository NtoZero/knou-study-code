"use client";

import { useState } from "react";
import { HelpCircle, Lightbulb } from "lucide-react";

/* ---------------------------------------------------------------
 * CPMTerm — 용어 + 물음표 호버 툴팁
 *
 * 사용 예:
 *   <CPMTerm term="EST" />
 *   <CPMTerm term="duration" label="d" />
 *   <CPMTerm term="critical" label="Critical?" />
 *
 * 호버 시 용어 정의/공식/직관 해설을 보여줌. 클릭으로도 토글 가능.
 * ------------------------------------------------------------- */

interface TermInfo {
  full: string;
  korean: string;
  def: string;
  formula?: string;
  intuition?: string;
}

const TERMS: Record<string, TermInfo> = {
  EST: {
    full: "Earliest Start Time",
    korean: "가장 빠른 시작 시간",
    def: "모든 선행 작업이 끝나야 시작 가능하므로, 선행 중 가장 늦게 끝나는 시점이 곧 이 작업의 가장 빠른 시작.",
    formula: "EST = max(선행 EFT)",
    intuition:
      "선행 3개의 EFT가 {5, 8, 7}이면 EST = max = 8. 가장 늦게 끝나는 선행이 병목.",
  },
  EFT: {
    full: "Earliest Finish Time",
    korean: "가장 빠른 종료 시간",
    def: "가장 빠른 시작(EST)에 소요 기간(d)을 더한 가장 이른 종료 시점.",
    formula: "EFT = EST + d",
    intuition:
      "선택 연산(max/min) 없는 단순 덧셈. EST만 정해지면 기계적으로 결정됨.",
  },
  LST: {
    full: "Latest Start Time",
    korean: "가장 늦은 시작 시간",
    def: "프로젝트 완료 일정을 늦추지 않는 범위에서 이 작업을 가장 늦게 시작할 수 있는 시점.",
    formula: "LST = LFT − d",
    intuition:
      "'이 작업을 얼마나 미뤄도 되는가?'의 답. LFT가 먼저 결정되면 자동으로 따라옴.",
  },
  LFT: {
    full: "Latest Finish Time",
    korean: "가장 늦은 종료 시간",
    def: "프로젝트 완료 일정을 늦추지 않는 범위에서 이 작업을 가장 늦게 끝내도 되는 시점.",
    formula: "LFT = min(후속 LST)",
    intuition:
      "후속 3개의 LST가 {10, 6, 12}면 LFT = min = 6. 가장 빨리 시작해야 하는 후속이 데드라인.",
  },
  Slack: {
    full: "Slack (Total Float)",
    korean: "여유 시간",
    def: "프로젝트 완료를 늦추지 않고 이 작업을 미룰 수 있는 최대 시간. Slack=0이면 임계 경로 작업.",
    formula: "Slack = LST − EST = LFT − EFT",
    intuition:
      "Slack=5면 5주까지 지연해도 일정 영향 없음. Slack=0은 단 하루도 미룰 수 없음.",
  },
  duration: {
    full: "Duration",
    korean: "소요 기간 (d)",
    def: "한 작업을 수행하는 데 드는 시간. AON 표기에서 원 주변 숫자로 표시됨. 단위는 문제에 따라 주·일·시간 등.",
  },
  critical: {
    full: "Critical Path",
    korean: "임계 경로",
    def: "Slack=0인 작업들로 연결된, 시작부터 종료까지의 가장 긴 경로. 이 경로 위의 작업이 하나라도 지연되면 프로젝트 전체가 지연됨.",
    intuition:
      "여러 경로 중 최장 경로 = 임계 경로. Slack=0 작업 집합과 일치해야 계산이 올바름.",
  },
  forward: {
    full: "Forward Pass",
    korean: "전진 계산",
    def: "시작 작업부터 종료 작업까지 왼쪽 → 오른쪽 방향으로 각 작업의 EST와 EFT를 순서대로 구하는 단계. 여러 선행이 있으면 max 규칙 적용.",
  },
  backward: {
    full: "Backward Pass",
    korean: "후진 계산",
    def: "종료 작업부터 시작 작업까지 오른쪽 → 왼쪽 역방향으로 각 작업의 LFT와 LST를 구하는 단계. 여러 후속이 있으면 min 규칙 적용.",
  },
  merge: {
    full: "Merge Node",
    korean: "합류 노드",
    def: "2개 이상의 선행 작업이 모이는 노드. Forward pass에서 max 규칙을 적용해 EST를 결정.",
    formula: "EST = max(선행 EFT)",
  },
  fork: {
    full: "Fork Node",
    korean: "분기 노드",
    def: "2개 이상의 후속 작업으로 갈라지는 노드. Backward pass에서 min 규칙을 적용해 LFT를 결정.",
    formula: "LFT = min(후속 LST)",
  },
  AON: {
    full: "Activity-on-Node",
    korean: "AON 표기",
    def: "작업(Activity)을 노드(원)로, 선행 관계를 화살표로 표현하는 네트워크 다이어그램 표기법. 본 과목의 표준.",
  },
  precedence: {
    full: "Precedence",
    korean: "선행 관계",
    def: "한 작업이 끝나야 다른 작업이 시작될 수 있는 제약. 화살표로 표시 (X→Y는 'Y는 X가 끝나기 전에 시작 불가').",
  },
};

export default function CPMTerm({
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

  if (!info)
    return <span className={className}>{displayLabel}</span>;

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
        className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:text-emerald-600 focus:text-emerald-600 focus:outline-none"
        aria-label={`${info.full} (${info.korean}) 설명 보기`}
        title={`${info.full} (${info.korean})`}
      >
        <HelpCircle size={11} strokeWidth={2.5} />
      </button>
      {open && (
        <div
          role="tooltip"
          className={`absolute left-1/2 z-50 w-64 -translate-x-1/2 rounded-lg border-2 border-emerald-300 bg-white p-3 text-left font-normal normal-case shadow-xl dark:border-emerald-700 dark:bg-gray-900 ${
            tooltipSide === "top"
              ? "bottom-[calc(100%+6px)]"
              : "top-[calc(100%+6px)]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[11px] font-bold tracking-normal text-emerald-700 dark:text-emerald-300">
            {info.full}
          </div>
          <div className="text-[10px] text-gray-500">{info.korean}</div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-gray-700 dark:text-gray-300">
            {info.def}
          </p>
          {info.formula && (
            <div className="mt-1.5 rounded bg-emerald-50 px-2 py-1 font-mono text-[10px] text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
              {info.formula}
            </div>
          )}
          {info.intuition && (
            <div className="mt-1.5 flex items-start gap-1 border-l-2 border-emerald-400 bg-emerald-50/40 py-1 pl-2 pr-1 text-[10px] text-gray-700 dark:bg-emerald-950/20 dark:text-gray-300">
              <Lightbulb
                size={10}
                className="mt-0.5 shrink-0 text-emerald-500"
              />
              <span>{info.intuition}</span>
            </div>
          )}
        </div>
      )}
    </span>
  );
}
