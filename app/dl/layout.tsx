import DLNavigation from "@/components/layout/DLNavigation";

export default function DLLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DLNavigation />
      <main className="lg:ml-64">{children}</main>
    </>
  );
}
