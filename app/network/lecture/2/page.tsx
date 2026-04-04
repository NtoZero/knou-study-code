import LectureLayout from "@/components/layout/LectureLayout";
import ModulationVisualizer from "@/components/lecture2/ModulationVisualizer";
import PCMProcess from "@/components/lecture2/PCMProcess";
import TransmissionModes from "@/components/lecture2/TransmissionModes";
import SyncVsAsync from "@/components/lecture2/SyncVsAsync";
import EfficiencyCalculator from "@/components/lecture2/EfficiencyCalculator";

export default function Lecture2() {
  return (
    <LectureLayout lectureId={2}>
      <ModulationVisualizer />
      <PCMProcess />
      <TransmissionModes />
      <SyncVsAsync />
      <EfficiencyCalculator />
    </LectureLayout>
  );
}
