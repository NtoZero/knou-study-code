import MLNavigation from "@/components/layout/MLNavigation";
import GlossaryRemote from "@/components/mlShared/GlossaryRemote";

export default function MLLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MLNavigation />
      <main className="lg:ml-64">{children}</main>
      <GlossaryRemote />
    </>
  );
}
