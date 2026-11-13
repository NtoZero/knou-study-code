import DLLectureLayout from "@/components/layout/DLLectureLayout";
import OptimizationConvexity from "@/components/dl4/OptimizationConvexity";
import GradientDescentStep from "@/components/dl4/GradientDescentStep";
import LearningRateLab from "@/components/dl4/LearningRateLab";
import NonconvexTraps from "@/components/dl4/NonconvexTraps";
import GdVariants from "@/components/dl4/GdVariants";
import DynamicLearningRate from "@/components/dl4/DynamicLearningRate";
import UnstableGradient from "@/components/dl4/UnstableGradient";
import Overfitting from "@/components/dl4/Overfitting";
import WeightInit from "@/components/dl4/WeightInit";
import LectureCheckpoints from "@/components/dlShared/LectureCheckpoints";
import Quiz from "@/components/dlShared/Quiz";
import { QUIZZES } from "@/components/dl4/quizItems";

export default function DLLecture4() {
  return (
    <DLLectureLayout lectureId={4}>
      <OptimizationConvexity />
      <GradientDescentStep />
      <LearningRateLab />
      <NonconvexTraps />
      <GdVariants />
      <DynamicLearningRate />
      <UnstableGradient />
      <Overfitting />
      <WeightInit />
      <LectureCheckpoints lectureId={4} accentText="text-rose-500 dark:text-rose-400" />
      <Quiz items={QUIZZES} />
    </DLLectureLayout>
  );
}
