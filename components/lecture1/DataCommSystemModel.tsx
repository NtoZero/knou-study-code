"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

const nodes = [
  { id: "src", label: "송신자", symbol: "m", desc: "입력 정보 — 통신하고자 하는 메시지", x: 0 },
  { id: "input", label: "입력 장치", symbol: "g", desc: "입력 데이터 — 디지털 형태로 변환된 데이터", x: 1 },
  { id: "tx", label: "송신기", symbol: "s(t)", desc: "송신 신호 — 전송 매체 특성에 맞게 변환된 신호", x: 2 },
  { id: "medium", label: "전송 매체", symbol: "r(t)", desc: "수신 신호 — 잡음으로 인해 s(t)와 다를 수 있음", x: 3 },
  { id: "rx", label: "수신기", symbol: "g'", desc: "출력 데이터 — 출력에 적합한 형태로 변환", x: 4 },
  { id: "output", label: "출력 장치", symbol: "m'", desc: "출력 정보 — 수신자에게 전달하는 메시지", x: 5 },
  { id: "dst", label: "수신자", symbol: "", desc: "", x: 6 },
];

export default function DataCommSystemModel() {
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [packetPos, setPacketPos] = useState(-1);

  const animate = () => {
    setPacketPos(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i > 6) {
        clearInterval(interval);
        setPacketPos(-1);
        return;
      }
      setPacketPos(i);
    }, 600);
  };

  return (
    <section>
      <SectionTitle
        title="데이터 통신 시스템 모델"
        subtitle="송신자에서 수신자까지 데이터가 전달되는 과정. 노드를 클릭하면 상세 설명을 볼 수 있습니다."
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        {/* Flow diagram */}
        <div className="relative overflow-x-auto pb-4">
          <div className="flex min-w-[640px] items-center justify-between">
            {nodes.map((node, i) => (
              <div key={node.id} className="flex items-center">
                <button
                  onClick={() => setActiveNode(activeNode === i ? null : i)}
                  className={`relative flex flex-col items-center rounded-lg border-2 px-3 py-2 transition-colors ${
                    packetPos === i
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                      : activeNode === i
                        ? "border-blue-300 bg-gray-50 dark:bg-gray-800"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                  }`}
                >
                  <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                    {node.label}
                  </span>
                  {node.symbol && (
                    <span className="mt-0.5 font-mono text-xs text-gray-500">
                      {node.symbol}
                    </span>
                  )}
                  {packetPos === i && (
                    <motion.div
                      layoutId="packet"
                      className="absolute -top-2 right-0 h-3 w-3 rounded-full bg-blue-500"
                    />
                  )}
                </button>
                {i < nodes.length - 1 && (
                  <div className="mx-1 text-gray-300 dark:text-gray-600">→</div>
                )}
              </div>
            ))}
          </div>

          {/* Noise indicator on medium */}
          <div className="mt-2 flex min-w-[640px] justify-center">
            <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-600 dark:bg-red-900/30 dark:text-red-400">
              ⚡ 잡음(noise)
            </span>
          </div>
        </div>

        {/* Detail panel */}
        {activeNode !== null && nodes[activeNode].desc && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-lg bg-blue-50 p-4 text-sm dark:bg-blue-900/20"
          >
            <div className="font-semibold text-blue-700 dark:text-blue-300">
              {nodes[activeNode].label}
              {nodes[activeNode].symbol && (
                <span className="ml-1 font-mono text-blue-500">
                  ({nodes[activeNode].symbol})
                </span>
              )}
            </div>
            <div className="mt-1 text-gray-600 dark:text-gray-400">
              {nodes[activeNode].desc}
            </div>
          </motion.div>
        )}

        <button
          onClick={animate}
          className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
        >
          데이터 전송 애니메이션 ▶
        </button>

        {/* System classification */}
        <div className="mt-4 flex gap-4 text-xs text-gray-500">
          <span className="rounded border border-gray-300 px-2 py-1 dark:border-gray-600">
            근원지 시스템: 입력 장치 + 송신기
          </span>
          <span className="rounded border border-gray-300 px-2 py-1 dark:border-gray-600">
            목적지 시스템: 수신기 + 출력 장치
          </span>
        </div>
      </div>
    </section>
  );
}
