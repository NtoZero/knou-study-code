"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import NetworkTerm from "./NetworkTerm";

/* ---------------------------------------------------------------
 * HAIProtocolBuilder — HAI 헤더를 학습자가 필드별로 조합해보며
 * Impact-Level에 따른 흐름제어 경로를 시각화하는 컴포넌트.
 *
 * 과제의 inventory/procurement 예시를 피하기 위해, 시나리오는
 * 모두 가공 네트워크(의료·보안·광고 입찰 도메인) 사용.
 * ------------------------------------------------------------- */

interface Scenario {
  key: string;
  label: string;
  sourceAI: string;
  targetAI: string;
  domain: string;
  intentHint: string;
  suggestedImpact: number;
  reversible: boolean;
  reason: string;
}

const SCENARIOS: Scenario[] = [
  {
    key: "medical",
    label: "의료 분류 → 처방 제안",
    sourceAI: "triage-classifier-v5",
    targetAI: "treatment-advisor-v2",
    domain: "clinical/decision-support",
    intentHint: "환자의 증상 패턴을 분류기가 분석하여 권장 처방 경로 1건을 전달",
    suggestedImpact: 5,
    reversible: false,
    reason:
      "환자 신체에 직접 적용되는 처방은 되돌릴 수 없고, 잘못되면 치명적 결과가 발생할 수 있음.",
  },
  {
    key: "security",
    label: "이상 탐지 → 차단 실행",
    sourceAI: "anomaly-detector-a1",
    targetAI: "network-blocker-b3",
    domain: "security/network-control",
    intentHint: "비정상 트래픽 패턴을 감지하고 특정 대역 차단을 제안",
    suggestedImpact: 3,
    reversible: true,
    reason:
      "차단은 되돌릴 수 있으나 오판 시 정상 서비스가 일시 중단될 수 있어 사후 알림이 필요.",
  },
  {
    key: "adbid",
    label: "광고 입찰 협상",
    sourceAI: "bidder-alpha-12",
    targetAI: "bidder-beta-07",
    domain: "adtech/auction",
    intentHint: "밀리초 단위로 입찰가를 조정하며 낙찰 경쟁을 수행",
    suggestedImpact: 1,
    reversible: true,
    reason:
      "단일 입찰의 재무 영향은 매우 작고 되돌릴 수 있어 자동 통과 대상.",
  },
];

interface Field {
  key: string;
  termKey?: string;
  label: string;
  must: boolean;
  basis: string; // 근거가 되는 프로토콜 기능
}

const FIELDS: Field[] = [
  {
    key: "intent",
    termKey: "intentSummary",
    label: "Intent-Summary (의도 요약 자연어)",
    must: true,
    basis: "표현 계층 · 캡슐화",
  },
  {
    key: "impact",
    termKey: "impactLevel",
    label: "Impact-Level (1~5)",
    must: true,
    basis: "우선순위(priority) 전송 서비스",
  },
  {
    key: "domain",
    label: "Domain (업무 도메인)",
    must: true,
    basis: "주소 설정 · 접근 제어",
  },
  {
    key: "reversible",
    termKey: "reversibility",
    label: "Reversible (되돌림 가능 여부)",
    must: true,
    basis: "흐름제어 · 사전 검토 강제",
  },
  {
    key: "approval",
    termKey: "humanInTheLoop",
    label: "Human-Approval-Required",
    must: true,
    basis: "흐름제어 · 임계값 기반",
  },
  {
    key: "session",
    termKey: "sequencing",
    label: "Session-ID (세션 체인)",
    must: true,
    basis: "순서 결정(sequencing)",
  },
  {
    key: "audit",
    termKey: "errorControl",
    label: "Audit-Hash (무결성 해시)",
    must: true,
    basis: "오류제어 · 무결성 검증",
  },
  {
    key: "timestamp",
    label: "Timestamp",
    must: false,
    basis: "타이밍(timing) · 재현성",
  },
];

