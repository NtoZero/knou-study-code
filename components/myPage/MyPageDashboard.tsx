"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Bookmark,
  CheckCircle2,
  Download,
  ExternalLink,
  FileInput,
  ListRestart,
  RotateCcw,
  Search,
  ShieldAlert,
  Target,
  Upload,
} from "lucide-react";
import {
  exportStudyProgress,
  getAllQuestionAttempts,
  getAllQuestionProgress,
  getBookmarkedQuestions,
  getRetryQueue,
  getStudyProgressSummary,
  importStudyProgress,
  isStudyProgressStorageAvailable,
  mergeStudyProgress,
  resetStudyProgress,
  updateQuestionProgress,
} from "@/lib/studyProgress/service";
import type {
  QuestionAttempt,
  QuestionProgress,
  StudyProgressExport,
  StudyProgressSummary,
} from "@/lib/studyProgress/types";

type DashboardTab = "summary" | "wrong" | "retry" | "bookmarks" | "history" | "manage";

const MY_PAGE_TAB_STORAGE_KEY = "knou-study-progress:my-page-tab";
const MY_PAGE_QUERY_STORAGE_KEY = "knou-study-progress:my-page-query";
const dashboardTabs: DashboardTab[] = ["summary", "wrong", "retry", "bookmarks", "history", "manage"];

const emptySummary: StudyProgressSummary = {
  totalQuestions: 0,
  answeredQuestions: 0,
  correctQuestions: 0,
  wrongQuestions: 0,
  retryQueuedQuestions: 0,
  masteredQuestions: 0,
  bookmarkedQuestions: 0,
  bySubject: [],
};

function isDashboardTab(value: string | null): value is DashboardTab {
  return dashboardTabs.includes(value as DashboardTab);
}

function readStoredTab(): DashboardTab {
  if (typeof window === "undefined") return "summary";
  const value = window.localStorage.getItem(MY_PAGE_TAB_STORAGE_KEY);
  return isDashboardTab(value) ? value : "summary";
}

function readStoredQuery() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(MY_PAGE_QUERY_STORAGE_KEY) ?? "";
}

