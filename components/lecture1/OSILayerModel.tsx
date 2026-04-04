"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

const layers = [
  {
    num: 7,
    name: "응용 계층",
    eng: "Application Layer",
    unit: "데이터",
    color: "bg-red-500",
    protocols: [
      { name: "HTTP", desc: "Hyper Text Transfer Protocol — 웹 정보 교환(요청/응답)" },
      { name: "SMTP", desc: "Simple Mail Transfer Protocol — 전자우편 전송" },
      { name: "POP3", desc: "Post Office Protocol 3 — 전자우편 수신 및 서버 저장 관리" },
      { name: "FTP", desc: "File Transfer Protocol — 파일 전송" },
      { name: "TELNET", desc: "원격 접속 프로토콜" },
      { name: "DNS", desc: "Domain Name System — 도메인 이름↔IP 주소 변환" },
    ],
    role: "사용자에게 통신을 위한 서비스 제공. 네트워크 활동들에 대한 모든 기본적인 인터페이스를 제공",
    detail: "최종 사용자가 직접 접하는 계층. 이메일, 웹 브라우징, 파일 전송 등 분산 정보 서비스를 제공하며, 사용자의 데이터를 하위 계층으로 전달하는 출발점",
    device: "게이트웨이 (Gateway) — 서로 다른 프로토콜 간 변환 수행",
    whyUnit: "상위 3개 계층(응용/표현/세션)에서는 아직 전송을 위한 분할이 이루어지지 않으므로 '데이터' 그 자체",
  },
  {
    num: 6,
    name: "표현 계층",
    eng: "Presentation Layer",
    unit: "데이터",
    color: "bg-orange-500",
    protocols: [
      { name: "JPEG/MPEG", desc: "이미지/영상 압축 포맷" },
      { name: "ASCII", desc: "7비트 정보 + 1비트 패리티 문자 코드" },
      { name: "EBCDIC", desc: "IBM에서 개발한 8비트 문자 코드" },
      { name: "SSL/TLS", desc: "암호화 프로토콜" },
    ],
    role: "데이터 표현에 차이가 있는 응용 처리에 대해 독립성 제공. 암호화, 압축, 코드 변환 수행",
    detail: "송·수신 시스템 간 데이터 형식 차이를 해결하는 '번역가' 역할. 예를 들어 ASCII↔EBCDIC 변환, JPEG 압축/해제, SSL 암호화/복호화를 처리",
    device: "—",
    whyUnit: "데이터의 '표현 형식'만 변환하므로 크기 자체는 변하지 않음. 여전히 '데이터' 단위",
  },
  {
    num: 5,
    name: "세션 계층",
    eng: "Session Layer",
    unit: "데이터",
    color: "bg-yellow-500",
    protocols: [
      { name: "NetBIOS", desc: "네트워크 기본 입출력 시스템" },
      { name: "RPC", desc: "Remote Procedure Call — 원격 프로시저 호출" },
      { name: "SQL", desc: "데이터베이스 세션 관리" },
    ],
    role: "송·수신 측 간 관련성을 유지하고 대화 제어. 동기화, 데이터 교환 관리",
    detail: "통신 '대화(dialog)'를 관리하는 계층. 연결의 설정·유지·종결을 담당하고, 동기점(synchronization point)을 삽입하여 전송 중단 시 복구 지점을 제공",
    device: "—",
    whyUnit: "논리적 연결 관리만 수행하며, 데이터 자체를 분할하거나 변환하지 않으므로 '데이터' 단위 유지",
  },
  {
    num: 4,
    name: "전송 계층",
    eng: "Transport Layer",
    unit: "세그먼트",
    color: "bg-green-500",
    protocols: [
      { name: "TCP", desc: "Transmission Control Protocol — 신뢰성 있는 연결지향형 전송. 메시지 추적, 패킷 조립/재조립 수행" },
      { name: "UDP", desc: "User Datagram Protocol — 비연결형 전송. 재조립이나 순서 보장 없음. 실시간 스트리밍에 적합" },
    ],
    role: "종단 간(end-to-end) 신뢰성 있고 효율적인 데이터 전송. 오류검출 및 복구, 흐름제어 수행",
    detail: "상위 계층의 데이터를 '세그먼트'로 분할하여 하위 계층에 전달하는 첫 번째 계층. 하위 계층의 품질이 나쁘더라도 상위 계층에 신뢰성 있는 전송을 보장하는 핵심 역할. IP 주소 + 포트 번호를 함께 사용하여 특정 애플리케이션까지 데이터를 전달",
    device: "—",
    whyUnit: "전체 데이터를 전송에 적합한 크기의 '세그먼트(segment)'로 분할. TCP 세그먼트에는 순서번호가 포함되어 수신 측에서 재조립 가능",
  },
  {
    num: 3,
    name: "네트워크 계층",
    eng: "Network Layer",
    unit: "패킷",
    color: "bg-teal-500",
    protocols: [
      { name: "IP", desc: "Internet Protocol — 주소지정 및 패킷 전달. 단편화와 재조립 수행" },
      { name: "ICMP", desc: "Internet Control Message Protocol — 오류 보고 및 진단(ping, traceroute)" },
      { name: "ARP", desc: "Address Resolution Protocol — IP 주소(논리) → MAC 주소(물리) 변환" },
      { name: "RARP", desc: "Reverse ARP — MAC 주소 → IP 주소 변환" },
    ],
    role: "개방 시스템들 간 네트워크 연결 관리 및 데이터의 교환과 중계. 라우팅, 패킷 정보 전송 수행",
    detail: "서로 다른 네트워크 간 데이터를 전달하는 계층. 논리주소(IP 주소)를 사용하여 최적 경로(라우팅)를 결정하고, 교환 기술에 대한 독립성을 보장. 데이터 교환 방식에 관계없이 일관된 서비스를 제공",
    device: "라우터 (Router) — IP 주소 기반 최적 경로 선택. 라우팅 테이블을 정적/동적으로 관리",
    whyUnit: "세그먼트에 IP 헤더(송·수신 IP 주소, TTL 등)가 추가되어 '패킷(packet)'이 됨. 이 패킷 단위로 라우팅 수행",
  },
  {
    num: 2,
    name: "데이터 링크 계층",
    eng: "Data Link Layer",
    unit: "프레임",
    color: "bg-blue-500",
    protocols: [
      { name: "Ethernet", desc: "가장 널리 사용되는 LAN 프로토콜. CSMA/CD 접근 방식" },
      { name: "PPP", desc: "Point-to-Point Protocol — 직렬 링크를 통한 점대점 연결" },
      { name: "HDLC", desc: "High-level Data Link Control — 비트 기반 동기식 프레임 전송" },
    ],
    role: "물리적 링크 간 신뢰성 있는 정보 전송. 비트 스트림을 프레임으로 구조화. 동기화, 오류제어, 흐름제어 담당",
    detail: "인접 노드 간의 신뢰성 있는 전송을 책임지는 계층. 물리주소(MAC 주소, 48비트)를 사용하여 같은 네트워크 내 장치를 식별. 프레임에 FCS(Frame Check Sequence)를 추가하여 오류를 검출하고, 흐름제어로 수신 측 과부하를 방지",
    device: "브리지 (Bridge) — MAC 주소를 확인하여 프레임을 필터링/전달. 불필요한 트래픽을 차단하여 혼잡 감소",
    whyUnit: "패킷에 프레임 헤더(MAC 주소)와 트레일러(FCS)가 추가되어 '프레임(frame)'이 됨. 이 프레임 단위로 물리적 링크 간 전송",
  },
  {
    num: 1,
    name: "물리 계층",
    eng: "Physical Layer",
    unit: "비트",
    color: "bg-purple-500",
    protocols: [
      { name: "RS-232", desc: "직렬 통신 인터페이스 표준" },
      { name: "V.35", desc: "고속 동기식 데이터 전송 인터페이스" },
      { name: "Ethernet Physical", desc: "이더넷 물리 계층 (10BASE-T, 100BASE-TX 등)" },
    ],
    role: "물리적 전송 매체상의 비트 스트림 전송 담당. 기계적·전기적·절차적 특성 취급. 전압 레벨, 핀 배치, 케이블 규격 정의",
    detail: "실제 전기 신호(또는 빛 신호)를 전송 매체를 통해 보내는 최하위 계층. 0과 1의 비트를 전압 수준, 빛의 유무, 전파의 변조 등 물리적 신호로 변환. 커넥터의 핀 배치, 케이블 규격, 신호 타이밍 등 기계적·전기적 특성을 정의",
    device: "리피터 (Repeater) — 감쇠된 신호를 증폭/재생. 허브 (Hub) — 수신 신호를 모든 포트로 브로드캐스트",
    whyUnit: "프레임이 최종적으로 0과 1의 '비트(bit)' 스트림으로 변환되어 전송 매체 위를 전파",
  },
];

