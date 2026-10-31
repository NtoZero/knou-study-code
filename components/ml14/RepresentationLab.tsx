"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Shuffle, X } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, ComputedNote, Formula, Hint, Scroller, Slider, LectureNote } from "./ui";

/**
 * 13.2.2 자연어처리를 위한 머신러닝 기법 — (3) 데이터 표현.
 * 말뭉치·인덱스·원핫·BoW·TF-IDF 값은 교재 그림 13-20, 13-21과 강의록 표 그대로이고,
 * TF-IDF는 식 13-1(상용로그)로 코드에서 계산한다. 문서5와 내적 예시는 이 화면에서 둔 것이다.
 */

const WORDS = ["먹고", "싶은", "수박", "토마토", "크고", "무거운", "과일", "가격", "비싸다"];

interface Doc {
  name: string;
  text: string;
  /** 정규화·조사 분리 후의 토큰 */
  tokens: string[];
}

const DOCS: Doc[] = [
  { name: "문서1", text: "먹고 싶은 수박", tokens: ["먹고", "싶은", "수박"] },
  { name: "문서2", text: "먹고 싶은 토마토", tokens: ["먹고", "싶은", "토마토"] },
  { name: "문서3", text: "크고 무거운 수박 수박", tokens: ["크고", "무거운", "수박", "수박"] },
  { name: "문서4", text: "과일 가격이 비싸다", tokens: ["과일", "가격", "비싸다"] },
];

/** 이 화면에서 덧붙여 보는 다섯 번째 문서 — 원자료에는 없음 */
const DOC5: Doc = { name: "문서5", text: "수박 가격", tokens: ["수박", "가격"] };

const PRESET = ["무거운", "수박", "크고", "수박", "가격", "비싸다"];

function bow(tokens: string[]): number[] {
  return WORDS.map((w) => tokens.filter((t) => t === w).length);
}

function f3(v: number): string {
  return v === 0 ? "0" : v.toFixed(3);
}

/* ─────────────── 비교 드릴 ─────────────── */

type Rep = "원핫인코딩" | "BoW" | "TF-IDF" | "워드 임베딩";
const REPS: Rep[] = ["원핫인코딩", "BoW", "TF-IDF", "워드 임베딩"];

const DRILL: { s: string; a: Rep; why: string }[] = [
  {
    s: "단어 하나를 단어집합의 크기만큼의 차원에서 자기 인덱스 자리만 1인 벡터로 표현한다.",
    a: "원핫인코딩",
    why: "m개 단어가 있으면 m차원 원핫벡터. 1은 단 한 자리뿐이다.",
  },
  {
    s: "문장에 각 단어가 몇 번 나왔는지를 그 단어의 인덱스 자리에 정수로 적는다. 단어의 의미는 담지 않는다.",
    a: "BoW",
    why: "BoW는 출현 빈도수를 고려한 표현이다. ‘의미까지 포함한다’는 설명은 틀린 진술이 된다.",
  },
  {
    s: "여러 문서에 두루 나오는 공용 단어는 낮은 값, 특정 문서에 국한된 단어는 큰 값으로 표현한다.",
    a: "TF-IDF",
    why: "IDF = log(N/DF)가 많은 문서에 나오는 단어의 값을 깎는다. ‘특정 문서에 국한된 단어를 작은 값으로’라고 하면 거꾸로다.",
  },
  {
    s: "유사한 의미의 단어를 벡터 공간에서 가까운 위치에 놓이도록 학습 데이터로부터 학습한다.",
    a: "워드 임베딩",
    why: "빈도 기반 표현과 달리 단어 간의 의미적 유사성을 벡터화한다. 원핫벡터를 기반으로 변환한다.",
  },
  {
    s: "단어가 몇 번 나오든 그 단어의 벡터는 언제나 같다 — 출현 빈도를 반영하지 않는다.",
    a: "원핫인코딩",
    why: "원핫벡터는 ‘어떤 단어인가’만 나타낸다. ‘자주 출현한 단어를 더 잘 표현한다’는 BoW의 특성이다.",
  },
  {
    s: "빈도수의 절대값을 그대로 쓰므로 말뭉치의 규모에 따라 벡터값이 달라지는 문제가 있다.",
    a: "BoW",
    why: "교재는 이 문제를 해결하고 문서의 빈도를 함께 고려하는 방식으로 TF-IDF를 소개한다.",
  },
];

