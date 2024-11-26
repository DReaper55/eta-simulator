import { useDispatch, useSelector } from "react-redux";
import { toggleAnimation } from "../../data/redux/reducers/animationReducer";
import { ActionType } from "../../constants/actions";

const BottomToolbar: React.FC = () => {
  const { isPaused } = useSelector((state: any) => state.animations);
  const { actionMode } = useSelector((state: any) => state.world);

  const dispatch = useDispatch();

  const toggleAnim = () => dispatch(toggleAnimation());

  const addNewOrder = () => {
    toggleAnim();
    setTimeout(() => alert("Choose a Building as your pickup location"), 500);
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="absolute bottom-4 space-x-4 rounded-2xl w-[40vw] h-16 bg-gray-800 z-20 flex justify-center items-center text-white">
        {actionMode === ActionType.Explore && (
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={toggleAnim}
          >
            <span>{isPaused ? "Play" : "Pause"}</span>
          </div>
        )}
        {actionMode === ActionType.Test && (
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={addNewOrder}
          >
            <span>Add new order</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomToolbar;
