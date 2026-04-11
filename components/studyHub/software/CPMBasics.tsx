"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  ChevronDown,
  GitMerge,
  GitFork,
  Lightbulb,
  Flag,
  CheckCircle2,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

interface Term {
  key: string;
  label: string;
  short: string;
  formula?: string;
  meaning: string;
  intuition: string;
}

const TERMS: Term[] = [
  {
    key: "activity",
    label: "Activity (작업)",
    short: "시간·자원을 소비하는 개별 작업 단위",
    meaning:
      "노드(AON 다이어그램) 또는 화살표(AOA 다이어그램)로 표현. 각 작업은 고정된 소요 기간(duration)을 가짐.",
    intuition:
      "CPM 네트워크의 기본 '블록'. 본 과목의 AON 표기에서는 원 안에 작업 이름이, 원 주변에 소요 기간이 표시됨.",
  },
  {
    key: "precedence",
    label: "Precedence (선행 관계)",
    short: "한 작업이 끝나야 다음 작업이 시작 가능",
    meaning:
      "화살표로 '이 작업이 끝나야 저 작업 시작'이라는 순서를 나타냄. 이 관계가 네트워크의 구조를 결정.",
    intuition:
      "화살표는 '시간의 흐름'이자 '의존 관계'. X → Y는 'Y는 X가 끝나기 전에는 시작할 수 없다'는 제약.",
  },
  {
    key: "est",
    label: "EST · Earliest Start Time",
    short: "작업을 가장 빨리 시작할 수 있는 시점",
    formula: "EST = \\max(\\text{선행 작업들의 EFT})",
    meaning:
      "모든 선행 작업이 끝나야만 시작 가능하므로, 선행들 중 가장 늦게 끝나는 시점이 곧 나의 가장 빠른 시작.",
    intuition:
      "선행이 3개이고 각각 5, 8, 7에 끝난다면 내 시작은 8 이전에 불가능함. 따라서 EST = max = 8. 가장 늦게 끝나는 선행이 '병목'이 됨.",
  },
  {
    key: "eft",
    label: "EFT · Earliest Finish Time",
    short: "작업을 가장 빨리 끝낼 수 있는 시점",
    formula: "EFT = EST + \\text{duration}",
    meaning: "가장 빠른 시작에 duration을 더하면 가장 빠른 끝.",
    intuition:
      "이 식엔 max/min 같은 선택이 없어 단순함. EST만 정해지면 기계적으로 EFT도 결정.",
  },
  {
    key: "lst",
    label: "LST · Latest Start Time",
    short: "프로젝트 완료 일정을 늦추지 않는 범위의 '가장 늦은 시작'",
    formula: "LST = LFT - \\text{duration}",
    meaning:
      "프로젝트 전체를 늦추지 않으려면 이 시점보다 늦게 시작해서는 안 됨.",
    intuition:
      "'이 작업을 얼마나 미뤄도 되지?'라는 질문의 답. LFT가 먼저 결정되면 자동으로 따라옴.",
  },
  {
    key: "lft",
    label: "LFT · Latest Finish Time",
    short: "프로젝트를 늦추지 않는 '가장 늦은 종료'",
    formula: "LFT = \\min(\\text{후행 작업들의 LST})",
    meaning:
      "후행 작업들 중 가장 빨리 시작해야 하는 작업의 시작 시간까지는 반드시 끝나야 함.",
    intuition:
      "후속이 3개이고 각각 10, 6, 12에 시작해야 한다면 내가 가장 늦게 끝낼 수 있는 시점은 6. 가장 빨리 시작해야 하는 후속이 '데드라인'이 됨.",
  },
  {
    key: "slack",
    label: "Slack · 여유 시간(Float)",
    short: "프로젝트를 늦추지 않고 미룰 수 있는 시간",
    formula: "\\text{Slack} = LST - EST = LFT - EFT",
    meaning:
      "여유 시간이 0인 작업은 조금만 늦어도 프로젝트 전체가 늦어짐. 즉 임계 경로(critical path) 위의 작업.",
    intuition:
      "Slack=5인 작업은 '5주 안에 시작만 하면 일정 영향 없음'. Slack=0인 작업은 '단 하루도 미룰 수 없음'.",
  },
];

