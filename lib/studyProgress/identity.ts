import type { QuestionIdentity } from "./types";

type LectureRefLike = {
  lectureId: number;
  label?: string;
  concept?: string;
};

type PastExamQuestionLike = {
  id: string;
  year?: number;
  semester?: string;
  number: number;
  correctChoice?: string;
  lectureRefs?: LectureRefLike[];
  conceptTags?: string[];
};

export function pastExamIdentity({
  question,
  subjectSlug,
  subjectLabel,
  basePath,
}: {
  question: PastExamQuestionLike;
  subjectSlug: string;
  subjectLabel: string;
  basePath: string;
}): QuestionIdentity {
  const firstLecture = question.lectureRefs?.[0];
  const query = question.year ? `?year=${question.year}` : "";

  return {
    questionId: question.id,
    source: "past-exam",
    subjectSlug,
    subjectLabel,
    questionTitle: `${subjectLabel} ${question.year ? `${question.year}년 ` : ""}${question.number}번`,
    questionPath: `${basePath}${query}#${question.id}`,
    kind: "multiple",
    lectureId: firstLecture?.lectureId,
    lectureTitle: firstLecture?.label ?? firstLecture?.concept,
    year: question.year,
    semester: question.semester,
    questionNumber: question.number,
    correctChoice: question.correctChoice,
    conceptTags: question.conceptTags,
  };
}

export function networkReconstructedIdentity({
  question,
}: {
  question: PastExamQuestionLike;
}): QuestionIdentity {
  const firstLecture = question.lectureRefs?.[0];

  return {
    questionId: question.id,
    source: "past-exam",
    subjectSlug: "network",
    subjectLabel: "정보통신망",
    questionTitle: `정보통신망 재구성 ${question.number}번`,
    questionPath: `/network/past-exam#${question.id}`,
    kind: "multiple",
    lectureId: firstLecture?.lectureId,
    lectureTitle: firstLecture?.label ?? firstLecture?.concept,
    questionNumber: question.number,
    correctChoice: question.correctChoice,
    conceptTags: question.conceptTags,
  };
}
