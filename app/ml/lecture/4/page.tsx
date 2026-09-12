import MLLectureLayout from "@/components/layout/MLLectureLayout";
import ClusteringConcept from "@/components/ml4/ClusteringConcept";
import KMeansSimulator from "@/components/ml4/KMeansSimulator";
import KMeansObjective from "@/components/ml4/KMeansObjective";
import InitializationDependence from "@/components/ml4/InitializationDependence";
import HierarchicalClustering from "@/components/ml4/HierarchicalClustering";
import LinkageComparison from "@/components/ml4/LinkageComparison";
import Lecture4Quiz from "@/components/ml4/Lecture4Quiz";
import LectureCheckpoints from "@/components/mlShared/LectureCheckpoints";

export default function MLLecture4() {
  return (
    <MLLectureLayout lectureId={4}>
      <ClusteringConcept />
      <KMeansSimulator />
      <KMeansObjective />
      <InitializationDependence />
      <HierarchicalClustering />
      <LinkageComparison />
      <LectureCheckpoints lectureId={4} accentText="text-teal-500" />
      <Lecture4Quiz />
    </MLLectureLayout>
  );
}
