import { algorithmPastExamOcrText } from "./ocrText";
import type { ChoiceKey, PastExamQuestion, PastExamQuestionImage } from "./types";

type Topic = { lectureId: number; lectureLabel: string; concept: string; tags: string[]; basis: string; wrongRule: string; examSkill: string; textbook: string; };

const TOPICS: Record<string, Topic> = {
  "activitySelection": {
    "lectureId": 1,
    "lectureLabel": "1강 욕심쟁이 방법",
    "concept": "작업 선택 문제",
    "tags": [
      "작업선택",
      "욕심쟁이"
    ],
    "basis": "작업 선택 문제는 종료 시간이 빠른 작업을 먼저 선택하는 욕심쟁이 전략으로 최대 호환 작업 집합을 만든다.",
    "wrongRule": "시작 시간이 가장 빠른 작업이나 길이가 가장 짧은 작업만 고르면 오답이다.",
    "examSkill": "작업 선택 greedy 순서 추적",
    "textbook": "교재 1장 욕심쟁이 방법"
  },
  "algorithmCondition": {
    "lectureId": 1,
    "lectureLabel": "1강 알고리즘 조건",
    "concept": "알고리즘 조건",
    "tags": [
      "알고리즘",
      "조건"
    ],
    "basis": "알고리즘은 입력, 출력, 명확성, 유한성, 정확성을 갖추어야 하며 효율성은 실무적 평가 기준으로 함께 본다.",
    "wrongRule": "입력·출력·명확성·유한성·정확성 중 어떤 조건을 묻는지 바꾸어 판단하면 오답이다.",
    "examSkill": "조건 정의와 이론적/실무적 조건 구분",
    "textbook": "교재 1장 알고리즘 소개"
  },
  "algorithmTypes": {
    "lectureId": 1,
    "lectureLabel": "1강 설계 기법",
    "concept": "알고리즘 부류",
    "tags": [
      "설계기법",
      "분류"
    ],
    "basis": "강의에서 다루는 대표 부류는 정렬, 탐색, 그래프, 욕심쟁이, 분할정복, 동적 프로그래밍, 스트링, NP-완전 문제이다.",
    "wrongRule": "교재 범위에 포함된 부류와 포함되지 않은 부류를 혼동하면 오답이다.",
    "examSkill": "교재·강의 범위의 알고리즘 부류 판별",
    "textbook": "교재 1장 알고리즘 소개"
  },
  "asymptotic": {
    "lectureId": 2,
    "lectureLabel": "2강 점근 표기",
    "concept": "점근 성능 표기",
    "tags": [
      "복잡도",
      "Big-O"
    ],
    "basis": "점근 성능은 입력 크기가 충분히 커질 때 최고차항 중심으로 성장률을 비교하며 O, Ω, Θ의 의미를 구분한다.",
    "wrongRule": "상수항이나 낮은 차수항을 기준으로 판단하거나 상한·하한·동치 차수를 혼동하면 오답이다.",
    "examSkill": "Big-O 관계와 성장 차수 판별",
    "textbook": "교재 1장 성능 분석"
  },
  "bTree": {
    "lectureId": 7,
    "lectureLabel": "7강 B-트리",
    "concept": "B-트리",
    "tags": [
      "B트리",
      "균형탐색트리"
    ],
    "basis": "B-트리는 하나의 노드에 여러 키를 저장하여 외부 탐색 접근 횟수를 줄이며 삽입 중 분할이 발생할 수 있다.",
    "wrongRule": "차수와 키 개수 범위, 부모로 올라가는 키를 잘못 판단하면 오답이다.",
    "examSkill": "B-트리 삽입 과정 추적",
    "textbook": "교재 3장 B-트리"
  },
  "binarySearch": {
    "lectureId": 6,
    "lectureLabel": "6강 이진 탐색",
    "concept": "이진 탐색",
    "tags": [
      "탐색",
      "이진탐색"
    ],
    "basis": "이진 탐색은 정렬된 배열에서 중간값 비교로 탐색 범위를 절반씩 줄이며 탐색은 O(logn)이다.",
    "wrongRule": "정렬 조건, 연결 리스트 구현 효과, 삽입·삭제 비용을 혼동하면 오답이다.",
    "examSkill": "이진 탐색 조건과 성능 판별",
    "textbook": "교재 3장 탐색"
  },
  "binaryTree": {
    "lectureId": 6,
    "lectureLabel": "6강 탐색 트리",
    "concept": "이진 트리 성질",
    "tags": [
      "트리",
      "이진트리"
    ],
    "basis": "이진 트리는 각 노드의 자식 수가 최대 2개이며, 높이·깊이에 따라 가능한 노드 수와 단말 노드 수가 달라진다.",
    "wrongRule": "깊이와 높이, 전체 노드 수와 단말 노드 수의 공식을 바꾸면 오답이다.",
    "examSkill": "이진 트리 노드 수 공식 적용",
    "textbook": "교재 3장 탐색 트리"
  },
  "bst": {
    "lectureId": 6,
    "lectureLabel": "6강 BST",
    "concept": "이진 탐색 트리",
    "tags": [
      "BST",
      "삭제"
    ],
    "basis": "BST는 왼쪽 < 루트 < 오른쪽 성질을 가지며 삭제는 leaf, one-child, two-child 사례를 구분한다.",
    "wrongRule": "두 자식 삭제에서 중위 후속자/선행자 대체와 링크 조정을 잘못하면 오답이다.",
    "examSkill": "BST 탐색·삭제 추적",
    "textbook": "교재 3장 이진 탐색 트리"
  },
  "bubble": {
    "lectureId": 3,
    "lectureLabel": "3강 버블 정렬",
    "concept": "버블 정렬",
    "tags": [
      "버블정렬"
    ],
    "basis": "버블 정렬은 인접 원소를 비교·교환하며 한 패스가 끝날 때 큰 값이 뒤쪽 정렬 구간으로 이동한다.",
    "wrongRule": "한 패스의 방향, 교환 횟수, 이미 정렬된 구간을 잘못 추적하면 오답이다.",
    "examSkill": "버블 정렬 한 패스 추적",
    "textbook": "교재 2장 버블 정렬"
  },
  "compression": {
    "lectureId": 14,
    "lectureLabel": "14강 압축",
    "concept": "영상 압축과 JPEG",
    "tags": [
      "압축",
      "JPEG"
    ],
    "basis": "JPEG는 블록화, DCT, 양자화, 엔트로피 코딩 단계를 거치는 대표 영상 압축 방식이다.",
    "wrongRule": "처리 단계 순서를 바꾸거나 무손실 문자열 압축과 혼동하면 오답이다.",
    "examSkill": "JPEG 압축 단계 순서 판별",
    "textbook": "교재 6장 압축"
  },
  "countingSort": {
    "lectureId": 5,
    "lectureLabel": "5강 계수 정렬",
    "concept": "계수 정렬",
    "tags": [
      "계수정렬",
      "분포정렬"
    ],
    "basis": "계수 정렬은 자신보다 작거나 같은 키의 개수를 이용해 정렬 위치를 결정하며 키 범위 k가 성능에 포함된다.",
    "wrongRule": "비교 기반 정렬로 보거나 키 범위 조건을 무시하면 오답이다.",
    "examSkill": "계수 정렬 위치 계산 원리 판별",
    "textbook": "교재 2장 계수 정렬"
  },
  "designTechnique": {
    "lectureId": 1,
    "lectureLabel": "1강 설계 기법",
    "concept": "대표 설계 기법",
    "tags": [
      "설계기법"
    ],
    "basis": "대표 설계 기법은 욕심쟁이 방법, 분할정복, 동적 프로그래밍, 백트래킹, 근사 알고리즘 등이며 문제 구조에 따라 적용한다.",
    "wrongRule": "자료구조 분석법이나 성능 분석 용어를 설계 기법으로 보면 오답이다.",
    "examSkill": "설계 기법 이름과 적용 문제 연결",
    "textbook": "교재 1장 알고리즘 설계"
  },
  "dfsScc": {
    "lectureId": 8,
    "lectureLabel": "8강 그래프 순회",
    "concept": "DFS와 강연결 성분",
    "tags": [
      "DFS",
      "SCC"
    ],
    "basis": "DFS는 깊게 방문한 뒤 되돌아오며, 강연결 성분은 방향 그래프에서 서로 도달 가능한 최대 정점 집합이다.",
    "wrongRule": "무방향 연결 성분과 강연결 성분, 방문 순서 조건을 혼동하면 오답이다.",
    "examSkill": "DFS 방문 순서와 SCC 개수 판별",
    "textbook": "교재 4장 그래프 순회"
  },
  "dijkstraFloyd": {
    "lectureId": 10,
    "lectureLabel": "10강 최단 경로",
    "concept": "최단 경로 알고리즘",
    "tags": [
      "최단경로",
      "그래프"
    ],
    "basis": "데이크스트라, 벨만-포드, 플로이드는 최단 경로 문제를 풀지만 대상과 조건, 설계 기법이 다르다.",
    "wrongRule": "단일 출발점과 모든 쌍, 욕심쟁이와 동적 프로그래밍 기법을 혼동하면 오답이다.",
    "examSkill": "최단 경로 알고리즘 종류와 한계 판별",
    "textbook": "교재 4장 최단 경로"
  },
  "divideConquer": {
    "lectureId": 4,
    "lectureLabel": "4강 분할정복 정렬",
    "concept": "분할정복",
    "tags": [
      "분할정복"
    ],
    "basis": "분할정복은 문제를 나누고, 부분문제를 풀고, 결과를 결합하는 구조이다. 퀵 정렬·합병 정렬·이진 탐색에 적용된다.",
    "wrongRule": "분할된 부분문제의 독립성, 하향식 처리, 분할·정복·결합 순서를 잘못 판단하면 오답이다.",
    "examSkill": "분할정복 절차와 적용 알고리즘 판별",
    "textbook": "교재 2장 정렬"
  },
  "dpConcept": {
    "lectureId": 11,
    "lectureLabel": "11강 동적 프로그래밍",
    "concept": "동적 프로그래밍",
    "tags": [
      "DP",
      "최적성의원리"
    ],
    "basis": "동적 프로그래밍은 최적성의 원리와 중복 부분문제를 이용해 작은 문제의 해를 테이블에 저장한다.",
    "wrongRule": "독립 부분문제를 다루는 분할정복과 혼동하거나 소문제 독립성을 DP 조건으로 보면 오답이다.",
    "examSkill": "DP 적용 조건과 처리 순서 판별",
    "textbook": "교재 5장 동적 프로그래밍"
  },
  "editDistance": {
    "lectureId": 11,
    "lectureLabel": "11강 동적 프로그래밍",
    "concept": "스트링 편집 거리",
    "tags": [
      "DP",
      "편집거리"
    ],
    "basis": "스트링 편집 거리는 삽입·삭제·치환 비용을 누적하는 테이블 문제로 동적 프로그래밍이 적합하다.",
    "wrongRule": "문자열 변환 문제를 단순 정렬이나 욕심쟁이로 판단하면 오답이다.",
    "examSkill": "DP 문제 유형 판별",
    "textbook": "교재 5장 동적 프로그래밍"
  },
  "fibonacci": {
    "lectureId": 11,
    "lectureLabel": "11강 동적 프로그래밍",
    "concept": "피보나치 DP",
    "tags": [
      "DP",
      "피보나치"
    ],
    "basis": "피보나치 수열은 점화식으로 정의되며 작은 값부터 저장해 계산할 수 있는 기본 동적 프로그래밍 예이다.",
    "wrongRule": "초기값과 인덱스 기준을 바꾸면 오답이다.",
    "examSkill": "피보나치 점화식 계산",
    "textbook": "교재 5장 동적 프로그래밍"
  },
  "floyd": {
    "lectureId": 10,
    "lectureLabel": "10강 플로이드",
    "concept": "플로이드 알고리즘",
    "tags": [
      "플로이드",
      "동적프로그래밍"
    ],
    "basis": "플로이드는 경유 정점 집합을 단계적으로 늘려 모든 정점 쌍의 최단 경로를 구하는 동적 프로그래밍 알고리즘이다.",
    "wrongRule": "D 행렬 갱신식, P 행렬 경로 복원, 세 중첩 반복의 의미를 혼동하면 오답이다.",
    "examSkill": "플로이드 행렬 갱신과 성능 계산",
    "textbook": "교재 4장 플로이드"
  },
  "fractionalKnapsack": {
    "lectureId": 1,
    "lectureLabel": "1강 배낭 문제",
    "concept": "분할 가능 배낭",
    "tags": [
      "배낭",
      "욕심쟁이"
    ],
    "basis": "분할 가능 배낭은 단위 무게당 이익이 큰 물체부터 선택하고 남은 용량만큼 물체를 쪼개 넣을 수 있다.",
    "wrongRule": "물체를 쪼갤 수 있는 경우와 0/1 배낭을 혼동하거나 단위 이익 대신 총이익만 비교하면 오답이다.",
    "examSkill": "단위 무게당 이익 기준의 선택 순서 계산",
    "textbook": "교재 1장 배낭 문제"
  },
  "genetic": {
    "lectureId": 15,
    "lectureLabel": "15강 NP-완전 문제",
    "concept": "유전 알고리즘 용어",
    "tags": [
      "유전알고리즘",
      "최적화"
    ],
    "basis": "유전 알고리즘은 선택, 교차, 변이 같은 연산으로 후보해 집단을 탐색하는 최적화 접근이다.",
    "wrongRule": "부모 형질 결합을 변이나 선택으로 보면 오답이다.",
    "examSkill": "유전 알고리즘 연산 구분",
    "textbook": "교재 7장 NP-완전 문제"
  },
  "graphPath": {
    "lectureId": 8,
    "lectureLabel": "8강 그래프 표현과 순회",
    "concept": "그래프 경로",
    "tags": [
      "그래프",
      "경로"
    ],
    "basis": "그래프에서 경로는 간선으로 연결된 정점들의 순서 리스트이며 방향 그래프에서는 간선 방향도 고려한다.",
    "wrongRule": "경로, 차수, 연결, 사이클 정의를 서로 바꾸면 오답이다.",
    "examSkill": "그래프 기본 용어 판별",
    "textbook": "교재 4장 그래프"
  },
  "greedy": {
    "lectureId": 1,
    "lectureLabel": "1강 욕심쟁이 방법",
    "concept": "욕심쟁이 방법",
    "tags": [
      "욕심쟁이",
      "최적화"
    ],
    "basis": "욕심쟁이 방법은 현재 단계에서 가장 좋아 보이는 선택을 반복하며, 거스름돈·분할 가능 배낭·MST 등에서 다룬다.",
    "wrongRule": "0/1 배낭처럼 선택 되돌림이 필요한 문제를 무조건 욕심쟁이로 풀면 오답이다.",
    "examSkill": "욕심쟁이 적용 가능 문제 판별",
    "textbook": "교재 1장 알고리즘 설계"
  },
  "hashing": {
    "lectureId": 7,
    "lectureLabel": "7강 해싱",
    "concept": "해싱과 선형 탐사",
    "tags": [
      "해싱",
      "선형탐사"
    ],
    "basis": "해싱은 키를 테이블 주소로 변환하고, 선형 탐사는 충돌 시 다음 칸을 순서대로 검사한다. 클러스터링이 성능을 낮출 수 있다.",
    "wrongRule": "해시 함수 자체와 충돌 해결 방법을 혼동하거나 클러스터링 원인을 바꾸면 오답이다.",
    "examSkill": "충돌 해결 방법과 클러스터링 판별",
    "textbook": "교재 3장 해싱"
  },
  "heapSort": {
    "lectureId": 5,
    "lectureLabel": "5강 힙 정렬",
    "concept": "힙 정렬",
    "tags": [
      "힙",
      "정렬"
    ],
    "basis": "힙 정렬은 초기 최대 힙을 만든 뒤 루트 최댓값 삭제와 힙 재구성을 반복한다.",
    "wrongRule": "초기 힙의 루트, 삭제 후 재구성 과정, 이미 정렬된 구간을 잘못 추적하면 오답이다.",
    "examSkill": "힙 정렬 단계 추적",
    "textbook": "교재 2장 힙 정렬"
  },
  "huffman": {
    "lectureId": 14,
    "lectureLabel": "14강 허프만 코딩",
    "concept": "허프만 코딩",
    "tags": [
      "허프만",
      "압축"
    ],
    "basis": "허프만 코딩은 빈도가 높은 문자에 짧은 접두부 코드를 부여하여 평균 코드 길이를 줄인다.",
    "wrongRule": "문자 빈도와 코드 길이의 관계 또는 접두부 코드 성질을 놓치면 오답이다.",
    "examSkill": "허프만 빈도 기반 코드 길이 계산",
    "textbook": "교재 6장 허프만 코딩"
  },
  "insertionSort": {
    "lectureId": 3,
    "lectureLabel": "3강 삽입 정렬",
    "concept": "삽입 정렬",
    "tags": [
      "삽입정렬"
    ],
    "basis": "삽입 정렬은 앞쪽의 정렬된 구간에 현재 원소를 삽입하며 거의 정렬된 입력에서 빠르다.",
    "wrongRule": "셸 정렬과의 관계, 안정성, 최선 성능을 잘못 판단하면 오답이다.",
    "examSkill": "삽입 정렬 성능과 특징 판별",
    "textbook": "교재 2장 삽입 정렬"
  },
  "linkedListStack": {
    "lectureId": 6,
    "lectureLabel": "6강 탐색 구조",
    "concept": "기초 자료구조",
    "tags": [
      "리스트",
      "스택"
    ],
    "basis": "선형 리스트와 연결 구조는 자료 삽입·삭제 위치와 접근 가능 방향에 따라 구분한다. 스택은 한쪽 끝에서 삽입과 삭제가 일어난다.",
    "wrongRule": "배열, 큐, 트리처럼 저장 구조나 접근 규칙이 다른 자료구조와 혼동하면 오답이다.",
    "examSkill": "자료구조의 삽입·삭제 규칙 판별",
    "textbook": "교재 3장 탐색"
  },
  "loopComplexity": {
    "lectureId": 2,
    "lectureLabel": "2강 시간 복잡도",
    "concept": "프로그램 시간 복잡도",
    "tags": [
      "복잡도",
      "반복문"
    ],
    "basis": "프로그램의 시간 복잡도는 기본 연산의 수행 횟수를 입력 크기 n의 함수로 세어 최고차항으로 정리한다.",
    "wrongRule": "반복문 횟수와 입력 데이터 값을 혼동하거나 출력문 개수만 세면 오답이다.",
    "examSkill": "반복문 기반 수행시간 계산",
    "textbook": "교재 1장 성능 분석"
  },
  "matrixChain": {
    "lectureId": 11,
    "lectureLabel": "11강 행렬 연쇄 곱셈",
    "concept": "행렬 연쇄 곱셈",
    "tags": [
      "DP",
      "행렬연쇄"
    ],
    "basis": "행렬 연쇄 곱셈은 C[i][j]에 최소 기본 곱셈 횟수를, P[i][j]에 최적 분할 위치를 저장한다.",
    "wrongRule": "행렬 차원 곱셈 비용이나 C/P 테이블의 의미를 바꾸면 오답이다.",
    "examSkill": "행렬 연쇄 DP 비용 계산",
    "textbook": "교재 5장 행렬 연쇄 곱셈"
  },
  "mergeSort": {
    "lectureId": 4,
    "lectureLabel": "4강 합병 정렬",
    "concept": "합병 정렬",
    "tags": [
      "합병정렬",
      "분할정복"
    ],
    "basis": "합병 정렬은 동일 크기 부분배열로 분할하고 정렬된 부분배열을 merge()로 합치며 O(nlogn) 성능을 갖는다.",
    "wrongRule": "합병 정렬을 제자리 정렬로 보거나 퀵 정렬처럼 피벗 중심으로 설명하면 오답이다.",
    "examSkill": "합병 정렬 처리 방식과 공간 특성 판별",
    "textbook": "교재 2장 합병 정렬"
  },
  "mst": {
    "lectureId": 9,
    "lectureLabel": "9강 최소 신장 트리",
    "concept": "최소 신장 트리",
    "tags": [
      "MST",
      "욕심쟁이"
    ],
    "basis": "MST는 연결 가중 무방향 그래프에서 모든 정점을 포함하고 사이클이 없으며 가중치 합이 최소인 트리이다. 크루스칼과 프림이 대표 알고리즘이다.",
    "wrongRule": "최단 경로 알고리즘이나 문자열 알고리즘을 MST 알고리즘으로 고르면 오답이다.",
    "examSkill": "MST 알고리즘과 적용 결과 판별",
    "textbook": "교재 4장 최소 신장 트리"
  },
  "npComplete": {
    "lectureId": 15,
    "lectureLabel": "15강 NP-완전",
    "concept": "NP-완전 문제",
    "tags": [
      "NP완전",
      "판정문제"
    ],
    "basis": "NP-완전 문제는 NP에 속하고 NP의 모든 문제가 다항 시간 변환되는 문제이며, 대표 문제와 비대표 문제를 구분해야 한다.",
    "wrongRule": "NP-hard, NP, P, 최단 경로 같은 다항 시간 문제를 NP-완전으로 혼동하면 오답이다.",
    "examSkill": "NP-완전 정의와 대표 문제 판별",
    "textbook": "교재 7장 NP-완전"
  },
  "quickPartition": {
    "lectureId": 4,
    "lectureLabel": "4강 퀵 정렬",
    "concept": "퀵 정렬 partition()",
    "tags": [
      "퀵정렬",
      "partition"
    ],
    "basis": "퀵 정렬의 partition()은 피벗을 기준으로 작은 값과 큰 값을 나누고 피벗을 최종 위치에 둔다.",
    "wrongRule": "피벗 기준, 왼쪽/오른쪽 부분배열 범위, 오름차순 조건을 잘못 추적하면 오답이다.",
    "examSkill": "partition 1회 적용 결과 추적",
    "textbook": "교재 2장 퀵 정렬"
  },
  "quickWorst": {
    "lectureId": 4,
    "lectureLabel": "4강 퀵 정렬",
    "concept": "퀵 정렬 성능",
    "tags": [
      "퀵정렬",
      "최악성능"
    ],
    "basis": "퀵 정렬은 균등 분할이면 O(nlogn), 한쪽으로 치우친 분할이면 O(n^2)이 된다.",
    "wrongRule": "피벗이 최소/최대가 되는 경우와 균등 분할을 혼동하면 오답이다.",
    "examSkill": "퀵 정렬 최선/최악 분할 조건 판별",
    "textbook": "교재 2장 퀵 정렬"
  },
  "selectionProblem": {
    "lectureId": 4,
    "lectureLabel": "4강 분할정복 선택",
    "concept": "선택 문제와 중간값들의 중간값",
    "tags": [
      "선택문제",
      "중간값들의중간값"
    ],
    "basis": "선택 문제는 i번째 작은 원소를 찾는 문제이며, 중간값들의 중간값 기법은 원소를 5개씩 그룹화하고 각 그룹의 중간값 중 다시 중간값을 피벗으로 골라 최악 O(n)을 보장한다.",
    "wrongRule": "그룹의 중간값을 구하지 않거나 중간값들의 중간값 대신 임의 원소를 피벗으로 고르면 오답이다.",
    "examSkill": "그룹별 중간값 산출 후 피벗 선택",
    "textbook": "교재 1장 선택 문제"
  },
  "radixSort": {
    "lectureId": 5,
    "lectureLabel": "5강 기수 정렬",
    "concept": "기수 정렬",
    "tags": [
      "기수정렬",
      "안정정렬"
    ],
    "basis": "기수 정렬은 자리수별로 안정적인 정렬을 반복하며 자리수와 내부 정렬의 안정성이 중요하다.",
    "wrongRule": "비교 기반 정렬로 보거나 안정 정렬 필요성을 빠뜨리면 오답이다.",
    "examSkill": "기수 정렬 조건과 성능 판별",
    "textbook": "교재 2장 기수 정렬"
  },
  "rbTree": {
    "lectureId": 7,
    "lectureLabel": "7강 레드-블랙 트리",
    "concept": "레드-블랙 트리",
    "tags": [
      "RB트리",
      "균형탐색트리"
    ],
    "basis": "레드-블랙 트리는 이진 탐색 트리 형태에 색 규칙을 더해 높이를 제한한다. 빨강 노드의 자식은 검정이고 루트는 검정이다.",
    "wrongRule": "검정 높이와 빨강 연속 금지 규칙을 잘못 적용하면 오답이다.",
    "examSkill": "레드-블랙 트리 규칙 판별",
    "textbook": "교재 3장 레드-블랙 트리"
  },
  "recurrence": {
    "lectureId": 2,
    "lectureLabel": "2강 점화식",
    "concept": "점화식 성능",
    "tags": [
      "점화식",
      "복잡도"
    ],
    "basis": "순환 알고리즘은 부분문제 크기, 호출 수, 결합 비용을 점화식으로 나타내고 기본 패턴과 비교해 성능을 판단한다.",
    "wrongRule": "크기가 절반으로 줄어드는 경우와 1씩 줄어드는 경우를 혼동하면 오답이다.",
    "examSkill": "기본 점화식과 성능 연결",
    "textbook": "교재 1장 성능 분석"
  },
  "selectionSort": {
    "lectureId": 3,
    "lectureLabel": "3강 선택 정렬",
    "concept": "선택 정렬",
    "tags": [
      "선택정렬"
    ],
    "basis": "선택 정렬은 미정렬 구간에서 최솟값을 찾아 앞자리와 교환하며 비교 횟수는 입력 상태 영향이 작다.",
    "wrongRule": "삽입 정렬처럼 정렬 구간에 끼워 넣는 것으로 보면 오답이다.",
    "examSkill": "선택 정렬 처리 과정 판별",
    "textbook": "교재 2장 선택 정렬"
  },
  "sequentialSearch": {
    "lectureId": 6,
    "lectureLabel": "6강 순차 탐색",
    "concept": "순차 탐색",
    "tags": [
      "탐색",
      "순차탐색"
    ],
    "basis": "순차 탐색은 앞에서부터 차례로 비교하며 모든 리스트에 적용 가능하지만 최악 성능은 O(n)이다.",
    "wrongRule": "정렬 여부와 최대 비교 횟수, 데이터 수가 많을 때의 비효율을 잘못 판단하면 오답이다.",
    "examSkill": "순차 탐색 특징 판별",
    "textbook": "교재 3장 탐색"
  },
  "shellSort": {
    "lectureId": 3,
    "lectureLabel": "3강 셸 정렬",
    "concept": "셸 정렬",
    "tags": [
      "셸정렬"
    ],
    "basis": "셸 정렬은 간격 수열에 따라 부분배열에 삽입 정렬을 적용하고 마지막에 간격 1로 정렬한다.",
    "wrongRule": "간격 수열의 의미를 힙이나 계수 정렬과 혼동하면 오답이다.",
    "examSkill": "셸 정렬 간격 수열 판별",
    "textbook": "교재 2장 셸 정렬"
  },
  "sortPerformance": {
    "lectureId": 5,
    "lectureLabel": "5강 정렬 총정리",
    "concept": "정렬 성능 비교",
    "tags": [
      "정렬",
      "성능"
    ],
    "basis": "정렬 알고리즘은 최선·평균·최악 성능이 다르며 입력 상태에 따라 차이가 나는 알고리즘을 구분해야 한다.",
    "wrongRule": "항상 같은 복잡도인지, 입력 상태에 민감한지, 비교 기반인지의 기준을 혼동하면 오답이다.",
    "examSkill": "정렬 성능표 적용",
    "textbook": "교재 2장 정렬"
  },
  "sortingClass": {
    "lectureId": 3,
    "lectureLabel": "3강 정렬 분류",
    "concept": "정렬 분류",
    "tags": [
      "정렬",
      "분류"
    ],
    "basis": "정렬 알고리즘은 비교 기반 여부, 안정성, 제자리 여부, 입력 상태 영향으로 구분한다.",
    "wrongRule": "비교 기반 정렬과 분포 기반 정렬, 안정성과 제자리성을 섞어 판단하면 오답이다.",
    "examSkill": "정렬 알고리즘 성질 비교",
    "textbook": "교재 2장 정렬"
  },
  "stableSort": {
    "lectureId": 3,
    "lectureLabel": "3강 정렬 분류",
    "concept": "안정적 정렬",
    "tags": [
      "안정성",
      "정렬"
    ],
    "basis": "안정적 정렬은 같은 키를 가진 원소의 상대 순서를 보존한다. 버블·삽입·합병 정렬은 일반 구현에서 안정적이다.",
    "wrongRule": "힙·퀵·선택 정렬을 안정 정렬로 보거나 동일 키 상대 순서 기준을 놓치면 오답이다.",
    "examSkill": "정렬 안정성 판별",
    "textbook": "교재 2장 정렬 분류"
  },
  "stringMatching": {
    "lectureId": 12,
    "lectureLabel": "12강 스트링 매칭",
    "concept": "스트링 매칭",
    "tags": [
      "문자열",
      "매칭"
    ],
    "basis": "라빈-카프, KMP, 보이어-무어는 스트링 매칭 알고리즘이며 그래프 알고리즘과 구분한다.",
    "wrongRule": "프림이나 크루스칼 같은 그래프 알고리즘을 스트링 매칭으로 보면 오답이다.",
    "examSkill": "스트링 매칭 알고리즘 종류 판별",
    "textbook": "교재 6장 스트링 매칭"
  },
  "tree234": {
    "lectureId": 6,
    "lectureLabel": "6강 2-3-4 트리",
    "concept": "2-3-4 트리",
    "tags": [
      "2-3-4",
      "균형트리"
    ],
    "basis": "2-3-4 트리는 모든 leaf가 같은 깊이에 있고 4-node 분할로 균형을 유지하는 탐색 트리이다.",
    "wrongRule": "4-node의 키 개수, 경사 트리 가능성, 레드-블랙 대응 방향을 혼동하면 오답이다.",
    "examSkill": "2-3-4 트리 성질 판별",
    "textbook": "교재 3장 2-3-4 트리"
  },
  "tspApprox": {
    "lectureId": 15,
    "lectureLabel": "15강 근사 알고리즘",
    "concept": "TSP와 근사 알고리즘",
    "tags": [
      "TSP",
      "근사"
    ],
    "basis": "TSP와 버텍스 커버, 통 채우기 등은 정확 최적해가 어려울 때 근사 알고리즘과 인코딩 방식으로 다룬다.",
    "wrongRule": "MST 자체와 TSP 근사 절차, 염색체 인코딩 목적을 혼동하면 오답이다.",
    "examSkill": "TSP/근사/인코딩 개념 판별",
    "textbook": "교재 7장 NP-완전"
  }
};

