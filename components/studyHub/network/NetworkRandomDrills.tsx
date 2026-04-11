"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices, RefreshCw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

/* ---------------------------------------------------------------
 * NetworkRandomDrills — 서술형 과제에도 적용 가능한 4종 무작위 드릴.
 *
 * 드릴 A: Shannon-Weaver 요소 식별 체크리스트
 * 드릴 B: HAC 노이즈 주요 2가지 객관식
 * 드릴 C: Impact-Level 판정
 * 드릴 D: HAI 메커니즘 ↔ 프로토콜 기능 매칭
 * ------------------------------------------------------------- */

type DrillKey = "A" | "B" | "C" | "D";

// ----- 드릴 A: Shannon-Weaver 요소 식별 -----
const SW_ELEMENTS = [
  "정보원",
  "송신기",
  "채널",
  "수신기",
  "목적지",
  "노이즈",
];

interface ScenarioA {
  text: string;
  present: string[]; // 학습자가 반드시 식별해야 하는 요소 (5개 이상 권장)
}

const SCENARIOS_A: ScenarioA[] = [
  {
    text: "스마트 냉장고가 내부 카메라로 식자재를 인식해 사용자 스마트폰 앱에 레시피 3가지를 제안한다. Wi-Fi가 약해 제안이 중간에 끊긴다.",
    present: ["정보원", "송신기", "채널", "수신기", "목적지", "노이즈"],
  },
  {
    text: "번역 웨어러블이 회의에서 발화된 독일어 음성을 수집해 한국어 자막을 사용자 안경에 표시한다. 주변 소음 때문에 일부 단어가 오역된다.",
    present: ["정보원", "송신기", "채널", "수신기", "목적지", "노이즈"],
  },
  {
    text: "원격 심박 모니터가 환자의 심박 데이터를 5분마다 병원 서버로 전송해 의료진 대시보드에 표시한다. 해상도 부족으로 부정맥 일부 패턴이 누락된다.",
    present: ["정보원", "송신기", "채널", "수신기", "목적지", "노이즈"],
  },
];

// ----- 드릴 B: HAC 노이즈 객관식 -----
interface QuizB {
  situation: string;
  options: string[];
  answer: number[];
  explain: string;
}

const QUIZZES_B: QuizB[] = [
  {
    situation:
      "사용자가 LLM에게 '우리 회사 매출을 예측해줘'라고만 입력했더니 AI가 그럴듯한 숫자를 생성했으나 실제 데이터 근거가 없었다.",
    options: [
      "프롬프트 모호성",
      "전자기 간섭",
      "환각(hallucination)",
      "패킷 손실",
    ],
    answer: [0, 2],
    explain:
      "구체적 맥락을 주지 않은 프롬프트 모호성이 1차 원인이고, 근거 없이 숫자를 생성한 것은 환각의 전형.",
  },
  {
    situation:
      "긴 문서를 요약하던 LLM이 마지막 절의 반론을 언급하지 않고 초반 주장만 요약했다.",
    options: [
      "컨텍스트 윈도우 제한",
      "열잡음",
      "오정보",
      "전이중 통신 실패",
    ],
    answer: [0, 2],
    explain:
      "컨텍스트 윈도우 한계로 문서 후반부가 잘려 처리되었고, 이는 '실제 문서와 다른 정보'를 내는 오정보로 이어짐.",
  },
  {
    situation:
      "음성 비서가 사용자 질문을 잘못 인식해 엉뚱한 메뉴를 실행했다.",
    options: [
      "ASR 인식 오류",
      "도플러 효과",
      "의미론적 모호성",
      "전송 계층 오류",
    ],
    answer: [0, 2],
    explain:
      "ASR(음성→텍스트) 단계에서 발생한 인식 오류와 발화 자체의 의미론적 모호성이 결합된 HAC 노이즈.",
  },
];

// ----- 드릴 C: Impact-Level 판정 -----
interface QuizC {
  situation: string;
  level: number;
  explain: string;
}

