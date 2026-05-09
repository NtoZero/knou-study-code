"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Layers, ChevronRight } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

/* ─── 구성방식 데이터 ─── */
interface ConfigMethod {
  id: string;
  name: string;
  layer: string;
  layerNum: string;
  description: string;
  pros: string[];
  cons: string[];
  ascii: string;
}

const configMethods: ConfigMethod[] = [
  {
    id: "packet",
    name: "패킷 필터링",
    layer: "네트워크/전송 계층",
    layerNum: "L3/L4",
    description: "IP주소·포트번호를 기반으로 ACL(접근제어목록)을 설정하여 패킷을 허용하거나 차단. 상태 비저장(Stateless) 방식으로 각 패킷을 독립적으로 검사.",
    pros: ["처리 속도 빠름", "비용 저렴", "구현 단순", "라우터에 통합 가능"],
    cons: ["애플리케이션 내용 검사 불가", "세션 상태 추적 불가", "IP 스푸핑 취약", "패킷 분석 한계"],
    ascii: `외부망          방화벽              내부망
  ┌──────┐    ┌─────────────┐    ┌──────┐
  │ 인터넷 │───→│ ACL 규칙 검사│───→│ LAN  │
  └──────┘    │ IP / Port   │    └──────┘
              │ ✓ 허용      │
              │ ✗ 차단      │
              └─────────────┘
  검사 대상: 출발지IP, 목적지IP, 포트, 프로토콜`,
  },
  {
    id: "circuit",
    name: "서킷 게이트웨이",
    layer: "세션 계층",
    layerNum: "L5",
    description: "TCP/UDP 세션의 성립 여부를 기반으로 허용을 결정. 세션이 성립되면 이후 패킷은 무검사로 통과. 내부 IP주소를 외부에 노출하지 않음.",
    pros: ["내부 IP주소 숨김(NAT 기능)", "세션 수준 제어", "빠른 처리 (세션 성립 후)"],
    cons: ["애플리케이션 내용 검사 불가", "세션 성립 후 무검사 = 보안 위험", "구현 복잡도 증가"],
    ascii: `외부망          서킷 게이트웨이      내부망
  ┌──────┐    ┌─────────────────┐    ┌──────┐
  │ 클라이언트│───→│ 세션 성립 확인  │    │ 서버  │
  └──────┘    │ ✓ 허용 → 릴레이 │───→└──────┘
              │ ✗ 세션 미성립차단│
              └─────────────────┘
  내부IP 비공개: 클라이언트는 GW IP만 인식`,
  },
  {
    id: "application",
    name: "애플리케이션 게이트웨이",
    layer: "응용 계층",
    layerNum: "L7",
    description: "프록시(Proxy) 방식으로 동작. 클라이언트와 서버 사이에서 대리 역할을 하며 애플리케이션 레벨의 내용까지 검사. HTTP, FTP, SMTP 등 각 프로토콜별 프록시 필요.",
    pros: ["애플리케이션 내용 검사 가능", "강력한 필터링", "내부 IP 완전 차단", "상세한 로그 기록"],
    cons: ["처리 속도 느림", "프로토콜별 프록시 구현 필요", "비용 높음", "새 프로토콜 지원 지연"],
    ascii: `외부망          프록시 서버          내부망
  ┌──────┐    ┌─────────────────┐    ┌──────┐
  │클라이언트│←→│ 대리 연결       │←→│ 서버  │
  └──────┘    │ [HTTP 프록시]   │    └──────┘
              │ [FTP 프록시]    │
              │ [SMTP 프록시]   │
              │ 내용 검사 ✓     │
              └─────────────────┘
  직접 연결 없음: 모든 트래픽이 프록시 경유`,
  },
  {
    id: "hybrid",
    name: "하이브리드",
    layer: "복합 계층",
    layerNum: "L3~L7",
    description: "패킷 필터링과 애플리케이션 게이트웨이를 결합한 방식. 일반 트래픽은 빠른 패킷 필터링으로, 중요 트래픽은 애플리케이션 GW로 처리. 유연성과 보안성 균형.",
    pros: ["유연성 높음", "성능과 보안 균형", "트래픽 유형별 최적 처리"],
    cons: ["구성 복잡성 증가", "관리 어려움", "비용 증가"],
    ascii: `외부망          하이브리드 방화벽        내부망
  ┌──────┐    ┌─────────────────────┐    ┌──────┐
  │ 인터넷 │───→│ L3/L4 패킷 필터링  │───→│ LAN  │
  └──────┘    │ ↓ (중요 트래픽)     │    └──────┘
              │ L7 애플리케이션 GW  │
              │ 내용 검사 + 프록시  │
              └─────────────────────┘
  이중 검사: 속도 + 보안 동시 확보`,
  },
];

/* ─── 구축형태 데이터 ─── */
interface DeployForm {
  id: number;
  name: string;
  shortName: string;
  components: string[];
  description: string;
  security: number; // 1~5
  complexity: number; // 1~5
  highlight?: boolean;
}