const ANSWERS: Record<2017 | 2018 | 2019, string> = {
  2017: "24334123411321241412343134111343231",
  2018: "14241444212413134241334421333312241",
  2019: "32134421212434432234123324421444312"
};

const TOPIC_BY_YEAR: Record<2017 | 2018 | 2019, string[]> = {
  2017: [
    "linkedListStack",
    "binaryTree",
    "greedy",
    "fractionalKnapsack",
    "asymptotic",
    "loopComplexity",
    "sortPerformance",
    "bubble",
    "shellSort",
    "mergeSort",
    "divideConquer",
    "quickPartition",
    "quickWorst",
    "heapSort",
    "countingSort",
    "sortingClass",
    "sortPerformance",
    "sortingClass",
    "sequentialSearch",
    "binarySearch",
    "bst",
    "tree234",
    "rbTree",
    "dfsScc",
    "dfsScc",
    "dijkstraFloyd",
    "mst",
    "floyd",
    "stringMatching",
    "huffman",
    "compression",
    "editDistance",
    "dpConcept",
    "npComplete",
    "genetic"
  ],
  2018: [
    "algorithmTypes",
    "algorithmCondition",
    "binaryTree",
    "loopComplexity",
    "asymptotic",
    "divideConquer",
    "selectionProblem",
    "quickWorst",
    "quickPartition",
    "floyd",
    "matrixChain",
    "floyd",
    "dpConcept",
    "greedy",
    "mst",
    "activitySelection",
    "huffman",
    "radixSort",
    "bubble",
    "selectionSort",
    "insertionSort",
    "shellSort",
    "mergeSort",
    "mergeSort",
    "heapSort",
    "countingSort",
    "bst",
    "bst",
    "rbTree",
    "bTree",
    "hashing",
    "npComplete",
    "npComplete",
    "genetic",
    "tspApprox"
  ],
  2019: [
    "algorithmCondition",
    "linkedListStack",
    "graphPath",
    "designTechnique",
    "asymptotic",
    "recurrence",
    "divideConquer",
    "divideConquer",
    "quickPartition",
    "quickWorst",
    "quickPartition",
    "dpConcept",
    "fibonacci",
    "matrixChain",
    "floyd",
    "fractionalKnapsack",
    "mst",
    "mst",
    "activitySelection",
    "sortingClass",
    "stableSort",
    "bubble",
    "selectionSort",
    "insertionSort",
    "mergeSort",
    "divideConquer",
    "heapSort",
    "radixSort",
    "sequentialSearch",
    "binarySearch",
    "rbTree",
    "bTree",
    "sequentialSearch",
    "hashing",
    "tspApprox"
  ]
};

