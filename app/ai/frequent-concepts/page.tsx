import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpenCheck } from "lucide-react";
import AIExamPrepMap from "@/components/aiPastExam/AIExamPrepMap";
import { aiLectures } from "@/lib/constants";
import { aiPastExamQuestions } from "@/components/aiPastExam/data";

type AIFrequentConceptVisual = {
  src: string;
  alt: string;
  caption: string;
  sourceLabel: string;
  width: number;
  height: number;
};

function visual(
  file: string,
  width: number,
  height: number,
  sourceLabel: string,
  caption: string,
): AIFrequentConceptVisual {
  return {
    src: `/ai/frequent-concepts/figures/${file}`,
    alt: `${sourceLabel} 도식`,
    caption,
    sourceLabel,
    width,
    height,
  };
}

const aiConceptVisuals: Record<string, AIFrequentConceptVisual[]> = {
  "최대최소 탐색": [
    visual(
      "minimax-search-tree.png",
      680,
      300,
      "교재 4장 최대최소 탐색트리",
      "MAX와 MIN이 번갈아 선택하고 말단 평가값이 부모 노드로 올라가는 구조.",
    ),
  ],
  "알파-베타 가지치기": [
    visual(
      "alpha-beta-pruning-tree.png",
      700,
      330,
      "교재 4장 α-β 가지치기",
      "현재까지의 α, β 범위로 더 볼 필요가 없는 후계노드를 잘라 탐색량을 줄임.",
    ),
  ],
  "시맨틱 네트": [
    visual(
      "semantic-net-inheritance.png",
      720,
      410,
      "교재 5장 시맨틱 네트와 특성상속",
      "개념을 노드, 관계를 아크로 두고 isa/ako 관계를 통해 상위 특성이 하위 개념으로 전달.",
    ),
  ],
  "특성상속": [
    visual(
      "semantic-net-inheritance.png",
      720,
      410,
      "교재 5장 시맨틱 네트와 특성상속",
      "개념을 노드, 관계를 아크로 두고 isa/ako 관계를 통해 상위 특성이 하위 개념으로 전달.",
    ),
  ],
  "프레임": [
    visual(
      "frame-slot-inheritance.png",
      690,
      510,
      "교재 5장 프레임 표현",
      "프레임은 슬롯과 값을 묶어 대상 지식을 표현하고 상속 관계로 값을 공유.",
    ),
  ],
  "퍼지집합": [
    visual(
      "fuzzy-membership-representation.png",
      710,
      640,
      "교재 7장 퍼지집합 표현",
      "고전집합의 0/1 소속과 퍼지집합의 부분 소속을 소속함수 그래프로 비교.",
    ),
  ],
  "퍼지집합 연산": [
    visual(
      "fuzzy-operations-table.png",
      690,
      260,
      "교재 7장 퍼지집합 연산",
      "합집합은 max, 교집합은 min, 여집합은 1-μ로 계산하는 표준 연산을 표로 확인.",
    ),
  ],
  "거짓 양성": [
    visual(
      "inductive-learning-errors.png",
      700,
      710,
      "교재 9장 귀납적 학습 오류 유형",
      "분할 경계에 따라 거짓 양성·거짓 음성·참 양성·참 음성이 나뉘는 구조.",
    ),
  ],
  "귀납적 학습의 가설과 분할표": [
    visual(
      "inductive-learning-errors.png",
      700,
      710,
      "교재 9장 귀납적 학습 오류 유형",
      "분할 경계에 따라 거짓 양성·거짓 음성·참 양성·참 음성이 나뉘는 구조.",
    ),
  ],
  "결정트리": [
    visual(
      "decision-tree-example.png",
      680,
      760,
      "교재 9장 결정트리 예",
      "결정트리는 검사 조건을 내부 노드로 두고 가지를 따라 클래스를 판정.",
    ),
  ],
  "활성함수": [
    visual(
      "activation-functions-table.png",
      720,
      820,
      "교재 10장 활성함수 유형",
      "계단, 시그모이드, tanh, ReLU의 함수식과 출력 그래프를 함께 비교.",
    ),
  ],
  "ReLU": [
    visual(
      "activation-functions-table.png",
      720,
      820,
      "교재 10장 활성함수 유형",
      "계단, 시그모이드, tanh, ReLU의 함수식과 출력 그래프를 함께 비교.",
    ),
  ],
  "다층 퍼셉트론": [
    visual(
      "multilayer-perceptron.png",
      490,
      350,
      "교재 10장 다층 퍼셉트론",
      "입력층·은닉층·출력층으로 나뉘며 은닉층을 통해 비선형 결정경계를 학습.",
    ),
  ],
  "합성곱층": [
    visual(
      "cnn-lenet-convolution.png",
      740,
      940,
      "교재 11장 CNN 구조와 합성곱",
      "합성곱과 서브샘플링을 반복한 뒤 완전연결층으로 이어지는 LeNet-5 구조.",
    ),
  ],
  "풀링층": [
    visual(
      "pooling-layer-example.png",
      520,
      260,
      "교재 11장 최대 풀링",
      "풀링층은 작은 영역의 대표값을 취해 공간 크기를 줄이고 특징을 보존.",
    ),
  ],
};

