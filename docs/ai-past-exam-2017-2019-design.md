# 인공지능 2017-2019 기출문제집 설계

## 목적

`/ai/past-exam`에 인공지능 2017-2019년 2학기 기말 기출문제집을 별도 페이지로 만든다. 학습자는 먼저 문제를 풀고, 원할 때 정답과 해설을 확인하며, 해설에서 관련 강의로 이동할 수 있어야 한다.

이 설계는 `past-exam-analysis` 스킬을 기준으로 하며, `update-interactive-site`의 `past-exam` 모드에서 참조한다.

## 기반 파일 감사

| 항목 | 확인 결과 | 처리 |
|---|---|---|
| 기출문제 | 2017-2, 2018-2, 2019-2 인공지능 PDF 확인. 각 2쪽 | 문항 추출 가능. 수식·도표는 crop 판독 필요 |
| 기출정답 | `기출정답/2017`, `기출정답/2018`, `기출정답/2019`의 2학기 정답표 PDF/HWP 확인. PDF는 각 12쪽 | 정답 행 식별 후 문항 수와 대조 |
| 강의록 | 인공지능 1-15강 강의록 PDF 확인 | 해설 근거 매핑에 사용 |
| 교재 | 인공지능 교재 1-11장 PDF 확인 | 해설 근거 매핑에 사용 |
| 사이트 | `app/ai`, `app/ai/lecture/{N}`, `components/aiReview` 존재 | `/ai/past-exam` 추가 |
| 이미지 추출 도구 | `pdftotext`, `pdfinfo`, `pdftoppm`, `sips`, contact sheet 확인 | 필요한 시각 자료만 선택 crop 가능 |

현재 확인 기준에서는 진행을 막는 누락 파일은 없다. 다만 `pdftotext` 결과에서 수식 문항의 텍스트가 깨지는 구간이 확인되므로, 실제 문항 데이터 작성 단계에서는 구조화 텍스트를 기본으로 두고 그래프·도표·수식 이미지처럼 풀이에 필요한 시각 영역만 PDF 렌더링과 crop 판독을 병행한다.

## 산출 경로

```text
knou-interactive-site/app/ai/past-exam/page.tsx
knou-interactive-site/components/aiPastExam/
knou-interactive-site/public/ai/past-exam/figures/
```

과목 홈과 AI 내비게이션에는 `기출분석` 링크를 추가한다.

## 컴포넌트 구조

```text
AI Past Exam Page
├── page.tsx
└── AIPastExamWorkbook
    ├── PastExamHeader
    ├── PastExamFilters
    ├── PastExamProgress
    ├── PastExamQuestionList
    │   └── PastExamQuestionCard
    │       ├── QuestionPrompt
    │       ├── QuestionVisuals
    │       ├── ChoiceSelector
    │       ├── AnswerReveal
    │       ├── ChoiceExplanationPanel
    │       └── LectureRouteChips
    └── PastExamReviewPanel
```

### 역할

| 컴포넌트 | 책임 |
|---|---|
| `AIPastExamWorkbook` | 연도/강의/개념/풀이 상태 필터, 선택 답안, 정답 공개 상태, 복습 패널 상태 관리 |
| `PastExamHeader` | 과목명, 연도 범위, 풀이 진행률 표시. 내부 파일명·정답표 대조 표현은 표시하지 않음 |
| `PastExamFilters` | 2017/2018/2019, 강의 번호, 개념 태그, 풀이 상태 필터 |
| `PastExamQuestionCard` | 문항 본문, 보기, 사용자의 선택, 정답 보기 버튼, 해설 패널 배치 |
| `QuestionVisuals` | 그래프·도표·수식 이미지 등 필요한 시각 자료만 표시. hidden AI 설명은 화면에 렌더링하지 않음 |
| `ChoiceSelector` | 정답 공개 전에는 선택 상태만 표시. 정오답 색상은 공개 뒤 적용 |
| `AnswerReveal` | 사용자가 원할 때만 정답과 해설을 공개 |
| `ChoiceExplanationPanel` | 정답 이유와 각 오답 배제 기준을 강의록·교재 개념으로 표시 |
| `LectureRouteChips` | `/ai/lecture/{N}` 또는 앵커로 이동하는 강의 chip |
| `PastExamReviewPanel` | 틀린 문항, 정답 미확인 문항, 강의별 취약 개념 요약 |

## 데이터 모델

```ts
type ChoiceKey = "1" | "2" | "3" | "4";

type PastExamQuestionImage = {
  src: string;
  alt: string;
  aiDescriptionHidden: string;
  sourcePageInternal: number;
  cropBoxInternal: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

type PastExamChoice = {
  key: ChoiceKey;
  text: string;
  explanation: {
    verdict: "correct" | "wrong";
    reason: string;
    conceptBasis: string;
  };
};

type PastExamQuestion = {
  id: string;
  year: 2017 | 2018 | 2019;
  semester: "2";
  number: number;
  prompt: string;
  images?: PastExamQuestionImage[];
  choices: PastExamChoice[];
  correctChoice: ChoiceKey;
  lectureRefs: Array<{
    lectureId: number;
    label: string;
    href: string;
    concept: string;
  }>;
  conceptTags: string[];
  sourceBasis: Array<{
    learnerLabel: string;
    concept: string;
    internalLectureSource: string;
    internalTextbookSource: string;
  }>;
  answerSourceInternal: string;
  questionSourceInternal: string;
};
```

