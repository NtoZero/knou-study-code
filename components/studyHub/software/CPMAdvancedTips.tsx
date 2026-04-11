"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Dumbbell,
  RefreshCw,
  GitMerge,
  GitFork,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import CPMTerm from "./CPMTerm";

const CONCEPTS = [
  {
    title: "PERT vs CPM",
    body: "CPM은 각 작업의 소요 기간을 확정치로 보는 결정론적 기법. PERT는 낙관(optimistic)·정상(most likely)·비관(pessimistic) 세 값을 가중평균한 기대치를 사용하는 확률론적 기법. 본 과제는 CPM.",
    formula: "t_e = (o + 4m + p) / 6",
  },
  {
    title: "Dummy Activity",
    body: "AOA(Activity-on-Arrow) 다이어그램에서 단순히 선행 관계를 표현하기 위해 삽입하는 소요 시간 0의 가상 작업. AON 표기에서는 필요 없음.",
  },
  {
    title: "Float의 세 종류",
    body: "Total Float(LST−EST), Free Float(후행 EST 영향 없이 미룰 수 있는 시간), Independent Float(선행 최대 지연 + 후행 최소 지연 가정 시 가능한 여유).",
  },
  {
    title: "Resource Leveling",
    body: "임계 경로가 결정되어도 자원(인력·장비)이 부족하면 일정을 재조정해야 함. 여유 있는 작업부터 뒤로 밀어 자원 충돌을 해소.",
  },
  {
    title: "다중 임계 경로",
    body: "길이가 동일한 경로가 여러 개 존재할 수 있음. 이때 모든 경로가 임계 경로이며, 한 경로의 작업을 단축시켜도 다른 경로가 여전히 전체 기간을 결정함.",
  },
];

const MISTAKES = [
  {
    bad: "시작 작업의 EST를 1로 잡음",
    good: "시작 작업은 EST=0이 기본. 문제에서 'EST=0, EFT=k로 가정'이라고 주어지면 이는 그 작업의 duration이 k라는 뜻.",
  },
  {
    bad: "Forward pass에서 min을, Backward pass에서 max를 씀",
    good: "Forward는 max (모든 선행이 끝나야 시작), Backward는 min (가장 빨리 시작해야 하는 후행에 맞춤). 방향과 함수를 헷갈리지 말 것.",
  },
  {
    bad: "임계 경로가 항상 하나라고 가정",
    good: "동일한 최대 길이 경로가 여러 개 있을 수 있음 → 모두 임계 경로로 기술.",
  },
  {
    bad: "Slack을 EFT−EST로 계산",
    good: "EFT−EST = duration. Slack은 LST−EST 또는 LFT−EFT. 두 공식 결과는 항상 일치해야 하며, 일치하지 않으면 계산 어딘가가 틀림.",
  },
  {
    bad: "후행이 여러 개일 때 하나만 보고 LFT 결정",
    good: "LFT = 모든 후행의 LST 중 최솟값 → 가장 빨리 시작해야 하는 후행의 시점까지는 끝나야 함.",
  },
  {
    bad: "merge 노드에서 max 대신 합(sum)을 사용",
    good: "여러 선행의 EFT들을 더하는 것이 아님. 어디까지나 '가장 늦게 끝나는 하나'의 시점만 기다림 → max 하나만.",
  },
  {
    bad: "LST가 EST보다 작게 나와도 넘어감",
    good: "LST < EST는 논리적으로 불가능. 반드시 LST ≥ EST. 이 값이 음수가 되면 forward/backward 어딘가에 계산 오류가 있음.",
  },
];

interface Quiz {
  q: string;
  choices: string[];
  answer: number;
  explain: string;
  category: "concept" | "merge" | "fork" | "slack" | "critical" | "target";
}

