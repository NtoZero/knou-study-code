import Link from "next/link";
import { ArrowLeft, Layers3 } from "lucide-react";
import EasyTutorial from "@/components/dl9/EasyTutorial";

export const metadata = {
  title: "9강 따라 하기 · 인셉션과 잔차 학습",
};

export default function DLLecture9EasyPage() {
  return (
    <article className="mx-auto max-w-5xl px-4 py-8 max-sm:pl-16">
      <Link
        href="/dl/lecture/9"
        className="inline-flex items-center gap-2 text-sm font-medium text-cyan-700 hover:text-cyan-900 dark:text-cyan-300 dark:hover:text-cyan-100"
      >
        <ArrowLeft size={16} /> 9강 전체 학습으로 돌아가기
      </Link>

      <header className="mt-6 rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-sky-50 p-6 dark:border-cyan-900 dark:from-cyan-950/40 dark:via-gray-900 dark:to-sky-950/20 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
          <Layers3 size={15} /> 딥러닝 9강 · 기초부터 따라 하기
        </div>
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">인셉션과 잔차 학습을 작은 숫자로 이해하기</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600 dark:text-gray-300">
          특징 맵과 채널을 먼저 익힌 뒤, 1×1 합성곱이 연산량을 줄이는 과정을 계산합니다.
          이어서 ResNet의 숏컷이 입력과 학습 결과를 더하는 흐름을 직접 조작하고 확인합니다.
        </p>
      </header>

      <div className="mt-8">
        <EasyTutorial />
      </div>

      <div className="mt-12 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="font-bold">이제 강의 전체 구조를 확인할까요?</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
          GoogLeNet의 전체 흐름과 보조 분류기, ResNet의 구조·학습 근거, 복습 퀴즈를 이어서 볼 수 있습니다.
        </p>
        <Link
          href="/dl/lecture/9"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-800"
        >
          9강 전체 학습으로 이동 <ArrowLeft size={14} className="rotate-180" />
        </Link>
      </div>
    </article>
  );
}
