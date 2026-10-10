import MLLectureLayout from "@/components/layout/MLLectureLayout";
import CvApplicationMap from "@/components/ml13/CvApplicationMap";
import TaskOutputComparator from "@/components/ml13/TaskOutputComparator";
import IlsvrcTimeline from "@/components/ml13/IlsvrcTimeline";
import AlexNetVggLab from "@/components/ml13/AlexNetVggLab";
import InceptionModuleLab from "@/components/ml13/InceptionModuleLab";
import ResidualModuleLab from "@/components/ml13/ResidualModuleLab";
import DetectionModels from "@/components/ml13/DetectionModels";
import ImageDescriptionModel from "@/components/ml13/ImageDescriptionModel";
import AutoencoderUNetLab from "@/components/ml13/AutoencoderUNetLab";
import GanLab from "@/components/ml13/GanLab";
import Lecture13Quiz from "@/components/ml13/Lecture13Quiz";
import LectureCheckpoints from "@/components/mlShared/LectureCheckpoints";

export default function MLLecture13() {
  return (
    <MLLectureLayout lectureId={13}>
      <CvApplicationMap />
      <TaskOutputComparator />
      <IlsvrcTimeline />
      <AlexNetVggLab />
      <InceptionModuleLab />
      <ResidualModuleLab />
      <DetectionModels />
      <ImageDescriptionModel />
      <AutoencoderUNetLab />
      <GanLab />
      <LectureCheckpoints lectureId={13} accentText="text-blue-600 dark:text-blue-400" />
      <Lecture13Quiz />
    </MLLectureLayout>
  );
}
