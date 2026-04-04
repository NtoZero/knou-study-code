"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Slot {
  name: string;
  value: string;
  isDefault?: boolean;
  inherited?: boolean;
  inheritedFrom?: string;
}

interface Frame {
  id: string;
  name: string;
  relation: string;
  relationTarget: string;
  slots: Slot[];
  color: string;
  bgColor: string;
}

const frames: Frame[] = [
  {
    id: "mammal",
    name: "포유류",
    relation: "",
    relationTarget: "",
    slots: [{ name: "특징", value: "젖을 먹여 새끼를 키움" }],
    color: "border-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    id: "human",
    name: "인간",
    relation: "ako",
    relationTarget: "포유류",
    slots: [
      { name: "ako", value: "포유류" },
      { name: "이동", value: "직립보행" },
      { name: "지능", value: "100", isDefault: true },
    ],
    color: "border-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    id: "adult-male",
    name: "성인남자",
    relation: "ako",
    relationTarget: "인간",
    slots: [
      { name: "ako", value: "인간" },
      { name: "연령", value: "(값 필요)" },
      { name: "키", value: "170", isDefault: true },
      { name: "체중", value: "65", isDefault: true },
      { name: "결혼여부", value: "(값 필요)" },
      { name: "배우자", value: "(값 필요)" },
    ],
    color: "border-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    id: "hong",
    name: "홍길동",
    relation: "instance",
    relationTarget: "성인남자",
    slots: [
      { name: "instance", value: "성인남자" },
      { name: "연령", value: "35" },
      { name: "키", value: "175" },
      { name: "체중", value: "70" },
      { name: "결혼여부", value: "기혼" },
      { name: "배우자", value: "이영숙" },
    ],
    color: "border-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
];

const inheritanceChain = [
  { from: "홍길동", to: "성인남자", relation: "instance" },
  { from: "성인남자", to: "인간", relation: "ako" },
  { from: "인간", to: "포유류", relation: "ako" },
];

const procedures = [
  {
    type: "if-needed",
    title: "if-needed (필요 시)",
    description: "슬롯 값이 필요할 때 실행되는 프로시저",
    example:
      '체중 슬롯의 if-needed: 연령 > 35이면 → 키 - 100, 아니면 → 키 - 110',
    color: "bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  {
    type: "if-read",
    title: "if-read (읽기 시)",
    description: "슬롯 값을 읽을 때 실행되는 프로시저",
    example: "접근 로그를 기록하거나, 읽을 때마다 카운터 증가",
    color: "bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700",
    textColor: "text-green-700 dark:text-green-300",
  },
  {
    type: "if-written",
    title: "if-written (기록 시)",
    description: "슬롯 값이 기록될 때 실행되는 프로시저",
    example:
      '결혼여부 슬롯의 if-written: 기혼이면 → "배우자는?" 질문 → 상대 프레임에도 메시지 전달',
    color: "bg-orange-50 border-orange-300 dark:bg-orange-900/20 dark:border-orange-700",
    textColor: "text-orange-700 dark:text-orange-300",
  },
  {
    type: "if-removed",
    title: "if-removed (제거 시)",
    description: "슬롯 값이 제거될 때 실행되는 프로시저",
    example: "관련 슬롯 값을 함께 초기화하거나 로그 기록",
    color: "bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700",
    textColor: "text-red-700 dark:text-red-300",
  },
];

export default function FrameExplorer() {
  const [expandedFrame, setExpandedFrame] = useState<string | null>("hong");
  const [expandedProc, setExpandedProc] = useState<string | null>(null);
  const [showChain, setShowChain] = useState(false);

  return (
    <section>
      <SectionTitle
        title="프레임 (Frame)"
        subtitle="슬롯(slot) 집합으로 개념의 속성을 표현하는 지식표현 방법 (Minsky 제안)"
      />

      {/* Frame cards */}
      <div className="mb-6 space-y-3">
        {frames.map((frame) => (
          <div key={frame.id}>
            <motion.button
              whileHover={{ scale: 1.01 }}
              onClick={() =>
                setExpandedFrame(
                  expandedFrame === frame.id ? null : frame.id
                )
              }
              className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${frame.color} ${frame.bgColor}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Frame: {frame.name}
                  </span>
                  {frame.relation && (
                    <span className="rounded bg-white/60 px-2 py-0.5 text-xs font-mono dark:bg-gray-800/60">
                      {frame.relation}: {frame.relationTarget}
                    </span>
                  )}
                </div>
                <motion.div
                  animate={{
                    rotate: expandedFrame === frame.id ? 180 : 0,
                  }}
                >
                  <ChevronDown size={18} className="text-gray-500" />
                </motion.div>
              </div>
            </motion.button>

            <AnimatePresence>
              {expandedFrame === frame.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-b-lg border border-t-0 border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="px-3 py-2 text-left text-gray-500">
                            슬롯(Slot)
                          </th>
                          <th className="px-3 py-2 text-left text-gray-500">
                            값(Value)
                          </th>
                          <th className="px-3 py-2 text-left text-gray-500">
                            비고
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {frame.slots.map((slot, i) => (
                          <tr
                            key={i}
                            className="border-b border-gray-100 dark:border-gray-800"
                          >
                            <td className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">
                              {slot.name}
                            </td>
                            <td className="px-3 py-2 text-orange-600 dark:text-orange-400">
                              {slot.value}
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-500">
                              {slot.isDefault && (
                                <span className="rounded bg-yellow-100 px-1.5 py-0.5 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                                  기본값
                                </span>
                              )}
                              {slot.inherited && (
                                <span className="rounded bg-blue-100 px-1.5 py-0.5 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                  {slot.inheritedFrom}에서 상속
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Inheritance chain */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">특성상속 데모</h3>
          <button
            onClick={() => setShowChain(!showChain)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              showChain
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {showChain ? "숨기기" : "상속 체인 보기"}
          </button>
        </div>

        <AnimatePresence>
          {showChain && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap items-center justify-center gap-2">
                {inheritanceChain.map((link, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {i === 0 && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0 }}
                        className="rounded-lg bg-green-100 px-3 py-1.5 text-sm font-bold text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      >
                        {link.from}
                      </motion.span>
                    )}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.3 + 0.1 }}
                      className="flex items-center gap-1"
                    >
                      <span className="text-xs text-gray-400">
                        ({link.relation})
                      </span>
                      <ChevronRight size={14} className="text-gray-400" />
                    </motion.div>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.3 + 0.2 }}
                      className={`rounded-lg px-3 py-1.5 text-sm font-bold ${
                        i === 0
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                          : i === 1
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                      }`}
                    >
                      {link.to}
                    </motion.span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-orange-50 p-3 dark:bg-orange-900/20">
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  홍길동은 성인남자의 인스턴스이므로 성인남자의 기본값(키:170,
                  체중:65)을 상속받을 수 있지만, 자체 값(키:175, 체중:70)이
                  있으면 그것을 우선 사용. 인간의 이동(직립보행), 지능(100) 등도
                  상속.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 부가 프로시저 */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-lg font-bold">부가 프로시저 (4가지)</h3>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          프레임은 <strong>절차적 지식</strong>도 표현할 수 있음. 슬롯에 부가
          프로시저를 첨부하여 특정 이벤트 발생 시 자동 실행.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {procedures.map((proc) => (
            <motion.button
              key={proc.type}
              whileHover={{ scale: 1.01 }}
              onClick={() =>
                setExpandedProc(
                  expandedProc === proc.type ? null : proc.type
                )
              }
              className={`rounded-lg border p-4 text-left ${proc.color}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${proc.textColor}`}>
                  {proc.title}
                </span>
                <motion.div
                  animate={{
                    rotate: expandedProc === proc.type ? 180 : 0,
                  }}
                >
                  <ChevronDown size={14} className="text-gray-400" />
                </motion.div>
              </div>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                {proc.description}
              </p>
              <AnimatePresence>
                {expandedProc === proc.type && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 rounded bg-white/60 p-2 dark:bg-gray-800/60">
                      <span className="text-xs font-semibold text-gray-500">
                        예시:
                      </span>
                      <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">
                        {proc.example}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        <div className="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>핵심:</strong> 프레임은 기본값 지정이 가능하고, 슬롯
            집합으로 개념의 속성을 표현하며, 부가 프로시저를 통해 절차적
            지식까지 표현할 수 있는 강력한 지식표현 방법. Minsky가 제안.
          </p>
        </div>
      </div>
    </section>
  );
}
