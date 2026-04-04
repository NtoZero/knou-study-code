"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import StepControls from "@/components/common/StepControls";
import { useAnimationStep } from "@/hooks/useAnimationStep";

const methods = [
  {
    name: "회선 교환",
    eng: "Circuit Switching",
    color: "#3b82f6",
    desc: "호스트 간 통신을 위해 경로상 자원을 미리 할당하고, 데이터 전송 후 자원을 해제하는 방식.",
    detail: "3단계: ①회선 설정(전용 채널 생성) → ②데이터 전송(전용회선처럼 사용) → ③회선 해지(모든 교환기에 해지 신호). 대표적 예: 전화 교환망.",
    features: ["연결지향형 — 통신경로가 설정된 동안 전용선처럼 사용", "일정한 전송 속도 — 통신회선이 미리 정해짐", "실시간이나 긴 메시지 전송에 적합", "회선이 독점 사용되므로 이용률 비효율적"],
    bandwidth: "고정 대역폭 할당",
    delay: "회선 설정 지연 + 최소 전송 지연",
  },
  {
    name: "메시지 교환",
    eng: "Message Switching",
    color: "#f59e0b",
    desc: "메시지 전체를 store-and-forward 방식으로 전달. 축적 교환이라고도 함.",
    detail: "메시지를 각 노드의 보조기억장치(파일)에 저장 후 다음 링크가 가용해지면 전달. 패킷 교환의 특별한 경우로 볼 수 있음. 수신자가 부재 중이면 교환기가 자동으로 저장 후 전달.",
    features: ["비연결형 — 전송 전 경로 설정 불필요", "메시지 전체를 보조기억장치에 저장(검색 가능)", "브로드캐스팅/멀티캐스팅 가능", "대용량 데이터 전송에 적합, 실시간에는 부적절"],
    bandwidth: "동적 대역폭 할당",
    delay: "메시지 전송 지연이 가장 큼 (전체 메시지 단위 저장/전달)",
  },
  {
    name: "가상회선 패킷 교환",
    eng: "Virtual Circuit",
    color: "#8b5cf6",
    desc: "전송 전 송·수신자 간 논리적 경로(가상회선)를 설정하고, 모든 패킷이 같은 경로로 전송.",
    detail: "각 패킷 헤더에 VCI(가상회선 식별자)가 포함되며, 교환기는 입력(포트+VCI) → 출력(포트+VCI)의 4열 라우팅 테이블을 참조하여 VCI를 교환. 모든 패킷이 송신 순서대로 도착.",
    features: ["연결지향형 — 가상회선 설정/해제 단계 존재", "VCI(가상회선 식별자)로 라우팅 — 매 패킷 목적지 주소 불필요", "패킷이 순서대로 도착 — 수신 측 재정렬 불필요", "흐름제어 제공"],
    bandwidth: "동적 대역폭 할당",
    delay: "회선 설정 + 패킷 전송 지연",
  },
  {
    name: "데이터그램 패킷 교환",
    eng: "Datagram",
    color: "#f43f5e",
    desc: "각 패킷이 독립적으로 전송되며, 중간 노드가 네트워크 상태를 고려하여 최적 경로를 선택.",
    detail: "사전 경로 설정 없이 각 패킷의 헤더에 송·수신 주소를 포함. 패킷마다 다른 경로로 전달될 수 있어 도착 순서가 달라질 수 있음. TCP/IP에서 대표적으로 사용.",
    features: ["비연결형 — 경로 설정 불필요, 소량 데이터에 신속", "각 패킷 헤더에 송·수신 주소 포함", "도착 순서가 다를 수 있어 수신 측 순서 재구성 필요", "혼잡 시 다른 경로로 우회 가능 — 높은 신뢰성"],
    bandwidth: "동적 대역폭 할당",
    delay: "패킷 전송 지연 (설정 지연 없음)",
  },
];

