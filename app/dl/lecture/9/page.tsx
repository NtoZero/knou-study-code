import DLLectureLayout from "@/components/layout/DLLectureLayout";
import { ArchitectureContext, ResNetFamily, TrainingFlow } from "@/components/dl9/ArchitectureStudy";
import InceptionLab from "@/components/dl9/InceptionLab";
import GoogLeNetPipeline from "@/components/dl9/GoogLeNetPipeline";
import GlobalAveragePoolingLab from "@/components/dl9/GlobalAveragePoolingLab";
import ResidualLearningLab from "@/components/dl9/ResidualLearningLab";
import LectureCheckpoints from "@/components/dlShared/LectureCheckpoints";
import Quiz from "@/components/dlShared/Quiz";
import { QUIZZES } from "@/components/dl9/quizItems";

export default function DLLecture9() {
  return (
    <DLLectureLayout lectureId={9}>
      <ArchitectureContext />
      <InceptionLab />
      <GoogLeNetPipeline />
      <GlobalAveragePoolingLab />
      <ResidualLearningLab />
      <ResNetFamily />
      <TrainingFlow />
      <LectureCheckpoints lectureId={9} accentText="text-cyan-600 dark:text-cyan-400" />
      <Quiz items={QUIZZES} />
    </DLLectureLayout>
  );
}
