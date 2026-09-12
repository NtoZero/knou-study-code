"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { Snowflake, ArrowRight, ChevronDown } from "lucide-react";

/* ── 약인공지능 / 강인공지능 ─────────────────────────────── */

interface AiKind {
  key: "weak" | "strong";
  label: string;
  english: string;
  points: string[];
  extra: string;
  example: string;
}

const aiKinds: AiKind[] = [
  {
    key: "weak",
    label: "약인공지능",
    english: "weak AI",
    points: [
      "실제 지능의 소유 여부 또는 처리 메커니즘과는 상관없이 지능적인 것처럼 행동하는 기계",
      "단지 정의된 특정 목적을 달성하고 문제를 해결하여 나타나는 행동의 결과만 중시",
    ],
    extra: "지금까지 개발된 대부분의 인공지능 시스템이 약인공지능에 속함.",
    example:
      "알파고(2016) — 실제로 인간의 지능을 가졌는지는 관심 대상이 아니며, 바둑만 잘 두면 되는 것이 핵심.",
  },
  {
    key: "strong",
    label: "강인공지능",
    english: "strong AI",
    points: [
      "지능의 모방이 아닌 실제로 인간처럼 생각하는 기계",
      "스스로 문제 정의 및 해결, 지속적인 학습, 자의식, 감정 등의 광범위한 지적 능력을 포함",
    ],
    extra: "다른 이름으로 Artificial General Intelligence(AGI), Human-level AI라고 부름.",
    example:
      "아직 실현되지 않은 목표 수준 — 인간 지능 수준을 어디까지 구현하느냐가 약·강 인공지능을 가르는 기준.",
  },
];

/* ── 인공지능의 역사 ─────────────────────────────────────── */

interface HistoryEvent {
  year: string;
  title: string;
  detail: string;
  winter?: boolean;
}

const history: HistoryEvent[] = [
  {
    year: "1943",
    title: "MP 뉴런",
    detail:
      "매컬러(McCulloch)와 피츠(Pitts)가 인공신경망의 기본이 되는 MP 뉴런을 제안. 인공신경망은 이후 딥러닝까지 발전하므로, 딥러닝의 효시가 되는 개념이 1943년에 나온 셈.",
  },
  {
    year: "1950",
    title: "튜링 테스트",
    detail:
      "앨런 튜링이 기계의 지능 유무를 판단하는 튜링 테스트를 제안. 튜링은 흔히 컴퓨터 과학의 아버지로 불림.",
  },
  {
    year: "1956",
    title: "다트머스 회의 — '인공지능' 용어의 등장",
    detail:
      "마빈 민스키와 존 매카티가 참여한 다트머스 회의에서 '인공지능'이라는 용어가 처음 등장.",
  },
  {
    year: "1957",
    title: "퍼셉트론",
    detail: "최초의 신경망 모델인 퍼셉트론이 등장.",
  },
  {
    year: "1950~60년대",
    title: "GPS (General Problem Solver)",
    detail:
      "일반적인 모든 문제를 푸는 기계를 만들려는 시도였으나 어려워 실패. 이후 문제의 범위를 좁히는 방향으로 연구가 전환됨.",
  },
  {
    year: "1960~70년대",
    title: "덴드랄(DENDRAL) · 마이신(MYCIN)",
    detail:
      "문제의 범위를 좁혀 특정 분야에 한정한 전문가 시스템이 개발됨. 화학 구조 해석(덴드랄), 감염 진단(마이신)이 대표 사례.",
  },
  {
    year: "1974~1980",
    title: "인공지능의 겨울 (1차)",
    detail:
      "인공지능에 대한 관심이 올라가다가 꺾인 시기. 기대에 못 미치는 성과로 연구 투자와 관심이 크게 줄어듦.",
    winter: true,
  },
  {
    year: "1987~1993",
    title: "인공지능의 겨울 (2차)",
    detail:
      "1987년부터 약 1993~1994년까지 이어진 두 번째 침체기. 이 시기를 지나 1990년대부터 머신러닝이 독립적인 분야로 자리 잡음.",
    winter: true,
  },
  {
    year: "1997",
    title: "IBM Deep Blue",
    detail:
      "체스 프로그램으로 당시 체스 챔피언을 이긴 경력이 있음. 지능적인 기계 또는 프로그램의 개발이라는 인공지능의 대표 사례.",
  },
  {
    year: "2011",
    title: "IBM Watson",
    detail:
      "퀴즈 프로그램으로 TV 퀴즈 프로그램에서 역대 퀴즈 챔피언을 이겼고, 이후 의료 진단 시스템으로 발전. 학습 능력을 활용한 문제 풀이의 사례.",
  },
  {
    year: "2016",
    title: "AlphaGo",
    detail:
      "심층 신경망 기반의 학습 방법을 사용한 대표적인 딥러닝 사례이자, 특정 목적만 달성하는 약인공지능의 대표 사례.",
  },
  {
    year: "2022",
    title: "ChatGPT",
    detail: "심층 신경망 기반의 학습 방법을 사용한 최근의 대표 사례.",
  },
];

