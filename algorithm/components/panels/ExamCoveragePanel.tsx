"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, CheckCircle2, HelpCircle, Target } from "lucide-react";

type Coverage = {
  id: number;
  title: string;
  source: string;
  topics: string[];
  examFocus: string[];
  practice: {
    prompt: string;
    answer: string;
    why: string;
  };
};

const coverages: Coverage[] = [
  {
    id: 1,
    title: "알고리즘 소개와 설계",
    source: "강의록 01: 과목 소개, 기본 개념, 알고리즘 설계",
    topics: ["알고리즘의 정확성", "유한성", "명확성", "입력과 출력", "분할정복·탐욕·동적 프로그래밍 설계 관점"],
    examFocus: ["문제 해결 절차가 알고리즘 조건을 만족하는지 판별", "설계 전략의 적용 상황 구분", "효율성과 정확성의 분리 이해"],
    practice: {
      prompt: "같은 문제를 푸는 두 절차 중 하나는 항상 종료하지만 답이 틀릴 수 있다. 시험에서 먼저 확인할 성질은?",
      answer: "정확성",
      why: "종료성만으로 알고리즘이 문제를 해결한다고 볼 수 없고, 모든 유효 입력에 대해 올바른 출력을 내야 함.",
    },
  },
  {
    id: 2,
    title: "알고리즘 분석",
    source: "강의록 02: 알고리즘 분석, 점근성능, 순환 알고리즘",
    topics: ["시간복잡도", "공간복잡도", "Big-O/Ω/Θ", "점화식", "순환 알고리즘 분석"],
    examFocus: ["최악·평균·최선 수행시간 구분", "지배항과 상수항 제거", "순환식에서 분할 수·입력 크기 감소·결합 비용 식별"],
    practice: {
      prompt: "T(n)=2T(n/2)+n에서 시험 풀이의 핵심 확인 항목은?",
      answer: "분할 수 2, 부분문제 크기 n/2, 결합 비용 n",
      why: "마스터 정리나 재귀 트리를 적용하려면 세 요소를 먼저 분리해야 함.",
    },
  },
  {
    id: 3,
    title: "기본 정렬",
    source: "강의 내용 3강",
    topics: ["선택 정렬", "버블 정렬", "삽입 정렬", "셸 정렬", "안정성", "제자리 정렬"],
    examFocus: ["각 패스 후 배열 상태 추적", "안정/불안정 판별", "입력 상태에 따른 최선 시간복잡도 구분"],
    practice: {
      prompt: "거의 정렬된 배열에서 삽입 정렬이 빠른 이유는?",
      answer: "이동해야 할 원소 수가 적기 때문",
      why: "삽입 정렬의 실제 비용은 역전 수에 크게 좌우되며, 이미 정렬된 경우 비교만 하고 이동이 거의 없음.",
    },
  },
  {
    id: 4,
    title: "고급 비교 정렬",
    source: "강의 내용 4강",
    topics: ["퀵 정렬", "합병 정렬", "Partition", "분할정복", "피벗", "합병 과정"],
    examFocus: ["Partition 결과와 피벗 위치 계산", "퀵 정렬 최악 조건", "합병 정렬의 추가 공간과 안정성"],
    practice: {
      prompt: "퀵 정렬에서 이미 정렬된 입력과 첫 원소 피벗이 결합되면 위험한 이유는?",
      answer: "분할이 한쪽으로 치우쳐 O(n²)이 되기 때문",
      why: "부분문제가 n-1과 0으로 갈라지면 재귀 깊이가 n에 가까워짐.",
    },
  },
  {
    id: 5,
    title: "선형 시간 정렬",
    source: "강의 내용 5강",
    topics: ["힙 정렬", "계수 정렬", "기수 정렬", "버킷 정렬", "비교 기반 하한"],
    examFocus: ["비교 기반/비교 기반 아님 구분", "k·d·버킷 수가 성능에 미치는 영향", "힙 재구성 단계 추적"],
    practice: {
      prompt: "계수 정렬이 항상 빠르지 않은 이유는?",
      answer: "값의 범위 k가 크면 O(n+k)의 k 항이 지배하기 때문",
      why: "입력 개수 n보다 가능한 값의 범위가 훨씬 크면 카운트 배열 초기화와 누적 비용이 커짐.",
    },
  },
  {
    id: 6,
    title: "탐색과 균형 트리",
    source: "강의 내용 6강",
    topics: ["순차 탐색", "이진 탐색", "이진 탐색 트리", "2-3-4 트리", "삽입·삭제 연산", "연결 리스트 구현"],
    examFocus: [
      "이진 탐색 중간 인덱스와 범위 갱신",
      "BST 삽입·삭제 결과",
      "2-3-4 트리 노드 분할",
      "연결 리스트로 구현한 경우의 차이",
    ],
    practice: {
      prompt: "이진 탐색을 적용하기 전에 반드시 확인할 조건은?",
      answer: "자료가 정렬되어 있어야 함",
      why: "중간값 비교로 절반을 버리는 논리는 전체 순서가 보장될 때만 성립함.",
    },
  },
  {
    id: 7,
    title: "고급 탐색 구조",
    source: "강의 내용 7강",
    topics: ["레드-블랙 트리", "B-트리", "해시 테이블", "충돌 해결", "적재율", "삭제 연산", "tombstone"],
    examFocus: [
      "레드-블랙 성질 위반 판별",
      "B-트리 차수와 키 개수 범위",
      "개방 해싱과 폐쇄 해싱 비교",
      "해시 테이블 삭제와 tombstone 처리",
    ],
    practice: {
      prompt: "삭제가 많은 해시 테이블에서 tombstone이 필요한 이유는?",
      answer: "탐사 경로를 끊지 않기 위해",
      why: "즉시 빈칸으로 바꾸면 선형/이차 탐사에서 뒤쪽 원소를 더 이상 찾지 못할 수 있음.",
    },
  },
  {
    id: 8,
    title: "그래프 순회와 응용",
    source: "강의 내용 8강",
    topics: ["그래프 표현", "DFS", "BFS", "위상 정렬", "연결 성분", "강연결 성분"],
    examFocus: [
      "인접 리스트 순서에 따른 방문 순서",
      "큐와 스택 상태 변화",
      "DAG와 진입차수 조건 확인",
      "첫 DFS 완료 순서와 전치 그래프의 결합",
    ],
    practice: {
      prompt: "강연결 성분을 구할 때 두 번째 DFS의 시작 순서는?",
      answer: "첫 DFS의 완료 순서가 큰 정점부터",
      why: "전치 그래프에서 완료 순서가 큰 정점부터 시작해야 같은 강연결 성분을 한 번에 수집할 수 있음.",
    },
  },
  {
    id: 9,
    title: "MST와 단일 출발 최단 경로",
    source: "강의 내용 9강",
    topics: ["최소 신장 트리", "크루스칼", "프림", "데이크스트라", "탐욕 선택"],
    examFocus: ["사이클을 만드는 간선 제외", "프림의 S 집합 확장", "데이크스트라의 음수 간선 제한"],
    practice: {
      prompt: "크루스칼과 프림의 공통 목표는?",
      answer: "모든 정점을 잇는 최소 비용 신장 트리 구성",
      why: "둘 다 MST 알고리즘이지만 크루스칼은 간선 중심, 프림은 정점 집합 확장 중심으로 진행됨.",
    },
  },
  {
    id: 10,
    title: "최단 경로와 최대 유량",
    source: "강의 내용 10강",
    topics: ["벨만-포드", "플로이드", "포드-풀커슨", "완화", "잔여 그래프", "증가 경로", "커트(최소 컷)"],
    examFocus: [
      "음의 가중치와 음의 사이클 구분",
      "모든 쌍 최단 경로 DP 갱신",
      "병목 용량과 역방향 간선",
      "최대 유량-최소 컷 정리",
    ],
    practice: {
      prompt: "증가 경로가 더 이상 없을 때 함께 떠올려야 하는 정리는?",
      answer: "최대 유량-최소 컷 정리",
      why: "증가 경로가 없으면 현재 유량이 최대이며, 컷 용량 관점으로도 더 늘릴 수 없음을 해석한다.",
    },
  },
  {
    id: 11,
    title: "동적 프로그래밍",
    source: "강의록 11 + 교재 5장",
    topics: ["동적 프로그래밍 기본 개념", "최적성의 원리", "행렬의 연쇄적 곱셈", "최장 공통 부분 수열"],
    examFocus: ["분할정복과 동적 프로그래밍의 차이 구분", "행렬 곱셈 순서 테이블 P의 의미", "LCS 길이표와 복원 경로 추적"],
    practice: {
      prompt: "행렬의 연쇄적 곱셈에서 표에 적는 값이 의미하는 것은?",
      answer: "부분 문제의 최소 곱셈 횟수와 분할 위치",
      why: "동적 프로그래밍은 작은 문제의 최적값을 저장하고, 그 값을 이용해 큰 문제의 최적값을 계산함.",
    },
  },
  {
    id: 12,
    title: "스트링 매칭",
    source: "강의록 12 + 교재 6장",
    topics: ["스트링과 알파벳", "스트링 매칭 기본 개념", "라빈-카프", "KMP"],
    examFocus: ["텍스트와 패턴의 역할 구분", "해시 후보를 문자 비교로 검증하는 순서", "KMP의 F 배열과 실패 함수 의미"],
    practice: {
      prompt: "라빈-카프 알고리즘에서 해시값이 같을 때 바로 종료해도 되는가?",
      answer: "아니오",
      why: "해시는 후보를 찾는 단계일 뿐이며, 실제 문자열이 같은지 직접 비교해야 함.",
    },
  },
  {
    id: 13,
    title: "보이어-무어와 압축 기초",
    source: "강의록 13 + 교재 6장",
    topics: ["보이어-무어 알고리즘", "데이터 압축 기본 개념", "무손실 압축과 손실 압축", "RLE"],
    examFocus: ["오른쪽에서 왼쪽으로 비교하는 이유", "불일치 문자와 일치 접미부 이동 비교", "연속 구간을 (문자, 횟수)로 바꾸는 RLE 해석"],
    practice: {
      prompt: "RLE에서 같은 문자의 연속 구간을 무엇으로 바꾸는가?",
      answer: "(문자, 횟수) 쌍",
      why: "반복되는 문자를 하나의 run으로 묶어 저장하면 문자열 길이를 줄일 수 있음.",
    },
  },
  {
    id: 14,
    title: "허프만 코딩과 LZ77",
    source: "강의록 14 + 교재 6장",
    topics: ["허프만 코딩", "LZ77", "영상 압축"],
    examFocus: ["최소 빈도 두 노드부터 병합하는 허프만 트리", "슬라이딩 윈도에서 찾은 위치·길이·다음 문자", "JPEG와 MPEG가 반영하는 2차원·3차원 특성"],
    practice: {
      prompt: "LZ77의 출력 triple은 무엇을 담는가?",
      answer: "거리, 길이, 다음 문자",
      why: "이미 등장한 문자열을 참조해 반복을 압축하며, 참조 위치와 길이 그리고 새 문자를 함께 저장함.",
    },
  },
  {
    id: 15,
    title: "NP-완전 문제와 근사 알고리즘",
    source: "강의록 15 + 교재 7장",
    topics: ["클래스 P와 NP", "변환(reduction)", "NP-완전 문제와 NP-하드 문제", "근사 알고리즘", "버텍스 커버 / 외판원 / 통 채우기"],
    examFocus: ["판정 문제와 최적화 문제 구분", "다항 시간 변환의 의미", "근사 알고리즘이 쓰이는 이유", "버텍스 커버·TSP·통 채우기 기법 비교"],
    practice: {
      prompt: "NP-완전 문제의 조건은 무엇인가?",
      answer: "NP에 속하면서 NP의 모든 문제로부터 다항 시간 변환이 가능한 문제",
      why: "NP-완전은 NP에 속하고 동시에 NP-하드인 문제를 뜻함.",
    },
  },
];

