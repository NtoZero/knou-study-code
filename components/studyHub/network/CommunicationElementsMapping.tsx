"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftRight } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import NetworkTerm from "./NetworkTerm";

type Mode = "traditional" | "hac";

interface Row {
  element: string;
  icon: string;
  traditional: { main: string; examples: string[] };
  hac: { main: string; examples: string[] };
}

const ROWS: Row[] = [
  {
    element: "송신자 · 수신자",
    icon: "⇄",
    traditional: {
      main: "사람 ↔ 사람, 또는 사람 ↔ 시스템",
      examples: [
        "전화 통화 · 이메일 송신자/수신자",
        "클라이언트 ↔ 서버",
        "IoT 센서 ↔ 수집 서버",
      ],
    },
    hac: {
      main: "인간과 LLM(또는 AI 에이전트)이 번갈아 송·수신",
      examples: [
        "사용자(질문) ↔ ChatGPT(답변)",
        "센서/환경(컨텍스트) → AI(추론)",
        "AI 제안 → 인간 승인",
      ],
    },
  },
  {
    element: "인코더 · 디코더",
    icon: "{ }",
    traditional: {
      main: "비트/기호 수준의 변조·복조 (모뎀, 음성 코덱)",
      examples: ["PCM · MP3 · H.264", "QAM 변조", "ASCII·UTF-8 인코딩"],
    },
    hac: {
      main: "토크나이저·임베딩·멀티모달 인코더/디코더",
      examples: [
        "Text → Token ID → Embedding 벡터",
        "Image → Vision Encoder (CLIP, ViT)",
        "Embedding → 자연어 생성",
      ],
    },
  },
  {
    element: "채널",
    icon: "~",
    traditional: {
      main: "물리 매체 (유선·무선·광섬유)",
      examples: ["Ethernet, Wi-Fi, 5G", "광섬유, 구리선", "공기(음성)"],
    },
    hac: {
      main: "자연어·멀티모달 스트림 + 네트워크 API",
      examples: [
        "HTTPS REST API, WebSocket 스트리밍",
        "자연어 텍스트 · 음성 · 이미지",
        "함수 호출 시그니처(tool call)",
      ],
    },
  },
  {
    element: "프로토콜",
    icon: "⚙",
    traditional: {
      main: "계층별 통신 규약 (물리~응용)",
      examples: ["TCP/IP, HTTP, SMTP", "3-way handshake", "흐름·오류·순서 제어"],
    },
    hac: {
      main: "대화 규약 · 프롬프트 구조 · 스키마",
      examples: [
        "System/User/Assistant 역할 프롬프트",
        "JSON Schema 응답, tool-calling 규격",
        "MCP · Function Calling API",
      ],
    },
  },
  {
    element: "노이즈",
    icon: "⚡",
    traditional: {
      main: "물리적 · 전기적 잡음",
      examples: ["전자기 간섭, 열잡음", "패킷 손실, 지터", "감쇠, 왜곡"],
    },
    hac: {
      main: "의미적 · 인지적 잡음",
      examples: [
        "환각(hallucination), 오정보",
        "학습 데이터 편향(bias)",
        "모호한 프롬프트, 문맥 누락, 오해석",
      ],
    },
  },
  {
    element: "정보원 · 메시지",
    icon: "✉",
    traditional: {
      main: "이산/연속 데이터 (문자, 음성, 영상)",
      examples: ["텍스트 메시지", "음성 파형", "비디오 프레임"],
    },
    hac: {
      main: "의도(intent) · 컨텍스트 · 멀티모달 입력",
      examples: [
        "사용자 질문 + 대화 히스토리",
        "RAG 검색 결과 · 외부 문서",
        "이미지 + 캡션 + 메타데이터",
      ],
    },
  },
];

export default function CommunicationElementsMapping() {
  const [mode, setMode] = useState<Mode>("traditional");
  const [openRow, setOpenRow] = useState<string>(ROWS[0].element);

  return (
    <section>
      <SectionTitle
        title="2. 통신 요소 매핑: 전통 통신 ↔ HAC"
        subtitle="Shannon-Weaver 6요소가 HAC 문맥에서 어떻게 재정의되는지 탭으로 비교"
      />

      <div className="mb-4 flex items-center gap-2 rounded-full bg-gray-100 p-1 dark:bg-gray-800">
        {(["traditional", "hac"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              mode === m
                ? "bg-orange-500 text-white shadow"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            {m === "traditional" ? "전통 정보통신" : <NetworkTerm term="HAC" label="Human-AI Communication" />}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {ROWS.map((row) => {
          const content = mode === "traditional" ? row.traditional : row.hac;
          const open = openRow === row.element;
          return (
            <div
              key={row.element}
              className={`overflow-hidden rounded-xl border transition-all ${
                open
                  ? "border-orange-300 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/30"
                  : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
              }`}
            >
              <button
                onClick={() => setOpenRow(open ? "" : row.element)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-lg font-bold text-orange-600 dark:bg-orange-900/40">
                    {row.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{row.element}</div>
                    <div className="text-xs text-gray-500">{content.main}</div>
                  </div>
                </div>
                <ArrowLeftRight
                  size={16}
                  className={`transition-transform ${
                    open ? "text-orange-500" : "text-gray-300"
                  }`}
                />
              </button>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-orange-200 px-4 py-3 dark:border-orange-900/60">
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-orange-600">
                        {mode === "traditional" ? "전통 통신 예" : "HAC 예"}
                      </div>
                      <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                        {content.examples.map((ex) => (
                          <li key={ex} className="flex gap-2">
                            <span className="text-orange-500">▸</span>
                            <span>{ex}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border border-dashed border-orange-300 bg-orange-50/40 p-4 text-xs text-orange-900 dark:border-orange-800 dark:bg-orange-950/30 dark:text-orange-200">
        <strong>생각해보기</strong> — HAC에서는{" "}
        <NetworkTerm term="channel" label="채널" />과{" "}
        <NetworkTerm term="protocol" label="프로토콜" />의 경계가
        흐려지는 경향이 있음. 자연어 자체가 프로토콜이자 채널이 될 수 있기
        때문. 또한 <NetworkTerm term="encapsulation" label="캡슐화" />와{" "}
        <NetworkTerm term="noise" label="노이즈" />의 HAC 재해석이
        서술에서 핵심 차별화 포인트입니다.
      </div>
    </section>
  );
}
