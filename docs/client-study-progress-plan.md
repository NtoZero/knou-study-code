# 클라이언트 전용 학습기록·오답·재풀이 시스템 구현 계획

## 목표

KNOU 인터랙티브 학습 사이트에서 문제 풀이 결과, 오답, 정답 확인, 해설 확인, 북마크, 재풀이 상태를 백엔드 없이 브라우저 안에 저장. 공식 연습문제, 기출분석, 강의별 퀴즈를 같은 기록 모델로 통합하여 `/my-page`에서 확인.

## 전제

- 배포 환경은 Vercel 정적/Next.js 앱.
- 서버 DB, 인증, API 저장 없음.
- 사용자의 풀이 기록은 현재 브라우저 프로필에만 존재.
- 기기 간 동기화는 자동 제공하지 않음.
- 백업과 이전은 JSON 내보내기/가져오기로 처리.

## 저장소 결정

| 저장소 | 역할 | 사용 범위 |
|---|---|---|
| IndexedDB | 핵심 학습 기록 저장 | 풀이 이력, 오답, 재풀이 큐, 북마크, 메모 |
| localStorage | 가벼운 화면 설정 | 마이페이지 탭, 마지막 필터, 정렬 방식 |
| cookie | 기본 미사용 | 동의 플래그 같은 소량 상태만 허용 |

IndexedDB를 기본 저장소로 선택. 문제 수 증가와 서술형 답안, 시도 이력 누적을 고려하면 `localStorage` 단일 저장은 용량과 조회 구조 측면에서 부적합.

## 현재 반영된 기반 코드

| 파일 | 역할 |
|---|---|
| `lib/studyProgress/types.ts` | 공통 문제 식별자, 풀이 시도, 누적 진행 상태 타입 |
| `lib/studyProgress/db.ts` | IndexedDB 열기, store 생성, 기본 CRUD 래퍼 |
| `lib/studyProgress/service.ts` | 풀이 기록, 오답 큐, 북마크, 통계, 내보내기/가져오기 서비스 |
| `lib/studyProgress/identity.ts` | 기출분석·재구성 문제를 공통 식별자로 변환하는 헬퍼 |
| `hooks/useQuestionProgress.ts` | 문제 화면에서 공통 기록 서비스를 호출하는 React hook |
| `app/my-page/page.tsx` | 마이페이지 라우트 |
| `components/myPage/MyPageDashboard.tsx` | 요약, 오답노트, 재풀이, 북마크, 시도 기록, 가져오기/내보내기 관리 화면 |
| `components/layout/SiteHeader.tsx` | 마이페이지 진입 링크 |

## 구현 완료 현황

| 영역 | 반영 내용 |
|---|---|
| 공식 연습문제 | 보기 선택, 정답 확인, 해설 확인, 북마크, 새로고침 복원, 재풀이 리셋 |
| 기출분석 | AI, 알고리즘, 컴퓨터보안, 소프트웨어공학, 정보통신망 워크북의 선택/정답/해설/리셋 기록 |
| 강의별 퀴즈 | 현재 강의 페이지에서 사용하는 컴퓨터보안 공통 퀴즈 섹션의 선택/채점/해설/리셋 기록 |
| 마이페이지 | 전체 요약, 과목별 요약, 오답노트, 재풀이 큐, 북마크, 풀이 이력, JSON 백업/복구, 전체 초기화 |

## 전체 구조

```text
문제 화면
  ├─ 공식 연습문제
  ├─ 기출분석
  └─ 강의별 퀴즈
      ↓
useQuestionProgress
      ↓
studyProgress service
      ↓
IndexedDB
  ├─ questionProgress
  └─ questionAttempts
      ↓
/my-page
  ├─ 요약
  ├─ 오답노트
  ├─ 재풀이
  ├─ 북마크
  └─ 기록 관리
```

## 데이터 모델

### QuestionIdentity

정적 문제 데이터와 사용자의 기록을 연결하는 최소 식별자.

