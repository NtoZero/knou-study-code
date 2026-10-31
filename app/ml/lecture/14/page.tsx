import MLLectureLayout from "@/components/layout/MLLectureLayout";
import NlpApplicationMap from "@/components/ml14/NlpApplicationMap";
import TextAnalysisLab from "@/components/ml14/TextAnalysisLab";
import NlpPipeline from "@/components/ml14/NlpPipeline";
import PreprocessingLab from "@/components/ml14/PreprocessingLab";
import RepresentationLab from "@/components/ml14/RepresentationLab";
import Word2VecLab from "@/components/ml14/Word2VecLab";
import LanguageModelLab from "@/components/ml14/LanguageModelLab";
import Seq2SeqAttentionLab from "@/components/ml14/Seq2SeqAttentionLab";
import TransformerBertLab from "@/components/ml14/TransformerBertLab";
import LlmLab from "@/components/ml14/LlmLab";
import PromptRagLab from "@/components/ml14/PromptRagLab";
import Lecture14Quiz from "@/components/ml14/Lecture14Quiz";
import LectureCheckpoints from "@/components/mlShared/LectureCheckpoints";

export default function MLLecture14() {
  return (
    <MLLectureLayout lectureId={14}>
      <NlpApplicationMap />
      <TextAnalysisLab />
      <NlpPipeline />
      <PreprocessingLab />
      <RepresentationLab />
      <Word2VecLab />
      <LanguageModelLab />
      <Seq2SeqAttentionLab />
      <TransformerBertLab />
      <LlmLab />
      <PromptRagLab />
      <LectureCheckpoints lectureId={14} accentText="text-violet-600 dark:text-violet-400" />
      <Lecture14Quiz />
    </MLLectureLayout>
  );
}
