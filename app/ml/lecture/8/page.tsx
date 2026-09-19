import MLLectureLayout from "@/components/layout/MLLectureLayout";
import LinearClassifier from "@/components/ml8/LinearClassifier";
import MaxMarginClassifier from "@/components/ml8/MaxMarginClassifier";
import SvmTraining from "@/components/ml8/SvmTraining";
import MulticlassSvm from "@/components/ml8/MulticlassSvm";
import SlackVariableLab from "@/components/ml8/SlackVariableLab";
import KernelMapping from "@/components/ml8/KernelMapping";
import KernelMethod from "@/components/ml8/KernelMethod";
import KernelSvmExperiment from "@/components/ml8/KernelSvmExperiment";
import Lecture8Quiz from "@/components/ml8/Lecture8Quiz";
import LectureCheckpoints from "@/components/mlShared/LectureCheckpoints";

export default function MLLecture8() {
  return (
    <MLLectureLayout lectureId={8}>
      <LinearClassifier />
      <MaxMarginClassifier />
      <SvmTraining />
      <MulticlassSvm />
      <SlackVariableLab />
      <KernelMapping />
      <KernelMethod />
      <KernelSvmExperiment />
      <LectureCheckpoints lectureId={8} accentText="text-indigo-500" />
      <Lecture8Quiz />
    </MLLectureLayout>
  );
}
