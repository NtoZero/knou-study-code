"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Shield, Layers, Quote } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

type StageKey = "devops" | "sre" | "pe";

interface Stage {
  key: StageKey;
  year: string;
  label: string;
  subtitle: string;
  icon: typeof GitBranch;
  focus: string;
  activities: string[];
  user: string;
  role: string;
}

const STAGES: Stage[] = [
  {
    key: "devops",
    year: "2008~",
    label: "DevOps",
    subtitle: "개발-운영의 벽을 허물다",
    icon: GitBranch,
    focus: "개발과 운영 간 협업 문화",
    activities: ["CI/CD 자동화", "IaC 도입", "공유 책임 문화"],
    user: "개발팀 + 운영팀",
    role: "기반(Foundation)",
  },
  {
    key: "sre",
    year: "2016~",
    label: "SRE",
    subtitle: "엔지니어링으로 신뢰성을 보장",
    icon: Shield,
    focus: "시스템 신뢰성 · 가용성",
    activities: ["SLI/SLO/Error Budget", "장애 분석", "토일(toil) 자동화"],
    user: "프로덕션 시스템",
    role: "보호(Protection)",
  },
  {
    key: "pe",
    year: "2022~",
    label: "Platform Engineering",
    subtitle: "개발자가 스스로 빠르게 움직이도록",
    icon: Layers,
    focus: "개발자 역량 강화(Enablement)",
    activities: ["셀프서비스 플랫폼 구축", "골든 패스 제공", "IDP 운영"],
    user: "내부 개발자(고객)",
    role: "확장(Scale)",
  },
];

const DRIVERS = [
  {
    title: "클라우드 네이티브 복잡성 폭증",
    desc: "Kubernetes, 마이크로서비스, 서비스 메시 등 인프라 스택이 팀 하나가 다루기엔 너무 깊어짐.",
  },
  {
    title: "과도한 인지 부하",
    desc: "\"You build it, you run it\" 원칙이 개발자에게 운영·보안·관찰성까지 떠안김.",
  },
  {
    title: "중복 작업과 비일관성",
    desc: "팀마다 독립적으로 도구체인·파이프라인을 구성해 거버넌스가 무너짐.",
  },
  {
    title: "DevOps 확장성 한계",
    desc: "조직이 수백 팀 규모가 되면 문화적 접근만으로는 속도를 유지할 수 없음.",
  },
];

export default function PEEvolutionTimeline() {
  const [active, setActive] = useState<StageKey>("pe");

  return (
    <section>
      <SectionTitle
        title="2. DevOps → SRE → Platform Engineering 진화"
        subtitle="PE는 DevOps를 대체하는 것이 아닌, 규모 확장을 위한 자연스러운 진화"
      />

      {/* 타임라인 */}
      <div className="relative rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 dark:border-emerald-900/50 dark:from-emerald-950/30 dark:to-gray-900">
        <div className="absolute left-6 right-6 top-[78px] h-0.5 bg-emerald-200 dark:bg-emerald-900/60" />
        <div className="relative grid gap-4 sm:grid-cols-3">
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            const isActive = active === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                className="group flex flex-col items-center text-center"
              >
                <div className="text-[10px] font-bold text-emerald-600">
                  {s.year}
                </div>
                <motion.div
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  className={`mt-1 flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all ${
                    isActive
                      ? "border-emerald-500 bg-emerald-500 text-white shadow-lg"
                      : "border-emerald-300 bg-white text-emerald-500 dark:bg-gray-900"
                  }`}
                >
                  <Icon size={20} />
                </motion.div>
                <div
                  className={`mt-3 text-sm font-bold ${
                    isActive
                      ? "text-emerald-700 dark:text-emerald-300"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {s.label}
                </div>
                <p className="text-[11px] text-gray-500">{s.subtitle}</p>
                {i < STAGES.length - 1 && (
                  <div className="mt-1 text-[10px] text-emerald-400">↓</div>
                )}
              </button>
            );
          })}
        </div>

        {/* 비교 표 */}
        <div className="mt-6 overflow-hidden rounded-xl border border-emerald-200 bg-white dark:border-emerald-900/50 dark:bg-gray-900">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-emerald-200 bg-emerald-50 text-left dark:border-emerald-900/50 dark:bg-emerald-950/30">
                <th className="p-3 font-semibold text-emerald-700 dark:text-emerald-300">
                  구분
                </th>
                {STAGES.map((s) => (
                  <th
                    key={s.key}
                    className={`p-3 font-semibold transition-colors ${
                      active === s.key
                        ? "bg-emerald-500 text-white"
                        : "text-emerald-700 dark:text-emerald-300"
                    }`}
                  >
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="bg-gray-50 p-3 font-semibold dark:bg-gray-900/60">
                  핵심 초점
                </td>
                {STAGES.map((s) => (
                  <td key={s.key} className="p-3">
                    {s.focus}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="bg-gray-50 p-3 font-semibold dark:bg-gray-900/60">
                  주요 활동
                </td>
                {STAGES.map((s) => (
                  <td key={s.key} className="p-3">
                    <ul className="space-y-0.5">
                      {s.activities.map((a) => (
                        <li key={a}>· {a}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="bg-gray-50 p-3 font-semibold dark:bg-gray-900/60">
                  사용자
                </td>
                {STAGES.map((s) => (
                  <td key={s.key} className="p-3">
                    {s.user}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="bg-gray-50 p-3 font-semibold dark:bg-gray-900/60">
                  역할
                </td>
                {STAGES.map((s) => (
                  <td key={s.key} className="p-3 font-semibold text-emerald-700 dark:text-emerald-300">
                    {s.role}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* 인용 */}
        <div className="mt-5 rounded-xl border-l-4 border-emerald-500 bg-white/70 p-4 dark:bg-gray-900/70">
          <Quote size={14} className="mb-1 text-emerald-500" />
          <p className="text-sm italic text-gray-700 dark:text-gray-300">
            "DevOps가 전달의 기반을 수립하고, SRE가 시스템을 보호하며, Platform
            Engineering은 복잡성이 팀을 느리게 만들지 않도록 보장한다."
          </p>
          <div className="mt-1 text-[10px] text-gray-500">— Spacelift</div>
        </div>
      </div>

      {/* 등장 배경 4가지 */}
      <div className="mt-6">
        <div className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">
          PE 등장의 4가지 배경
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {DRIVERS.map((d, i) => (
            <div
              key={d.title}
              className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-600 dark:bg-emerald-900/40">
                  {i + 1}
                </div>
                <div className="text-sm font-bold">{d.title}</div>
              </div>
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                {d.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
