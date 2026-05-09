import SecurityNavigation from "@/components/layout/SecurityNavigation";

export default function SecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SecurityNavigation />
      <main className="lg:ml-64">{children}</main>
    </>
  );
}
