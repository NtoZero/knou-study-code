import SoftwareNavigation from "@/components/layout/SoftwareNavigation";

export default function SoftwareLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SoftwareNavigation />
      <main className="lg:ml-64">{children}</main>
    </>
  );
}