function routeFromImpact(level: number) {
  if (level <= 2)
    return {
      route: "자동 통과 + 로그 기록",
      color: "from-green-400 to-emerald-500",
      icon: CheckCircle2,
      description:
        "정책상 영향이 미미하므로 흐름을 차단하지 않음. 대시보드에 로그만 남김.",
    };
  if (level === 3)
    return {
      route: "통과 + 인간 사후 알림",
      color: "from-yellow-400 to-orange-500",
      icon: AlertTriangle,
      description:
        "메시지는 즉시 통과하지만 감독자에게 비동기 알림을 발송해 사후 검토를 유도.",
    };
  return {
    route: "일시 정지 + 승인 대기",
    color: "from-red-500 to-pink-600",
    icon: Shield,
    description:
      "통신을 일시 정지하고 지정된 시간 내 인간 승인을 기다림. 미승인 시 기본 정책(허용/차단)이 적용됨.",
  };
}

export default function HAIProtocolBuilder() {
  const [scenarioKey, setScenarioKey] = useState(SCENARIOS[0].key);
  const scenario = SCENARIOS.find((s) => s.key === scenarioKey)!;
  const [impact, setImpact] = useState(scenario.suggestedImpact);
  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(FIELDS.filter((f) => f.must).map((f) => [f.key, true])),
  );

  const route = useMemo(() => routeFromImpact(impact), [impact]);

  const missing = FIELDS.filter((f) => f.must && !selected[f.key]);
  const allMustIncluded = missing.length === 0;

  return (
    <section>
      <SectionTitle
        title="7. HAI 프로토콜 빌더"
        subtitle="시나리오 선택 → 헤더 필드 조합 → Impact-Level 슬라이더로 흐름 제어 경로 확인"
      />

      <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-pink-50 p-5 dark:border-orange-900/50 dark:from-orange-950/30 dark:to-pink-950/20">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold text-orange-700 dark:bg-gray-900/60 dark:text-orange-300">
          <Layers size={12} /> 이 예제의 AI·도메인은 과제와 무관한 가공 시나리오
        </div>

        {/* 시나리오 선택 */}
        <div className="mb-4 grid gap-2 sm:grid-cols-3">
          {SCENARIOS.map((s) => (
            <button
              key={s.key}
              onClick={() => {
                setScenarioKey(s.key);
                setImpact(s.suggestedImpact);
              }}
              className={`rounded-xl border-2 p-3 text-left text-xs transition-all ${
                scenarioKey === s.key
                  ? "border-orange-500 bg-white shadow dark:bg-gray-900"
                  : "border-gray-200 bg-white/70 hover:border-orange-300 dark:border-gray-800 dark:bg-gray-900/60"
              }`}
            >
              <div className="text-sm font-bold">{s.label}</div>
              <div className="mt-1 text-[10px] text-gray-500">
                {s.sourceAI} → {s.targetAI}
              </div>
              <div className="mt-1 text-[10px] text-orange-600">{s.domain}</div>
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* 왼쪽: 헤더 필드 조합 */}
          <div className="rounded-xl border border-orange-200 bg-white p-4 dark:border-orange-900/50 dark:bg-gray-900">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-orange-600">
              HAI Header 필드 선택
            </div>
            <div className="mb-3 text-[11px] text-gray-500">
              필수 필드를 모두 포함해야 헤더가 <NetworkTerm term="encapsulation" label="캡슐화" />{" "}
              요건을 만족함.
            </div>
            <div className="space-y-1.5">
              {FIELDS.map((f) => {
                const on = !!selected[f.key];
                return (
                  <label
                    key={f.key}
                    className={`flex cursor-pointer items-start gap-2 rounded-lg border p-2 text-[11px] transition-all ${
                      on
                        ? "border-orange-400 bg-orange-50 dark:bg-orange-950/30"
                        : "border-gray-200 hover:border-orange-300 dark:border-gray-800"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() =>
                        setSelected((p) => ({ ...p, [f.key]: !p[f.key] }))
                      }
                      className="mt-0.5 accent-orange-500"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">
                        {f.termKey ? (
                          <NetworkTerm term={f.termKey} label={f.label} />
                        ) : (
                          f.label
                        )}
                        {f.must && (
                          <span className="ml-1 rounded bg-red-100 px-1 text-[9px] font-bold text-red-700 dark:bg-red-950/50 dark:text-red-300">
                            필수
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 text-[10px] text-gray-500">
                        근거 원리: {f.basis}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
            {!allMustIncluded && (
              <div className="mt-3 rounded-md bg-red-50 px-2 py-1 text-[10px] text-red-700 dark:bg-red-950/30 dark:text-red-300">
                누락: {missing.map((m) => m.label.split(" ")[0]).join(", ")}
              </div>
            )}
          </div>

          {/* 오른쪽: Impact 슬라이더 + 경로 */}
          <div className="rounded-xl border border-orange-200 bg-white p-4 dark:border-orange-900/50 dark:bg-gray-900">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-orange-600">
              Impact-Level 조정
            </div>
            <div className="rounded-lg bg-gray-50 p-2 text-[11px] text-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
              <strong>의도:</strong> {scenario.intentHint}
            </div>
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-semibold">
                  <NetworkTerm term="impactLevel" label="Impact-Level" />
                </span>
                <span className="font-mono text-lg font-bold text-orange-600">
                  {impact} / 5
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={impact}
                onChange={(e) => setImpact(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="mt-1 flex justify-between text-[9px] text-gray-500">
                <span>1 무시 가능</span>
                <span>3 알림</span>
                <span>5 치명적</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={route.route}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={`mt-4 rounded-xl bg-gradient-to-br ${route.color} p-3 text-white shadow-lg`}
              >
                <div className="flex items-center gap-2 text-sm font-bold">
                  <route.icon size={16} /> {route.route}
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed opacity-95">
                  {route.description}
                </p>
                <div className="mt-2 rounded bg-white/20 px-2 py-1 text-[10px]">
                  <NetworkTerm term="flowControl" label="흐름제어" /> 원리 적용 —
                  수신 측(인간 감독자)의 처리 한계를 넘지 않도록 상류의 통신
                  속도를 조절.
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-3 rounded-lg border border-dashed border-orange-300 bg-orange-50/50 p-2 text-[10px] text-orange-900 dark:border-orange-800 dark:bg-orange-950/20 dark:text-orange-200">
              <strong>권장 판단:</strong> 이 시나리오의 Impact는 보통{" "}
              <strong>{scenario.suggestedImpact}</strong> 수준. 이유:{" "}
              {scenario.reason}
            </div>
          </div>
        </div>

        {/* 헤더 미리보기 */}
        <div className="mt-4 rounded-xl border border-orange-300 bg-gray-900 p-4 font-mono text-[11px] leading-relaxed text-green-300 dark:bg-black">
          <div className="mb-1 text-[10px] uppercase tracking-wider text-orange-400">
            선택한 필드로 조립된 HAI Header 미리보기
          </div>
          <pre className="whitespace-pre-wrap">
            {`{
  ${selected.intent ? `"Intent-Summary":    "${scenario.intentHint}",` : "// Intent-Summary 누락"}
  ${selected.impact ? `"Impact-Level":      ${impact},` : "// Impact-Level 누락"}
  ${selected.domain ? `"Domain":            "${scenario.domain}",` : "// Domain 누락"}
  ${selected.reversible ? `"Reversible":        ${scenario.reversible},` : "// Reversible 누락"}
  ${selected.approval ? `"Human-Approval":    ${impact >= 4 ? "true" : "false"},` : "// Human-Approval 누락"}
  ${selected.session ? `"Session-ID":        "ses_${scenario.key}_${impact}xyz",` : "// Session-ID 누락"}
  ${selected.audit ? `"Audit-Hash":        "sha256:abc...",` : "// Audit-Hash 누락"}
  ${selected.timestamp ? `"Timestamp":         "2026-04-12T09:00:00Z"` : "// Timestamp (선택)"}
}`}
          </pre>
        </div>
      </div>
    </section>
  );
}
