"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowLeftRight } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import NetworkTerm from "./NetworkTerm";

/* ---------------------------------------------------------------
 * SWMappingBuilder — Shannon-Weaver 6요소를 "먼저 생각해보고"
 * 세 가지 맥락(전통 통신 / 인간→AI / AI→인간)에 매핑해보는 학습 도구.
 *
 * 드래그앤드롭은 학습 흐름을 방해하므로 탭·토글 방식 채택.
 * ------------------------------------------------------------- */

type ContextKey = "traditional" | "h2a" | "a2h";

interface ElementMapping {
  key: string;
  termKey: string; // NetworkTerm 용어 키
  label: string;
  hint: string; // 학습자가 먼저 생각해볼 때 주는 힌트
  traditional: string;
  h2a: string;
  a2h: string;
}

const ELEMENTS: ElementMapping[] = [
  {
    key: "source",
    termKey: "source",
    label: "정보원",
    hint: "누가 '이 대화'의 의미를 처음 만드는가?",
    traditional: "인간 송신자 — 예: 전화를 거는 사람이 전하고 싶은 말",
    h2a: "인간 사용자 — 질문·지시·문서 업로드로 의도를 생성",
    a2h: "AI 모델 — 내부 추론 엔진이 응답의 근본 내용을 생성",
  },
  {
    key: "transmitter",
    termKey: "transmitter",
    label: "송신기",
    hint: "메시지를 '채널이 받아들이는 형태'로 바꾸는 단계는?",
    traditional: "전화기, 마이크 — 음성을 전기 신호로 변조",
    h2a: "키보드·마이크·카메라 + 토크나이저 — 자연어를 토큰 ID로 변환",
    a2h: "언어 생성 모듈(디코더) — 내부 벡터를 자연어 토큰으로 변환",
  },
  {
    key: "channel",
    termKey: "channel",
    label: "채널",
    hint: "신호가 실제로 '이동'하는 물리·논리 경로는?",
    traditional: "전화선·전파 — 물리 매체 그 자체",
    h2a: "HTTPS·WebSocket·gRPC — API 통신 경로",
    a2h: "동일한 API 응답 경로 — 방향만 반대",
  },
  {
    key: "receiver",
    termKey: "receiver",
    label: "수신기",
    hint: "채널 신호를 '다시 읽을 수 있는 형태'로 푸는 단계는?",
    traditional: "전화기 스피커 — 전기 신호를 음파로 복조",
    h2a: "토크나이저 + 임베딩 변환기 — AI 전처리",
    a2h: "렌더링 엔진 — 텍스트·음성·이미지 출력 스택",
  },
  {
    key: "destination",
    termKey: "destination",
    label: "목적지",
    hint: "최종적으로 '이해'하는 주체는 누구인가?",
    traditional: "인간 수신자",
    h2a: "AI 모델의 추론 엔진",
    a2h: "인간 사용자",
  },
  {
    key: "noise",
    termKey: "noise",
    label: "노이즈",
    hint: "무엇이 메시지의 의미를 '망가뜨릴 수 있는가'?",
    traditional: "전기적 잡음·혼선 — 물리적 간섭",
    h2a: "프롬프트 모호성, 컨텍스트 유실, 토큰 제한 — 의미론적 노이즈",
    a2h: "환각(hallucination), 편향된 표현, 정보 과부하 — 의미론적 노이즈",
  },
];

const CTX: { key: ContextKey; label: string; color: string }[] = [
  { key: "traditional", label: "기존 통신 (인간↔인간)", color: "bg-gray-500" },
  { key: "h2a", label: "HAC · 인간 → AI", color: "bg-orange-500" },
  { key: "a2h", label: "HAC · AI → 인간", color: "bg-pink-500" },
];

