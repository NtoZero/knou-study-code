import MLLectureLayout from "@/components/layout/MLLectureLayout";
import ClassificationOverview from "@/components/ml2/ClassificationOverview";
import BayesTheoremLab from "@/components/ml2/BayesTheoremLab";
import LikelihoodRatioBoundary from "@/components/ml2/LikelihoodRatioBoundary";
import CovarianceDecisionBoundary from "@/components/ml2/CovarianceDecisionBoundary";
import KNNSimulator from "@/components/ml2/KNNSimulator";
import BayesVsKNNCompare from "@/components/ml2/BayesVsKNNCompare";
import Lecture2Quiz from "@/components/ml2/Lecture2Quiz";

export default function MLLecture2() {
  return (
    <MLLectureLayout lectureId={2}>
      <ClassificationOverview />
      <BayesTheoremLab />
      <LikelihoodRatioBoundary />
      <CovarianceDecisionBoundary />
      <KNNSimulator />
      <BayesVsKNNCompare />
      <Lecture2Quiz />
    </MLLectureLayout>
  );
}
