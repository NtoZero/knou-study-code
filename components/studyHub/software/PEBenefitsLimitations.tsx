"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, Building2, FileText } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

type Tab = "pros" | "cons" | "cases";

const PROS = [
  {
    title: "인지 부하 경감",
    desc: "인프라·운영·보안을 플랫폼이 추상화해 개발자는 비즈니스 로직에 집중.",
    stat: "Spotify 40% 감소",
  },
  {
    title: "개발 속도 향상",
    desc: "셀프서비스 배포·프로비저닝으로 티켓 대기 시간 제거.",
    stat: "배포 빈도 4배 향상",
  },
  {
    title: "표준화와 거버넌스",
    desc: "골든 패스로 모든 팀이 동일한 보안·컴플라이언스 기준을 자동 적용.",
    stat: "수동 설정 90% 감소",
  },
  {
    title: "온보딩 단축",
    desc: "문서 · 템플릿 · 카탈로그 덕분에 신규 개발자가 며칠 안에 생산적으로 진입.",
    stat: "Spotify 30% 단축",
  },
  {
    title: "보안 내장(Shift-Left)",
    desc: "시크릿 관리·정적 분석·이미지 스캔이 파이프라인에 기본 탑재.",
    stat: "사고 대응 시간 감소",
  },
];

const CONS = [
  {
    title: "초기 구축 비용",
    desc: "플랫폼 팀 구성, 도구 선정, 통합 파이프라인 구축에 상당한 인력·시간 투자 필요.",
  },
  {
    title: "플랫폼 팀 조직 필요",
    desc: "DevOps·UX·API 설계를 함께 할 수 있는 다분야 인재 확보가 어려움.",
  },
  {
    title: "사일로 위험",
    desc: "플랫폼 팀과 개발팀이 소통하지 않으면 'IT 티켓의 부활'이 되어 오히려 느려짐.",
  },
  {
    title: "과도한 추상화",
    desc: "탈출구(escape hatch)가 없으면 장애 시 개발자가 내부를 볼 수 없어 디버깅이 막힘.",
  },
  {
    title: "개발자 자율성 제약",
    desc: "표준이 엄격해질수록 혁신·실험이 위축될 수 있음. Platform-as-a-Product 태도로 해소.",
  },
];

const CASES = [
  {
    company: "Spotify",
    name: "Backstage",
    summary:
      "수천 개 마이크로서비스 관리를 위해 구축한 개발자 포털. 2020년 오픈소스 공개 후 CNCF에 기증되어 포털 프레임워크 시장 점유율 89%로 사실상 표준이 됨.",
    numbers: ["인지 부하 40% ↓", "온보딩 30% ↓", "인프라 설정 70% ↓"],
  },
  {
    company: "Netflix",
    name: "Federated Platform Console",
    summary:
      "분산된 도구를 통합한 'Platform Experiences and Design' 팀 주도 포털. Backstage 기반으로 SDLC 전반을 원스톱 제공.",
    numbers: ["Backstage 기반 연합 콘솔", "PXD 팀 주도"],
  },
  {
    company: "Zalando",
    name: "Sunrise",
    summary:
      "\"You Build It, You Run It\" 원칙 실현을 위해 Backstage 위에 구축한 IDP. 소수 플랫폼 엔지니어로 전체 조직을 지원.",
    numbers: ["Backstage 기반", "유연한 투자 우선순위"],
  },
  {
    company: "Mercado Libre",
    name: "FURY",
    summary:
      "8년 전부터 구축한 IDP. 대표 비즈니스 사례를 선정해 점진적으로 마이그레이션하며 리드 타임 전후 비교 데이터를 수집.",
    numbers: ["점진적 채택", "비즈니스 사례 기반 마이그레이션"],
  },
];

const ANSWER_STRUCTURE = [
  "① DX의 개념과 정의 (3차원 프레임워크 인용)",
  "② PE 등장 배경 (클라우드 네이티브 복잡성, 인지 부하)",
  "③ DevOps / SRE와의 차이점 (비교 표)",
  "④ IDP 개념 및 5대 구성 요소 (아키텍처 그림)",
  "⑤ 기대 효과 · 장점 (정량 지표 포함)",
  "⑥ 한계점과 과제",
  "⑦ 적용 사례 (Spotify · Netflix 등)",
  "⑧ 참고 문헌 명시",
];

