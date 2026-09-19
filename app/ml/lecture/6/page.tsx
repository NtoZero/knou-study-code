import MLLectureLayout from "@/components/layout/MLLectureLayout";
import EnsembleConcept from "@/components/ml6/EnsembleConcept";
import BootstrapSampler from "@/components/ml6/BootstrapSampler";
import VotingEffect from "@/components/ml6/VotingEffect";
import BoostingConcept from "@/components/ml6/BoostingConcept";
import AdaBoostLab from "@/components/ml6/AdaBoostLab";
import CombinationMethods from "@/components/ml6/CombinationMethods";
import Cascading from "@/components/ml6/Cascading";
import MixtureOfExperts from "@/components/ml6/MixtureOfExperts";
import EnsembleResultExample from "@/components/ml6/EnsembleResultExample";
import Lecture6Quiz from "@/components/ml6/Lecture6Quiz";
import LectureCheckpoints from "@/components/mlShared/LectureCheckpoints";

export default function MLLecture6() {
  return (
    <MLLectureLayout lectureId={6}>
      <EnsembleConcept />
      <BootstrapSampler />
      <VotingEffect />
      <BoostingConcept />
      <AdaBoostLab />
      <CombinationMethods />
      <Cascading />
      <MixtureOfExperts />
      <EnsembleResultExample />
      <LectureCheckpoints lectureId={6} accentText="text-amber-500" />
      <Lecture6Quiz />
    </MLLectureLayout>
  );
}
