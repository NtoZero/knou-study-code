"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import QuizChoiceExplanation from "@/components/aiReview/QuizChoiceExplanation";

interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  diagram?: ReactNode;
}

function SemanticNetDiagram() {
  return (
    <svg
      viewBox="0 0 520 380"
      className="mx-auto w-full max-w-lg"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Arrows */}
      {/* 승용차 -> 자동차 (ako) */}
      <line x1="180" y1="140" x2="180" y2="80" stroke="#6B7280" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
      <text x="188" y="115" fontSize="11" fill="#6B7280" fontWeight="bold">ako</text>

      {/* A -> 승용차 (isa) */}
      <line x1="130" y1="260" x2="160" y2="200" stroke="#6B7280" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
      <text x="128" y="235" fontSize="11" fill="#6B7280" fontWeight="bold">isa</text>

      {/* B -> 승용차 (isa) */}
      <line x1="380" y1="260" x2="220" y2="200" stroke="#6B7280" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
      <text x="305" y="235" fontSize="11" fill="#6B7280" fontWeight="bold">isa</text>

      {/* 자동차 -> 엔진 (has-part) */}
      <line x1="240" y1="55" x2="350" y2="55" stroke="#6B7280" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
      <text x="270" y="48" fontSize="11" fill="#6B7280" fontWeight="bold">has-part</text>

      {/* Arrowhead marker */}
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#6B7280" />
        </marker>
      </defs>

      {/* 자동차 node */}
      <rect x="130" y="35" width="110" height="40" rx="8" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
      <text x="185" y="60" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1E40AF">자동차</text>

      {/* 엔진 node */}
      <rect x="355" y="35" width="80" height="40" rx="8" fill="#E0E7FF" stroke="#6366F1" strokeWidth="1.5" />
      <text x="395" y="60" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#4338CA">엔진</text>

      {/* 승용차 node */}
      <rect x="120" y="150" width="130" height="50" rx="8" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
      <text x="185" y="172" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1E40AF">승용차</text>
      <text x="185" y="190" textAnchor="middle" fontSize="11" fill="#4B5563">승차인원: 5</text>

      {/* A node */}
      <rect x="30" y="260" width="190" height="65" rx="8" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
      <text x="125" y="282" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#B45309">A</text>
      <text x="125" y="300" textAnchor="middle" fontSize="11" fill="#4B5563">배기량: 1,591 / 최대출력: 140</text>

      {/* B node */}
      <rect x="300" y="260" width="190" height="65" rx="8" fill="#FCE7F3" stroke="#EC4899" strokeWidth="1.5" />
      <text x="395" y="282" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#BE185D">B</text>
      <text x="395" y="300" textAnchor="middle" fontSize="11" fill="#4B5563">has-part: 선루프</text>
    </svg>
  );
}

const questions: QuizQuestion[] = [
  {
    question: "지식기반 시스템에 대한 설명으로 적절한 것은?",
    options: [
      "지식과 추론기관이 하나로 통합되어 있다",
      "문제분야의 지식과 추론을 담당하는 추론기관이 분리되어 있다",
      "추론기관 없이 지식베이스만으로 동작한다",
      "사용자 인터페이스는 필요하지 않다",
    ],
    answerIndex: 1,
    explanation:
      "지식기반 시스템을 구성하는 주요 요소는 지식베이스, 추론기관, 사용자 인터페이스이다. 지식베이스에는 대상 분야의 지식을 포함한 문제풀이에 필요한 지식을 저장하되, 지식을 이용한 추론은 추론기관이 담당한다. 이처럼 지식베이스와 추론기관을 분리하여 구성하는 것이 지식기반 시스템의 특징이다.",
  },
  {
    question:
      "선언적 지식에 대한 설명을 모두 고른 것은?\n㈀ 프로그래밍 언어로 작성된 명령어의 집합이다.\n㈁ 지식 사용에 대한 제어정보가 지식 자체에 내포되어 있다.\n㈂ 상호 독립적이고 단편적인 지식을 나열해 놓은 형태이다.\n㈃ 별도의 추론기관이 있어, 이에 의해 추론을 한다.",
    options: ["㈀, ㈁", "㈀, ㈂", "㈁, ㈂", "㈂, ㈃"],
    answerIndex: 3,
    explanation:
      "선언적 지식은 상호 독립적이고 단편적인 지식을 나열해 놓은 정적인 지식으로, 지식의 적용을 위한 제어정보는 지식 자체에 표현되지 않으며, 별도의 추론기관에 의해 추론이 이루어진다.",
  },
  {
    question:
      "시맨틱 네트에서 A에 대해 구할 수 있는 속성과 그 값이 잘못된 것은?",
    options: [
      "배기량 - 1,591",
      "승차인원 - 5",
      "has-part - 엔진",
      "has-part - 선루프",
    ],
    answerIndex: 3,
    explanation:
      "배기량은 A에 직접 연결된 속성으로 그 값은 1,591이다. 승차인원은 '승용차'로부터 상속된 값인 5이며, '자동차'로부터 'has-part' 속성으로 '엔진'을 상속 받는다. '선루프'는 직접 또는 상속을 통해 A의 속성값으로 제공되지 않는다.",
    diagram: <SemanticNetDiagram />,
  },
  {
    question: "프레임을 이용한 지식표현 방법에 대한 올바른 설명은?",
    options: [
      "절차적 지식을 표현할 수 있다",
      "기호논리를 이용하여 지식을 표현한다",
      "특성상속을 사용할 수 없다",
      "'IF 조건 THEN 결론' 형식의 지식표현 방법이다",
    ],
    answerIndex: 0,
    explanation:
      "프레임은 부가 프로시저를 사용하여 슬롯의 사용과 관련한 절차적 지식을 표현할 수 있으며, 특성상속을 통해 지식의 공유와 분배를 할 수 있다.",
  },
];

