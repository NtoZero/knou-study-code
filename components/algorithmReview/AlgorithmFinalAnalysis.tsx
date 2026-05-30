"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BarChart3, CheckCircle2, ClipboardCheck, Gauge, Route, Target } from "lucide-react";
import { algorithmChapterWeights, algorithmLectures, type AlgorithmChapterId } from "@/lib/algorithmCourse";

type Confidence = 0 | 1 | 2;

type ChapterDetail = {
  focus: string[];
  risk: string;
  practice: string;
  visualizer?: string;
};

const totalQuestions = 25;

const chapterDetails: Record<AlgorithmChapterId, ChapterDetail> = {
  1: {
    focus: ["알고리즘 정의와 조건", "대표 설계 기법", "배낭 문제", "시간·공간 복잡도", "점근 표기와 점화식"],
    risk: "정의 문제처럼 보여도 이론적 조건과 실무적 조건, Big-O/Ω/Θ의 방향을 바꾸어 낸다.",
    practice: "조건 판정과 복잡도 계산을 먼저 풀고, 점화식은 기본형으로 빠르게 환원한다.",
  },
  2: {
    focus: ["버블·선택·삽입·셸 정렬", "partition()과 merge()", "힙 성질", "계수·기수·버킷 정렬 조건", "안정성·제자리·비교 기반 여부"],
    risk: "7문항으로 최다 비중이다. 처리 과정, 성능표, 안정성/제자리 여부를 섞어 내면 단순 암기로는 흔들린다.",
    practice: "정렬별 한 패스 결과, 입력 상태별 성능, 선형 시간 정렬의 적용 조건을 표와 단계 추적으로 함께 확인한다.",
    visualizer: "/algorithm/visualizer?category=sort",
  },
  3: {
    focus: ["순차 탐색과 이진 탐색", "BST 삽입·삭제", "2-3-4 트리", "레드-블랙 트리", "해싱과 선형 탐사"],
    risk: "트리 조작은 한 단계만 틀려도 답이 바뀐다. 해싱은 충돌 해결 방식과 클러스터링 설명을 구분해야 한다.",
    practice: "BST 삭제의 두 자식 사례, 2-3-4 노드 분할, 레드-블랙 색 규칙, 선형 탐사 충돌 경로를 손으로 추적한다.",
    visualizer: "/algorithm/visualizer?category=search",
  },
  4: {
    focus: ["인접 행렬·리스트", "DFS와 위상 정렬", "강연결 성분", "크루스칼·프림", "데이크스트라·벨만-포드·플로이드", "포드-풀커슨"],
    risk: "6문항 고비중이다. MST, 최단 경로, 네트워크 플로는 같은 그래프 문제처럼 보여도 선택 기준이 다르다.",
    practice: "방문 순서, 간선 선택, 거리 갱신, P[][] 경로 복원, 증가 경로 여유량을 단계별 표로 검산한다.",
    visualizer: "/algorithm/visualizer?category=graph",
  },
  5: {
    focus: ["동적 프로그래밍 개념", "최적성의 원리", "상향식 테이블", "행렬 연쇄 곱셈 C[][]", "P[][]로 최적 순서 복원"],
    risk: "1문항이어도 계산형으로 나오면 시간이 걸린다. 테이블의 행·열 의미와 P[][] 해석을 놓치기 쉽다.",
    practice: "작은 행렬 4~5개 예시로 최소 곱셈 횟수와 괄호 순서를 한 번 직접 채운다.",
  },
  6: {
    focus: ["라빈-카프", "KMP 실패 함수", "보이어-무어 불일치 문자 방법", "허프만 트리·코드", "LZ77 인코딩"],
    risk: "문자열 포인터와 압축 트리는 절차를 기억하지 못하면 보기의 수치가 모두 비슷해 보인다.",
    practice: "KMP 전처리, BM 이동량, 허프만 병합 순서, LZ77 토큰을 한 예제로 끝까지 추적한다.",
  },
  7: {
    focus: ["NP와 NP-완전", "다항 시간 변환", "대표 NP-완전 문제", "외판원·버텍스 커버·CNF-만족성", "근사 알고리즘"],
    risk: "1문항이지만 정의의 방향을 묻는다. NP-완전 조건과 NP-하드/근사 문제를 혼동하면 틀린다.",
    practice: "NP-완전의 두 조건과 대표 문제 이름을 짧게 묶어 마지막에 확인한다.",
  },
};

const confidenceLabels: Record<Confidence, string> = {
  0: "모름",
  1: "애매",
  2: "자신",
};

