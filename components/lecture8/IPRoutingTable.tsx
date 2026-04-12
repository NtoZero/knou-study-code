"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

type Scenario = "direct" | "indirect";

const fields = [
  { name: "마스크", desc: "목적지 주소와 AND 연산하여 네트워크 주소를 추출하는 데 사용" },
  { name: "목적지 주소", desc: "데이터그램이 전달될 목적지 네트워크 또는 호스트의 IP 주소" },
  { name: "다음홉 주소", desc: "목적지까지 가기 위해 다음으로 전달해야 할 라우터(다음 홉)의 IP 주소" },
  { name: "플래그", desc: "경로의 상태를 나타냄 (U: 경로 사용 가능, G: 게이트웨이 경유, H: 호스트 경로 등)" },
  { name: "참조횟수", desc: "해당 경로를 현재 사용 중인 활성 연결의 수" },
  { name: "사용", desc: "해당 경로를 통해 전송된 패킷의 수" },
  { name: "인터페이스", desc: "해당 경로로 패킷을 내보낼 때 사용하는 네트워크 인터페이스 이름" },
];

const tableRows = [
  { mask: "255.0.0.0", dest: "124.0.0.0", nexthop: "145.6.7.23", flag: "UG", ref: "4", use: "20", iface: "m2" },
  { mask: "255.255.255.0", dest: "163.100.21.0", nexthop: "163.100.21.35", flag: "U", ref: "2", use: "314", iface: "eth0" },
  { mask: "255.255.255.0", dest: "163.100.23.0", nexthop: "163.100.21.17", flag: "UG", ref: "1", use: "57", iface: "eth0" },
];

const directSteps = [
  {
    label: "① 목적지 확인",
    detail: "송신 호스트 A(163.100.21.35)의 라우팅 테이블을 조회 → 목적지 163.100.21.33이 동일 네트워크(163.100.21.0/24)에 속함을 확인",
    highlight: "direct",
  },
  {
    label: "② ARP 요청 (브로드캐스트)",
    detail: "163.100.21.33에 해당하는 물리주소(MAC)를 얻기 위해 이더넷 브로드캐스트로 ARP 요청 전송",
    highlight: "arp",
  },
  {
    label: "③ ARP 응답 (유니캐스트)",
    detail: "호스트 B(163.100.21.33)가 자신의 MAC 주소를 담아 유니캐스트로 응답",
    highlight: "arp",
  },
  {
    label: "④ 직접 전달",
    detail: "[링크헤더 (목적지 MAC=B)] [IP헤더 (목적지 IP=163.100.21.33)] [데이터] 형태로 동일 이더넷 세그먼트에 직접 전달",
    highlight: "direct",
  },
];

const indirectSteps = [
  {
    label: "① 목적지 확인 — 다른 네트워크",
    detail: "A(163.100.21.35)의 라우팅 테이블 조회 → 목적지 163.100.23.43은 다른 네트워크. 다음 홉 = R_A(163.100.21.17)로 결정",
    actor: "A",
  },
  {
    label: "② A → R_A 전송",
    detail: "[링크헤더 (목적지 MAC=R_A)] [IP헤더 (목적지 IP=163.100.23.43)] [데이터]\n→ IP 헤더의 목적지는 최종 목적지(163.100.23.43) 유지. 링크 헤더 목적지만 R_A의 MAC",
    actor: "A→R_A",
  },
  {
    label: "③ R_A: 링크 헤더 교체 후 R_B로 전달",
    detail: "R_A가 라우팅 테이블에서 163.100.23.43의 다음 홉 = R_B(163.100.23.45) 결정\n→ 링크 헤더를 R_B의 MAC으로 교체하여 재전송. IP 헤더 목적지(163.100.23.43) 그대로 유지",
    actor: "R_A→R_B",
  },
  {
    label: "④ R_B → B 직접 전달",
    detail: "R_B(163.100.23.45)가 163.100.23.0/24 네트워크에서 163.100.23.43 = 호스트 B임을 확인\n→ ARP로 B의 MAC 획득 후 직접 전달",
    actor: "R_B→B",
  },
];

