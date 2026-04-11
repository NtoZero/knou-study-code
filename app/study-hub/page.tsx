import Link from "next/link";
import {
  Radio,
  Layers,
  Target,
  ArrowRight,
  BookOpen,
  ClipboardList,
  Lightbulb,
} from "lucide-react";

const hubs = [
  {
    slug: "network",
    subject: "정보통신망",
    type: "공통형 · 30점",
    title: "HAC(Human-AI Communication) 정의와 미래 발전 전략",
    keywords: ["Shannon-Weaver 모델", "AI-인간 통신", "블랙박스 대응"],
    icon: Radio,
    color: "orange",
    classes: {
      border: "border-orange-200 dark:border-orange-900/50",
      bg: "from-orange-50 to-white dark:from-orange-950/40 dark:to-gray-900",
      text: "text-orange-500",
      textStrong: "text-orange-600",
    },
    foundation: [
      "Shannon-Weaver 통신 모델의 6요소",
      "정보통신 기본 요소 대응 (송신자/수신자/채널/프로토콜/노이즈)",
      "HCI(Human-Computer Interaction) 기본 원리",
    ],
    problem: [
      "HAC 유형 분류 (텍스트/멀티모달/에이전트)",
      "각 유형별 프로토콜·채널 설계",
      "HAC 모델 다이어그램 구성법",
    ],
    applied: [
      "AI-AI 블랙박스 문제 시나리오",
      "인간 개입형 표준·인터페이스 구상",
      "출처 명시 + 비판적 분석 에세이 팁",
    ],
  },
  {
    slug: "software",
    subject: "소프트웨어공학",
    type: "공통형 · 30점",
    title: "Platform Engineering · IDP · CPM 임계경로",
    keywords: ["Developer Experience", "Internal Developer Platform", "CPM · Slack"],
    icon: Layers,
    color: "emerald",
    classes: {
      border: "border-emerald-200 dark:border-emerald-900/50",
      bg: "from-emerald-50 to-white dark:from-emerald-950/40 dark:to-gray-900",
      text: "text-emerald-500",
      textStrong: "text-emerald-600",
    },
    foundation: [
      "DX 정의와 DevEx 3차원 (피드백/인지부하/몰입)",
      "DevOps → SRE → PE 진화",
      "CPM 기본 용어 (노드·아크·EST·EFT·LST·LFT)",
    ],
    problem: [
      "IDP 5대 구성요소 구성법",
      "CPM Forward pass / Backward pass 절차",
      "임계경로 + 여유시간(Slack) 계산",
    ],
    applied: [
      "PE 장단점·한계·적용 사례",
      "유사 CPM 연습 네트워크 풀이",
      "PERT vs CPM 확장 개념",
    ],
  },
  {
    slug: "ai",
    subject: "인공지능",
    type: "공통형 · 30점",
    title: "균일비용 탐색 · A* 알고리즘으로 최단 경로 탐색",
    keywords: ["State Space Search", "UCS", "A* Algorithm", "Admissibility"],
    icon: Target,
    color: "indigo",
    classes: {
      border: "border-indigo-200 dark:border-indigo-900/50",
      bg: "from-indigo-50 to-white dark:from-indigo-950/40 dark:to-gray-900",
      text: "text-indigo-500",
      textStrong: "text-indigo-600",
    },
    foundation: [
      "상태공간·그래프 탐색 기초",
      "균일비용 탐색(UCS) 알고리즘",
      "A* 알고리즘 · 평가함수 $f=g+h$",
      "허용성(admissibility) · 일관성(consistency)",
    ],
    problem: [
      "UCS 탐색 트리 작성법 (경로비용·확장순서 표기)",
      "A* 탐색 트리 작성법 (f값·확장순서)",
      "거리 기준 vs 시간 기준 변환",
    ],
    applied: [
      "휴리스틱이 허용적인지 검증",
      "일반화된 최적성 보장 조건",
      "연습용 그래프로 스스로 풀이",
    ],
  },
];

