"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookMarked,
  Cloud,
  GitMerge,
  Route,
  Scale,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

type LayerKey = "portal" | "catalog" | "infra" | "cicd" | "golden";

interface Layer {
  key: LayerKey;
  label: string;
  korean: string;
  icon: typeof LayoutDashboard;
  role: string;
  tools: string[];
  example: string;
}

const LAYERS: Layer[] = [
  {
    key: "portal",
    label: "Developer Portal",
    korean: "셀프서비스 개발자 포털",
    icon: LayoutDashboard,
    role: "개발자가 배포·환경·모니터링·문서에 한 화면에서 접근할 수 있는 중앙 대시보드.",
    tools: ["Backstage", "Port", "Cortex", "OpsLevel"],
    example: '"주문 서비스 v1.3 배포" 버튼 한 번으로 스테이징 → 프로덕션 자동 배포',
  },
  {
    key: "catalog",
    label: "Service Catalog",
    korean: "서비스(소프트웨어) 카탈로그",
    icon: BookMarked,
    role: "조직 내 모든 서비스·API·리소스를 한 곳에서 관리하고 소유자·의존성을 추적.",
    tools: ["Backstage Software Catalog", "Cortex Service Catalog"],
    example: '"이 API의 소유 팀은? 다운스트림은?"을 한 번에 조회',
  },
  {
    key: "infra",
    label: "Infrastructure Orchestration",
    korean: "인프라 오케스트레이션 (IaC)",
    icon: Cloud,
    role: "코드로 인프라·환경·시크릿을 정의하고 자동 프로비저닝. 수작업 제로를 지향.",
    tools: ["Terraform", "Pulumi", "Crossplane", "Humanitec", "Kubernetes"],
    example: "서비스 매니페스트 제출 → DB · 네트워크 · DNS 자동 생성",
  },
  {
    key: "cicd",
    label: "CI/CD Pipelines",
    korean: "CI/CD 파이프라인",
    icon: GitMerge,
    role: "빌드·테스트·배포의 표준화된 자동화 파이프라인. 모든 팀이 동일한 워크플로우를 재사용.",
    tools: ["ArgoCD", "GitHub Actions", "Jenkins", "Tekton", "FluxCD"],
    example: "PR merge → 자동 빌드 → 카나리 배포 → 롤백까지 Git 한 번으로",
  },
  {
    key: "golden",
    label: "Golden Paths",
    korean: "골든 패스(Golden Paths)",
    icon: Route,
    role: "플랫폼 팀이 미리 닦아 놓은 '모범 사례 고속도로'. 새 서비스 생성 시 템플릿 선택만으로 시작.",
    tools: ["Backstage Software Templates", "자체 CLI", "Cookiecutter"],
    example: "'새 Node.js API' 템플릿 선택 → 레포 · CI · 관찰성 · 보안 기본값 자동 장착",
  },
];

export default function IDPArchitecture() {
  const [active, setActive] = useState<LayerKey>("portal");
  const current = LAYERS.find((l) => l.key === active)!;

  return (
    <section>
      <SectionTitle
        title="3. 내부 개발자 플랫폼(IDP) 5대 구성 요소"
        subtitle="셀프서비스 포털부터 골든 패스까지 · 레이어 클릭으로 역할 확인"
      />

      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 dark:border-emerald-900/50 dark:from-emerald-950/30 dark:to-gray-900">
        {/* Layered 시각화 */}
        <div className="space-y-2">
          {LAYERS.map((l) => {
            const Icon = l.icon;
            const isActive = active === l.key;
            return (
              <motion.button
                key={l.key}
                onClick={() => setActive(l.key)}
                whileHover={{ x: 4 }}
                className={`flex w-full items-center gap-4 rounded-xl border-2 p-3 text-left transition-all ${
                  isActive
                    ? "border-emerald-500 bg-white shadow-md dark:bg-gray-900"
                    : "border-emerald-100 bg-white/70 hover:border-emerald-300 dark:border-emerald-900/40 dark:bg-gray-900/40"
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                    isActive
                      ? "bg-emerald-500 text-white"
                      : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300"
                  }`}
                >
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    {l.label}
                  </div>
                  <div className="truncate text-sm font-semibold">
                    {l.korean}
                  </div>
                </div>
                <div className="hidden shrink-0 text-[10px] text-gray-400 sm:block">
                  클릭
                </div>
              </motion.button>
            );
          })}

          {/* 인프라 기반층 */}
          <div className="mt-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-3 text-center text-[11px] text-gray-500 dark:border-gray-700 dark:bg-gray-900/40">
            <span className="font-semibold">인프라스트럭처 기반</span> ·
            Kubernetes / Cloud / Networking / Storage
          </div>
        </div>

        {/* 상세 정보 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-5 rounded-xl border border-emerald-300 bg-white p-5 dark:border-emerald-800 dark:bg-gray-900"
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
              {current.label}
            </div>
            <div className="text-base font-semibold">{current.korean}</div>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {current.role}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {current.tools.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
              예 · {current.example}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 균형 설명 */}
      <div className="mt-5 rounded-xl border border-emerald-200 bg-white p-5 dark:border-emerald-900/50 dark:bg-gray-900">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
          <Scale size={16} /> IDP 설계의 핵심 균형
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-emerald-50/60 p-3 dark:bg-emerald-950/30">
            <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
              낮춰야 할 것
            </div>
            <div className="mt-1 text-xs text-gray-700 dark:text-gray-300">
              개발자 인지 부하 · 반복 설정 · 부서 간 핑퐁
            </div>
          </div>
          <div className="rounded-lg bg-amber-50/60 p-3 dark:bg-amber-950/30">
            <div className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
              유지해야 할 것
            </div>
            <div className="mt-1 text-xs text-gray-700 dark:text-gray-300">
              기반 기술 이해 · 디버깅 가능성 · 탈출구(escape hatch)
            </div>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-gray-500">
          과도한 추상화는 장애 상황에서 개발자가 내부를 전혀 볼 수 없게 만드는
          역효과를 낳음 → IDP는 <strong>추상화 + 투명성</strong>의 균형 필요.
        </p>
      </div>
    </section>
  );
}
