import MLLectureLayout from "@/components/layout/MLLectureLayout";
import FeatureExtractionConcept from "@/components/ml5/FeatureExtractionConcept";
import LinearProjection from "@/components/ml5/LinearProjection";
import PCALab from "@/components/ml5/PCALab";
import PCADerivation from "@/components/ml5/PCADerivation";
import PCALimits from "@/components/ml5/PCALimits";
import LDALab from "@/components/ml5/LDALab";
import LDAProperties from "@/components/ml5/LDAProperties";
import MDSCities from "@/components/ml5/MDSCities";
import DistanceMethods from "@/components/ml5/DistanceMethods";
import DistanceTraits from "@/components/ml5/DistanceTraits";
import Lecture5Quiz from "@/components/ml5/Lecture5Quiz";
import LectureCheckpoints from "@/components/mlShared/LectureCheckpoints";

export default function MLLecture5() {
  return (
    <MLLectureLayout lectureId={5}>
      <FeatureExtractionConcept />
      <LinearProjection />
      <PCALab />
      <PCADerivation />
      <PCALimits />
      <LDALab />
      <LDAProperties />
      <MDSCities />
      <DistanceMethods />
      <DistanceTraits />
      <LectureCheckpoints lectureId={5} accentText="text-rose-500" />
      <Lecture5Quiz />
    </MLLectureLayout>
  );
}
