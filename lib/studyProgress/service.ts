import {
  QUESTION_ATTEMPTS_STORE,
  QUESTION_PROGRESS_STORE,
  canUseIndexedDb,
  clearStore,
  deleteRecord,
  getAllFromStore,
  getByKey,
  putRecord,
  replaceAllStudyProgress,
} from "./db";
import {
  STUDY_PROGRESS_SCHEMA_VERSION,
  type QuestionAttempt,
  type QuestionAttemptInput,
  type QuestionIdentity,
  type QuestionProgress,
  type QuestionProgressPatch,
  type ResetStudyProgressScope,
  type StudyProgressExport,
  type StudyProgressSummary,
} from "./types";

const RETRY_INTERVAL_MS = 24 * 60 * 60 * 1000;

function nowIso() {
  return new Date().toISOString();
}

function createAttemptId(questionId: string, answeredAt: string) {
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `${questionId}:${Date.parse(answeredAt)}:${randomPart}`;
}

function nextRetryDueAt(wrongCount: number, answeredAt: string) {
  const delay = Math.max(1, Math.min(wrongCount, 7)) * RETRY_INTERVAL_MS;
  return new Date(Date.parse(answeredAt) + delay).toISOString();
}

function createProgress(identity: QuestionIdentity, timestamp: string): QuestionProgress {
  return {
    ...identity,
    schemaVersion: STUDY_PROGRESS_SCHEMA_VERSION,
    attemptCount: 0,
    correctCount: 0,
    wrongCount: 0,
    answerRevealed: false,
    explanationViewed: false,
    retryState: "none",
    bookmarked: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function normalizeProgress(identity: QuestionIdentity, previous: QuestionProgress | undefined, timestamp: string) {
  return {
    ...(previous ?? createProgress(identity, timestamp)),
    ...identity,
    schemaVersion: STUDY_PROGRESS_SCHEMA_VERSION,
    updatedAt: timestamp,
  };
}

function matchesScope(progress: QuestionProgress, scope?: ResetStudyProgressScope) {
  if (!scope) return true;
  if (scope.source && progress.source !== scope.source) return false;
  if (scope.subjectSlug && progress.subjectSlug !== scope.subjectSlug) return false;
  return true;
}

export function isStudyProgressStorageAvailable() {
  return canUseIndexedDb();
}

export async function getQuestionProgress(questionId: string) {
  return getByKey<QuestionProgress>(QUESTION_PROGRESS_STORE, questionId);
}

export async function getAllQuestionProgress() {
  return getAllFromStore<QuestionProgress>(QUESTION_PROGRESS_STORE);
}

export async function getAllQuestionAttempts() {
  return getAllFromStore<QuestionAttempt>(QUESTION_ATTEMPTS_STORE);
}

export async function getQuestionProgressMap(questionIds: string[]) {
  const entries = await Promise.all(
    questionIds.map(async (questionId) => [questionId, await getQuestionProgress(questionId)] as const),
  );

  return Object.fromEntries(entries.filter(([, progress]) => Boolean(progress))) as Record<string, QuestionProgress>;
}

export async function recordQuestionAttempt(input: QuestionAttemptInput) {
  const answeredAt = input.answeredAt ?? nowIso();
  const previous = await getQuestionProgress(input.questionId);
  const progress = normalizeProgress(input, previous, answeredAt);
  const isCorrect = input.isCorrect ?? (
    input.correctChoice && input.selectedChoice
      ? input.selectedChoice === input.correctChoice
      : undefined
  );

  const nextCorrectCount = progress.correctCount + (isCorrect === true ? 1 : 0);
  const nextWrongCount = progress.wrongCount + (isCorrect === false ? 1 : 0);
  const retryState =
    isCorrect === true && nextWrongCount > 0 && nextCorrectCount >= nextWrongCount + 2
      ? "mastered"
      : isCorrect === false
        ? "queued"
        : progress.retryState;

  const nextProgress: QuestionProgress = {
    ...progress,
    latestChoice: input.selectedChoice ?? progress.latestChoice,
    latestWrittenAnswer: input.writtenAnswer ?? progress.latestWrittenAnswer,
    isCorrect,
    attemptCount: progress.attemptCount + 1,
    correctCount: nextCorrectCount,
    wrongCount: nextWrongCount,
    firstAttemptedAt: progress.firstAttemptedAt ?? answeredAt,
    lastAttemptedAt: answeredAt,
    retryState,
    retryDueAt: isCorrect === false ? nextRetryDueAt(nextWrongCount, answeredAt) : progress.retryDueAt,
    updatedAt: answeredAt,
  };

  const attempt: QuestionAttempt = {
    ...input,
    id: createAttemptId(input.questionId, answeredAt),
    schemaVersion: STUDY_PROGRESS_SCHEMA_VERSION,
    mode: input.mode ?? "practice",
    answeredAt,
    isCorrect,
  };

  await putRecord(QUESTION_ATTEMPTS_STORE, attempt);
  await putRecord(QUESTION_PROGRESS_STORE, nextProgress);

  return nextProgress;
}

export async function upsertQuestionIdentity(identity: QuestionIdentity) {
  const timestamp = nowIso();
  const previous = await getQuestionProgress(identity.questionId);
  const nextProgress = normalizeProgress(identity, previous, timestamp);
  await putRecord(QUESTION_PROGRESS_STORE, nextProgress);
  return nextProgress;
}

export async function updateQuestionProgress(questionId: string, patch: QuestionProgressPatch) {
  const previous = await getQuestionProgress(questionId);
  if (!previous) return undefined;

  const nextProgress: QuestionProgress = {
    ...previous,
    ...patch,
    updatedAt: nowIso(),
  };

  await putRecord(QUESTION_PROGRESS_STORE, nextProgress);
  return nextProgress;
}

export async function getRetryQueue(limit?: number) {
  const progress = await getAllQuestionProgress();
  const queued = progress
    .filter((item) => item.retryState === "queued")
    .sort((a, b) => (a.retryDueAt ?? a.updatedAt).localeCompare(b.retryDueAt ?? b.updatedAt));

  return typeof limit === "number" ? queued.slice(0, limit) : queued;
}

export async function getBookmarkedQuestions(limit?: number) {
  const progress = await getAllQuestionProgress();
  const bookmarked = progress
    .filter((item) => item.bookmarked)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return typeof limit === "number" ? bookmarked.slice(0, limit) : bookmarked;
}

export async function getStudyProgressSummary(): Promise<StudyProgressSummary> {
  const progress = await getAllQuestionProgress();
  const bySubjectMap = new Map<string, StudyProgressSummary["bySubject"][number]>();

  progress.forEach((item) => {
    const current = bySubjectMap.get(item.subjectSlug) ?? {
      subjectSlug: item.subjectSlug,
      subjectLabel: item.subjectLabel,
      totalQuestions: 0,
      answeredQuestions: 0,
      correctQuestions: 0,
      wrongQuestions: 0,
      retryQueuedQuestions: 0,
    };

    current.totalQuestions += 1;
    current.answeredQuestions += item.attemptCount > 0 ? 1 : 0;
    current.correctQuestions += item.isCorrect === true ? 1 : 0;
    current.wrongQuestions += item.wrongCount > 0 ? 1 : 0;
    current.retryQueuedQuestions += item.retryState === "queued" ? 1 : 0;
    bySubjectMap.set(item.subjectSlug, current);
  });

  return {
    totalQuestions: progress.length,
    answeredQuestions: progress.filter((item) => item.attemptCount > 0).length,
    correctQuestions: progress.filter((item) => item.isCorrect === true).length,
    wrongQuestions: progress.filter((item) => item.wrongCount > 0).length,
    retryQueuedQuestions: progress.filter((item) => item.retryState === "queued").length,
    masteredQuestions: progress.filter((item) => item.retryState === "mastered").length,
    bookmarkedQuestions: progress.filter((item) => item.bookmarked).length,
    bySubject: Array.from(bySubjectMap.values()).sort((a, b) =>
      b.answeredQuestions - a.answeredQuestions || a.subjectLabel.localeCompare(b.subjectLabel, "ko"),
    ),
  };
}

export async function resetStudyProgress(scope?: ResetStudyProgressScope) {
  if (!scope) {
    await clearStore(QUESTION_PROGRESS_STORE);
    await clearStore(QUESTION_ATTEMPTS_STORE);
    return;
  }

  const progress = await getAllQuestionProgress();
  const attempts = await getAllFromStore<QuestionAttempt>(QUESTION_ATTEMPTS_STORE);
  const questionIds = new Set(progress.filter((item) => matchesScope(item, scope)).map((item) => item.questionId));

  await Promise.all([
    ...Array.from(questionIds).map((questionId) => deleteRecord(QUESTION_PROGRESS_STORE, questionId)),
    ...attempts
      .filter((attempt) => questionIds.has(attempt.questionId))
      .map((attempt) => deleteRecord(QUESTION_ATTEMPTS_STORE, attempt.id)),
  ]);
}

export async function resetQuestionProgressByIds(questionIds: string[]) {
  const questionIdSet = new Set(questionIds);
  const attempts = await getAllFromStore<QuestionAttempt>(QUESTION_ATTEMPTS_STORE);

  await Promise.all([
    ...questionIds.map((questionId) => deleteRecord(QUESTION_PROGRESS_STORE, questionId)),
    ...attempts
      .filter((attempt) => questionIdSet.has(attempt.questionId))
      .map((attempt) => deleteRecord(QUESTION_ATTEMPTS_STORE, attempt.id)),
  ]);
}

export async function exportStudyProgress(): Promise<StudyProgressExport> {
  return {
    schemaVersion: STUDY_PROGRESS_SCHEMA_VERSION,
    exportedAt: nowIso(),
    progress: await getAllQuestionProgress(),
    attempts: await getAllFromStore<QuestionAttempt>(QUESTION_ATTEMPTS_STORE),
  };
}

export async function importStudyProgress(payload: StudyProgressExport) {
  if (payload.schemaVersion !== STUDY_PROGRESS_SCHEMA_VERSION) {
    throw new Error(`Unsupported study progress schema version: ${payload.schemaVersion}`);
  }

  await replaceAllStudyProgress(payload.progress, payload.attempts);
}

export async function mergeStudyProgress(payload: StudyProgressExport) {
  if (payload.schemaVersion !== STUDY_PROGRESS_SCHEMA_VERSION) {
    throw new Error(`Unsupported study progress schema version: ${payload.schemaVersion}`);
  }

  const currentProgress = await getAllQuestionProgress();
  const currentAttempts = await getAllQuestionAttempts();
  const progressById = new Map(currentProgress.map((item) => [item.questionId, item]));
  const attemptsById = new Map(currentAttempts.map((item) => [item.id, item]));

  payload.progress.forEach((item) => {
    const previous = progressById.get(item.questionId);
    if (!previous || item.updatedAt > previous.updatedAt) {
      progressById.set(item.questionId, item);
    }
  });

  payload.attempts.forEach((item) => {
    attemptsById.set(item.id, item);
  });

  await replaceAllStudyProgress(Array.from(progressById.values()), Array.from(attemptsById.values()));
}
