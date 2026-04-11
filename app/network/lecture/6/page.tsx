import LectureLayout from "@/components/layout/LectureLayout";
import OverviewDiagram from "@/components/lecture6/OverviewDiagram";
import FlowControlPrinciples from "@/components/lecture6/FlowControlPrinciples";
import CongestionCurve from "@/components/lecture6/CongestionCurve";
import CongestionControlMethods from "@/components/lecture6/CongestionControlMethods";
import RoutingTaxonomy from "@/components/lecture6/RoutingTaxonomy";
import Quiz6 from "@/components/lecture6/Quiz6";

export default function Lecture6() {
  return (
    <LectureLayout lectureId={6}>
      <OverviewDiagram />
      <FlowControlPrinciples />
      <CongestionCurve />
      <CongestionControlMethods />
      <RoutingTaxonomy />
      <Quiz6 />
    </LectureLayout>
  );
}
