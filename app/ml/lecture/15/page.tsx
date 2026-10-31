import MLLectureLayout from "@/components/layout/MLLectureLayout";
import RlOverview from "@/components/ml15/RlOverview";
import AgentEnvironmentLoop from "@/components/ml15/AgentEnvironmentLoop";
import MdpMazeLab from "@/components/ml15/MdpMazeLab";
import ValueFunctions from "@/components/ml15/ValueFunctions";
import QLearningLab from "@/components/ml15/QLearningLab";
import ExplorationLab from "@/components/ml15/ExplorationLab";
import DiscountPathLab from "@/components/ml15/DiscountPathLab";
import NonDeterministicLab from "@/components/ml15/NonDeterministicLab";
import QNetworkLab from "@/components/ml15/QNetworkLab";
import DqnArchitecture from "@/components/ml15/DqnArchitecture";
import DqnTrainingLab from "@/components/ml15/DqnTrainingLab";
import Lecture15Quiz from "@/components/ml15/Lecture15Quiz";
import LectureCheckpoints from "@/components/mlShared/LectureCheckpoints";

export default function MLLecture15() {
  return (
    <MLLectureLayout lectureId={15}>
      <RlOverview />
      <AgentEnvironmentLoop />
      <MdpMazeLab />
      <ValueFunctions />
      <QLearningLab />
      <ExplorationLab />
      <DiscountPathLab />
      <NonDeterministicLab />
      <QNetworkLab />
      <DqnArchitecture />
      <DqnTrainingLab />
      <LectureCheckpoints lectureId={15} accentText="text-cyan-600 dark:text-cyan-400" />
      <Lecture15Quiz />
    </MLLectureLayout>
  );
}
