import AINavigation from "@/components/layout/AINavigation";

export default function AILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AINavigation />
      <main className="lg:ml-64">{children}</main>
    </>
  );
}