export default function OSILayerModel() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [activeProto, setActiveProto] = useState<string | null>(null);

  return (
    <section>
      <SectionTitle
        title="OSI 7계층 모델"
        subtitle="ISO에서 제안한 개방 시스템 상호 연결 모델. 각 계층은 독립적으로 동작하며, 하위 계층의 품질이 상위 계층에 영향을 주지 않도록 설계. 각 계층을 클릭하여 상세 정보를 확인하세요."
      />

      <div className="space-y-1">
        {layers.map((layer) => {
          const isOpen = expanded === layer.num;
          return (
            <motion.div key={layer.num} layout>
              <button
                onClick={() => {
                  setExpanded(isOpen ? null : layer.num);
                  setActiveProto(null);
                }}
                className={`w-full rounded-lg ${layer.color} px-4 py-3 text-left text-white transition-opacity hover:opacity-90`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
                      L{layer.num}
                    </span>
                    <div>
                      <span className="font-semibold">{layer.name}</span>
                      <span className="ml-2 text-sm text-white/70">
                        {layer.eng}
                      </span>
                    </div>
                  </div>
                  <span className="rounded bg-white/20 px-2 py-0.5 text-xs font-medium">
                    {layer.unit}
                  </span>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-b-lg border border-t-0 border-gray-200 bg-white p-5 text-sm dark:border-gray-700 dark:bg-gray-900">
                      {/* Role */}
                      <div className="mb-3">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">역할</span>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">{layer.role}</p>
                      </div>

                      {/* Detailed explanation */}
                      <div className="mb-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                        <span className="text-xs font-semibold text-gray-500">상세 설명</span>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">{layer.detail}</p>
                      </div>

                      {/* Why this data unit */}
                      <div className="mb-3">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          데이터 단위: <span className="text-blue-600 dark:text-blue-400">{layer.unit}</span>
                        </span>
                        <p className="mt-1 text-xs text-gray-500">{layer.whyUnit}</p>
                      </div>

                      {/* Device */}
                      {layer.device !== "—" && (
                        <div className="mb-3">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">관련 네트워크 장비</span>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">{layer.device}</p>
                        </div>
                      )}

                      {/* Interactive protocols */}
                      <div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          프로토콜 <span className="text-xs font-normal text-gray-400">(클릭하여 설명 확인)</span>
                        </span>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {layer.protocols.map((p) => (
                            <button
                              key={p.name}
                              onClick={() => setActiveProto(activeProto === p.name ? null : p.name)}
                              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                                activeProto === p.name
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                              }`}
                            >
                              {p.name}
                            </button>
                          ))}
                        </div>
                        <AnimatePresence mode="wait">
                          {activeProto && layer.protocols.find((p) => p.name === activeProto) && (
                            <motion.div
                              key={activeProto}
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="mt-2 rounded-lg bg-blue-50 p-3 text-xs dark:bg-blue-900/20"
                            >
                              <span className="font-bold text-blue-700 dark:text-blue-300">{activeProto}</span>
                              {" — "}
                              <span className="text-gray-600 dark:text-gray-400">
                                {layer.protocols.find((p) => p.name === activeProto)?.desc}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Encapsulation diagram */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
          캡슐화 / 역캡슐화 과정
        </h3>
        <p className="mb-4 text-xs text-gray-500">
          송신 측에서는 상위 계층→하위 계층으로 내려가며 각 계층의 헤더를 추가(캡슐화)하고,
          수신 측에서는 하위→상위로 올라가며 헤더를 제거(역캡슐화)하여 원래 데이터를 복원
        </p>
        <div className="space-y-2 text-center text-xs">
          {[
            { label: "응용/표현/세션", data: "데이터", headerColor: "bg-red-100 dark:bg-red-900/30", note: "사용자 원본 데이터" },
            { label: "전송 계층", data: "TCP헤더 | 데이터", headerColor: "bg-green-100 dark:bg-green-900/30", note: "세그먼트 — 포트 번호, 순서번호 추가" },
            { label: "네트워크 계층", data: "IP헤더 | TCP헤더 | 데이터", headerColor: "bg-teal-100 dark:bg-teal-900/30", note: "패킷 — 송·수신 IP 주소, TTL 추가" },
            { label: "데이터링크 계층", data: "프레임헤더 | IP헤더 | TCP헤더 | 데이터 | FCS", headerColor: "bg-blue-100 dark:bg-blue-900/30", note: "프레임 — MAC 주소 + 오류검출(FCS) 추가" },
            { label: "물리 계층", data: "0110100101110...", headerColor: "bg-purple-100 dark:bg-purple-900/30", note: "비트 — 전기/광 신호로 변환하여 전송" },
          ].map((row, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-right text-gray-500">
                {row.label}
              </span>
              <div className="flex-1">
                <div className={`rounded-md ${row.headerColor} px-3 py-2 font-mono`}>
                  {row.data}
                </div>
                <div className="mt-0.5 text-left text-[10px] text-gray-400">{row.note}</div>
              </div>
            </div>
          ))}
          <div className="pt-2 text-gray-400">
            ↓ 송신 측 캡슐화 &nbsp;&nbsp;|&nbsp;&nbsp; 수신 측 역캡슐화 ↑
          </div>
        </div>
      </div>
    </section>
  );
}
