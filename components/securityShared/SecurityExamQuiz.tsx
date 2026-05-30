"use client";

import { SecurityQuizSection } from "./SecurityLectureReview";
import { securityExamQuizzes } from "./examData";

export default function SecurityExamQuiz({ lectureId }: { lectureId: number }) {
  const quizzes = securityExamQuizzes[lectureId];

  if (!quizzes) {
    return null;
  }

  return <SecurityQuizSection quizzes={quizzes} lectureId={lectureId} />;
}
