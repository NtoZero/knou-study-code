"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Eye, Cpu, Wifi } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import NetworkTerm from "./NetworkTerm";

type TypeKey = "text" | "multimodal" | "agent" | "embedded";
type DimKey = "direction" | "channel" | "noise" | "realtime";

interface HACType {
  key: TypeKey;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  summary: string;
  dataExchange: string[];
  channel: string;
  encoding: string;
  examples: string[];
  flow: string[];
  // 비교표 차원
  direction: string;
  noiseMain: string;
  realtimeLevel: string;
  syncMode: string;
}

const TYPES: HACType[] = [
  {
    key: "text",
    label: "텍스트 기반 인터랙션",
    icon: MessageSquare,
    summary:
      "사용자와 AI가 자연어 텍스트로 질문·응답을 주고받는 가장 기본적 HAC 유형.",
    dataExchange: [
      "UTF-8 텍스트 → 토크나이저 → 토큰 ID 시퀀스",
      "Attention 기반 추론 → 확률분포 샘플링",
      "토큰 → 텍스트 스트림(SSE, WebSocket)",
    ],
    channel: "HTTPS REST · Server-Sent Events · 자연어",
    encoding: "BPE/WordPiece 토큰 · 임베딩 벡터(예: 4096차원)",
    examples: ["ChatGPT 웹 대화", "Claude, Gemini 챗 인터페이스", "코드 생성 IDE 플러그인"],
    flow: [
      "사용자 입력",
      "토큰화 · 시스템 프롬프트 병합",
      "LLM 추론",
      "스트리밍 디코딩",
      "사용자 출력",
    ],
    direction: "반이중(Half-Duplex)",
    noiseMain: "프롬프트 모호성, 환각",
    realtimeLevel: "낮음",
    syncMode: "동기(요청-응답)",
  },
  {
    key: "multimodal",
    label: "멀티모달(시각·청각) 통신",
    icon: Eye,
    summary:
      "텍스트·이미지·음성·영상을 함께 입출력하는 유형. 모달리티 간 정렬이 핵심.",
    dataExchange: [
      "이미지 → Vision Encoder(ViT/CLIP) → 시각 토큰",
      "음성 → Mel-Spectrogram → 음성 인코더",
      "공통 임베딩 공간에서 텍스트 토큰과 정렬",
    ],
    channel: "WebRTC 스트리밍 · 바이너리 업로드(REST) · 실시간 음성",
    encoding: "이미지 패치 임베딩, 오디오 프레임, 크로스모달 어텐션",
    examples: [
      "Gemini Live · GPT-4o 음성 모드",
      "이미지 생성(DALL·E, Midjourney)",
      "캡셔닝 · VQA(Visual QA)",
    ],
    flow: [
      "다중 모달 입력",
      "각 인코더로 임베딩 변환",
      "융합(fusion) 어텐션",
      "텍스트/음성/이미지 디코더",
      "다중 모달 출력",
    ],
    direction: "전이중(Full-Duplex)",
    noiseMain: "모달 간 불일치, 인식 오류",
    realtimeLevel: "높음",
    syncMode: "동기(실시간 스트림)",
  },
  {
    key: "agent",
    label: "에이전트 기반 실행형",
    icon: Cpu,
    summary:
      "AI가 외부 도구(API·코드실행·검색)를 자율 호출하여 작업을 수행. 관찰-사고-행동 루프.",
    dataExchange: [
      "Tool 스키마(JSON Schema) 등록",
      "AI가 함수 호출 JSON 생성",
      "실행 결과 재주입 → 다음 추론",
    ],
    channel: "Function Calling API · MCP(Model Context Protocol) · 샌드박스",
    encoding: "구조화된 JSON, 도구 호출 시퀀스, 관찰 로그",
    examples: [
      "ReAct · AutoGPT · BabyAGI",
      "Claude Computer Use",
      "Cursor/Copilot Agents",
    ],
    flow: [
      "목표(goal) 입력",
      "Thought · Plan 생성",
      "Tool 호출(JSON)",
      "Observation 수신",
      "결과 보고 · 반복",
    ],
    direction: "비동기 다단계",
    noiseMain: "작업 분해 오류, 권한 초과",
    realtimeLevel: "중간",
    syncMode: "비동기(다단계)",
  },
  {
    key: "embedded",
    label: "임베디드 통신 (IoT-AI)",
    icon: Wifi,
    summary:
      "센서·웨어러블 등 IoT 장치가 인간 상태를 자동 수집해 AI에 전달. 암묵적 통신(implicit communication).",
    dataExchange: [
      "센서가 생체·환경 데이터를 수집(암묵적 입력)",
      "MQTT/CoAP 경량 프로토콜로 클라우드 AI 전송",
      "AI 분석 결과 → 푸시 알림 또는 장치 제어 명령",
    ],
    channel: "MQTT · CoAP · BLE · 저전력 WAN",
    encoding: "원시 센서 값 → 경량 프레임, 이진 직렬화",
    examples: [
      "스마트워치 건강 모니터링",
      "스마트홈 AI 비서 (환경 자동 조절)",
      "산업 IoT 이상 탐지 시스템",
    ],
    flow: [
      "센서 자동 수집(인간 개입 없음)",
      "경량 프로토콜 전송",
      "클라우드 AI 분석",
      "결정 생성",
      "디바이스 피드백/알림",
    ],
    direction: "단방향/반이중",
    noiseMain: "센서 오류, 해석 편향",
    realtimeLevel: "높음",
    syncMode: "비동기(푸시)",
  },
];

