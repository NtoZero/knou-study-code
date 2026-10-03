import MLLectureLayout from "@/components/layout/MLLectureLayout";
import NeuralNetIntro from "@/components/ml9/NeuralNetIntro";
import NeuronModel from "@/components/ml9/NeuronModel";
import ActivationFunctions from "@/components/ml9/ActivationFunctions";
import NetworkArchitecture from "@/components/ml9/NetworkArchitecture";
import LearningAndCapability from "@/components/ml9/LearningAndCapability";
import PerceptronLab from "@/components/ml9/PerceptronLab";
import XorProblem from "@/components/ml9/XorProblem";
import MlpStructure from "@/components/ml9/MlpStructure";
import MlpExpressivity from "@/components/ml9/MlpExpressivity";
import Lecture9Quiz from "@/components/ml9/Lecture9Quiz";
import LectureCheckpoints from "@/components/mlShared/LectureCheckpoints";

export default function MLLecture9() {
  return (
    <MLLectureLayout lectureId={9}>
      <NeuralNetIntro />
      <NeuronModel />
      <ActivationFunctions />
      <NetworkArchitecture />
      <LearningAndCapability />
      <PerceptronLab />
      <XorProblem />
      <MlpStructure />
      <MlpExpressivity />
      <LectureCheckpoints lectureId={9} accentText="text-fuchsia-500" />
      <Lecture9Quiz />
    </MLLectureLayout>
  );
}