`answerSourceInternal`, `questionSourceInternal`, `aiDescriptionHidden`, `cropBoxInternal`은 검토와 해설 생성용이다. JSX의 보이는 문자열로 렌더링하지 않는다.

## 문항 작성 파이프라인

1. 기출 PDF에서 문항 번호, 지문, 보기 1-4를 구조화한다.
2. 정답표에서 같은 연도·학기·과목 행의 정답 키를 추출한다.
3. 문항 수와 정답 수, 문항 번호 순서, 보기 개수를 대조한다.
4. 그래프·도표·탐색트리·격자·수식 이미지 등 풀이에 필요한 비텍스트 시각 자료가 포함된 문항만 `pdftoppm`으로 페이지 렌더링 후 해당 영역을 crop한다.
5. crop 이미지마다 짧은 `alt`와 AI 해설용 `aiDescriptionHidden`을 작성한다.
6. 각 문항을 강의 번호, 교재 장, 핵심 개념 태그에 매핑한다.
7. 정답 해설과 각 오답 해설을 강의록·교재 근거로 작성한다.

### crop 정확도 검산

- 문제 전체를 일괄 crop하지 않고, OCR/텍스트 bbox로 지문과 선택지 영역을 먼저 분리한다.
- 시각 요소 bbox에는 라벨, 축, 범례, 수식 선택지가 잘리지 않도록 12-24px padding을 적용한다.
- 모든 crop은 contact sheet로 모아 빈 영역, 잘린 라벨, 텍스트만 있는 오탐을 확인한다.
- 현재 public에는 figure crop만 두고, 원문 전체 페이지 렌더링 이미지와 전체 문항 crop은 두지 않는다.

## UI 흐름

1. `/ai/past-exam` 진입 시 2019년을 기본 선택한다.
2. 학습자는 연도, 강의, 개념, 풀이 상태를 필터링한다.
3. 각 문항은 정답이 숨겨진 상태로 표시된다.
4. 선택지를 누르면 선택 상태만 표시되고 정오답은 표시하지 않는다.
5. `정답 보기`를 누르면 정답, 정답 해설, 오답 해설, lecture chip을 표시한다.
6. 복습 패널은 틀린 문항과 아직 정답을 보지 않은 문항을 집계한다.

## 이미지 문항 규칙

- 텍스트 문항은 구조화 텍스트로 표시하고, 원문 전체 문항 이미지를 대체 표시하지 않는다.
- 원문 시각 자료는 텍스트 설명만으로 대체하지 않는다.
- 필요한 crop 이미지만 문제 풀이 영역에 표시한다.
- `aiDescriptionHidden`은 해설 생성·검토 데이터로만 사용하고 화면에는 표시하지 않는다.
- hidden 설명에는 정답 번호, 정답 추론, 오답 배제 결론을 쓰지 않는다.
- hidden 설명에는 구조, 축, 범례, 표식, 관계, 수치, 조건만 객관적으로 적는다.

## Sonnet 설계 검토 반영

Claude Sonnet에는 원문 기출문제·정답표·교재·강의록 전문을 보내지 않고, 비식별 요구사항만 전달해 공통 구조를 검토시켰다.

| 제안 | Codex 판정 | 반영 |
|---|---|---|
| 연도 탭, 문제 카드, 복습 패널 구조 | 수용 | `AIPastExamWorkbook` 하위 구조에 반영 |
| 정답은 사용자가 요청할 때 공개 | 수용 | `AnswerReveal` 상태 모델에 반영 |
| 이미지 설명을 DOM `data-*` 속성에 저장 | 거절 | 학습자에게 노출될 수 있으므로 내부 데이터 필드로만 유지 |
| 빌드 시 정답·해설·이미지 메타데이터 검산 | 수정 수용 | 로컬 검증 검색과 타입 검산으로 반영 |

## 검증 기준

- 모든 2017-2019 문항에 정답표 기반 `correctChoice`가 있다.
- 모든 문항에 정답 해설과 선택지별 오답 해설이 있다.
- 모든 해설은 강의록·교재 개념에 연결된다.
- 모든 문항에 관련 lecture chip이 1개 이상 있다.
- 시각 자료 문항에는 crop 이미지와 `aiDescriptionHidden`이 모두 있다.
- 텍스트 문항에는 전체 문항 crop 이미지가 붙어 있지 않다.
- 학습자 화면에 내부 경로, 정답표 파일명, 감사표, 루브릭 표현이 없다.
- `answerSourceInternal`, `questionSourceInternal`, `aiDescriptionHidden`, `cropBoxInternal`이 JSX 화면 문자열로 노출되지 않는다.
- `npm run build`가 통과한다.
