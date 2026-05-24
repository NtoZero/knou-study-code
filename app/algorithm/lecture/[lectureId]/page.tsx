import { notFound } from "next/navigation";
import AlgorithmLectureLayout from "@/components/layout/AlgorithmLectureLayout";
import { AlgorithmLecture } from "@/components/algorithmReview/AlgorithmLecture";
import { algorithmLectures, getAlgorithmLecture } from "@/lib/algorithmCourse";

export function generateStaticParams() {
  return algorithmLectures.map((lecture) => ({
    lectureId: String(lecture.id),
  }));
}

export default async function AlgorithmLecturePage({
  params,
}: {
  params: Promise<{ lectureId: string }>;
}) {
  const { lectureId } = await params;
  const id = Number(lectureId);
  const lecture = getAlgorithmLecture(id);

  if (!lecture) notFound();

  return (
    <AlgorithmLectureLayout lectureId={id}>
      <AlgorithmLecture lecture={lecture} />
    </AlgorithmLectureLayout>
  );
}
