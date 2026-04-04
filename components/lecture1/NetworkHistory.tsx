"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

const events = [
  { year: "1940", name: "원격 계산기", desc: "G. Stibitz — 복소수 계산기(complex calculator) 제작. 원격 컴퓨터를 통신망으로 제어한 최초의 사건", color: "bg-gray-500" },
  { year: "1958", name: "SAGE 시스템", desc: "Semi-Automatic Ground Environment. 컴퓨터와 통신을 결합시킨 최초의 컴퓨터 통신 시스템. 미국·캐나다 조기 경계망 구축 목적", color: "bg-blue-500" },
  { year: "1964", name: "SABRE 시스템", desc: "Semi-Automatic Business Research Environment. American Airline사의 여객기 좌석 예약 업무 처리. 시분할 시스템(CTSS) 개발로 이어짐", color: "bg-green-500" },
  { year: "1960s", name: "ARPANET", desc: "Advanced Research Project Agency. TCP/IP 개발, 패킷 교환 네트워크. 인터넷의 전신. 1983년 MILNET과 ARPANET으로 분할 후 현재의 인터넷으로 진화", color: "bg-purple-500" },
  { year: "1968", name: "ALOHA 시스템", desc: "Additive Links Online Hawaii Area. 하와이 대학의 실험적 무선 패킷 교환 네트워크", color: "bg-amber-500" },
  { year: "1974", name: "TELNET", desc: "최초의 대중화된 상용 패킷 교환 네트워크", color: "bg-rose-500" },
];

export default function NetworkHistory() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section>
      <SectionTitle
        title="데이터 통신의 역사"
        subtitle="주요 사건을 클릭하여 상세 정보를 확인하세요"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        {/* Timeline */}
        <div className="relative">
          {/* Line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

          <div className="space-y-4">
            {events.map((ev, i) => (
              <div key={i}>
                <button
                  onClick={() => setSelected(selected === i ? null : i)}
                  className="relative flex w-full items-start gap-4 text-left"
                >
                  <div
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${ev.color} text-xs font-bold text-white shadow-sm`}
                  >
                    {ev.year}
                  </div>
                  <div className="pt-2">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {ev.name}
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {selected === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-14 overflow-hidden"
                    >
                      <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        {ev.desc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
