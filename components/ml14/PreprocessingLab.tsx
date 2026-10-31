"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, ComputedNote, Hint, Scroller } from "./ui";

/**
 * 13.2.2 자연어처리를 위한 머신러닝 기법 — (2) 전처리.
 * “Time is an illusion.”, 특수 표기 예, “철수는 책을 읽었다.”, 품사 태깅 예문과 태그는 강의록 그대로이고,
 * 정제·정규화 작업대의 토큰 목록은 이 화면에서 만든 것이다.
 */

/* ── 토큰화 기준 ── */
const LEVELS: { key: string; label: string; tokens: string[] }[] = [
  { key: "sent", label: "문장", tokens: ["철수는 책을 읽었다."] },
  { key: "word", label: "단어(띄어쓰기)", tokens: ["철수는", "책을", "읽었다."] },
  { key: "morph", label: "형태소", tokens: ["철수", "는", "책", "을", "읽-", "었-", "-다"] },
];

/* ── 특수 표기 ── */
const SPECIAL = ["$50.50", "25/10/15", "AT&T", "Ph.D"];
const naiveSplit = (s: string) => s.split(/[^A-Za-z0-9]+/).filter(Boolean);

/* ── 형태소 판별 ── */
type Morph = "자립" | "의존";
const MORPHS: { m: string; kind: Morph }[] = [
  { m: "철수", kind: "자립" },
  { m: "는", kind: "의존" },
  { m: "책", kind: "자립" },
  { m: "을", kind: "의존" },
  { m: "읽-", kind: "의존" },
  { m: "었-", kind: "의존" },
  { m: "-다", kind: "의존" },
];

/* ── 정제·정규화 작업대 (이 화면에서 만든 토큰) ── */
const RAW = ["The", "USA", "and", "the", "US", "signed", "a", "trade", "deal", "#속보", "2025.10.31", "it", "is", "on", "Trade", "news"];

const RULES = [
  { key: "short", group: "정제", label: "길이가 짧은 단어 제거 (2글자 이하)" },
  { key: "article", group: "정제", label: "관사 제거 (a, an, the)" },
  { key: "hashtag", group: "정제", label: "정규표현식: 해시태그 제거" },
  { key: "date", group: "정제", label: "정규표현식: 기사의 날짜 제거" },
  { key: "us", group: "정규화", label: "표기가 다른 단어 통합 (US → USA)" },
  { key: "case", group: "정규화", label: "대소문자 통합" },
] as const;
type RuleKey = (typeof RULES)[number]["key"];

