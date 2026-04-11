"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

const questions: QuizQuestion[] = [
  {
    question: "응용 계층의 프로토콜과 포트번호가 동일한 것은?",
    options: ["HTTP - 80", "FTP - 22", "SMTP - 23", "POP3 - 11"],
    answerIndex: 0,
    explanation:
      "HTTP는 80 포트가 맞다. FTP는 21, SMTP는 25, POP3는 110 포트.",
  },
  {
    question: "HTTP의 설명이 틀린 것은?",
    options: [
      "모든 요청과 응답은 이전의 것들과는 상관없이 독립적으로 이루어진다.",
      "데이터 속성이나 서버 종류 같은 헤더는 제외한 요청받은 데이터만 반환된다.",
      "불특정 다수를 대상으로 하는 서비스에 적합하다.",
      "쿠키, 세션, 로컬 스토리지 등으로 상태를 보완할 수 있다.",
    ],
    answerIndex: 1,
    explanation:
      "HTTP에서 반환되는 정보는 MIME(Multipurpose Internet Mail Extensions) 정의에 의한 데이터 속성·서버 종류 같은 헤더 정보와 함께 요청받은 데이터가 반환된다.",
  },
  {
    question: "파일 전송 서비스의 설명이 틀린 것은?",
    options: [
      "파일 전송 서비스에는 FTP, SFTP 프로토콜 등이 있다.",
      "21번 포트를 통해 실제 파일을 전송하고, 파일 전송을 제어한다.",
      "FTP의 실제 파일 전송 과정에서는 능동 모드와 수동 모드를 지원한다.",
      "SFTP는 신뢰할 수 있는 데이터 흐름을 통해 파일 접근, 파일 전송, 파일 관리를 제공한다.",
    ],
    answerIndex: 1,
    explanation:
      "FTP 21번 포트는 파일 전송을 제어하기 위한 신호를 주고받는다. 접속이 된 후에는 20번 포트를 통해 실제 파일 전송을 수행.",
  },
  {
    question: "원격 접속 서비스의 설명이 틀린 것은?",
    options: [
      "TELNET의 포트번호는 21을 사용한다.",
      "원격지의 컴퓨터를 이용하는 가상 단말 기능을 실현하기 위한 프로토콜이다.",
      "텔넷은 터미널과 호스트와의 일대일 대칭적인 관계를 가진다.",
      "SSH는 강력한 인증 방법, 안전하지 못한 네트워크에서 안전하게 통신을 할 수 있는 기능 등을 제공한다.",
    ],
    answerIndex: 0,
    explanation:
      "텔넷을 사용하기 위해서는 23번 포트 번호를 이용하고, 사용자 아이디와 패스워드를 가지고 있어야 한다. 21번은 FTP 제어 포트.",
  },
  {
    question: "메일 서비스의 프로토콜과 설명이 맞지 않는 것은?",
    options: [
      "SMTP: 메일을 송신할 때 사용하는 프로토콜",
      "POP3: 메일을 전송받을 때 사용하는 프로토콜",
      "POP3: 로컬에서 메일을 수정, 삭제해도 메일서버에는 변화가 없음",
      "IMAP: 비동기화하는 방식을 사용",
    ],
    answerIndex: 3,
    explanation:
      "IMAP은 POP3의 단점인 비동기성을 보완하기 위한 방식이다. 어떤 디바이스에서 메일을 열든 동일하게 ‘동기화’하는 방식을 사용(비동기화가 아님). 단점은 복잡하다는 점.",
  },
];

export default function Quiz10() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const q = questions[idx];

  const select = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    setAnswers([...answers, i]);
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      setDone(true);
    } else {
      setIdx(idx + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setIdx(0);
    setSelected(null);
    setAnswers([]);
    setDone(false);
  };

  const score = answers.filter((a, i) => a === questions[i].answerIndex).length;

  return (
    <section>
      <SectionTitle
        title="자가 점검 퀴즈"
        subtitle="5문항 · 정답 선택 후 해설을 확인하세요"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        {!done ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-3 flex items-center justify-between text-xs">
                <span className="rounded-full bg-red-100 px-2 py-0.5 font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-300">
                  {idx + 1} / {questions.length}
                </span>
                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-6 rounded-full ${
                        i < idx
                          ? "bg-red-500"
                          : i === idx
                            ? "bg-red-300"
                            : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h3 className="mb-4 text-base font-bold">{q.question}</h3>

              <div className="space-y-2">
                {q.options.map((c, i) => {
                  const isCorrect = i === q.answerIndex;
                  const isSelected = i === selected;
                  let cls = "border-gray-200 hover:border-red-300 dark:border-gray-700";
                  if (selected !== null) {
                    if (isCorrect)
                      cls = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20";
                    else if (isSelected)
                      cls = "border-red-500 bg-red-50 dark:bg-red-900/20";
                    else cls = "border-gray-200 opacity-50 dark:border-gray-700";
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => select(i)}
                      disabled={selected !== null}
                      className={`block w-full rounded-lg border-2 p-3 text-left text-sm transition-colors ${cls}`}
                    >
                      <span className="mr-2 font-bold text-red-600">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {c}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {selected !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 rounded-lg p-3 text-sm ${
                      selected === q.answerIndex
                        ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200"
                        : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200"
                    }`}
                  >
                    <div className="mb-1 font-bold">
                      {selected === q.answerIndex ? "정답입니다" : "오답입니다"}
                    </div>
                    <p>{q.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {selected !== null && (
                <button
                  onClick={next}
                  className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                >
                  {idx + 1 >= questions.length ? "결과 보기" : "다음 문항 →"}
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-sm text-gray-500">최종 점수</div>
            <div className="my-3 text-5xl font-bold text-red-600">
              {score} / {questions.length}
            </div>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              {score === questions.length
                ? "완벽합니다. 10강 내용을 모두 숙지하셨습니다."
                : score >= Math.ceil(questions.length * 0.6)
                  ? "잘 하셨어요. 오답 문항을 다시 복습해보세요."
                  : "조금 더 복습이 필요합니다. 정리하기 내용을 다시 확인해보세요."}
            </div>

            <div className="mb-4 space-y-2 text-left">
              {questions.map((qi, i) => {
                const ok = answers[i] === qi.answerIndex;
                return (
                  <div
                    key={i}
                    className={`rounded-lg p-2 text-xs ${
                      ok
                        ? "bg-emerald-50 dark:bg-emerald-900/20"
                        : "bg-red-50 dark:bg-red-900/20"
                    }`}
                  >
                    <span className="font-bold">
                      {i + 1}. {ok ? "O" : "X"}
                    </span>{" "}
                    {qi.question}
                  </div>
                );
              })}
            </div>

            <button
              onClick={restart}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
            >
              다시 풀기
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
