import MLLectureLayout from "@/components/layout/MLLectureLayout";
import ClusteringConcept from "@/components/ml4/ClusteringConcept";
import KMeansSimulator from "@/components/ml4/KMeansSimulator";
import KMeansObjective from "@/components/ml4/KMeansObjective";
import InitializationDependence from "@/components/ml4/InitializationDependence";
import HierarchicalClustering from "@/components/ml4/HierarchicalClustering";
import LinkageComparison from "@/components/ml4/LinkageComparison";
import Lecture4Quiz from "@/components/ml4/Lecture4Quiz";

export default function MLLecture4() {
  return (
    <MLLectureLayout lectureId={4}>
      <ClusteringConcept />
      <KMeansSimulator />
      <KMeansObjective />
      <InitializationDependence />
      <HierarchicalClustering />
      <LinkageComparison />
      <Lecture4Quiz />
    </MLLectureLayout>
  );
}
