import DLLectureLayout from "@/components/layout/DLLectureLayout";
import LeNet5Explorer from "@/components/dl7/LeNet5Explorer";
import RbfDistanceLab from "@/components/dl7/RbfDistanceLab";
import MnistPreparationLab from "@/components/dl7/MnistPreparationLab";
import LeNetImplementationFlow from "@/components/dl7/LeNetImplementationFlow";
import LectureCheckpoints from "@/components/dlShared/LectureCheckpoints";
import Quiz from "@/components/dlShared/Quiz";
import { QUIZZES } from "@/components/dl7/quizItems";

export default function DLLecture7() {
  return (
    <DLLectureLayout lectureId={7}>
      <LeNet5Explorer />
      <RbfDistanceLab />
      <MnistPreparationLab />
      <LeNetImplementationFlow />
      <LectureCheckpoints lectureId={7} accentText="text-amber-500 dark:text-amber-400" />
      <Quiz items={QUIZZES} />
    </DLLectureLayout>
  );
}
