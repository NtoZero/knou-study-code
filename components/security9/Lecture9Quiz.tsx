"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, RotateCcw, Trophy } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

interface Quiz {
  q: string;
  choices: string[];
  answer: number;
  explain: string;
  category: string;
}

const QUIZZES: Quiz[] = [
  {
    q: "PGP에서 메시지 본문 암호화에 사용되는 키 유형은?",
    choices: [
      "수신자의 공개키 (RSA)",
      "발신자의 개인키",
      "세션키 (일회용 대칭키)",
      "암호구문 (Passphrase)",
    ],
    answer: 2,
    explain:
      "PGP는 매번 새로운 일회용 세션키(대칭키)를 생성하여 메시지 본문을 암호화합니다. 세션키 자체는 수신자의 공개키로 암호화하여 함께 전송합니다. 이를 하이브리드 암호화라고 합니다.",
    category: "기밀성",
  },
  {
    q: "PGP 송신 과정에서 ZIP 압축은 언제 수행되는가?",
    choices: [
      "해시 계산 이전",
      "서명 생성 이후, 암호화 이전",
      "세션키 생성 이후",
      "Base64 인코딩 이후",
    ],
    answer: 1,
    explain:
      "PGP 순서: ① 해시 계산 → ② 서명 생성 → ③ ZIP 압축 → ④ 세션키 암호화 → ⑤ 세션키 암호화 → ⑥ Base64 인코딩. 압축은 서명 후, 암호화 전에 수행됩니다. 서명 후 압축하면 원문에 대한 서명이 보존되고, 암호화 전 압축하면 암호화 대상 크기가 줄어 효율적입니다.",
    category: "송신 순서",
  },
  {
    q: "PGP의 분산 신뢰 모델을 무엇이라 하는가?",
    choices: [
      "PKI (Public Key Infrastructure)",
      "X.509 인증서 체계",
      "웹오브트러스트 (Web of Trust, 신뢰고리)",
      "Kerberos 인증",
    ],
    answer: 2,
    explain:
      "PGP는 중앙 CA 없이 사용자들이 서로의 공개키에 서명(보증)하여 신뢰 네트워크를 형성하는 웹오브트러스트(Web of Trust) 모델을 사용합니다. 내가 신뢰하는 사람이 보증한 공개키는 간접적으로 신뢰할 수 있습니다.",
    category: "신뢰 모델",
  },
  {
    q: "S/MIME이 MIME와 가장 다른 점은?",
    choices: [
      "바이너리 파일 첨부 지원",
      "멀티파트 메시지 구조",
      "Base64 인코딩 기능",
      "암호화와 디지털서명 보안 기능 추가",
    ],
    answer: 3,
    explain:
      "MIME는 이미 바이너리 첨부, 멀티파트, Base64 인코딩을 지원합니다. S/MIME(Secure/MIME)은 MIME 위에 RSA/ECDSA 디지털서명과 AES 암호화 보안 기능을 추가한 것이 핵심 차이점입니다.",
    category: "S/MIME",
  },
  {
    q: "PGP에서 로컬에 저장된 개인키 파일을 보호하는 요소는?",
    choices: [
      "세션키 (Session Key)",
      "수신자 공개키",
      "암호구문 (Passphrase)",
      "디지털 서명",
    ],
    answer: 2,
    explain:
      "PGP의 개인키는 로컬 파일에 저장되는데, 이 파일을 암호구문(Passphrase)으로 암호화하여 보호합니다. 암호구문은 사용자의 기억 속에만 존재하며, PGP 사용 시마다 입력하여 개인키를 복호화합니다.",
    category: "키 보호",
  },
];