export default function PEBenefitsLimitations() {
  const [tab, setTab] = useState<Tab>("pros");

  return (
    <section>
      <SectionTitle
        title="7. PE 장단점 · 적용 사례 · 답안 구조 가이드"
        subtitle="문제 1 서술을 위한 장·단점 정리와 실제 기업 사례"
      />

      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 dark:border-emerald-900/50 dark:from-emerald-950/30 dark:to-gray-900">
        {/* 탭 */}
        <div className="mb-4 flex gap-2">
          <TabButton
            active={tab === "pros"}
            onClick={() => setTab("pros")}
            icon={ThumbsUp}
          >
            장점 · 기대 효과
          </TabButton>
          <TabButton
            active={tab === "cons"}
            onClick={() => setTab("cons")}
            icon={ThumbsDown}
          >
            단점 · 한계
          </TabButton>
          <TabButton
            active={tab === "cases"}
            onClick={() => setTab("cases")}
            icon={Building2}
          >
            적용 사례
          </TabButton>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "pros" && (
              <div className="grid gap-3 sm:grid-cols-2">
                {PROS.map((p, i) => (
                  <div
                    key={p.title}
                    className="rounded-xl border border-emerald-200 bg-white p-4 dark:border-emerald-900/50 dark:bg-gray-900"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700 dark:bg-emerald-900/40">
                        {i + 1}
                      </div>
                      <div className="text-sm font-bold">{p.title}</div>
                    </div>
                    <p className="mt-2 text-xs text-gray-700 dark:text-gray-300">
                      {p.desc}
                    </p>
                    <div className="mt-2 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      {p.stat}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "cons" && (
              <div className="grid gap-3 sm:grid-cols-2">
                {CONS.map((c, i) => (
                  <div
                    key={c.title}
                    className="rounded-xl border border-amber-200 bg-white p-4 dark:border-amber-900/50 dark:bg-gray-900"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-[11px] font-bold text-amber-700 dark:bg-amber-900/40">
                        {i + 1}
                      </div>
                      <div className="text-sm font-bold">{c.title}</div>
                    </div>
                    <p className="mt-2 text-xs text-gray-700 dark:text-gray-300">
                      {c.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {tab === "cases" && (
              <div className="grid gap-3 sm:grid-cols-2">
                {CASES.map((c) => (
                  <div
                    key={c.company}
                    className="rounded-xl border border-emerald-200 bg-white p-4 dark:border-emerald-900/50 dark:bg-gray-900"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      {c.company}
                    </div>
                    <div className="text-sm font-bold">{c.name}</div>
                    <p className="mt-2 text-xs text-gray-700 dark:text-gray-300">
                      {c.summary}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {c.numbers.map((n) => (
                        <span
                          key={n}
                          className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 답안 구조 가이드 */}
      <div className="mt-5 rounded-xl border-l-4 border-emerald-500 bg-white p-5 dark:bg-gray-900">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
          <FileText size={15} /> 문제 1 답안 구조 가이드 (내용 아님 · 뼈대)
        </div>
        <p className="mt-1 text-[11px] text-gray-500">
          아래 순서를 따르면 과제 요구 요소 (개념·배경·차이·구성·효과·한계·사례·출처)를
          빠짐없이 담을 수 있음. 각 단원의 내용은 본인이 조사해 직접 서술.
        </p>
        <ol className="mt-3 grid gap-2 text-xs text-gray-700 dark:text-gray-300 sm:grid-cols-2">
          {ANSWER_STRUCTURE.map((s) => (
            <li
              key={s}
              className="flex items-start gap-2 rounded-lg bg-emerald-50/50 p-2 dark:bg-emerald-950/20"
            >
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof ThumbsUp;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
        active
          ? "bg-emerald-500 text-white shadow-sm"
          : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-emerald-50 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-700"
      }`}
    >
      <Icon size={12} /> {children}
    </button>
  );
}