```ts
type QuestionIdentity = {
  questionId: string;
  source: "official-exercises" | "past-exam" | "lecture-quiz";
  subjectSlug: string;
  subjectLabel: string;
  questionTitle: string;
  questionPath: string;
  kind: "multiple" | "written" | "interactive";
  lectureId?: number;
  lectureTitle?: string;
  year?: number;
  semester?: string;
  questionNumber?: number;
  correctChoice?: string;
  conceptTags?: string[];
};
```

설계 원칙:

- 문제 본문은 저장하지 않음.
- 사용자의 선택, 서술형 답안, 상태만 저장.
- `questionId`는 변경하지 않는 안정 ID로 유지.
- 문제 데이터가 바뀌어도 사용자의 기록은 `questionId`로 연결.

### QuestionProgress

문항별 현재 누적 상태.

```ts
type QuestionProgress = QuestionIdentity & {
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
  retryState: "none" | "queued" | "mastered";
  retryDueAt?: string;
  bookmarked: boolean;
  memo?: string;
};
```

### QuestionAttempt

풀이 1회 단위의 이벤트 기록.

```ts
type QuestionAttempt = {
  id: string;
  questionId: string;
  source: QuestionSource;
  selectedChoice?: string;
  writtenAnswer?: string;
  isCorrect?: boolean;
  answeredAt: string;
  elapsedMs?: number;
  mode: "practice" | "retry" | "exam";
};
```

`QuestionProgress`는 빠른 요약 조회용, `QuestionAttempt`는 히스토리와 분석용.

## IndexedDB 스토어

| Store | keyPath | 주요 인덱스 | 내용 |
|---|---|---|---|
| `questionProgress` | `questionId` | `source`, `subjectSlug`, `retryState`, `bookmarked`, `updatedAt` | 문항별 최신 누적 상태 |
| `questionAttempts` | `id` | `questionId`, `source`, `subjectSlug`, `answeredAt` | 풀이 이벤트 전체 이력 |

초기 버전은 `knou-study-progress` DB, schema version `1`.

## 재풀이 규칙

초기 규칙:

- 오답 발생 시 `retryState: "queued"` 전환.
- 오답 횟수에 따라 `retryDueAt` 증가.
- 기본 간격은 1일 단위, 최대 7일.
- 오답 이력이 있는 문항을 충분히 다시 맞히면 `mastered` 전환.

현재 코드의 기본 판단:

- 오답 시 재풀이 큐 진입.
- 정답 누적이 오답 누적보다 2회 이상 많아지면 숙달 처리 가능.
- 세부 규칙은 `service.ts`의 `recordQuestionAttempt`에서 조정.

## 단계별 구현

### 1단계. 기반 저장소와 마이페이지 골격

완료 기준:

- IndexedDB 생성.
- 풀이 상태 타입 정의.
- 기록 서비스 추가.
- `/my-page`에서 요약, 재풀이 대기, 북마크 표시.
- JSON 내보내기와 전체 초기화 제공.

현재 반영 상태:

- 기반 코드 추가 완료.
- 공식 연습문제, 주요 기출분석 워크북, 현재 강의 페이지의 보안 퀴즈 연동 완료.
- `/my-page` 탭에서 요약, 오답, 재풀이, 북마크, 이력, 관리 기능 제공.

### 2단계. 공식 연습문제 연동

대상 파일:

- `components/officialExercises/OfficialExercisesPage.tsx`

통합 방식:

1. `questions`를 `QuestionIdentity[]`로 변환.
2. `useQuestionProgress(identities)` 호출.
3. 객관식 보기 선택 시 `recordAttempt` 호출.
4. 정답 버튼 클릭 시 `patchProgress(question.id, { answerRevealed, lastReviewedAt })` 호출.
5. 북마크 버튼 클릭 시 `bookmarked` 저장.
6. 기존 `selectedChoices`, `revealed`는 화면 즉시 반응용 상태로 유지.

