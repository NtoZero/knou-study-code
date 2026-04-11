"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Repeat, Brain, Waves, ExternalLink, TrendingUp } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

type DimKey = "feedback" | "cognitive" | "flow";

interface Dimension {
  key: DimKey;
  label: string;
  korean: string;
  icon: typeof Repeat;
  short: string;
  definition: string;
  metrics: string[];
  badExample: string;
  goodExample: string;
}

const DIMENSIONS: Dimension[] = [
  {
    key: "feedback",
    label: "Feedback Loops",
    korean: "피드백 루프",
    icon: Repeat,
    short: "얼마나 빠르게 작업 결과를 확인할 수 있는가",
    definition:
      "개발자가 코드 변경·빌드·테스트·배포 과정에서 결과를 확인하기까지 걸리는 시간. 짧고 안정적인 루프는 실수를 즉시 교정 가능하게 하여 품질과 속도를 동시에 향상시킴.",
    metrics: [
      "CI/CD 빌드 시간 (평균·p95)",
      "코드 리뷰 첫 응답 시간",
      "로컬 핫리로드 지연",
      "테스트 스위트 실행 시간",
    ],
    badExample: "PR을 올린 뒤 리뷰 피드백을 받기까지 24시간 이상 소요",
    goodExample: "커밋 → CI 통과 → 리뷰 코멘트까지 1시간 이내 완결",
  },
  {
    key: "cognitive",
    label: "Cognitive Load",
    korean: "인지 부하",
    icon: Brain,
    short: "기본 업무를 수행하는 데 필요한 정신적 노력",
    definition:
      "개발자가 자신의 일을 끝내기 위해 머리에 담아야 하는 정보량. 도구가 많고 문서가 흩어져 있을수록 부하는 커지고, 본질적 문제 해결에 쓸 수 있는 집중력은 줄어듦.",
    metrics: [
      "내부 문서의 최신성·검색 가능성",
      "코드베이스 복잡도 (결합도·모듈 수)",
      "개발자가 사용해야 하는 도구 개수",
      "새 서비스 생성 시 필요한 설정 단계 수",
    ],
    badExample: "신규 서비스 하나 만들려면 6개 레포와 4가지 도구 설정이 필요",
    goodExample: "골든 패스 템플릿 하나로 10분 만에 서비스 부트스트랩 완료",
  },
  {
    key: "flow",
    label: "Flow State",
    korean: "몰입 상태",
    icon: Waves,
    short: "방해 없이 집중하여 작업할 수 있는 능력",
    definition:
      "개발자가 깊이 있는 문제 해결에 몰입해 있는 상태. 회의·티켓·알림·맥락 전환이 잦을수록 몰입은 깨지고, 한 번 끊어진 몰입을 회복하는 데는 15~20분이 걸림.",
    metrics: [
      "주간 회의 없는 시간대 (Focus time) 비율",
      "일일 컨텍스트 스위칭 횟수",
      "방해 알림 빈도 (Slack 멘션 등)",
      "주간 self-reported 몰입 만족도",
    ],
    badExample: "하루에 회의 6건, 그 사이 30분 단위로 코드 작업",
    goodExample: "오전을 회의 없는 집중 시간으로 보호 · 오후에 협업 블록",
  },
];

export default function DXFramework() {
  const [active, setActive] = useState<DimKey>("feedback");
  const current = DIMENSIONS.find((d) => d.key === active)!;

  return (
    <section>
      <SectionTitle
        title="1. 개발자 경험(DX) 3차원 프레임워크"
        subtitle="Abi Noda et al., DevEx: What Actually Drives Productivity, ACM Queue 2023"
      />

      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 dark:border-emerald-900/50 dark:from-emerald-950/30 dark:to-gray-900">
        <p className="mb-5 text-sm text-gray-600 dark:text-gray-400">
          DevEx 프레임워크는 개발자 경험을 <strong>세 개의 독립적 차원</strong>
          으로 분해함. 각 차원은 서로 영향을 주고받지만, 측정과 개선은 각각 따로
          접근해야 효과가 명확함.
        </p>

        {/* 카드 선택 */}
        <div className="grid gap-3 sm:grid-cols-3">
          {DIMENSIONS.map((d) => {
            const Icon = d.icon;
            const isActive = active === d.key;
            return (
              <button
                key={d.key}
                onClick={() => setActive(d.key)}
                className={`rounded-xl border-2 p-4 text-left transition-all ${
                  isActive
                    ? "border-emerald-500 bg-white shadow-md dark:bg-gray-900"
                    : "border-emerald-100 bg-white/60 hover:border-emerald-300 dark:border-emerald-900/40 dark:bg-gray-900/40"
                }`}
              >
                <div
                  className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${
                    isActive
                      ? "bg-emerald-500 text-white"
                      : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300"
                  }`}
                >
                  <Icon size={16} />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                  {d.label}
                </div>
                <div className="text-sm font-semibold">{d.korean}</div>
                <p className="mt-1 text-[11px] text-gray-500">{d.short}</p>
              </button>
            );
          })}
        </div>

        {/* 확장 설명 */}
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
              {current.label} · {current.korean}
            </div>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {current.definition}
            </p>

            <div className="mt-4">
              <div className="mb-2 text-[11px] font-bold text-gray-500">
                대표 측정 지표
              </div>
              <ul className="grid gap-1.5 text-xs text-gray-700 dark:text-gray-300 sm:grid-cols-2">
                {current.metrics.map((m) => (
                  <li key={m} className="flex items-start gap-1.5">
                    <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-red-200 bg-red-50/60 p-3 text-[11px] dark:border-red-900/40 dark:bg-red-950/30">
                <div className="font-bold text-red-700 dark:text-red-300">
                  나쁜 예
                </div>
                <p className="mt-1 text-red-900/80 dark:text-red-200/80">
                  {current.badExample}
                </p>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 text-[11px] dark:border-emerald-900/40 dark:bg-emerald-950/30">
                <div className="font-bold text-emerald-700 dark:text-emerald-300">
                  좋은 예
                </div>
                <p className="mt-1 text-emerald-900/80 dark:text-emerald-200/80">
                  {current.goodExample}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 정량 효과 뱃지 */}
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge label="DX 1점 개선 = 주당 13분 절감" />
          <Badge label="우수 DX 팀은 속도·품질 4~5배" />
          <Badge label="출시 시간 단축 · 오류 감소" />
        </div>

        {/* 출처 */}
        <div className="mt-5 flex flex-wrap gap-3 text-[11px] text-emerald-700 dark:text-emerald-400">
          <a
            href="https://queue.acm.org/detail.cfm?id=3595878"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 hover:underline"
          >
            <ExternalLink size={11} /> ACM Queue · DevEx 논문
          </a>
          <a
            href="https://getdx.com/blog/developer-experience/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 hover:underline"
          >
            <ExternalLink size={11} /> GetDX Blog
          </a>
        </div>
      </div>
    </section>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-white px-3 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm dark:border-emerald-800 dark:bg-gray-900 dark:text-emerald-300">
      <TrendingUp size={11} /> {label}
    </span>
  );
}
