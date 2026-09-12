import MLLectureLayout from "@/components/layout/MLLectureLayout";
import AIMLDLRelation from "@/components/ml1/AIMLDLRelation";
import MLPipeline from "@/components/ml1/MLPipeline";
import DataRepresentation from "@/components/ml1/DataRepresentation";
import FeatureExtractionLab from "@/components/ml1/FeatureExtractionLab";
import ErrorAndValidation from "@/components/ml1/ErrorAndValidation";
import MLTopicsExplorer from "@/components/ml1/MLTopicsExplorer";
import LearningTypesOverfitting from "@/components/ml1/LearningTypesOverfitting";
import Lecture1Quiz from "@/components/ml1/Lecture1Quiz";

export default function MLLecture1() {
  return (
    <MLLectureLayout lectureId={1}>
      <AIMLDLRelation />
      <MLPipeline />
      <DataRepresentation />
      <FeatureExtractionLab />
      <ErrorAndValidation />
      <MLTopicsExplorer />
      <LearningTypesOverfitting />
      <Lecture1Quiz />
    </MLLectureLayout>
  );
}
