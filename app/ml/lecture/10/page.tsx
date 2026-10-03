import MLLectureLayout from "@/components/layout/MLLectureLayout";
import MlpRecap from "@/components/ml10/MlpRecap";
import GradientDescentLab from "@/components/ml10/GradientDescentLab";
import BackpropDerivation from "@/components/ml10/BackpropDerivation";
import BackpropStepLab from "@/components/ml10/BackpropStepLab";
import TrainingProcessFlow from "@/components/ml10/TrainingProcessFlow";
import ConvergenceLab from "@/components/ml10/ConvergenceLab";
import EarlyStoppingLab from "@/components/ml10/EarlyStoppingLab";
import LearningModes from "@/components/ml10/LearningModes";
import ModelSetting from "@/components/ml10/ModelSetting";
import ErrorFunctionLab from "@/components/ml10/ErrorFunctionLab";
import CosBoundaryExperiment from "@/components/ml10/CosBoundaryExperiment";
import DigitRecognition from "@/components/ml10/DigitRecognition";
import SaturationLab from "@/components/ml10/SaturationLab";
import MnistPerformance from "@/components/ml10/MnistPerformance";
import Lecture10Quiz from "@/components/ml10/Lecture10Quiz";
import LectureCheckpoints from "@/components/mlShared/LectureCheckpoints";

export default function MLLecture10() {
  return (
    <MLLectureLayout lectureId={10}>
      <MlpRecap />
      <GradientDescentLab />
      <BackpropDerivation />
      <BackpropStepLab />
      <TrainingProcessFlow />
      <ConvergenceLab />
      <EarlyStoppingLab />
      <LearningModes />
      <ModelSetting />
      <ErrorFunctionLab />
      <CosBoundaryExperiment />
      <DigitRecognition />
      <SaturationLab />
      <MnistPerformance />
      <LectureCheckpoints lectureId={10} accentText="text-sky-600" />
      <Lecture10Quiz />
    </MLLectureLayout>
  );
}