export default function IPRoutingTable() {
  const [activeField, setActiveField] = useState<number | null>(null);
  const [scenario, setScenario] = useState<Scenario>("direct");
  const [step, setStep] = useState<number | null>(null);

  const steps = scenario === "direct" ? directSteps : indirectSteps;

  return (
    <section>
      <SectionTitle
        title="IP 라우팅 테이블"
        subtitle="경로 결정 구조 · 직접/간접 전달 시나리오"
      />

      {/* 라우팅 개요 */}
      <div className="mb-6 rounded-xl border border-pink-200 bg-pink-50 p-4 text-sm dark:border-pink-800/40 dark:bg-pink-900/10">
        <p className="text-pink-800 dark:text-pink-200">
          <strong>라우팅</strong>: IP 데이터그램이 목적지 호스트까지 진행하면서{" "}
          <strong>경유할 경로를 결정</strong>하는 것. 호스트는 자신의 물리적 네트워크에
          연결된 라우터 정보를 <strong>라우팅 테이블</strong>에 관리한다.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-white p-3 dark:bg-gray-800">
            <div className="mb-1 font-bold text-pink-600">IP</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              송신자·수신자 + 경로 상의 <strong>모든 라우터</strong>가 데이터그램 전달에 관여
            </div>
          </div>
          <div className="rounded-lg bg-white p-3 dark:bg-gray-800">
            <div className="mb-1 font-bold text-blue-600">TCP</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              <strong>송신자와 수신자만</strong> 세그먼트 전달에 관여
            </div>
          </div>
        </div>
      </div>

      {/* 라우팅 테이블 구조 */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">
          라우팅 테이블 구조 (7개 필드)
        </h3>
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
          필드를 클릭하면 설명이 표시됩니다.
        </p>

        {/* 필드 헤더 */}
        <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px]">
          {fields.map((f, i) => (
            <button
              key={i}
              onClick={() => setActiveField(activeField === i ? null : i)}
              className={`rounded-md px-1 py-2 font-semibold transition-colors ${
                activeField === i
                  ? "bg-pink-500 text-white"
                  : "bg-pink-100 text-pink-700 hover:bg-pink-200 dark:bg-pink-900/30 dark:text-pink-300"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>

        {/* 데이터 행 */}
        {tableRows.map((row, ri) => (
          <div key={ri} className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px]">
            {[row.mask, row.dest, row.nexthop, row.flag, row.ref, row.use, row.iface].map(
              (val, ci) => (
                <div
                  key={ci}
                  className={`rounded-md px-1 py-2 font-mono transition-colors ${
                    activeField === ci
                      ? "bg-pink-50 ring-1 ring-pink-400 dark:bg-pink-900/20"
                      : "bg-gray-50 dark:bg-gray-800"
                  }`}
                >
                  {val}
                </div>
              )
            )}
          </div>
        ))}

        {/* 필드 설명 */}
        <AnimatePresence>
          {activeField !== null && (
            <motion.div
              key={activeField}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-3 rounded-lg bg-pink-50 p-3 text-xs text-pink-800 dark:bg-pink-900/20 dark:text-pink-200"
            >
              <span className="font-bold">{fields[activeField].name}</span>:{" "}
              {fields[activeField].desc}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 네트워크 구성도 */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">
          네트워크 구성 예시
        </h3>
        <div className="overflow-x-auto">
          <div className="flex min-w-[480px] items-center justify-between gap-2 text-xs">
            {/* Net1 */}
            <div className="flex flex-col items-center gap-1">
              <div className="rounded-lg bg-blue-50 px-3 py-2 text-center font-mono dark:bg-blue-900/20">
                <div className="font-bold text-blue-700 dark:text-blue-300">컴퓨터 1</div>
                <div className="text-gray-500">192.168.35.x</div>
              </div>
              <div className="rounded-md bg-blue-100 px-2 py-1 text-[10px] text-blue-600 dark:bg-blue-900/30">
                Net1: 192.168.35.0/24
              </div>
            </div>
            <div className="text-gray-400">──</div>
            {/* Router 1 */}
            <div className="flex flex-col items-center gap-1">
              <div className="rounded-lg bg-pink-100 px-3 py-2 text-center font-bold text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
                라우터
              </div>
              <div className="text-[10px] text-gray-500">35·36·37 등록</div>
            </div>
            <div className="text-gray-400">──</div>
            {/* Net2 */}
            <div className="flex flex-col items-center gap-1">
              <div className="rounded-lg bg-green-50 px-3 py-2 text-center font-mono dark:bg-green-900/20">
                <div className="font-bold text-green-700 dark:text-green-300">컴퓨터 5</div>
                <div className="text-gray-500">192.168.36.x</div>
              </div>
              <div className="rounded-md bg-green-100 px-2 py-1 text-[10px] text-green-600 dark:bg-green-900/30">
                Net2: 192.168.36.0/24
              </div>
            </div>
            <div className="text-gray-400">──</div>
            {/* Router 2 */}
            <div className="flex flex-col items-center gap-1">
              <div className="rounded-lg bg-pink-100 px-3 py-2 text-center font-bold text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
                라우터
              </div>
              <div className="text-[10px] text-gray-500">35·36·37 등록</div>
            </div>
            <div className="text-gray-400">──</div>
            {/* Net3 */}
            <div className="flex flex-col items-center gap-1">
              <div className="rounded-lg bg-purple-50 px-3 py-2 text-center font-mono dark:bg-purple-900/20">
                <div className="font-bold text-purple-700 dark:text-purple-300">컴퓨터 9</div>
                <div className="text-gray-500">192.168.37.x</div>
              </div>
              <div className="rounded-md bg-purple-100 px-2 py-1 text-[10px] text-purple-600 dark:bg-purple-900/30">
                Net3: 192.168.37.0/24
              </div>
            </div>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
          각 라우터의 테이블에는 세 네트워크(192.168.35·36·37.0/24) 경로가 모두 등록됨.
        </p>
      </div>

      {/* 직접/간접 전달 시나리오 */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">
          데이터그램 전달 시나리오
        </h3>

        {/* 탭 */}
        <div className="mb-4 flex gap-2">
          {(["direct", "indirect"] as Scenario[]).map((s) => (
            <button
              key={s}
              onClick={() => { setScenario(s); setStep(null); }}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                scenario === s
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {s === "direct" ? "① 동일 네트워크 (직접 전달)" : "② 다른 네트워크 (간접 전달)"}
            </button>
          ))}
        </div>

        {/* 시나리오 요약 */}
        <div className="mb-4 rounded-lg bg-gray-50 p-3 text-xs dark:bg-gray-800">
          {scenario === "direct" ? (
            <div className="flex items-center gap-3 font-mono">
              <span className="rounded bg-blue-100 px-2 py-1 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                호스트 A<br />163.100.21.35
              </span>
              <span className="text-gray-400">────────────────</span>
              <span className="text-[10px] text-gray-500 -mx-2">이더넷 163.100.21</span>
              <span className="text-gray-400">────────────────</span>
              <span className="rounded bg-green-100 px-2 py-1 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                호스트 B<br />163.100.21.33
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 font-mono">
              <span className="rounded bg-blue-100 px-2 py-1 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                호스트 A<br />163.100.21.35
              </span>
              <span className="text-gray-400">──</span>
              <span className="rounded bg-pink-100 px-2 py-1 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
                R_A<br />163.100.21.17
              </span>
              <span className="text-gray-400">──</span>
              <span className="text-[10px] text-gray-500">Net1</span>
              <span className="text-gray-400">──</span>
              <span className="rounded bg-orange-100 px-2 py-1 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                R_B<br />163.100.23.45
              </span>
              <span className="text-gray-400">──</span>
              <span className="rounded bg-green-100 px-2 py-1 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                호스트 B<br />163.100.23.43
              </span>
            </div>
          )}
        </div>

        {/* 단계별 설명 */}
        <div className="space-y-2">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setStep(step === i ? null : i)}
              className={`block w-full rounded-lg border-2 p-3 text-left text-xs transition-colors ${
                step === i
                  ? "border-pink-400 bg-pink-50 dark:border-pink-600 dark:bg-pink-900/20"
                  : "border-gray-200 hover:border-pink-200 dark:border-gray-700"
              }`}
            >
              <div className="font-semibold text-gray-800 dark:text-gray-200">{s.label}</div>
              <AnimatePresence>
                {step === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 whitespace-pre-line text-gray-600 dark:text-gray-400"
                  >
                    {s.detail}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>

        {/* 핵심 원칙 */}
        {scenario === "indirect" && (
          <div className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
            <strong>핵심 원칙</strong>: 각 홉마다{" "}
            <strong>링크 계층 헤더(물리주소)는 교체</strong>되지만, IP 헤더의{" "}
            <strong>목적지 IP 주소는 최종 목적지까지 변하지 않고 유지</strong>된다.
          </div>
        )}
      </div>
    </section>
  );
}
