import { buildAIChoiceExplanation } from "@/lib/aiChoiceExplanations";

type Props = {
  correct: boolean;
  choiceText: string;
  correctChoiceText: string;
  basisText: string;
  wrongRule?: string;
  accentClass?: string;
};

export default function QuizChoiceExplanation({
  correct,
  choiceText,
  correctChoiceText,
  basisText,
  wrongRule,
  accentClass = "text-indigo-700 dark:text-indigo-300",
}: Props) {
  const explanation = buildAIChoiceExplanation({
    choiceText,
    correctChoiceText,
    isCorrect: correct,
    topicConcept: correctChoiceText,
    topicBasis: basisText,
    topicWrongRule: wrongRule,
    textbook: "인공지능 강의·교재",
  });

  return (
    <div className="mt-1 space-y-1">
      <p>
        <span className={`font-bold ${accentClass}`}>{correct ? "정답 근거: " : "선택지 판별: "}</span>
        {explanation.reason.replace(/^정답 근거:\s*/, "").replace(/^오답 근거:\s*/, "")}
      </p>
      {wrongRule && (
        <p>
          <span className={`font-bold ${accentClass}`}>전체 판별 기준: </span>
          {wrongRule}
        </p>
      )}
    </div>
  );
}
