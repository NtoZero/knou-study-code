import AlgorithmNavigation from "@/components/layout/AlgorithmNavigation";

export default function AlgorithmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AlgorithmNavigation />
      <main className="lg:ml-64">{children}</main>
    </>
  );
}