export default function SwitchingComparison() {
  const [active, setActive] = useState(0);
  const anim = useAnimationStep({ totalSteps: 8, intervalMs: 800 });
  const m = methods[active];

  // Timing diagram: 4 nodes, data flows through
  const nodes = ["송신", "노드1", "노드2", "수신"];

  return (
    <section>
      <SectionTitle
        title="데이터 교환 방식 비교"
        subtitle="회선 교환, 메시지 교환, 가상회선, 데이터그램 4가지 방식"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex flex-wrap gap-2">
          {methods.map((m, i) => (
            <button
              key={m.name}
              onClick={() => { setActive(i); anim.reset(); }}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                active === i ? "text-white" : "bg-gray-100 dark:bg-gray-800"
              }`}
              style={active === i ? { backgroundColor: m.color } : {}}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Timing diagram */}
        <div className="mb-4 overflow-x-auto">
          <div className="min-w-[500px]">
            <svg viewBox="0 0 500 200" className="w-full">
              {/* Node columns */}
              {nodes.map((n, i) => {
                const x = 60 + i * 140;
                return (
                  <g key={n}>
                    <text x={x} y={20} textAnchor="middle" fontSize="11" fill="#6b7280" fontWeight="bold">{n}</text>
                    <line x1={x} y1={28} x2={x} y2={190} stroke="#d1d5db" strokeWidth="1.5" />
                  </g>
                );
              })}

              {/* Flow arrows based on method */}
              {active === 0 && (
                // Circuit: setup line, then continuous data, then disconnect
                <g>
                  <line x1={60} y1={40} x2={480} y2={60} stroke={m.color} strokeWidth="1" strokeDasharray="4" />
                  <text x={270} y={45} textAnchor="middle" fontSize="9" fill={m.color}>회선 설정</text>
                  <rect x={60} y={70} width={420} height={60} fill={m.color} opacity="0.15" rx="4" />
                  <text x={270} y={105} textAnchor="middle" fontSize="10" fill={m.color}>데이터 연속 전송 (전용 회선)</text>
                  <line x1={480} y1={140} x2={60} y2={155} stroke={m.color} strokeWidth="1" strokeDasharray="4" />
                  <text x={270} y={150} textAnchor="middle" fontSize="9" fill={m.color}>회선 해지</text>
                </g>
              )}

              {active === 1 && (
                // Message: store-and-forward entire message
                <g>
                  {[0, 1, 2].map((seg) => {
                    const x1 = 60 + seg * 140;
                    const x2 = 60 + (seg + 1) * 140;
                    const y1 = 40 + seg * 50;
                    const y2 = 40 + (seg + 1) * 50;
                    return (
                      <g key={seg}>
                        <polygon
                          points={`${x1},${y1} ${x2},${y2} ${x2},${y2 + 25} ${x1},${y1 + 25}`}
                          fill={m.color}
                          opacity="0.2"
                          stroke={m.color}
                          strokeWidth="1"
                        />
                        <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 + 10} textAnchor="middle" fontSize="8" fill={m.color}>
                          전체 메시지
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {active === 2 && (
                // Virtual circuit: setup, then packets in pipeline (same path)
                <g>
                  <line x1={60} y1={35} x2={480} y2={50} stroke={m.color} strokeWidth="1" strokeDasharray="4" />
                  <text x={270} y={38} textAnchor="middle" fontSize="9" fill={m.color}>가상회선 설정 (VCI 할당)</text>
                  {[0, 1, 2].map((pkt) => (
                    <g key={pkt}>
                      {[0, 1, 2].map((seg) => {
                        const x1 = 60 + seg * 140;
                        const x2 = 60 + (seg + 1) * 140;
                        const y1 = 60 + pkt * 15 + seg * 30;
                        const y2 = 60 + pkt * 15 + (seg + 1) * 30;
                        return (
                          <line
                            key={seg}
                            x1={x1} y1={y1} x2={x2} y2={y2}
                            stroke={m.color} strokeWidth="2" opacity={0.5 + pkt * 0.15}
                          />
                        );
                      })}
                    </g>
                  ))}
                  <text x={270} y={165} textAnchor="middle" fontSize="9" fill={m.color}>패킷 P1, P2, P3 (같은 경로, 순서 보장)</text>
                </g>
              )}

              {active === 3 && (
                // Datagram: packets take different paths
                <g>
                  {[
                    { label: "P1", offsets: [0, 10, 5] },
                    { label: "P2", offsets: [15, -5, 20] },
                    { label: "P3", offsets: [5, 25, -10] },
                  ].map((pkt, pi) => (
                    <g key={pi}>
                      {[0, 1, 2].map((seg) => {
                        const x1 = 60 + seg * 140;
                        const x2 = 60 + (seg + 1) * 140;
                        const y1 = 50 + pi * 40 + pkt.offsets[seg];
                        const y2 = 50 + pi * 40 + (seg < 2 ? pkt.offsets[seg + 1] : 0) + 20;
                        return (
                          <line
                            key={seg}
                            x1={x1} y1={y1} x2={x2} y2={y2}
                            stroke={m.color} strokeWidth="2"
                            opacity={0.4 + pi * 0.2}
                            strokeDasharray={pi === 1 ? "4" : ""}
                          />
                        );
                      })}
                    </g>
                  ))}
                  <text x={270} y={185} textAnchor="middle" fontSize="9" fill={m.color}>각 패킷이 독립적 경로 선택 → 순서 재구성 필요</text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Features */}
        <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="space-y-3">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <h3 className="font-semibold" style={{ color: m.color }}>{m.name} ({m.eng})</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{m.desc}</p>
            <p className="mt-2 text-xs text-gray-500">{m.detail}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <span className="text-xs font-semibold text-gray-500">특징</span>
              <ul className="mt-1 space-y-1 text-sm">
                {m.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-gray-600 dark:text-gray-400">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: m.color }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <div className="rounded-lg bg-blue-50 p-3 text-xs dark:bg-blue-900/20">
                <span className="font-semibold text-blue-700 dark:text-blue-300">대역폭:</span>{" "}
                <span className="text-gray-600 dark:text-gray-400">{m.bandwidth}</span>
              </div>
              <div className="rounded-lg bg-amber-50 p-3 text-xs dark:bg-amber-900/20">
                <span className="font-semibold text-amber-700 dark:text-amber-300">지연:</span>{" "}
                <span className="text-gray-600 dark:text-gray-400">{m.delay}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