const QUIZZES_C: QuizC[] = [
  {
    situation:
      "광고 입찰 AI 두 개가 밀리초 단위로 입찰가 1원씩 조정하는 메시지.",
    level: 1,
    explain:
      "단일 결정의 영향이 미미하고 되돌림도 필요 없어 자동 통과 수준.",
  },
  {
    situation: "뉴스 요약 AI가 다른 추천 AI에게 인기 토픽 3건을 전달하는 메시지.",
    level: 2,
    explain: "영향 범위가 제한적이며 되돌릴 수 있는 저 영향 통신.",
  },
  {
    situation:
      "이상 트래픽 탐지 AI가 방화벽 AI에게 특정 IP 대역 임시 차단을 요청.",
    level: 3,
    explain: "사후 알림으로 충분. 오판 시 되돌릴 수 있으나 서비스에 일시 영향.",
  },
  {
    situation:
      "신용 평가 AI가 대출 심사 AI에게 대출 승인 거부 결정을 전달.",
    level: 4,
    explain: "개인의 금융 결정에 직접 영향을 주며 되돌림이 어려워 인간 승인 필요.",
  },
  {
    situation:
      "약물 추천 AI가 투약 스케줄러 AI에게 항암제 용량 변경을 지시.",
    level: 5,
    explain:
      "되돌릴 수 없고 생명과 직결되는 치명적 결정. 반드시 인간 사전 승인 필요.",
  },
];

// ----- 드릴 D: HAI 메커니즘 ↔ 프로토콜 기능 매칭 -----
interface QuizD {
  mechanism: string;
  options: string[];
  answer: number;
  explain: string;
}