/* ── 기존 방법 vs 머신러닝 ──────────────────────────────── */

const compareRows = [
  {
    aspect: "사람이 하는 일",
    classic: "문제 파악 후 규칙 작성",
    ml: "문제 파악 후 모델 선택과 구조 설계",
  },
  {
    aspect: "중간 산출물",
    classic: "규칙을 담은 프로그램",
    ml: "학습 알고리즘",
  },
  {
    aspect: "얻어지는 결과",
    classic: "프로그램이 계산한 답",
    ml: "일반적인 규칙 또는 새로운 지식",
  },
  {
    aspect: "데이터의 역할",
    classic: "프로그램이 처리할 대상",
    ml: "학습에 사용되거나 테스트에 사용되는 재료",
  },
  {
    aspect: "공통 흐름",
    classic: "성능 평가 → 오류 분석 → 배포",
    ml: "성능 평가 → 오류 분석 → 배포",
  },
];

const variations = [
  { label: "조명 변형", desc: "같은 얼굴이어도 빛의 방향과 세기에 따라 영상 값이 달라짐" },
  { label: "표정 변형", desc: "웃음, 찡그림 등 표정에 따라 얼굴의 형태가 달라짐" },
  { label: "기타 변형", desc: "각도, 가림, 촬영 조건 등 그 밖의 다양한 변형" },
  { label: "필체 변형", desc: "같은 숫자 4, 7, 9, 2, 1이라도 쓰는 사람의 스타일에 따라 모양이 제각각" },
];

/* ── 포함관계 ──────────────────────────────────────────── */

interface Layer {
  key: "ai" | "ml" | "dl";
  name: string;
  role: string;
  systems: { name: string; note: string }[];
}

const layers: Layer[] = [
  {
    key: "ai",
    name: "인공지능",
    role: "지능적인 기계 또는 프로그램의 개발",
    systems: [
      { name: "IBM Deep Blue", note: "1997, 체스 프로그램 — 당시 체스 챔피언을 이김" },
    ],
  },
  {
    key: "ml",
    name: "머신러닝",
    role: "학습 능력을 활용한 문제 풀이",
    systems: [
      {
        name: "IBM Watson",
        note: "2011, 퀴즈 프로그램 → 의료 진단 시스템으로 발전",
      },
    ],
  },
  {
    key: "dl",
    name: "딥러닝",
    role: "심층 신경망 기반의 학습 방법",
    systems: [
      { name: "AlphaGo", note: "심층 신경망 기반 학습의 대표 사례" },
      { name: "ChatGPT", note: "심층 신경망 기반 학습의 최근 대표 사례" },
    ],
  },
];

/* ── 신경망 도식 ────────────────────────────────────────── */