const CHOICE_LABELS: Record<ChoiceKey, string> = { "1": "1번", "2": "2번", "3": "3번", "4": "4번" };

function visual(
  fileName: string,
  alt: string,
  aiDescriptionHidden: string,
  sourcePageInternal: 1 | 2 | 3,
  width: number,
  height: number,
): PastExamQuestionImage {
  return {
    src: `/algorithm/past-exam/figures/${fileName}`,
    alt,
    aiDescriptionHidden,
    sourcePageInternal,
    cropBoxInternal: { x: 0, y: 0, width, height },
  };
}

const VISUAL_CROPS: Partial<Record<string, PastExamQuestionImage[]>> = {
  "2017-1-q04": [
    visual(
      "2017-1-q04-knapsack.png",
      "분수 배낭 문제의 물체별 무게와 이익 표",
      "소시지, 빵, 귤, 생선 네 물체의 무게와 이익, 배낭 용량 10이 제시된 표 영역이다. 물체를 쪼갤 수 있다는 조건이 함께 주어져 단위 무게당 이익 비교가 필요하다.",
      1,
      1050,
      343,
    ),
  ],
  "2017-1-q05": [
    visual(
      "2017-1-q05-big-o-graphs.png",
      "빅오 관계를 나타내는 네 개의 그래프",
      "각 보기별로 f(n), cg(n), c1g(n), c2g(n) 곡선과 n0 또는 n1 기준점이 배치되어 있다. 충분히 큰 n에서 함수가 상한 조건을 만족하는지를 판별해야 한다.",
      1,
      875,
      595,
    ),
  ],
  "2017-1-q06": [
    visual(
      "2017-1-q06-code.png",
      "시간 복잡도 분석 대상 의사코드",
      "배열 A와 n을 입력으로 받아 S와 i를 초기화한 뒤 while 반복문에서 A[i]를 누적하고 i를 1씩 증가시키는 의사코드이다. 반복 횟수와 반복문 밖의 상수 시간 문장을 구분해야 한다.",
      1,
      1050,
      310,
    ),
  ],
  "2017-1-q08": [
    visual(
      "2017-1-q08-bubble-array.png",
      "버블 정렬의 한 단계 결과 배열",
      "버블 정렬 과정 중 현재 배열 상태가 한 줄로 제시되어 있으며, 밑줄 표시된 뒤쪽 구간은 이미 정렬된 부분임을 나타낸다.",
      1,
      1035,
      100,
    ),
  ],
  "2017-1-q09": [
    visual(
      "2017-1-q09-shell-sequences.png",
      "셸 정렬 간격 수열 보기",
      "1, 2, 4, 8, 16 등의 수열과 1, 4, 13, 40, 121 등의 수열처럼 셸 정렬에서 사용할 수 있는 여러 간격 수열이 글머리표 형태로 제시되어 있다.",
      1,
      1035,
      180,
    ),
  ],
  "2017-1-q14": [
    visual(
      "2017-1-q14-heap-array.png",
      "힙 정렬 초기 힙 배열",
      "초기 힙을 배열로 표현한 한 줄 자료이다. 오름차순 힙 정렬에서 최댓값 삭제와 힙 재구성 단계를 반복 추적해야 한다.",
      2,
      1050,
      80,
    ),
  ],
  "2017-1-q16": [
    visual(
      "2017-1-q16-18-sort-list.png",
      "16번부터 18번까지 공통으로 사용하는 정렬 알고리즘 목록",
      "선택 정렬, 계수 정렬, 힙 정렬, 기수 정렬, 셸 정렬, 합병 정렬, 버블 정렬, 퀵 정렬, 버킷 정렬, 삽입 정렬이 공통 보기로 제시된 영역이다.",
      2,
      1050,
      145,
    ),
  ],
  "2017-1-q17": [
    visual(
      "2017-1-q16-18-sort-list.png",
      "16번부터 18번까지 공통으로 사용하는 정렬 알고리즘 목록",
      "선택 정렬, 계수 정렬, 힙 정렬, 기수 정렬, 셸 정렬, 합병 정렬, 버블 정렬, 퀵 정렬, 버킷 정렬, 삽입 정렬이 공통 보기로 제시된 영역이다.",
      2,
      1050,
      145,
    ),
  ],
  "2017-1-q18": [
    visual(
      "2017-1-q16-18-sort-list.png",
      "16번부터 18번까지 공통으로 사용하는 정렬 알고리즘 목록",
      "선택 정렬, 계수 정렬, 힙 정렬, 기수 정렬, 셸 정렬, 합병 정렬, 버블 정렬, 퀵 정렬, 버킷 정렬, 삽입 정렬이 공통 보기로 제시된 영역이다.",
      2,
      1050,
      145,
    ),
  ],
  "2017-1-q21": [
    visual(
      "2017-1-q21-bst.png",
      "루트 삭제를 묻는 이진 탐색 트리",
      "루트 30 아래에 왼쪽 부분트리와 오른쪽 부분트리가 배치된 이진 탐색 트리이다. 루트 노드 삭제 시 대체될 중위 후속자 또는 선행자 후보를 트리 구조에서 찾아야 한다.",
      2,
      645,
      280,
    ),
  ],
  "2017-1-q23": [
    visual(
      "2017-1-q23-234-rb-options.png",
      "2-3-4 트리와 레드-블랙 트리 표현 선택지",
      "상단에 2-3-4 트리가 제시되고, 아래에 이를 레드-블랙 트리로 표현한 네 개의 후보 그림이 배치되어 있다. 검게 채워진 노드는 적색 노드, 흰 바탕 노드는 흑색 노드를 뜻한다.",
      2,
      820,
      1905,
    ),
  ],
  "2017-1-q24": [
    visual(
      "2017-1-q24-dfs-graph.png",
      "깊이 우선 탐색 대상 그래프와 방문 순서 표",
      "정점 1부터 6까지의 그래프와 방문 순서의 일부가 표기된 영역이다. DFS를 수행해 빈 칸에 해당하는 방문 정점을 판단해야 한다.",
      2,
      755,
      270,
    ),
  ],
  "2017-1-q25": [
    visual(
      "2017-1-q25-scc-graph.png",
      "강연결 성분 개수를 묻는 방향 그래프",
      "여섯 개 정점이 방향 간선으로 연결된 그래프이다. 서로 도달 가능한 최대 정점 집합을 기준으로 강연결 성분의 개수를 세어야 한다.",
      3,
      370,
      340,
    ),
  ],
  "2017-1-q27": [
    visual(
      "2017-1-q27-mst-graph.png",
      "최소 신장 트리 간선 선택 그래프",
      "정점들이 가중치 간선으로 연결된 무방향 그래프이다. 크루스칼 또는 프림 절차로 최소 신장 트리에 포함되지 않는 간선을 판별해야 한다.",
      3,
      410,
      375,
    ),
  ],
  "2017-1-q28": [
    visual(
      "2017-1-q28-floyd-graph-matrices.png",
      "플로이드 알고리즘 그래프와 초기·최종 행렬",
      "가중 방향 그래프와 플로이드 알고리즘의 초기 거리 행렬 및 최종 거리 행렬이 함께 제시되어 있다. 최종 행렬의 빈칸 값들을 비교해야 한다.",
      3,
      935,
      620,
    ),
  ],
  "2018-1-q11": [
    visual(
      "2018-1-q11-matrix-chain.png",
      "연쇄 행렬 곱셈의 행렬 차원 표",
      "여섯 개 행렬의 차원이 한 줄 표로 제시되어 있다. C(1,2)를 계산하기 위해 첫 두 행렬의 차원과 곱셈 비용을 읽어야 한다.",
      1,
      1035,
      135,
    ),
  ],
  "2018-1-q12": [
    visual(
      "2018-1-q12-shortest-path-graph.png",
      "모든 정점 간 최단 경로 계산용 방향 그래프",
      "정점 사이에 가중치가 표시된 방향 그래프이다. 플로이드 알고리즘 또는 최단 경로 계산에서 특정 거리 값을 구하는 조건으로 사용된다.",
      1,
      460,
      380,
    ),
  ],
  "2018-1-q16": [
    visual(
      "2018-1-q16-scheduling-table.png",
      "작업 스케줄링 작업 구간 표",
      "여러 작업 t1부터 t8까지의 시작 시간과 종료 시간이 순서쌍으로 제시되어 있다. 작업 선택 문제에서 먼저 배정되는 작업을 판별해야 한다.",
      1,
      1035,
      130,
    ),
  ],
  "2018-1-q25": [
    visual(
      "2018-1-q25-heap-array.png",
      "힙 정렬 두 번째 단계 적용 전 배열",
      "초기 힙 배열이 한 줄로 제시되어 있다. 최댓값 삭제 후 힙 재구성 단계를 한 번 수행한 뒤 배열 상태를 추적해야 한다.",
      2,
      1050,
      58,
    ),
  ],
  "2018-1-q28": [
    visual(
      "2018-1-q28-bst.png",
      "노드 35 삭제를 묻는 이진 탐색 트리",
      "루트 35와 하위 노드 30, 55, 22, 44, 88, 40 등이 배치된 이진 탐색 트리이다. 두 자식을 가진 노드를 삭제할 때 대체 위치를 판단해야 한다.",
      2,
      535,
      365,
    ),
  ],
  "2018-1-q30": [
    visual(
      "2018-1-q30-btree.png",
      "70 삽입 전 B-트리 구조",
      "루트와 하위 노드에 여러 키가 들어 있는 B-트리이다. 70을 삽입하는 과정에서 분할되어 부모 노드로 올라가는 키를 찾아야 한다.",
      2,
      650,
      290,
    ),
  ],
  "2019-1-q11": [
    visual(
      "2019-1-q11-groups.png",
      "선택 문제의 그룹별 원소 표",
      "입력 크기 38인 배열 원소를 여러 그룹 G1부터 G7로 나눈 표이다. 각 그룹의 중간값과 중간값들의 중간값을 찾아 피벗을 정해야 한다.",
      1,
      620,
      385,
    ),
  ],
  "2019-1-q16": [
    visual(
      "2019-1-q16-knapsack.png",
      "분수 배낭 문제의 물체별 무게와 이익 조건",
      "배낭 용량 10과 네 물체의 무게·이익이 목록으로 제시되어 있다. 물체를 쪼갤 수 있다는 조건에서 단위 무게당 이익 순서를 따져야 한다.",
      2,
      1055,
      240,
    ),
  ],
  "2019-1-q18": [
    visual(
      "2019-1-q18-mst-graph.png",
      "최소 신장 트리 가중치 그래프",
      "여러 정점과 가중치 간선으로 이루어진 무방향 그래프이다. 최소 신장 트리에 포함되는 간선들의 가중치 합을 계산해야 한다.",
      2,
      350,
      360,
    ),
  ],
  "2019-1-q19": [
    visual(
      "2019-1-q19-activity-table.png",
      "작업 선택 문제의 작업 구간 표",
      "여러 작업의 시작 시간과 종료 시간이 순서쌍으로 제시된 표이다. 종료 시간이 빠른 작업을 기준으로 첫 선택 작업을 판별해야 한다.",
      2,
      1055,
      120,
    ),
  ],
};