const QUIZZES_D: QuizD[] = [
  {
    mechanism: "AI 페이로드 외부에 Intent-Summary 등 메타데이터 부착",
    options: ["캡슐화", "흐름제어", "다중화", "라우팅"],
    answer: 0,
    explain:
      "각 프로토콜의 데이터 블록에 제어 정보를 붙이는 것은 1강 '캡슐화' 기능의 정의.",
  },
  {
    mechanism: "Impact-Level 4~5 시 통신 일시 정지 후 인간 승인 대기",
    options: ["오류제어", "흐름제어", "단편화", "주소 설정"],
    answer: 1,
    explain:
      "수신 측(인간 감독자)의 처리 능력을 초과하지 않도록 조정 → 흐름제어 원리.",
  },
  {
    mechanism: "Session-ID 체인으로 AI 간 대화 순서 보존",
    options: ["순서 결정", "우선순위", "동기화", "암호화"],
    answer: 0,
    explain:
      "데이터 단위의 송·수신 순서를 보장하는 것은 '순서 결정(sequencing)' 기능.",
  },
  {
    mechanism: "Audit-Hash(SHA-256)로 헤더·페이로드 무결성 검증",
    options: ["다중화", "오류제어", "동기화", "전송 시스템 활용"],
    answer: 1,
    explain:
      "검출 부호를 붙여 전송 오류·변조를 탐지하는 것은 '오류제어(error control)' 영역.",
  },
  {
    mechanism: "Impact-Level에 따라 인간 개입 여부 자동 판정",
    options: ["우선순위 전송 서비스", "캡슐화", "다중화", "단편화"],
    answer: 0,
    explain:
      "중요도에 따라 처리 우선순위를 달리 적용하는 것은 '전송 서비스'의 우선순위 기능.",
  },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function NetworkRandomDrills() {
  const [drill, setDrill] = useState<DrillKey>("A");

  // A
  const [scenA, setScenA] = useState(SCENARIOS_A[0]);
  const [selA, setSelA] = useState<Record<string, boolean>>({});
  const [showA, setShowA] = useState(false);

  // B
  const [quizB, setQuizB] = useState(QUIZZES_B[0]);
  const [selB, setSelB] = useState<Record<number, boolean>>({});
  const [showB, setShowB] = useState(false);

  // C
  const [quizC, setQuizC] = useState(QUIZZES_C[0]);
  const [guessC, setGuessC] = useState<number | null>(null);

  // D
  const [quizD, setQuizD] = useState(QUIZZES_D[0]);
  const [guessD, setGuessD] = useState<number | null>(null);

  const newA = () => {
    setScenA(pick(SCENARIOS_A));
    setSelA({});
    setShowA(false);
  };
  const newB = () => {
    setQuizB(pick(QUIZZES_B));
    setSelB({});
    setShowB(false);
  };
  const newC = () => {
    setQuizC(pick(QUIZZES_C));
    setGuessC(null);
  };
  const newD = () => {
    setQuizD(pick(QUIZZES_D));
    setGuessD(null);
  };

  return (
    <section>
      <SectionTitle
        title="13. 무작위 드릴"
        subtitle="Shannon-Weaver 식별 · HAC 노이즈 · Impact-Level · 프로토콜 매칭 4종"
      />

      <div className="mb-3 flex flex-wrap gap-1 rounded-full bg-gray-100 p-1 dark:bg-gray-800">
        {(["A", "B", "C", "D"] as DrillKey[]).map((k) => (
          <button
            key={k}
            onClick={() => setDrill(k)}
            className={`flex-1 min-w-[110px] rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              drill === k
                ? "bg-orange-500 text-white shadow"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-300"
            }`}
          >
            드릴 {k}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border-2 border-orange-200 bg-white p-5 dark:border-orange-900/50 dark:bg-gray-900">
        <AnimatePresence mode="wait">
          {/* 드릴 A */}
          {drill === "A" && (
            <motion.div
              key="A"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-bold">
                  <Dices size={14} className="mr-1 inline text-orange-500" />
                  Shannon-Weaver 요소 식별 (5개 이상)
                </div>
                <button
                  onClick={newA}
                  className="rounded bg-orange-500 px-2 py-1 text-[10px] font-semibold text-white hover:bg-orange-600"
                >
                  <RefreshCw size={10} className="mr-0.5 inline" /> 새 시나리오
                </button>
              </div>
              <div className="mb-3 rounded-lg bg-orange-50 p-3 text-xs text-orange-900 dark:bg-orange-950/30 dark:text-orange-200">
                {scenA.text}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {SW_ELEMENTS.map((e) => {
                  const on = !!selA[e];
                  return (
                    <button
                      key={e}
                      onClick={() => setSelA((p) => ({ ...p, [e]: !p[e] }))}
                      className={`rounded-lg border-2 px-2 py-1.5 text-[11px] font-semibold ${
                        on
                          ? "border-orange-500 bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-200"
                          : "border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-800"
                      }`}
                    >
                      {e}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setShowA(true)}
                className="mt-3 w-full rounded-lg bg-orange-500 py-2 text-sm font-bold text-white hover:bg-orange-600"
              >
                확인
              </button>
              {showA && (
                <div className="mt-3 rounded-lg bg-green-50 p-3 text-[11px] text-green-900 dark:bg-green-950/30 dark:text-green-200">
                  정답: {scenA.present.join(" · ")} 모두 포함.{" "}
                  <strong>
                    선택한 수: {Object.values(selA).filter(Boolean).length} /{" "}
                    {scenA.present.length}
                  </strong>
                  . 5개 이상 식별하면 통과.
                </div>
              )}
            </motion.div>
          )}

          {/* 드릴 B */}
          {drill === "B" && (
            <motion.div
              key="B"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-bold">
                  <Dices size={14} className="mr-1 inline text-orange-500" />
                  HAC 노이즈 2개 고르기
                </div>
                <button
                  onClick={newB}
                  className="rounded bg-orange-500 px-2 py-1 text-[10px] font-semibold text-white hover:bg-orange-600"
                >
                  <RefreshCw size={10} className="mr-0.5 inline" /> 새 상황
                </button>
              </div>
              <div className="mb-3 rounded-lg bg-orange-50 p-3 text-xs text-orange-900 dark:bg-orange-950/30 dark:text-orange-200">
                {quizB.situation}
              </div>
              <div className="space-y-1.5">
                {quizB.options.map((o, i) => {
                  const on = !!selB[i];
                  const correct = showB && quizB.answer.includes(i);
                  const wrong = showB && on && !quizB.answer.includes(i);
                  return (
                    <button
                      key={i}
                      onClick={() => setSelB((p) => ({ ...p, [i]: !p[i] }))}
                      className={`flex w-full items-center gap-2 rounded-lg border-2 p-2 text-left text-[11px] transition-all ${
                        correct
                          ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                          : wrong
                            ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                            : on
                              ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30"
                              : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                      }`}
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold dark:bg-gray-700">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {o}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setShowB(true)}
                className="mt-3 w-full rounded-lg bg-orange-500 py-2 text-sm font-bold text-white hover:bg-orange-600"
              >
                확인
              </button>
              {showB && (
                <div className="mt-3 rounded-lg bg-green-50 p-3 text-[11px] text-green-900 dark:bg-green-950/30 dark:text-green-200">
                  {quizB.explain}
                </div>
              )}
            </motion.div>
          )}

          {/* 드릴 C */}
          {drill === "C" && (
            <motion.div
              key="C"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-bold">
                  <Dices size={14} className="mr-1 inline text-orange-500" />
                  Impact-Level 판정 (1~5)
                </div>
                <button
                  onClick={newC}
                  className="rounded bg-orange-500 px-2 py-1 text-[10px] font-semibold text-white hover:bg-orange-600"
                >
                  <RefreshCw size={10} className="mr-0.5 inline" /> 새 시나리오
                </button>
              </div>
              <div className="mb-3 rounded-lg bg-orange-50 p-3 text-xs text-orange-900 dark:bg-orange-950/30 dark:text-orange-200">
                {quizC.situation}
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => {
                  const correct = guessC !== null && n === quizC.level;
                  const wrong =
                    guessC !== null && guessC === n && n !== quizC.level;
                  return (
                    <button
                      key={n}
                      onClick={() => setGuessC(n)}
                      className={`flex-1 rounded-lg border-2 py-3 text-lg font-bold transition-all ${
                        correct
                          ? "border-green-500 bg-green-100 text-green-800 dark:bg-green-950/30"
                          : wrong
                            ? "border-red-500 bg-red-100 text-red-800 dark:bg-red-950/30"
                            : guessC === n
                              ? "border-orange-500 bg-orange-100 text-orange-800 dark:bg-orange-950/30"
                              : "border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-800"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
              {guessC !== null && (
                <div
                  className={`mt-3 rounded-lg p-3 text-[11px] ${
                    guessC === quizC.level
                      ? "bg-green-50 text-green-900 dark:bg-green-950/30 dark:text-green-200"
                      : "bg-red-50 text-red-900 dark:bg-red-950/30 dark:text-red-200"
                  }`}
                >
                  <strong>정답: Level {quizC.level}.</strong> {quizC.explain}
                </div>
              )}
            </motion.div>
          )}

          {/* 드릴 D */}
          {drill === "D" && (
            <motion.div
              key="D"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-bold">
                  <Dices size={14} className="mr-1 inline text-orange-500" />
                  HAI 메커니즘 ↔ 프로토콜 기능
                </div>
                <button
                  onClick={newD}
                  className="rounded bg-orange-500 px-2 py-1 text-[10px] font-semibold text-white hover:bg-orange-600"
                >
                  <RefreshCw size={10} className="mr-0.5 inline" /> 새 문제
                </button>
              </div>
              <div className="mb-3 rounded-lg bg-orange-50 p-3 text-xs text-orange-900 dark:bg-orange-950/30 dark:text-orange-200">
                <strong>메커니즘:</strong> {quizD.mechanism}
              </div>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {quizD.options.map((o, i) => {
                  const correct = guessD !== null && i === quizD.answer;
                  const wrong =
                    guessD !== null && guessD === i && i !== quizD.answer;
                  return (
                    <button
                      key={i}
                      onClick={() => setGuessD(i)}
                      className={`rounded-lg border-2 p-2 text-[11px] font-semibold transition-all ${
                        correct
                          ? "border-green-500 bg-green-100 text-green-800 dark:bg-green-950/30"
                          : wrong
                            ? "border-red-500 bg-red-100 text-red-800 dark:bg-red-950/30"
                            : guessD === i
                              ? "border-orange-500 bg-orange-100 text-orange-800 dark:bg-orange-950/30"
                              : "border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-800"
                      }`}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
              {guessD !== null && (
                <div
                  className={`mt-3 rounded-lg p-3 text-[11px] ${
                    guessD === quizD.answer
                      ? "bg-green-50 text-green-900 dark:bg-green-950/30 dark:text-green-200"
                      : "bg-red-50 text-red-900 dark:bg-red-950/30 dark:text-red-200"
                  }`}
                >
                  <strong>정답: {quizD.options[quizD.answer]}.</strong>{" "}
                  {quizD.explain}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
