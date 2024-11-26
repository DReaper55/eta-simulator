import BottomToolbar from "../components/Homepage/BottomToolbar";
import CanvasScene from "../components/Homepage/CanvasScene";
import HoverPopup from "../components/Homepage/HoverPopup";
import SwitchButton from "../components/Homepage/SwitchButton";

const Homepage = () => {
    return (
        <div className='fixed w-full h-full'>
            <CanvasScene />
            <HoverPopup />
            <BottomToolbar />
            <SwitchButton />
        </div>
    )
}

export default Homepage;