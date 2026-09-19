import MLLectureLayout from "@/components/layout/MLLectureLayout";
import DecisionTreeConcept from "@/components/ml7/DecisionTreeConcept";
import TreeLearningSteps from "@/components/ml7/TreeLearningSteps";
import GiniCalculator from "@/components/ml7/GiniCalculator";
import OtherCriteria from "@/components/ml7/OtherCriteria";
import ClassificationTree2D from "@/components/ml7/ClassificationTree2D";
import RegressionTree from "@/components/ml7/RegressionTree";
import OverfittingRemedies from "@/components/ml7/OverfittingRemedies";
import RandomForestConcept from "@/components/ml7/RandomForestConcept";
import RandomForestLab from "@/components/ml7/RandomForestLab";
import Lecture7Quiz from "@/components/ml7/Lecture7Quiz";
import LectureCheckpoints from "@/components/mlShared/LectureCheckpoints";

export default function MLLecture7() {
  return (
    <MLLectureLayout lectureId={7}>
      <DecisionTreeConcept />
      <TreeLearningSteps />
      <GiniCalculator />
      <OtherCriteria />
      <ClassificationTree2D />
      <RegressionTree />
      <OverfittingRemedies />
      <RandomForestConcept />
      <RandomForestLab />
      <LectureCheckpoints lectureId={7} accentText="text-emerald-500" />
      <Lecture7Quiz />
    </MLLectureLayout>
  );
}
