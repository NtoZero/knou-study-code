import DLLectureLayout from "@/components/layout/DLLectureLayout";
import NeuralNetOrigin from "@/components/dl1/NeuralNetOrigin";
import DepthAndRepresentation from "@/components/dl1/DepthAndRepresentation";
import NeuronStructure from "@/components/dl1/NeuronStructure";
import ActivationZoo from "@/components/dl1/ActivationZoo";
import FeedforwardNetwork from "@/components/dl1/FeedforwardNetwork";
import PerceptronLearning from "@/components/dl1/PerceptronLearning";
import DecisionBoundary from "@/components/dl1/DecisionBoundary";
import IrisPractice from "@/components/dl1/IrisPractice";
import GeneralizationError from "@/components/dl1/GeneralizationError";
import LectureCheckpoints from "@/components/dlShared/LectureCheckpoints";
import Quiz from "@/components/dlShared/Quiz";
import { QUIZZES } from "@/components/dl1/quizItems";

export default function DLLecture1() {
  return (
    <DLLectureLayout lectureId={1}>
      <NeuralNetOrigin />
      <DepthAndRepresentation />
      <NeuronStructure />
      <ActivationZoo />
      <FeedforwardNetwork />
      <PerceptronLearning />
      <DecisionBoundary />
      <IrisPractice />
      <GeneralizationError />
      <LectureCheckpoints lectureId={1} accentText="text-teal-500 dark:text-teal-400" />
      <Quiz items={QUIZZES} />
    </DLLectureLayout>
  );
}
