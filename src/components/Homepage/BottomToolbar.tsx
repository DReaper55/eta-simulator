import { useDispatch, useSelector } from "react-redux";
import { toggleAnimation } from "../../data/redux/reducers/animationReducer";


const BottomToolbar: React.FC = () => {
  const { isPaused } = useSelector((state: any) => state.animations)
  const dispatch = useDispatch();

  const toggleAnim = () => dispatch(toggleAnimation())
    
  return (
    <div className="w-full flex justify-center items-center">
      <div className="absolute bottom-4 rounded-2xl w-[40vw] h-16 bg-gray-800 z-20 flex justify-center items-center text-white">
        <div className="flex flex-col items-center cursor-pointer" onClick={toggleAnim}>
          <span>{isPaused ? 'Play' : 'Pause'}</span>
        </div>
      </div>
    </div>
  );
};

export default BottomToolbar;
