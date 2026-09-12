import MLLectureLayout from "@/components/layout/MLLectureLayout";
import ClassificationOverview from "@/components/ml2/ClassificationOverview";
import BayesTheoremLab from "@/components/ml2/BayesTheoremLab";
import LikelihoodRatioBoundary from "@/components/ml2/LikelihoodRatioBoundary";
import CovarianceDecisionBoundary from "@/components/ml2/CovarianceDecisionBoundary";
import KNNSimulator from "@/components/ml2/KNNSimulator";
import BayesVsKNNCompare from "@/components/ml2/BayesVsKNNCompare";
import Lecture2Quiz from "@/components/ml2/Lecture2Quiz";
import LectureCheckpoints from "@/components/mlShared/LectureCheckpoints";

export default function MLLecture2() {
  return (
    <MLLectureLayout lectureId={2}>
      <ClassificationOverview />
      <BayesTheoremLab />
      <LikelihoodRatioBoundary />
      <CovarianceDecisionBoundary />
      <KNNSimulator />
      <BayesVsKNNCompare />
      <LectureCheckpoints lectureId={2} accentText="text-violet-500" />
      <Lecture2Quiz />
    </MLLectureLayout>
  );
}
