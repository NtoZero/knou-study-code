import Link from "next/link";
import { dlLectures } from "@/lib/constants";
import { getDlOutline } from "@/lib/dlLectureOutline";
import { ArrowRight, BookOpen, Brain } from "lucide-react";

/** 강의록에 실제로 나오는 용어만 쓴다 */
const lectureFocus: Record<number, string[]> = {
  1: ["인공 신경망", "뉴런의 구조", "활성함수", "단층 퍼셉트론", "일반화 오류"],
  2: ["XOR 문제", "다층 퍼셉트론", "역전파", "연쇄 법칙", "모멘텀"],
  3: ["텐서플로", "실행 모드", "텐서", "자동 미분", "Keras"],
  4: ["경사 하강법", "동적 학습률", "불안정한 경사", "과적합", "Glorot·He 초기화"],
  5: ["NAG", "Adagrad·RMSProp", "Adam", "드롭아웃", "배치 정규화"],
  6: ["합성곱", "스트라이드", "패딩", "풀링"],
  7: ["LeNet-5", "특징 맵", "손글씨 인식"],
  8: ["AlexNet", "국소 반응 정규화", "오버래핑 풀링", "데이터 증강", "드롭아웃", "VGGNet과 수용 영역"],
  9: ["인셉션 모듈", "1×1 합성곱", "보조 분류기", "전역 평균 풀링", "잔차 학습", "숏컷 연결"],
  10: ["잠재 벡터", "복원 오차", "생성기", "판별기"],
};

export default function DLHome() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 max-sm:pl-16">
      <div className="mb-10 text-center">
        <div className="mb-4 flex justify-center">
          <Brain size={48} className="text-teal-500" />
        </div>
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
          2026-2학기
        </div>
        <h1 className="text-3xl font-bold">딥러닝 인터랙티브 학습</h1>
        <p className="mt-2 text-gray-500">
          1~10강의 개념을 그림으로 살펴보고, 계산과 복습 문제로 직접 확인해 보세요.
        </p>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <BookOpen size={18} className="text-gray-400" />
        <h2 className="text-lg font-bold">강의별 학습</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {dlLectures.map((lec) => {
          const focus = lectureFocus[lec.id] ?? [];
          const outline = getDlOutline(lec.id);
          return (
            <Link
              key={lec.id}
              href={`/dl/lecture/${lec.id}`}
              className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white ${lec.bgClass}`}
              >
                {lec.id}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{lec.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{lec.subtitle}</p>

              {outline && outline.objectives.length > 0 && (
                <div className="mt-3 space-y-1">
                  {outline.objectives.map((obj, i) => (
                    <div
                      key={obj}
                      className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white ${lec.bgClass}`}
                      >
                        {i + 1}
                      </span>
                      {obj}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {focus.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className={`mt-4 flex items-center gap-1 text-sm font-medium ${lec.textClass}`}>
                학습하기
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