const DIMENSIONS: { key: DimKey; label: string }[] = [
  { key: "direction", label: "전송 방향" },
  { key: "channel", label: "채널" },
  { key: "noise", label: "주요 노이즈" },
  { key: "realtime", label: "실시간성" },
];

export default function HACTypesExplorer() {
  const [active, setActive] = useState<TypeKey>("text");
  const [playing, setPlaying] = useState(false);
  const [activeDim, setActiveDim] = useState<DimKey | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const current = TYPES.find((t) => t.key === active)!;

  return (
    <section>
      <SectionTitle
        title="4. HAC 유형 탐색"
        subtitle="텍스트 · 멀티모달 · 에이전트 · 임베디드 — 4가지 유형과 통신 특성 비교"
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TYPES.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => {
                setActive(t.key);
                setPlaying(false);
              }}
              className={`rounded-xl border p-4 text-left transition-all ${
                isActive
                  ? "border-orange-500 bg-orange-50 shadow dark:bg-orange-950/40"
                  : "border-gray-200 bg-white hover:border-orange-200 dark:border-gray-800 dark:bg-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                  }`}
                >
                  <Icon size={16} />
                </div>
                <div className="text-sm font-bold">{t.label}</div>
              </div>
              <p className="mt-2 text-xs text-gray-500">{t.summary}</p>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mt-5 rounded-2xl border border-orange-200 bg-white p-5 dark:border-orange-900/60 dark:bg-gray-900"
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <InfoBlock label="채널" value={current.channel} />
              <InfoBlock label="인코딩" value={current.encoding} />
              <div className="mt-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                  데이터 교환 방식
                </div>
                <ul className="mt-1 space-y-1 text-xs text-gray-700 dark:text-gray-300">
                  {current.dataExchange.map((d) => (
                    <li key={d} className="flex gap-2">
                      <span className="text-orange-500">▸</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                  대표 사례
                </div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {current.examples.map((e) => (
                    <span
                      key={e}
                      className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] text-orange-700 dark:bg-orange-950/60 dark:text-orange-300"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
              {/* 통신 특성 요약 */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-sky-50 p-2 dark:bg-sky-950/30">
                  <div className="text-[10px] font-bold text-sky-600">
                    <NetworkTerm term="halfDuplex" label="전송 방향" />
                  </div>
                  <div className="text-xs">{current.direction}</div>
                </div>
                <div className="rounded-lg bg-amber-50 p-2 dark:bg-amber-950/30">
                  <div className="text-[10px] font-bold text-amber-600">
                    <NetworkTerm term="synchronous" label="동기 방식" />
                  </div>
                  <div className="text-xs">{current.syncMode}</div>
                </div>
                <div className="rounded-lg bg-red-50 p-2 dark:bg-red-950/30">
                  <div className="text-[10px] font-bold text-red-600">
                    <NetworkTerm term="noise" label="주요 노이즈" />
                  </div>
                  <div className="text-xs">{current.noiseMain}</div>
                </div>
                <div className="rounded-lg bg-green-50 p-2 dark:bg-green-950/30">
                  <div className="text-[10px] font-bold text-green-600">실시간성</div>
                  <div className="text-xs">{current.realtimeLevel}</div>
                </div>
              </div>
            </div>

            {/* 메시지 흐름 애니메이션 */}
            <div className="rounded-xl border border-dashed border-orange-300 bg-orange-50/40 p-4 dark:border-orange-800 dark:bg-orange-950/20">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                  메시지 흐름
                </div>
                <button
                  onClick={() => setPlaying((v) => !v)}
                  className="rounded-full bg-orange-500 px-3 py-1 text-[11px] font-semibold text-white hover:bg-orange-600"
                >
                  {playing ? "■ 정지" : "▶ 재생"}
                </button>
              </div>
              <div className="space-y-2">
                {current.flow.map((step, i) => (
                  <motion.div
                    key={`${current.key}-${i}`}
                    initial={{ opacity: 0.3, x: -8 }}
                    animate={
                      playing
                        ? { opacity: [0.3, 1, 0.3], x: [-8, 0, 8] }
                        : { opacity: 1, x: 0 }
                    }
                    transition={
                      playing
                        ? {
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.35,
                          }
                        : { duration: 0.2 }
                    }
                    className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs shadow-sm dark:bg-gray-900"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 4유형 비교표 */}
      <div className="mt-6">
        <button
          onClick={() => setShowCompare((v) => !v)}
          className="mb-3 flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-xs font-semibold text-orange-700 transition hover:bg-orange-200 dark:bg-orange-950/40 dark:text-orange-300"
        >
          {showCompare ? "▲ 비교표 닫기" : "▼ 4유형 전체 비교표"}
        </button>
        <AnimatePresence>
          {showCompare && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {/* 차원 토글 버튼 */}
              <div className="mb-3 flex flex-wrap gap-1.5">
                {DIMENSIONS.map((d) => (
                  <button
                    key={d.key}
                    onClick={() => setActiveDim(activeDim === d.key ? null : d.key)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                      activeDim === d.key
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-orange-100 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {d.label} 강조
                  </button>
                ))}
              </div>
              <div className="overflow-x-auto rounded-xl border border-orange-200 dark:border-orange-900/60">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-orange-50 dark:bg-orange-950/40">
                      <th className="px-3 py-2 text-left font-bold text-orange-700">유형</th>
                      <th className={`px-3 py-2 text-left font-bold ${activeDim === "direction" ? "bg-orange-200 dark:bg-orange-800/60 text-orange-800" : "text-gray-600 dark:text-gray-300"}`}>
                        <NetworkTerm term="halfDuplex" label="전송 방향" tooltipSide="bottom" />
                      </th>
                      <th className={`px-3 py-2 text-left font-bold ${activeDim === "channel" ? "bg-orange-200 dark:bg-orange-800/60 text-orange-800" : "text-gray-600 dark:text-gray-300"}`}>
                        <NetworkTerm term="channel" label="채널" tooltipSide="bottom" />
                      </th>
                      <th className={`px-3 py-2 text-left font-bold ${activeDim === "noise" ? "bg-orange-200 dark:bg-orange-800/60 text-orange-800" : "text-gray-600 dark:text-gray-300"}`}>
                        <NetworkTerm term="noise" label="주요 노이즈" tooltipSide="bottom" />
                      </th>
                      <th className={`px-3 py-2 text-left font-bold ${activeDim === "realtime" ? "bg-orange-200 dark:bg-orange-800/60 text-orange-800" : "text-gray-600 dark:text-gray-300"}`}>
                        실시간성
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {TYPES.map((t, idx) => (
                      <tr
                        key={t.key}
                        className={`border-t border-gray-100 dark:border-gray-800 ${
                          active === t.key
                            ? "bg-orange-50/60 dark:bg-orange-950/20"
                            : idx % 2 === 0
                              ? "bg-white dark:bg-gray-900"
                              : "bg-gray-50/50 dark:bg-gray-900/60"
                        }`}
                      >
                        <td className="px-3 py-2 font-semibold">{t.label}</td>
                        <td className={`px-3 py-2 ${activeDim === "direction" ? "bg-orange-100/60 dark:bg-orange-900/30 font-semibold" : ""}`}>
                          {t.direction}
                        </td>
                        <td className={`px-3 py-2 ${activeDim === "channel" ? "bg-orange-100/60 dark:bg-orange-900/30 font-semibold" : ""}`}>
                          {t.channel}
                        </td>
                        <td className={`px-3 py-2 ${activeDim === "noise" ? "bg-orange-100/60 dark:bg-orange-900/30 font-semibold" : ""}`}>
                          {t.noiseMain}
                        </td>
                        <td className={`px-3 py-2 ${activeDim === "realtime" ? "bg-orange-100/60 dark:bg-orange-900/30 font-semibold" : ""}`}>
                          {t.realtimeLevel}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 rounded-lg border border-dashed border-orange-300 bg-orange-50/30 p-3 text-xs text-orange-800 dark:border-orange-800 dark:bg-orange-950/20 dark:text-orange-300">
                <strong>서술 팁:</strong> 유형 분류는 브랜드·서비스명 나열이 아닌
                <strong> 전송 방향 · 동기 방식 · 채널 · 주요 노이즈</strong>의 통신 특성 축으로
                해야 루브릭 B1(분류 다양성) · B2(데이터 교환 방식) 고점 가능.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-1 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
      <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
        {label}
      </div>
      <div className="text-xs text-gray-700 dark:text-gray-300">{value}</div>
    </div>
  );
}
