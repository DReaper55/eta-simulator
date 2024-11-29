import BottomToolbar from "../components/Homepage/BottomToolbar";
import CanvasScene from "../components/Homepage/CanvasScene";
import HoverPopup from "../components/Homepage/HoverPopup";
import SidePanel from "../components/Homepage/SidePanel";
import SwitchButton from "../components/Homepage/SwitchButton";

const Homepage = () => {
  return (
    <div className="fixed w-full h-full">
      <div className="flex">
        <div className="flex-grow p-4">
          <CanvasScene />
          <HoverPopup />
          <BottomToolbar />
          <SwitchButton />
        </div>

        <SidePanel />
      </div>
    </div>
  );
};

export default Homepage;
