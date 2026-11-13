import DLLectureLayout from "@/components/layout/DLLectureLayout";
import FrameworkOverview from "@/components/dl3/FrameworkOverview";
import ExecutionModes from "@/components/dl3/ExecutionModes";
import TensorRankShape from "@/components/dl3/TensorRankShape";
import TensorKindsOps from "@/components/dl3/TensorKindsOps";
import AutoDiffTape from "@/components/dl3/AutoDiffTape";
import LinRegTraining from "@/components/dl3/LinRegTraining";
import GraphModeFunction from "@/components/dl3/GraphModeFunction";
import KerasModelBuild from "@/components/dl3/KerasModelBuild";
import KerasTrainPredict from "@/components/dl3/KerasTrainPredict";
import LectureCheckpoints from "@/components/dlShared/LectureCheckpoints";
import Quiz from "@/components/dlShared/Quiz";
import { QUIZZES } from "@/components/dl3/quizItems";

export default function DLLecture3() {
  return (
    <DLLectureLayout lectureId={3}>
      <FrameworkOverview />
      <ExecutionModes />
      <TensorRankShape />
      <TensorKindsOps />
      <AutoDiffTape />
      <LinRegTraining />
      <GraphModeFunction />
      <KerasModelBuild />
      <KerasTrainPredict />
      <LectureCheckpoints lectureId={3} accentText="text-amber-500 dark:text-amber-400" />
      <Quiz items={QUIZZES} />
    </DLLectureLayout>
  );
}