예시:

```ts
const identities = questions.map((question) => ({
  questionId: question.id,
  source: "official-exercises",
  subjectSlug: question.subjectSlug,
  subjectLabel: question.subject,
  questionTitle: `${question.subject} ${question.lectureId}강 Q${question.questionNumber}`,
  questionPath: `/official-exercises#${question.id}`,
  kind: question.kind,
  lectureId: question.lectureId,
  lectureTitle: question.lectureTitle,
  questionNumber: question.questionNumber,
  correctChoice: question.correctChoice,
}));
```

주의:

- 서술형은 `isCorrect` 자동 판정 불가.
- 서술형은 `writtenAnswer`와 `answerRevealed` 중심으로 저장.
- 선택/정답확인/해설확인/북마크 저장을 포함.
- 새로고침 시 IndexedDB 기록을 화면 선택 상태로 복원.

### 3단계. 기출분석 워크북 연동

대상 파일:

- `components/aiPastExam/AIPastExamWorkbook.tsx`
- `components/algorithmPastExam/AlgorithmPastExamWorkbook.tsx`
- `components/securityPastExam/SecurityPastExamWorkbook.tsx`
- `components/softwarePastExam/SoftwarePastExamWorkbook.tsx`
- `components/networkPastExam/*Workbook.tsx`

통합 방식:

- 현재 대부분 `selected`, `answerRevealed`, `explanationExpanded` 상태를 사용.
- 이 상태를 `useQuestionProgress`와 연결.
- `selectChoice(questionId, choice)`에서 `recordAttempt` 호출.
- `toggleAnswer`에서 `answerRevealed` 저장.
- `toggleExplanation`에서 `explanationViewed` 저장.
- 상태 필터 `wrong`, `correct`, `unanswered`는 IndexedDB 기록과 결합.

현재 반영 상태:

- `components/aiPastExam/AIPastExamWorkbook.tsx`
- `components/algorithmPastExam/AlgorithmPastExamWorkbook.tsx`
- `components/securityPastExam/SecurityPastExamWorkbook.tsx`
- `components/softwarePastExam/SoftwarePastExamWorkbook.tsx`
- `components/networkPastExam/NetworkPastExamAnalysisPage.tsx`

표준 `QuestionIdentity` 매핑:

```ts
{
  questionId: question.id,
  source: "past-exam",
  subjectSlug: "algorithm",
  subjectLabel: "알고리즘",
  questionTitle: `${question.year}년 ${question.number}번`,
  questionPath: `/algorithm/past-exam?year=${question.year}#${question.id}`,
  kind: "multiple",
  lectureId: question.lectureRefs[0]?.lectureId,
  year: question.year,
  semester: question.semester,
  questionNumber: question.number,
  correctChoice: question.correctChoice,
  conceptTags: question.conceptTags,
}
```

### 4단계. 강의별 퀴즈 연동

대상:

- `components/securityShared/SecurityLectureReview.tsx`
- 강의 페이지 내부 미니 퀴즈와 향후 추가되는 강의 퀴즈

필수 선행 작업:

- 각 문항에 안정적인 `id` 추가.
- 표시 순서 기반 ID는 기존 문항 순서가 확정된 정적 강의 퀴즈에 한해 허용.
- 예: `security-lecture-8-quiz-01`, `software-lecture-3-quiz-function-point`.

연동 방식:

- 보기 선택 또는 정답 확인 시 `recordAttempt`.
- 단순 인터랙션형 문제는 `kind: "interactive"`로 저장.
- 자동 정오답 판정이 불가능한 활동은 `isCorrect` 없이 `attemptCount`만 기록.

현재 반영 상태:

- 현재 보안 6~10강 페이지가 호출하는 `SecurityQuizSection` 연동 완료.
- 채점 시 모든 응답 문항을 풀이 시도로 저장.
- 미응답 문항도 정답 공개 상태를 저장하여 새로고침 후 채점 화면 유지.
- 다시 풀기 시 해당 강의 퀴즈의 IndexedDB 진행 기록과 화면 상태를 함께 초기화.

### 5단계. 마이페이지 확장

추가 화면:

- `/my-page/wrong`
- `/my-page/retry`
- `/my-page/bookmarks`
- `/my-page/history`

또는 단일 `/my-page` 탭 구조로 유지.

추가 기능:

- 과목 필터.
- 강의 필터.
- 기간 필터.
- 오답 횟수 정렬.
- 마지막 풀이일 정렬.
- 재풀이 모드 시작 버튼.
- 메모 편집.
- 과목별 기록 초기화.
- JSON 가져오기.

## 화면 UX 계획

### 마이페이지 요약

- 풀이 문항 수.
- 정답률.
- 재풀이 대기 수.
- 북마크 수.
- 과목별 요약.
- 최근 오답.
- 곧 다시 풀 문항.

### 오답노트

- 오답 문항 목록.
- 내가 고른 답.
- 정답.
- 해설 확인 여부.
- 관련 강의 링크.
- 재풀이 시작.
- 숙달 처리.

### 재풀이 모드

- `retryState === "queued"` 문항을 문제집처럼 표시.
- 정답 공개 전에는 정오답 미표시.
- 재풀이에서 맞히면 기록 갱신.
- 재풀이 완료 후 요약 표시.

### 기록 관리

- 전체 내보내기.
- JSON 가져오기.
- 전체 초기화.
- 과목별 초기화.
- 저장소 사용 가능 여부.

## 개인정보와 안전성

- 서버 전송 없음.
- 학번, 이름, 인증 토큰 저장 없음.
- 문제 본문은 IndexedDB에 복사하지 않음.
- 사용자가 직접 작성한 서술형 답안과 메모는 브라우저에만 저장.
- 공용 PC 사용 시 전체 초기화 버튼 제공.

## 마이그레이션 정책

- `STUDY_PROGRESS_SCHEMA_VERSION`으로 데이터 구조 버전 관리.
- IndexedDB 버전 변경 시 `db.ts`의 `onupgradeneeded`에서 store/index 추가.
- 삭제형 마이그레이션 금지.
- 가져오기 시 schema version 검증.

## 테스트 계획

### 단위 테스트 대상

- `recordQuestionAttempt`
- `getStudyProgressSummary`
- `getRetryQueue`
- `resetStudyProgress`
- `exportStudyProgress`
- `importStudyProgress`

### 수동 검증

1. 공식 연습문제에서 보기 선택.
2. 마이페이지 풀이 수 증가 확인.
3. 오답 선택 후 재풀이 대기 증가 확인.
4. 정답 선택 후 정답률 반영 확인.
5. 북마크 후 북마크 목록 표시 확인.
6. JSON 내보내기 파일 생성 확인.
7. 전체 초기화 후 마이페이지 빈 상태 확인.
8. 새로고침 후 기록 유지 확인.
9. 다른 탭에서 변경 후 동기화 확인.

### 브라우저 검증

- Chrome.
- Safari.
- Edge.
- 모바일 Safari.

## 향후 개선

- BroadcastChannel 기반 탭 간 즉시 동기화.
- Web Worker 기반 대량 통계 계산.
- localStorage 기반 마이페이지 필터 저장.
- JSON 가져오기 병합 전략 선택.
- 암호화 백업 옵션.
- PWA 오프라인 지원.

## 구현 우선순위

1. 공식 연습문제 연동. 완료
2. 마이페이지 요약 실데이터 표시 검증. 완료
3. 기출분석 공통 워크북 연동. 완료
4. 오답노트/재풀이 모드 상세 화면. 완료
5. 현재 강의 페이지의 퀴즈 안정 ID 부여와 연동. 완료
6. 백업/복구 고도화. JSON 병합/교체 가져오기까지 완료
