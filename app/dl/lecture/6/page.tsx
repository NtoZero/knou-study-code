import DLLectureLayout from "@/components/layout/DLLectureLayout";
import ConvolutionWorkbench from "@/components/dl6/ConvolutionWorkbench";
import ChannelsShapeLab from "@/components/dl6/ChannelsShapeLab";
import PoolingFlattenFlow from "@/components/dl6/PoolingFlattenFlow";
import VisionTaskSelector from "@/components/dl6/VisionTaskSelector";
import LectureCheckpoints from "@/components/dlShared/LectureCheckpoints";
import Quiz from "@/components/dlShared/Quiz";
import { QUIZZES } from "@/components/dl6/quizItems";

export default function DLLecture6() {
  return (
    <DLLectureLayout lectureId={6}>
      <VisionTaskSelector />
      <ConvolutionWorkbench />
      <ChannelsShapeLab />
      <PoolingFlattenFlow />
      <LectureCheckpoints lectureId={6} accentText="text-cyan-500 dark:text-cyan-400" />
      <Quiz items={QUIZZES} />
    </DLLectureLayout>
  );
}