function ConceptVisuals({ visuals }: { visuals?: AIFrequentConceptVisual[] }) {
  if (!visuals?.length) return null;

  return (
    <div className="mt-3 space-y-3">
      {visuals.map((visual) => (
        <figure
          key={visual.src}
          className="overflow-hidden rounded-lg border border-indigo-100 bg-white dark:border-indigo-900 dark:bg-gray-950"
        >
          <Image
            src={visual.src}
            alt={visual.alt}
            width={visual.width}
            height={visual.height}
            sizes="(min-width: 768px) 40vw, 92vw"
            className="h-auto w-full bg-white"
          />
          <figcaption className="border-t border-indigo-100 px-3 py-2 text-xs leading-5 text-gray-600 dark:border-indigo-900 dark:text-gray-300">
            <span className="font-bold text-gray-800 dark:text-gray-100">
              {visual.sourceLabel}
            </span>
            {" · "}
            {visual.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export default function AIFrequentConceptsPage() {
  const lectureGroups = aiLectures.map((lecture) => {
    const questions = aiPastExamQuestions.filter((question) =>
      question.lectureRefs.some((ref) => ref.lectureId === lecture.id)
    );
    const conceptCounts = Array.from(
      questions.reduce<Map<string, number>>((acc, question) => {
        const concept = question.lectureRefs.find((ref) => ref.lectureId === lecture.id)?.concept;
        if (concept) acc.set(concept, (acc.get(concept) ?? 0) + 1);
        return acc;
      }, new Map())
    ).sort((a, b) => b[1] - a[1]);

    return { lecture, questions, conceptCounts };
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <header className="mb-8 rounded-xl border border-indigo-200 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-gray-950">
        <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold text-white">
          <BookOpenCheck size={14} />
          빈출개념
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">인공지능 기출 빈출개념</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
          2017~2019 기출 105문항을 강의별 개념축으로 묶었습니다. 강의 복습 전에 반복 개념과 오답 기준을 먼저 확인합니다.
        </p>
      </header>

      <AIExamPrepMap />

      <section className="space-y-4">
        {lectureGroups
          .filter(({ questions }) => questions.length > 0)
          .map(({ lecture, questions, conceptCounts }) => (
            <article
              key={lecture.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950"
            >
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-bold text-white ${lecture.bgClass}`}>
                      {lecture.id}강
                    </span>
                    <h2 className="text-lg font-bold text-gray-950 dark:text-gray-50">
                      {lecture.title}
                    </h2>
                  </div>
                  <p className="text-sm leading-6 text-gray-500">{lecture.subtitle}</p>
                </div>
                <Link
                  href={`/ai/lecture/${lecture.id}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-900"
                >
                  강의로 이동
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {conceptCounts.map(([concept, count]) => {
                  const question = questions.find((item) =>
                    item.lectureRefs.some((ref) => ref.lectureId === lecture.id && ref.concept === concept)
                  );
                  const visuals = aiConceptVisuals[concept];
                  return (
                    <div
                      key={`${lecture.id}-${concept}`}
                      className="rounded-lg border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-900 dark:bg-indigo-950/20"
                    >
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-indigo-700 dark:bg-gray-950 dark:text-indigo-200">
                          {count}문항
                        </span>
                        <h3 className="text-sm font-bold text-gray-950 dark:text-gray-50">
                          {concept}
                        </h3>
                      </div>
                      <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                        {question?.basis}
                      </p>
                      <ConceptVisuals visuals={visuals} />
                      <p className="mt-2 text-xs leading-5 text-gray-500">
                        오답 기준: {question?.wrongRule}
                      </p>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
      </section>
    </div>
  );
}
