import type { SoftwareChoiceKey } from "../types";

// 문항별 수작업 해설. 근거는 모두 26-1/소프트웨어공학 강의록·교재·정리하기에서 확인한다.
// 자동 생성 템플릿(상용구) 금지. 각 선택지 reason은 선택지 본문이 강의 정의·표기·절차의
// 어느 지점과 맞거나 어긋나는지 구체적으로 설명한다.
export type SoftwareExplanationChoice = {
  // 이 선택지가 왜 정답/오답인지, 강의·교재 개념 기준으로 직접 작성한 문장.
  reason: string;
  // 이 선택지가 건드리는 구체 개념의 강의 근거(짧게). 예: "9강 캡슐화 정의".
  conceptBasis: string;
};

export type SoftwareExplanationSet = {
  // 학습자용 정답 해설(정답 박스에 노출). 왜 그 선택지가 정답인지 강의 근거로 서술.
  answer: string;
  choices: Record<SoftwareChoiceKey, SoftwareExplanationChoice>;
};
