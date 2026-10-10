import MLLectureLayout from "@/components/layout/MLLectureLayout";
import SequentialData from "@/components/ml12/SequentialData";
import RnnStructure from "@/components/ml12/RnnStructure";
import RnnRepresentation from "@/components/ml12/RnnRepresentation";
import RnnCellLab from "@/components/ml12/RnnCellLab";
import IoStructures from "@/components/ml12/IoStructures";
import RnnExtensions from "@/components/ml12/RnnExtensions";
import BpttFlow from "@/components/ml12/BpttFlow";
import GradientChainLab from "@/components/ml12/GradientChainLab";
import LongTermDependency from "@/components/ml12/LongTermDependency";
import LstmCellLab from "@/components/ml12/LstmCellLab";
import GruCellLab from "@/components/ml12/GruCellLab";
import CellCompare from "@/components/ml12/CellCompare";
import Lecture12Quiz from "@/components/ml12/Lecture12Quiz";
import LectureCheckpoints from "@/components/mlShared/LectureCheckpoints";

export default function MLLecture12() {
  return (
    <MLLectureLayout lectureId={12}>
      <SequentialData />
      <RnnStructure />
      <RnnRepresentation />
      <RnnCellLab />
      <IoStructures />
      <RnnExtensions />
      <BpttFlow />
      <GradientChainLab />
      <LongTermDependency />
      <LstmCellLab />
      <GruCellLab />
      <CellCompare />
      <LectureCheckpoints lectureId={12} accentText="text-red-500" />
      <Lecture12Quiz />
    </MLLectureLayout>
  );
}
