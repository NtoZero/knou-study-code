import DLLectureLayout from "@/components/layout/DLLectureLayout";
import LectureCheckpoints from "@/components/dlShared/LectureCheckpoints";
import Quiz from "@/components/dlShared/Quiz";
import AutoencoderLab from "@/components/dl10/AutoencoderLab";
import ModelLab from "@/components/dl10/ModelLab";
import AdversarialLab from "@/components/dl10/AdversarialLab";
import { quizzes } from "@/components/dl10/quizItems";

export default function Lecture10() {
  return (
    <DLLectureLayout lectureId={10}>
      <AutoencoderLab />
      <ModelLab />
      <AdversarialLab />
      <LectureCheckpoints
        lectureId={10}
        accentText="text-rose-700 dark:text-rose-300"
      />
      <Quiz items={quizzes} />
    </DLLectureLayout>
  );
}
