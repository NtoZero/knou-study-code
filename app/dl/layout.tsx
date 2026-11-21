import DLNavigation from "@/components/layout/DLNavigation";

export const metadata = {
  title: { default: "딥러닝 1~10강 · KNOU 인터랙티브 학습", template: "%s · KNOU 딥러닝" },
  description: "신경망의 기초에서 CNN, 오토인코더와 GAN까지 그림과 계산 실험으로 배우는 딥러닝 강의.",
};

export default function DLLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DLNavigation />
      <main className="lg:ml-64">{children}</main>
    </>
  );
}
