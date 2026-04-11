"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Info } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

interface Layer {
  num: number;
  name: string;
  eng: string;
  reason: string;
  summary: string;
  isRelay: boolean;
  color: string;
}

const layers: Layer[] = [
  {
    num: 7,
    name: "응용 계층",
    eng: "Application",
    reason: "응용 프로그램을 위한 프로토콜을 함께 관리할 필요가 있음.",
    summary: "이메일·파일전송·웹 등 사용자 응용 프로그램이 직접 사용하는 서비스.",
    isRelay: false,
    color: "bg-red-500",
  },
  {
    num: 6,
    name: "표현 계층",
    eng: "Presentation",
    reason: "응용 프로그램의 구조화된 데이터를 표현하고 조정하는 기능이 필요함.",
    summary: "구문(syntax) 변환·암호화·압축 등 데이터 표현 형식을 통일.",
    isRelay: false,
    color: "bg-orange-500",
  },
  {
    num: 5,
    name: "세션 계층",
    eng: "Session",
    reason: "대화를 조직하고 동기화하거나 데이터 교환을 관리할 필요가 있음.",
    summary: "대화(session) 설정·유지·종결, 동기점 삽입 및 교환 관리.",
    isRelay: false,
    color: "bg-yellow-500",
  },
  {
    num: 4,
    name: "전송 계층",
    eng: "Transport",
    reason: "발신지 시스템에서 목적지 시스템까지의 신뢰성 있는 데이터 이동을 제어할 필요가 있음.",
    summary: "종단(end-to-end) 간 신뢰성 있는 전송. 흐름·오류 제어 수행.",
    isRelay: false,
    color: "bg-green-500",
  },
  {
    num: 3,
    name: "네트워크 계층",
    eng: "Network",
    reason: "전송 주체(송신자, 수신자) 사이에 중간 노드가 있는 경우에도 전송 주체 간의 연결 통로(네트워크 연결)를 제공하여야 함.",
    summary: "중간 노드(라우터)를 통한 경로 설정 및 패킷 중계.",
    isRelay: true,
    color: "bg-teal-500",
  },
  {
    num: 2,
    name: "데이터링크 계층",
    eng: "Data Link",
    reason: "전화회선, 광섬유 등의 물리적 통신 매체를 사용할 경우에 서로 다른 데이터링크 제어 절차가 필요함.",
    summary: "인접 노드 간 프레임 전송·오류제어·흐름제어.",
    isRelay: true,
    color: "bg-blue-500",
  },
  {
    num: 1,
    name: "물리 계층",
    eng: "Physical",
    reason: "종단 간을 연결하려면 다양한 물리적 매체(동축, 광섬유, 무선 등)를 사용하는 구조가 필요함.",
    summary: "비트 단위 전송, 기계적·전기적·절차적 특성 정의.",
    isRelay: true,
    color: "bg-purple-500",
  },
];

