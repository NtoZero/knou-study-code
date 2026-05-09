"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, RotateCcw, Trophy, ChevronDown } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

interface Quiz {
  id: number;
  category: string;
  q: string;
  choices: string[];
  answer: number;
  explain: string;
}

const QUIZZES: Quiz[] = [
  {
    id: 1,
    category: "웹 보안",
    q: "공격자가 로그인 폼에 `' OR '1'='1` 을 입력하여 인증을 우회하는 공격은?",
    choices: [
      "XSS (Cross-Site Scripting)",
      "SQL 인젝션 (SQL Injection)",
      "접근제어 실패 (Broken Access Control)",
      "버퍼 오버플로우 (Buffer Overflow)",
    ],
    answer: 1,
    explain:
      "SQL 인젝션은 웹 폼이나 URL을 통해 악의적인 SQL 쿼리를 삽입하여 DB를 조작하는 공격입니다. `' OR '1'='1`을 입력하면 WHERE 조건이 항상 참이 되어 모든 행이 반환되어 인증을 우회합니다.",
  },
  {
    id: 2,
    category: "웹 보안",
    q: "악성 스크립트가 데이터베이스에 저장되어 다수 피해자가 해당 페이지를 조회할 때마다 실행되는 XSS 유형은?",
    choices: [
      "반사형 XSS (Reflected XSS)",
      "DOM 기반 XSS (DOM-based XSS)",
      "저장형 XSS (Stored XSS)",
      "세션 하이재킹 (Session Hijacking)",
    ],
    answer: 2,
    explain:
      "저장형 XSS(Stored XSS)는 공격 스크립트가 DB에 저장된 후, 다른 사용자가 해당 페이지를 조회할 때마다 자동으로 실행됩니다. 반사형은 URL 파라미터에 삽입되어 요청 시에만 반영됩니다.",
  },
  {
    id: 3,
    category: "무선 보안",
    q: "WPA2에서 CCMP(Counter Mode with CBC-MAC Protocol)가 사용하는 암호화 알고리즘은?",
    choices: [
      "RC4 (스트림 암호)",
      "DES (Data Encryption Standard)",
      "3DES (Triple DES)",
      "AES (Advanced Encryption Standard)",
    ],
    answer: 3,
    explain:
      "CCMP는 AES(Advanced Encryption Standard) 블록 암호를 기반으로 합니다. CCM 모드로 기밀성(Counter Mode)과 무결성(CBC-MAC)을 동시에 제공하며, RSN(IEEE 802.11i)의 필수(mandatory) 암호화 프로토콜입니다. TKIP는 RC4 기반입니다.",
  },
  {
    id: 4,
    category: "무선 보안",
    q: "WPA3에서 오프라인 사전 공격을 방어하기 위해 PSK(Pre-Shared Key)를 대체하는 기술은?",
    choices: [
      "TKIP (Temporal Key Integrity Protocol)",
      "PMF (Protected Management Frames)",
      "SAE (Simultaneous Authentication of Equals)",
      "EAP (Extensible Authentication Protocol)",
    ],
    answer: 2,
    explain:
      "SAE(Simultaneous Authentication of Equals)는 Dragonfly 핸드셰이크를 기반으로 하는 패스워드 인증 프로토콜로, WPA2-Personal의 PSK를 대체합니다. 매 인증마다 새 세션 키를 생성(Forward Secrecy)하여 오프라인 사전 공격을 방어합니다.",
  },
  {
    id: 5,
    category: "무선 보안",
    q: "WPA3의 개선사항 중, 관리 프레임(Deauthentication, Disassociation 등)을 암호화·인증하여 무선 재밍과 세션 하이재킹을 방어하는 기능은?",
    choices: [
      "SAE (Simultaneous Authentication of Equals)",
      "PMF (Protected Management Frames)",
      "DPP (Device Provisioning Protocol)",
      "CCMP (Counter Mode with CBC-MAC Protocol)",
    ],
    answer: 1,
    explain:
      "PMF(Protected Management Frames)는 Wi-Fi 관리 프레임을 암호화·인증하는 기능입니다. WPA2에서는 관리 프레임이 평문 전송되어 공격자가 가짜 De-auth 프레임으로 강제 접속 해제할 수 있었으나, WPA3에서는 PMF가 필수(Mandatory)로 적용됩니다.",
  },
];