const QUIZZES: Quiz[] = [
  {
    q: "작업 X의 EST=5, duration=4일 때, EFT는?",
    choices: ["4", "5", "9", "20"],
    answer: 2,
    explain: "EFT = EST + duration = 5 + 4 = 9. 단순 덧셈.",
    category: "concept",
  },
  {
    q: "임계 경로의 올바른 정의는?",
    choices: [
      "Slack이 최대인 작업들을 연결한 경로",
      "소요 시간이 가장 짧은 경로",
      "Slack이 0인 작업들을 연결한, 시작부터 종료까지의 가장 긴 경로",
      "작업 수가 가장 많은 경로",
    ],
    answer: 2,
    explain:
      "임계 경로 = Slack=0 작업의 연결 = 가장 긴 소요 기간의 경로. 이 경로의 길이가 곧 프로젝트 최소 완료 기간.",
    category: "critical",
  },
  {
    q: "Slack=0인 작업이 지연되면?",
    choices: [
      "후속 작업이 약간 빨라진다",
      "프로젝트 전체가 동일한 시간만큼 지연된다",
      "아무 영향도 없다",
      "다른 작업의 duration이 줄어든다",
    ],
    answer: 1,
    explain:
      "Slack=0은 여유가 없다는 뜻 → 이 작업이 하루 지연되면 프로젝트도 하루 지연.",
    category: "slack",
  },
  {
    q: "작업 Z의 선행이 3개이고, 각 선행의 EFT가 {5, 8, 7}일 때 Z의 EST는?",
    choices: ["5", "6.67 (평균)", "8", "20 (합)"],
    answer: 2,
    explain:
      "모든 선행이 끝나야 Z 시작 가능 → max(5, 8, 7) = 8. 평균이나 합이 아님!",
    category: "merge",
  },
  {
    q: "작업 Y의 후속이 3개이고, 각 후속의 LST가 {10, 6, 12}일 때 Y의 LFT는?",
    choices: ["6", "9.33 (평균)", "10", "12"],
    answer: 0,
    explain:
      "Y는 가장 빨리 시작해야 하는 후속(LST=6)의 시점까지 끝나야 함 → min(10, 6, 12) = 6.",
    category: "fork",
  },
  {
    q: "시작 작업 A의 'EST=0, EFT=3'이 주어졌다. A의 duration은?",
    choices: ["0", "3", "6", "알 수 없음"],
    answer: 1,
    explain:
      "duration = EFT − EST = 3 − 0 = 3. 문제에서 시작 작업의 EST/EFT를 주는 것은 사실상 그 작업의 duration을 알려주는 것과 같음.",
    category: "concept",
  },
  {
    q: "작업 W의 EST=6, LST=6일 때, W는 임계 경로에 속하는가?",
    choices: [
      "그렇다 (Slack=0)",
      "아니다 (LST가 너무 작음)",
      "정보가 부족하여 판단 불가",
      "duration에 따라 다름",
    ],
    answer: 0,
    explain:
      "Slack = LST − EST = 6 − 6 = 0. Slack=0이므로 임계 경로 작업. duration은 EFT·LFT에만 영향을 주고 Slack 판정과 무관.",
    category: "critical",
  },
  {
    q: "작업 V의 EST=11, EFT=14, LFT=19일 때, V의 여유 시간(Slack)은?",
    choices: ["0", "3", "5", "8"],
    answer: 2,
    explain:
      "Slack = LFT − EFT = 19 − 14 = 5. (또는 duration = EFT − EST = 3, LST = LFT − d = 16, Slack = LST − EST = 16 − 11 = 5.) 두 방식 결과 일치 확인.",
    category: "target",
  },
];

/* Merge/Fork 연산 무작위 드릴 */
type DrillKind = "merge" | "fork";
function randomDrill(kind: DrillKind) {
  const count = 2 + Math.floor(Math.random() * 2); // 2~3
  const values = Array.from(
    { length: count },
    () => 3 + Math.floor(Math.random() * 15),
  );
  const answer = kind === "merge" ? Math.max(...values) : Math.min(...values);
  return { values, answer };
}

