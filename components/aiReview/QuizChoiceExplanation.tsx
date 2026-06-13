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
  const basis = basisText.replace(/^근거:\s*/, "");
  const cleanedWrongRule = wrongRule?.replace(/^오답 기준:\s*/, "");
  const feedback = correct
    ? `${choiceText}: ${basis}`
    : cleanedWrongRule
      ? `${choiceText}: ${cleanedWrongRule}`
      : `${choiceText}: 정답인 ${correctChoiceText}와 다른 개념이다. ${basis}`;

  return (
    <div className="mt-1 space-y-1">
      <p>
        <span className={`font-bold ${accentClass}`}>{correct ? "해설: " : "선택지 해설: "}</span>
        {feedback}
      </p>
    </div>
  );
}