const checklist = [
  { id: "sort-table", chapter: 2 as AlgorithmChapterId, text: "정렬 알고리즘별 최선·평균·최악, 안정성, 제자리 여부를 한 표로 말할 수 있다." },
  { id: "partition", chapter: 2 as AlgorithmChapterId, text: "퀵 정렬 partition() 1회 결과와 피벗 최종 위치를 손으로 추적할 수 있다." },
  { id: "linear-sort", chapter: 2 as AlgorithmChapterId, text: "계수·기수·버킷 정렬의 선형 시간 조건과 내부 정렬 필요 여부를 구분한다." },
  { id: "dfs-scc", chapter: 4 as AlgorithmChapterId, text: "DFS 방문 순서, 위상 정렬 조건, 강연결 성분 절차를 구분한다." },
  { id: "mst-shortest", chapter: 4 as AlgorithmChapterId, text: "크루스칼·프림·데이크스트라의 선택 단위와 한계를 비교할 수 있다." },
  { id: "floyd-flow", chapter: 4 as AlgorithmChapterId, text: "플로이드 P[][] 경로 복원과 포드-풀커슨 증가 경로 여유량을 설명할 수 있다." },
  { id: "bst", chapter: 3 as AlgorithmChapterId, text: "BST 삭제, 2-3-4 삽입, 레드-블랙 삽입 보정의 핵심 단계를 안다." },
  { id: "hash", chapter: 3 as AlgorithmChapterId, text: "선형 탐사에서 클러스터링이 왜 평균 탐색 시간을 늘리는지 설명할 수 있다." },
  { id: "complexity", chapter: 1 as AlgorithmChapterId, text: "O, Ω, Θ의 의미와 기본 점화식 성능을 구분한다." },
  { id: "knapsack", chapter: 1 as AlgorithmChapterId, text: "분할 가능 배낭과 0/1 배낭에서 적용 기법이 달라지는 이유를 안다." },
  { id: "matrix-chain", chapter: 5 as AlgorithmChapterId, text: "행렬 연쇄 곱셈에서 C[][]와 P[][]의 역할을 구분한다." },
  { id: "string", chapter: 6 as AlgorithmChapterId, text: "KMP 전처리, 보이어-무어 이동, 허프만 병합, LZ77 토큰을 한 번씩 추적했다." },
  { id: "np", chapter: 7 as AlgorithmChapterId, text: "NP-완전 문제의 정의와 대표 문제 종류를 말할 수 있다." },
];

const storageKey = "knou-algorithm-final-analysis";

