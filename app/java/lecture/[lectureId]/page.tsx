import { notFound } from "next/navigation";
import JavaLectureLayout from "@/components/layout/JavaLectureLayout";
import JavaLectureReview from "@/components/javaShared/JavaLectureReview";
import { javaLectureData } from "@/components/javaShared/lectureData";
import { javaLectures } from "@/lib/constants";

export function generateStaticParams() {
  return javaLectures.map((lecture) => ({
    lectureId: String(lecture.id),
  }));
}

export default async function JavaLecturePage({
  params,
}: {
  params: Promise<{ lectureId: string }>;
}) {
  const { lectureId } = await params;
  const id = Number(lectureId);

  if (!javaLectureData[id]) notFound();

  return (
    <JavaLectureLayout lectureId={id}>
      <JavaLectureReview lectureId={id} />
    </JavaLectureLayout>
  );
}
