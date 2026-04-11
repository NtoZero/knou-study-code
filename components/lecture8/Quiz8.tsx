"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

interface Q {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

const QUESTIONS: Q[] = [
  {
    q: "IP 프로토콜의 특징이 아닌 것은?",
    options: [
      "비연결형 전송 서비스",
      "네트워크 계층 프로토콜",
      "신뢰성있는 데이터 전송",
      "32비트 주소 사용",
    ],
    answer: 2,
    explain:
      "IP 프로토콜은 종단간 전송되는 메시지의 안정성이나 흐름 제어를 책임지지 않는다. 즉 비연결형·비신뢰성 서비스.",
  },
  {
    q: "데이터그램이 폐기되기 전 인터넷에 활동할 수 있는 기간을 나타내는 IP 데이터그램의 필드는?",
    options: ["플래그", "단편 오프셋", "TTL", "식별자"],
    answer: 2,
    explain:
      "TTL(Time To Live)은 데이터그램이 폐기되기 전에 패킷이 활동할 수 있는 기간을 나타내는 필드. 방문되는 라우터에 의해 하나씩 감소되어 ‘0’이 되면 폐기된다.",
  },
  {
    q: "라우팅 테이블이 제공하는 정보가 아닌 것은?",
    options: [
      "다음홉(next-hop) 라우터의 IP 주소",
      "목적지 IP 주소",
      "송신자 IP 주소",
      "참조 횟수",
    ],
    answer: 2,
    explain:
      "라우팅 테이블 필드는 마스크, 목적지 IP 주소, 다음홉 라우터의 IP 주소, 플래그, 참조횟수, 사용, 인터페이스 등. 송신자(출발지) IP 주소는 포함되지 않는다.",
  },
  {
    q: "ARP와 관련이 없는 것은?",
    options: [
      "IP 주소를 물리주소로 매핑한다.",
      "ARP 요청 메시지는 브로드캐스트 방식으로 전송된다.",
      "ARP 응답 메시지는 유니캐스트 방식으로 전송된다.",
      "디스크가 없는 호스트는 ARP를 사용하여 IP 주소를 얻는다.",
    ],
    answer: 3,
    explain:
      "ARP는 IP 주소를 물리주소(MAC)로 매핑. 디스크가 없는 호스트는 자신의 물리주소만 통신 가능하므로 RARP를 이용해 물리주소로부터 IP 주소를 얻는다.",
  },
  {
    q: "ICMP에 관한 설명이 아닌 것은?",
    options: [
      "오류 또는 제어 메시지를 제공한다.",
      "IP 데이터그램을 사용한다.",
      "유형 및 코드에 따라서 서로 다른 형식을 제공한다.",
      "응용 계층에서는 ICMP 기능을 직접 이용할 수 없다.",
    ],
    answer: 3,
    explain:
      "ICMP는 인터넷에서 IP를 대신하여 오류·제어 메시지를 제공하는 프로토콜. ICMP 메시지는 IP 데이터그램으로 전송되며, 유형·코드에 따라 서로 다른 형식을 가진다.",
  },
  {
    q: "DHCP에 관한 설명이 아닌 것은?",
    options: [
      "IP 주소가 없는 경우에도 인터넷에 접속 가능하다.",
      "중앙에서 IP 주소를 관리하고 자동으로 할당한다.",
      "다른 네트워크로 이동 시에 재부팅할 필요가 없다.",
      "IP 주소 재사용 가능하다.",
    ],
    answer: 0,
    explain:
      "인터넷 상에서 호스트들이 서로 통신하기 위해서는 각 호스트를 식별해주는 IP 주소가 반드시 필요하다. DHCP는 IP 주소의 자동 할당·재사용·중앙 관리를 제공하나, IP 주소 없이 접속할 수 있게 해주는 것은 아니다.",
  },
];

export default function Quiz8() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[idx];

  const select = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    setAnswers([...answers, i]);
  };

  const next = () => {
    if (idx + 1 >= QUESTIONS.length) {
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

  const score = answers.filter((a, i) => a === QUESTIONS[i].answer).length;

  return (
    <section>
      <SectionTitle
        title="자가 점검 퀴즈"
        subtitle="6문항 · 정답 선택 후 해설을 확인하세요"
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
                <span className="rounded-full bg-pink-100 px-2 py-0.5 font-semibold text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
                  {idx + 1} / {QUESTIONS.length}
                </span>
                <div className="flex gap-1">
                  {QUESTIONS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-6 rounded-full ${
                        i < idx
                          ? "bg-pink-500"
                          : i === idx
                            ? "bg-pink-300"
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
                  let cls = "border-gray-200 hover:border-pink-300 dark:border-gray-700";
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
                      <span className="mr-2 font-bold text-pink-600">
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
                  className="mt-4 rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600"
                >
                  {idx + 1 >= QUESTIONS.length ? "결과 보기" : "다음 문항 →"}
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
            <div className="my-3 text-5xl font-bold text-pink-600">
              {score} / {QUESTIONS.length}
            </div>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              {score === QUESTIONS.length
                ? "완벽합니다. 8강 내용을 모두 숙지하셨습니다."
                : score >= Math.ceil(QUESTIONS.length * 0.6)
                  ? "잘 하셨어요. 오답 문항을 다시 복습해보세요."
                  : "조금 더 복습이 필요합니다. 정리하기 내용을 다시 확인해보세요."}
            </div>

            <div className="mb-4 space-y-2 text-left">
              {QUESTIONS.map((qi, i) => {
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
              className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600"
            >
              다시 풀기
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