function NeuralNetDiagram() {
  const cols = [
    { x: 50, n: 4, label: "입력층" },
    { x: 130, n: 5, label: "은닉층" },
    { x: 210, n: 5, label: "은닉층" },
    { x: 290, n: 5, label: "은닉층" },
    { x: 370, n: 3, label: "출력층" },
  ];
  const yOf = (n: number, i: number) => 110 - ((n - 1) * 34) / 2 + i * 34;

  return (
    <svg viewBox="0 0 420 220" className="w-full max-w-full" role="img" aria-label="심층 신경망 구조">
      {cols.slice(0, -1).map((col, ci) =>
        Array.from({ length: col.n }).map((_, i) =>
          Array.from({ length: cols[ci + 1].n }).map((_, j) => (
            <line
              key={`${ci}-${i}-${j}`}
              x1={col.x}
              y1={yOf(col.n, i)}
              x2={cols[ci + 1].x}
              y2={yOf(cols[ci + 1].n, j)}
              stroke="#a5f3fc"
              strokeWidth="0.7"
            />
          ))
        )
      )}
      {cols.map((col, ci) => (
        <g key={col.label + ci}>
          {Array.from({ length: col.n }).map((_, i) => (
            <circle
              key={i}
              cx={col.x}
              cy={yOf(col.n, i)}
              r="9"
              fill={ci === 0 ? "#06b6d4" : ci === cols.length - 1 ? "#0369a1" : "#67e8f9"}
              stroke="#0e7490"
              strokeWidth="1"
            />
          ))}
          <text
            x={col.x}
            y={200}
            textAnchor="middle"
            fontSize="11"
            fill="#64748b"
          >
            {ci === 0 || ci === cols.length - 1 ? col.label : ci === 2 ? "은닉층" : ""}
          </text>
        </g>
      ))}
      <text x="210" y="20" textAnchor="middle" fontSize="11" fill="#0e7490">
        층이 깊은(많은) 신경망 = 심층 신경망
      </text>
    </svg>
  );
}

/* ── 튜링 테스트 도식 ───────────────────────────────────── */

function TuringTestDiagram() {
  return (
    <svg viewBox="0 0 420 200" className="w-full max-w-full" role="img" aria-label="튜링 테스트 구조">
      <rect x="205" y="15" width="6" height="170" fill="#94a3b8" />
      <text x="208" y="197" textAnchor="middle" fontSize="10" fill="#64748b">
        칸막이
      </text>

      <rect x="15" y="70" width="110" height="60" rx="10" fill="#cffafe" stroke="#0891b2" strokeWidth="1.5" />
      <text x="70" y="95" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0e7490">
        질문자(사람)
      </text>
      <text x="70" y="113" textAnchor="middle" fontSize="10" fill="#475569">
        어느 쪽이 기계인가?
      </text>

      <rect x="285" y="20" width="120" height="55" rx="10" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
      <text x="345" y="44" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#075985">
        기계
      </text>
      <text x="345" y="61" textAnchor="middle" fontSize="10" fill="#475569">
        답변 A
      </text>

      <rect x="285" y="125" width="120" height="55" rx="10" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5" />
      <text x="345" y="149" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#334155">
        또 다른 사람
      </text>
      <text x="345" y="166" textAnchor="middle" fontSize="10" fill="#475569">
        답변 B
      </text>

      <defs>
        <marker id="tt-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
        </marker>
      </defs>
      <line x1="125" y1="88" x2="283" y2="48" stroke="#94a3b8" strokeWidth="1.4" markerEnd="url(#tt-arrow)" />
      <line x1="125" y1="112" x2="283" y2="152" stroke="#94a3b8" strokeWidth="1.4" markerEnd="url(#tt-arrow)" />
      <text x="200" y="62" textAnchor="middle" fontSize="9" fill="#64748b">
        질문
      </text>
    </svg>
  );
}