export function AlgorithmFinalAnalysis() {
  const [selectedChapter, setSelectedChapter] = useState<AlgorithmChapterId>(2);
  const [highOnly, setHighOnly] = useState(false);
  const [confidence, setConfidence] = useState<Record<number, Confidence>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [storageReady, setStorageReady] = useState(false);

  const chapters = useMemo(() => {
    return algorithmChapterWeights.map((chapter) => ({
      ...chapter,
      percent: Math.round((chapter.count / totalQuestions) * 100),
      tier: chapter.count >= 6 ? "고비중" : chapter.count >= 3 ? "중비중" : "저비중",
      detail: chapterDetails[chapter.chapter],
      lecturesData: algorithmLectures.filter((lecture) => (chapter.lectures as readonly number[]).includes(lecture.id)),
    }));
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as { confidence?: Record<string, Confidence>; checked?: Record<string, boolean> };
        if (parsed.confidence) setConfidence(parsed.confidence);
        if (parsed.checked) setChecked(parsed.checked);
      }
    } catch {
      // localStorage is optional; the analysis still works without persistence.
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem(storageKey, JSON.stringify({ confidence, checked }));
  }, [checked, confidence, storageReady]);

  const visibleChapters = highOnly ? chapters.filter((chapter) => chapter.count >= 6) : chapters;
  const selected = chapters.find((chapter) => chapter.chapter === selectedChapter) ?? chapters[0];
  const completedCount = checklist.filter((item) => checked[item.id]).length;
  const completion = Math.round((completedCount / checklist.length) * 100);

  const priority = [...chapters]
    .map((chapter) => {
      const level = confidence[chapter.chapter] ?? 0;
      return {
        ...chapter,
        score: (2 - level) * chapter.count,
        confidenceLabel: confidenceLabels[level],
      };
    })
    .sort((a, b) => b.score - a.score || b.count - a.count);

  return (
    <section className="mb-8 space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100">
              <Target size={14} />
              기말분석
            </div>
            <h2 className="text-2xl font-bold">25문항을 출제 비중대로 재배치</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              상위 두 장인 정렬과 그래프가 13문항, 전체의 52%를 차지한다. 먼저 고비중 단원을 잡고, 나머지는 정의·조건·절차형으로 압축한다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setHighOnly((prev) => !prev)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {highOnly ? "전체 비중 보기" : "고비중만 보기"}
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          {visibleChapters.map((chapter) => (
            <button
              key={chapter.chapter}
              type="button"
              onClick={() => setSelectedChapter(chapter.chapter)}
              className={`grid gap-3 rounded-xl border p-3 text-left transition md:grid-cols-[9rem_1fr_5rem] md:items-center ${
                selectedChapter === chapter.chapter
                  ? "border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/30"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
              }`}
            >
              <div>
                <div className="text-sm font-bold">교재 {chapter.chapter}장</div>
                <div className="mt-1 text-xs text-slate-500">{chapter.title}</div>
              </div>
              <div className="h-5 overflow-hidden rounded-full bg-white ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800">
                <div
                  className={`h-full rounded-full transition-all ${
                    chapter.count >= 6 ? "bg-rose-500" : chapter.count >= 3 ? "bg-cyan-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${chapter.percent}%` }}
                />
              </div>
              <div className="text-right">
                <div className="text-lg font-black">{chapter.count}문항</div>
                <div className="text-xs text-slate-500">{chapter.percent}% · {chapter.tier}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-4 flex items-center gap-2 text-lg font-bold">
            <Route size={20} className="text-cyan-600" />
            선택 단원 공략
          </div>
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-slate-950 px-3 py-1 text-sm font-bold text-white dark:bg-cyan-200 dark:text-slate-950">
                교재 {selected.chapter}장
              </span>
              <span className="text-sm font-semibold">{selected.title}</span>
              <span className="text-xs text-slate-500">{selected.count}문항 배정</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">{selected.detail.risk}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{selected.detail.practice}</p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {selected.detail.focus.map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold dark:border-slate-800 dark:bg-slate-950">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {selected.lecturesData.map((lecture) => (
              <Link
                key={lecture.id}
                href={`/algorithm/lecture/${lecture.id}`}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
              >
                {lecture.id}강 {lecture.title}
              </Link>
            ))}
            <Link
              href={`/algorithm/past-exam?chapter=${selected.chapter}`}
              className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-800 hover:bg-cyan-100 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-100"
            >
              기출에서 이 장만 풀기
            </Link>
            {selected.detail.visualizer && (
              <Link
                href={selected.detail.visualizer}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                시각화로 확인
              </Link>
            )}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-4 flex items-center gap-2 text-lg font-bold">
            <Gauge size={20} className="text-amber-600" />
            취약 단원 진단
          </div>
          <div className="space-y-3">
            {chapters.map((chapter) => {
              const level = confidence[chapter.chapter] ?? 0;
              return (
                <div key={`confidence-${chapter.chapter}`} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-sm font-bold">교재 {chapter.chapter}장 {chapter.title}</span>
                    <span className="text-xs text-slate-500">{chapter.count}문항</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {([0, 1, 2] as Confidence[]).map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setConfidence((prev) => ({ ...prev, [chapter.chapter]: value }))}
                        className={`rounded-md px-2 py-1 text-xs font-bold ${
                          level === value
                            ? "bg-amber-500 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                        }`}
                      >
                        {confidenceLabels[value]}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl bg-amber-50 p-3 dark:bg-amber-950/30">
            <div className="mb-2 text-sm font-bold text-amber-900 dark:text-amber-100">지금 볼 순서</div>
            <ol className="space-y-1 text-sm leading-6 text-amber-900 dark:text-amber-100">
              {priority.slice(0, 4).map((chapter, index) => (
                <li key={`priority-${chapter.chapter}`}>
                  {index + 1}. 교재 {chapter.chapter}장 {chapter.title} · {chapter.confidenceLabel} · 우선점수 {chapter.score}
                </li>
              ))}
            </ol>
          </div>
        </article>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-lg font-bold">
              <ClipboardCheck size={20} className="text-emerald-600" />
              시험 직전 체크리스트
            </div>
            <p className="mt-1 text-sm text-slate-500">완료한 항목은 이 브라우저에 저장된다.</p>
          </div>
          <div className="min-w-44">
            <div className="mb-1 text-right text-xs font-bold text-slate-500">{completedCount}/{checklist.length} · {completion}%</div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${completion}%` }} />
            </div>
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          {checklist.map((item) => {
            const done = Boolean(checked[item.id]);
            const chapter = chapters.find((entry) => entry.chapter === item.chapter);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setChecked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                className={`flex items-start gap-3 rounded-xl border p-3 text-left text-sm leading-6 transition ${
                  done
                    ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                <CheckCircle2 size={18} className={`mt-0.5 shrink-0 ${done ? "text-emerald-600" : "text-slate-400"}`} />
                <span>
                  <span className="mb-1 block text-xs font-bold text-slate-500">교재 {item.chapter}장 {chapter?.title}</span>
                  {item.text}
                </span>
              </button>
            );
          })}
        </div>
      </article>

      <div className="grid gap-3 rounded-2xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-900 dark:bg-cyan-950/30 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="flex items-center gap-2 font-bold text-cyan-900 dark:text-cyan-100">
            <BarChart3 size={18} />
            기출분석과 함께 쓰는 순서
          </div>
          <p className="mt-2 text-sm leading-6 text-cyan-900/80 dark:text-cyan-100/80">
            먼저 이 페이지에서 고비중·취약 단원을 고르고, 기출분석 문제집에서는 해당 장 필터로 실제 문항을 푼다. 정렬과 그래프는 시각화 페이지에서 단계 변화를 한 번 더 확인한다.
          </p>
        </div>
        <Link
          href="/algorithm/past-exam"
          className="inline-flex justify-center rounded-lg bg-cyan-700 px-4 py-2 text-sm font-bold text-white hover:bg-cyan-800 dark:bg-cyan-200 dark:text-cyan-950 dark:hover:bg-cyan-100"
        >
          기출분석 열기
        </Link>
      </div>
    </section>
  );
}
