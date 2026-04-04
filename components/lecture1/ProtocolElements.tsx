"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

const elements = [
  { name: "구문 (Syntax)", desc: "데이터 형식이나 신호 수준 등을 규정", icon: "{ }" },
  { name: "의미 (Semantic)", desc: "전송의 조정, 오류 관리를 위한 제어 정보를 규정", icon: "💡" },
  { name: "타이밍 (Timing)", desc: "전송속도 조절 및 전송순서 조정 등을 규정", icon: "⏱" },
];

const functions = [
  { name: "단편화", desc: "긴 데이터 블록을 크기가 똑같은 작은 블록으로 나누어 전송" },
  { name: "재합성", desc: "쪼개진 작은 데이터 블록을 재합성하여 원래의 메시지로 복원" },
  { name: "캡슐화", desc: "데이터 블록에 플래그, 주소, 제어 정보, 오류검출 부호 등을 부착" },
  { name: "연결제어", desc: "비연결 데이터 전송(데이터그램)과 연결 위주 데이터 전송(가상회선)을 위한 통신로 개설·유지·종결" },
  { name: "흐름제어", desc: "수신 측의 처리 능력 초과 방지를 위한 데이터 양이나 통신속도 조정" },
  { name: "오류제어", desc: "전송 중 발생 가능한 오류를 검출하고 정정" },
  { name: "순서 결정", desc: "송신 측이 보내는 데이터 단위 순서대로 수신 측에 전달" },
  { name: "주소 설정", desc: "발생지, 목적지 등의 주소를 명기하여 데이터를 정확하게 전달" },
  { name: "동기화", desc: "두 통신 객체의 상태(시작, 종류, 검사 등)를 일치시키는 기능" },
  { name: "다중화", desc: "하나의 통신로를 여러 개로 나누거나 여러 개의 회선을 하나로 변환" },
  { name: "전송 서비스", desc: "패리티 검사, 보안도, 서비스 등급, 우선순위 등 별도 추가 서비스 제공" },
];

export default function ProtocolElements() {
  const [activeFunc, setActiveFunc] = useState<number | null>(null);

  return (
    <section>
      <SectionTitle
        title="통신 프로토콜"
        subtitle="통신을 원하는 두 개체 간에 무엇을, 어떻게, 언제 통신할 것인지를 서로 약속한 규약"
      />

      <div className="grid gap-4 md:grid-cols-3">
        {elements.map((el) => (
          <div
            key={el.name}
            className="rounded-xl border border-gray-200 bg-white p-5 text-center dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="mb-2 text-2xl">{el.icon}</div>
            <div className="font-semibold">{el.name}</div>
            <div className="mt-1 text-sm text-gray-500">{el.desc}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 font-semibold">프로토콜의 주요 기능 (11가지)</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {functions.map((fn, i) => (
            <button
              key={fn.name}
              onClick={() => setActiveFunc(activeFunc === i ? null : i)}
              className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                activeFunc === i
                  ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30"
                  : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              }`}
            >
              <span className="font-medium">{fn.name}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeFunc !== null && (
            <motion.div
              key={activeFunc}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-4 rounded-lg bg-blue-50 p-4 text-sm dark:bg-blue-900/20"
            >
              <span className="font-semibold text-blue-700 dark:text-blue-300">
                {functions[activeFunc].name}:
              </span>{" "}
              <span className="text-gray-600 dark:text-gray-400">
                {functions[activeFunc].desc}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