const CLEAN_PROMPTS: Partial<Record<string, string>> = {
  "2017-1-q04": `4. 아래 시각 자료의 배낭 문제를 욕심쟁이 방법으로 해결하였을 때 배낭에 들어가지 않는 물체는 무엇인가? (단, 물체는 쪼갤 수 있다.)
① 소시지
② 빵
③ 귤
④ 생선`,
  "2017-1-q05": `5. 아래 시각 자료의 보기 중 f(n)=O(g(n))의 관계를 나타내는 것은?`,
  "2017-1-q06": `6. 아래 시각 자료의 알고리즘의 시간 복잡도를 올바르게 나타낸 것은?
① O(n)
② O(n²)
③ O(nlogn)
④ O(logn)`,
  "2017-1-q08": `8. 아래 시각 자료의 버블 정렬 단계에서 바로 다음 단계의 수행 결과를 얻기 위해 자리바꿈은 몇 번 발생하는가? (단, 오름차순으로 정렬하고 밑줄 친 부분은 이미 정렬된 부분이다.)
① 2
② 3
③ 4
④ 5`,
  "2017-1-q09": `9. 아래 시각 자료와 같은 순열을 기반으로 정렬을 수행하는 알고리즘은?
① 힙 정렬
② 계수 정렬
③ 삽입 정렬
④ 셸 정렬`,
  "2017-1-q14": `14. 아래 시각 자료는 초기 힙을 배열로 표현한 것이다. 이 배열에 대해서 힙 정렬의 두 번째 단계, 즉 최댓값 삭제와 힙의 재구성을 두 번 반복 수행한 후의 배열 상태를 올바르게 표현한 것은? (단, 오름차순으로 정렬하며, 밑줄 친 부분은 이미 정렬이 완료된 상태를 나타낸다.)
① 40 30 15 7 50 88
② 40 15 30 7 50 88
③ 40 30 7 15 50 88
④ 40 15 7 30 50 88`,
  "2017-1-q15": `15. 주어진 원소들 중에서 자신보다 작거나 같은 키값을 갖는 원소의 개수를 계산하여 정렬할 위치를 찾는 방식의 정렬 알고리즘은?
① 삽입 정렬
② 계수 정렬
③ 버킷 정렬
④ 기수 정렬`,
  "2017-1-q16": `16. 아래 시각 자료의 보기 알고리즘 중에서 제자리 정렬 알고리즘의 개수는?
① 3
② 4
③ 5
④ 6`,
  "2017-1-q17": `17. 아래 시각 자료의 보기 알고리즘 중에서 평균 성능이 O(nlogn)이면서 안정적이지 않은 정렬 알고리즘의 개수는?
① 2
② 3
③ 4
④ 5`,
  "2017-1-q18": `18. 아래 시각 자료의 보기 알고리즘 중에서 비교 기반의 정렬 알고리즘의 개수는?
① 4
② 5
③ 6
④ 7`,
  "2017-1-q21": `21. 아래 시각 자료의 이진 탐색 트리에서 루트 노드를 삭제할 경우, 삭제되는 노드의 자리에 새롭게 위치하는 노드의 값은?
① 7
② 15
③ 44
④ 88`,
  "2017-1-q23": `23. 아래 시각 자료의 2-3-4 트리를 흑적 트리로 올바르게 표현한 것은? (단, 검정색으로 채워진 노드가 적색 노드이고, 흰 바탕의 노드가 흑색 노드이다.)`,
  "2017-1-q24": `24. 아래 시각 자료의 그래프에 대해 깊이 우선 탐색을 수행하였을 때, 정점의 방문 순서에서 밑줄 친 빈칸 (b)에 들어갈 정점은?
① 2
② 4
③ 5
④ 6`,
  "2017-1-q25": `25. 아래 시각 자료의 방향 그래프에서 강연결 성분은 모두 몇 개인가?
① 1
② 2
③ 3
④ 4`,
  "2017-1-q27": `27. 아래 시각 자료의 그래프에 대해서 최소 신장 트리를 구하였을 때 이에 포함되지 않는 간선은?
① (a, b)
② (c, e)
③ (d, f)
④ (e, f)`,
  "2017-1-q28": `28. 아래 시각 자료의 그래프에 대해서 플로이드 알고리즘을 적용한 초기 상태 D⁽⁰⁾와 최종 상태 D⁽⁴⁾가 주어졌을 때, 최종 상태의 (a)~(d)값 중에서 가장 작은 값을 갖는 것은?
① (a)
② (b)
③ (c)
④ (d)`,
  "2018-1-q11": `11. 아래 시각 자료처럼 6개의 행렬을 곱한다고 하자. 연쇄 행렬 곱셈 문제에서 C(1,2)의 값은?
① 24
② 30
③ 72
④ 168`,
  "2018-1-q12": `12. 아래 시각 자료의 그래프에 대해서 모든 정점 간의 최단 경로를 구하려고 한다. d₄₂⁽³⁾의 값은?
① ∞
② 7
③ 5
④ 4`,
  "2018-1-q16": `16. 아래 시각 자료의 작업에 대한 작업 스케줄링 문제의 최적해를 구하려고 한다. 가장 먼저 기계에 할당하는 작업은?
① t₁
② t₄
③ t₅
④ t₈`,
  "2018-1-q25": `25. 아래 시각 자료는 초기 힙을 배열로 표현한 것이다. 이 배열에 대해 오름차순으로 정렬하는 힙 정렬의 두 번째 단계를 한 번 수행한 후의 배열 상태를 올바르게 표현한 것은?
① 60 70 50 40 30 20 10 80
② 70 60 50 40 20 30 10 80
③ 70 60 50 40 30 20 10 80
④ 60 70 40 20 30 50 10 90`,
  "2018-1-q28": `28. 아래 시각 자료의 이진 탐색 트리에서 노드 35를 삭제하려고 한다. 삭제되는 노드 35의 자리에 위치하는 노드는?
① 7
② 30
③ 40
④ 55`,
  "2018-1-q30": `30. 아래 시각 자료의 t=2인 B-트리에서 70을 삽입하는 과정에서 부모 노드로 보내지는 키값은 무엇인가?
① 60
② 70
③ 80
④ 90`,
  "2019-1-q11": `11. 아래 시각 자료는 입력 크기 38인 배열의 원소를 7개의 그룹(G₁~G₇)으로 구성한 모습이다. 최악 O(n)으로 i번째로 작은 원소를 찾기 위한 선택 문제에서 피벗("중간값들의 중간값")으로 선택되는 원소는?
① 27
② 36
③ 43
④ 50`,
  "2019-1-q16": `16. 아래 시각 자료의 배낭 문제를 욕심쟁이 방법으로 해결하였을 때 얻게 되는 최대 이익은? (단, 물체를 쪼갤 수 있다.)
① 35
② 38
③ 42
④ 49`,
  "2019-1-q18": `18. 아래 시각 자료의 그래프에 대한 최소 신장 트리의 가중치의 합은?
① 15
② 16
③ 17
④ 18`,
  "2019-1-q19": `19. 아래 시각 자료의 작업 선택 문제에서 기계에 가장 먼저 할당되는 작업은?
① t₁
② t₄
③ t₆
④ t₇`,
};

