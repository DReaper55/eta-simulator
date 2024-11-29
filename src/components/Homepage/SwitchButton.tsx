import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { modifyWorld, World } from "../../data/redux/reducers/worldReducer";
import { WorldMode } from "../../constants/world";

const SwitchButton: React.FC = () => {
  const dispatch = useDispatch();

  const [isExplore, setIsExplore] = useState(true);

  const toggleWorldMode = () => {
    setIsExplore(!isExplore);

    if (isExplore) {
      dispatch(modifyWorld({ worldMode: WorldMode.Test } as World));
    }

    if (!isExplore) {
      dispatch(modifyWorld({ worldMode: WorldMode.Explore } as World));
    }
  };

  return (
    <div className="flex items-center justify-start py-4 pl-4">
      <label className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={isExplore}
            onChange={toggleWorldMode}
          />
          <div className="block bg-blue-500 w-20 h-10 rounded-full"></div>
          <div
            className={`dot absolute left-1 top-1 bg-white w-8 h-8 rounded-full transition ${
              isExplore ? "transform translate-x-0" : "transform translate-x-10"
            }`}
          ></div>
        </div>
        <div className="ml-3 text-gray-700 font-medium">
          {isExplore ? "Explore" : "Test"}
        </div>
      </label>
    </div>
  );
};

export default SwitchButton;
