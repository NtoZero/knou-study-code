import MLLectureLayout from "@/components/layout/MLLectureLayout";
import RegressionConcept from "@/components/ml3/RegressionConcept";
import ResidualCriterionLab from "@/components/ml3/ResidualCriterionLab";
import LinearRegressionCalculator from "@/components/ml3/LinearRegressionCalculator";
import LeastSquaresDerivation from "@/components/ml3/LeastSquaresDerivation";
import MultivariateRegression from "@/components/ml3/MultivariateRegression";
import LogisticRegressionLab from "@/components/ml3/LogisticRegressionLab";
import Lecture3Quiz from "@/components/ml3/Lecture3Quiz";

export default function MLLecture3() {
  return (
    <MLLectureLayout lectureId={3}>
      <RegressionConcept />
      <ResidualCriterionLab />
      <LinearRegressionCalculator />
      <LeastSquaresDerivation />
      <MultivariateRegression />
      <LogisticRegressionLab />
      <Lecture3Quiz />
    </MLLectureLayout>
  );
}
