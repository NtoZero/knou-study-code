"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

interface Question {
  q: string;
  choices: string[];
  answer: number;
  explain: string;
}

const questions: Question[] = [
  {
    q: "OSI 7계층 참조 모델과 DoD 모델(TCP/IP)을 비교한 서술로서 부적절한 것은?",
    choices: [
      "OSI 참조모델은 7개 계층으로, DoD 모델은 4개 계층으로 구성된다.",
      "OSI 참조모델은 컴퓨터 통신망 구조의 이론적 모델이다.",
      "DoD 모델은 인터넷에서 데이터 전송을 위한 클라이언트-서버 모델이다.",
      "두 모델 모두 국제 표준 기구에서 처음 제안하였다.",
    ],
    answer: 3,
    explain:
      "OSI 참조모델은 국제표준기구인 ISO에서 제안하였지만, DoD 모델은 미국 국방성에서 제안한 것이다.",
  },
  {
    q: "OSI 7계층 참조 모델에서 계층의 이름을 순서대로 나열한 것은?",
    choices: [
      "물리－네트워크－데이터링크－전송－세션－표현－응용",
      "물리－네트워크－데이터링크－전송－표현－세션－응용",
      "물리－데이터링크－네트워크－전송－표현－세션－응용",
      "물리－데이터링크－네트워크－전송－세션－표현－응용",
    ],
    answer: 3,
    explain:
      "가장 아래부터 ‘물리-데이터링크-네트워크-전송-세션-표현-응용’ 계층 순. 전송 계층은 트랜스포트 계층이라고도 부른다.",
  },
  {
    q: "OSI 7계층의 분리 원칙으로 틀린 것은?",
    choices: [
      "비슷한 기능들은 같은 계층에 존재하도록 한다.",
      "과거의 경험에 의해 성공적이라 판단되는 곳에 경계를 설정한다.",
      "필요한 경우 표준화된 인터페이스를 가질 수 있는 곳에 경계를 설정한다.",
      "서비스의 양이 많고 경계를 중심으로 최대의 상호 작용이 일어나도록 경계를 정한다.",
    ],
    answer: 3,
    explain:
      "서비스의 양이 적고 경계를 중심으로 최소의 상호 작용만 일어나도록 경계를 정해야 한다. 즉 계층 간 결합도를 최소화해야 함.",
  },
  {
    q: "OSI 7계층 중에서 CASE(Common Application Service Element)를 제공하는 계층은?",
    choices: ["표현 계층", "응용 계층", "트랜스포트 계층", "데이터 링크 계층"],
    answer: 1,
    explain:
      "응용 계층은 OSI 모델의 최상위 계층이며, 사용자·응용 프로그램과 직접 연관되어 네트워크 접근 수단을 제공. 응용 계층의 서비스는 CASE(공통 응용 서비스 요소), 각 응용에 속하는 서비스 요소, 각 사용자에 속하는 서비스 요소로 구분된다.",
  },
  {
    q: "괄호 ⓐ, ⓑ, ⓒ 안에 들어갈 용어로 적절한 것은? OSI 참조 모델에서 호스트 간의 통신은 결국 두 호스트의 동등한 계층 간의 통신에 의해 이루어진다. 이때 동등한 계층 간의 데이터 전송단위를 ( ⓐ )라고 하며, 이것은 상위 계층에서 전송을 원하는 데이터인 ( ⓑ )에 제어정보인 ( ⓒ )가 덧붙여진 형태로 전송된다.",
    choices: [
      "ⓐ : PDU,  ⓑ : SDU,  ⓒ : PCI",
      "ⓐ : PCI,  ⓑ : SDU,  ⓒ : PDU",
      "ⓐ : SDU,  ⓑ : PCI,  ⓒ : PDU",
      "ⓐ : SDU,  ⓑ : PDU,  ⓒ : PCI",
    ],
    answer: 0,
    explain:
      "동일 계층의 개체 간에 교환되는 정보는 SDU(Service Data Unit)와 SDU에 PCI(Protocol Control Information)를 추가한 PDU(Protocol Data Unit)로 표현된다.",
  },
  {
    q: "다음 중 TCP와 UDP에 관련된 설명으로 옳은 것은?",
    choices: [
      "TCP는 전송 계층 프로토콜이다.",
      "UDP는 인터넷 계층 프로토콜이다.",
      "TCP는 비연결 전송 서비스를 제공한다.",
      "UDP는 연결 전송 서비스를 제공하여 신뢰성이 높다.",
    ],
    answer: 0,
    explain:
      "TCP는 전송 계층의 프로토콜로 신뢰성 있는 연결지향형(connection-oriented) 데이터 전송 서비스를 제공한다. IP는 인터넷 계층 프로토콜이며 비연결형(connectionless) 데이터 전송 서비스를 제공. UDP 역시 전송 계층이지만 비연결형.",
  },
  {
    q: "다음 중 응용 계층의 프로토콜에 대한 설명으로 적절한 것은?",
    choices: [
      "FTP는 TCP를 이용하는 신뢰성 있는 파일 전송 프로토콜이다.",
      "DNS는 TCP를 이용하는 도메인 이름 서비스 프로토콜이다.",
      "telnet은 UDP를 이용하는 응용 계층의 프로토콜이다.",
      "ping은 TCP나 UDP를 이용하지 않고 IP를 이용하는 프로토콜이다.",
    ],
    answer: 0,
    explain:
      "DNS는 UDP 기반, telnet은 TCP 기반, ping은 TCP/UDP가 아닌 ICMP를 이용. FTP는 신뢰성 있는 TCP 기반 파일 전송 프로토콜이다.",
  },
  {
    q: "다음 중 인터넷에 연결되어 있는 호스트를 식별하기 위한 주소로서 부적절한 것은?",
    choices: ["물리 주소", "포트 번호", "UDP 주소", "인터넷 주소"],
    answer: 2,
    explain:
      "호스트 식별 주소는 물리 주소(MAC), 인터넷 주소(IP), 포트 번호(프로세스 식별). ‘UDP 주소’라는 용어는 존재하지 않는다.",
  },
  {
    q: "다음 중 멀티캐스트 서비스와 직접적인 관련이 있는 IP 주소의 클래스는?",
    choices: ["클래스 A", "클래스 B", "클래스 C", "클래스 D"],
    answer: 3,
    explain:
      "IP 주소는 32비트로 5개 클래스를 가짐. 클래스 D는 비트 1110으로 시작하며 네트워크나 호스트 식별이 아닌 멀티캐스트 서비스를 위해 사용된다. 클래스 E(1111)는 향후 예약.",
  },
];

