"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BookOpenCheck, Flame, RotateCcw } from "lucide-react";
import { MultiSelectChips, SingleSelectChips } from "@/components/pastExam/PastExamFilterChips";
import PastExamModeDock from "@/components/pastExam/PastExamModeDock";
import { useQuestionProgress } from "@/hooks/useQuestionProgress";
import { pastExamIdentity } from "@/lib/studyProgress/identity";
import { resetQuestionProgressByIds } from "@/lib/studyProgress/service";
import { javaLectures } from "@/lib/constants";
import { javaPastExamQuestions, javaPastExamYears } from "./data";
import PastExamQuestionCard from "./PastExamQuestionCard";
import type { JavaChoiceKey, JavaPastExamQuestion, JavaPastExamYear } from "./types";

type StatusFilter = "all" | "unanswered" | "revealed" | "correct" | "wrong";
type Scope = "visible" | "year";
type ViewOrder = "exam" | "lecture";

function parseYear(value: string | null) {
  const year = Number(value);
  return javaPastExamYears.includes(year as JavaPastExamYear) ? (year as JavaPastExamYear) : null;
}

function pastExamLectureTitle(id: number) {
  if (id === 15) return "AWT GUI와 이벤트 처리";
  return javaLectures.find((lecture) => lecture.id === id)?.title ?? "강의";
}

