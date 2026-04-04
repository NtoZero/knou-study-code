import Navigation from "@/components/layout/Navigation";

export default function NetworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="lg:ml-64">{children}</main>
    </>
  );
}
