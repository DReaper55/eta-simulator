import BottomToolbar from "../components/Homepage/BottomToolbar";
import CanvasScene from "../components/Homepage/CanvasScene";
import HoverPopup from "../components/Homepage/HoverPopup";

const Homepage = () => {
    return (
        <div className='fixed w-full h-full'>
            <CanvasScene />
            <HoverPopup />
            <BottomToolbar />
        </div>
    )
}

export default Homepage;