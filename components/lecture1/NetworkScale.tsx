"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

const scales = [
  {
    name: "LAN",
    full: "Local Area Network (근거리 통신망)",
    distance: "10m ~ 1km",
    place: "방 ~ 마을",
    example: "이더넷, Wi-Fi",
    desc: "약연결 분산 시스템. 단일 조직이 소유·관리하는 소규모 네트워크",
    color: "bg-blue-500",
    size: "w-16 h-16",
  },
  {
    name: "MAN",
    full: "Metropolitan Area Network (도시 통신망)",
    distance: "10km ~ 1,000km",
    place: "도시 ~ 나라",
    example: "CATV 네트워크",
    desc: "도시 규모의 통신망. LAN과 WAN의 중간 형태",
    color: "bg-amber-500",
    size: "w-24 h-24",
  },
  {
    name: "WAN",
    full: "Wide Area Network (광역 통신망)",
    distance: "10,000km ~ 40,000km",
    place: "대륙 ~ 지구",
    example: "인터넷, ARPANET",
    desc: "광범위한 지역을 연결하는 대규모 네트워크. ISP에 의해 운영",
    color: "bg-rose-500",
    size: "w-32 h-32",
  },
];

export default function NetworkScale() {
  const [active, setActive] = useState(0);

  return (
    <section>
      <SectionTitle
        title="네트워크 규모에 따른 분류"
        subtitle="처리기 사이의 거리와 위치한 장소에 따른 약연결 분산 시스템 분류"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        {/* Visual size comparison */}
        <div className="mb-8 flex items-end justify-center gap-8">
          {scales.map((s, i) => (
            <button key={s.name} onClick={() => setActive(i)} className="flex flex-col items-center">
              <motion.div
                animate={{ scale: active === i ? 1.1 : 1 }}
                className={`${s.size} ${s.color} flex items-center justify-center rounded-full text-white font-bold text-sm shadow-lg transition-shadow ${
                  active === i ? "ring-4 ring-offset-2 ring-blue-300" : ""
                }`}
              >
                {s.name}
              </motion.div>
              <span className="mt-2 text-xs text-gray-500">{s.distance}</span>
            </button>
          ))}
        </div>

        {/* Details */}
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg bg-gray-50 p-5 dark:bg-gray-800"
        >
          <div className="text-lg font-bold">{scales[active].full}</div>
          <table className="mt-3 w-full text-sm">
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 pr-4 font-medium text-gray-500">거리</td>
                <td className="py-2">{scales[active].distance}</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 pr-4 font-medium text-gray-500">장소</td>
                <td className="py-2">{scales[active].place}</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 pr-4 font-medium text-gray-500">예시</td>
                <td className="py-2">{scales[active].example}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-gray-500">설명</td>
                <td className="py-2">{scales[active].desc}</td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
