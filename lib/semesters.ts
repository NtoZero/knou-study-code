/**
 * 학기별 과목 편성.
 * 홈 화면과 사이트 헤더가 모두 이 정의를 기준으로 학기를 구분한다.
 */

export type SubjectSlug =
  | "ml"
  | "network"
  | "ai"
  | "java"
  | "algorithm"
  | "security"
  | "software";

export interface SubjectEntry {
  slug: SubjectSlug;
  href: string;
  title: string;
  subtitle: string;
  /** lucide-react 아이콘 이름 — 홈 화면에서 매핑 */
  icon:
    | "Sparkle"
    | "Radio"
    | "Brain"
    | "Code2"
    | "Shield"
    | "Layers";
  iconClass: string;
  accentClass: string;
  /** 기출분석 페이지 경로 — 없으면 undefined */
  pastExamHref?: string;
  pastExamSubtitle?: string;
  /** 딥스터디 허브 경로 */
  studyHubHref?: string;
  studyHubTitle?: string;
  studyHubSubtitle?: string;
  /** 인터랙티브 강의 페이지가 준비된 범위 */
  lectureRange: string;
  isNew?: boolean;
}

export interface Semester {
  id: string;
  label: string;
  caption: string;
  /** 최신 학기가 먼저 오도록 정렬된 순서 */
  subjects: SubjectEntry[];
}

export const semesters: Semester[] = [
  {
    id: "26-2",
    label: "2026-2학기",
    caption: "이번 학기 수강 과목",
    subjects: [
      {
        slug: "ml",
        href: "/ml",
        title: "머신러닝",
        subtitle: "1~4강 인터랙티브 학습 · 강의록 기반 시각화",
        icon: "Sparkle",
        iconClass: "text-cyan-500",
        accentClass:
          "border-cyan-200 bg-gradient-to-br from-cyan-50 to-white dark:border-cyan-900/50 dark:from-cyan-950/40 dark:to-gray-900",
        lectureRange: "1~4강",
        isNew: true,
      },
    ],
  },
  {
    id: "26-1",
    label: "2026-1학기",
    caption: "이수 과목 · 기출분석과 딥스터디 포함",
    subjects: [
      {
        slug: "network",
        href: "/network",
        title: "정보통신망",
        subtitle: "1~15강 인터랙티브 시각화",
        icon: "Radio",
        iconClass: "text-blue-500",
        accentClass:
          "border-blue-200 bg-gradient-to-br from-blue-50 to-white dark:border-blue-900/50 dark:from-blue-950/40 dark:to-gray-900",
        pastExamHref: "/network/past-exam",
        pastExamSubtitle: "2015~2019 기말 분석과 재구성 문제",
        studyHubHref: "/study-hub/network",
        studyHubTitle: "HAC 정의와 미래 전략",
        studyHubSubtitle: "Shannon-Weaver · Human-AI Communication · 블랙박스 대응",
        lectureRange: "1~15강",
      },
      {
        slug: "ai",
        href: "/ai",
        title: "인공지능",
        subtitle: "1~15강 인터랙티브 학습",
        icon: "Brain",
        iconClass: "text-indigo-500",
        accentClass:
          "border-indigo-200 bg-gradient-to-br from-indigo-50 to-white dark:border-indigo-900/50 dark:from-indigo-950/40 dark:to-gray-900",
        pastExamHref: "/ai/past-exam",
        pastExamSubtitle: "기출 문항 풀이와 해설 복습",
        studyHubHref: "/study-hub/ai",
        studyHubTitle: "균일비용 탐색 · A* 알고리즘",
        studyHubSubtitle: "State Space · UCS · A* · 허용성 · 탐색 트리 작성법",
        lectureRange: "1~15강",
      },
      {
        slug: "java",
        href: "/java",
        title: "Java프로그래밍",
        subtitle: "1~15강 기본개념·코드 흐름 학습",
        icon: "Code2",
        iconClass: "text-amber-600",
        accentClass:
          "border-amber-200 bg-gradient-to-br from-amber-50 to-white dark:border-amber-900/50 dark:from-amber-950/40 dark:to-gray-900",
        pastExamHref: "/java/past-exam",
        pastExamSubtitle: "2017~2019 기말 75문항 코드 판독 풀이",
        lectureRange: "1~15강",
      },
      {
        slug: "algorithm",
        href: "/algorithm",
        title: "알고리즘",
        subtitle: "1~15강 알고리즘 학습",
        icon: "Code2",
        iconClass: "text-emerald-500",
        accentClass:
          "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white dark:border-emerald-900/50 dark:from-emerald-950/40 dark:to-gray-900",
        pastExamHref: "/algorithm/past-exam",
        pastExamSubtitle: "2017~2019 기말 105문항 풀이",
        lectureRange: "1~15강",
      },
      {
        slug: "security",
        href: "/security",
        title: "컴퓨터보안",
        subtitle: "1~15강 인터랙티브 학습",
        icon: "Shield",
        iconClass: "text-purple-600",
        accentClass:
          "border-purple-200 bg-gradient-to-br from-purple-50 to-white dark:border-purple-900/50 dark:from-purple-950/40 dark:to-gray-900",
        pastExamHref: "/security/past-exam",
        pastExamSubtitle: "객관식 풀이와 오답 복습",
        lectureRange: "1~15강",
      },
      {
        slug: "software",
        href: "/software",
        title: "소프트웨어공학",
        subtitle: "1~15강 인터랙티브 학습",
        icon: "Layers",
        iconClass: "text-emerald-600",
        accentClass:
          "border-teal-200 bg-gradient-to-br from-teal-50 to-white dark:border-teal-900/50 dark:from-teal-950/40 dark:to-gray-900",
        pastExamHref: "/software/past-exam",
        pastExamSubtitle: "기출 개념과 정답 근거 정리",
        studyHubHref: "/study-hub/software",
        studyHubTitle: "PE/IDP · CPM 임계경로",
        studyHubSubtitle: "Developer Experience · Platform Engineering · Critical Path Method",
        lectureRange: "1~15강",
      },
    ],
  },
];

export const subjectTitleBySlug: Record<string, string> = Object.fromEntries(
  semesters.flatMap((sem) => sem.subjects.map((s) => [s.slug, s.title])),
);

export const semesterLabelBySlug: Record<string, string> = Object.fromEntries(
  semesters.flatMap((sem) => sem.subjects.map((s) => [s.slug, sem.label])),
);
