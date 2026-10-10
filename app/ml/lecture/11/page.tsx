import MLLectureLayout from "@/components/layout/MLLectureLayout";
import DeepLearningRise from "@/components/ml11/DeepLearningRise";
import LocalMinimaLab from "@/components/ml11/LocalMinimaLab";
import SlowLearningLab from "@/components/ml11/SlowLearningLab";
import ActivationSwap from "@/components/ml11/ActivationSwap";
import SpeedupTechniques from "@/components/ml11/SpeedupTechniques";
import OverfittingLab from "@/components/ml11/OverfittingLab";
import CnnOverview from "@/components/ml11/CnnOverview";
import ConvolutionLab from "@/components/ml11/ConvolutionLab";
import MultiChannelFilters from "@/components/ml11/MultiChannelFilters";
import WeightSharingLab from "@/components/ml11/WeightSharingLab";
import PoolingLab from "@/components/ml11/PoolingLab";
import LeNetLab from "@/components/ml11/LeNetLab";
import Lecture11Quiz from "@/components/ml11/Lecture11Quiz";
import LectureCheckpoints from "@/components/mlShared/LectureCheckpoints";

export default function MLLecture11() {
  return (
    <MLLectureLayout lectureId={11}>
      <DeepLearningRise />
      <LocalMinimaLab />
      <SlowLearningLab />
      <ActivationSwap />
      <SpeedupTechniques />
      <OverfittingLab />
      <CnnOverview />
      <ConvolutionLab />
      <MultiChannelFilters />
      <WeightSharingLab />
      <PoolingLab />
      <LeNetLab />
      <LectureCheckpoints lectureId={11} accentText="text-lime-600" />
      <Lecture11Quiz />
    </MLLectureLayout>
  );
}
