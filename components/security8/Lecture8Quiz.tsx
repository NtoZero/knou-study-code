"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, RotateCcw, ChevronRight } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

interface Quiz {
  id: number;
  q: string;
  choices: string[];
  answer: number;
  explain: string;
  category: string;
}

const quizzes: Quiz[] = [
  {
    id: 1,
    q: "시그니처 기반 IDS의 가장 큰 단점은?",
    choices: [
      "처리 속도가 매우 느림",
      "알려지지 않은 공격(Zero-day)을 탐지할 수 없음",
      "정상 트래픽도 차단하여 가용성을 해침",
      "호스트 내부 활동을 감시하지 못함",
    ],
    answer: 1,
    explain:
      "시그니처 기반 IDS는 알려진 공격 패턴(시그니처) DB와 비교하는 방식이므로, DB에 없는 신종 공격·제로데이(Zero-day) 공격은 탐지할 수 없다는 것이 가장 큰 단점입니다. 낮은 오탐율이 장점이지만 알려지지 않은 공격에는 무력합니다.",
    category: "분석 방법",
  },
  {
    id: 2,
    q: "암호화된 트래픽도 분석할 수 있는 IDS 유형은?",
    choices: [
      "NIDS (네트워크 기반 IDS)",
      "분산 IDS",
      "HIDS (호스트 기반 IDS)",
      "하이브리드 IDS (네트워크 센서만 활용 시)",
    ],
    answer: 2,
    explain:
      "HIDS는 개별 호스트 내부에 설치되어 운영 시스템이 트래픽을 복호화한 이후의 데이터를 분석합니다. 따라서 암호화된 트래픽도 분석 가능합니다. 반면 NIDS는 네트워크를 흐르는 암호화된 패킷을 복호화할 수 없어 내용 분석에 한계가 있습니다.",
    category: "IDS 분류",
  },
  {
    id: 3,
    q: "IPS가 IDS와 근본적으로 다른 점은?",
    choices: [
      "더 많은 서버에 설치할 수 있음",
      "네트워크 트래픽을 모니터링하지 않음",
      "인라인(Inline) 배치로 실시간 차단 기능을 수행함",
      "시그니처 기반 분석만 사용함",
    ],
    answer: 2,
    explain:
      "IPS의 핵심적 차별점은 '인라인(Inline) 배치'입니다. IDS는 트래픽 경로 밖에서 스니핑 방식으로 탐지 후 경보를 발생시키지만, IPS는 트래픽 경로에 직접 삽입되어 악성 트래픽을 실시간으로 차단합니다. IPS를 '능동형 IDS'라고도 부릅니다.",
    category: "IPS",
  },
  {
    id: 4,
    q: "통계적 이상탐지에서 False Positive(오탐)란?",
    choices: [
      "실제 침입을 탐지하지 못하는 경우",
      "정상적인 행위를 침입으로 잘못 탐지하는 경우",
      "시그니처 DB가 업데이트되지 않은 경우",
      "IDS 에이전트가 응답하지 않는 경우",
    ],
    answer: 1,
    explain:
      "False Positive(오탐)는 정상적인 행위를 침입(이상)으로 잘못 판단하는 경우입니다. 통계적 이상탐지는 기준선에서 벗어나면 탐지하는 방식이므로, 정상 사용자의 비정상적 사용 패턴(야간 접속, 대용량 작업 등)도 경보로 발생할 수 있어 오탐율이 높습니다. 반대로 실제 침입을 탐지 못하는 것은 False Negative(미탐)입니다.",
    category: "분석 방법",
  },
  {
    id: 5,
    q: "IDS 구성요소 중 경보를 발생시키고 대응 조치를 담당하는 부분은?",
    choices: [
      "모니터링부",
      "분석조치부",
      "관리부",
      "에이전트부",
    ],
    answer: 2,
    explain:
      "IDS는 모니터링부(데이터 수집), 분석조치부(침입 여부 판단), 관리부(정책 관리·경보 발생·대응 조치) 3부로 구성됩니다. 경보(Alert) 발생, 보안 정책 관리, 관리자 통보 등은 관리부의 역할입니다. 분석조치부는 수집된 데이터를 분석하여 침입 여부만 판단합니다.",
    category: "IDS 구성",
  },
];

type AnswerState = {
  selected: number | null;
  revealed: boolean;
};