const deployForms: DeployForm[] = [
  {
    id: 1,
    name: "스크리닝 라우터",
    shortName: "Screening Router",
    components: ["라우터(패킷필터링 탑재)"],
    description: "라우터에 패킷 필터링 기능을 탑재한 가장 단순한 구성. 별도 방화벽 장비 없이 라우터 ACL로 보안 적용. 구성이 쉽고 저렴하나 취약점이 많음.",
    security: 1,
    complexity: 1,
  },
  {
    id: 2,
    name: "베스천 호스트",
    shortName: "Bastion Host",
    components: ["베스천 호스트 (강화된 서버)"],
    description: "외부 접속의 관문 역할을 하는 강화된 단일 서버. 외부에 노출되므로 강력한 보안 설정 필수. 단일 실패 지점(SPOF) 위험 존재.",
    security: 2,
    complexity: 2,
  },
  {
    id: 3,
    name: "듀얼 홈 호스트",
    shortName: "Dual-homed Host",
    components: ["NIC 2개 호스트 (외부망 / 내부망)"],
    description: "NIC(네트워크 인터페이스 카드)가 2개인 호스트를 사용. 외부망과 내부망 사이에 위치하며 IP 포워딩을 비활성화하여 직접 통신 차단. 모든 트래픽이 이 호스트를 경유.",
    security: 3,
    complexity: 2,
  },
  {
    id: 4,
    name: "스크린 호스트 게이트웨이",
    shortName: "Screened Host GW",
    components: ["스크리닝 라우터", "베스천 호스트"],
    description: "스크리닝 라우터 + 베스천 호스트 조합. 라우터가 1차 필터링, 베스천 호스트가 2차 접근 제어. 2단계 방어로 보안 강화. 라우터 우회 시 베스천 호스트가 추가 방어.",
    security: 4,
    complexity: 3,
  },
  {
    id: 5,
    name: "스크린 서브넷 게이트웨이",
    shortName: "Screened Subnet GW (DMZ)",
    components: ["외부 라우터", "DMZ (베스천 호스트)", "내부 라우터"],
    description: "3단계 방어 구조. 외부 라우터와 내부 라우터 사이에 DMZ(비무장지대)를 형성. 가장 안전한 구성이며 웹 서버 등 공개 서버를 DMZ에 배치.",
    security: 5,
    complexity: 5,
    highlight: true,
  },
];