export default function Lecture9Quiz() {
  const [selected, setSelected] = useState<(number | null)[]>(Array(QUIZZES.length).fill(null));
  const [showExplain, setShowExplain] = useState<boolean[]>(Array(QUIZZES.length).fill(false));
  const [finished, setFinished] = useState(false);

  const score = selected.filter((s, i) => s === QUIZZES[i].answer).length;

  const handleSelect = (qi: number, ci: number) => {
    if (selected[qi] !== null) return;
    const next = [...selected];
    next[qi] = ci;
    setSelected(next);
    const ex = [...showExplain];
    ex[qi] = true;
    setShowExplain(ex);
  };

  const handleReset = () => {
    setSelected(Array(QUIZZES.length).fill(null));
    setShowExplain(Array(QUIZZES.length).fill(false));
    setFinished(false);
  };

  const allAnswered = selected.every((s) => s !== null);

  return (
    <section>
      <SectionTitle
        title="9강 자가 점검 퀴즈"
        subtitle="PGP·S/MIME·키 관리·신뢰 모델 핵심 개념 확인"
      />

      <div className="space-y-5">
        {QUIZZES.map((q, qi) => {
          const sel = selected[qi];
          const answered = sel !== null;
          const correct = sel === q.answer;

          return (
            <div
              key={qi}
              className={`rounded-xl border-2 transition-all ${
                answered
                  ? correct
                    ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-red-400 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
              }`}
            >
              <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white">
                      {qi + 1}
                    </span>
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                      {q.category}
                    </span>
                  </div>
                  {answered && (
                    correct ? (
                      <CheckCircle size={20} className="shrink-0 text-emerald-500" />
                    ) : (
                      <XCircle size={20} className="shrink-0 text-red-500" />
                    )
                  )}
                </div>

                <p className="mb-4 font-semibold text-gray-800 dark:text-gray-100">{q.q}</p>

                <div className="grid gap-2 sm:grid-cols-2">
                  {q.choices.map((c, ci) => {
                    const isSelected = sel === ci;
                    const isAnswer = ci === q.answer;
                    let style = "border-gray-200 bg-white hover:border-rose-300 hover:bg-rose-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-rose-700";
                    if (answered) {
                      if (isAnswer) style = "border-emerald-400 bg-emerald-100 dark:border-emerald-600 dark:bg-emerald-900/30";
                      else if (isSelected && !correct) style = "border-red-400 bg-red-100 dark:border-red-600 dark:bg-red-900/30";
                      else style = "border-gray-100 bg-gray-50 opacity-50 dark:border-gray-800 dark:bg-gray-900";
                    }
                    return (
                      <button
                        key={ci}
                        onClick={() => handleSelect(qi, ci)}
                        disabled={answered}
                        className={`flex items-center gap-3 rounded-lg border-2 p-3 text-left text-sm transition-all ${style}`}
                      >
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          answered && isAnswer
                            ? "bg-emerald-500 text-white"
                            : answered && isSelected && !correct
                            ? "bg-red-500 text-white"
                            : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                        }`}>
                          {["A", "B", "C", "D"][ci]}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">{c}</span>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {showExplain[qi] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
                        correct
                          ? "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/20"
                          : "border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-900/20"
                      }`}>
                        <div className={`mb-1 font-bold ${correct ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}`}>
                          {correct ? "정답입니다!" : `오답 — 정답: ${["A", "B", "C", "D"][q.answer]}. ${q.choices[q.answer]}`}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{q.explain}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* 결과 */}
      <AnimatePresence>
        {allAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`mt-6 rounded-xl border-2 p-6 text-center ${
              score === QUIZZES.length
                ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                : score >= 3
                ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20"
                : "border-rose-400 bg-rose-50 dark:bg-rose-900/20"
            }`}
          >
            <Trophy
              size={32}
              className={`mx-auto mb-2 ${
                score === QUIZZES.length
                  ? "text-emerald-500"
                  : score >= 3
                  ? "text-amber-500"
                  : "text-rose-500"
              }`}
            />
            <div className="text-3xl font-black text-gray-800 dark:text-gray-100">
              {score} / {QUIZZES.length}
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {score === QUIZZES.length
                ? "완벽합니다! 9강 이메일 보안 완전 이해!"
                : score >= 3
                ? "잘 했습니다! 틀린 문항 해설을 다시 확인하세요."
                : "핵심 개념을 다시 학습하고 도전하세요."}
            </div>
            <button
              onClick={handleReset}
              className="mt-4 flex items-center gap-2 mx-auto rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-white dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <RotateCcw size={14} />
              다시 풀기
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
