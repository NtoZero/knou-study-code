"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getQuestionProgressMap,
  isStudyProgressStorageAvailable,
  recordQuestionAttempt,
  updateQuestionProgress,
  upsertQuestionIdentity,
} from "@/lib/studyProgress/service";
import type {
  QuestionAttemptInput,
  QuestionIdentity,
  QuestionProgress,
  QuestionProgressPatch,
} from "@/lib/studyProgress/types";

type ProgressById = Record<string, QuestionProgress>;

export function useQuestionProgress(questions: QuestionIdentity[]) {
  const [progressById, setProgressById] = useState<ProgressById>({});
  const [loading, setLoading] = useState(true);
  const [storageAvailable, setStorageAvailable] = useState(false);

  const questionIds = useMemo(
    () => questions.map((question) => question.questionId),
    [questions],
  );

  const reload = useCallback(async () => {
    if (!isStudyProgressStorageAvailable()) {
      setStorageAvailable(false);
      setLoading(false);
      return;
    }

    setStorageAvailable(true);
    setLoading(true);
    const progressMap = await getQuestionProgressMap(questionIds);
    setProgressById(progressMap);
    setLoading(false);
  }, [questionIds]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const ensureIdentity = useCallback(async (identity: QuestionIdentity) => {
    const progress = await upsertQuestionIdentity(identity);
    setProgressById((prev) => ({ ...prev, [identity.questionId]: progress }));
    return progress;
  }, []);

  const recordAttempt = useCallback(async (input: QuestionAttemptInput) => {
    const progress = await recordQuestionAttempt(input);
    setProgressById((prev) => ({ ...prev, [input.questionId]: progress }));
    return progress;
  }, []);

  const patchProgress = useCallback(async (questionId: string, patch: QuestionProgressPatch) => {
    const progress = await updateQuestionProgress(questionId, patch);
    if (progress) {
      setProgressById((prev) => ({ ...prev, [questionId]: progress }));
    }
    return progress;
  }, []);

  return {
    progressById,
    loading,
    storageAvailable,
    reload,
    ensureIdentity,
    recordAttempt,
    patchProgress,
  };
}