export default function Lecture8Quiz() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>(
    quizzes.map(() => ({ selected: null, revealed: false }))
  );
  const [finished, setFinished] = useState(false);

  const q = quizzes[current];
  const ans = answers[current];

  const score = answers.filter((a, i) => a.selected === quizzes[i].answer).length;

  function select(idx: number) {
    if (ans.revealed) return;
    setAnswers(prev =>
      prev.map((a, i) => i === current ? { ...a, selected: idx, revealed: true } : a)
    );
  }

  function next() {
    if (current < quizzes.length - 1) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  }

  function reset() {
    setCurrent(0);
    setAnswers(quizzes.map(() => ({ selected: null, revealed: false })));
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / quizzes.length) * 100);
    return (
      <section>
        <SectionTitle title="8강 자가 점검 퀴즈" subtitle="IDS/IPS 핵심 개념 확인" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-fuchsia-200 bg-fuchsia-50 p-8 text-center dark:border-fuchsia-800 dark:bg-fuchsia-900/20"
        >
          <div className="mb-2 text-4xl font-black text-fuchsia-700 dark:text-fuchsia-300">
            {score} / {quizzes.length}
          </div>
          <div className="mb-1 text-lg font-bold text-gray-800 dark:text-gray-100">
            {pct >= 80 ? "훌륭합니다! IDS/IPS 개념을 잘 이해하고 있습니다." :
              pct >= 60 ? "좋습니다! 몇 가지 개념을 다시 확인해보세요." :
                "강의 내용을 다시 복습하고 재도전해 보세요."}
          </div>
          <div className="mb-6 text-sm text-gray-500">정답률 {pct}%</div>

          {/* Score breakdown */}
          <div className="mb-6 grid grid-cols-5 gap-2">
            {quizzes.map((quiz, i) => {
              const correct = answers[i].selected === quiz.answer;
              return (
                <div key={i} className={`rounded-lg border p-2 text-xs font-semibold ${
                  answers[i].selected === null
                    ? "border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800"
                    : correct
                      ? "border-green-300 bg-green-100 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "border-red-300 bg-red-100 text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300"
                }`}>
                  Q{i + 1}
                  <div>{answers[i].selected === null ? "—" : correct ? "O" : "X"}</div>
                </div>
              );
            })}
          </div>

          <button
            onClick={reset}
            className="flex items-center gap-2 mx-auto rounded-full bg-fuchsia-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-fuchsia-700 transition-colors"
          >
            <RotateCcw size={15} />
            다시 풀기
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section>
      <SectionTitle title="8강 자가 점검 퀴즈" subtitle="IDS/IPS 핵심 개념 확인 — 5문항" />

      {/* Progress */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-fuchsia-500"
            initial={{ width: 0 }}
            animate={{ width: `${((current + (ans.revealed ? 1 : 0)) / quizzes.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-xs text-gray-500 shrink-0">{current + 1} / {quizzes.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Category badge */}
          <div className="mb-3">
            <span className="rounded-full bg-fuchsia-100 px-2.5 py-1 text-xs font-semibold text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300">
              {q.category}
            </span>
          </div>

          {/* Question */}
          <div className="mb-5 rounded-xl border border-fuchsia-200 bg-fuchsia-50 p-5 dark:border-fuchsia-800 dark:bg-fuchsia-900/20">
            <p className="font-semibold text-gray-800 dark:text-gray-100">
              <span className="mr-2 text-fuchsia-600">Q{q.id}.</span>
              {q.q}
            </p>
          </div>

          {/* Choices */}
          <div className="mb-4 space-y-2">
            {q.choices.map((choice, i) => {
              let style = "border-gray-200 bg-white hover:border-fuchsia-300 hover:bg-fuchsia-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-fuchsia-700";
              if (ans.revealed) {
                if (i === q.answer) {
                  style = "border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-900/30";
                } else if (i === ans.selected && i !== q.answer) {
                  style = "border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900/30";
                } else {
                  style = "border-gray-200 bg-gray-50 opacity-50 dark:border-gray-700 dark:bg-gray-800";
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => select(i)}
                  disabled={ans.revealed}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${style} ${!ans.revealed ? "cursor-pointer" : "cursor-default"}`}
                >
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    ans.revealed && i === q.answer
                      ? "border-green-500 bg-green-500 text-white"
                      : ans.revealed && i === ans.selected && i !== q.answer
                        ? "border-red-500 bg-red-500 text-white"
                        : "border-gray-300 text-gray-500 dark:border-gray-600"
                  }`}>
                    {ans.revealed && i === q.answer
                      ? <CheckCircle size={14} />
                      : ans.revealed && i === ans.selected && i !== q.answer
                        ? <XCircle size={14} />
                        : String.fromCharCode(9312 + i)}
                  </span>
                  <span className={
                    ans.revealed && i === q.answer
                      ? "font-semibold text-green-800 dark:text-green-200"
                      : ans.revealed && i === ans.selected && i !== q.answer
                        ? "font-semibold text-red-800 dark:text-red-200"
                        : "text-gray-700 dark:text-gray-300"
                  }>
                    {choice}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {ans.revealed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className={`mb-4 rounded-xl border p-4 ${
                  ans.selected === q.answer
                    ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
                    : "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20"
                }`}>
                  <div className={`mb-1.5 flex items-center gap-2 text-sm font-bold ${
                    ans.selected === q.answer ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                  }`}>
                    {ans.selected === q.answer
                      ? <><CheckCircle size={16} /> 정답!</>
                      : <><XCircle size={16} /> 오답</>
                    }
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{q.explain}</p>
                </div>

                <button
                  onClick={next}
                  className="flex items-center gap-2 ml-auto rounded-full bg-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-fuchsia-700 transition-colors"
                >
                  {current < quizzes.length - 1 ? (
                    <><ChevronRight size={15} />다음 문제</>
                  ) : (
                    <>결과 확인</>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