export default function QuizSection() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );

  const handleAnswer = (qIndex: number, optIndex: number) => {
    if (showResults[qIndex]) return;
    const newAnswers = [...answers];
    newAnswers[qIndex] = optIndex;
    setAnswers(newAnswers);

    const newResults = [...showResults];
    newResults[qIndex] = true;
    setShowResults(newResults);
  };

  const resetQuiz = () => {
    setAnswers(new Array(questions.length).fill(null));
    setShowResults(new Array(questions.length).fill(false));
  };

  const correctCount = answers.filter(
    (a, i) => a === questions[i].answerIndex
  ).length;
  const allAnswered = answers.every((a) => a !== null);

  return (
    <section>
      <SectionTitle
        title="복습 퀴즈"
        subtitle="5강 핵심 개념을 확인하는 4문제"
      />

      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const isCorrect = answers[qIdx] === q.answerIndex;
          const answered = showResults[qIdx];

          return (
            <div
              key={qIdx}
              className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900"
            >
              <h4 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-200">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                  {qIdx + 1}
                </span>
                <span className="whitespace-pre-line">{q.question}</span>
              </h4>

              {q.diagram && (
                <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                  <p className="mb-2 text-xs font-semibold text-gray-500">지문</p>
                  {q.diagram}
                </div>
              )}

              <div className="space-y-2">
                {q.options.map((opt, oIdx) => {
                  let optStyle =
                    "border-gray-200 bg-gray-50 hover:bg-orange-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-orange-900/10";
                  if (answered) {
                    if (oIdx === q.answerIndex) {
                      optStyle =
                        "border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-900/20";
                    } else if (oIdx === answers[qIdx]) {
                      optStyle =
                        "border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900/20";
                    } else {
                      optStyle =
                        "border-gray-200 bg-gray-50 opacity-50 dark:border-gray-700 dark:bg-gray-800";
                    }
                  } else if (answers[qIdx] === oIdx) {
                    optStyle =
                      "border-orange-400 bg-orange-50 dark:border-orange-600 dark:bg-orange-900/20";
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleAnswer(qIdx, oIdx)}
                      disabled={answered}
                      className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${optStyle}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="shrink-0 text-xs font-bold text-gray-400">
                          {String.fromCharCode(9312 + oIdx)}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {opt}
                        </span>
                        {answered && oIdx === q.answerIndex && (
                          <CheckCircle
                            size={16}
                            className="ml-auto shrink-0 text-green-500"
                          />
                        )}
                        {answered &&
                          oIdx === answers[qIdx] &&
                          oIdx !== q.answerIndex && (
                            <XCircle
                              size={16}
                              className="ml-auto shrink-0 text-red-500"
                            />
                          )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 overflow-hidden"
                  >
                    <div
                      className={`rounded-lg p-3 ${
                        isCorrect
                          ? "bg-green-50 dark:bg-green-900/20"
                          : "bg-red-50 dark:bg-red-900/20"
                      }`}
                    >
                      <p
                        className={`text-sm font-medium ${
                          isCorrect
                            ? "text-green-700 dark:text-green-300"
                            : "text-red-700 dark:text-red-300"
                        }`}
                      >
                        {isCorrect ? "정답!" : "오답"}
                      </p>
                      <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                        <QuizChoiceExplanation
                          correct={isCorrect}
                          choiceText={q.options[answers[qIdx] ?? q.answerIndex]}
                          correctChoiceText={q.options[q.answerIndex]}
                          basisText={q.explanation}
                          wrongRule={`정답 선택지 "${q.options[q.answerIndex]}"이 따르는 지식표현·추론기관·전문가 시스템 기준과 선택한 보기를 비교한다.`}
                          accentClass="text-orange-700 dark:text-orange-300"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Score & Reset */}
      {allAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50 p-6 dark:border-orange-800 dark:bg-orange-900/20"
        >
          <div>
            <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
              결과: {correctCount} / {questions.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {correctCount === questions.length
                ? "완벽합니다!"
                : correctCount >= 3
                ? "잘 했습니다!"
                : "복습이 필요합니다."}
            </p>
          </div>
          <button
            onClick={resetQuiz}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
          >
            <RotateCcw size={14} />
            다시 풀기
          </button>
        </motion.div>
      )}
    </section>
  );
}
