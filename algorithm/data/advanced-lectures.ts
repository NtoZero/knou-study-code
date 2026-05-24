export type AdvancedLectureId = 11 | 12 | 13 | 14 | 15;

export interface AdvancedLectureSubtopic {
  id: string;
  label: string;
  note: string;
}

export interface AdvancedLectureMeta {
  id: AdvancedLectureId;
  title: string;
  lectureSource: string;
  textbookSource: string;
  summary: string;
  topics: string[];
  examFocus: string[];
  mustKnow: string[];
  subtopics: AdvancedLectureSubtopic[];
  defaultSubtopic: string;
}

export const advancedLectures: AdvancedLectureMeta[] = [
  {
    id: 11,
    title: '동적 프로그래밍',
    lectureSource: '강의록 11',
    textbookSource: '교재 5장: 동적 프로그래밍',
    summary:
      '최적성의 원리와 상향식 테이블 채우기를 기준으로 행렬의 연쇄적 곱셈과 최장 공통 부분 수열을 다루는 강의.',
    topics: [
      '동적 프로그래밍의 기본 개념',
      '최적성의 원리',
      '행렬의 연쇄적 곱셈',
      '최장 공통 부분 수열',
    ],
    examFocus: [
      '분할정복과 동적 프로그래밍의 차이 구분',
      '행렬 곱셈 순서 테이블 P의 의미 해석',
      'LCS 길이표와 복원 절차 추적',
    ],
    mustKnow: [
      '작은 문제부터 테이블에 저장',
      '최적해는 소문제 최적해로 구성',
      '행렬 연쇄 곱셈의 비용식 $C[i][j]$',
      'LCS의 점화식과 복원 테이블',
    ],
    subtopics: [
      { id: 'matrix-chain', label: '행렬의 연쇄적 곱셈', note: 'P 테이블과 최소 기본 곱셈 횟수 확인.' },
      { id: 'lcs', label: '최장 공통 부분 수열', note: '길이표와 복원 경로를 함께 확인.' },
    ],
    defaultSubtopic: 'matrix-chain',
  },
  {
    id: 12,
    title: '스트링 매칭',
    lectureSource: '강의록 12',
    textbookSource: '교재 6장: 스트링 알고리즘',
    summary:
      '문자열과 알파벳의 기본 개념을 잡은 뒤 라빈-카프와 KMP의 전처리·매칭 흐름을 비교하는 강의.',
    topics: [
      '스트링과 알파벳',
      '스트링 매칭의 기본 개념',
      '라빈-카프 알고리즘',
      'KMP 알고리즘',
    ],
    examFocus: [
      '텍스트와 패턴의 역할 구분',
      '해시 후보를 문자 비교로 검증하는 순서',
      'KMP의 F 배열과 실패 함수 의미',
    ],
    mustKnow: [
      '라빈-카프는 해시값 후보 검사 후 직접 비교',
      'KMP는 패턴 내부의 일치 정보를 재사용',
      '전처리와 매칭의 분리',
    ],
    subtopics: [
      { id: 'rabin-karp', label: '라빈-카프', note: '해시 후보를 찾고 문자 비교로 확인.' },
      { id: 'kmp', label: 'KMP', note: 'F 배열과 실패 함수로 재비교를 줄임.' },
    ],
    defaultSubtopic: 'rabin-karp',
  },
  {
    id: 13,
    title: 'Boyer-Moore와 데이터 압축 기초',
    lectureSource: '강의록 13',
    textbookSource: '교재 6장: 스트링 알고리즘',
    summary:
      '보이어-무어의 불일치 문자/일치 접미부 이동과 무손실 압축의 기초인 RLE를 함께 묶어 보는 강의.',
    topics: [
      '보이어-무어 알고리즘',
      '데이터 압축 기본 개념',
      '무손실 압축과 손실 압축',
      'RLE',
    ],
    examFocus: [
      '오른쪽에서 왼쪽으로 비교하는 이유',
      '불일치 문자와 일치 접미부 이동의 비교',
      '연속 구간을 (문자, 횟수)로 바꾸는 RLE 해석',
    ],
    mustKnow: [
      '보이어-무어는 두 이동 규칙의 최대값을 선택',
      'RLE는 동일 문자의 연속(run)을 압축',
      '무손실 압축은 원문 복원이 가능',
    ],
    subtopics: [
      { id: 'boyer-moore', label: '보이어-무어', note: 'bad character와 good suffix 이동을 비교.' },
      { id: 'rle', label: 'RLE', note: '연속 구간을 run-length로 인코딩.' },
    ],
    defaultSubtopic: 'boyer-moore',
  },
  {
    id: 14,
    title: '허프만 코딩과 LZ77',
    lectureSource: '강의록 14',
    textbookSource: '교재 6장: 스트링 알고리즘',
    summary:
      '빈도 기반 접두부 코드인 허프만 코딩과 슬라이딩 윈도 기반 LZ77, 그리고 영상 압축의 큰 그림을 연결하는 강의.',
    topics: [
      '허프만 코딩',
      'LZ77',
      '영상 압축',
    ],
    examFocus: [
      '최소 빈도 두 노드부터 병합하는 허프만 트리',
      '슬라이딩 윈도에서 찾은 위치·길이·다음 문자',
      'JPEG와 MPEG가 반영하는 2차원/3차원 특성',
    ],
    mustKnow: [
      '허프만 코딩은 접두부 코드',
      '허프만 트리는 유일하지 않을 수 있음',
      'LZ77은 (거리, 길이, 다음 문자)로 인코딩',
    ],
    subtopics: [
      { id: 'huffman', label: '허프만 코딩', note: '빈도표와 병합 단계를 차례대로 확인.' },
      { id: 'lz77', label: 'LZ77', note: '슬라이딩 윈도와 triple을 확인.' },
      { id: 'image', label: '영상 압축', note: 'JPEG/MPEG의 큰 틀을 정리.' },
    ],
    defaultSubtopic: 'huffman',
  },
  {
    id: 15,
    title: 'NP-완전 문제와 근사 알고리즘',
    lectureSource: '강의록 15',
    textbookSource: '교재 7장: NP-완전 문제',
    summary:
      '클래스 P와 NP, 변환, NP-완전/NP-하드의 의미를 정리한 뒤 버텍스 커버, 외판원, 통 채우기 근사 알고리즘을 살펴보는 강의.',
    topics: [
      '클래스 P와 NP',
      '변환(reduction)',
      'NP-완전 문제와 NP-하드 문제',
      '근사 알고리즘',
      '버텍스 커버 / 외판원 / 통 채우기',
    ],
    examFocus: [
      '판정 문제와 최적화 문제 구분',
      '다항 시간 변환의 의미',
      '근사 알고리즘이 쓰이는 이유',
      '버텍스 커버·TSP·통 채우기 기법 비교',
    ],
    mustKnow: [
      'NP-완전은 NP에 속하고 NP-하드이기도 한 문제',
      '모든 NP-완전 문제는 NP-하드',
      '버텍스 커버는 선택한 간선의 양 끝 정점을 포함',
      'TSP 근사는 MST + DFS 순회',
      '통 채우기는 최초법/최선법/감소순 변형을 비교',
    ],
    subtopics: [
      { id: 'taxonomy', label: 'P / NP / 변환', note: '정의와 포함 관계를 한눈에 확인.' },
      { id: 'vertex-cover', label: '버텍스 커버', note: '간선을 골라 양 끝 정점을 추가.' },
      { id: 'tsp', label: '외판원 문제', note: 'MST와 DFS로 근사 경로를 구성.' },
      { id: 'bin-packing', label: '통 채우기', note: '최초법·최선법·감소순 변형을 비교.' },
    ],
    defaultSubtopic: 'taxonomy',
  },
];