export default function SWMappingBuilder() {
  const [ctx, setCtx] = useState<ContextKey>("traditional");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const toggle = (k: string) =>
    setRevealed((p) => ({ ...p, [k]: !p[k] }));
  const revealAll = () => {
    const all: Record<string, boolean> = {};
    ELEMENTS.forEach((e) => (all[e.key] = true));
    setRevealed(all);
  };
  const hideAll = () => setRevealed({});

  const answerOf = (e: ElementMapping) =>
    ctx === "traditional" ? e.traditional : ctx === "h2a" ? e.h2a : e.a2h;

  return (
    <section>
      <SectionTitle
        title="4. Shannon-Weaver 매핑 빌더"
        subtitle="각 요소가 세 맥락에서 무엇에 해당하는지 먼저 머릿속으로 떠올린 뒤 확인"
      />

      <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-pink-50 p-5 dark:border-orange-900/50 dark:from-orange-950/30 dark:to-pink-950/20">
        {/* 컨텍스트 탭 */}
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-full bg-white/70 p-1 dark:bg-gray-900/60">
          {CTX.map((c) => (
            <button
              key={c.key}
              onClick={() => {
                setCtx(c.key);
                setRevealed({});
              }}
              className={`flex-1 min-w-[130px] rounded-full px-3 py-2 text-xs font-semibold transition-all ${
                ctx === c.key
                  ? `${c.color} text-white shadow`
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            각 요소의 <strong>힌트</strong>만 먼저 읽고 머릿속으로 답해본 뒤
            카드를 클릭해 정답을 확인하세요.
          </p>
          <div className="flex gap-1">
            <button
              onClick={revealAll}
              className="rounded bg-orange-500 px-2 py-1 text-[10px] font-semibold text-white hover:bg-orange-600"
            >
              <Eye size={10} className="mr-0.5 inline" /> 전부 공개
            </button>
            <button
              onClick={hideAll}
              className="rounded bg-gray-300 px-2 py-1 text-[10px] font-semibold text-gray-700 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200"
            >
              <EyeOff size={10} className="mr-0.5 inline" /> 전부 숨김
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {ELEMENTS.map((el) => {
            const open = !!revealed[el.key];
            return (
              <motion.button
                key={el.key}
                onClick={() => toggle(el.key)}
                whileTap={{ scale: 0.98 }}
                className={`rounded-xl border-2 p-3 text-left transition-all ${
                  open
                    ? "border-orange-400 bg-white dark:bg-gray-900"
                    : "border-dashed border-orange-300 bg-white/60 hover:border-orange-400 dark:bg-gray-900/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold">
                    <NetworkTerm term={el.termKey} label={el.label} />
                  </div>
                  <ArrowLeftRight
                    size={14}
                    className={open ? "text-orange-500" : "text-gray-300"}
                  />
                </div>
                <div className="mt-1 text-[11px] italic text-gray-500">
                  힌트: {el.hint}
                </div>
                <AnimatePresence mode="wait">
                  {open ? (
                    <motion.div
                      key="answer"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="mt-2 rounded-md bg-orange-50 px-2 py-1.5 text-[11px] leading-relaxed text-orange-900 dark:bg-orange-950/40 dark:text-orange-100"
                    >
                      {answerOf(el)}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="prompt"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-2 text-[10px] font-semibold text-orange-500"
                    >
                      ▸ 클릭해서 이 맥락의 매핑 확인
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border border-dashed border-orange-400 bg-white/70 p-3 text-[11px] text-orange-900 dark:bg-gray-900/40 dark:text-orange-200">
          <strong>팁 — </strong> 세 컨텍스트를 모두 전환해보면 HAC가 기존 통신과
          달리 <strong>인간→AI</strong>와 <strong>AI→인간</strong>에서 송·수신기의
          역할이 <em>비대칭</em>으로 달라지는 것을 관찰할 수 있음. 이것이 과제
          2.4절의 '비대칭적 인코딩/디코딩 구조' 근거.
        </div>
      </div>
    </section>
  );
}