export default function Lecture10Quiz() {
  const [answers, setAnswers] = useState<Record<number, number | null>>(
    Object.fromEntries(QUIZZES.map((q) => [q.id, null]))
  );
  const [showExplain, setShowExplain] = useState<Record<number, boolean>>(
    Object.fromEntries(QUIZZES.map((q) => [q.id, false]))
  );
  const [submitted, setSubmitted] = useState(false);

  const correctCount = QUIZZES.filter(
    (q) => answers[q.id] !== null && answers[q.id] === q.answer
  ).length;

  function handleSelect(qId: number, choiceIdx: number) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: choiceIdx }));
  }

  function handleSubmit() {
    if (QUIZZES.some((q) => answers[q.id] === null)) {
      alert("모든 문제에 답을 선택해 주세요.");
      return;
    }
    setSubmitted(true);
    setShowExplain(Object.fromEntries(QUIZZES.map((q) => [q.id, false])));
  }

  function handleReset() {
    setAnswers(Object.fromEntries(QUIZZES.map((q) => [q.id, null])));
    setShowExplain(Object.fromEntries(QUIZZES.map((q) => [q.id, false])));
    setSubmitted(false);
  }

  const categoryColor: Record<string, string> = {
    "웹 보안": "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 border border-pink-300 dark:border-pink-700",
    "무선 보안": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-300 dark:border-blue-700",
  };

  return (
    <section>
      <SectionTitle
        title="10강 자가 점검 퀴즈"
        subtitle="웹 보안 · 무선LAN 보안 핵심 개념 — 5문항"
      />

      {/* Score (after submit) */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-6 flex items-center gap-4 rounded-2xl p-5 ${
              correctCount === QUIZZES.length
                ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-400 dark:border-green-600"
                : correctCount >= 3
                ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-400 dark:border-blue-600"
                : "bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-400 dark:border-amber-600"
            }`}
          >
            <Trophy
              size={32}
              className={
                correctCount === QUIZZES.length
                  ? "text-green-500"
                  : correctCount >= 3
                  ? "text-blue-500"
                  : "text-amber-500"
              }
            />
            <div>
              <div className="text-xl font-bold">
                {correctCount} / {QUIZZES.length} 정답
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({Math.round((correctCount / QUIZZES.length) * 100)}%)
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {correctCount === QUIZZES.length
                  ? "완벽합니다! 10강 핵심 개념을 모두 이해했습니다."
                  : correctCount >= 3
                  ? "잘 하셨습니다. 틀린 문항의 해설을 확인해 보세요."
                  : "조금 더 복습이 필요합니다. 아래 해설을 확인해 보세요."}
              </div>
            </div>
            <button
              onClick={handleReset}
              className="ml-auto flex items-center gap-1 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:border-pink-400 hover:text-pink-600"
            >
              <RotateCcw size={12} />
              다시 풀기
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz items */}
      <div className="space-y-6">
        {QUIZZES.map((quiz, qIdx) => {
          const selected = answers[quiz.id];
          const isCorrect = selected === quiz.answer;

          return (
            <div
              key={quiz.id}
              className={`rounded-2xl border-2 p-5 transition-colors ${
                submitted
                  ? isCorrect
                    ? "border-green-400 bg-green-50 dark:bg-green-900/10"
                    : "border-red-400 bg-red-50 dark:bg-red-900/10"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              }`}
            >
              {/* Header */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-pink-600 px-2.5 py-0.5 text-xs font-bold text-white">
                  Q{qIdx + 1}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColor[quiz.category] ?? ""}`}>
                  {quiz.category}
                </span>
                {submitted && (
                  isCorrect ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400">
                      <CheckCircle size={13} /> 정답
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400">
                      <XCircle size={13} /> 오답
                    </span>
                  )
                )}
              </div>

              {/* Question */}
              <p className="mb-4 text-sm font-medium text-gray-800 dark:text-gray-100 leading-relaxed">
                {quiz.q}
              </p>

              {/* Choices */}
              <div className="space-y-2">
                {quiz.choices.map((choice, cIdx) => {
                  const isSelected = selected === cIdx;
                  const isAnswer = quiz.answer === cIdx;

                  let choiceCls = "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300";
                  if (!submitted && isSelected) {
                    choiceCls = "border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-800 dark:text-pink-200 font-medium";
                  } else if (submitted) {
                    if (isAnswer) {
                      choiceCls = "border-green-500 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 font-medium";
                    } else if (isSelected && !isAnswer) {
                      choiceCls = "border-red-400 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
                    }
                  }

                  return (
                    <button
                      key={cIdx}
                      onClick={() => handleSelect(quiz.id, cIdx)}
                      disabled={submitted}
                      className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left text-sm transition-all ${choiceCls} ${
                        !submitted ? "hover:border-pink-400 cursor-pointer" : "cursor-default"
                      }`}
                    >
                      <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-current text-xs font-bold">
                        {String.fromCharCode(65 + cIdx)}
                      </span>
                      {choice}
                      {submitted && isAnswer && (
                        <CheckCircle size={14} className="ml-auto shrink-0 text-green-500" />
                      )}
                      {submitted && isSelected && !isAnswer && (
                        <XCircle size={14} className="ml-auto shrink-0 text-red-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {submitted && (
                <div className="mt-3">
                  <button
                    onClick={() =>
                      setShowExplain((prev) => ({ ...prev, [quiz.id]: !prev[quiz.id] }))
                    }
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-pink-600 dark:hover:text-pink-400"
                  >
                    <ChevronDown
                      size={13}
                      className={`transition-transform ${showExplain[quiz.id] ? "rotate-180" : ""}`}
                    />
                    해설 {showExplain[quiz.id] ? "접기" : "보기"}
                  </button>
                  <AnimatePresence>
                    {showExplain[quiz.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          {quiz.explain}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit button */}
      {!submitted && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSubmit}
            className="rounded-full bg-pink-600 px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-pink-700 transition-colors"
          >
            채점하기
          </button>
        </div>
      )}
    </section>
  );
}

