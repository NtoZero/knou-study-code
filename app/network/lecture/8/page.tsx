import LectureLayout from "@/components/layout/LectureLayout";
import IPDatagramHeader from "@/components/lecture8/IPDatagramHeader";
import IPFragmentation from "@/components/lecture8/IPFragmentation";
import ARPRARPFlow from "@/components/lecture8/ARPRARPFlow";
import ICMPMessageExplorer from "@/components/lecture8/ICMPMessageExplorer";
import IGMPMulticast from "@/components/lecture8/IGMPMulticast";
import DHCPSimulator from "@/components/lecture8/DHCPSimulator";
import Quiz8 from "@/components/lecture8/Quiz8";

export default function Lecture8() {
  return (
    <LectureLayout lectureId={8}>
      <IPDatagramHeader />
      <IPFragmentation />
      <ARPRARPFlow />
      <ICMPMessageExplorer />
      <IGMPMulticast />
      <DHCPSimulator />
      <Quiz8 />
    </LectureLayout>
  );
}
