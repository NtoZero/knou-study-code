import JavaNavigation from "@/components/layout/JavaNavigation";

export default function JavaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JavaNavigation />
      <main className="lg:ml-64">{children}</main>
    </>
  );
}
