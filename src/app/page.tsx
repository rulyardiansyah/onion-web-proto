import MainNavigation from "@/components/MainNavigation";
import DesignerProvider from "@/components/DesignerProvider";
import LeftColumn from "@/components/LeftColumn";
import CenterColumn from "@/components/CenterColumn";
import RightColumn from "@/components/RightColumn";

export default function Home() {
  return (
    <DesignerProvider>
      <div className="app-shell">
        <MainNavigation />
        <div className="main-panel">
          <LeftColumn />
          <CenterColumn />
          <RightColumn />
        </div>
      </div>
    </DesignerProvider>
  );
}
