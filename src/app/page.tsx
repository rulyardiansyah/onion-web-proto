import MainNavigation from "@/components/MainNavigation";
import DesignerProvider from "@/components/DesignerProvider";
import LeftColumn from "@/components/LeftColumn";
import CenterColumn from "@/components/CenterColumn";
import RightColumn from "@/components/RightColumn";

export default function Home() {
  return (
    <DesignerProvider>
      {/* Main Navigation (Left Sidebar) */}
      <MainNavigation />

      {/* Main Panel (3 Columns) */}
      <div className="flex flex-1 overflow-hidden">
        <LeftColumn />
        <CenterColumn />
        <RightColumn />
      </div>
    </DesignerProvider>
  );
}
