import LectureLayout from "@/components/layout/LectureLayout";
import NetworkArchitectureIntro from "@/components/lecture7/NetworkArchitectureIntro";
import OSI7LayerInteractive from "@/components/lecture7/OSI7LayerInteractive";
import LayerSeparationPrinciples from "@/components/lecture7/LayerSeparationPrinciples";
import EncapsulationAnimator from "@/components/lecture7/EncapsulationAnimator";
import TCPIPStackExplorer from "@/components/lecture7/TCPIPStackExplorer";
import IPAddressAndPort from "@/components/lecture7/IPAddressAndPort";
import Quiz7 from "@/components/lecture7/Quiz7";

export default function Lecture7() {
  return (
    <LectureLayout lectureId={7}>
      <NetworkArchitectureIntro />
      <OSI7LayerInteractive />
      <LayerSeparationPrinciples />
      <EncapsulationAnimator />
      <TCPIPStackExplorer />
      <IPAddressAndPort />
      <Quiz7 />
    </LectureLayout>
  );
}