export default function FirewallArchitectureExplorer() {
  const [activeConfig, setActiveConfig] = useState("packet");
  const [activeDeployStep, setActiveDeployStep] = useState<number | null>(null);

  const currentConfig = configMethods.find((m) => m.id === activeConfig)!;

  return (
    <section>
      <SectionTitle
        title="방화벽(Firewall) 구조 탐색기"
        subtitle="구성방식 4종 · 구축형태 5종을 인터랙티브로 비교"
      />

      {/* ── 구성방식 탭 ── */}
      <h3 className="mb-4 text-base font-bold text-gray-800 dark:text-gray-200">
        구성방식 4종 — 탭을 클릭하여 비교
      </h3>

      <div className="mb-4 flex flex-wrap gap-2">
        {configMethods.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveConfig(m.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeConfig === m.id
                ? "bg-violet-600 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeConfig}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="mb-10 rounded-xl border border-violet-200 bg-violet-50 p-6 dark:border-violet-800 dark:bg-violet-950/40"
        >
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h4 className="text-lg font-bold text-violet-800 dark:text-violet-200">
              {currentConfig.name}
            </h4>
            <span className="flex items-center gap-1.5 rounded-full bg-violet-200 px-3 py-1 text-xs font-bold text-violet-800 dark:bg-violet-900 dark:text-violet-200">
              <Layers size={12} />
              {currentConfig.layer} ({currentConfig.layerNum})
            </span>
          </div>

          <p className="mb-5 text-sm text-gray-700 dark:text-gray-300">
            {currentConfig.description}
          </p>

          {/* ASCII 다이어그램 */}
          <pre className="mb-5 overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs leading-relaxed text-green-400 dark:bg-gray-950">
            {currentConfig.ascii}
          </pre>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h5 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-green-700 dark:text-green-400">
                <CheckCircle size={14} />
                장점
              </h5>
              <ul className="space-y-1">
                {currentConfig.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-red-700 dark:text-red-400">
                <XCircle size={14} />
                단점
              </h5>
              <ul className="space-y-1">
                {currentConfig.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── 구축형태 5종 ── */}
      <h3 className="mb-2 text-base font-bold text-gray-800 dark:text-gray-200">
        구축형태 5종 — 클릭하여 방어 강도 비교
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        순서대로 클릭하면 방어 강도가 어떻게 증가하는지 확인할 수 있습니다.
      </p>

      <div className="relative">
        {/* 연결선 */}
        <div className="absolute left-6 top-8 hidden h-[calc(100%-4rem)] w-0.5 bg-gradient-to-b from-gray-200 to-violet-400 dark:from-gray-700 dark:to-violet-700 sm:block" />

        <div className="space-y-3">
          {deployForms.map((form, idx) => (
            <div key={form.id} className="relative pl-0 sm:pl-16">
              {/* 번호 뱃지 */}
              <div className={`absolute left-0 top-4 hidden h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-lg sm:flex ${
                form.highlight ? "bg-violet-600" : "bg-gray-400 dark:bg-gray-600"
              }`}>
                {form.id}
              </div>

              <button
                onClick={() => setActiveDeployStep(activeDeployStep === form.id ? null : form.id)}
                className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                  activeDeployStep === form.id
                    ? form.highlight
                      ? "border-violet-500 bg-violet-50 dark:border-violet-600 dark:bg-violet-950/40"
                      : "border-gray-400 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/50"
                    : form.highlight
                    ? "border-violet-200 bg-white hover:border-violet-400 dark:border-violet-800 dark:bg-gray-900"
                    : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white sm:hidden ${
                      form.highlight ? "bg-violet-600" : "bg-gray-400"
                    }`}>
                      {form.id}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-gray-100">
                          {form.name}
                        </span>
                        {form.highlight && (
                          <span className="rounded-full bg-violet-600 px-2 py-0.5 text-xs font-bold text-white">
                            가장 안전
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {form.shortName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* 보안 강도 바 */}
                    <div className="hidden flex-col items-end gap-1 sm:flex">
                      <span className="text-xs text-gray-500">보안 강도</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 w-4 rounded-sm ${
                              i < form.security
                                ? "bg-violet-500"
                                : "bg-gray-200 dark:bg-gray-700"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`text-gray-400 transition-transform ${activeDeployStep === form.id ? "rotate-90" : ""}`}
                    />
                  </div>
                </div>

                {/* 구성요소 태그 */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {form.components.map((c, i) => (
                    <span
                      key={i}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        form.highlight
                          ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </button>

              <AnimatePresence>
                {activeDeployStep === form.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className={`rounded-b-xl border-2 border-t-0 p-4 ${
                      form.highlight
                        ? "border-violet-500 bg-violet-50/80 dark:border-violet-600 dark:bg-violet-950/20"
                        : "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/30"
                    }`}>
                      <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
                        {form.description}
                      </p>

                      {/* DMZ 전용 시각화 */}
                      {form.id === 5 && (
                        <div className="mt-3 rounded-lg border border-violet-300 bg-white p-4 dark:border-violet-700 dark:bg-gray-900">
                          <p className="mb-3 text-xs font-semibold text-violet-700 dark:text-violet-300">
                            DMZ(비무장지대) 3단계 구조
                          </p>
                          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
                            <div className="rounded-lg bg-red-100 px-3 py-2 text-center dark:bg-red-900/30">
                              <div className="text-xs font-bold text-red-700 dark:text-red-300">인터넷</div>
                              <div className="text-xs text-red-600 dark:text-red-400">외부망</div>
                            </div>
                            <ChevronRight size={16} className="text-gray-400" />
                            <div className="rounded-lg bg-orange-100 px-3 py-2 text-center dark:bg-orange-900/30">
                              <div className="text-xs font-bold text-orange-700 dark:text-orange-300">외부 라우터</div>
                              <div className="text-xs text-orange-600 dark:text-orange-400">1차 필터링</div>
                            </div>
                            <ChevronRight size={16} className="text-gray-400" />
                            <div className="rounded-lg border-2 border-dashed border-violet-400 bg-violet-100 px-3 py-2 text-center dark:border-violet-600 dark:bg-violet-900/30">
                              <div className="text-xs font-bold text-violet-700 dark:text-violet-300">DMZ</div>
                              <div className="text-xs text-violet-600 dark:text-violet-400">베스천 호스트</div>
                              <div className="text-xs text-violet-500 dark:text-violet-400">웹서버 등</div>
                            </div>
                            <ChevronRight size={16} className="text-gray-400" />
                            <div className="rounded-lg bg-orange-100 px-3 py-2 text-center dark:bg-orange-900/30">
                              <div className="text-xs font-bold text-orange-700 dark:text-orange-300">내부 라우터</div>
                              <div className="text-xs text-orange-600 dark:text-orange-400">2차 필터링</div>
                            </div>
                            <ChevronRight size={16} className="text-gray-400" />
                            <div className="rounded-lg bg-green-100 px-3 py-2 text-center dark:bg-green-900/30">
                              <div className="text-xs font-bold text-green-700 dark:text-green-300">내부망</div>
                              <div className="text-xs text-green-600 dark:text-green-400">안전 구역</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* 방화벽 취약점 */}
      <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-red-700 dark:text-red-400">
          <XCircle size={16} />
          방화벽의 취약점
        </h4>
        <ul className="space-y-1.5">
          {[
            "내부자 공격에 무력 — 내부에서 시작되는 공격은 방화벽이 탐지 불가",
            "새로운 취약점 공격 대응 한계 — 알려지지 않은 공격(Zero-day) 대응 어려움",
            "바이러스·악성코드 포함 파일 통과 가능 — 콘텐츠 내부를 완전 검사하지 않음",
          ].map((v, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
              {v}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
