import LectureLayout from "@/components/layout/LectureLayout";
import ApplicationProtocolMap from "@/components/lecture10/ApplicationProtocolMap";
import HTTPRequestResponse from "@/components/lecture10/HTTPRequestResponse";
import HTTPSHandshake from "@/components/lecture10/HTTPSHandshake";
import FTPActivePassive from "@/components/lecture10/FTPActivePassive";
import RemoteAccessAndMail from "@/components/lecture10/RemoteAccessAndMail";
import Quiz10 from "@/components/lecture10/Quiz10";

export default function Lecture10() {
  return (
    <LectureLayout lectureId={10}>
      <ApplicationProtocolMap />
      <HTTPRequestResponse />
      <HTTPSHandshake />
      <FTPActivePassive />
      <RemoteAccessAndMail />
      <Quiz10 />
    </LectureLayout>
  );
}