export default function CPMAdvancedTips() {
  const [conceptIdx, setConceptIdx] = useState(0);
  const [quizIdx, setQuizIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const current = CONCEPTS[conceptIdx];
  const quiz = QUIZZES[quizIdx];

  // Drill state
  const [drillKind, setDrillKind] = useState<DrillKind>("merge");
  const [drill, setDrill] = useState(() => randomDrill("merge"));
  const [drillAnswer, setDrillAnswer] = useState("");
  const [drillResult, setDrillResult] = useState<
    "correct" | "wrong" | null
  >(null);
  const newDrill = (k: DrillKind = drillKind) => {
    setDrillKind(k);
    setDrill(randomDrill(k));
    setDrillAnswer("");
    setDrillResult(null);
  };
  const checkDrill = () => {
    const parsed = Number(drillAnswer);
    if (!isNaN(parsed) && parsed === drill.answer) setDrillResult("correct");
    else setDrillResult("wrong");
  };

  return (
    <section>
      <SectionTitle
        title="8. 응용 개념 · 흔한 실수 · Merge/Fork 드릴 · 퀴즈"
        subtitle="PERT · Float 종류 · 계산 실수 체크 · 무작위 드릴 · 8문항 개념 퀴즈"
      />

      {/* 응용 개념 */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 dark:border-emerald-900/50 dark:from-emerald-950/30 dark:to-gray-900">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
          <BookOpen size={15} /> 확장 개념
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          {CONCEPTS.map((c, i) => (
            <button
              key={c.title}
              onClick={() => setConceptIdx(i)}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                conceptIdx === i
                  ? "bg-emerald-500 text-white"
                  : "bg-white text-emerald-700 ring-1 ring-emerald-300 dark:bg-gray-900 dark:text-emerald-300 dark:ring-emerald-800"
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={conceptIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="rounded-xl border border-emerald-300 bg-white p-4 dark:border-emerald-800 dark:bg-gray-900"
          >
            <div className="text-sm font-bold">{current.title}</div>
            <p className="mt-2 text-xs text-gray-700 dark:text-gray-300">
              {current.body}
            </p>
            {current.formula && (
              <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 font-mono text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                ${current.formula}$
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Merge / Fork 무작위 드릴 */}
      <div className="relative z-0 mt-5 overflow-visible rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-white p-6 dark:border-emerald-800 dark:from-emerald-950/30 dark:to-gray-900">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
          <Dumbbell size={15} />{" "}
          <CPMTerm term="merge" label="Merge" />/
          <CPMTerm term="fork" label="Fork" /> 무작위 계산 드릴
        </div>
        <p className="mb-4 text-[11px] text-gray-600 dark:text-gray-400">
          과제에서 반복적으로 등장하는 <strong>max/min 선택</strong> 연산을 집중
          훈련. Merge는 forward pass, Fork는 backward pass의 핵심 연산.
        </p>

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => newDrill("merge")}
            className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold ${
              drillKind === "merge"
                ? "bg-emerald-500 text-white"
                : "bg-white text-emerald-700 ring-1 ring-emerald-300 dark:bg-gray-900 dark:text-emerald-300 dark:ring-emerald-800"
            }`}
          >
            <GitMerge size={12} /> Merge (Forward, max)
          </button>
          <button
            onClick={() => newDrill("fork")}
            className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold ${
              drillKind === "fork"
                ? "bg-purple-500 text-white"
                : "bg-white text-purple-700 ring-1 ring-purple-300 dark:bg-gray-900 dark:text-purple-300 dark:ring-purple-800"
            }`}
          >
            <GitFork size={12} /> Fork (Backward, min)
          </button>
          <button
            onClick={() => newDrill()}
            className="ml-auto inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <RefreshCw size={12} /> 새 문제
          </button>
        </div>

        <div className="relative z-0 overflow-visible rounded-xl border border-emerald-200 bg-white p-4 dark:border-emerald-900/40 dark:bg-gray-900">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            {drillKind === "merge" ? (
              <>
                작업 <strong>X</strong>의 선행 {drill.values.length}개의{" "}
                <CPMTerm term="EFT" />가{" "}
                <strong>{`{${drill.values.join(", ")}}`}</strong>일 때,{" "}
                <strong>
                  <CPMTerm term="EST" />
                  (X) = ?
                </strong>
              </>
            ) : (
              <>
                작업 <strong>Y</strong>의 후속 {drill.values.length}개의{" "}
                <CPMTerm term="LST" />가{" "}
                <strong>{`{${drill.values.join(", ")}}`}</strong>일 때,{" "}
                <strong>
                  <CPMTerm term="LFT" />
                  (Y) = ?
                </strong>
              </>
            )}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <input
              type="number"
              value={drillAnswer}
              onChange={(e) => setDrillAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") checkDrill();
              }}
              placeholder="답 입력"
              className="w-28 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-center font-mono text-sm dark:border-gray-700 dark:bg-gray-900"
            />
            <button
              onClick={checkDrill}
              disabled={!drillAnswer}
              className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-600 disabled:opacity-50"
            >
              확인
            </button>
          </div>

          <AnimatePresence>
            {drillResult && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-3 rounded-lg p-3 text-xs ${
                  drillResult === "correct"
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                    : "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-200"
                }`}
              >
                {drillResult === "correct" ? (
                  <>
                    <strong>정답!</strong>{" "}
                    {drillKind === "merge" ? "max" : "min"}(
                    {drill.values.join(", ")}) = {drill.answer}.
                  </>
                ) : (
                  <>
                    <strong>오답.</strong> 정답은 <strong>{drill.answer}</strong>.{" "}
                    {drillKind === "merge" ? (
                      <>
                        Forward pass에서는 모든 선행이 끝나야 하므로 가장
                        늦은(max) 값을 취함.
                      </>
                    ) : (
                      <>
                        Backward pass에서는 가장 빨리 시작해야 하는 후속 시점까지
                        끝나야 하므로 min 값을 취함.
                      </>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 흔한 실수 */}
      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/40 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-300">
          <AlertTriangle size={15} /> 흔한 실수 체크리스트
        </div>
        <div className="mt-3 space-y-2">
          {MISTAKES.map((m) => (
            <div
              key={m.bad}
              className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-start gap-2">
                <XCircle size={14} className="mt-0.5 shrink-0 text-red-500" />
                <div className="text-xs text-gray-700 dark:text-gray-300">
                  <strong>잘못:</strong> {m.bad}
                </div>
              </div>
              <div className="mt-1 flex items-start gap-2">
                <CheckCircle2
                  size={14}
                  className="mt-0.5 shrink-0 text-emerald-500"
                />
                <div className="text-xs text-gray-700 dark:text-gray-300">
                  <strong>올바름:</strong> {m.good}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 과제 힌트 */}
      <div className="mt-5 rounded-xl border-l-4 border-emerald-500 bg-white p-5 dark:bg-gray-900">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
          <Lightbulb size={15} /> 문제 2 원리 힌트 (답 아님)
        </div>
        <ul className="mt-2 space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
          <li>
            · "시작 작업의 EST=0, EFT=k"는 그 작업의{" "}
            <strong>duration이 k</strong>라는 의미.
          </li>
          <li>
            · Forward pass로 각 작업의 EST·EFT를 구하고, 마지막 작업의 EFT가 곧{" "}
            <strong>프로젝트 최소 소요 기간</strong>.
          </li>
          <li>
            · 종료점에서부터 Backward pass로 LFT·LST를 역방향 계산. 종료 작업의
            LFT는 곧 최소 소요 기간과 같음.
          </li>
          <li>
            · Slack = LST − EST = 0인 작업들의 연결이 임계 경로. 여러 선행이
            합쳐지는 작업은 forward에서 max, 여러 후행이 있는 작업은 backward에서
            min.
          </li>
          <li>
            · 특정 작업(예: F 등)의 여유 시간을 묻는 문제는 forward·backward를
            모두 구한 뒤 해당 작업의 EST와 LST를 읽어 차를 구하면 됨.
          </li>
          <li>
            · <strong>검산 기법</strong>: 시작 → 종료의 모든 경로를 나열한 뒤
            가장 긴 경로의 길이가 종료 작업의 EFT와 일치하는지 확인.
          </li>
        </ul>
      </div>

      {/* 퀴즈 */}
      <div className="mt-5 rounded-xl border border-emerald-200 bg-white p-5 dark:border-emerald-900/50 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
            개념 퀴즈 ({quizIdx + 1}/{QUIZZES.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {QUIZZES.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuizIdx(i);
                  setSelected(null);
                }}
                className={`h-6 w-6 rounded-full text-[10px] font-bold ${
                  quizIdx === i
                    ? "bg-emerald-500 text-white"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-2 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          {quiz.category === "concept" && "개념"}
          {quiz.category === "merge" && "Merge (max)"}
          {quiz.category === "fork" && "Fork (min)"}
          {quiz.category === "slack" && "Slack"}
          {quiz.category === "critical" && "임계 경로"}
          {quiz.category === "target" && "타깃 작업 질의"}
        </div>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          {quiz.q}
        </p>
        <div className="space-y-1.5">
          {quiz.choices.map((c, i) => {
            const isSelected = selected === i;
            const isCorrect = i === quiz.answer;
            return (
              <button
                key={i}
                onClick={() => setSelected(i)}
                disabled={selected !== null}
                className={`flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-all ${
                  selected === null
                    ? "border-gray-200 bg-white hover:border-emerald-300 dark:border-gray-800 dark:bg-gray-900"
                    : isSelected && isCorrect
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40"
                      : isSelected
                        ? "border-red-500 bg-red-50 dark:bg-red-950/40"
                        : isCorrect
                          ? "border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/30"
                          : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                }`}
              >
                <span className="font-bold text-gray-400">
                  {String.fromCharCode(65 + i)}.
                </span>
                <span>{c}</span>
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
          >
            <strong>{selected === quiz.answer ? "정답!" : "오답"}</strong> ·{" "}
            {quiz.explain}
          </motion.div>
        )}
      </div>
    </section>
  );
}
