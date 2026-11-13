import DLLectureLayout from "@/components/layout/DLLectureLayout";
import MomentumNag from "@/components/dl5/MomentumNag";
import AdagradRmsprop from "@/components/dl5/AdagradRmsprop";
import AdamAssembly from "@/components/dl5/AdamAssembly";
import OptimizerPaths from "@/components/dl5/OptimizerPaths";
import OverfitAndGeneralization from "@/components/dl5/OverfitAndGeneralization";
import EarlyStopping from "@/components/dl5/EarlyStopping";
import WeightRegularization from "@/components/dl5/WeightRegularization";
import DropoutLab from "@/components/dl5/DropoutLab";
import BatchNormStages from "@/components/dl5/BatchNormStages";
import MnistPractice from "@/components/dl5/MnistPractice";
import LectureCheckpoints from "@/components/dlShared/LectureCheckpoints";
import Quiz from "@/components/dlShared/Quiz";
import { QUIZZES } from "@/components/dl5/quizItems";

export default function DLLecture5() {
  return (
    <DLLectureLayout lectureId={5}>
      <MomentumNag />
      <AdagradRmsprop />
      <AdamAssembly />
      <OptimizerPaths />
      <OverfitAndGeneralization />
      <EarlyStopping />
      <WeightRegularization />
      <DropoutLab />
      <BatchNormStages />
      <MnistPractice />
      <LectureCheckpoints lectureId={5} accentText="text-violet-500 dark:text-violet-400" />
      <Quiz items={QUIZZES} />
    </DLLectureLayout>
  );
}