export default function OSI7LayerInteractive() {
  const [selected, setSelected] = useState<number | null>(4);
  const [showRelay, setShowRelay] = useState(false);
  const [showMailMetaphor, setShowMailMetaphor] = useState(false);

  return (
    <section>
      <SectionTitle
        title="OSI 7계층 — 각 계층이 필요한 이유"
        subtitle="ISO 7498(1983)로 제정된 개방형 시스템 상호접속 참조 모델. 각 계층을 클릭하면 '왜 그 계층이 필요한지' 확인할 수 있습니다."
      />

      {/* Controls */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setShowRelay(!showRelay)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            showRelay
              ? "bg-lime-500 text-white"
              : "border border-gray-300 bg-white text-gray-600 hover:border-lime-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
          }`}
        >
          중계 개방 시스템 {showRelay ? "숨기기" : "표시"}
        </button>
        <button
          onClick={() => setShowMailMetaphor(!showMailMetaphor)}
          className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-lime-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          <Mail size={12} /> 우편 시스템 비유
        </button>
      </div>

      <AnimatePresence>
        {showMailMetaphor && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="rounded-lg border border-lime-200 bg-lime-50 p-4 text-xs text-gray-700 dark:border-lime-900 dark:bg-lime-950/30 dark:text-gray-300">
              <div className="mb-1 flex items-center gap-1 font-bold text-lime-700 dark:text-lime-300">
                <Info size={12} /> 우편 시스템 비유
              </div>
              편지를 보낼 때 발신자는 우편함·우체국·수송수단(트럭·비행기·배) 등 세부 처리 단계를 몰라도,
              각 단계가 <b>표준화된 인터페이스</b>로 연결되어 있기 때문에 수신자에게 전달 가능. OSI 모델도
              이처럼 계층별로 역할을 분리하여 <b>이기종 간 통신</b>을 실현.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`grid gap-6 ${
          showRelay ? "md:grid-cols-[1fr_auto_1fr_auto_1fr]" : "md:grid-cols-2"
        }`}
      >
        {/* End system A */}
        <div>
          <div className="mb-2 text-center text-xs font-semibold text-gray-500">
            개방 시스템 A
          </div>
          <div className="space-y-1">
            {layers.map((layer) => {
              const isSel = selected === layer.num;
              return (
                <button
                  key={`a-${layer.num}`}
                  onClick={() => setSelected(isSel ? null : layer.num)}
                  className={`w-full rounded-md ${layer.color} px-3 py-2 text-left text-xs text-white transition-all ${
                    isSel ? "ring-2 ring-offset-2 ring-lime-500 dark:ring-offset-gray-950" : "hover:opacity-90"
                  }`}
                >
                  <span className="font-bold">L{layer.num}</span> · {layer.name}
                  <span className="ml-1 text-white/70">({layer.eng})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Arrow 1 */}
        {showRelay && (
          <div className="hidden items-center md:flex">
            <div className="text-xs text-gray-400">⇔</div>
          </div>
        )}

        {/* Relay open system */}
        {showRelay && (
          <div>
            <div className="mb-2 text-center text-xs font-semibold text-gray-500">
              중계 개방 시스템
              <br />
              <span className="text-[10px] text-gray-400">(라우터 등)</span>
            </div>
            <div className="space-y-1">
              {layers
                .filter((l) => l.isRelay)
                .map((layer) => (
                  <div
                    key={`r-${layer.num}`}
                    className={`rounded-md ${layer.color} px-3 py-2 text-left text-xs text-white`}
                  >
                    <span className="font-bold">L{layer.num}</span> · {layer.name}
                  </div>
                ))}
              <div className="rounded-md border border-dashed border-gray-300 px-3 py-1.5 text-center text-[10px] text-gray-400 dark:border-gray-700">
                L4~L7 없음
              </div>
            </div>
            <p className="mt-2 text-center text-[10px] text-gray-500">
              하위 3계층만 필요
            </p>
          </div>
        )}

        {/* Arrow 2 */}
        {showRelay && (
          <div className="hidden items-center md:flex">
            <div className="text-xs text-gray-400">⇔</div>
          </div>
        )}

        {/* End system B */}
        <div>
          <div className="mb-2 text-center text-xs font-semibold text-gray-500">
            개방 시스템 B
          </div>
          <div className="space-y-1">
            {layers.map((layer) => {
              const isSel = selected === layer.num;
              return (
                <button
                  key={`b-${layer.num}`}
                  onClick={() => setSelected(isSel ? null : layer.num)}
                  className={`w-full rounded-md ${layer.color} px-3 py-2 text-left text-xs text-white transition-all ${
                    isSel ? "ring-2 ring-offset-2 ring-lime-500 dark:ring-offset-gray-950" : "hover:opacity-90"
                  }`}
                >
                  <span className="font-bold">L{layer.num}</span> · {layer.name}
                  <span className="ml-1 text-white/70">({layer.eng})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reason detail */}
      <AnimatePresence mode="wait">
        {selected !== null && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-6 rounded-xl border border-lime-200 bg-lime-50 p-5 dark:border-lime-900 dark:bg-lime-950/30"
          >
            {(() => {
              const l = layers.find((x) => x.num === selected)!;
              return (
                <>
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full ${l.color} text-xs font-bold text-white`}
                    >
                      {l.num}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {l.name}
                    </span>
                    <span className="text-xs text-gray-500">({l.eng})</span>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">필요한 이유</div>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{l.reason}</p>
                  <div className="mt-3 rounded-md bg-white p-3 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-400">
                    <b>요약</b> — {l.summary}
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 text-[11px] text-gray-500">
        * 중계 개방 시스템(relay open system)은 두 end system 사이에 위치하며, <b>물리·데이터링크·네트워크 계층(하위 3계층)</b>까지만 필요함. 상위 4계층(전송~응용)은 end system 간에만 의미가 있음.
      </div>
    </section>
  );
}
