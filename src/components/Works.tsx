import PageTransition from "../components/PageTransition";
import MobileScaledCanvas from "../components/MobileScaledCanvas";
import WorkBrowser from "../components/WorkBrowser";

export default function Works() {
  return (
    <PageTransition>
      <MobileScaledCanvas className="mobile-canvas-work-browser">
        <WorkBrowser />
      </MobileScaledCanvas>
    </PageTransition>
  );
}