function formatDate(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function MyPageDashboard() {
  const [summary, setSummary] = useState<StudyProgressSummary>(emptySummary);
  const [allProgress, setAllProgress] = useState<QuestionProgress[]>([]);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [retryQueue, setRetryQueue] = useState<QuestionProgress[]>([]);
  const [bookmarks, setBookmarks] = useState<QuestionProgress[]>([]);
  const [tab, setTab] = useState<DashboardTab>(readStoredTab);
  const [query, setQuery] = useState(readStoredQuery);
  const [loading, setLoading] = useState(true);
  const [storageAvailable, setStorageAvailable] = useState(true);

  const loadDashboard = useCallback(async () => {
    const available = isStudyProgressStorageAvailable();
    setStorageAvailable(available);

    if (!available) {
      setSummary(emptySummary);
      setRetryQueue([]);
      setBookmarks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const [nextSummary, nextProgress, nextAttempts, nextRetryQueue, nextBookmarks] = await Promise.all([
      getStudyProgressSummary(),
      getAllQuestionProgress(),
      getAllQuestionAttempts(),
      getRetryQueue(12),
      getBookmarkedQuestions(12),
    ]);
    setSummary(nextSummary);
    setAllProgress(nextProgress.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
    setAttempts(nextAttempts.sort((a, b) => b.answeredAt.localeCompare(a.answeredAt)));
    setRetryQueue(nextRetryQueue);
    setBookmarks(nextBookmarks);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    window.localStorage.setItem(MY_PAGE_TAB_STORAGE_KEY, tab);
  }, [tab]);

  useEffect(() => {
    window.localStorage.setItem(MY_PAGE_QUERY_STORAGE_KEY, query);
  }, [query]);

  async function handleExport() {
    const payload = await exportStudyProgress();
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `knou-study-progress-${payload.exportedAt.slice(0, 10)}.json`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  async function handleResetAll() {
    const confirmed = window.confirm("이 브라우저에 저장된 모든 풀이 기록을 삭제할까요?");
    if (!confirmed) return;
    await resetStudyProgress();
    await loadDashboard();
  }

  async function handleImport(file: File, mode: "replace" | "merge") {
    const text = await file.text();
    const payload = JSON.parse(text) as StudyProgressExport;
    if (mode === "replace") {
      await importStudyProgress(payload);
    } else {
      await mergeStudyProgress(payload);
    }
    await loadDashboard();
  }

  async function markMastered(questionId: string) {
    await updateQuestionProgress(questionId, { retryState: "mastered" });
    await loadDashboard();
  }

  const accuracy = summary.answeredQuestions > 0
    ? Math.round((summary.correctQuestions / summary.answeredQuestions) * 100)
    : 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
      <header className="mb-8 border-b border-gray-200 pb-6 dark:border-gray-800">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-gray-950 px-3 py-1 text-xs font-bold text-white dark:bg-white dark:text-gray-950">
              <Target size={14} />
              학습 기록
            </div>
            <h1 className="text-2xl font-black text-gray-950 dark:text-gray-50 sm:text-3xl">
              마이페이지
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              이 브라우저에 저장된 풀이 상태
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExport}
              disabled={!storageAvailable || summary.totalQuestions === 0}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-900"
            >
              <Download size={15} />
              내보내기
            </button>
            <button
              type="button"
              onClick={handleResetAll}
              disabled={!storageAvailable || summary.totalQuestions === 0}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-rose-200 px-3 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900 dark:text-rose-200 dark:hover:bg-rose-950/40"
            >
              <RotateCcw size={15} />
              전체 초기화
            </button>
          </div>
        </div>
      </header>

      {!storageAvailable && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          IndexedDB를 사용할 수 없어 풀이 기록을 읽을 수 없습니다.
        </div>
      )}

      <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={<Target size={18} />} label="풀이 문항" value={`${summary.answeredQuestions}`} sub={`${summary.totalQuestions}개 기록`} />
        <MetricCard icon={<CheckCircle2 size={18} />} label="정답률" value={`${accuracy}%`} sub={`${summary.correctQuestions}개 정답`} />
        <MetricCard icon={<ListRestart size={18} />} label="재풀이" value={`${summary.retryQueuedQuestions}`} sub={`${summary.masteredQuestions}개 숙달`} />
        <MetricCard icon={<Bookmark size={18} />} label="북마크" value={`${summary.bookmarkedQuestions}`} sub="저장한 문항" />
      </section>

      <section className="mb-6 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            ["summary", "요약"],
            ["wrong", "오답"],
            ["retry", "재풀이"],
            ["bookmarks", "북마크"],
            ["history", "풀이기록"],
            ["manage", "관리"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id as DashboardTab)}
              className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                tab === id
                  ? "bg-gray-950 text-white dark:bg-white dark:text-gray-950"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab !== "summary" && tab !== "manage" && (
          <label className="relative block w-full lg:w-80">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="과목, 문항, 강의 검색"
              className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-400 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
        )}
      </section>

      {tab === "summary" && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section>
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
              <ShieldAlert size={16} />
              과목별 요약
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
              {loading ? (
                <div className="p-5 text-sm text-gray-500">불러오는 중</div>
              ) : summary.bySubject.length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {summary.bySubject.map((subject) => (
                    <div key={subject.subjectSlug} className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div>
                        <div className="font-bold text-gray-950 dark:text-gray-50">{subject.subjectLabel}</div>
                        <div className="mt-1 text-xs text-gray-500">
                          풀이 {subject.answeredQuestions} · 정답 {subject.correctQuestions} · 오답 {subject.wrongQuestions}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-rose-600 dark:text-rose-300">
                        재풀이 {subject.retryQueuedQuestions}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-5 text-sm text-gray-500">아직 저장된 풀이 기록이 없습니다.</div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <QuestionList title="재풀이 대기" questions={retryQueue} emptyLabel="재풀이 대기 문항 없음" onMaster={markMastered} />
            <QuestionList title="북마크" questions={bookmarks} emptyLabel="북마크 문항 없음" />
          </aside>
        </div>
      )}

      {tab === "wrong" && (
        <QuestionTable
          title="오답노트"
          questions={filterProgress(allProgress.filter((item) => item.wrongCount > 0), query)}
          emptyLabel="오답 기록이 없습니다."
          onMaster={markMastered}
        />
      )}

      {tab === "retry" && (
        <QuestionTable
          title="재풀이 대기"
          questions={filterProgress(allProgress.filter((item) => item.retryState === "queued"), query)}
          emptyLabel="재풀이 대기 문항이 없습니다."
          onMaster={markMastered}
        />
      )}

      {tab === "bookmarks" && (
        <QuestionTable
          title="북마크"
          questions={filterProgress(allProgress.filter((item) => item.bookmarked), query)}
          emptyLabel="북마크 문항이 없습니다."
        />
      )}

      {tab === "history" && (
        <AttemptHistory attempts={filterAttempts(attempts, query)} />
      )}

      {tab === "manage" && (
        <ManagePanel
          onImportReplace={(file) => handleImport(file, "replace")}
          onImportMerge={(file) => handleImport(file, "merge")}
          onResetAll={handleResetAll}
          storageAvailable={storageAvailable}
        />
      )}
    </main>
  );
}

function filterProgress(questions: QuestionProgress[], query: string) {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return questions;
  return questions.filter((question) =>
    [
      question.subjectLabel,
      question.subjectSlug,
      question.questionTitle,
      question.lectureTitle,
      question.questionPath,
      ...(question.conceptTags ?? []),
    ]
      .join(" ")
      .toLowerCase()
      .includes(keyword),
  );
}

function filterAttempts(attempts: QuestionAttempt[], query: string) {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return attempts;
  return attempts.filter((attempt) =>
    [
      attempt.subjectLabel,
      attempt.subjectSlug,
      attempt.questionTitle,
      attempt.lectureTitle,
      attempt.questionPath,
      ...(attempt.conceptTags ?? []),
    ]
      .join(" ")
      .toLowerCase()
      .includes(keyword),
  );
}

function MetricCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-3 flex items-center justify-between text-gray-500">
        <span className="text-xs font-bold">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-black text-gray-950 dark:text-gray-50">{value}</div>
      <div className="mt-1 text-xs text-gray-500">{sub}</div>
    </div>
  );
}

