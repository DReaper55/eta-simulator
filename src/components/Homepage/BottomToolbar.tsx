import { useDispatch, useSelector } from "react-redux";
import { toggleAnimation } from "../../data/redux/reducers/animationReducer";
import { WorldMode } from "../../constants/world";
import { modifyWorld, World } from "../../data/redux/reducers/worldReducer";
import { ActionType } from "../../constants/action";
import { RootState } from "../../data/redux/store/reduxStore";

const BottomToolbar: React.FC = () => {
  const { isPaused } = useSelector((state: RootState) => state.animations);
  const { worldMode } = useSelector((state: RootState) => state.world);

  const dispatch = useDispatch();

  const actions = [
    ActionType.Order,
    ActionType.Bike,
    ActionType.Building,
    ActionType.Road,
  ];

  const toggleAnim = () => dispatch(toggleAnimation());

  const triggerAction = (action: string) => {
    switch(action){
      case ActionType.Order: return addNewOrder(); 
      case ActionType.Building: return addNewBuilding(); 
      case ActionType.Road: return addNewRoad(); 
    }
  }

  const addNewOrder = () => {
    toggleAnim();
    dispatch(modifyWorld({ actionMode: ActionType.Order } as World));
    setTimeout(() => alert("Choose a Building as your pickup location"), 300);
  };

  const addNewBuilding = () => {
    toggleAnim();
    dispatch(modifyWorld({ actionMode: ActionType.Building } as World));
    setTimeout(() => alert("Click a point on the canvas"), 300);
  };

  const addNewRoad = () => {
    toggleAnim();
    dispatch(modifyWorld({ actionMode: ActionType.Road } as World));
    setTimeout(() => alert("Choose a Building to build a road from"), 300);
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="absolute bottom-4 space-x-4 rounded-2xl w-[40vw] h-16 bg-gray-800 z-20 flex justify-center items-center text-white">
        {worldMode === WorldMode.Explore && (
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={toggleAnim}
          >
            <span>{isPaused ? "Play" : "Pause"}</span>
          </div>
        )}
        {worldMode === WorldMode.Test && (
          <div className="flex flex-row justify-around w-full">
            {actions.map((a, i) => {
              return (
                <div
                  key={i}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => triggerAction(a)}
                >
                  <span>Add {a}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomToolbar;