export default function Quiz7() {
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
      <SectionTitle
        title="자가 점검 퀴즈"
        subtitle="9문항 · 정답 선택 후 해설을 확인하세요"
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
                <span className="rounded-full bg-lime-100 px-2 py-0.5 font-semibold text-lime-700 dark:bg-lime-900/30 dark:text-lime-300">
                  {idx + 1} / {questions.length}
                </span>
                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-6 rounded-full ${
                        i < idx
                          ? "bg-lime-500"
                          : i === idx
                            ? "bg-lime-300"
                            : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h3 className="mb-4 text-base font-bold">{q.q}</h3>

              <div className="space-y-2">
                {q.choices.map((c, i) => {
                  const isCorrect = i === q.answer;
                  const isSelected = i === selected;
                  let cls = "border-gray-200 hover:border-lime-300 dark:border-gray-700";
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
                      <span className="mr-2 font-bold text-lime-600">
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
                  className="mt-4 rounded-lg bg-lime-500 px-4 py-2 text-sm font-semibold text-white hover:bg-lime-600"
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
            <div className="my-3 text-5xl font-bold text-lime-600">
              {score} / {questions.length}
            </div>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              {score === questions.length
                ? "완벽합니다. 7강 내용을 모두 숙지하셨습니다."
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
              className="rounded-lg bg-lime-500 px-4 py-2 text-sm font-semibold text-white hover:bg-lime-600"
            >
              다시 풀기
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
