import SecurityLectureLayout from "@/components/layout/SecurityLectureLayout";
import EmailSecurityOverview from "@/components/security9/EmailSecurityOverview";
import PGPServiceAnimator from "@/components/security9/PGPServiceAnimator";
import PGPKeyRingExplorer from "@/components/security9/PGPKeyRingExplorer";
import SMIMEFeaturesExplorer from "@/components/security9/SMIMEFeaturesExplorer";
import SecurityExamQuiz from "@/components/securityShared/SecurityExamQuiz";

export default function Lecture9() {
  return (
    <SecurityLectureLayout lectureId={9}>
      <EmailSecurityOverview />
      <PGPServiceAnimator />
      <PGPKeyRingExplorer />
      <SMIMEFeaturesExplorer />
      <SecurityExamQuiz lectureId={9} />
    </SecurityLectureLayout>
  );
}
