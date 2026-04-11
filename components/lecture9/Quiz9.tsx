"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

interface Question {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

const questions: Question[] = [
  {
    q: "전송 계층의 프로토콜로 올바른 것은?",
    options: ["IP", "TCP", "ARP", "HTTP"],
    answer: 1,
    explain:
      "전송 계층은 연결형 통신으로 TCP 프로토콜을 사용하며, 그 외에 UDP 프로토콜을 사용한다. IP는 인터넷 계층, ARP도 인터넷 계층, HTTP는 응용 계층 프로토콜.",
  },
  {
    q: "TCP/IP에서 UDP(User Datagram Protocol)는 OSI 7계층 참조모델에서 어느 계층에 해당하는가?",
    options: ["네트워크 계층", "전송 계층", "표현 계층", "세션 계층"],
    answer: 1,
    explain:
      "TCP/IP에서 TCP(Transmission Control Protocol) 및 UDP(User Datagram Protocol)는 전송 계층 프로토콜이다.",
  },
  {
    q: "TCP에 관한 서술로 옳은 것은?",
    options: [
      "신뢰성 있는 연결지향 데이터 전송 서비스를 제공하는 트랜스포트 계층 프로토콜이다.",
      "신뢰성이 없는 비연결형 트랜스포트 계층 프로토콜로서 데이터 전송 속도가 빠르다.",
      "메시지가 최종 목적지에 올바른 순서로 수신되었는지 확인하지 않아도 되는 장점이 있다.",
      "TCP 서비스를 이용하는 응용 프로그램은 메시지 손실, 중복 수신, 잘못된 수신순서 등을 해결해야 한다.",
    ],
    answer: 0,
    explain:
      "TCP는 신뢰성 있는 연결지향 데이터 전송 서비스를 제공하는 트랜스포트 계층 프로토콜. 나머지 문항은 모두 UDP에 관련된 서술이다.",
  },
  {
    q: "TCP와 UDP의 차이점을 설명한 것 중 옳지 않은 것은?",
    options: [
      "TCP는 전달된 패킷에 대한 수신측의 인증이 필요하지만 UDP는 필요하지 않다.",
      "TCP는 대용량의 데이터나 중요한 데이터 전송에 이용이 되지만 UDP는 단순한 메시지 전달에 주로 사용된다.",
      "UDP는 네트워크가 혼잡하거나 라우팅이 복잡할 경우에는 패킷이 유실될 우려가 있다.",
      "UDP는 데이터 전송전에 반드시 송수신 간의 세션이 먼저 수립되어야 한다.",
    ],
    answer: 3,
    explain:
      "UDP는 비연결형 프로토콜로 세션 수립 절차가 없다. 포트 번호만을 사용하여 응용 프로그램을 식별한다.",
  },
  {
    q: "신뢰성 있는 연결형(connection-oriented) 데이터 전송 서비스와 관련이 깊은 것은?",
    options: ["DNS", "UDP", "TCP", "IP"],
    answer: 2,
    explain:
      "TCP는 신뢰성 있는 연결형 데이터 전송 서비스를 제공. IP와 UDP는 비연결형 데이터 전송 서비스이며, DNS는 UDP를 사용하는 응용계층 프로토콜로 역시 비연결형 전송 서비스.",
  },
];

export default function Quiz9() {
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

  const score = answers.filter((a, i) => a === questions[i].answer).length;

  return (
    <section>
      <SectionTitle title="자가 점검 퀴즈" subtitle="5문항 · 정답 선택 후 해설을 확인하세요" />

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
                <span className="rounded-full bg-yellow-100 px-2 py-0.5 font-semibold text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                  {idx + 1} / {questions.length}
                </span>
                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-6 rounded-full ${
                        i < idx
                          ? "bg-yellow-500"
                          : i === idx
                            ? "bg-yellow-300"
                            : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h3 className="mb-4 text-base font-bold">{q.q}</h3>

              <div className="space-y-2">
                {q.options.map((c, i) => {
                  const isCorrect = i === q.answer;
                  const isSelected = i === selected;
                  let cls = "border-gray-200 hover:border-yellow-300 dark:border-gray-700";
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
                      <span className="mr-2 font-bold text-yellow-600">
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
                      selected === q.answer
                        ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200"
                        : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200"
                    }`}
                  >
                    <div className="mb-1 font-bold">
                      {selected === q.answer ? "정답입니다" : "오답입니다"}
                    </div>
                    <p>{q.explain}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {selected !== null && (
                <button
                  onClick={next}
                  className="mt-4 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-600"
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
            <div className="my-3 text-5xl font-bold text-yellow-600">
              {score} / {questions.length}
            </div>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              {score === questions.length
                ? "완벽합니다. 9강 내용을 모두 숙지하셨습니다."
                : score >= Math.ceil(questions.length * 0.6)
                  ? "잘 하셨어요. 오답 문항을 다시 복습해보세요."
                  : "조금 더 복습이 필요합니다. 정리하기 내용을 다시 확인해보세요."}
            </div>

            <div className="mb-4 space-y-2 text-left">
              {questions.map((qi, i) => {
                const ok = answers[i] === qi.answer;
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
                    {qi.q}
                  </div>
                );
              })}
            </div>

            <button
              onClick={restart}
              className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-600"
            >
              다시 풀기
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
