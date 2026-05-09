import SecurityLectureLayout from "@/components/layout/SecurityLectureLayout";
import EmailSecurityOverview from "@/components/security9/EmailSecurityOverview";
import PGPServiceAnimator from "@/components/security9/PGPServiceAnimator";
import PGPKeyRingExplorer from "@/components/security9/PGPKeyRingExplorer";
import SMIMEFeaturesExplorer from "@/components/security9/SMIMEFeaturesExplorer";
import Lecture9Quiz from "@/components/security9/Lecture9Quiz";

export default function Lecture9() {
  return (
    <SecurityLectureLayout lectureId={9}>
      <EmailSecurityOverview />
      <PGPServiceAnimator />
      <PGPKeyRingExplorer />
      <SMIMEFeaturesExplorer />
      <Lecture9Quiz />
    </SecurityLectureLayout>
  );
}