/* ── 본문 ──────────────────────────────────────────────── */

export default function AIMLDLRelation() {
  const [kind, setKind] = useState<"weak" | "strong">("weak");
  const [openYear, setOpenYear] = useState<string | null>("1950");
  const [layer, setLayer] = useState<Layer["key"]>("dl");

  const selectedKind = aiKinds.find((k) => k.key === kind)!;
  const selectedLayer = layers.find((l) => l.key === layer)!;

  return (
    <section>
      <SectionTitle
        title="인공지능 · 머신러닝 · 딥러닝"
        subtitle="정의와 포함 관계, 그리고 인공지능이 걸어온 길"
      />

      {/* 인공지능의 정의 */}
      <div className="mb-6 rounded-xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-900 dark:bg-cyan-950/40">
        <p className="text-xs font-semibold tracking-wide text-cyan-700 dark:text-cyan-300">
          인공지능 AI : Artificial Intelligence
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-200">
          <strong>인간 지능을 모방하여 문제 해결을 위해 사람처럼 학습·이해하는 기계를 만드는 분야.</strong>{" "}
          사전에서 지능은 &ldquo;주어진 문제를 해결하기 위해 이해하고 학습하는 능력&rdquo;으로 정의되며,
          인간의 지능 수준을 어디까지 구현하느냐에 따라 약인공지능과 강인공지능으로 구분.
        </p>
      </div>

      {/* 약 vs 강 인공지능 토글 */}
      <div className="mb-10">
        <div className="mb-3 flex flex-wrap gap-2">
          {aiKinds.map((k) => (
            <button
              key={k.key}
              onClick={() => setKind(k.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                kind === k.key
                  ? "bg-cyan-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {k.label} <span className="text-xs opacity-70">{k.english}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedKind.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
          >
            <ul className="space-y-2">
              {selectedKind.points.map((p) => (
                <li key={p} className="flex gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-gray-500">{selectedKind.extra}</p>
            <div className="mt-3 rounded-lg bg-cyan-50 p-3 text-sm text-cyan-900 dark:bg-cyan-950/50 dark:text-cyan-200">
              {selectedKind.example}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 인공지능의 역사 */}
      <h3 className="mb-3 text-base font-bold">인공지능의 역사</h3>
      <p className="mb-4 text-sm text-gray-500">연도를 눌러 설명을 펼쳐 보기.</p>
      <div className="mb-10 space-y-2">
        {history.map((ev) => {
          const open = openYear === ev.year;
          return (
            <div
              key={ev.year}
              className={`overflow-hidden rounded-lg border ${
                ev.winter
                  ? "border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800/60"
                  : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
              }`}
            >
              <button
                onClick={() => setOpenYear(open ? null : ev.year)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
              >
                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-xs font-bold tabular-nums ${
                    ev.winter
                      ? "bg-slate-400 text-white dark:bg-slate-600"
                      : "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200"
                  }`}
                >
                  {ev.year}
                </span>
                {ev.winter && <Snowflake size={14} className="shrink-0 text-slate-500" />}
                <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-100">
                  {ev.title}
                </span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="border-t border-gray-100 px-3 py-3 text-sm leading-relaxed text-gray-600 dark:border-gray-800 dark:text-gray-300">
                      {ev.detail}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 튜링 테스트 */}
      <div className="mb-10 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-1 text-base font-bold">튜링 테스트의 구조</h3>
        <p className="mb-3 text-sm text-gray-500">
          칸막이를 사이에 두고 사람이 기계와 또 다른 사람에게 질문을 보내고, 돌아온 답을 보고 어느 쪽이
          기계인지 판단. 판단하지 못하면 그 기계는 지능이 있다고 봄.
        </p>
        <TuringTestDiagram />
      </div>

      {/* 기계가 하고 싶은 일 — 구분 짓기 */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-1 text-base font-bold">기계가 하고 싶은 일 — 구분 짓기</h3>
        <p className="mb-3 text-sm text-gray-500">
          충분히 많은, 보통은 잘 정리되지 않은 데이터 덩어리가 기계에 주어졌을 때, 기계가 그 데이터로부터
          일반적인 규칙을 스스로 찾아내는 것이 머신러닝.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              title: "점들 사이의 경계 찾기",
              desc: "하얀 점과 검은 점이 있을 때 둘을 구분 짓는 경계를 찾고 싶음.",
            },
            {
              title: "얼굴 구분하기",
              desc: "사람의 얼굴과 원숭이의 얼굴을 보고 어느 쪽인지 구분하고 싶음.",
            },
            {
              title: "말의 뜻 구분하기",
              desc: "\u2018재규어\u2019라는 단어가 표범처럼 생긴 동물을 뜻하는지 자동차를 뜻하는지 구분하고 싶음.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-sm font-bold text-cyan-700 dark:text-cyan-300">{item.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 머신러닝의 정의 */}
      <div className="mb-6 rounded-xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-900 dark:bg-cyan-950/40">
        <p className="text-xs font-semibold tracking-wide text-cyan-700 dark:text-cyan-300">
          머신러닝 = 기계학습
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-200">
          인간이 갖고 있는 고유의 지능적 기능인 <strong>학습 능력</strong>을 기계를 통해 구현하는 방법에
          관한 분야. 주어진 데이터를 분석하여 그로부터 <strong>일반적인 규칙</strong>이나{" "}
          <strong>새로운 지식</strong>을 기계 스스로가 자동으로 추출하기 위한 접근 방법.
        </p>
      </div>

      {/* 기존 방법 vs 머신러닝 */}
      <h3 className="mb-3 text-base font-bold">문제 풀이를 위한 접근 방법: 기존 방법 vs 머신러닝</h3>
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <p className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-200">기존 문제 풀이 방법</p>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="rounded bg-gray-100 px-2 py-1 dark:bg-gray-800">문제 파악</span>
            <ArrowRight size={12} className="text-gray-400" />
            <span className="rounded bg-gray-100 px-2 py-1 dark:bg-gray-800">규칙 작성</span>
            <ArrowRight size={12} className="text-gray-400" />
            <span className="rounded bg-slate-200 px-2 py-1 dark:bg-slate-700">프로그램</span>
            <ArrowRight size={12} className="text-gray-400" />
            <span className="rounded bg-gray-100 px-2 py-1 dark:bg-gray-800">답</span>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            데이터는 프로그램이 <strong>처리할 대상</strong>으로 입력됨.
          </p>
        </div>
        <div className="rounded-xl border border-cyan-300 bg-cyan-50 p-4 dark:border-cyan-800 dark:bg-cyan-950/40">
          <p className="mb-2 text-sm font-bold text-cyan-800 dark:text-cyan-200">머신러닝</p>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="rounded bg-white px-2 py-1 dark:bg-gray-800">문제 파악</span>
            <ArrowRight size={12} className="text-cyan-500" />
            <span className="rounded bg-white px-2 py-1 dark:bg-gray-800">학습 알고리즘</span>
            <ArrowRight size={12} className="text-cyan-500" />
            <span className="rounded bg-cyan-200 px-2 py-1 dark:bg-cyan-800">규칙</span>
            <ArrowRight size={12} className="text-cyan-500" />
            <span className="rounded bg-white px-2 py-1 dark:bg-gray-800">답</span>
          </div>
          <p className="mt-2 text-xs text-cyan-800 dark:text-cyan-300">
            데이터는 <strong>학습에 사용되거나 테스트에 사용되는</strong> 재료로 쓰임.
          </p>
        </div>
      </div>
      <div className="mb-10 overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left dark:border-gray-700">
              <th className="px-3 py-2 font-semibold text-gray-500">비교 항목</th>
              <th className="px-3 py-2 font-semibold text-gray-700 dark:text-gray-200">기존 방법</th>
              <th className="px-3 py-2 font-semibold text-cyan-700 dark:text-cyan-300">머신러닝</th>
            </tr>
          </thead>
          <tbody>
            {compareRows.map((r) => (
              <tr key={r.aspect} className="border-b border-gray-100 dark:border-gray-800">
                <td className="px-3 py-2 text-gray-500">{r.aspect}</td>
                <td className="px-3 py-2 text-gray-700 dark:text-gray-200">{r.classic}</td>
                <td className="px-3 py-2 text-gray-700 dark:text-gray-200">{r.ml}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 머신러닝은 왜 필요한가 */}
      <h3 className="mb-1 text-base font-bold">머신러닝은 왜 필요한가</h3>
      <p className="mb-3 text-sm text-gray-500">
        명시적인 지식 표현이나 프로그램을 만드는 것이 어렵거나 불가능한 경우 —{" "}
        <strong>다양한 데이터의 변형(variation, transformation)</strong>을 다루기 위한 방법.
      </p>
      <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {variations.map((v) => (
          <div
            key={v.label}
            className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
          >
            <p className="text-sm font-bold text-cyan-700 dark:text-cyan-300">{v.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">{v.desc}</p>
          </div>
        ))}
      </div>

      {/* 딥러닝 */}
      <div className="mb-10 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-1 text-base font-bold">딥러닝 — 심층학습 deep learning</h3>
        <p className="mb-3 text-sm text-gray-500">
          <strong>심층 신경망 기반의 머신러닝 분야.</strong> 신경망은 입력층, 출력층, 그리고 그 사이에
          숨어 있는 은닉층(hidden layer)으로 구성되며, 은닉층이 몇십 개·몇백 개인 경우도 있음.
        </p>
        <NeuralNetDiagram />
      </div>

      {/* 포함 관계 */}
      <h3 className="mb-1 text-base font-bold">인공지능 ⊃ 머신러닝 ⊃ 딥러닝</h3>
      <p className="mb-4 text-sm text-gray-500">원을 눌러 각 영역의 대표 시스템을 확인.</p>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
          <svg viewBox="0 0 420 300" className="w-full max-w-full" role="img" aria-label="인공지능 머신러닝 딥러닝 포함 관계">
            <ellipse
              cx="210"
              cy="150"
              rx="203"
              ry="145"
              fill={layer === "ai" ? "#cffafe" : "#f0f9ff"}
              stroke="#0891b2"
              strokeWidth="2"
              className="cursor-pointer"
              onClick={() => setLayer("ai")}
            />
            <text x="210" y="32" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#0e7490">
              인공지능
            </text>
            <ellipse
              cx="225"
              cy="168"
              rx="155"
              ry="110"
              fill={layer === "ml" ? "#a5f3fc" : "#e0f2fe"}
              stroke="#0e7490"
              strokeWidth="2"
              className="cursor-pointer"
              onClick={() => setLayer("ml")}
            />
            <text x="225" y="82" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#155e75">
              머신러닝
            </text>
            <ellipse
              cx="238"
              cy="190"
              rx="97"
              ry="68"
              fill={layer === "dl" ? "#22d3ee" : "#bae6fd"}
              stroke="#155e75"
              strokeWidth="2"
              className="cursor-pointer"
              onClick={() => setLayer("dl")}
            />
            <text x="238" y="196" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0c4a6e">
              딥러닝
            </text>
          </svg>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedLayer.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-900 dark:bg-cyan-950/40"
          >
            <p className="text-lg font-bold text-cyan-800 dark:text-cyan-200">{selectedLayer.name}</p>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">{selectedLayer.role}</p>
            <ul className="mt-4 space-y-3">
              {selectedLayer.systems.map((s) => (
                <li key={s.name} className="rounded-lg bg-white p-3 dark:bg-gray-900">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{s.name}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{s.note}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