export default function JavaPastExamWorkbook() {
  const pendingHashRef = useRef<string | null>(null);
  const [selectedYears, setSelectedYears] = useState<JavaPastExamYear[]>([...javaPastExamYears]);
  const [viewOrder, setViewOrder] = useState<ViewOrder>("exam");
  const [lectureId, setLectureId] = useState<number | "all">("all");
  const [conceptTag, setConceptTag] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [scope, setScope] = useState<Scope>("visible");
  const [selected, setSelected] = useState<Record<string, JavaChoiceKey>>({});
  const [answerRevealed, setAnswerRevealed] = useState<Record<string, boolean>>({});
  const [explanationExpanded, setExplanationExpanded] = useState<Record<string, boolean>>({});

  const questionIdentities = useMemo(
    () =>
      javaPastExamQuestions.map((question) =>
        pastExamIdentity({
          question,
          subjectSlug: "java",
          subjectLabel: "Java프로그래밍",
          basePath: "/java/past-exam",
        }),
      ),
    [],
  );
  const identityById = useMemo(
    () => new Map(questionIdentities.map((identity) => [identity.questionId, identity])),
    [questionIdentities],
  );
  const questionById = useMemo(() => new Map(javaPastExamQuestions.map((question) => [question.id, question])), []);
  const { progressById, recordAttempt, ensureIdentity, patchProgress, reload } = useQuestionProgress(questionIdentities);

  useEffect(() => {
    setSelected((prev) => {
      const next = { ...prev };
      Object.values(progressById).forEach((progress) => {
        if (progress.latestChoice) next[progress.questionId] = progress.latestChoice as JavaChoiceKey;
      });
      return next;
    });
    setAnswerRevealed((prev) => {
      const next = { ...prev };
      Object.values(progressById).forEach((progress) => {
        if (progress.answerRevealed) next[progress.questionId] = true;
      });
      return next;
    });
    setExplanationExpanded((prev) => {
      const next = { ...prev };
      Object.values(progressById).forEach((progress) => {
        if (progress.explanationViewed) next[progress.questionId] = true;
      });
      return next;
    });
  }, [progressById]);

  useEffect(() => {
    const linkedYear = parseYear(new URLSearchParams(window.location.search).get("year"));
    pendingHashRef.current = window.location.hash ? window.location.hash.slice(1) : null;
    if (linkedYear) setSelectedYears([linkedYear]);
  }, []);

  const yearQuestions = useMemo(
    () => javaPastExamQuestions.filter((question) => selectedYears.includes(question.year)),
    [selectedYears],
  );
  const yearOrder = useMemo(
    () => new Map(javaPastExamYears.map((item, index) => [item, index])),
    [],
  );

  const lectureOptions = useMemo(() => {
    const ids = new Set<number>();
    yearQuestions.forEach((question) => question.lectureRefs.forEach((ref) => ids.add(ref.lectureId)));
    return Array.from(ids).sort((a, b) => a - b);
  }, [yearQuestions]);

  const conceptOptions = useMemo(() => {
    const tags = new Set<string>();
    yearQuestions.forEach((question) => tags.add(question.conceptTags[0]));
    return Array.from(tags).sort((a, b) => a.localeCompare(b, "ko"));
  }, [yearQuestions]);

  const filteredQuestions = useMemo(() => {
    return yearQuestions.filter((question) => {
      if (lectureId !== "all" && !question.lectureRefs.some((ref) => ref.lectureId === lectureId)) return false;
      if (conceptTag !== "all" && question.conceptTags[0] !== conceptTag) return false;
      const revealed = Boolean(answerRevealed[question.id]);
      const chosen = selected[question.id];
      if (status === "unanswered") return !chosen;
      if (status === "revealed") return revealed;
      if (status === "correct") return revealed && chosen === question.correctChoice;
      if (status === "wrong") return revealed && Boolean(chosen) && chosen !== question.correctChoice;
      return true;
    }).sort((a, b) => {
      if (viewOrder === "lecture") {
        const lectureDelta = (a.lectureRefs[0]?.lectureId ?? 999) - (b.lectureRefs[0]?.lectureId ?? 999);
        if (lectureDelta !== 0) return lectureDelta;
      }
      return (yearOrder.get(a.year) ?? 999) - (yearOrder.get(b.year) ?? 999) || a.number - b.number;
    });
  }, [answerRevealed, conceptTag, lectureId, selected, status, viewOrder, yearOrder, yearQuestions]);

  useEffect(() => {
    const targetId = pendingHashRef.current;
    if (!targetId) return;
    const timer = window.setTimeout(() => {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ block: "start" });
        pendingHashRef.current = null;
      }
    }, 120);
    return () => window.clearTimeout(timer);
  }, [filteredQuestions.length, selectedYears]);

  const answeredCount = yearQuestions.filter((question) => selected[question.id]).length;
  const answerRevealedCount = yearQuestions.filter((question) => answerRevealed[question.id]).length;
  const explanationExpandedCount = yearQuestions.filter((question) => explanationExpanded[question.id]).length;
  const correctCount = yearQuestions.filter((question) => answerRevealed[question.id] && selected[question.id] === question.correctChoice).length;
  const wrongCount = yearQuestions.filter((question) => answerRevealed[question.id] && selected[question.id] && selected[question.id] !== question.correctChoice).length;
  const visibleAnswerRevealedCount = filteredQuestions.filter((question) => answerRevealed[question.id]).length;
  const visibleExplanationExpandedCount = filteredQuestions.filter((question) => explanationExpanded[question.id]).length;
  const scopeQuestions = scope === "visible" ? filteredQuestions : yearQuestions;

  function setAnswerVisibilityForQuestions(questions: JavaPastExamQuestion[], value: boolean) {
    setAnswerRevealed((prev) => {
      const next = { ...prev };
      questions.forEach((question) => {
        next[question.id] = value;
      });
      return next;
    });
    if (!value) {
      setExplanationExpanded((prev) => {
        const next = { ...prev };
        questions.forEach((question) => {
          next[question.id] = false;
        });
        return next;
      });
    }
    questions.forEach((question) => {
      const identity = identityById.get(question.id);
      if (!identity) return;
      void ensureIdentity(identity).then(() =>
        patchProgress(question.id, {
          answerRevealed: value,
          explanationViewed: value ? progressById[question.id]?.explanationViewed ?? false : false,
          lastReviewedAt: value ? new Date().toISOString() : progressById[question.id]?.lastReviewedAt,
        }),
      );
    });
  }

  function setExplanationForQuestions(questions: JavaPastExamQuestion[], value: boolean) {
    if (value) {
      setAnswerRevealed((prev) => {
        const next = { ...prev };
        questions.forEach((question) => {
          next[question.id] = true;
        });
        return next;
      });
    }
    setExplanationExpanded((prev) => {
      const next = { ...prev };
      questions.forEach((question) => {
        next[question.id] = value;
      });
      return next;
    });
    questions.forEach((question) => {
      const identity = identityById.get(question.id);
      if (!identity) return;
      void ensureIdentity(identity).then(() =>
        patchProgress(question.id, {
          answerRevealed: value ? true : progressById[question.id]?.answerRevealed ?? false,
          explanationViewed: value,
          lastReviewedAt: value ? new Date().toISOString() : progressById[question.id]?.lastReviewedAt,
        }),
      );
    });
  }

  function selectChoice(questionId: string, choice: JavaChoiceKey) {
    setSelected((prev) => ({ ...prev, [questionId]: choice }));
    const identity = identityById.get(questionId);
    const question = questionById.get(questionId);
    if (!identity || !question) return;
    void recordAttempt({
      ...identity,
      selectedChoice: choice,
      isCorrect: choice === question.correctChoice,
      mode: "practice",
    });
  }

  function toggleAnswer(questionId: string) {
    const nextVisible = !answerRevealed[questionId];
    setAnswerRevealed((prev) => ({ ...prev, [questionId]: nextVisible }));
    if (!nextVisible) setExplanationExpanded((prev) => ({ ...prev, [questionId]: false }));
    const identity = identityById.get(questionId);
    if (!identity) return;
    void ensureIdentity(identity).then(() =>
      patchProgress(questionId, {
        answerRevealed: nextVisible,
        explanationViewed: nextVisible ? progressById[questionId]?.explanationViewed ?? false : false,
        lastReviewedAt: nextVisible ? new Date().toISOString() : progressById[questionId]?.lastReviewedAt,
      }),
    );
  }

  function toggleExplanation(questionId: string) {
    const nextExpanded = !explanationExpanded[questionId];
    setAnswerRevealed((prev) => ({ ...prev, [questionId]: true }));
    setExplanationExpanded((prev) => ({ ...prev, [questionId]: nextExpanded }));
    const identity = identityById.get(questionId);
    if (!identity) return;
    void ensureIdentity(identity).then(() =>
      patchProgress(questionId, {
        answerRevealed: true,
        explanationViewed: nextExpanded,
        lastReviewedAt: new Date().toISOString(),
      }),
    );
  }

  async function resetYear() {
    const ids = new Set(yearQuestions.map((question) => question.id));
    setSelected((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.has(id))));
    setAnswerRevealed((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.has(id))));
    setExplanationExpanded((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.has(id))));
    await resetQuestionProgressByIds(Array.from(ids));
    await reload();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-8 sm:pt-10 lg:pb-10">
      <header className="mb-8 rounded-lg border border-amber-200 bg-white p-5 shadow-sm dark:border-amber-900 dark:bg-gray-950 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-100">
              <BookOpenCheck size={14} />
              Java프로그래밍 기출분석
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-950 dark:text-gray-50">
              2017-2019 기말 75문항 코드 판독 문제집
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
              배열, 상속, 제네릭, 스트림, 컬렉션, 스레드, JDBC 문항을 직접 풀고 코드 패널로 실행 조건을 다시 확인.
            </p>
          </div>
          <Link
            href="/java/frequent-concepts"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
          >
            <Flame size={16} />
            Java 빈출 개념
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          {[
            ["풀이", `${answeredCount}/${yearQuestions.length}`],
            ["정답 확인", `${answerRevealedCount}/${yearQuestions.length}`],
            ["해설", `${explanationExpandedCount}/${yearQuestions.length}`],
            ["맞힘/오답", `${correctCount}/${wrongCount}`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
              <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
              <div className="mt-1 text-xl font-bold text-gray-950 dark:text-gray-50">{value}</div>
            </div>
          ))}
        </div>
      </header>

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_0.9fr_0.9fr_0.8fr_0.8fr]">
          <MultiSelectChips
            label="연도"
            options={javaPastExamYears}
            selected={selectedYears}
            tone="amber"
            allLabel="전체 연도"
            getLabel={(item) => `${item}년`}
            onChange={setSelectedYears}
          />
          <SingleSelectChips
            label="보기"
            tone="amber"
            value={viewOrder}
            onChange={setViewOrder}
            options={[
              { value: "exam", label: "시험지순" },
              { value: "lecture", label: "강의순" },
            ]}
          />
          <label className="text-sm font-semibold">
            강의
            <select value={lectureId} onChange={(event) => setLectureId(event.target.value === "all" ? "all" : Number(event.target.value))} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">
              <option value="all">전체 강의</option>
              {lectureOptions.map((id) => (
                <option key={id} value={id}>{id}강 {pastExamLectureTitle(id)}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            개념
            <select value={conceptTag} onChange={(event) => setConceptTag(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">
              <option value="all">전체 개념</option>
              {conceptOptions.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            상태
            <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">
              <option value="all">전체</option>
              <option value="unanswered">미풀이</option>
              <option value="revealed">정답 확인</option>
              <option value="correct">맞힘</option>
              <option value="wrong">오답</option>
            </select>
          </label>
          <label className="text-sm font-semibold">
            일괄 범위
            <select value={scope} onChange={(event) => setScope(event.target.value as Scope)} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">
              <option value="visible">현재 필터</option>
              <option value="year">선택 연도</option>
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => setAnswerVisibilityForQuestions(scopeQuestions, true)} className="rounded-lg border border-amber-200 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 dark:border-amber-900 dark:text-amber-100 dark:hover:bg-amber-950/30">정답 모두 보기</button>
          <button type="button" onClick={() => setAnswerVisibilityForQuestions(scopeQuestions, false)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900">정답 숨기기</button>
          <button type="button" onClick={() => setExplanationForQuestions(scopeQuestions, true)} className="rounded-lg border border-amber-200 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 dark:border-amber-900 dark:text-amber-100 dark:hover:bg-amber-950/30">해설 모두 열기</button>
          <button type="button" onClick={resetYear} className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-200 dark:hover:bg-rose-950/30"><RotateCcw size={14} />선택 연도 초기화</button>
        </div>
      </section>

      <main className="space-y-4">
        {filteredQuestions.map((question) => (
          <PastExamQuestionCard
            key={question.id}
            question={question}
            selected={selected[question.id]}
            answerRevealed={answerRevealed[question.id]}
            explanationExpanded={explanationExpanded[question.id]}
            onSelect={selectChoice}
            onToggleAnswer={toggleAnswer}
            onToggleExplanation={toggleExplanation}
          />
        ))}
      </main>

      <PastExamModeDock
        tone="emerald"
        scope={scope}
        totalScopeLabel="선택 연도"
        visibleCount={filteredQuestions.length}
        totalCount={yearQuestions.length}
        answeredCount={answeredCount}
        answerRevealedCount={answerRevealedCount}
        explanationExpandedCount={explanationExpandedCount}
        correctCount={correctCount}
        wrongCount={wrongCount}
        visibleAnswerRevealedCount={visibleAnswerRevealedCount}
        visibleExplanationExpandedCount={visibleExplanationExpandedCount}
        onScopeChange={setScope}
        onRevealAnswers={() => setAnswerVisibilityForQuestions(scopeQuestions, true)}
        onHideAnswers={() => setAnswerVisibilityForQuestions(scopeQuestions, false)}
        onExpandExplanations={() => setExplanationForQuestions(scopeQuestions, true)}
        onCollapseExplanations={() => setExplanationForQuestions(scopeQuestions, false)}
        onResetProgress={resetYear}
      />
    </div>
  );
}
