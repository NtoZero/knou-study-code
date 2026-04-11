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
    q: "다음 설명 중 부적절한 것은?",
    choices: [
      "흐름제어, 혼잡제어, 라우팅은 부 네트워크의 내부 환경이 변하더라도 통신망의 성능을 일정하게 유지해야 하는 목적을 가지고 있다.",
      "흐름제어는 지국 쌍에 주안점을 두고 있다.",
      "혼잡제어는 네트워크에 연결된 사용자(컴퓨터, 파일 등)를 정확하게 인식하게 함으로써 혼잡을 피하거나 막아주는 것이다.",
      "라우팅은 네트워크내의 트래픽을 분산시키고 부 네트워크의 성능을 증대시킨다.",
    ],
    answer: 2,
    explain:
      "흐름제어는 지국 쌍에 관해 주안점을 두고 미리 규정된 범위 내에서의 성능유지를 목적으로 한다. 혼잡제어는 버퍼의 혼잡, 노드의 혼잡, 부 네트워크의 국부 혼잡이나 전체 혼잡을 막아주는 것이다. 라우팅은 출발지에서 목적지까지의 경로를 결정하여 네트워크 내 트래픽을 분산시키고 부 네트워크의 성능을 최적화시킨다.",
  },
  {
    q: "슬라이딩 윈도우 방법을 이용하는 흐름제어와 관계가 깊은 것은?",
    choices: [
      "속도 조절의 원칙",
      "거부의 원칙",
      "단일 승낙의 원칙",
      "다중 승낙의 원칙",
    ],
    answer: 3,
    explain:
      "흐름제어의 네 가지 원칙은 속도조절, 거부, 단일승낙, 다중승낙. 다중승낙은 매 승낙마다 미리 약속된 개수의 블록을 전송하거나 승낙마다 블록 개수를 동적으로 결정하여 전송하는 방식으로, 슬라이딩 윈도우 방법이 대표적인 예.",
  },
  {
    q: "다음 중 흐름 제어의 원칙과 그것을 구현하는 방법으로 부적절하게 연결된 것은?",
    choices: [
      "속도 조절의 원칙 – chock packet 이용 방법",
      "거부의 원칙 – check sum 이용 방법",
      "단일 승낙의 원칙 – ask-and-wait 방법",
      "다중 승낙의 원칙 – sliding window 방법",
    ],
    answer: 1,
    explain:
      "거부의 원칙은 송신측에 대한 수신 거부의 의사를 밝히는 것으로, stop-and-go 방법으로 구현한다. check sum 이용 방법은 오류제어 방법 중 하나로서 흐름제어와는 무관.",
  },
  {
    q: "다음은 어떤 라우팅 방법을 설명한 것인가? 적응적 라우팅 방법 중 하나로 초창기의 ARPANET 컴퓨터 네트워크에서 찾아볼 수 있다.",
    choices: ["랜덤 라우팅", "분산형 라우팅", "플러딩 라우팅", "델타 라우팅"],
    answer: 1,
    explain:
      "분산형 라우팅은 라우팅 정보가 이웃하는 노드에서만 교환된다는 사실을 이용한 적응적 라우팅 방법 중 하나로, 대표적인 예로 초창기의 ARPANET에서 찾아볼 수 있다.",
  },
  {
    q: "다음 중 비적응적 경로선택 방법인 것은?",
    choices: [
      "분산(distributed) 경로선택",
      "플러딩(flooding) 경로선택",
      "델타(delta) 경로선택",
      "핫-포테이토(hot-potato) 경로선택",
    ],
    answer: 1,
    explain:
      "비적응적 방법: 랜덤(random), 플러딩/범람(flooding), 고정(fixed) 경로배정. 적응적 방법: 국부적(local), 분산(distributed), 델타(delta), 중앙집중형(centralized) 경로배정.",
  },
];

export default function Quiz6() {
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
                <span className="rounded-full bg-sky-100 px-2 py-0.5 font-semibold text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                  {idx + 1} / {questions.length}
                </span>
                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-6 rounded-full ${
                        i < idx
                          ? "bg-sky-500"
                          : i === idx
                            ? "bg-sky-300"
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
                  let cls =
                    "border-gray-200 hover:border-sky-300 dark:border-gray-700";
                  if (selected !== null) {
                    if (isCorrect)
                      cls =
                        "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20";
                    else if (isSelected)
                      cls =
                        "border-red-500 bg-red-50 dark:bg-red-900/20";
                    else cls = "border-gray-200 opacity-50 dark:border-gray-700";
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => select(i)}
                      disabled={selected !== null}
                      className={`block w-full rounded-lg border-2 p-3 text-left text-sm transition-colors ${cls}`}
                    >
                      <span className="mr-2 font-bold text-sky-600">
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
                  className="mt-4 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
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
            <div className="my-3 text-5xl font-bold text-sky-600">
              {score} / {questions.length}
            </div>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              {score === questions.length
                ? "완벽합니다. 6강 내용을 모두 숙지하셨습니다."
                : score >= 3
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
              className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
            >
              다시 풀기
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
