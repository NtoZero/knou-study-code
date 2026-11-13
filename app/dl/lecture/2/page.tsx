import DLLectureLayout from "@/components/layout/DLLectureLayout";
import SingleLayerLimit from "@/components/dl2/SingleLayerLimit";
import XorTwoLayers from "@/components/dl2/XorTwoLayers";
import MlpStructure from "@/components/dl2/MlpStructure";
import GradientDescent from "@/components/dl2/GradientDescent";
import ChainRuleDelta from "@/components/dl2/ChainRuleDelta";
import BackpropWalkthrough from "@/components/dl2/BackpropWalkthrough";
import MomentumLab from "@/components/dl2/MomentumLab";
import IrisBinary from "@/components/dl2/IrisBinary";
import SoftmaxCrossEntropy from "@/components/dl2/SoftmaxCrossEntropy";
import LectureCheckpoints from "@/components/dlShared/LectureCheckpoints";
import Quiz from "@/components/dlShared/Quiz";
import { QUIZZES } from "@/components/dl2/quizItems";

export default function DLLecture2() {
  return (
    <DLLectureLayout lectureId={2}>
      <SingleLayerLimit />
      <XorTwoLayers />
      <MlpStructure />
      <GradientDescent />
      <ChainRuleDelta />
      <BackpropWalkthrough />
      <MomentumLab />
      <IrisBinary />
      <SoftmaxCrossEntropy />
      <LectureCheckpoints lectureId={2} accentText="text-indigo-500 dark:text-indigo-400" />
      <Quiz items={QUIZZES} />
    </DLLectureLayout>
  );
}
