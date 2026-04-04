"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

const osiLayers = [
  { num: 7, name: "응용" },
  { num: 6, name: "표현" },
  { num: 5, name: "세션" },
  { num: 4, name: "전송" },
  { num: 3, name: "네트워크" },
  { num: 2, name: "데이터 링크" },
  { num: 1, name: "물리" },
];

const devices = [
  {
    name: "리피터 (Repeater)",
    layer: 1,
    desc: "감쇠된 신호를 증폭/재생하여 전달. 물리 계층에서 동작",
    color: "bg-purple-500",
  },
  {
    name: "허브 (Hub)",
    layer: 1,
    desc: "여러 장치를 연결하는 중앙 집중 장치. 수신한 신호를 모든 포트로 전달 (브로드캐스트)",
    color: "bg-purple-400",
  },
  {
    name: "브리지 (Bridge)",
    layer: 2,
    desc: "MAC 주소를 기반으로 프레임을 필터링/전달. 네트워크 세그먼트를 연결",
    color: "bg-blue-500",
  },
  {
    name: "라우터 (Router)",
    layer: 3,
    desc: "IP 주소를 기반으로 패킷의 최적 경로를 결정. 서로 다른 네트워크 간 연결",
    color: "bg-teal-500",
  },
  {
    name: "게이트웨이 (Gateway)",
    layer: 7,
    desc: "서로 다른 프로토콜 간 변환. 전체 프로토콜 스택에서 동작",
    color: "bg-red-500",
  },
];

export default function NetworkDevices() {
  const [activeDevice, setActiveDevice] = useState<number | null>(null);

  return (
    <section>
      <SectionTitle
        title="네트워크 장비와 OSI 계층 매핑"
        subtitle="장비를 클릭하여 해당 OSI 계층을 확인하세요"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="grid gap-6 md:grid-cols-2">
          {/* OSI Stack */}
          <div className="space-y-1">
            {osiLayers.map((layer) => {
              const matchedDevices = devices.filter(
                (d, i) => d.layer === layer.num && activeDevice === i
              );
              const hasDevice = devices.some((d) => d.layer === layer.num);
              const isHighlighted =
                activeDevice !== null && devices[activeDevice].layer === layer.num;

              return (
                <motion.div
                  key={layer.num}
                  animate={{
                    scale: isHighlighted ? 1.02 : 1,
                    backgroundColor: isHighlighted ? "#dbeafe" : "transparent",
                  }}
                  className={`flex items-center justify-between rounded-lg border px-4 py-2.5 ${
                    isHighlighted
                      ? "border-blue-300 dark:border-blue-700"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">L{layer.num}</span>
                    <span className="text-sm font-medium">{layer.name} 계층</span>
                  </div>
                  {hasDevice && (
                    <div className="flex gap-1">
                      {devices
                        .filter((d) => d.layer === layer.num)
                        .map((d) => (
                          <span
                            key={d.name}
                            className={`rounded px-1.5 py-0.5 text-xs text-white ${d.color}`}
                          >
                            {d.name.split(" ")[0]}
                          </span>
                        ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Device list */}
          <div className="space-y-2">
            {devices.map((d, i) => (
              <button
                key={d.name}
                onClick={() => setActiveDevice(activeDevice === i ? null : i)}
                className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${
                  activeDevice === i
                    ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20"
                    : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${d.color}`} />
                  <span className="font-medium">{d.name}</span>
                  <span className="ml-auto text-xs text-gray-400">Layer {d.layer}</span>
                </div>
                {activeDevice === i && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-gray-500"
                  >
                    {d.desc}
                  </motion.p>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