export default function RepresentationLab() {
  /* 원핫 */
  const [oneHot, setOneHot] = useState(2);
  const [pairA, setPairA] = useState(2);
  const [pairB, setPairB] = useState(3);
  const [m, setM] = useState(9);

  /* BoW */
  const [sentence, setSentence] = useState<string[]>(PRESET);
  const vec = bow(sentence);
  const reversed = [...sentence].reverse();

  /* TF-IDF */
  const [withDoc5, setWithDoc5] = useState(false);
  const [cell, setCell] = useState<{ d: number; t: number }>({ d: 2, t: 2 });
  const { docs, N, tf, df, tfidf, maxV } = useMemo(() => {
    const docs = withDoc5 ? [...DOCS, DOC5] : DOCS;
    const N = docs.length;
    const tfM = docs.map((d) => bow(d.tokens));
    const dfV = WORDS.map((_, t) => tfM.filter((row) => row[t] > 0).length);
    const val = tfM.map((row) => row.map((c, t) => c * Math.log10(N / dfV[t])));
    const mx = Math.max(...val.flat());
    return { docs, N, tf: tfM, df: dfV, tfidf: val, maxV: mx };
  }, [withDoc5]);

  const safeCell = cell.d < N ? cell : { d: 0, t: 0 };
  const cTf = tf[safeCell.d][safeCell.t];
  const cDf = df[safeCell.t];

  /* 드릴 */
  const [picks, setPicks] = useState<(Rep | null)[]>(DRILL.map(() => null));
  const score = picks.filter((p, i) => p === DRILL[i].a).length;

  return (
    <section id="representation" className="scroll-mt-32">
      <SectionTitle
        title="데이터 표현 — 원핫인코딩, BoW, TF-IDF"
        subtitle="토큰의 시퀀스를 머신러닝 시스템이 다룰 수 있는 숫자 데이터로 바꾸는 세 가지 방법"
      />

      <div className="space-y-5">
        {/* 말뭉치와 인덱스 */}
        <Sourced
          refs={{
            textbook: "13.2.2 자연어처리를 위한 머신러닝 기법 — (3) 데이터 표현",
            slides: "데이터표현 — 원핫인코딩", lecture: "원핫 벡터는 희소해서 효율은 떨어지지만, 실제로도 데이터를 일단 원핫 벡터로 표현한 뒤 추가 작업을 거치므로 가장 기본이 되는 방법이라고 강조",
          }}
        >
          <Card>
            <CardTitle>공통 예제 — 4개의 문서로 이루어진 말뭉치</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              전처리가 끝나 토큰으로 분리되면, 이제 토큰을 숫자로 바꿔야 한다. 이때 중요한 것은 텍스트의
              각 토큰이 <strong>고유한 의미 정보</strong>를 가지므로 그것을 잘 나타내도록 표현하는 것이다.
              아래 세 방법은 모두 같은 말뭉치를 쓴다(단어 하나를 하나의 토큰으로 간주).
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                {DOCS.map((d) => (
                  <div key={d.name} className="flex gap-2 text-[12px]">
                    <span className="w-12 shrink-0 rounded bg-violet-600 px-1.5 py-0.5 text-center font-bold text-white">
                      {d.name}
                    </span>
                    <span className="text-gray-700 dark:text-gray-200">{d.text}</span>
                  </div>
                ))}
              </div>
              <Scroller>
                <table className="min-w-[320px] text-center text-[11px]">
                  <tbody>
                    <tr>
                      <th className="bg-gray-100 px-1.5 py-1 dark:bg-gray-800">단어</th>
                      {WORDS.map((w) => (
                        <td key={w} className="border border-gray-100 px-1 py-1 dark:border-gray-800">
                          {w}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th className="bg-gray-100 px-1.5 py-1 dark:bg-gray-800">index</th>
                      {WORDS.map((w, i) => (
                        <td
                          key={w}
                          className="border border-gray-100 px-1 py-1 font-mono text-violet-600 dark:border-gray-800 dark:text-violet-400"
                        >
                          {i}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </Scroller>
            </div>
            <Hint>
              문서4의 ‘가격이’는 조사를 분리해 ‘가격’ 한 단어로 센다. 말뭉치에 포함된 단어는 모두 9개다.
            </Hint>
          </Card>
        </Sourced>

        {/* (a) 원핫인코딩 */}
        <Sourced
          refs={{
            textbook: "13.2.2 자연어처리를 위한 머신러닝 기법 — (3) 데이터 표현",
            slides: "데이터표현 — 원핫인코딩",
          }}
        >
          <Card>
            <CardTitle>① 원핫인코딩 one-hot encoding</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              말뭉치로부터 획득한 단어집합의 각 단어를 <strong>고유 정수로 매핑한 후 원핫벡터로 표현</strong>
              한다. m개의 단어가 있으면 m차원 원핫벡터가 되고, 그 단어의 인덱스에 해당하는 원소만 1, 나머지는
              0이다. 단어를 눌러 보자.
            </p>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {WORDS.map((w, i) => (
                <Chip key={w} active={oneHot === i} onClick={() => setOneHot(i)}>
                  {w}
                </Chip>
              ))}
            </div>
            <Scroller>
              <div className="flex min-w-[340px] items-center gap-1 font-mono text-[12px]">
                <span className="mr-1 font-sans text-[12px] font-bold">{WORDS[oneHot]}</span>[
                {WORDS.map((w, i) => (
                  <span
                    key={w}
                    className={`flex h-7 w-7 items-center justify-center rounded ${
                      i === oneHot
                        ? "bg-violet-600 font-bold text-white"
                        : "bg-gray-100 text-gray-400 dark:bg-gray-800"
                    }`}
                  >
                    {i === oneHot ? 1 : 0}
                  </span>
                ))}
                ]
              </div>
            </Scroller>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="mb-2 text-[11px] font-semibold text-gray-500">
                  한계 ① 단어 간 유사도의 반영이 불가
                </p>
                <div className="flex flex-wrap items-center gap-2 text-[12px]">
                  <select
                    value={pairA}
                    onChange={(e) => setPairA(Number(e.target.value))}
                    className="rounded border border-gray-200 bg-white px-1.5 py-1 dark:border-gray-700 dark:bg-gray-900"
                  >
                    {WORDS.map((w, i) => (
                      <option key={w} value={i}>
                        {w}
                      </option>
                    ))}
                  </select>
                  <span>·</span>
                  <select
                    value={pairB}
                    onChange={(e) => setPairB(Number(e.target.value))}
                    className="rounded border border-gray-200 bg-white px-1.5 py-1 dark:border-gray-700 dark:bg-gray-900"
                  >
                    {WORDS.map((w, i) => (
                      <option key={w} value={i}>
                        {w}
                      </option>
                    ))}
                  </select>
                  <span className="font-mono">
                    내적 = <strong className="text-violet-600 dark:text-violet-400">{pairA === pairB ? 1 : 0}</strong>
                  </span>
                </div>
                <p className="mt-2 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  {pairA === pairB
                    ? "같은 단어끼리만 1이 나온다."
                    : `‘${WORDS[pairA]}’와 ‘${WORDS[pairB]}’처럼 서로 다른 두 단어는 1이 놓인 자리가 달라 내적이 언제나 0이다. 수박과 토마토가 둘 다 과일이라는 사실도, 먹고와 비싸다가 전혀 무관하다는 사실도 똑같이 0으로 나온다.`}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="mb-2 text-[11px] font-semibold text-gray-500">
                  한계 ② 단어 수가 많아지면 차원이 높아짐
                </p>
                <Slider
                  label="단어집합의 크기 m"
                  value={m}
                  min={9}
                  max={50000}
                  step={1}
                  onChange={setM}
                  display={`${m.toLocaleString("en-US")}개`}
                />
                <p className="mt-2 font-mono text-[12px] text-gray-700 dark:text-gray-200">
                  차원 {m.toLocaleString("en-US")} · 1의 개수 1 · 0의 개수 {(m - 1).toLocaleString("en-US")}
                </p>
                <p className="text-[11px] text-gray-500">
                  0이 차지하는 비율 {(((m - 1) / m) * 100).toFixed(2)}% — 희소 벡터의 형태
                </p>
              </div>
            </div>
            <div className="mt-3">
              <ComputedNote>
                두 원핫벡터의 내적은 원자료의 ‘단어 간 유사도의 반영이 불가’를 숫자로 보여 주려고 이 화면에서
                고른 예입니다. 단어집합 크기 슬라이더의 범위도 이 화면에서 정한 것입니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>

        {/* (b) BoW */}
        <Sourced
          refs={{
            textbook: "13.2.2 자연어처리를 위한 머신러닝 기법 — (3) 데이터 표현",
            slides: "데이터표현 — BoW", lecture: "BoW는 빈도의 절대값을 그대로 쓰므로 말뭉치 규모에 따라 값이 들쭉날쭉해지고, 그래서 TF-IDF가 등장했다고 연결",
          }}
        >
          <Card>
            <CardTitle>② BoW Bag of Words — 문장을 빈도수로</CardTitle>
            <p className="mb-2 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              하나의 문장이나 문서를 말뭉치에 포함된 단어들의 <strong>출현 빈도수</strong>로 표현한다.
            </p>
            <ol className="mb-3 space-y-0.5 text-[12px] text-gray-700 dark:text-gray-200">
              <li>① 단어집합에 포함된 각 단어에 고유한 정수 인덱스를 부여</li>
              <li>② 주어진 입력 텍스트에 대하여 각 단어의 출현 횟수를 계산</li>
              <li>③ 각 단어의 대응 위치(인덱스)에 출현 횟수를 정수값으로 표현</li>
            </ol>

            <p className="mb-1 text-[11px] font-semibold text-gray-500">단어를 눌러 문장을 만들어 보자</p>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {WORDS.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setSentence((s) => [...s, w])}
                  className="rounded-full border border-violet-200 px-2.5 py-0.5 text-[12px] text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-300 dark:hover:bg-violet-950/40"
                >
                  + {w}
                </button>
              ))}
            </div>
            <div className="mb-2 flex min-h-[34px] flex-wrap items-center gap-1 rounded-lg bg-gray-50 p-2 dark:bg-gray-800/60">
              {sentence.length === 0 && <span className="text-[11px] text-gray-400">빈 문장</span>}
              {sentence.map((w, i) => (
                <button
                  key={`${w}-${i}`}
                  type="button"
                  onClick={() => setSentence((s) => s.filter((_, j) => j !== i))}
                  className="flex items-center gap-0.5 rounded bg-white px-1.5 py-0.5 text-[12px] shadow-sm dark:bg-gray-900"
                  aria-label={`${w} 빼기`}
                >
                  {w} <X size={10} className="text-gray-400" />
                </button>
              ))}
            </div>
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSentence(PRESET)}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] dark:border-gray-700"
              >
                <RotateCcw size={11} /> 강의록 문장으로
              </button>
              <button
                type="button"
                onClick={() => setSentence([])}
                className="rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] dark:border-gray-700"
              >
                비우기
              </button>
            </div>

            <Scroller>
              <table className="min-w-[340px] text-center text-[11px]">
                <tbody>
                  <tr>
                    <th className="bg-gray-100 px-1.5 py-1 dark:bg-gray-800">index</th>
                    {WORDS.map((w, i) => (
                      <td key={w} className="border border-gray-100 px-1 py-1 dark:border-gray-800">
                        {i}
                        <div className="text-[9.5px] text-gray-400">{w}</div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th className="bg-gray-100 px-1.5 py-1 dark:bg-gray-800">빈도</th>
                    {vec.map((c, i) => (
                      <td
                        key={WORDS[i]}
                        className={`border border-gray-100 px-1 py-1 font-mono text-[13px] font-bold dark:border-gray-800 ${
                          c > 0 ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200" : "text-gray-300"
                        }`}
                      >
                        {c}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </Scroller>
            <Formula className="mt-2">BoW = [ {vec.join(", ")} ]</Formula>
            <Hint>
              강의록 문장 “무거운 수박이 크고 수박 가격이 비싸다”는 수박이 두 번 나오므로 2번 인덱스가 2인
              [0, 0, 2, 0, 1, 1, 0, 1, 1]이 된다(‘수박이’, ‘가격이’는 조사를 분리해 센다).
            </Hint>

            <div className="mt-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <p className="mb-2 flex items-center gap-1 text-[11px] font-semibold text-gray-500">
                <Shuffle size={11} /> 단어의 발생 위치는 고려되지 못함 — 순서를 뒤집어도 벡터는 같다
              </p>
              <div className="grid grid-cols-1 gap-2 text-[12px] sm:grid-cols-2">
                <div className="rounded bg-gray-50 p-2 dark:bg-gray-800/60">
                  <p>{sentence.join(" ") || "—"}</p>
                  <p className="font-mono text-violet-600 dark:text-violet-400">[{vec.join(", ")}]</p>
                </div>
                <div className="rounded bg-gray-50 p-2 dark:bg-gray-800/60">
                  <p>{reversed.join(" ") || "—"}</p>
                  <p className="font-mono text-violet-600 dark:text-violet-400">
                    [{bow(reversed).join(", ")}]
                  </p>
                </div>
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              <li>
                • 문서에 <strong>자주 출현하는 단어가 잘 표현</strong>된다 — 경제 기사와 스포츠 기사는 자주
                나오는 단어가 다르므로 이를 이용해 기사 분류가 가능하다.
              </li>
              <li>• 단어의 발생 위치는 고려되지 못한다.</li>
              <li>
                • 빈도수의 절대값을 그대로 사용하므로 <strong>말뭉치의 규모에 의존하여 벡터값이 달라지는
                문제</strong>가 발생한다 → 이를 해결하는 것이 TF-IDF다.
              </li>
            </ul>
          </Card>
        </Sourced>

        {/* (c) TF-IDF */}
        <Sourced
          refs={{
            textbook: "13.2.2 자연어처리를 위한 머신러닝 기법 — (3) 데이터 표현",
            slides: "데이터표현 — TF-IDF", lecture: "IDF에 로그를 쓰는 것은 문서 수가 커질 때 값이 지나치게 커지는 것을 막기 위해서이고, 실제 계산에서는 DF가 0이 되지 않도록 분모에 1을 더한다고 보충",
          }}
        >
          <Card>
            <CardTitle>③ TF-IDF Term Frequency-Inverse Document Frequency</CardTitle>
            <p className="mb-2 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              문서 내의 각 단어의 빈도수와 <strong>문서의 빈도</strong>를 함께 고려한 표현 방식이다. 먼저{" "}
              <strong>TF(d, t)</strong>는 d번째 문서에 t번째 단어가 나타나는 횟수로, 이 값들을 원소로 가지는
              행렬을 문서-단어 행렬(Document-Term Matrix)이라고 한다. <strong>DF(t)</strong>는 단어 t가
              나타나는 문서의 개수다. 어떤 단어가 많은 문서에서 높은 빈도로 나타난다면, 그것은 문서의 특성을
              나타내는 중요한 단어라기보다 관사나 대명사 등 의미 없는 단어일 가능성이 더 크다.
            </p>
            <Formula note="IDF(t)는 단어 t가 등장하는 문서의 개수 DF(t)에 반비례하는 값 (식 13-1)">
              TF-IDF(d, t) = TF(d, t) × IDF(t) = TF(d, t) × log( N / DF(t) )
            </Formula>
            <Hint>
              원자료의 값 0.301 = log₁₀2, 0.602 = log₁₀4이므로 여기서 log는 밑이 10인 상용로그다. N은 문서의
              개수다.
            </Hint>

            <div className="my-3 flex flex-wrap items-center gap-2">
              <Chip active={!withDoc5} onClick={() => setWithDoc5(false)}>
                원자료 말뭉치 (N = 4)
              </Chip>
              <Chip active={withDoc5} onClick={() => setWithDoc5(true)}>
                문서5 “수박 가격” 추가 (N = 5)
              </Chip>
            </div>

            <Scroller>
              <table className="min-w-[520px] text-center text-[11px]">
                <thead>
                  <tr>
                    <th className="px-1 py-1 text-gray-400">TF-IDF</th>
                    {WORDS.map((w) => (
                      <th key={w} className="px-1 py-1 font-semibold">
                        {w}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {docs.map((d, di) => (
                    <tr key={d.name}>
                      <th className="whitespace-nowrap px-1 py-1 text-left font-semibold">
                        {d.name}
                        <div className="text-[9.5px] font-normal text-gray-400">{d.text}</div>
                      </th>
                      {tfidf[di].map((v, ti) => {
                        const sel = safeCell.d === di && safeCell.t === ti;
                        const alpha = maxV > 0 ? (v / maxV) * 0.75 : 0;
                        return (
                          <td key={WORDS[ti]} className="p-0.5">
                            <button
                              type="button"
                              onClick={() => setCell({ d: di, t: ti })}
                              className={`h-9 w-full min-w-[44px] rounded font-mono text-[11px] ${
                                sel ? "ring-2 ring-violet-600" : ""
                              } ${v > 0 ? "font-bold text-gray-900 dark:text-white" : "text-gray-300"}`}
                              style={{ backgroundColor: `rgba(124, 58, 237, ${alpha.toFixed(3)})` }}
                            >
                              {f3(v)}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr>
                    <th className="px-1 py-1 text-left text-gray-500">DF(t)</th>
                    {df.map((v, i) => (
                      <td key={WORDS[i]} className="font-mono text-gray-500">
                        {v}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </Scroller>

            <div className="mt-3 rounded-lg border border-violet-200 p-3 dark:border-violet-800">
              <p className="mb-1 text-[11px] font-semibold text-violet-600 dark:text-violet-400">
                {docs[safeCell.d].name} · ‘{WORDS[safeCell.t]}’ 칸 계산
              </p>
              <div className="grid grid-cols-2 gap-1 font-mono text-[12px] text-gray-700 sm:grid-cols-5 dark:text-gray-200">
                <span>TF = {cTf}</span>
                <span>DF = {cDf}</span>
                <span>
                  N / DF = {N}/{cDf} = {(N / cDf).toFixed(2)}
                </span>
                <span>log₁₀ = {Math.log10(N / cDf).toFixed(3)}</span>
                <span className="font-bold text-violet-600 dark:text-violet-400">
                  {cTf} × {Math.log10(N / cDf).toFixed(3)} = {f3(cTf * Math.log10(N / cDf))}
                </span>
              </div>
              {cTf === 0 && (
                <p className="mt-1 text-[11px] text-gray-500">
                  이 문서에 나타나지 않는 단어이므로 TF = 0, 곱도 0이다.
                </p>
              )}
            </div>

            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              결과적으로 <strong>특정 문서에 국한된 단어는 큰 값</strong>, 일반적인 공용 단어는 낮은 값을
              가진다. 문서2의 ‘토마토’(0.602)는 두 문서에 나오는 ‘먹고’(0.301)보다 크고, 문서3의 ‘수박’은 한
              문서에 두 번 나와 TF가 2이므로 0.301 × 2 = 0.602가 된다.
            </p>
            {withDoc5 && (
              <p className="mt-1 text-[12px] leading-6 text-gray-600 dark:text-gray-300">
                문서5가 들어오자 ‘수박’의 DF가 3이 되어 IDF가 log₁₀(5/3) ≈ 0.222로 줄었다. 여전히 한 문서에만
                나오는 단어(토마토·크고·무거운·과일·비싸다)는 N이 커져 log₁₀5 ≈ 0.699로 오히려 커졌고, 문서5에도
                나온 ‘가격’은 DF가 2가 되어 0.602 → 0.398로 줄었다. 더 많은 문서에 퍼질수록 값이 깎인다.
              </p>
            )}

            <LectureNote>
              IDF에 로그를 쓰는 것은, 로그 없이 N/DF(t)를 그대로 곱하면 문서 수 N이 커질수록 희귀한 단어의 값이 지나치게 커지기 때문이다. 또 실제 계산에서는 어떤 단어의 DF(t)가 0이면 분모가 0이 되므로 보통 분모에 1을 더한 형태로 계산한다. 시험의 계산 문제는 교재 식 13-1 그대로 푼다. TF-IDF는 초창기 자연어처리에서 많이 쓰인 유명한 방법이다.
            </LectureNote>
            <div className="mt-3 space-y-2">
              <ComputedNote>
                교재 그림 13-21의 TF-IDF 표에는 ‘수박’ 칸이 문서1 0.125, 문서3 0.250으로 인쇄되어 있습니다.
                그러나 같은 그림의 DF(수박) = 2와 식 13-1로 계산하면 log₁₀(4/2) = 0.301, 0.301 × 2 = 0.602이고,
                강의록의 표도 이 값을 씁니다. 이 화면은 식과 강의록 값을 따릅니다.
              </ComputedNote>
              {withDoc5 && (
                <ComputedNote>
                  문서5 “수박 가격”은 DF와 N의 변화를 보여 주려고 이 화면에서 덧붙인 문서로, 원자료에는 없습니다.
                </ComputedNote>
              )}
            </div>
          </Card>
        </Sourced>

        {/* 마무리 + 드릴 */}
        <Sourced
          refs={{
            textbook: "13.2.2 자연어처리를 위한 머신러닝 기법 — (3) 데이터 표현",
            slides: "데이터표현 — 원핫인코딩 · BoW · TF-IDF",
          }}
        >
          <Card>
            <CardTitle>빈도수 기반 표현의 한계와 구분 드릴</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              지금까지의 표현은 모두 말뭉치에 포함된 단어들의 <strong>빈도수에 기반</strong>한다. 비교적
              간단하게 표현할 수 있고 특정 문서에 고유하게 나타나는 단어로 문서의 특성을 잘 나타낼 수 있지만,{" "}
              <strong>단어 간의 의미 관계나 문맥 정보를 표현할 수 없다</strong>. 의미를 담은 벡터를 찾으려면
              단어 간의 문맥 관계를 이용해야 하고, 그러려면 데이터를 이용한 <strong>학습</strong>이 필요하다 —
              다음 단계인 워드 임베딩이다.
            </p>
            <p className="mb-2 text-[11px] font-semibold text-gray-500">
              각 설명이 가리키는 표현 방법을 고르세요 — {score} / {DRILL.length}
            </p>
            <div className="space-y-2">
              {DRILL.map((d, i) => {
                const p = picks[i];
                return (
                  <div key={d.s} className="rounded-lg border border-gray-200 p-2.5 dark:border-gray-700">
                    <p className="mb-1.5 text-[12.5px] text-gray-700 dark:text-gray-200">{d.s}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {REPS.map((r) => {
                        const chosen = p === r;
                        const tone =
                          p === null
                            ? "border-gray-200 text-gray-600 hover:border-violet-400 dark:border-gray-700 dark:text-gray-300"
                            : r === d.a
                              ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                              : chosen
                                ? "border-red-400 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300"
                                : "border-gray-200 text-gray-400 dark:border-gray-700";
                        return (
                          <button
                            key={r}
                            type="button"
                            disabled={p !== null}
                            onClick={() => setPicks((ps) => ps.map((v, j) => (j === i ? r : v)))}
                            className={`rounded-full border px-2.5 py-0.5 text-[11.5px] ${tone}`}
                          >
                            {r}
                          </button>
                        );
                      })}
                    </div>
                    {p !== null && (
                      <p className="mt-1.5 text-[11.5px] leading-5 text-gray-600 dark:text-gray-400">
                        {p === d.a ? "정답. " : `오답 — 정답은 ${d.a}. `}
                        {d.why}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setPicks(DRILL.map(() => null))}
              className="mt-2 flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <RotateCcw size={11} /> 다시 풀기
            </button>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
