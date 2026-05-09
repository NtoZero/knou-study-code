"use client";

import React, { useState } from "react";
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
    question: "가장 안전한 방화벽 구축 형태로 DMZ(비무장지대)를 포함하는 것은?",
    options: [
      "스크리닝 라우터 (Screening Router)",
      "듀얼 홈 호스트 (Dual-homed Host)",
      "스크린 호스트 게이트웨이 (Screened Host Gateway)",
      "스크린 서브넷 게이트웨이 (Screened Subnet Gateway)",
    ],
    correctIndex: 3,
    explanation:
      "스크린 서브넷 게이트웨이는 외부 라우터 + DMZ(베스천 호스트) + 내부 라우터의 3단계 방어 구조로, 5가지 구축 형태 중 가장 안전하다. DMZ에 공개 서버를 배치하여 내부망을 직접 노출하지 않는다.",
  },
  {
    id: 2,
    question: "애플리케이션 계층(L7)에서 동작하며 프록시(Proxy) 방식을 사용하는 방화벽 구성방식은?",
    options: [
      "패킷 필터링 (Packet Filtering)",
      "서킷 게이트웨이 (Circuit Gateway)",
      "애플리케이션 게이트웨이 (Application Gateway)",
      "하이브리드 (Hybrid)",
    ],
    correctIndex: 2,
    explanation:
      "애플리케이션 게이트웨이는 응용 계층(L7)에서 프록시 방식으로 동작하며 HTTP·FTP·SMTP 등 애플리케이션 레벨의 내용까지 검사한다. 가장 강력한 필터링이 가능하지만 처리 속도가 느리고 프로토콜별 프록시가 필요하다는 단점이 있다.",
  },
  {
    id: 3,
    question: "VPN의 핵심 기능 중 패킷을 캡슐화하여 가상의 안전한 통신로를 만드는 것은?",
    options: [
      "암호화 (Encryption)",
      "터널링 (Tunneling)",
      "인증 (Authentication)",
      "접근제어 (Access Control)",
    ],
    correctIndex: 1,
    explanation:
      "터널링(Tunneling)은 원본 패킷을 새로운 헤더로 감싸(캡슐화) 공중망을 통해 마치 전용 터널처럼 안전하게 전송하는 기법이다. VPN의 가장 핵심적인 기능으로, 외부에서는 캡슐화된 패킷만 보이므로 내부 데이터가 보호된다.",
  },
  {
    id: 4,
    question: "IPsec VPN과 비교하여 SSL VPN의 가장 큰 장점은?",
    options: [
      "더 강력한 암호화 알고리즘 사용",
      "네트워크 계층에서 동작하여 더 빠른 처리",
      "별도의 클라이언트 소프트웨어 설치 불필요",
      "기업 인트라넷 VPN 구성에 더 적합",
    ],
    correctIndex: 2,
    explanation:
      "SSL VPN은 웹 브라우저만으로 접속 가능하여 별도의 VPN 클라이언트 설치가 불필요하다. 이는 재택근무나 출장 중에 다양한 기기에서 접속할 때 매우 편리하다. IPsec VPN은 별도 클라이언트 설치가 필요하며 주로 site-to-site 연결에 사용된다.",
  },
  {
    id: 5,
    question: "NAC(Network Access Control)가 접속 전(Pre-admission)에 수행하는 주요 기능은?",
    options: [
      "접속한 사용자의 트래픽 패턴 모니터링",
      "비준수 단말의 패치 및 업데이트 강제 적용",
      "단말기의 보안 상태(백신, 패치 등) 검사",
      "네트워크에 전송되는 악성 패킷 실시간 차단",
    ],
    correctIndex: 2,
    explanation:
      "NAC의 Pre-admission(접속 전 검사)은 단말기가 네트워크에 접속하기 전에 백신 설치 여부, OS 패치 상태 등 보안 정책 준수 여부를 검사하는 기능이다. 검사를 통과한 단말만 네트워크 접속을 허용하고, 미준수 단말은 격리(Quarantine) 네트워크로 분리한다.",
  },
];

export default function Lecture7Quiz() {
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
        subtitle="7강 보안 시스템 I (방화벽·VPN·NAC) 핵심 내용 자가 점검"
      />

      {/* 점수 바 */}
      {totalAnswered > 0 && (
        <div className="mb-6 flex items-center justify-between rounded-lg bg-violet-50 p-4 dark:bg-violet-900/20">
          <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
            {totalCorrect}/{totalAnswered} 정답
            {totalAnswered === questions.length && (
              <span className="ml-2">
                ({Math.round((totalCorrect / questions.length) * 100)}%)
              </span>
            )}
          </span>
          <button
            onClick={handleReset}
            className="rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-violet-600"
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
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-white">
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
                      "border-violet-300 bg-violet-50 dark:border-violet-600 dark:bg-violet-900/30";
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
                      <span className="text-gray-700 dark:text-gray-300">
                        {opt}
                      </span>
                      {isRevealed && i === q.correctIndex && (
                        <span className="ml-2 text-green-600 dark:text-green-400">
                          &#10003;
                        </span>
                      )}
                      {isRevealed &&
                        i === selected &&
                        !isCorrect &&
                        i !== q.correctIndex && (
                          <span className="ml-2 text-red-600 dark:text-red-400">
                            &#10007;
                          </span>
                        )}
                    </button>
                  );
                })}
              </div>

              {/* 정답 확인 버튼 */}
              {!isRevealed && selected !== undefined && (
                <button
                  onClick={() => handleReveal(q.id)}
                  className="mt-3 rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-600"
                >
                  정답 확인
                </button>
              )}

              {/* 해설 */}
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
                      <span className="font-bold">
                        {isCorrect ? "정답!" : "오답"}
                      </span>{" "}
                      {q.explanation}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 전체 완료 메시지 */}
      <AnimatePresence>
        {totalAnswered === questions.length && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 rounded-xl border border-violet-200 bg-violet-50 p-5 text-center dark:border-violet-800 dark:bg-violet-950/30"
          >
            <p className="text-lg font-bold text-violet-700 dark:text-violet-300">
              {totalCorrect === questions.length
                ? "완벽! 7강 내용을 완전히 이해했습니다."
                : totalCorrect >= 3
                ? `${totalCorrect}/${questions.length} 정답 — 틀린 문제를 다시 확인해보세요.`
                : `${totalCorrect}/${questions.length} 정답 — 방화벽·VPN·NAC 개념을 다시 복습하세요.`}
            </p>
            <button
              onClick={handleReset}
              className="mt-3 rounded-lg bg-violet-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-600"
            >
              다시 풀기
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