const stages = [
  {
    icon: BookOpen,
    label: "기초 학습",
    desc: "과제에 필요한 핵심 개념을 교재·강의록 기반으로 원리부터 정리",
  },
  {
    icon: ClipboardList,
    label: "문제 학습",
    desc: "개념을 문제에 적용하는 법 · 유사 패턴 · 풀이 절차 연습",
  },
  {
    icon: Lightbulb,
    label: "응용 문제 및 팁",
    desc: "확장 사고 · 흔한 실수 · 작성 팁으로 완성도 높이기",
  },
];

export default function StudyHubHome() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-md">
          <Target size={26} />
        </div>
        <h1 className="text-3xl font-bold">기초학습 본지</h1>
        <p className="mt-2 text-gray-500">
          2026-1학기 중간과제물 해결을 위한 <strong>개념 딥스터디</strong>
        </p>
        <p className="mt-1 text-xs text-gray-400">
          교재·강의록을 근거로 한 기초부터 응용까지 · 답안 참조 없이 스스로 쓸 수 있도록 설계
        </p>
      </div>

      {/* 3-stage 설명 */}
      <div className="mb-10 grid gap-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:grid-cols-3">
        {stages.map((s, i) => (
          <div key={s.label} className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-100 to-pink-100 text-orange-600 dark:from-orange-900/40 dark:to-pink-900/40 dark:text-orange-400">
              <s.icon size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400">
                  STEP {i + 1}
                </span>
                <h3 className="font-semibold">{s.label}</h3>
              </div>
              <p className="mt-1 text-xs text-gray-500">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 과목 카드 */}
      <div className="space-y-5">
        {hubs.map((h) => {
          const Icon = h.icon;
          return (
            <Link
              key={h.slug}
              href={`/study-hub/${h.slug}`}
              className={`group block overflow-hidden rounded-2xl border bg-gradient-to-br p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${h.classes.border} ${h.classes.bg}`}
            >
              <div className="flex flex-col gap-6 sm:flex-row">
                <div className="sm:w-56">
                  <Icon size={32} className={`mb-3 ${h.classes.text}`} />
                  <div
                    className={`mb-1 text-xs font-semibold uppercase tracking-wider ${h.classes.text}`}
                  >
                    {h.subject} · {h.type}
                  </div>
                  <h2 className="text-lg font-bold">{h.title}</h2>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {h.keywords.map((k) => (
                      <span
                        key={k}
                        className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-800/80 dark:text-gray-300"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                  <div
                    className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold ${h.classes.textStrong}`}
                  >
                    딥스터디 들어가기
                    <ArrowRight
                      size={12}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
                <div className="grid flex-1 gap-3 sm:grid-cols-3">
                  <StageList label="기초" items={h.foundation} color={h.classes.text} />
                  <StageList label="문제" items={h.problem} color={h.classes.text} />
                  <StageList label="응용" items={h.applied} color={h.classes.text} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-900">
        <strong className="text-gray-700 dark:text-gray-300">
          이 허브는 어떻게 설계되었나요?
        </strong>
        <br />
        교재·강의록·공식 자료를 근거로 <strong>개념을 이해하는 학습</strong>에
        집중했습니다. 사용자 본인이 작성한 답안은 참조하지 않았으며, 모든 풀이
        예시는 과제 원본과 다른 <strong>연습용 데이터</strong>로 구성되어 있어
        본인의 독자적 사고로 과제를 작성할 수 있도록 돕습니다.
      </div>
    </div>
  );
}

function StageList({
  label,
  items,
  color,
}: {
  label: string;
  items: string[];
  color: string;
}) {
  return (
    <div className="rounded-lg bg-white/60 p-3 dark:bg-gray-900/60">
      <div className={`mb-2 text-[10px] font-bold uppercase tracking-wider ${color}`}>
        {label}
      </div>
      <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-1">
            <span className="mt-0.5 text-gray-300">•</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