function QuestionList({
  title,
  questions,
  emptyLabel,
  onMaster,
}: {
  title: string;
  questions: QuestionProgress[];
  emptyLabel: string;
  onMaster?: (questionId: string) => void;
}) {
  return (
    <section>
      <div className="mb-3 text-sm font-bold text-gray-900 dark:text-gray-100">{title}</div>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        {questions.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {questions.map((question) => (
              <div
                key={`${title}-${question.questionId}`}
                className="p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <a href={question.questionPath} className="block">
                  <div className="line-clamp-2 text-sm font-bold text-gray-950 dark:text-gray-50">
                    {question.questionTitle}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {question.subjectLabel}
                    {question.lectureId ? ` · ${question.lectureId}강` : ""}
                    {" · "}
                    {formatDate(question.retryDueAt ?? question.updatedAt)}
                  </div>
                </a>
                {onMaster && (
                  <button
                    type="button"
                    onClick={() => onMaster(question.questionId)}
                    className="mt-2 rounded-md border border-emerald-200 px-2 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-200 dark:hover:bg-emerald-950/40"
                  >
                    숙달 처리
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-sm text-gray-500">{emptyLabel}</div>
        )}
      </div>
    </section>
  );
}

function QuestionTable({
  title,
  questions,
  emptyLabel,
  onMaster,
}: {
  title: string;
  questions: QuestionProgress[];
  emptyLabel: string;
  onMaster?: (questionId: string) => void;
}) {
  return (
    <section>
      <div className="mb-3 text-sm font-bold text-gray-900 dark:text-gray-100">
        {title} {questions.length}
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        {questions.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {questions.map((question) => (
              <div key={`${title}-${question.questionId}`} className="grid gap-3 p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <span className="rounded-md bg-gray-100 px-2 py-1 font-bold dark:bg-gray-900">
                      {question.subjectLabel}
                    </span>
                    {question.lectureId && <span>{question.lectureId}강</span>}
                    {question.year && <span>{question.year}년</span>}
                    <span>시도 {question.attemptCount}</span>
                    <span>오답 {question.wrongCount}</span>
                  </div>
                  <a
                    href={question.questionPath}
                    className="mt-2 flex items-center gap-2 text-sm font-black text-gray-950 hover:text-blue-600 dark:text-gray-50"
                  >
                    <span className="line-clamp-2">{question.questionTitle}</span>
                    <ExternalLink size={14} className="shrink-0" />
                  </a>
                  {question.conceptTags && question.conceptTags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {question.conceptTags.slice(0, 5).map((tag) => (
                        <span key={`${question.questionId}-${tag}`} className="rounded-md border border-gray-200 px-2 py-0.5 text-xs text-gray-500 dark:border-gray-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <a
                    href={question.questionPath}
                    className="inline-flex h-9 items-center gap-2 rounded-lg bg-gray-950 px-3 text-sm font-bold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
                  >
                    재풀이
                    <ExternalLink size={14} />
                  </a>
                  {onMaster && (
                    <button
                      type="button"
                      onClick={() => onMaster(question.questionId)}
                      className="inline-flex h-9 items-center rounded-lg border border-emerald-200 px-3 text-sm font-bold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-200 dark:hover:bg-emerald-950/40"
                    >
                      숙달 처리
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-sm text-gray-500">{emptyLabel}</div>
        )}
      </div>
    </section>
  );
}

function AttemptHistory({ attempts }: { attempts: QuestionAttempt[] }) {
  return (
    <section>
      <div className="mb-3 text-sm font-bold text-gray-900 dark:text-gray-100">
        풀이기록 {attempts.length}
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        {attempts.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {attempts.slice(0, 300).map((attempt) => (
              <a
                key={attempt.id}
                href={attempt.questionPath}
                className="grid gap-2 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div>
                  <div className="text-sm font-bold text-gray-950 dark:text-gray-50">
                    {attempt.questionTitle}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {attempt.subjectLabel} · {formatDate(attempt.answeredAt)} · 선택 {attempt.selectedChoice ?? "-"}
                  </div>
                </div>
                <span
                  className={`w-fit rounded-lg px-2.5 py-1 text-xs font-bold ${
                    attempt.isCorrect === true
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100"
                      : attempt.isCorrect === false
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-100"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300"
                  }`}
                >
                  {attempt.isCorrect === true ? "정답" : attempt.isCorrect === false ? "오답" : "기록"}
                </span>
              </a>
            ))}
          </div>
        ) : (
          <div className="p-5 text-sm text-gray-500">풀이 기록이 없습니다.</div>
        )}
      </div>
    </section>
  );
}

function ManagePanel({
  onImportReplace,
  onImportMerge,
  onResetAll,
  storageAvailable,
}: {
  onImportReplace: (file: File) => void;
  onImportMerge: (file: File) => void;
  onResetAll: () => void;
  storageAvailable: boolean;
}) {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <ImportBox
        title="가져오기 병합"
        description="현재 기록을 보존하고 백업 파일의 최신 기록만 합칩니다."
        onImport={onImportMerge}
        disabled={!storageAvailable}
      />
      <ImportBox
        title="가져오기 교체"
        description="현재 브라우저 기록을 백업 파일 내용으로 완전히 교체합니다."
        onImport={onImportReplace}
        disabled={!storageAvailable}
      />
      <div className="rounded-lg border border-rose-200 bg-white p-4 dark:border-rose-900 dark:bg-gray-950">
        <div className="mb-2 flex items-center gap-2 text-sm font-black text-rose-700 dark:text-rose-200">
          <RotateCcw size={16} />
          전체 초기화
        </div>
        <p className="text-sm leading-6 text-gray-500">
          공용 PC나 테스트 기록 정리 시 사용합니다. 삭제한 기록은 복구할 수 없습니다.
        </p>
        <button
          type="button"
          onClick={onResetAll}
          disabled={!storageAvailable}
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-rose-600 px-3 text-sm font-bold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw size={15} />
          전체 삭제
        </button>
      </div>
    </section>
  );
}

function ImportBox({
  title,
  description,
  onImport,
  disabled,
}: {
  title: string;
  description: string;
  onImport: (file: File) => void;
  disabled: boolean;
}) {
  return (
    <label className={`block rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 ${disabled ? "opacity-50" : "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900"}`}>
      <div className="mb-2 flex items-center gap-2 text-sm font-black text-gray-950 dark:text-gray-50">
        {title.includes("병합") ? <Upload size={16} /> : <FileInput size={16} />}
        {title}
      </div>
      <p className="text-sm leading-6 text-gray-500">{description}</p>
      <input
        type="file"
        accept="application/json"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void onImport(file);
          event.target.value = "";
        }}
        className="sr-only"
      />
    </label>
  );
}
