import Link from "next/link";
import { ArrowUpRight, BookOpenCheck } from "lucide-react";
import DLLectureLayout from "@/components/layout/DLLectureLayout";
import InceptionLab from "@/components/dl9/InceptionLab";
import GoogLeNetPipeline from "@/components/dl9/GoogLeNetPipeline";
import GlobalAveragePoolingLab from "@/components/dl9/GlobalAveragePoolingLab";
import ResidualLearningLab from "@/components/dl9/ResidualLearningLab";
import LectureCheckpoints from "@/components/dlShared/LectureCheckpoints";
import Quiz from "@/components/dlShared/Quiz";
import { QUIZZES } from "@/components/dl9/quizItems";

export default function DLLecture9() {
  return (
    <DLLectureLayout lectureId={9}>
      <section className="-mt-3 rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-white p-5 dark:border-cyan-900 dark:from-cyan-950/40 dark:to-gray-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-wide text-cyan-700 dark:text-cyan-300">먼저 차근차근 익히고 싶다면</p>
            <h2 className="mt-1 text-lg font-bold">인셉션과 잔차 학습, 숫자로 따라 하기</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
              채널 축소의 연산량과 숏컷 연결의 덧셈을 작은 예제로 직접 확인하는 초급 튜토리얼
            </p>
          </div>
          <Link
            href="/dl/lecture/9/easy"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-800"
          >
            <BookOpenCheck size={16} /> 초급 튜토리얼 <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>

      <InceptionLab />
      <GoogLeNetPipeline />
      <GlobalAveragePoolingLab />
      <ResidualLearningLab />
      <LectureCheckpoints lectureId={9} accentText="text-cyan-600 dark:text-cyan-400" />
      <Quiz items={QUIZZES} />
    </DLLectureLayout>
  );
}