export default function CPMBasics() {
  const [open, setOpen] = useState<string | null>("est");
  const [duration, setDuration] = useState(5);
  const [scenarioPredCount, setScenarioPredCount] = useState(1);
  const est = 3;

  // Merge 시나리오 값
  const MERGE_EFTS = [5, 8, 6];
  const mergeEst = Math.max(...MERGE_EFTS.slice(0, Math.max(scenarioPredCount, 1)));

  return (
    <section>
      <SectionTitle
        title="4. CPM(Critical Path Method) 기본 용어"
        subtitle="AON 다이어그램 · 4가지 시간 · merge/fork 규칙 · 여유 시간 계산"
      />

      <div className="mb-5 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 dark:border-emerald-900/50 dark:from-emerald-950/30 dark:to-gray-900">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          CPM은 프로젝트를 <strong>작업(Activity)의 네트워크</strong>로 모델링하고,
          각 작업의 시작·끝 시점을 계산해 <strong>임계 경로(Critical Path)</strong>
          와 <strong>여유 시간(Slack)</strong>을 찾는 기법. 본 과목에서는
          <strong> AON(Activity-on-Node)</strong> 표기를 사용 — 원(노드)이 작업,
          숫자가 소요 기간, 화살표가 선행 관계를 의미.
        </p>
      </div>

      {/* NEW: 초기 조건 읽기 */}
      <div className="mb-5 rounded-xl border-2 border-amber-300 bg-amber-50/60 p-5 dark:border-amber-900/60 dark:bg-amber-950/20">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-300">
          <Flag size={15} /> 네트워크에서 '주어진 조건' 읽는 법
        </div>
        <p className="mt-2 text-xs text-gray-700 dark:text-gray-300">
          CPM 문제는 보통 시작과 종료 시점을 명시해 줌. 이 조건이
          forward/backward pass의 <strong>출발점</strong>이 되므로 반드시 먼저
          이해해야 함.
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-amber-200 bg-white p-3 dark:border-amber-900/40 dark:bg-gray-900">
            <div className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
              ① 시작 작업의 초기값
            </div>
            <p className="mt-1 text-[11px] text-gray-700 dark:text-gray-300">
              문제에서 예컨대 <em>"시작 작업의 EST=0, EFT=k로 가정"</em>이라고
              주어지면 이는 <strong>그 작업의 duration = EFT − EST = k</strong>
              라는 뜻. 시작 작업은 선행이 없으므로 항상 EST=0이 자연스러운
              기본값.
            </p>
            <div className="mt-2 rounded bg-amber-50 px-2 py-1.5 font-mono text-[10px] text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
              EST(시작) = 0, EFT(시작) = duration
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-white p-3 dark:border-amber-900/40 dark:bg-gray-900">
            <div className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
              ② 종료 작업의 초기값
            </div>
            <p className="mt-1 text-[11px] text-gray-700 dark:text-gray-300">
              Forward pass로 구한 마지막 작업의 <strong>EFT가 곧 프로젝트
              최소 소요 기간</strong>. 이 값이 backward pass의 출발점이 되며,
              종료 작업의 LFT는 이 프로젝트 기간과 동일하게 설정함.
            </p>
            <div className="mt-2 rounded bg-amber-50 px-2 py-1.5 font-mono text-[10px] text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
              LFT(종료) = EFT(종료) = 프로젝트 기간
            </div>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-gray-500">
          ※ "시작 작업 ~의 EST=0, EFT=2가 주어진다" 같은 문장은 단순히
          <strong> 그 작업의 duration이 2</strong>라는 뜻. 겁먹지 말고 그대로
          계산에 반영하면 됨.
        </p>
      </div>

      {/* 용어 토글 카드 */}
      <div className="space-y-2">
        {TERMS.map((t) => {
          const isOpen = open === t.key;
          return (
            <div
              key={t.key}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
            >
              <button
                onClick={() => setOpen(isOpen ? null : t.key)}
                className="flex w-full items-center gap-3 p-4 text-left hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20"
              >
                <div className="flex-1">
                  <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                    {t.label}
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">{t.short}</p>
                </div>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                  <ChevronDown size={16} className="text-gray-400" />
                </motion.div>
              </button>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="border-t border-gray-100 bg-emerald-50/40 p-4 dark:border-gray-800 dark:bg-emerald-950/20"
                >
                  {t.formula && (
                    <div className="mb-2 rounded-lg bg-white px-3 py-2 font-mono text-xs text-emerald-700 dark:bg-gray-900 dark:text-emerald-300">
                      ${t.formula}$
                    </div>
                  )}
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    {t.meaning}
                  </p>
                  <div className="mt-2 rounded-lg border-l-2 border-emerald-400 bg-white px-3 py-2 text-[11px] text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                    <span className="mr-1 font-bold text-emerald-600">직관:</span>
                    {t.intuition}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* NEW: Merge 규칙 시각 예제 (Forward Pass) */}
      <div className="mt-6 rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-white p-6 dark:border-emerald-800 dark:from-emerald-950/30 dark:to-gray-900">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
          <GitMerge size={16} /> Merge 규칙 — 여러 선행이 합쳐질 때 (Forward Pass)
        </div>
        <p className="mt-2 text-xs text-gray-700 dark:text-gray-300">
          작업 D에 여러 선행이 있을 때, D의 EST는 선행들의 EFT 중{" "}
          <strong>가장 큰 값</strong>. 이 규칙이 CPM의 핵심이며, 과제 네트워크에도
          여러 번 등장함.
        </p>

        {/* 인터랙티브 선행 개수 선택 */}
        <div className="mt-4 flex items-center gap-2 text-[11px]">
          <span className="font-bold text-gray-500">선행 개수:</span>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => setScenarioPredCount(n)}
              className={`rounded-full px-3 py-0.5 font-semibold ${
                scenarioPredCount === n
                  ? "bg-emerald-500 text-white"
                  : "bg-white text-emerald-700 ring-1 ring-emerald-300 dark:bg-gray-900 dark:text-emerald-300 dark:ring-emerald-800"
              }`}
            >
              {n}개
            </button>
          ))}
        </div>

        {/* SVG 다이어그램 */}
        <div className="mt-3 overflow-x-auto">
          <svg
            viewBox="0 0 420 180"
            className="mx-auto w-full max-w-lg"
          >
            <defs>
              <marker
                id="arr-m"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill="#6b7280" />
              </marker>
            </defs>

            {/* 선행 노드들 (동적 표시) */}
            {MERGE_EFTS.slice(0, scenarioPredCount).map((eft, i) => {
              const y = scenarioPredCount === 1 ? 90 : 30 + i * (120 / Math.max(scenarioPredCount - 1, 1));
              const label = ["B", "C", "K"][i];
              return (
                <g key={i}>
                  <circle
                    cx="70"
                    cy={y}
                    r="26"
                    fill="white"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  <text
                    x="70"
                    y={y + 4}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="700"
                    fill="#065f46"
                  >
                    {label}
                  </text>
                  <text
                    x="70"
                    y={y - 34}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#059669"
                    fontWeight="700"
                  >
                    EFT={eft}
                  </text>
                  <line
                    x1="96"
                    y1={y}
                    x2="264"
                    y2={90}
                    stroke="#6b7280"
                    strokeWidth="2"
                    markerEnd="url(#arr-m)"
                  />
                </g>
              );
            })}

            {/* D 노드 */}
            <circle
              cx="300"
              cy="90"
              r="34"
              fill="#fef3c7"
              stroke="#f59e0b"
              strokeWidth="2.5"
            />
            <text
              x="300"
              y="86"
              textAnchor="middle"
              fontSize="15"
              fontWeight="800"
              fill="#b45309"
            >
              D
            </text>
            <text
              x="300"
              y="102"
              textAnchor="middle"
              fontSize="8"
              fill="#92400e"
            >
              EST = ?
            </text>

            {/* 결과 라벨 */}
            <text
              x="300"
              y="155"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="#b45309"
            >
              max({MERGE_EFTS.slice(0, scenarioPredCount).join(", ")}) = {mergeEst}
            </text>
          </svg>
        </div>

        <div className="mt-3 rounded-lg bg-white p-3 text-[11px] text-gray-700 dark:bg-gray-900 dark:text-gray-300">
          <div className="mb-1 font-bold text-emerald-700 dark:text-emerald-300">
            왜 max인가?
          </div>
          D는 <strong>모든 선행 작업이 끝나야</strong> 시작 가능. 선행 중 하나라도
          아직 진행 중이면 D는 시작할 수 없음. 따라서 D의 시작 가능 시점은 가장
          늦게 끝나는 선행의 완료 시점과 같음 →{" "}
          <span className="font-mono text-emerald-700">
            EST(D) = max(선행 EFT들)
          </span>
          .
        </div>
      </div>

      {/* NEW: Fork 규칙 시각 예제 (Backward Pass) */}
      <div className="mt-5 rounded-2xl border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-white p-6 dark:border-purple-800 dark:from-purple-950/30 dark:to-gray-900">
        <div className="flex items-center gap-2 text-sm font-bold text-purple-700 dark:text-purple-300">
          <GitFork size={16} /> Fork 규칙 — 여러 후속이 있을 때 (Backward Pass)
        </div>
        <p className="mt-2 text-xs text-gray-700 dark:text-gray-300">
          작업 D가 여러 후속 작업으로 분기할 때, D의 LFT는 후속들의 LST 중{" "}
          <strong>가장 작은 값</strong>. Merge와 거울 관계(max → min).
        </p>

        <div className="mt-3 overflow-x-auto">
          <svg
            viewBox="0 0 420 180"
            className="mx-auto w-full max-w-lg"
          >
            <defs>
              <marker
                id="arr-f"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill="#6b7280" />
              </marker>
            </defs>

            {/* D 노드 */}
            <circle
              cx="120"
              cy="90"
              r="34"
              fill="#f3e8ff"
              stroke="#a855f7"
              strokeWidth="2.5"
            />
            <text
              x="120"
              y="86"
              textAnchor="middle"
              fontSize="15"
              fontWeight="800"
              fill="#7e22ce"
            >
              D
            </text>
            <text
              x="120"
              y="102"
              textAnchor="middle"
              fontSize="8"
              fill="#6b21a8"
            >
              LFT = ?
            </text>

            {/* 후속 F, G, H */}
            {[
              { label: "F", lst: 15, y: 30 },
              { label: "G", lst: 10, y: 90 },
              { label: "H", lst: 18, y: 150 },
            ].map((s) => (
              <g key={s.label}>
                <line
                  x1="154"
                  y1="90"
                  x2="324"
                  y2={s.y}
                  stroke="#6b7280"
                  strokeWidth="2"
                  markerEnd="url(#arr-f)"
                />
                <circle
                  cx="350"
                  cy={s.y}
                  r="26"
                  fill="white"
                  stroke="#a855f7"
                  strokeWidth="2"
                />
                <text
                  x="350"
                  y={s.y + 4}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="700"
                  fill="#6b21a8"
                >
                  {s.label}
                </text>
                <text
                  x="350"
                  y={s.y - 34}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#7e22ce"
                  fontWeight="700"
                >
                  LST={s.lst}
                </text>
              </g>
            ))}

            <text
              x="120"
              y="155"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="#6b21a8"
            >
              min(15, 10, 18) = 10
            </text>
          </svg>
        </div>

        <div className="mt-3 rounded-lg bg-white p-3 text-[11px] text-gray-700 dark:bg-gray-900 dark:text-gray-300">
          <div className="mb-1 font-bold text-purple-700 dark:text-purple-300">
            왜 min인가?
          </div>
          D는 <strong>가장 빨리 시작해야 하는 후속</strong>의 시점 전에는 반드시
          끝나야 함. 후속 G가 10에 시작해야 하는데 F(15)나 H(18)에 맞춰 느긋하게
          끝내면 G가 지연됨. 따라서 D의 LFT는 가장 빠른 후속의 LST와 같음 →{" "}
          <span className="font-mono text-purple-700">
            LFT(D) = min(후속 LST들)
          </span>
          .
        </div>
      </div>

      {/* Forward / Backward 방향 요약 */}
      <div className="mt-5 rounded-xl border border-emerald-200 bg-white p-5 dark:border-emerald-900/50 dark:bg-gray-900">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
          <Lightbulb size={15} /> 두 방향 계산 요약
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-emerald-50/60 p-3 dark:bg-emerald-950/30">
            <div className="mb-1 flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
              ▶ Forward Pass (왼 → 오)
            </div>
            <ul className="space-y-1 text-[11px] text-gray-700 dark:text-gray-300">
              <li>· 시작: <span className="font-mono">EST = 0</span></li>
              <li>· 각 작업: <span className="font-mono">EST = max(선행 EFT)</span></li>
              <li>· 각 작업: <span className="font-mono">EFT = EST + d</span></li>
              <li>· 종료: <span className="font-mono">EFT = 프로젝트 기간</span></li>
            </ul>
          </div>
          <div className="rounded-lg bg-purple-50/60 p-3 dark:bg-purple-950/30">
            <div className="mb-1 flex items-center gap-1 text-[11px] font-bold text-purple-700 dark:text-purple-300">
              ◀ Backward Pass (오 → 왼)
            </div>
            <ul className="space-y-1 text-[11px] text-gray-700 dark:text-gray-300">
              <li>· 종료: <span className="font-mono">LFT = EFT(종료)</span></li>
              <li>· 각 작업: <span className="font-mono">LFT = min(후속 LST)</span></li>
              <li>· 각 작업: <span className="font-mono">LST = LFT − d</span></li>
              <li>· 시작: <span className="font-mono">LST = 0</span> (일치 확인)</li>
            </ul>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-gray-500">
          Forward 끝난 뒤 Backward 시작. 최종적으로 모든 작업의{" "}
          <strong>Slack = LST − EST</strong>를 계산하면, Slack=0인 작업이 임계
          경로.
        </p>
      </div>

      {/* 단일 작업 미니 예제 */}
      <div className="mt-5 rounded-2xl border-2 border-dashed border-emerald-300 bg-white p-6 dark:border-emerald-800 dark:bg-gray-900">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
          <Clock size={16} /> 단일 작업 미니 예제 · duration 슬라이더
        </div>
        <p className="mb-4 text-xs text-gray-500">
          선행 작업들이 {est}주에 끝나는 상황. 이 작업의 duration을 바꿔보며 EFT
          변화를 확인.
        </p>

        <div className="mb-4 flex items-center gap-3">
          <label className="text-xs font-semibold">duration</label>
          <input
            type="range"
            min={1}
            max={10}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="flex-1 accent-emerald-500"
          />
          <span className="w-12 text-center font-mono text-sm text-emerald-600">
            {duration}주
          </span>
        </div>

        <div className="flex items-center justify-center gap-2">
          <NodeBox label="선행" time={est} sub="EFT" />
          <ArrowRight />
          <NodeBox
            label="작업 X"
            time={est}
            sub={`EST=${est}`}
            duration={duration}
            highlight
          />
          <ArrowRight />
          <NodeBox
            label="후행"
            time={est + duration}
            sub={`EFT=${est + duration}`}
          />
        </div>

        <div className="mt-4 rounded-lg bg-emerald-50 p-3 font-mono text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
          EFT(X) = EST(X) + duration = {est} + {duration} ={" "}
          <strong>{est + duration}</strong>주
        </div>

        <div className="mt-3 flex items-start gap-2 text-[11px] text-gray-500">
          <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-emerald-500" />
          <span>
            이 예제는 단일 선행·단일 후행. 실전에서는 위의 merge/fork 규칙을
            반복 적용해 모든 작업의 EST/EFT/LFT/LST를 채워야 함.
          </span>
        </div>
      </div>
    </section>
  );
}

function NodeBox({
  label,
  time,
  sub,
  duration,
  highlight,
}: {
  label: string;
  time: number;
  sub: string;
  duration?: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center rounded-lg border-2 px-3 py-2 text-center ${
        highlight
          ? "border-emerald-500 bg-emerald-100 dark:bg-emerald-900/50"
          : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
      }`}
    >
      <div className="text-[11px] font-bold">{label}</div>
      {duration !== undefined ? (
        <div className="text-[10px] text-gray-500">d={duration}</div>
      ) : (
        <div className="font-mono text-sm">{time}</div>
      )}
      <div className="text-[9px] text-gray-500">{sub}</div>
    </div>
  );
}

function ArrowRight() {
  return <span className="text-emerald-500">→</span>;
}
