"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

type Method = "permit" | "discard" | "reroute";

const methods: {
  key: Method;
  title: string;
  subtitle: string;
  example: string;
  desc: string;
}[] = [
  {
    key: "permit",
    title: "(1) 전송량의 제한",
    subtitle: "permit control",
    example: "Isarithmic 흐름제어 방법",
    desc: "허가증(permit)을 이용하여 전송량을 일정 수준 이하로 유지. 통신망 내에 동시에 존재할 수 있는 패킷 수의 상한을 통제. 통신망에 고정된 수의 허가증만을 유통시키고, 패킷은 허가증이 있어야만 전송 가능.",
  },
  {
    key: "discard",
    title: "(2) 부네트워크 내의 부하 감소",
    subtitle: "load reduction",
    example: "패킷 버림 (packet discard)",
    desc: "어떤 패킷을 버림. 흐름제어의 거부원칙(rejection) 방법 이용. 과부하 상태의 노드가 들어오는 패킷을 거부·폐기하여 내부 부하를 낮춤.",
  },
  {
    key: "reroute",
    title: "(3) 국부적 전송량의 재분배",
    subtitle: "local redistribution",
    example: "경로선택(routing) 이용",
    desc: "국부적인 체증 방지 및 국부적 과다 교통량 해소. 경로선택(routing) 방법 이용. 특정 노드·링크에 몰린 트래픽을 다른 경로로 우회시켜 부하를 분산.",
  },
];

function Visualization({ method }: { method: Method }) {
  if (method === "permit") {
    return (
      <div className="flex items-center justify-center gap-2 py-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -6, 0],
              opacity: i < 4 ? 1 : 0.3,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ${
              i < 4
                ? "bg-sky-500 text-white"
                : "border-2 border-dashed border-gray-400 text-gray-400"
            }`}
          >
            {i < 4 ? "P" : "X"}
          </motion.div>
        ))}
        <div className="ml-4 text-xs text-gray-500">
          <div>P = 허가증 있는 패킷</div>
          <div>X = 허가증 없음 → 대기</div>
        </div>
      </div>
    );
  }

  if (method === "discard") {
    return (
      <div className="flex items-center justify-center gap-3 py-4">
        <div className="text-xs text-gray-500">입력 →</div>
        {[0, 1, 2, 3].map((i) => {
          const drop = i === 1 || i === 3;
          return (
            <motion.div
              key={i}
              animate={
                drop
                  ? { y: [0, 30], opacity: [1, 0] }
                  : { x: [0, 10, 0] }
              }
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              className={`flex h-10 w-10 items-center justify-center rounded text-xs font-bold text-white ${
                drop ? "bg-red-500" : "bg-sky-500"
              }`}
            >
              {drop ? "✕" : "✓"}
            </motion.div>
          );
        })}
        <div className="ml-3 flex h-16 w-16 items-center justify-center rounded-lg border-2 border-sky-400 bg-sky-50 text-xs font-bold text-sky-700 dark:bg-sky-900/20 dark:text-sky-300">
          과부하<br />노드
        </div>
      </div>
    );
  }

  // reroute
  return (
    <div className="relative mx-auto h-40 w-full max-w-md py-4">
      <svg viewBox="0 0 400 140" className="h-full w-full">
        {/* 노드 */}
        {[
          { x: 40, y: 70, label: "A" },
          { x: 200, y: 30, label: "B" },
          { x: 200, y: 110, label: "C" },
          { x: 360, y: 70, label: "D" },
        ].map((n) => (
          <g key={n.label}>
            <circle
              cx={n.x}
              cy={n.y}
              r={18}
              fill="#e0f2fe"
              stroke="#0ea5e9"
              strokeWidth={2}
            />
            <text
              x={n.x}
              y={n.y + 5}
              textAnchor="middle"
              className="fill-sky-700 text-sm font-bold"
            >
              {n.label}
            </text>
          </g>
        ))}

        {/* 혼잡 경로 (A->B->D) */}
        <line
          x1={58}
          y1={62}
          x2={185}
          y2={35}
          stroke="#ef4444"
          strokeWidth={2}
          strokeDasharray="4 3"
        />
        <line
          x1={215}
          y1={35}
          x2={343}
          y2={62}
          stroke="#ef4444"
          strokeWidth={2}
          strokeDasharray="4 3"
        />
        <text x={200} y={20} textAnchor="middle" className="fill-red-500 text-xs">
          혼잡 경로
        </text>

        {/* 우회 경로 A->C->D */}
        <line
          x1={58}
          y1={78}
          x2={185}
          y2={105}
          stroke="#10b981"
          strokeWidth={2}
        />
        <line
          x1={215}
          y1={105}
          x2={343}
          y2={78}
          stroke="#10b981"
          strokeWidth={2}
        />
        <text x={200} y={135} textAnchor="middle" className="fill-emerald-600 text-xs">
          우회 경로
        </text>

        {/* 이동 패킷 */}
        <motion.circle
          r={5}
          fill="#10b981"
          animate={{
            cx: [58, 200, 343],
            cy: [78, 105, 78],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </svg>
    </div>
  );
}

export default function CongestionControlMethods() {
  const [open, setOpen] = useState<Method | null>("permit");

  return (
    <section>
      <SectionTitle
        title="혼잡제어 방법 3가지"
        subtitle="아코디언을 펼쳐 각 방법의 동작 방식을 시각화로 확인하세요"
      />

      <div className="space-y-3">
        {methods.map((m) => {
          const isOpen = open === m.key;
          return (
            <div
              key={m.key}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
            >
              <button
                onClick={() => setOpen(isOpen ? null : m.key)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div>
                  <div className="font-bold text-sky-600 dark:text-sky-300">
                    {m.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {m.subtitle} · 예: {m.example}
                  </div>
                </div>
                <span className="text-gray-400">{isOpen ? "▼" : "▶"}</span>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                      <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
                        {m.desc}
                      </p>
                      <div className="rounded-lg bg-gray-50 dark:bg-gray-800">
                        <Visualization method={m.key} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
