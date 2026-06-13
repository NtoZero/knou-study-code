"use client";

import Image from "next/image";
import { useState } from "react";
import {
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  ListChecks,
  Network,
  RotateCcw,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import {
  advancedNetworkLectureDetails,
  advancedNetworkLectures,
  type AdvancedNetworkDetailSection,
  type AdvancedNetworkLectureData,
  type AdvancedNetworkTone,
} from "./data";

const toneStyles: Record<AdvancedNetworkTone, {
  badge: string;
  border: string;
  fill: string;
  text: string;
  soft: string;
  active: string;
}> = {
  blue: {
    badge: "bg-blue-600 text-white",
    border: "border-blue-200 dark:border-blue-900",
    fill: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-200",
    soft: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-100",
    active: "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/30",
  },
  emerald: {
    badge: "bg-emerald-600 text-white",
    border: "border-emerald-200 dark:border-emerald-900",
    fill: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-200",
    soft: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100",
    active: "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/30",
  },
  rose: {
    badge: "bg-rose-600 text-white",
    border: "border-rose-200 dark:border-rose-900",
    fill: "bg-rose-50 dark:bg-rose-950/30",
    text: "text-rose-700 dark:text-rose-200",
    soft: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-100",
    active: "border-rose-500 bg-rose-50 dark:border-rose-500 dark:bg-rose-950/30",
  },
  amber: {
    badge: "bg-amber-500 text-gray-950",
    border: "border-amber-200 dark:border-amber-900",
    fill: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-200",
    soft: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100",
    active: "border-amber-500 bg-amber-50 dark:border-amber-500 dark:bg-amber-950/30",
  },
  violet: {
    badge: "bg-violet-600 text-white",
    border: "border-violet-200 dark:border-violet-900",
    fill: "bg-violet-50 dark:bg-violet-950/30",
    text: "text-violet-700 dark:text-violet-200",
    soft: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-100",
    active: "border-violet-500 bg-violet-50 dark:border-violet-500 dark:bg-violet-950/30",
  },
};

export default function NetworkAdvancedLecture({ lectureId }: { lectureId: number }) {
  const data = advancedNetworkLectures[lectureId];
  const [activeConcept, setActiveConcept] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [drillAnswers, setDrillAnswers] = useState<Record<number, string>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  if (!data) return null;

  const styles = toneStyles[data.tone];
  const concept = data.concepts[activeConcept] ?? data.concepts[0];
  const step = data.process.steps[activeStep] ?? data.process.steps[0];
  const quizScore = data.quiz.filter((item, index) => quizAnswers[index] === item.answer).length;
  const quizDone = Object.keys(quizAnswers).length === data.quiz.length;
  const detailSections = advancedNetworkLectureDetails[data.id] ?? [];

  return (
    <>
      <LectureOverview data={data} styles={styles} />

      <LectureSpecificVisualizer data={data} styles={styles} />

      <DetailedConceptMap data={data} sections={detailSections} styles={styles} />

      <section>
        <SectionTitle
          title="개념 흐름 레일"
          subtitle="목차 순서대로 핵심 개념을 세로로 따라가며 정의와 판별 기준을 확인하세요"
        />
        <div className={`rounded-xl border bg-white p-4 dark:bg-gray-900 ${styles.border}`}>
          <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="space-y-2">
              {data.concepts.map((item, index) => {
                const active = index === activeConcept;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setActiveConcept(index)}
                    className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                      active
                        ? styles.active
                        : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700"
                    }`}
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-black ${active ? styles.badge : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"}`}>
                      {index + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-black text-gray-950 dark:text-gray-50">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-gray-500">
                        {item.axis}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className={`rounded-lg border p-5 ${styles.border} ${styles.fill}`}>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-md px-2.5 py-1 text-xs font-black ${styles.badge}`}>
                  {concept.axis}
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  {data.id}강 핵심 {activeConcept + 1}
                </span>
              </div>
              <h3 className="text-xl font-black text-gray-950 dark:text-gray-50">{concept.label}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-700 dark:text-gray-200">
                {concept.detail}
              </p>
              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {concept.checks.map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-white/70 bg-white/80 p-3 text-sm leading-6 text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-950/80 dark:text-gray-200"
                  >
                    <div className={`mb-1 flex items-center gap-1 text-xs font-black ${styles.text}`}>
                      <CheckCircle2 size={13} />
                      판별
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ComparisonMatrix data={data} styles={styles} />

      <section>
        <SectionTitle title={data.process.title} subtitle={data.process.subtitle} />
        <div className={`rounded-xl border bg-white p-4 dark:bg-gray-900 ${styles.border}`}>
          <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
            <div className="space-y-2">
              {data.process.steps.map((item, index) => {
                const active = index === activeStep;
                return (
                  <button
                    key={`${item.label}-${index}`}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left text-sm transition-colors ${
                      active
                        ? styles.active
                        : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-950"
                    }`}
                  >
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${active ? styles.badge : "bg-gray-100 text-gray-500 dark:bg-gray-800"}`}>
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-black">{item.label}</span>
                      <span className="mt-0.5 block text-xs text-gray-500">{item.cue}</span>
                    </span>
                    <ChevronRight size={16} className={active ? styles.text : "text-gray-400"} />
                  </button>
                );
              })}
            </div>
            <div className={`rounded-lg border p-5 ${styles.border} ${styles.fill}`}>
              <div className={`mb-3 inline-flex rounded-md px-2.5 py-1 text-xs font-black ${styles.soft}`}>
                {step.cue}
              </div>
              <h3 className="text-xl font-black text-gray-950 dark:text-gray-50">{step.label}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-700 dark:text-gray-200">{step.detail}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {data.process.steps.map((item, index) => (
                  <span
                    key={`${item.label}-rail`}
                    className={`h-2 rounded-full transition-all ${index <= activeStep ? styles.badge : "bg-gray-200 dark:bg-gray-800"}`}
                    style={{ width: index === activeStep ? 44 : 24 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <DrillBoard
        data={data}
        styles={styles}
        answers={drillAnswers}
        onAnswer={(index, answer) => setDrillAnswers((prev) => ({ ...prev, [index]: answer }))}
      />

      <section>
        <SectionTitle
          title="자가 점검 퀴즈"
          subtitle="정답 선택 후 강의 기준 해설로 오답 경계를 확인하세요"
        />
        <div className={`rounded-xl border bg-white p-4 dark:bg-gray-900 ${styles.border}`}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {data.quiz.map((_, index) => {
                const selected = quizAnswers[index];
                const answered = selected !== undefined;
                const correct = answered && selected === data.quiz[index].answer;
                return (
                  <span
                    key={`quiz-dot-${index}`}
                    className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-black ${
                      !answered
                        ? "bg-gray-100 text-gray-500 dark:bg-gray-800"
                        : correct
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-100"
                    }`}
                  >
                    {index + 1}
                  </span>
                );
              })}
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300">
              <Target size={16} />
              {quizDone ? `${quizScore}/${data.quiz.length}` : `선택 ${Object.keys(quizAnswers).length}/${data.quiz.length}`}
              <button
                type="button"
                onClick={() => setQuizAnswers({})}
                className="ml-2 inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs font-bold text-gray-500 dark:border-gray-800"
              >
                <RotateCcw size={13} />
                다시
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {data.quiz.map((item, questionIndex) => {
              const selected = quizAnswers[questionIndex];
              return (
                <article key={item.question} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                  <h3 className="text-sm font-black text-gray-950 dark:text-gray-50">
                    {questionIndex + 1}. {item.question}
                  </h3>
                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    {item.options.map((option, optionIndex) => {
                      const answered = selected !== undefined;
                      const isCorrect = optionIndex === item.answer;
                      const isSelected = selected === optionIndex;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setQuizAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }))
                          }
                          className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm leading-6 transition-colors ${
                            !answered
                              ? "border-gray-200 hover:border-gray-400 dark:border-gray-800"
                              : isCorrect
                                ? "border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30"
                                : isSelected
                                  ? "border-rose-400 bg-rose-50 dark:border-rose-700 dark:bg-rose-950/30"
                                  : "border-gray-200 opacity-55 dark:border-gray-800"
                          }`}
                        >
                          <span className="font-black">{String.fromCharCode(65 + optionIndex)}</span>
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>
                  {selected !== undefined && (
                    <div
                      className={`mt-3 flex gap-2 rounded-lg p-3 text-sm leading-6 ${
                        selected === item.answer
                          ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100"
                          : "bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-100"
                      }`}
                    >
                      {selected === item.answer ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
                      <span>{item.explanation}</span>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function VisualPracticeShell({
  title,
  subtitle,
  styles,
  children,
}: {
  title: string;
  subtitle: string;
  styles: (typeof toneStyles)[AdvancedNetworkTone];
  children: React.ReactNode;
}) {
  return (
    <section>
      <SectionTitle title={title} subtitle={subtitle} />
      <div className={`rounded-xl border bg-white p-4 dark:bg-gray-900 ${styles.border}`}>
        {children}
      </div>
    </section>
  );
}

function LectureSpecificVisualizer({
  data,
  styles,
}: {
  data: AdvancedNetworkLectureData;
  styles: (typeof toneStyles)[AdvancedNetworkTone];
}) {
  if (data.id === 11) return <LanAccessVisualizer styles={styles} />;
  if (data.id === 12) return <Ieee802ModelVisualizer styles={styles} />;
  if (data.id === 13) return <SecurityThreatVisualizer styles={styles} />;
  if (data.id === 14) return <CryptoFirewallVisualizer styles={styles} />;
  if (data.id === 15) return <EmergingNetworkVisualizer styles={styles} />;
  return null;
}

function LanAccessVisualizer({ styles }: { styles: (typeof toneStyles)[AdvancedNetworkTone] }) {
  const [mode, setMode] = useState("csmacd");
  const modes = {
    csmacd: {
      label: "CSMA/CD",
      source: "교재 11장 CSMA/CD 동작 방식",
      src: "/network/frequent-concepts/figures/csmacd-flowchart.png",
      alt: "회선 감지, 전송, 충돌 감지, 잼 신호, 임의 대기, 재전송으로 이어지는 CSMA/CD 흐름도",
      checks: ["경쟁 방식", "충돌 감지", "IEEE 802.3", "이더넷"],
      steps: ["회선 사용 여부 감지", "비어 있으면 전송", "충돌 시 잼 신호", "임의 시간 대기 후 재시도"],
    },
    token: {
      label: "토큰링",
      source: "교재 11장 토큰링 동작 방식",
      src: "/network/frequent-concepts/figures/token-ring-operation.png",
      alt: "자유 토큰을 획득한 노드가 프레임을 보내고 목적지 확인 뒤 토큰을 반환하는 토큰링 동작",
      checks: ["토큰 보유 노드만 전송", "IEEE 802.5", "예측 가능한 순환", "환형 LAN"],
      steps: ["자유 토큰 획득", "토큰을 사용 중 상태로 변경", "목적지까지 프레임 순환", "송신 노드가 토큰 반환"],
    },
  } as const;
  const selected = modes[mode as keyof typeof modes];
  const topologies = [
    ["성형", "중앙 제어기와 점 대 점 연결. 중앙 고장이 전체 통신에 영향."],
    ["버스형", "하나의 중추 선로 공유. 종단장치와 충돌 가능성 확인."],
    ["트리형", "성형 확장 구조. 제어기를 계층적으로 배치."],
    ["환형", "인접 노드를 따라 한 방향 순환. 리피터와 토큰링 단서 확인."],
  ];

  return (
    <VisualPracticeShell
      title="LAN 위상·매체접근 판독 실습"
      subtitle="11강은 분류 축과 접근 절차가 시험 포인트이므로 그림에서 충돌·토큰·위상을 먼저 읽습니다"
      styles={styles}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            {Object.entries(modes).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                className={`rounded-lg border px-3 py-2 text-sm font-black ${
                  key === mode
                    ? styles.badge
                    : "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <figure className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
            <Image
              src={selected.src}
              alt={selected.alt}
              width={mode === "csmacd" ? 820 : 780}
              height={mode === "csmacd" ? 630 : 910}
              sizes="(min-width: 1280px) 60vw, 100vw"
              priority
              className="h-auto w-full bg-white object-contain"
            />
            <figcaption className="border-t border-gray-200 bg-white p-3 text-sm leading-6 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
              <span className={`font-black ${styles.text}`}>{selected.source}</span> · {selected.alt}
            </figcaption>
          </figure>
        </div>
        <div className="space-y-4">
          <div>
            <div className="mb-2 text-sm font-black text-gray-950 dark:text-gray-50">위상 판별 기준</div>
            <div className="space-y-2">
              {topologies.map(([label, detail]) => (
                <div key={label} className="rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                  <div className={`text-xs font-black ${styles.text}`}>{label}</div>
                  <div className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">{detail}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={`rounded-lg p-4 ${styles.fill}`}>
            <div className="mb-2 text-sm font-black text-gray-950 dark:text-gray-50">{selected.label} 시험 단서</div>
            <div className="flex flex-wrap gap-2">
              {selected.checks.map((check) => (
                <span key={check} className={`rounded-md px-2.5 py-1 text-xs font-black ${styles.soft}`}>
                  {check}
                </span>
              ))}
            </div>
            <ol className="mt-3 space-y-1.5 text-sm leading-6 text-gray-700 dark:text-gray-200">
              {selected.steps.map((step, index) => (
                <li key={step} className="flex gap-2">
                  <span className={`font-mono text-xs font-black ${styles.text}`}>{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </VisualPracticeShell>
  );
}

function Ieee802ModelVisualizer({ styles }: { styles: (typeof toneStyles)[AdvancedNetworkTone] }) {
  const [wirelessMode, setWirelessMode] = useState("bss");
  const standards = [
    ["802.1", "상위 계층 인터페이스·MAC 브리지", "LAN 구조와 인터네트워킹"],
    ["802.2", "LLC", "흐름제어·에러제어 등 공통 제어"],
    ["802.3", "CSMA/CD", "이더넷 계열"],
    ["802.11", "무선 LAN", "a/b/g/n/ac/ad/ax 표준"],
  ];
  const wireless = {
    ibss: ["IBSS", "노드끼리 직접 통신하는 독립 네트워크. 다른 IBSS와는 송수신하지 못함."],
    bss: ["BSS", "하나의 AP가 담당하는 기본 서비스 영역. AP는 허브·브리지 역할을 함께 수행."],
    ess: ["ESS", "여러 BSS를 하나처럼 묶은 확장 서비스 영역. BSS 사이 로밍 가능."],
  } as const;
  const current = wireless[wirelessMode as keyof typeof wireless];

  return (
    <VisualPracticeShell
      title="IEEE 802 계층·무선 LAN 구조도"
      subtitle="12강은 표준 번호, LLC/MAC 역할, IBSS·BSS·ESS 구조를 섞어 내는 문항에 대비합니다"
      styles={styles}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
        <div>
          <div className="grid gap-2 sm:grid-cols-4">
            {standards.map(([code, target, cue]) => (
              <div key={code} className={`rounded-lg border p-3 ${styles.border} ${styles.fill}`}>
                <div className={`text-sm font-black ${styles.text}`}>IEEE {code}</div>
                <div className="mt-2 text-sm font-bold text-gray-950 dark:text-gray-50">{target}</div>
                <div className="mt-1 text-xs leading-5 text-gray-600 dark:text-gray-300">{cue}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            {["네트워크 계층", "LLC: 매체와 무관한 논리 연결 제어", "MAC: 매체 접근과 프레임 송수신", "물리 계층: 전송 매체와 신호"].map((layer, index) => (
              <div
                key={layer}
                className={`rounded-lg px-4 py-3 text-sm font-bold ${
                  index === 1 || index === 2 ? styles.soft : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                }`}
              >
                {layer}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            {Object.entries(wireless).map(([key, [label]]) => (
              <button
                key={key}
                type="button"
                onClick={() => setWirelessMode(key)}
                className={`rounded-lg border px-3 py-2 text-sm font-black ${
                  key === wirelessMode
                    ? styles.badge
                    : "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className={`rounded-lg border p-5 ${styles.border}`}>
            <div className="mb-4 text-center text-sm font-black text-gray-950 dark:text-gray-50">{current[0]} 구조 판독</div>
            <div className="grid grid-cols-3 items-center gap-2">
              <div className="rounded-lg bg-gray-100 p-3 text-center text-xs font-bold dark:bg-gray-800">무선 노드</div>
              <div className={`rounded-full px-3 py-5 text-center text-xs font-black ${styles.soft}`}>
                {wirelessMode === "ibss" ? "직접 통신" : "AP"}
              </div>
              <div className="rounded-lg bg-gray-100 p-3 text-center text-xs font-bold dark:bg-gray-800">
                {wirelessMode === "ess" ? "다른 BSS" : "무선 노드"}
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-gray-700 dark:text-gray-200">{current[1]}</p>
            <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs leading-5 text-gray-600 dark:bg-gray-950 dark:text-gray-300">
              속도 계열은 10Mbps 이더넷, 100Mbps 고속 이더넷, 1Gbps 기가비트 이더넷, 10Gbps 텐-기가비트 이더넷으로 함께 정리.
            </div>
          </div>
        </div>
      </div>
    </VisualPracticeShell>
  );
}

function SecurityThreatVisualizer({ styles }: { styles: (typeof toneStyles)[AdvancedNetworkTone] }) {
  const [threat, setThreat] = useState("interception");
  const threats = {
    interception: ["가로채기", "기밀성", "전송 정보를 몰래 열람하거나 도청하는 공격."],
    modification: ["변조", "무결성", "데이터 내용을 다른 값으로 바꾸는 공격."],
    interruption: ["방해", "가용성", "송수신이나 서비스 이용을 지연·마비시키는 공격."],
    fabrication: ["위조", "무결성", "거짓 정보를 삽입해 정당한 송신처럼 보이게 하는 공격."],
    phishing: ["피싱·스미싱·파밍", "기밀성", "사용자를 속여 개인정보나 금융정보 입력을 유도."],
  } as const;
  const current = threats[threat as keyof typeof threats];

  return (
    <VisualPracticeShell
      title="CIA 기준 보안 위협 분류기"
      subtitle="13강은 공격 이름보다 훼손되는 보안 목표와 행위 방식을 먼저 잡으면 선택지가 줄어듭니다"
      styles={styles}
    >
      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-2">
          {Object.entries(threats).map(([key, [label, goal]]) => (
            <button
              key={key}
              type="button"
              onClick={() => setThreat(key)}
              className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-3 text-left text-sm font-black ${
                key === threat
                  ? styles.active
                  : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950"
              }`}
            >
              <span>{label}</span>
              <span className={`rounded-md px-2 py-1 text-xs ${styles.soft}`}>{goal}</span>
            </button>
          ))}
        </div>
        <div className={`rounded-lg border p-5 ${styles.border} ${styles.fill}`}>
          <div className="grid gap-3 sm:grid-cols-3">
            {["기밀성", "무결성", "가용성"].map((goal) => (
              <div
                key={goal}
                className={`rounded-lg border p-4 text-center ${
                  current[1] === goal
                    ? "border-rose-500 bg-white text-rose-700 dark:bg-gray-950 dark:text-rose-200"
                    : "border-gray-200 bg-white/70 text-gray-500 dark:border-gray-800 dark:bg-gray-950/70"
                }`}
              >
                <div className="text-sm font-black">{goal}</div>
                <div className="mt-1 text-xs leading-5">
                  {goal === "기밀성" ? "노출 방지" : goal === "무결성" ? "변경 방지" : "사용 가능성"}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg bg-white p-4 dark:bg-gray-950">
            <div className={`mb-1 text-xs font-black ${styles.text}`}>선택한 위협</div>
            <h3 className="text-xl font-black text-gray-950 dark:text-gray-50">{current[0]}</h3>
            <p className="mt-3 text-sm leading-7 text-gray-700 dark:text-gray-200">{current[2]}</p>
            <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">
              시험에서는 DoS·DDoS는 가용성, 가로채기는 기밀성, 변조·위조는 무결성 축으로 먼저 묶고 세부 명칭을 판별.
            </p>
          </div>
        </div>
      </div>
    </VisualPracticeShell>
  );
}

function CryptoFirewallVisualizer({ styles }: { styles: (typeof toneStyles)[AdvancedNetworkTone] }) {
  const [view, setView] = useState("signature");
  const views = {
    signature: {
      label: "디지털 서명",
      source: "교재 14장 디지털 서명 처리",
      src: "/network/frequent-concepts/figures/digital-signature-flow.png",
      alt: "메시지 요약을 송신자 개인키로 서명하고 수신자가 송신자 공개키로 검증하는 디지털 서명 처리 흐름",
      bullets: ["MD 생성", "송신자 개인키로 서명", "송신자 공개키로 검증", "부인 방지와 무결성 확인"],
    },
    firewall: {
      label: "방화벽 구조",
      source: "교재 14장 방화벽 시스템 구조",
      src: "/network/frequent-concepts/figures/firewall-system-structure.png",
      alt: "인터넷과 내부 네트워크 사이에서 방화벽이 허용된 트래픽만 통과시키는 시스템 구조",
      bullets: ["네트워크 사이 유일한 통로", "패킷 헤더와 조건 검사", "스크리닝·게이트웨이·DMZ 구분", "프락시는 대리 접속"],
    },
  } as const;
  const current = views[view as keyof typeof views];

  return (
    <VisualPracticeShell
      title="암호·서명·방화벽 방향 판독"
      subtitle="14강은 키의 방향과 네트워크 배치가 곧 정답 조건이므로 원자료 그림을 먼저 봅니다"
      styles={styles}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        {Object.entries(views).map(([key, item]) => (
          <button
            key={key}
            type="button"
            onClick={() => setView(key)}
            className={`rounded-lg border px-3 py-2 text-sm font-black ${
              key === view
                ? styles.badge
                : "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <figure className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
          <Image
            src={current.src}
            alt={current.alt}
            width={view === "signature" ? 820 : 780}
            height={view === "signature" ? 270 : 340}
            sizes="(min-width: 1280px) 60vw, 100vw"
            className="h-auto w-full bg-white object-contain"
          />
          <figcaption className="border-t border-gray-200 bg-white p-3 text-sm leading-6 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <span className={`font-black ${styles.text}`}>{current.source}</span> · {current.alt}
          </figcaption>
        </figure>
        <div className={`rounded-lg p-4 ${styles.fill}`}>
          <div className="mb-3 text-sm font-black text-gray-950 dark:text-gray-50">{current.label} 핵심 단서</div>
          <ol className="space-y-2">
            {current.bullets.map((bullet, index) => (
              <li key={bullet} className="flex gap-2 rounded-lg bg-white p-3 text-sm leading-6 text-gray-700 dark:bg-gray-950 dark:text-gray-200">
                <span className={`font-mono text-xs font-black ${styles.text}`}>{index + 1}</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </VisualPracticeShell>
  );
}

function EmergingNetworkVisualizer({ styles }: { styles: (typeof toneStyles)[AdvancedNetworkTone] }) {
  const [tech, setTech] = useState("sdn");
  const techs = {
    mobile: ["이동통신", "1G 음성 → 2G 디지털/SMS → 3G IMT-2000 → 4G LTE → 5G 초고속·초저지연·초연결"],
    iot: ["IoT", "센싱 기술, 유무선 통신 및 네트워크 인프라, 서비스 인터페이스 기술이 세 축."],
    sdn: ["SDN", "애플리케이션 계층, 제어 계층, 데이터 계층을 분리하고 OpenFlow가 South-bound API 역할."],
    nfv: ["NFV", "VNF, NFVI, MANO로 전용 네트워크 기능을 소프트웨어 서비스로 가상화."],
    mec: ["MEC", "MEC 호스트, 플랫폼 관리자, 오케스트레이터가 에지에서 초저지연 처리를 제공."],
  } as const;
  const current = techs[tech as keyof typeof techs];

  return (
    <VisualPracticeShell
      title="최신 기술 구조 분해"
      subtitle="15강은 새 용어 암기가 아니라 무엇을 분리하고 어디에 배치하는지로 구조를 구분합니다"
      styles={styles}
    >
      <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="space-y-2">
          {Object.entries(techs).map(([key, [label]]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTech(key)}
              className={`w-full rounded-lg border px-3 py-3 text-left text-sm font-black ${
                key === tech
                  ? styles.active
                  : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className={`rounded-lg border p-5 ${styles.border} ${styles.fill}`}>
          <div className={`mb-3 inline-flex rounded-md px-2.5 py-1 text-xs font-black ${styles.soft}`}>
            {current[0]}
          </div>
          <p className="text-sm leading-7 text-gray-700 dark:text-gray-200">{current[1]}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {(tech === "sdn"
              ? ["애플리케이션 계층", "제어 계층", "데이터 계층"]
              : tech === "nfv"
                ? ["VNF", "NFVI", "MANO"]
                : tech === "mec"
                  ? ["MEC 호스트", "플랫폼 관리자", "오케스트레이터"]
                  : tech === "iot"
                    ? ["센싱", "네트워크", "서비스 인터페이스"]
                    : ["1G/2G", "3G/4G", "5G"]).map((item, index) => (
              <div key={item} className="rounded-lg bg-white p-4 text-center dark:bg-gray-950">
                <div className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full text-xs font-black ${styles.badge}`}>
                  {index + 1}
                </div>
                <div className="text-sm font-black text-gray-950 dark:text-gray-50">{item}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-white p-3 text-sm leading-6 text-gray-600 dark:bg-gray-950 dark:text-gray-300">
            판별 팁: SDN은 제어 분리, NFV는 기능 가상화, MEC는 사용자 가까운 처리, IoT는 센싱·연결·서비스, 5G는 초고속·초저지연·초연결.
          </div>
        </div>
      </div>
    </VisualPracticeShell>
  );
}

function DetailedConceptMap({
  data,
  sections,
  styles,
}: {
  data: AdvancedNetworkLectureData;
  sections: AdvancedNetworkDetailSection[];
  styles: (typeof toneStyles)[AdvancedNetworkTone];
}) {
  if (sections.length === 0) return null;

  return (
    <section>
      <SectionTitle
        title="목차 기반 상세 개념 정리"
        subtitle={`${data.id}강 대목차와 소개념을 세로 흐름으로 정리했습니다`}
      />
      <div className="space-y-4">
        {sections.map((section, sectionIndex) => (
          <details
            key={section.title}
            open
            className={`rounded-xl border bg-white dark:bg-gray-900 ${styles.border}`}
          >
            <summary className="cursor-pointer list-none p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${styles.badge}`}>
                    <BookOpenCheck size={18} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-base font-black text-gray-950 dark:text-gray-50">
                      {section.title}
                    </div>
                    <div className="mt-1 text-sm leading-6 text-gray-500">
                      {section.description}
                    </div>
                  </div>
                </div>
                <span className={`rounded-md px-2.5 py-1 text-xs font-black ${styles.soft}`}>
                  {section.items.length}개 항목
                </span>
              </div>
            </summary>
            <div className="border-t border-gray-100 p-4 dark:border-gray-800">
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <article
                    key={item.term}
                    className="grid gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950 md:grid-cols-[180px_minmax(0,1fr)]"
                  >
                    <div>
                      <div className={`mb-2 inline-flex rounded-md px-2 py-1 text-xs font-black ${styles.soft}`}>
                        {sectionIndex + 1}-{itemIndex + 1}
                      </div>
                      <h3 className="text-sm font-black leading-6 text-gray-950 dark:text-gray-50">
                        {item.term}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm leading-7 text-gray-700 dark:text-gray-200">
                        {item.detail}
                      </p>
                      <ul className="mt-3 space-y-2">
                        {item.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                            <CheckCircle2 size={15} className={`mt-1 shrink-0 ${styles.text}`} />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function LectureOverview({
  data,
  styles,
}: {
  data: AdvancedNetworkLectureData;
  styles: (typeof toneStyles)[AdvancedNetworkTone];
}) {
  return (
    <section>
      <SectionTitle
        title={`${data.id}강 시각화 학습 지도`}
        subtitle={data.summary}
      />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className={`rounded-xl border p-5 ${styles.border} ${styles.fill}`}>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-2 rounded-lg px-3 py-1 text-xs font-black ${styles.badge}`}>
              <Network size={14} />
              {data.id}강
            </span>
            <span className="text-xs font-semibold text-gray-500">정의 → 구조 → 비교 → 절차 → 점검</span>
          </div>
          <h2 className="text-2xl font-black text-gray-950 dark:text-gray-50">{data.title}</h2>
          <div className="mt-4 grid gap-2">
            {data.objectives.map((objective) => (
              <div key={objective} className="flex gap-2 text-sm leading-6 text-gray-700 dark:text-gray-200">
                <CheckCircle2 size={16} className={`mt-1 shrink-0 ${styles.text}`} />
                <span>{objective}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <div className="grid grid-cols-3 gap-2">
            {data.metrics.map((metric) => (
              <div key={metric.label} className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
                <div className={`text-xs font-black ${styles.text}`}>{metric.label}</div>
                <div className="mt-1 font-mono text-lg font-black text-gray-950 dark:text-gray-50">{metric.value}</div>
                <div className="mt-1 text-[11px] leading-4 text-gray-500">{metric.detail}</div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex items-center gap-2 text-sm font-black">
              <ListChecks size={16} className={styles.text} />
              핵심 용어
            </div>
            <div className="flex flex-wrap gap-2">
              {data.keyTerms.map((term) => (
                <span key={term} className={`rounded-md px-2.5 py-1 text-xs font-bold ${styles.soft}`}>
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonMatrix({
  data,
  styles,
}: {
  data: AdvancedNetworkLectureData;
  styles: (typeof toneStyles)[AdvancedNetworkTone];
}) {
  const columns = data.comparison.columns;

  return (
    <section>
      <SectionTitle title={data.comparison.title} subtitle={data.comparison.subtitle} />
      <div className={`rounded-xl border bg-white p-4 dark:bg-gray-900 ${styles.border}`}>
        <div className="overflow-x-auto">
          <div
            className="grid min-w-[760px] gap-2"
            style={{
              gridTemplateColumns: `170px repeat(${columns.length}, minmax(170px, 1fr))`,
            }}
          >
            <div className={`rounded-lg p-3 text-xs font-black ${styles.badge}`}>구분</div>
            {columns.map((column) => (
              <div key={column} className={`rounded-lg p-3 text-xs font-black ${styles.soft}`}>
                {column}
              </div>
            ))}
            {data.comparison.rows.map((row) => (
              <Row key={row.label} row={row} styles={styles} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({
  row,
  styles,
}: {
  row: { label: string; cells: string[] };
  styles: (typeof toneStyles)[AdvancedNetworkTone];
}) {
  return (
    <>
      <div className={`rounded-lg border p-3 text-sm font-black ${styles.border} ${styles.fill}`}>
        {row.label}
      </div>
      {row.cells.map((cell, index) => (
        <div
          key={`${row.label}-${index}`}
          className="rounded-lg border border-gray-200 bg-white p-3 text-sm leading-6 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200"
        >
          {cell}
        </div>
      ))}
    </>
  );
}

function DrillBoard({
  data,
  styles,
  answers,
  onAnswer,
}: {
  data: AdvancedNetworkLectureData;
  styles: (typeof toneStyles)[AdvancedNetworkTone];
  answers: Record<number, string>;
  onAnswer: (index: number, answer: string) => void;
}) {
  return (
    <section>
      <SectionTitle
        title={data.drill.title}
        subtitle="문장을 보고 가장 가까운 개념을 고른 뒤 판별 기준을 확인하세요"
      />
      <div className={`rounded-xl border bg-white p-4 dark:bg-gray-900 ${styles.border}`}>
        <div className="space-y-4">
          {data.drill.scenarios.map((scenario, index) => {
            const selected = answers[index];
            const answered = selected !== undefined;
            const correct = selected === scenario.answer;
            return (
              <article key={scenario.prompt} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                <div className="mb-3 flex items-start gap-2">
                  <Sparkles size={17} className={`mt-0.5 shrink-0 ${styles.text}`} />
                  <h3 className="text-sm font-black leading-6 text-gray-950 dark:text-gray-50">
                    {scenario.prompt}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.drill.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onAnswer(index, option)}
                      className={`rounded-lg border px-3 py-2 text-sm font-bold transition-colors ${
                        selected === option
                          ? option === scenario.answer
                            ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100"
                            : "border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-100"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {answered && (
                  <div
                    className={`mt-3 flex gap-2 rounded-lg p-3 text-sm leading-6 ${
                      correct
                        ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100"
                        : "bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-100"
                    }`}
                  >
                    {correct ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
                    <span>{scenario.feedback}</span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
