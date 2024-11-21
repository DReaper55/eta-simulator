import CanvasScene from "../components/Homepage/CanvasScene";
import CityGrid from "../components/Homepage/CityGrid";
import HoverPopup from "../components/Homepage/HoverPopup";

const Homepage = () => {
    return (
        <div className='h-[100vh]'>
            {/* <CityGrid /> */}
            <CanvasScene />

            <HoverPopup />

        </div>
    )
}

export default Homepage;