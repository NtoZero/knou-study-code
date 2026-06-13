export const STUDY_PROGRESS_SCHEMA_VERSION = 1;

export type QuestionSource =
  | "official-exercises"
  | "past-exam"
  | "lecture-quiz";

export type QuestionKind = "multiple" | "written" | "interactive";

export type RetryState = "none" | "queued" | "mastered";

export type AttemptMode = "practice" | "retry" | "exam";

export type QuestionIdentity = {
  questionId: string;
  source: QuestionSource;
  subjectSlug: string;
  subjectLabel: string;
  questionTitle: string;
  questionPath: string;
  kind: QuestionKind;
  lectureId?: number;
  lectureTitle?: string;
  year?: number;
  semester?: string;
  questionNumber?: number;
  correctChoice?: string;
  conceptTags?: string[];
};

export type QuestionAttemptInput = QuestionIdentity & {
  selectedChoice?: string;
  writtenAnswer?: string;
  isCorrect?: boolean;
  elapsedMs?: number;
  mode?: AttemptMode;
  answeredAt?: string;
};

export type QuestionAttempt = QuestionAttemptInput & {
  id: string;
  schemaVersion: number;
  mode: AttemptMode;
  answeredAt: string;
};

export type QuestionProgress = QuestionIdentity & {
  schemaVersion: number;
  latestChoice?: string;
  latestWrittenAnswer?: string;
  isCorrect?: boolean;
  attemptCount: number;
  correctCount: number;
  wrongCount: number;
  firstAttemptedAt?: string;
  lastAttemptedAt?: string;
  lastReviewedAt?: string;
  answerRevealed: boolean;
  explanationViewed: boolean;
  retryState: RetryState;
  retryDueAt?: string;
  bookmarked: boolean;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};

export type QuestionProgressPatch = Partial<
  Pick<
    QuestionProgress,
    | "answerRevealed"
    | "explanationViewed"
    | "lastReviewedAt"
    | "retryState"
    | "retryDueAt"
    | "bookmarked"
    | "memo"
  >
>;

export type StudyProgressSummary = {
  totalQuestions: number;
  answeredQuestions: number;
  correctQuestions: number;
  wrongQuestions: number;
  retryQueuedQuestions: number;
  masteredQuestions: number;
  bookmarkedQuestions: number;
  bySubject: Array<{
    subjectSlug: string;
    subjectLabel: string;
    totalQuestions: number;
    answeredQuestions: number;
    correctQuestions: number;
    wrongQuestions: number;
    retryQueuedQuestions: number;
  }>;
};

export type StudyProgressExport = {
  schemaVersion: number;
  exportedAt: string;
  progress: QuestionProgress[];
  attempts: QuestionAttempt[];
};

export type ResetStudyProgressScope = {
  source?: QuestionSource;
  subjectSlug?: string;
};