function makeQuestion(year: 2017 | 2018 | 2019, number: number): PastExamQuestion {
  const topic = TOPICS[TOPIC_BY_YEAR[year][number - 1]];
  const correctChoice = ANSWERS[year][number - 1] as ChoiceKey;
  const id = `${year}-1-q${String(number).padStart(2, "0")}`;
  return {
    id,
    year,
    semester: "1",
    examName: `${year}학년도 1학기 기말시험`,
    number,
    prompt: CLEAN_PROMPTS[id] ?? algorithmPastExamOcrText[id] ?? `${year}학년도 1학기 알고리즘 ${number}번`,
    images: VISUAL_CROPS[id],
    choices: (["1", "2", "3", "4"] as ChoiceKey[]).map((key) => ({
      key,
      label: CHOICE_LABELS[key],
      explanation: key === correctChoice ? { verdict: "correct", reason: `${topic.concept}의 강의 기준을 만족하는 선택지다.`, conceptBasis: topic.basis } : { verdict: "wrong", reason: topic.wrongRule, conceptBasis: topic.basis },
    })),
    correctChoice,
    lectureRefs: [{ lectureId: topic.lectureId, label: topic.lectureLabel, href: `/algorithm/lecture/${topic.lectureId}`, concept: topic.concept }],
    conceptTags: topic.tags,
    basis: topic.basis,
    wrongRule: topic.wrongRule,
    examSkill: topic.examSkill,
    sourceBasis: [{ learnerLabel: "강의 내용과 교재 개념 기준", concept: topic.concept, internalLectureSource: `알고리즘 ${topic.lectureId}강 강의록`, internalTextbookSource: topic.textbook }],
    answerSourceInternal: `${year}학년도 1학기 알고리즘 정답 ${number}번`,
    questionSourceInternal: `${year}학년도 1학기 알고리즘 기출문제 ${number}번`,
  };
}

export const algorithmPastExamQuestions: PastExamQuestion[] = ([2017, 2018, 2019] as const).flatMap((year) =>
  Array.from({ length: 35 }, (_, index) => makeQuestion(year, index + 1)),
);

export const algorithmPastExamYears = [2019, 2018, 2017] as const;
