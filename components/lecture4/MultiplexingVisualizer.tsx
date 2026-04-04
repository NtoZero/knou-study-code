"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

const modes = [
  {
    name: "TDM",
    full: "시분할 다중화 (Time Division Multiplexing)",
    desc: "각 입력 채널에 시간 슬롯을 할당하여 교대로 전송. 비트 단위 또는 문자 단위로 다중화 가능.",
    detail: "비트 단위 다중화: 송신 측은 하드웨어로, 수신 측은 소프트웨어로 역다중화 수행",
    color: "#8b5cf6",
  },
  {
    name: "FDM",
    full: "주파수분할 다중화 (Frequency Division Multiplexing)",
    desc: "전체 대역폭을 여러 주파수 대역으로 분할하여 각 채널에 할당. 채널 간 보호대역(guard band) 필요.",
    detail: "AM 방송: 530~1,700kHz 대역, 각 방송국 10kHz 간격의 보호대역으로 분리",
    color: "#10b981",
  },
  {
    name: "WDM",
    full: "파장분할 다중화 (Wavelength Division Multiplexing)",
    desc: "광섬유에서 서로 다른 파장(색)의 빛을 동시에 전송. FDM의 광통신 버전.",
    detail: "하나의 광섬유에 여러 파장의 레이저를 결합하여 전송, 프리즘으로 분리",
    color: "#f59e0b",
  },
  {
    name: "CDMA",
    full: "코드분할 다중접속 (Code Division Multiple Access)",
    desc: "각 사용자에게 고유한 코드를 할당. 동일한 주파수·시간에 여러 사용자가 동시 전송 가능.",
    detail: "대역확산(spread spectrum) 기술 사용. 이동통신(2G/3G)에서 널리 사용",
    color: "#f43f5e",
  },
];

export default function MultiplexingVisualizer() {
  const [active, setActive] = useState(0);
  const m = modes[active];

  return (
    <section>
      <SectionTitle
        title="다중화 (Multiplexing)"
        subtitle="하나의 통신 링크를 여러 사용자가 공유하는 기술"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex flex-wrap gap-2">
          {modes.map((m, i) => (
            <button
              key={m.name}
              onClick={() => setActive(i)}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                active === i ? "text-white" : "bg-gray-100 dark:bg-gray-800"
              }`}
              style={active === i ? { backgroundColor: m.color } : {}}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Visualization */}
        <div className="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
          <svg viewBox="0 0 500 180" className="w-full">
            {/* Input channels */}
            {["Ch1", "Ch2", "Ch3"].map((ch, i) => {
              const y = 30 + i * 55;
              const colors = ["#3b82f6", "#ef4444", "#10b981"];
              return (
                <g key={ch}>
                  <rect x={10} y={y} width={60} height={30} rx={4} fill={colors[i]} opacity={0.8} />
                  <text x={40} y={y + 19} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">{ch}</text>
                  <line x1={70} y1={y + 15} x2={130} y2={90} stroke={colors[i]} strokeWidth="1.5" />
                </g>
              );
            })}

            {/* MUX */}
            <rect x={130} y={60} width={50} height={60} rx={6} fill={m.color} />
            <text x={155} y={94} textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">MUX</text>

            {/* Shared channel */}
            <line x1={180} y1={90} x2={320} y2={90} stroke={m.color} strokeWidth="3" />

            {active === 0 && (
              // TDM: time slots
              <g>
                {["#3b82f6", "#ef4444", "#10b981", "#3b82f6", "#ef4444", "#10b981"].map((c, i) => (
                  <rect key={i} x={190 + i * 20} y={75} width={18} height={30} fill={c} opacity={0.7} rx={2} />
                ))}
                <text x={250} y={70} textAnchor="middle" fontSize="8" fill="#6b7280">시간 슬롯</text>
              </g>
            )}
            {active === 1 && (
              // FDM: frequency bands
              <g>
                {[
                  { color: "#3b82f6", y: 72 },
                  { color: "#ef4444", y: 84 },
                  { color: "#10b981", y: 96 },
                ].map((band, i) => (
                  <g key={i}>
                    <rect x={190} y={band.y} width={120} height={8} fill={band.color} opacity={0.6} rx={1} />
                    {i < 2 && <rect x={190} y={band.y + 8} width={120} height={4} fill="#e5e7eb" opacity={0.5} />}
                  </g>
                ))}
                <text x={250} y={68} textAnchor="middle" fontSize="8" fill="#6b7280">주파수 대역 (보호대역 포함)</text>
              </g>
            )}
            {active === 2 && (
              // WDM: wavelengths (colored lines)
              <g>
                {["#ef4444", "#22c55e", "#3b82f6"].map((c, i) => (
                  <line key={i} x1={190} y1={82 + i * 8} x2={310} y2={82 + i * 8} stroke={c} strokeWidth="2" opacity={0.8} />
                ))}
                <text x={250} y={72} textAnchor="middle" fontSize="8" fill="#6b7280">파장 (λ1, λ2, λ3)</text>
              </g>
            )}
            {active === 3 && (
              // CDMA: overlapping codes
              <g>
                {["#3b82f6", "#ef4444", "#10b981"].map((c, i) => (
                  <rect key={i} x={190} y={75} width={120} height={30} fill={c} opacity={0.2} rx={4} />
                ))}
                <text x={250} y={70} textAnchor="middle" fontSize="8" fill="#6b7280">고유 코드로 동시 전송</text>
              </g>
            )}

            {/* DEMUX */}
            <rect x={320} y={60} width={50} height={60} rx={6} fill={m.color} />
            <text x={345} y={94} textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">DEMUX</text>

            {/* Output channels */}
            {["Ch1", "Ch2", "Ch3"].map((ch, i) => {
              const y = 30 + i * 55;
              const colors = ["#3b82f6", "#ef4444", "#10b981"];
              return (
                <g key={`out-${ch}`}>
                  <line x1={370} y1={90} x2={430} y2={y + 15} stroke={colors[i]} strokeWidth="1.5" />
                  <rect x={430} y={y} width={60} height={30} rx={4} fill={colors[i]} opacity={0.8} />
                  <text x={460} y={y + 19} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">{ch}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <h3 className="font-semibold" style={{ color: m.color }}>{m.full}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{m.desc}</p>
          <p className="mt-2 text-sm text-gray-500"><strong>참고:</strong> {m.detail}</p>
        </motion.div>
      </div>
    </section>
  );
}