function applyRules(on: Record<RuleKey, boolean>): string[] {
  let out = [...RAW];
  if (on.hashtag) out = out.filter((t) => !/^#/.test(t));
  if (on.date) out = out.filter((t) => !/^\d{4}\.\d{1,2}\.\d{1,2}$/.test(t));
  // 정규화를 먼저 해 두어야 US가 ‘짧은 단어’로 지워지지 않고 USA로 합쳐진다
  if (on.us) out = out.map((t) => (t === "US" ? "USA" : t));
  if (on.case) out = out.map((t) => t.toLowerCase());
  if (on.article) out = out.filter((t) => !["a", "an", "the"].includes(t.toLowerCase()));
  if (on.short) out = out.filter((t) => t.length > 2);
  return out;
}

/* ── 품사 태깅 (강의록 예) ── */
const POS: [string, string][] = [
  ["열심히", "부사"],
  ["공부", "명사"],
  ["한", "조사"],
  ["당신", "명사"],
  [",", "구두점"],
  ["연휴", "명사"],
  ["에는", "조사"],
  ["여행", "명사"],
  ["을", "조사"],
  ["가봐요", "동사"],
];

export default function PreprocessingLab() {
  const [level, setLevel] = useState(1);
  const [exception, setException] = useState(false);
  const [morph, setMorph] = useState<(Morph | null)[]>(MORPHS.map(() => null));
  const [rules, setRules] = useState<Record<RuleKey, boolean>>({
    short: false,
    article: false,
    hashtag: false,
    date: false,
    us: false,
    case: false,
  });
  const [posOpen, setPosOpen] = useState<number | null>(null);
  const [fly, setFly] = useState<"verb" | "noun">("verb");

  const cleaned = applyRules(rules);
  const freq = cleaned.reduce<Record<string, number>>((m, t) => ({ ...m, [t]: (m[t] ?? 0) + 1 }), {});
  const morphScore = morph.filter((v, i) => v === MORPHS[i].kind).length;

  return (
    <section id="preprocessing" className="scroll-mt-32">
      <SectionTitle
        title="텍스트 전처리 — 토큰화, 정제, 정규화, 품사 태깅"
        subtitle="오류 많고 형태가 제각각인 말뭉치를 머신러닝이 다룰 수 있는 토큰으로 바꾸는 작업"
      />

      <div className="space-y-5">
        <Sourced refs={{ textbook: "13.2.2 자연어처리를 위한 머신러닝 기법 — (2) 전처리", slides: "텍스트전처리 — 토큰화" }}>
          <Card>
            <CardTitle>토큰화 tokenization — 무엇을 하나의 단위로 볼 것인가</CardTitle>
            <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              말뭉치를 의미 있는 기본 단위(“<strong>토큰</strong>”)로 나누는 작업이다. 토큰의 기준은 문장, 구, 단어, 형태소 등
              여러 가지이며 <strong>목적/응용에 따라 달라진다</strong>.
            </p>
            <div className="my-2 flex flex-wrap items-center gap-1.5 text-[12.5px]">
              <span className="font-mono">Time is an illusion.</span>
              <span className="text-gray-400">→</span>
              {["Time", "is", "an", "illusion"].map((t) => (
                <span key={t} className="rounded-md bg-violet-100 px-1.5 font-mono dark:bg-violet-900/40">“{t}”</span>
              ))}
            </div>
            <p className="mb-2 mt-3 text-[11.5px] font-semibold text-gray-600 dark:text-gray-300">같은 한국어 문장, 기준을 바꿔 보세요</p>
            <div className="mb-2 flex flex-wrap gap-2">
              {LEVELS.map((l, i) => (
                <Chip key={l.key} active={level === i} onClick={() => setLevel(i)}>
                  {l.label}
                </Chip>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {LEVELS[level].tokens.map((t, i) => (
                <span key={i} className="rounded-md border border-violet-300 px-2 py-1 font-mono text-[12.5px] dark:border-violet-700">
                  {t}
                </span>
              ))}
              <span className="self-center text-[11px] text-gray-500">— 토큰 {LEVELS[level].tokens.length}개</span>
            </div>
            <Hint>
              영어는 단어 단위로 띄어쓰기가 되어 있어 단어 단위 토큰을 정하기 쉽다. 한국어는 ‘책을’처럼 조사가 붙어 있어 조사나 어간과
              어미의 분리를 함께 고려해야 한다. 그래서 형태소 분석이 주요 연구 주제이고, 머신러닝 연구에서는 이미 개발된 복수 개의
              형태소 분석기를 문제에 맞게 적절히 선택해 사용하는 흐름이 주를 이룬다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "13.2.2 자연어처리를 위한 머신러닝 기법 — (2) 전처리", slides: "텍스트전처리 — 토큰화", lecture: "$·/·& 같은 기호도 의미를 담고 있으니 함부로 지우면 안 된다고 짚음" }}>
          <Card>
            <CardTitle>고려사항 ① — 구두점과 특수문자</CardTitle>
            <div className="mb-3 flex flex-wrap gap-2">
              <Chip active={!exception} onClick={() => setException(false)}>구두점에서 무조건 자르기</Chip>
              <Chip active={exception} onClick={() => setException(true)}>예외를 고려해 자르기</Chip>
            </div>
            <Scroller>
              <div className="grid min-w-[440px] grid-cols-4 gap-2">
                {SPECIAL.map((s) => {
                  const toks = exception ? [s] : naiveSplit(s);
                  return (
                    <div key={s} className="rounded-lg border border-gray-200 p-2 dark:border-gray-700">
                      <p className="font-mono text-[12.5px] font-bold">{s}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {toks.map((t, i) => (
                          <span
                            key={i}
                            className={`rounded px-1 font-mono text-[11px] ${toks.length > 1 ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200" : "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200"}`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <p className="mt-1 text-[10px] text-gray-500">{toks.length > 1 ? `${toks.length}조각으로 깨짐` : "하나의 토큰 유지"}</p>
                    </div>
                  );
                })}
              </div>
            </Scroller>
            <p className="mt-2 text-[12px] leading-6 text-gray-600 dark:text-gray-300">
              금액·날짜·회사명·학위처럼 구두점이 의미의 일부인 표기는 기계적으로 자르면 뜻이 사라진다. 이 밖에 줄임말, 단어 내
              띄어쓰기도 고려사항이다.
            </p>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "13.2.2 자연어처리를 위한 머신러닝 기법 — (2) 전처리", slides: "텍스트전처리 — 토큰화", lecture: "의존형태소는 목적에 따라 버리거나 살린다 — 주제 분류라면 ‘는·을·었’은 버려도 되지만, 번역에서는 과거를 나타내는 ‘었’을 버리면 안 된다고 예시" }}>
          <Card>
            <CardTitle>고려사항 ② — 한국어: 조사, 어간과 어미 분리</CardTitle>
            <p className="mb-2 text-[12.5px] text-gray-700 dark:text-gray-200">
              “철수는 책을 읽었다.”의 형태소를 눌러 자립형태소인지 의존형태소인지 정해 보세요.
            </p>
            <div className="flex flex-wrap gap-2">
              {MORPHS.map((m, i) => {
                const v = morph[i];
                const ok = v === m.kind;
                return (
                  <div key={m.m} className="rounded-lg border border-gray-200 p-2 text-center dark:border-gray-700">
                    <p className="font-mono text-[13px] font-bold">{m.m}</p>
                    <div className="mt-1 flex gap-1">
                      {(["자립", "의존"] as Morph[]).map((k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setMorph((p) => p.map((x, j) => (j === i ? k : x)))}
                          className={`rounded px-1.5 py-0.5 text-[10.5px] ${
                            v === k
                              ? ok
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                              : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                          }`}
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-[11.5px] text-gray-600 dark:text-gray-300">
                {morphScore}/{MORPHS.length} 정답 · 강의록: 자립형태소(철수, 책), 의존형태소(는, 을, 읽-, 었-, -다)
              </p>
              <button type="button" onClick={() => setMorph(MORPHS.map(() => null))} className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-[11px] text-gray-500 dark:border-gray-700">
                <RotateCcw size={11} /> 다시
              </button>
            </div>
            <Hint>‘읽-’은 뜻을 가진 어간이지만 홀로 쓰이지 못하고 어미가 붙어야 하므로 의존형태소로 분류된다.</Hint>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "13.2.2 자연어처리를 위한 머신러닝 기법 — (2) 전처리", slides: "텍스트전처리 — 정제, 정규화", lecture: "정제는 at·it·to처럼 짧고 의미가 적은 단어와, 정규식(표현 규칙을 정의하는 식)으로 찾은 해시태그·기사 날짜를 지우는 것이라고 예를 들어 설명" }}>
          <Card>
            <CardTitle>정제 cleaning 와 정규화 normalization 작업대</CardTitle>
            <div className="mb-3 grid grid-cols-1 gap-2 text-[12px] leading-5 sm:grid-cols-2">
              <p className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800/60">
                <strong>정제</strong> — 말뭉치로부터 데이터 분석에 방해되는 노이즈 데이터 제거. 등장빈도가 적은 단어, 길이가 짧은
                단어(it, at, to, on, in, by, …), 정규표현식을 사용한 특정 표현(해시태그, 기사의 날짜 등). 교재는 구두점·특수문자·관사도
                든다.
              </p>
              <p className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800/60">
                <strong>정규화</strong> — 표현 방법이 다른 단어들을 하나의 단어로 통합. 표기가 다른 단어들의 통합(US, USA),
                대소문자 통합.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {RULES.map((r) => (
                <label key={r.key} className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 px-2 py-1.5 text-[12px] dark:border-gray-700">
                  <input
                    type="checkbox"
                    checked={rules[r.key]}
                    onChange={() => setRules((p) => ({ ...p, [r.key]: !p[r.key] }))}
                    className="accent-violet-600"
                  />
                  <span className={`rounded px-1 text-[10px] font-bold ${r.group === "정제" ? "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200" : "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200"}`}>
                    {r.group}
                  </span>
                  {r.label}
                </label>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <p className="mb-1 text-[10.5px] font-semibold text-gray-500">원래 토큰 {RAW.length}개</p>
                <div className="flex flex-wrap gap-1">
                  {RAW.map((t, i) => (
                    <span key={i} className="rounded bg-gray-100 px-1.5 font-mono text-[11.5px] dark:bg-gray-800">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1 text-[10.5px] font-semibold text-gray-500">
                  처리 후 토큰 {cleaned.length}개 · 서로 다른 단어 {Object.keys(freq).length}개
                </p>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(freq).map(([t, c]) => (
                    <span key={t} className="rounded bg-violet-100 px-1.5 font-mono text-[11.5px] text-violet-800 dark:bg-violet-900/40 dark:text-violet-200">
                      {t}
                      {c > 1 && <sup className="ml-0.5 font-bold">×{c}</sup>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <Hint>
              정규화를 켜 보면 서로 다른 단어 수가 줄고 같은 단어의 빈도가 합쳐진다(표기 통합만 켜면 USA ×2, 대소문자 통합까지 켜면 usa ×2 · trade ×2). 다음 단계에서 빈도로 단어를
              표현할 때 같은 뜻의 단어가 따로 세어지지 않게 하는 것이 정규화의 역할이다. 정제는 토큰 자체를 없애고, 정규화는 토큰을
              하나로 합친다. 표기 통합을 끈 채 짧은 단어 제거만 켜면 US가 노이즈로 지워져 버린다 — 이 화면은 정규화를 정제보다
              먼저 적용한다.
            </Hint>
            <div className="mt-2">
              <ComputedNote>작업대의 토큰 목록과 날짜 형식은 규칙의 효과를 보여 주려고 이 화면에서 만든 것입니다. 각 규칙의 이름은 강의록과 교재의 예를 따랐습니다.</ComputedNote>
            </div>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "13.2.2 자연어처리를 위한 머신러닝 기법 — (2) 전처리", slides: "토큰의 품사 태깅", lecture: "같은 단어도 품사에 따라 뜻이 달라지므로 품사 태깅도 중요한 전처리라고 교재의 fly(날다/파리) 예로 다시 짚음" }}>
          <Card>
            <CardTitle>토큰의 품사 태깅</CardTitle>
            <p className="mb-2 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              필요에 따라 토큰화된 데이터의 품사를 결정하는 작업도 함께 수행한다. 강의록 예문 “열심히 공부한 당신, 연휴에는 여행을
              가봐요”의 토큰을 눌러 태그를 확인하세요.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {POS.map(([w, tag], i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPosOpen(posOpen === i ? null : i)}
                  className={`rounded-md border px-2 py-1 text-[12.5px] ${posOpen === i ? "border-violet-600 bg-violet-600 text-white" : "border-gray-200 dark:border-gray-700"}`}
                >
                  {w}
                  {posOpen === i && <span className="ml-1 text-[10.5px] opacity-80">/ {tag}</span>}
                </button>
              ))}
            </div>
            <Scroller>
              <p className="mt-3 min-w-[480px] rounded-lg bg-gray-50 p-2 font-mono text-[11px] leading-5 text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
                [ {POS.map(([w, t]) => `('${w}','${t}')`).join(", ")} ]
              </p>
            </Scroller>

            <div className="mt-4 rounded-lg border border-violet-200 p-3 dark:border-violet-800">
              <p className="text-[12px] font-semibold text-gray-700 dark:text-gray-200">왜 품사 태깅이 필요한가 — 같은 단어, 다른 의미</p>
              <div className="my-2 flex gap-2">
                <Chip active={fly === "verb"} onClick={() => setFly("verb")}>fly = 동사</Chip>
                <Chip active={fly === "noun"} onClick={() => setFly("noun")}>fly = 명사</Chip>
              </div>
              <p className="text-[13px]">
                <span className="font-mono font-bold">fly</span> →{" "}
                <strong className="text-violet-700 dark:text-violet-300">{fly === "verb" ? "날다" : "파리"}</strong>
              </p>
              <Hint>
                같은 단어라도 품사에 따라 의미가 전혀 달라질 수 있다. 그래서 입력된 단어의 품사를 결정하는 문제는 딥러닝을 이용한
                자연어처리에서도 기본적인 학습 태스크로 다루어진다.
              </Hint>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
