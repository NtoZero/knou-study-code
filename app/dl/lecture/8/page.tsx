import DLLectureLayout from "@/components/layout/DLLectureLayout";
import LectureCheckpoints from "@/components/dlShared/LectureCheckpoints";
import Quiz from "@/components/dlShared/Quiz";
import DL8GuideLink from "@/components/dl8/DL8GuideLink";
import AlexNetArchitectureLab from "@/components/dl8/AlexNetArchitectureLab";
import LRNComparison from "@/components/dl8/LRNComparison";
import OverlappingPoolingLab from "@/components/dl8/OverlappingPoolingLab";
import AugmentationLab from "@/components/dl8/AugmentationLab";
import DropoutMaskLab from "@/components/dl8/DropoutMaskLab";
import VGGArchitectureExplorer from "@/components/dl8/VGGArchitectureExplorer";
import VGGFilterStackLab from "@/components/dl8/VGGFilterStackLab";
import ImplementationPipeline from "@/components/dl8/ImplementationPipeline";
import { QUIZZES } from "@/components/dl8/quizItems";

export default function DLLecture8() {
  return (
    <DLLectureLayout lectureId={8}>
      <DL8GuideLink />
      <AlexNetArchitectureLab />
      <LRNComparison />
      <OverlappingPoolingLab />
      <AugmentationLab />
      <DropoutMaskLab />
      <VGGArchitectureExplorer />
      <VGGFilterStackLab />
      <ImplementationPipeline />
      <LectureCheckpoints lectureId={8} accentText="text-teal-600 dark:text-teal-400" />
      <Quiz items={QUIZZES} />
    </DLLectureLayout>
  );
}