export function ExamCoveragePanel() {
  const [selectedId, setSelectedId] = useState(11);
  const [mode, setMode] = useState<"focus" | "topics" | "practice">("focus");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const selected = useMemo(
    () => coverages.find((coverage) => coverage.id === selectedId) ?? coverages[0],
    [selectedId],
  );

  const selectedItems = mode === "topics" ? selected.topics : selected.examFocus;
  const checkedCount = coverages.reduce(
    (sum, coverage) => sum + (checked[`lecture-${coverage.id}`] ? 1 : 0),
    0,
  );

  return (
    <section className="rounded-xl border border-slate-700/60 bg-slate-900/80 p-4 text-slate-100 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
            <Target size={14} />
            1~15강 시험 전 확인
          </div>
          <h2 className="mt-1 text-lg font-bold">시뮬레이터 밖 핵심 개념까지 점검</h2>
          <p className="mt-1 text-xs text-slate-400">
            1~10강의 실행 과정과 11~15강의 교재·강의 내용을 함께 대조.
          </p>
        </div>
        <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-right">
          <div className="text-xl font-bold text-emerald-200">{checkedCount}/{coverages.length}</div>
          <div className="text-[11px] text-emerald-100">완료 체크</div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-5 gap-1 sm:grid-cols-10 lg:grid-cols-[repeat(15,minmax(0,1fr))]">
        {coverages.map((coverage) => (
          <button
            key={coverage.id}
            type="button"
            onClick={() => setSelectedId(coverage.id)}
            className={`relative h-9 rounded-md border text-xs font-semibold transition ${
              selectedId === coverage.id
                ? "border-emerald-300 bg-emerald-400 text-slate-950"
                : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500"
            }`}
            aria-label={`${coverage.id}강 ${coverage.title}`}
          >
            {coverage.id}
            {checked[`lecture-${coverage.id}`] && (
              <CheckCircle2 size={11} className="absolute right-1 top-1" />
            )}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="text-xs text-slate-400">{selected.id}강</div>
              <h3 className="text-base font-bold">{selected.title}</h3>
              <p className="mt-1 text-[11px] text-slate-500">{selected.source}</p>
            </div>
            <button
              type="button"
              onClick={() =>
                setChecked((prev) => ({
                  ...prev,
                  [`lecture-${selected.id}`]: !prev[`lecture-${selected.id}`],
                }))
              }
              className={`rounded-md border px-3 py-2 text-xs font-semibold transition ${
                checked[`lecture-${selected.id}`]
                  ? "border-emerald-300 bg-emerald-400 text-slate-950"
                  : "border-slate-600 text-slate-300 hover:border-emerald-300"
              }`}
            >
              {checked[`lecture-${selected.id}`] ? "점검 완료" : "완료 체크"}
            </button>
          </div>

          <div className="mb-3 flex rounded-lg bg-slate-800 p-1">
            {[
              ["focus", "시험 포인트"],
              ["topics", "핵심 용어"],
              ["practice", "검산 질문"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key as "focus" | "topics" | "practice")}
                className={`flex-1 rounded-md px-2 py-1.5 text-xs font-semibold transition ${
                  mode === key ? "bg-slate-100 text-slate-950" : "text-slate-400 hover:text-slate-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === "practice" ? (
              <motion.div
                key={`${selected.id}-practice`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="rounded-lg border border-sky-400/30 bg-sky-400/10 p-3"
              >
                <div className="mb-2 flex items-center gap-2 text-xs font-bold text-sky-200">
                  <HelpCircle size={14} />
                  짧은 검산 질문
                </div>
                <p className="text-sm text-slate-100">{selected.practice.prompt}</p>
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs font-semibold text-sky-200">
                    답과 이유 보기
                  </summary>
                  <div className="mt-2 rounded-md bg-slate-950/60 p-3 text-xs leading-5 text-slate-300">
                    <div className="font-bold text-sky-100">{selected.practice.answer}</div>
                    <p className="mt-1">{selected.practice.why}</p>
                  </div>
                </details>
              </motion.div>
            ) : (
              <motion.ul
                key={`${selected.id}-${mode}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="grid gap-2"
              >
                {selectedItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 rounded-md border border-slate-700 bg-slate-800/70 p-2 text-xs leading-5 text-slate-300"
                  >
                    <BookOpen size={13} className="mt-0.5 shrink-0 text-emerald-300" />
                    {item}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-4">
          <h3 className="text-sm font-bold">범위 점검</h3>
          <div className="mt-3 space-y-2 text-xs leading-5 text-slate-300">
            <p>
              현재 시뮬레이터는 3~10강의 정렬·탐색·그래프 알고리즘 실행 과정을 강하게 지원.
            </p>
            <p>
              11~15강의 동적 프로그래밍, 문자열 매칭, 압축, NP-완전·근사 알고리즘까지 교재와 함께 확인.
            </p>
          </div>
          <div className="mt-4 grid gap-2">
            {["공식/조건을 말할 수 있음", "예제 입력에서 한 단계 추적 가능", "시간복잡도와 적용 조건을 구분"].map(
              (item) => (
                <label
                  key={item}
                  className="flex items-center gap-2 rounded-md bg-slate-800 px-3 py-2 text-xs text-slate-300"
                >
                  <input type="checkbox" className="h-4 w-4 accent-emerald-400" />
                  {item}
                </label>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
