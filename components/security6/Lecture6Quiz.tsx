"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "도청(Eavesdropping)과 트래픽 분석(Traffic Analysis)은 어떤 유형의 네트워크 보안위협에 해당하는가?",
    options: [
      "물리적 위협 — 네트워크 인프라를 파괴하는 위협",
      "수동적 위협 — 데이터를 변경하지 않고 모니터링하는 위협",
      "능동적 위협 — 데이터를 변조하거나 삽입하는 위협",
      "내부자 위협 — 내부 사용자에 의한 위협",
    ],
    correctIndex: 1,
    explanation:
      "도청과 트래픽 분석은 수동적 위협(Passive Threats)에 해당한다. 수동적 위협은 데이터의 내용을 변경하지 않고 단순히 모니터링하거나 도청하는 위협으로, 탐지가 매우 어렵다는 특징이 있다.",
  },
  {
    id: 2,
    question: "IPsec에서 인증·무결성·기밀성(암호화)을 모두 제공하는 헤더는?",
    options: [
      "AH (Authentication Header) — 인증과 무결성만 제공",
      "ESP (Encapsulating Security Payload) — 인증·무결성·기밀성 모두 제공",
      "TLS — IP 계층 암호화 프로토콜",
      "SSH — 네트워크 계층 보안 프로토콜",
    ],
    correctIndex: 1,
    explanation:
      "ESP(Encapsulating Security Payload)는 인증·무결성·기밀성(암호화)을 모두 제공한다. AH(Authentication Header)는 인증과 무결성만 제공하며 암호화(기밀성)는 제공하지 않는다.",
  },
  {
    id: 3,
    question: "보안 목표 7가지 중 '정보가 전송·저장 중 변조되지 않았음을 보장'하는 목표는?",
    options: [
      "기밀성 (Confidentiality) — 인가된 사용자만 접근 허용",
      "가용성 (Availability) — 서비스를 항상 제공",
      "무결성 (Integrity) — 데이터 변조 방지 보장",
      "부인방지 (Non-repudiation) — 행위를 부인할 수 없게 함",
    ],
    correctIndex: 2,
    explanation:
      "무결성(Integrity)은 정보가 전송 또는 저장 중 변조되지 않았음을 보장하는 보안 목표이다. 해시함수나 디지털서명이 대표적인 무결성 제공 수단이며, CIA 삼각형의 'I'에 해당한다.",
  },
  {
    id: 4,
    question: "IPsec의 AH(Authentication Header)가 제공하지 않는 보안 서비스는?",
    options: [
      "인증 (Authentication)",
      "무결성 (Integrity)",
      "기밀성 (Confidentiality)",
      "IP 헤더 포함 인증",
    ],
    correctIndex: 2,
    explanation:
      "AH(Authentication Header)는 인증과 무결성을 제공하지만, 기밀성(암호화)은 제공하지 않는다. 기밀성까지 필요한 경우에는 ESP(Encapsulating Security Payload)를 사용해야 한다.",
  },
  {
    id: 5,
    question: "OSI 보안서비스 중 부인방지(Non-repudiation)를 제공하는 가장 낮은(번호가 작은) OSI 계층은?",
    options: [
      "네트워크 계층 (3계층)",
      "전송 계층 (4계층)",
      "세션 계층 (5계층)",
      "표현 계층 (6계층)",
    ],
    correctIndex: 3,
    explanation:
      "OSI 보안서비스 매핑에 따르면, 부인방지(Non-repudiation)는 표현 계층(6계층)과 응용 계층(7계층)에서만 제공된다. 따라서 부인방지를 제공하는 가장 낮은 계층은 표현 계층(6계층)이다.",
  },
];

export default function Lecture6Quiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const handleSelect = (qId: number, optIdx: number) => {
    if (revealed[qId]) return;
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleReveal = (qId: number) => {
    setRevealed((prev) => ({ ...prev, [qId]: true }));
  };

  const handleReset = () => {
    setAnswers({});
    setRevealed({});
  };

  const totalAnswered = Object.keys(revealed).length;
  const totalCorrect = questions.filter(
    (q) => revealed[q.id] && answers[q.id] === q.correctIndex
  ).length;

  return (
    <section>
      <SectionTitle
        title="연습문제"
        subtitle="6강 네트워크 보안의 개요 핵심 내용을 확인하는 퀴즈"
      />

      {/* 점수 바 */}
      {totalAnswered > 0 && (
        <div className="mb-6 flex items-center justify-between rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
            {totalCorrect}/{totalAnswered} 정답
            {totalAnswered === questions.length && (
              <span className="ml-2">
                ({Math.round((totalCorrect / questions.length) * 100)}%)
              </span>
            )}
          </span>
          <button
            onClick={handleReset}
            className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-purple-700"
          >
            다시 풀기
          </button>
        </div>
      )}

      <div className="space-y-6">
        {questions.map((q) => {
          const isRevealed = revealed[q.id];
          const selected = answers[q.id];
          const isCorrect = selected === q.correctIndex;

          return (
            <div
              key={q.id}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
            >
              <h4 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-200">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                  {q.id}
                </span>
                {q.question}
              </h4>

              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  let optClass =
                    "border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700";

                  if (isRevealed) {
                    if (i === q.correctIndex) {
                      optClass =
                        "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/30";
                    } else if (i === selected && !isCorrect) {
                      optClass =
                        "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/30";
                    } else {
                      optClass =
                        "border-gray-200 bg-gray-50 opacity-50 dark:border-gray-700 dark:bg-gray-800";
                    }
                  } else if (selected === i) {
                    optClass =
                      "border-purple-300 bg-purple-50 dark:border-purple-600 dark:bg-purple-900/30";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(q.id, i)}
                      disabled={isRevealed}
                      className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${optClass}`}
                    >
                      <span className="mr-2 font-medium text-gray-500">
                        {String.fromCharCode(9312 + i)}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                      {isRevealed && i === q.correctIndex && (
                        <span className="ml-2 text-green-600 dark:text-green-400">&#10003;</span>
                      )}
                      {isRevealed && i === selected && !isCorrect && i !== q.correctIndex && (
                        <span className="ml-2 text-red-600 dark:text-red-400">&#10007;</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {!isRevealed && selected !== undefined && (
                <button
                  onClick={() => handleReveal(q.id)}
                  className="mt-3 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
                >
                  정답 확인
                </button>
              )}

              <AnimatePresence>
                {isRevealed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={`mt-3 rounded-lg p-3 text-sm ${
                        isCorrect
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                          : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                      }`}
                    >
                      <span className="font-bold">{isCorrect ? "정답!" : "오답"}</span>{" "}
                      {q.explanation}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
